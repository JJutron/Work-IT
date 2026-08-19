# SANZERO 디자인 문서

## 브랜드 방향
- **모드**: Light Editorial / Compliance (공공형 신뢰 + 에디토리얼 타이포)
- **태그라인**: 정당한 보상, 처음부터.
- **마크**: 방패 안의 원(Zero)과 S 스트로크 — 산재 Zero + 보호
- **보드**: [`.anydesign-capture/sanzero-brandkit.png`](.anydesign-capture/sanzero-brandkit.png)

## 토큰
| Token | Value | Role |
|---|---|---|
| `ink` | `#191817` | 본문·CTA fill |
| `surface` | `#FDFDFD` | 페이지 배경 |
| `muted` | `#6e6a64` | 보조 텍스트 |
| `border` | `#CDD4DC` | hairline |
| `accent` | `#2563EB` | 링크·포커스 1곳 |
| `status.pending` | `#9cd5fe` | 대기 |
| `status.review` | `#f077af` | 심사 |
| `status.approved` | `#10B981` | 승인 |
| `status.action` | `#F59E0B` | 보완 요청 |

- 폰트: Pretendard
- Display: `clamp(2.5rem, 5vw, 4.5rem)` / weight 800 / tracking `-0.02em`
- CTA: 컬러 버튼 4종 금지. 홈은 ink pill 또는 텍스트 링크 `→`
- 카드: 그림자 없음, `border-border rounded-xl`

## XML 파일 목록

### 1. 공통 컴포넌트
- **@header.xml**: editorial 헤더 (마크, 네비, 인증)
- **@footer.xml**: giant CTA + 긴급연락 한 줄
- **@dashboard.xml**: 히어로 + `[01]–[04]` 그리드 + 상태 점 리스트

### 2–7. 그 외 화면
로그인·신청·분석·노무사·관리자는 기존 와이어프레임을 유지하며, 셸 토큰만 상속합니다. (후속 이슈)
