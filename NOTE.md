# 산재ON 개발 참고사항

## 🎯 **프로덕션 준비 체크리스트**

### 1. 보안 필수 확인사항
- **XSS 방어**: 모든 사용자 입력 데이터 sanitization 완료 ✅
- **CSRF 보호**: Double Submit Cookie. 로그인·가입·로그아웃 폼은 쿠키와 같은 값을 검증한다. `pytest test_login_csrf.py`
- **권한 관리**: 사용자별 데이터 격리 및 역할 기반 접근 제어 ✅
- **민감정보 보호**: 의료정보, 급여정보 암호화 저장 ✅

### 2. 데이터 무결성 검증
- **is_active 필터링**: 모든 조회 쿼리에 `.eq("is_active", True)` 적용 ✅
- **Timezone 일관성**: 모든 시간 데이터 UTC 기준 처리 ✅
- **None 값 안전 처리**: dict.get() 기본값 제공으로 템플릿 에러 방지 ✅

### 3. API 안정성 확보
- **타임아웃 처리**: 외부 API (LLM) 호출 시 30초 제한 ✅
- **에러 처리**: 사용자 친화적 에러 메시지 제공 ✅
- **비동기 처리**: AI 분석, ML 예측 등 블로킹 방지 ✅

## 🚀 **핵심 개발 패턴 (현재 적용됨)**

### 4. Supabase 통합 아키텍처
- **Service Role Key**: 모든 데이터베이스 작업은 서버 측에서만 처리 ✅
- **Anon Key**: 사용자 인증 작업 (sign_up, sign_in, sign_out) 전용 ✅
- **RPC 함수**: 복잡한 계산 로직은 PostgreSQL 함수로 구현 ✅

### 5. HTMX 모범 사례
- **동적 컨텐츠**: 페이지 새로고침 없이 실시간 업데이트 ✅
- **폼 처리**: CSRF 토큰 자동 포함, 로딩 인디케이터 표시 ✅
- **에러 처리**: 사용자 친화적 메시지, 적절한 HTTP 상태 코드 ✅

### 6. 프로덕션 운영 참고사항
- **Docker 환경**: Health check 활성화, 로그 모니터링 ✅
- **성능 최적화**: 비동기 처리, 캐싱, 데이터베이스 인덱스 ✅
- **모니터링**: APM 연동, 에러 로그 추적, 사용자 행동 분석 준비

### 장해등급·판례 산출물 재생성
- 통합 번들: `python scripts/build_integrated_bundle.py` → `app/sanzero_integrated_bundle.joblib` (문구 매칭). Stage-2 DNN(`sanzero_2stage_kproto.joblib`)은 Colab 학습 산출물이라 이 스크립트만으로는 안 만들어짐
- 법제처 산재 판례 수집: `.env`에 `LAW_OC` 넣은 뒤 `python scripts/ingest_law_precedents.py` → `python scripts/generate_embeddings.py`. 승인 전이면 `사용자 정보 검증 실패`. 키는 git에 넣지 않음
- 판례 RAG: `precedents.embedding vector(384)`, RPC `match_precedents`의 유사도는 `1 - (embedding <=> query)` 코사인. 화면은 그 값×100을 `similarity_pct`로 보여 준다. `similarity_score`(0~1)만 저장하고 템플릿이 `similarity_pct`를 보면 관련도가 0%가 된다. 해시 fallback 임베딩을 pgvector에 넣으면 코사인이 0에 가깝다. MiniLM이 안 뜨면 RPC를 쓰지 않고 텍스트 유사도로 보조한다.
- 판례 검색 임계값: MiniLM 한국어는 0.7이 너무 높아 기본 0.25. 화면 검색은 0.2.
- 계산기 CSRF: 폼 토큰은 **쿠키와 같은 값**을 써야 함. 새로 난수를 만들면 403이고, 그걸 Exception으로 삼키면 500처럼 보임
- 로그인 CSRF도 같다. 쿠키와 hidden이 어긋나면 로그인 화면에 「보안 토큰이 유효하지 않습니다.」 계산 스냅샷은 `claim_drafts` (SQL: `scripts/add_claim_drafts.sql`). 없으면 저장만 실패하고 계산 결과는 그대로 내려간다. 홈 진행은 sessionStorage로 칠하지 않는다.

### 홈 `/`가 Jinja로 보이거나 Nuxt 청크 404
- **원인**: nginx가 `location = /`·`/_nuxt/`를 Nuxt `:3000`으로 안 보냄. 예전 `sanzero-next`가 포트를 잡고 있거나 `sanzero-nuxt`가 아직 listen 전
- **확인**: `http://localhost:8000/`는 FastAPI 폴백(Jinja). 포트 80이 Nuxt 홈. HTML에 `/_nuxt/`가 있고 `/_next/`는 없어야 함
- **해결**: `docker compose down --remove-orphans` 후 `docker compose up --build -d`. 예전 `next` 서비스 컨테이너가 남아 있으면 3000을 그대로 점유한다. Docker 명령은 사용자가 실행

### localhost:3000에서 방패 GLB 404 · 홈 API가 비로그인만
- **원인**: GLB는 FastAPI `/static/models/`에만 있다. Nuxt `public`에 복사하지 않음. 예전 SSR 기본값이 `http://web:8000`이라 호스트 `nuxt dev`는 `/api/home`에 못 붙고 게스트 폴백만 씀
- **해결**: `web/nuxt.config.js` nitro `devProxy`가 `/static`·`/api` 등을 FastAPI로 넘김. SSR은 `FASTAPI_INTERNAL_URL`(로컬 `http://localhost:8000`, Docker `http://web:8000`)로 `GET /api/home` 호출. Nuxt 재시작 필요

- **증상**: 화면은 열리지만 노무사/신청/판례가 비어 있거나 로그인이 거절됨
- **원인**: 테이블만 있고 Auth 계정이 없음. `example.com`은 Supabase가 invalid email로 거절
- **해결**: `DEMO_AUTH=false`, `python scripts/create_test_users.py` (컨테이너에서). 계정은 `workit.user@ajou.ac.kr` 등. Auth 이메일 확인은 끄거나 admin `email_confirm=true`로 생성
- **주의**: `DEMO_AUTH=true`면 로그인이 항상 demo 사용자라 실제 DB FK가 깨질 수 있음

## ⚠️ **주의사항**

### Docker 빌드: tensorflow-cpu (Apple Silicon)
- **증상**: `pip install -r requirements.txt` 실패, `No matching distribution found for tensorflow-cpu`
- **원인**: `python:3.12-slim`이 Mac에서 `linux/arm64`로 빌드되고, `tensorflow-cpu`는 amd64 휠만 제공함
- **해결**: `requirements.txt`에서 amd64만 `tensorflow-cpu`, 그 외(arm64 포함)는 `tensorflow` 패키지 사용
- **재실행**: `docker compose up --build -d`

### 변수 정의 순서 (Critical)

### 변수 정의 순서 (Critical)
- **전역 변수는 파일 상단에 정의**: import 직후, 함수 정의 전에 모든 전역 변수 초기화
- **조건부 import 변수**: try/except로 서비스 가용성 확인하는 변수들은 최우선 정의
- **예시 (analysis.py)**:
  ```python
  # ✅ 올바른 순서
  try:
      from app.services.disability_prediction_service import get_disability_prediction_service
      DISABILITY_PREDICTION_AVAILABLE = True
  except ImportError:
      DISABILITY_PREDICTION_AVAILABLE = True

  # 그 다음 함수 정의
  def disability_prediction_page(...):
      return {"disability_service_available": DISABILITY_PREDICTION_AVAILABLE}  # 사용 가능
  ```
- **실제 발생한 오류**: 변수를 사용하는 함수가 변수 정의보다 먼저 정의되어 500 에러 발생
- **해결책**: 모든 전역 변수를 파일 최상단(import 직후)에 정의

### AI 서비스 관련
- **API 키 관리**: 환경변수로 안전하게 관리, 로테이션 계획 수립
- **타임아웃 설정**: 외부 API 호출 시 30초 제한, 재시도 로직
- **Fallback 시스템**: AI 서비스 장애 시 기본 기능 유지

### 개인정보 처리
- **의료정보**: 암호화 저장, 접근 로그 기록, 최소 수집 원칙
- **급여정보**: 마스킹 처리, 통계 목적 외 노출 금지
- **로깅**: 민감정보 제외, exc_info=True로 스택 트레이스 분리

### 확장성 고려사항
- **부하 분산**: Nginx 설정, FastAPI worker 수 조정
- **데이터베이스**: 인덱스 최적화, 쿼리 성능 모니터링
- **스토리지**: Supabase Storage 용량 관리, CDN 활용

---

## 📝 **향후 개선 가능 영역**

### 1. 추가 보안 강화
- 2FA (이중 인증) 도입
- 개인정보 접근 감사 로그
- 정기적인 보안 취약점 점검

### 2. 사용자 경험 개선
- 실시간 알림 시스템
- 프로그레시브 웹 앱 (PWA) 적용
- 접근성 (Accessibility) 개선

### 3. 성능 최적화
- 데이터베이스 쿼리 최적화
- 이미지 최적화 및 지연 로딩
- API 응답 캐싱 전략

## 홈 히어로 (반복 실수)
- 홈 히어로는 「내 보상금 확인하기」→계산기. 상담은 푸터와 보조 텍스트만.
- 홈 기능 스테이지는 가짜 전표가 아니라 실제 계산기·판례·신청 화면 캡처 루프다. 다시 찍을 때 `node scripts/capture_feature_stages.mjs` 후 `python3 scripts/frames_to_gif.py`. Docker는 사용자가 띄운 뒤 캡처.
- 홈 히어로 방패: 헤더와 같은 SVG 패스를 더블 헤어라인 프레임으로만 쓴다. 프레임 안 Zero+S 도장은 「혹시,」와 겹친다. 3D GLB·그리드·마크 캡션은 넣지 않는다. 카피는 프레임 안 가운데. 한글 리드는 `word-break: keep-all`로 「보상금」이 보상/금으로 쪼개지지 않게 한다. 첫 페인트에서 프레임·제목이 보이도록 stroke-draw는 숨긴 뒤가 아니라 이미 보이는 상태에서만 짧게 재생한다.
- 홈 「내 보상금, 지금 어디까지 왔나요」는 한 줄 hairline 타임라인이다. 같은 무게의 4칸 카드·원형 01–04 스텝퍼처럼 보이지 말 것. 신청 접수·지급 완료·가짜 날짜를 넣지 말 것. 현재 단계는 「지금 여기」와 점 점멸. 제출 후 현재 단계는 도장(심사 대기)이 점멸. 화면 맨 아래에 접수 대장 도해를 또 두지 말 것.
- 하단 CTA는 계산기만 두지 말고 진행 다음 단계(계산 후 장해등급, 장해 후 판례)를 같이 둔다. 홈 히어로에 두 기능을 토글로 나란히 두지 말 것. 계산과 분석은 선택지가 아니라 순서다. 히어로는 계산 시작 버튼 하나, 이어가기는 진행 현황·하단 바.
- 홈 실황 통계는 고용노동부 원문·기준연도·승인일 기준을 함께 표시한다. 2024년은 윤년이므로 142,771명÷366일은 하루 약 390명이다. `총 지급액÷수급자 수` 평균은 개인 예상 보상금처럼 단정하지 않는다.
- Framer `Reveal`은 SSR에서 화면 밖 요소에 인라인 `opacity: 0`을 남길 수 있다. `prefers-reduced-motion: reduce`에서는 `.reveal-motion`을 `opacity: 1`·`transform: none`으로 강제해 스크롤 전에도 본문이 보여야 한다.
- 외부 무료 사진은 원격 hotlink 대신 `app/static/home/`에 저장하고 촬영자·플랫폼·원본 링크를 화면에 남긴다. 사진 위 통계는 읽기 어려우므로 도입/전환 장면에만 쓰고 수치 도해는 단색 배경을 유지한다.
- 통계 도해의 단위는 보는 즉시 의미가 연결되어야 한다. `390명`을 366개 날짜 눈금으로 표현하면 연간 일수와 하루 인원이 혼동되므로, `사람 모양 1개≈10명`처럼 수치와 같은 단위로 시각화한다. 카운트업 수치는 시각 요소를 `aria-hidden`으로 둔 뒤 최종값을 `sr-only`로 별도 제공한다.
- 카운트업처럼 요소 안에 `motion.span`이 생기는 경우 `.industry-days-summary span` 같은 후손 선택자가 숫자까지 메타 크기로 덮어쓴다. 메타 레이블은 `> span`으로 직접 자식만 선택하고, 실제 브라우저 계산값을 데스크톱·모바일에서 확인한다.
- 카운트업 숫자는 보이는 값과 스크린리더 값을 형제 인라인으로 두면 `405,539405,539명`처럼 붙는다. 화면 숫자는 `aria-hidden`, 최종값은 클립된 라벨로 분리하고, `405,539명이`는 `nowrap`으로 한 덩어리로 둔다.
- 홈 카피에서 검색하는 자료는 `판례`, 각 사건의 결론은 `판결`로 구분한다. 「봅니다」「채웁니다」「애매하면」처럼 결과가 모호하거나 사용자를 가볍게 대하는 표현 대신 계산·확인·작성·상담처럼 다음 행동이 분명한 동사를 쓴다.
- 히어로 방패를 3D 모델로 띄우거나 dark panel·그리드 박스에 가두면 밤티가 난다. 헤더 마크와 같은 SVG를 증명서 프레임으로 쓰고, 캡션으로 마크를 설명하지 않는다.
- 보상 플로우는 계산 → 장해등급 예측 → 판례 검색 → 신청서. 장해등급은 장해급여 입력을 채우기 위한 2단계다. `/analysis/history`는 다시 보기이지 정거장이 아니다. 휴업급여만 보면 장해를 건너뛰고 판례로 갈 수 있다.
- `GET /compensation/calculate`는 301로 쿼리를 버리지 말 것. 예측 등급(`disability_grade`, `from_prediction`)을 유지하려면 302로 `/compensation/calculator?...`에 붙인다.
- 히어로 헤드라인은 「혹시, 못 받은 보상금 있으신가요?」태그라인 「처음부터」는 푸터·문서 제목에만. 검증되지 않은 평균 지급액·30초 완료처럼 없는 숫자를 카피에 넣지 말 것.
- 판례 화면 `POST /analysis/api/precedent/simple`은 검색만 하면 분석 내역이 비어 있다. 로그인 사용자 결과를 `analysis_requests`에 저장해야 `/analysis/history`에 남는다. `cache_hit`·`processing_time_ms` 컬럼은 라이브 최소 스키마에 없을 수 있으니 insert에 넣지 말 것. 처리 시간은 `result` JSON 안에만 둔다.
- Supabase 클라이언트는 `Prefer: return=minimal`이라 insert 성공 시 `data=[]`다. `if not response.data`로 실패 처리하면 저장이 매번 실패한 것처럼 보인다.
- 유리 판례(유리 O): Test_casePedia 근로자 유불리. 판결결과(취소·인용·승소·승인·지급 등)+5, 본문 마지막 30% 키워드×2, 전체 키워드×1. `유리점수 > 불리점수+2` 이면 유리 O, 반대면 불리 X, 아니면 애매 △. 유리도는 `유리 O 건수 / 검색 건수`. 결과 화면은 `worker_favorable`가 `유리 O`여야 KPI가 0이 아니다.

---

*최종 업데이트: 2026-08-20*
*상태: Production Ready - 모든 핵심 기능 완성*