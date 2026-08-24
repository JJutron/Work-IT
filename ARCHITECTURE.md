# SANZERO 아키텍처 문서

## 📚 관련 문서
- **@README.md**: 프로젝트 개요 및 빠른 시작
- **@CLAUDE.md**: 개발 가이드 (Claude Code용)
- **@PROGRESS.md**: 개발 진행 상황 및 마일스톤
- **@TESTPLAN.md**: 테스트 계획 및 케이스
- **@TESTDATA.md**: 테스트 계정 및 데이터
- **@NOTE.md**: 개발 시 주의사항
- **@DESIGN.md**: UI/UX 디자인 가이드

## 사용자 플로우 다이어그램
```
[일반 사용자]
├── 메인 홈 (/) — Next.js App Router. 히어로 + 진행 현황 + 산업재해 실황 + 기능 챕터 3
│   └── 내 진행 현황: 계산 → 장해등급 → 판례 → 신청서 (현재 단계 점멸)
│       히어로 CTA: 내 보상금 확인하기 → 계산기
│       공식 2024 통계 스크롤 뒤 기능 챕터. 하단 접수 대장 도해 없음
├── 산재 보상 신청/관리 (/compensation)
│   ├── 보상금 계산 (/compensation/calculator)
│   ├── 신청서 작성 (/compensation/apply)
│   └── 진행 현황 (/compensation/status) — 4단계 위치 + 제출 후 심사 배지
├── AI 분석 서비스 (/analysis)
│   ├── 장해등급 예측 (/analysis/disability) — 플로우 2단계, 장해급여 입력
│   ├── 판례 분석 (/analysis/precedent)
│   └── 분석 내역 (/analysis/history) — 다시 보기, 단계 아님
├── 노무사 서비스 (/lawyers)
│   ├── 노무사 검색/매칭
│   └── 상담 예약
└── 인증 (/auth)
    ├── 로그인/회원가입
    └── 로그아웃

[노무사]
├── 모든 일반 사용자 기능
└── 상담 관리 (/lawyers/manage)
    ├── 상담 요청 처리
    └── 클라이언트 관리

[관리자]
├── 관리자 대시보드 (/admin)
├── 사용자 관리
├── 보상금 승인/거부
└── 시스템 모니터링
```

## 시스템 구조 (하이브리드 1단계)
```
Docker Compose
├── Nginx (리버스 프록시)
│   ├── location = /  → Next :3000
│   ├── location /_next/ → Next :3000
│   ├── Static /static/models (FastAPI, GLB)
│   ├── Rate Limiting
│   └── 나머지 → FastAPI :8000
├── Next.js (`web/`) — 홈 `/`만
│   └── SSR 시 쿠키를 FastAPI GET /api/home 으로 전달
└── SANZERO FastAPI 애플리케이션
    ├── GET /api/home JSON (user, claim_progress)
    ├── GET / Jinja 폴백 (nginx가 Next로 보낸 뒤 :8000으로만 도달)
    ├── SSR 템플릿 (Jinja2) — 계산기·판례·신청·로그인
    ├── HTMX 페이지 갱신
    ├── REST API 엔드포인트
    ├── 인증/인가 (Supabase Auth)
    ├── 산재 보상 모듈
    │   ├── 신청서 작성/관리
    │   ├── 보상금 계산
    │   └── 신청 현황 추적
    ├── AI 분석 모듈
    │   ├── 장해등급 예측 (플로우 2단계)
    │   └── 판례 분석
    ├── 노무사 서비스 모듈
    │   ├── 노무사 검색/매칭
    │   └── 상담 예약 관리
    ├── 사용자 관리 모듈
    │   ├── 인증/인가
    │   └── 프로필 관리
    ├── 알림 모듈
    │   └── 시스템 알림
    └── 관리자 모듈
        ├── 사용자 관리
        └── 시스템 모니터링

Supabase (통합 백엔드)
├── Database (PostgreSQL)
│   ├── 사용자 데이터
│   ├── 보상금 신청 데이터
│   ├── 노무사 정보
│   ├── 상담 데이터
│   └── 알림 데이터
├── Storage
│   ├── 첨부 서류
│   └── 프로필 이미지
├── Auth
│   ├── JWT 토큰 관리
│   └── 사용자 인증
└── Realtime
    └── 실시간 알림

External Services (필요시)
└── LLM API
    └── AI 분석 처리
```

## 프로젝트 디렉토리 구조
```
sanzero-platform/
├── app/
│   ├── main.py
│   ├── routers/
│   │   ├── compensation.py          # 산재 보상 신청/관리
│   │   ├── analysis.py              # AI 분석 (판례 + 장해등급)
│   │   ├── lawyers.py               # 노무사 서비스
│   │   ├── auth.py                  # 인증/인가
│   │   └── admin.py                 # 관리자
│   ├── models/
│   │   ├── schemas.py        # Pydantic 스키마
│   │   └── database.py       # DB 모델
│   ├── services/
│   │   ├── compensation_service.py  # 보상금 신청/계산/관리
│   │   ├── analysis_service.py      # 판례 분석 + 장해등급 예측
│   │   ├── lawyer_service.py        # 노무사 검색/매칭/예약
│   │   ├── user_service.py          # 사용자 관리
│   │   └── admin_service.py         # 관리자 기능
│   ├── templates/            # Jinja2 템플릿
│   │   ├── base.html
│   │   ├── components/
│   │   │   ├── header.html
│   │   │   └── footer.html
│   │   └── pages/
│   │       ├── dashboard.html
│   │       ├── compensation/           # 보상금 관리 페이지들
│   │       ├── analysis/               # AI 분석 페이지들
│   │       ├── lawyers/                # 노무사 서비스 페이지들
│   │       ├── auth/                   # 인증 페이지들
│   │       └── admin/                  # 관리자 페이지들
│   ├── static/              # 정적 파일
│   │   ├── css/
│   │   ├── js/
│   │   ├── images/
│   │   └── models/          # 방패 GLB 보관(홈 히어로는 SVG 프레임)
│   └── utils/
│       ├── security.py
│       ├── helpers.py
│       └── config.py
├── web/                  # Next.js 홈 (App Router)
│   ├── app/page.tsx
│   └── components/home/  # Hero, ClaimProgress, IndustryReality, FeatureChapters, HomeCtaBar
├── docker-compose.yml
├── Dockerfile
├── requirements.txt
└── .env
```

## URL 라우팅 체계 (단순화)
```
/ - Next.js 홈 (히어로 + 진행 현황 + 산업재해 실황 + 기능 챕터). Jinja GET / 는 :8000 폴백
GET /api/home - 홈 SSR JSON. user(null|{username,user_type}), claim_progress. 이메일·id 없음. 브라우저에 Supabase 키 없음

# 산재 보상 서비스
/compensation - 보상금 신청/관리 메인
/compensation/apply - 신청서 작성
/compensation/status - 보상 진행 현황 (계산→장해등급→판례→신청 + 제출 후 심사)
/compensation/calculate - 보상금 계산

# AI 분석 서비스
/analysis - 메인 대시보드로 리다이렉트 (301)
/analysis/precedent - 판례 분석
/analysis/disability - AI 장해등급 예측 (플로우 2단계. 장해급여 계산 입력)
/analysis/history - 분석 내역

# 노무사 서비스
/lawyers - 노무사 서비스 메인
/lawyers/search - 노무사 검색/매칭
/lawyers/booking - 상담 예약
/lawyers/{id} - 노무사 상세 정보

# 인증 및 사용자 관리
/auth/login - 로그인
/auth/signup - 회원가입
/auth/profile - 프로필 관리
/auth/logout - 로그아웃

# 관리자
/admin - 관리자 대시보드
/admin/users - 사용자 관리
/admin/applications - 보상금 승인/거부
/admin/lawyers - 노무사 관리
```

## UI 디자인 (wireframes/)
### 공통 컴포넌트
- **@header.xml**: 공통 헤더 (네비게이션, 사용자 메뉴)
- **@footer.xml**: 공통 푸터

### 메인 대시보드
- **@dashboard.xml**: 히어로 + 진행 현황 + 산업재해 실황 스크롤 + 기능 챕터 3 (하단 접수 대장 도해 없음)

### 산재 보상 서비스
- **@compensation-apply.xml**: 보상금 신청 페이지
- **@compensation-status.xml**: 보상 진행 현황. 01–04 연결 스텝퍼 + 지금 할 일/심사 배너 + 신청서 목록.
- **@compensation-calculate.xml**: 보상금 계산 페이지

### AI 분석 서비스
- **@analysis-main.xml**: AI 분석 메인 페이지
- **@analysis-precedent.xml**: 판례 분석 페이지
- **@analysis-disability.xml**: AI 장해등급 예측 페이지 (플로우 2단계)

### 노무사 서비스
- **@lawyers-search.xml**: 노무사 검색/매칭 페이지
- **@lawyers-profile.xml**: 노무사 프로필 페이지
- **@lawyers-booking.xml**: 상담 예약 페이지

### 인증 및 사용자 관리
- **@auth-login.xml**: 로그인 페이지
- **@auth-signup.xml**: 회원가입 페이지
- **@auth-profile.xml**: 프로필 관리 페이지

### 관리자
- **@admin-dashboard.xml**: 관리자 대시보드
- **@admin-users.xml**: 사용자 관리 페이지
- **@admin-applications.xml**: 보상금 승인/거부 페이지

## 💾 **데이터베이스 스키마**

### 핵심 테이블 구조
- **users**: 사용자 프로필 (user_type: general/lawyer/admin)
- **lawyers**: 노무사 정보 (면허, 전문분야, 성과 지표)
- **compensation_applications**: 보상금 신청 (사고정보, AI 분석 결과)
- **consultations**: 상담 관리 (예약, 상태, 매칭 정보)
- **precedents**: 판례 데이터 (`embedding vector(384)`, `match_precedents` RPC, 유사도 = `1 - (embedding <=> query)` 코사인. 화면은 ×100% )
- **analysis_requests**: AI 분석 요청 (판례 검색, 장해등급 예측)
- **notifications**: 알림 시스템 (타입별 발송 관리)

### 주요 관계
```
auth.users (Supabase Auth)
├── users (프로필 확장)
├── lawyers (노무사 전용)
├── compensation_applications (보상금 신청)
├── consultations (상담 예약)
└── analysis_requests (AI 분석)
```

### 핵심 특징
- **JSONB 활용**: 의료기록, 급여정보, AI 분석 결과
- **벡터 검색**: pgvector 확장으로 판례 유사도 검색
- **RPC 함수**: 복잡한 계산 로직 (보상금, 매칭 알고리즘)
## 🚀 **기술 스택**

_상세한 기술 스택 정보는 @CLAUDE.md 참조_

### 배포 및 운영
- **컨테이너**: Docker + Docker Compose
- **웹 서버**: Nginx (리버스 프록시, Rate Limiting)
- **모니터링**: Health check, 로그 관리
- **자동화**: 스케줄링, 데이터 수집

## 📡 **API 설계**

### 핵심 엔드포인트
- **인증**: `/auth/*` (로그인, 회원가입, 프로필)
- **보상금**: `/compensation/*` (계산, 신청, 관리)
- **노무사**: `/lawyers/*` (검색, 예약, 상담)
- **AI 분석**: `/analysis/*` (판례, 장해등급 예측). `POST /analysis/api/precedent/simple`은 RAG 검색 후 로그인 사용자면 `analysis_requests`에 저장하고 `saved`/`request_id`를 반환. 유리 판례는 Test_casePedia 근로자 유불리(유리 O/불리 X/애매 △).
- **관리자**: `/admin/*` (승인, 사용자 관리)

### API 특징
- **RESTful 설계**: 표준 HTTP 메서드 활용
- **HTMX 통합**: 폼 제출, 동적 컨텐츠 업데이트
- **보안**: CSRF 토큰, 권한 기반 접근 제어
- **에러 처리**: 사용자 친화적 메시지

## 🔒 **보안 아키텍처**

### 데이터 보호
- **암호화**: 민감정보 (의료기록, 급여정보)
- **마스킹**: 개인식별정보 표시 제한
- **접근 제어**: 사용자별 데이터 격리

### 웹 보안
- **XSS 방어**: 모든 입력 데이터 sanitization
- **CSRF 보호**: Double Submit Cookie 패턴
- **보안 헤더**: CSP, X-Frame-Options 등

### 운영 보안
- **환경변수**: API 키, 데이터베이스 인증 정보
- **로깅**: 민감정보 제외, 감사 추적
- **모니터링**: 비정상 접근 패턴 탐지
## 🚀 **배포 아키텍처**

### Docker 구성
```yaml
# docker-compose.yml
services:
  web:
    build: .
    ports: ["8000:8000"]
  next:
    build: ./web
    ports: ["3000:3000"]
    environment:
      - FASTAPI_INTERNAL_URL=http://web:8000
  nginx:
    image: nginx:alpine
    ports: ["80:80"]
    depends_on: [web, next]
```

### 핵심 설정
- **포트**: Nginx 80 → `/`·`/_next/`는 Next 3000, 나머지는 FastAPI 8000
- **Rate Limiting**: Nginx 레벨
- **Health Check**: FastAPI `/health` 엔드포인트
- **환경변수**: `.env` 파일 기반 관리. Next는 `FASTAPI_INTERNAL_URL`만 사용.

### 프로덕션 준비
- **보안 헤더**: CSP, X-Frame-Options 적용
- **로그 관리**: 구조화된 JSON 로그
- **모니터링**: 응답 시간, 에러율 추적
- **백업**: Supabase 자동 백업 활용

---

## 📈 **성능 및 확장성**

### 현재 성능 지표
- **응답 시간**: 평균 < 200ms (AI 분석 제외)
- **동시 사용자**: 100+ 사용자 지원
- **데이터 처리**: 1,000+ 판례, 자동 벡터 검색
- **가용성**: 99.9% 업타임 목표

### 확장 전략
- **수평 확장**: Docker 컨테이너 복제
- **데이터베이스**: Supabase 자동 스케일링
- **CDN**: 정적 파일 글로벌 배포
- **캐싱**: Redis 클러스터 도입

---

*최종 업데이트: 2025-11-05*
*상태: Production Ready*
