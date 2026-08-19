# Step 3 — SANZERO 적용 분석 (Work Louder 톤 × WORKIT)

> 현재 SANZERO: shadcn/tx 스타일, Tailwind gray/primary-600 팔레트, 카드 기반 대시보드
> 목표: Codex Micro 에디토리얼 톤을 **공공 서비스 신뢰감**과 조화시켜 랜딩·대시보드 리디자인

---

## 1. 현재 vs 목표 비교

| 차원 | 현재 SANZERO (`@dashboard.xml`) | Work Louder 레퍼런스 | SANZERO 적용 방향 |
|---|---|---|---|
| 배경 | `bg-white` + gray cards | `#FDFDFD` 단색, 카드 없음 | surface 단일화, 카드 → hairline border |
| 타이포 | `text-3xl font-bold` | `clamp(4rem→7rem)` black 900 | 히어로만 display-xl, 나머지는 절제 |
| 색상 | primary-600, purple-600, green-600 | black + 1 accent wash | **단일 accent** (신뢰 블루 `#2563EB` 또는 teal) |
| CTA | `bg-primary-600` 컬러 버튼 4개 | gray pill "품절" | primary는 1개만, 나머지 ghost |
| 레이아웃 | 4-col action cards | 섹션형 스크롤 narrative | 랜딩: narrative / 앱: 기능 카드 유지 |
| 밀도 | balanced-dense | sparse editorial | 랜딩 sparse, 대시보드 moderate |
| 이미지 | icon + card | 3D product hero | 일러스트/추상 그래픽 hero |
| 섹션 마커 | 없음 | `[01]` mono | "01 보상금 신청" 형식 도입 |
| 푸터 | 표준 링크 | giant CTA text | "지금 신청하기 →" 대형 링크 |

---

## 2. 차용할 패턴 (Do adopt)

### A. 랜딩 히어로 (비로그인 `/`)
```
[SANZERO]                    ← 작은 mono eyebrow
산재 보상,                    ← display-xl ink #191817
이제 AI가 함께합니다           ← display-xl, 두 번째 줄
[추상 3D: 방패+문서 일러스트]   ← product-hero-3d 대체
[보상금 신청하기 →]            ← giant footer-style CTA (not button)
```

### B. 대시보드 헤더 리디자인
- `text-3xl font-bold` → `text-h2` (clamp 2–3rem) + negative tracking
- 환영 문구를 한 줄 display로: "안녕하세요, {name}님"
- 서브카피만 muted `#6e6a64`

### C. Quick Actions → Feature Grid
현재 4-col 컬러 버튼 카드 → Work Louder식 3–4 col:

| [01] | [02] | [03] | [04] |
|---|---|---|---|
| 보상금 신청 | AI 판례 분석 | 노무사 상담 | 신청 현황 |
| 아이콘 키캡형 일러스트 | | | |
| ghost link → | | | |

- 카드 배경 제거 → `border border-border rounded-lg` hairline
- 버튼 색상 제거 → `text-ink underline-offset-4 hover:underline`

### D. 상태 표시 (Codex RGB → SANZERO 신청 상태)
Work Louder의 "에이전트 상태 컬러" 패턴을 SANZERO 신청 트래킹에 적용:

| 상태 | 색 | 의미 |
|---|---|---|
| 대기 | `#9cd5fe` blue | 접수 대기 |
| 심사중 | `#f077af` pink | 검토 진행 |
| 승인 | `#10B981` green | 승인 완료 |
| 보완요청 | `#F59E0B` amber | 추가 서류 필요 |

→ 대시보드 "최근 활동" 리스트에 **좌측 컬러 dot** 으로 표시 (RGB 키 메타포)

### E. 스펙 섹션 → "서비스 안내" split
- 좌: SANZERO 프로세스 플로우 SVG (신청→AI분석→노무사→승인)
- 우: 단계별 설명 리스트
- 호버 시 해당 단계 highlight (`ring-blue-wash`)

---

## 3. 차용하지 않을 패턴 (Don't adopt)

| 패턴 | 이유 |
|---|---|
| 초대형 제품 3D 렌더 | SANZERO는 소프트웨어 — 방패/문서 추상 일러스트로 대체 |
| "품절" gray pill only | 공공서비스는 CTA가 명확해야 함 — primary 1개 허용 |
| 컬러 버튼 4종 (purple/green/blue) | 브랜드 voice 파괴 — 단일 accent 원칙 |
| "핑으로 돌아가기" 밈 톤 | SANZERO는 전문·신뢰 톤 — "보상금 신청하기 →" |
| shadcn 기본 card shadow | flat + hairline 유지 |

---

## 4. SANZERO 토큰 매핑 (제안)

```yaml
# sanzero-editorial theme (shadcn override)
colors:
  background: "#FDFDFD"      # was white
  foreground: "#191817"      # was gray-900
  muted-foreground: "#6e6a64"  # was gray-600
  border: "#CDD4DC"          # was gray-200
  primary: "#191817"         # was blue-600 — editorial black CTA
  accent: "#2563EB"            # 유일한 chromatic moment (링크·상태)
  status-pending: "#9cd5fe"
  status-review: "#f077af"
  status-approved: "#10B981"
  status-action: "#F59E0B"

typography:
  font-sans: "Pretendard, Inter, system-ui"  # 한국어 최적화
  display: "clamp(2.5rem, 5vw, 4.5rem)" weight 800
  h2: "clamp(1.5rem, 3vw, 2rem)" weight 700
  body: "1rem" weight 400
  mono-marker: "13px" weight 500  # [01] markers
```

---

## 5. 적용 우선순위 (구현 로드맵)

| Phase | 대상 | 변경 | 난이도 |
|---|---|---|---|
| P0 | 랜딩 `/` | 히어로 display-xl + giant CTA | 중 |
| P0 | `@header.xml` | sticky minimal, ink text, 1 primary | 하 |
| P1 | `@dashboard.xml` | quick actions → numbered grid | 중 |
| P1 | 상태 표시 | RGB dot pattern | 하 |
| P2 | `@analysis-main.xml` | split feature (copy + illustration) | 중 |
| P2 | `@footer.xml` | giant CTA band | 하 |
| P3 | 전체 | shadcn theme token override | 중 |

---

## 6. 예상 결과 화면 (SANZERO Dashboard — Editorial)

아래 이미지(`sanzero-editorial-mockup.png`)가 P0+P1 적용 후 예상 화면입니다.

**핵심 변화:**
1. 상단: 대형 "안녕하세요, {name}님" display 타이포
2. 중단: `[01]–[04]` numbered action grid (hairline cards, no color buttons)
3. 하단: 최근 활동에 상태 컬러 dot
4. 전체: `#FDFDFD` 배경, `#191817` 텍스트, 여백 2배
5. 유일한 chromatic: 상태 dot + 링크 accent blue
