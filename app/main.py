"""
산재ON - 산업재해 보상 웹 서비스
메인 FastAPI 애플리케이션
"""

from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
import os
from pathlib import Path
import mimetypes

mimetypes.add_type("model/gltf-binary", ".glb")
mimetypes.add_type("image/vnd.radiance", ".hdr")

# 라우터 임포트
from app.routers import auth

# 환경변수 로드
from dotenv import load_dotenv
load_dotenv()

# 로깅 시스템 초기화
from app.utils.logging_config import setup_logging
setup_logging(level=os.getenv("LOG_LEVEL", "INFO"))

# FastAPI 앱 인스턴스 생성
app = FastAPI(
    title="산재ON",
    description="산업재해 보상 웹 서비스",
    version="1.0.0",
    docs_url="/docs" if os.getenv("ENVIRONMENT") == "development" else None,
    redoc_url="/redoc" if os.getenv("ENVIRONMENT") == "development" else None
)

# 정적 파일 및 템플릿 설정
app.mount("/static", StaticFiles(directory="app/static"), name="static")
templates = Jinja2Templates(directory="app/templates")

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """HTML 요청의 로그인 필요(303)는 로그인 페이지로 보낸다."""
    location = (exc.headers or {}).get("Location")
    if exc.status_code in (302, 303) and location:
        return RedirectResponse(url=location, status_code=303)
    from fastapi.responses import JSONResponse
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})

# 미들웨어 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost",
        "http://localhost:8000",
        "http://localhost:80",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# CSRF 보호 미들웨어 추가
from app.utils.security import security, set_csrf_cookie

@app.middleware("http")
async def csrf_token_middleware(request: Request, call_next):
    """CSRF 토큰 자동 설정 미들웨어"""
    # 기존 CSRF 토큰 확인
    existing_token = request.cookies.get("csrf_token")

    # 요청 처리
    response = await call_next(request)

    # HTML 응답이고 CSRF 토큰이 없는 경우에만 새 토큰 생성
    content_type = response.headers.get("content-type", "")
    if "text/html" in content_type and not existing_token:
        csrf_token = security.generate_csrf_token()
        set_csrf_cookie(response, csrf_token)
        # 생성된 토큰을 응답 헤더에도 추가 (디버깅용)
        response.headers["X-CSRF-Token"] = csrf_token

    return response

# TrustedHostMiddleware - 프로덕션 환경에서는 실제 도메인으로 제한
if os.getenv("ENVIRONMENT") == "production":
    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=["*"]  # 테스트를 위해 모든 호스트 허용, 프로덕션에서는 실제 도메인으로 변경
    )

# 라우터 등록
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])

# 관리자 라우터 제거됨 (testuser 계정 사용으로 불필요)

# 노무사 서비스 라우터
from app.routers import lawyers
app.include_router(lawyers.router, prefix="/lawyers", tags=["Lawyers"])

# 보상금 서비스 라우터
from app.routers import compensation
app.include_router(compensation.router, prefix="/compensation", tags=["Compensation"])

# AI 분석 서비스 라우터 (Phase 2) - 의존성이 설치된 경우에만 활성화
try:
    from app.routers import analysis
    app.include_router(analysis.router, prefix="/analysis", tags=["AI Analysis"])
    print("✅ AI 분석 서비스가 활성화되었습니다.")
except ImportError as e:
    print(f"⚠️  AI 분석 서비스를 비활성화했습니다: {e}")



# 메인 페이지 라우트
@app.get("/")
async def root(request: Request):
    """메인 대시보드. nginx가 `/`를 Next로 보낸 뒤의 Jinja 폴백."""
    from app.utils.security import get_current_user

    current_user = await get_current_user(request)
    from app.services.claim_progress import get_claim_progress_for_user

    user_id = None
    if current_user:
        user_id = current_user.get("user_id") or current_user.get("id")

    claim_progress = await get_claim_progress_for_user(user_id)

    return templates.TemplateResponse(
        "pages/dashboard.html",
        {
            "request": request,
            "title": "산재ON - 산업재해 보상 서비스",
            "current_user": current_user,
            "claim_progress": claim_progress,
        }
    )


@app.get("/api/home")
async def home_api(request: Request):
    """Nuxt 홈 SSR용 JSON. 브라우저에 Supabase 키를 내리지 않는다."""
    from fastapi.encoders import jsonable_encoder
    from fastapi.responses import JSONResponse
    from app.utils.security import get_current_user
    from app.services.claim_progress import (
        build_home_payload,
        get_claim_progress_for_user,
    )

    current_user = await get_current_user(request)
    user_id = None
    if current_user:
        user_id = current_user.get("user_id") or current_user.get("id")
    claim_progress = await get_claim_progress_for_user(user_id)
    payload = build_home_payload(current_user, claim_progress)
    return JSONResponse(content=jsonable_encoder(payload))

# 헬스 체크 엔드포인트
@app.get("/health")
async def health_check():
    """시스템 상태 확인"""
    return {"status": "healthy", "service": "sanzero"}

# 애플리케이션 시작 이벤트
@app.on_event("startup")
async def startup_event():
    """앱 시작 시 초기화 작업"""
    print("🚀 산재ON 서비스가 시작되었습니다.")
    print("📊 대시보드: http://localhost:8000")

    # 데이터베이스 연결 테스트 (Docker 환경에서는 401 에러 발생하므로 건너뜀)
    # REST API는 호스트에서는 작동하지만 Docker 컨테이너 내부에서는 Supabase 제한으로 401 발생
    print("ℹ️  데이터베이스 연결 테스트 생략 (Docker 네트워크 제한)")

    # analysis_requests 테이블 자동 생성
    try:
        from app.utils.database import create_analysis_requests_table
        await create_analysis_requests_table()
        print("✅ analysis_requests 테이블 설정 완료")
    except Exception as e:
        print(f"⚠️  analysis_requests 테이블 설정 실패: {e}")

    print("🎯 테스트 계정:")
    print("   관리자: byoneself4023@ajou.ac.kr / rlarlduf0")
    print("   일반사용자: testuser@example.com / test123456!")
    print("   노무사: lawyer@example.com / lawyer123456!")

# 애플리케이션 종료 이벤트
@app.on_event("shutdown")
async def shutdown_event():
    """앱 종료 시 정리 작업"""

    print("🛑 산재ON 서비스가 종료되었습니다.")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )