# WORKIT
**산재 보상 신청부터 AI 판례·장해등급·노무사 매칭까지**

FastAPI Python Jinja2 HTMX Tailwind CSS Supabase pgvector

🔗 [서비스 바로가기](http://localhost) · 📑 [API 문서](http://localhost:8000/docs) · 🐛 [이슈](https://github.com/JJutron/Work-IT/issues)


## 프로젝트 소개
WORKIT은 산업재해 보상 신청, 유사 판례 분석, 장해등급 예측, 노무사 상담을 하나의 웹 흐름으로 연결하는 AI 기반 서비스입니다.

기존의 산재 대응 과정은 근로자가 보상금 기준을 직접 계산하기 어렵고, 유사 판례와 장해등급, 전문가 상담을 각각 따로 찾아야 한다는 문제가 있습니다. WORKIT은 계산부터 신청, AI 분석, 노무사 매칭까지 서버 사이드 웹 서비스로 묶어 이 문제를 해결하고자 했습니다.

문제 | 해결
--- | ---
보상금 산정 기준을 알기 어려움 | 2025년 기준 보상금 계산기 제공
유사 판례를 직접 찾기 어려움 | SBERT와 pgvector를 결합한 RAG 검색 제공
장해등급 판단이 불명확함 | 정확 문구 매칭, BERT 유사도, DNN을 잇는 3단계 예측 제공
노무사 탐색이 번거로움 | 전문분야·지역 검색과 상담 예약까지 한 화면에서 연결

이 저장소는 FastAPI SSR 프론트엔드(Jinja2, HTMX)와 보상·분석·노무사 API를 함께 관리합니다. 인증·데이터베이스·파일 저장은 Supabase를 **서버 측에서만** 호출하며, 브라우저에는 Supabase JS SDK와 키를 포함하지 않습니다.


## 핵심 기능
### 1. 회원가입 및 로그인
이메일과 비밀번호로 가입·로그인할 수 있습니다. 세션 쿠키와 CSRF 토큰으로 보호된 API를 사용하며, 일반 사용자·노무사·관리자 권한에 따라 접근 범위가 달라집니다.

### 2. 산재 보상 신청 및 현황 관리
사고 정보, 의료 기록, 고용·급여 정보를 바탕으로 보상 신청서를 작성하고, 현황 조회·수정·삭제를 할 수 있습니다. 신청 상태는 서버에서 추적합니다.

### 3. 보상금 계산
요양·휴업·장해 등 주요 보상 유형을 2025년 기준으로 계산합니다. 신청 전에 예상 금액을 확인하고 신청 흐름으로 이어갈 수 있습니다.

### 4. AI 판례 분석
사안 설명을 입력하면 유사 판례를 검색하고, 요약·리포트 생성을 지원합니다. SBERT 임베딩과 Supabase pgvector를 사용해 관련 판례를 찾아 LLM 분석으로 연결합니다.

### 5. 장해등급 예측
상병 문구와 입력값을 바탕으로 장해등급을 예측합니다. 정확 문구 매칭, BERT 유사도, TensorFlow DNN을 순서대로 적용하는 v3 통합 파이프라인을 `/analysis/api/predict-grade`에서 제공합니다.

### 6. 노무사 검색·매칭·상담 예약
전문분야, 지역, 경력 등으로 노무사를 검색하고 상담을 예약할 수 있습니다. 신청 건과 연계한 매칭 추천도 지원합니다.

### 7. 대시보드와 프로필
로그인 후 대시보드에서 보상, 분석, 노무사 서비스로 바로 이동합니다. 마이페이지에서 프로필을 관리하고, 관리자는 사용자 상태를 변경할 수 있습니다.


## 주요 화면
보상 신청 및 계산

보상금 계산	산재 보상 신청
보상금 계산 화면	산재 보상 신청 화면

분석 및 전문가 연계

AI 판례 분석	장해등급 예측	노무사 검색
AI 판례 분석 화면	장해등급 예측 화면	노무사 검색 화면

> UI 재작성 예정이므로 스크린샷은 아직 넣지 않았습니다. 화면 구조는 `wireframes/`를 참고하세요.


## 서비스 흐름
```
회원가입·로그인
      ↓
대시보드
      ↓
보상금 계산 / 신청
  또는  판례·장해등급 분석
  또는  노무사 검색·예약
      ↓
Supabase 영속화 · LLM / 임베딩 / 예측 모델
```


## 기술적으로 신경 쓴 부분
- 브라우저에 Supabase JS SDK·키를 두지 않고 FastAPI에서만 호출
- CSRF Double Submit Cookie, XSS(bleach), CSP 등 보안 헤더
- 장해등급 v3: 정확 문구 매칭 → BERT 유사도 → DNN 예측
- 판례 RAG: SBERT 임베딩 + pgvector 유사도 검색
- Nginx 리버스 프록시, Rate Limiting, Docker Compose 구성


## 기술 스택

**Frontend (SSR)**

Jinja2 · Tailwind CSS 3.4 · HTMX

**Backend**

Python 3.13 · FastAPI · uvicorn

**Data**

Supabase Auth · PostgreSQL · Storage · pgvector

**AI**

SBERT · OpenAI / Anthropic · TensorFlow DNN 장해등급 예측

**Infrastructure**

Docker Compose · Nginx


## 폴더 구조
```
WORKIT/
├── app/
│   ├── main.py                 # FastAPI 진입점
│   ├── routers/                # auth, compensation, analysis, lawyers, admin
│   ├── services/               # 보상금 계산, 판례 검색, 장해등급, 노무사
│   ├── models/                 # Pydantic 스키마
│   ├── templates/              # Jinja2 페이지
│   ├── static/                 # CSS·JS
│   ├── ml_models/              # 장해등급 예측 데이터
│   └── utils/                  # 보안, DB, 설정
├── wireframes/                 # 화면 XML 와이어프레임
├── scripts/
├── docker-compose.yml
├── Dockerfile
├── nginx.conf
└── requirements.txt
```


## Getting Started

### 사전 요구 사항
- Docker, Docker Compose
- (선택) Python 3.13 — 로컬에서 `uvicorn`을 직접 실행할 때

### 1. 저장소 복제
```bash
git clone https://github.com/JJutron/Work-IT.git
cd WORKIT
```

### 2. 환경 변수 설정
```bash
cp .env.example .env
```

`.env`에 Supabase URL·키, 세션 시크릿, OpenAI/Anthropic API 키를 넣습니다. 민감한 값은 저장소에 커밋하지 마세요.

### 3. 실행
```bash
docker compose up --build -d
```

- 서비스: [http://localhost](http://localhost) (Nginx)
- FastAPI 직접 접속: [http://localhost:8000](http://localhost:8000)
- API 문서: [http://localhost:8000/docs](http://localhost:8000/docs) (`ENVIRONMENT=development`일 때)

헬스 체크: `GET /health`


## 주요 API

Method | Endpoint | 설명 | 인증
--- | --- | --- | ---
POST | `/auth/api/login` | 로그인 | -
POST | `/compensation/apply` | 보상 신청 | 세션
POST | `/compensation/calculate` | 보상금 계산 | 세션
POST | `/analysis/api/precedent/search` | 판례 검색 | 세션
POST | `/analysis/api/predict-grade` | 장해등급 예측 | 세션
GET | `/lawyers/api/search` | 노무사 검색 | 세션

요청과 응답 상세는 개발 환경 API 문서와 [ARCHITECTURE.md](ARCHITECTURE.md)를 참고하세요.


## Team
SKALA / AI 융합 캡스톤 디자인 프로젝트 저장소입니다.

김형주 — 서비스 기획 및 구현


## License
이 저장소는 교육·캡스톤 디자인 프로젝트를 위해 제작되었습니다.
