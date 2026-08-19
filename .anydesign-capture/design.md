---
version: anydesign-1
name: Work Louder × OpenAI — Codex Micro Product Page
source: /Users/gimhyeongju/Desktop/화면 기록 2026-07-31 10.55.12.mov
captured_at: 2026-08-19
description: |
  초미니멀 하드웨어 커머스 랜딩. 순백 배경 위에 초대형 블랙 디스플레이 타이포와
  포토리얼 3D 제품 렌더가 공존하는 에디토리얼 톤. OpenAI × Work Louder 협업
  매크로패드(Creator Micro / Codex Micro)를 AI 에이전트 워크플로우 도구로 포지셔닝.

colors:
  primary: "#000000"
  surface: "#FDFDFD"
  surface-elevated: "#F3F3F3"
  text-primary: "#000000"
  text-muted: "#75777A"
  text-subtle: "#9A8F94"
  border: "#E6E3E5"
  border-strong: "#CDD4DC"
  accent-blue-wash: "#AECEF5"
  accent-lavender: "#C7C6DB"
  accent-glow: "#D9DBE6"
  button-disabled: "#B2BDC7"
  interactive-highlight: "#AECEF5"

typography:
  display-xl:
    fontFamily: "Helvetica Now Display, SF Pro Display, Inter, system-ui, sans-serif"
    fontSize: 96px
    fontWeight: 900
    letterSpacing: -0.03em
    lineHeight: 0.95
  display-lg:
    fontFamily: "Helvetica Now Display, SF Pro Display, Inter, system-ui, sans-serif"
    fontSize: 72px
    fontWeight: 800
    letterSpacing: -0.025em
    lineHeight: 1.0
  h2:
    fontFamily: "Helvetica Now Display, SF Pro Display, Inter, system-ui, sans-serif"
    fontSize: 36px
    fontWeight: 700
    letterSpacing: -0.02em
    lineHeight: 1.2
  body:
    fontFamily: "Helvetica Now Text, SF Pro Text, Inter, system-ui, sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6
  body-sm:
    fontFamily: "Helvetica Now Text, SF Pro Text, Inter, system-ui, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
  label-mono:
    fontFamily: "SF Mono, ui-monospace, monospace"
    fontSize: 13px
    fontWeight: 500
    letterSpacing: 0.02em
  footer-cta:
    fontFamily: "Helvetica Now Display, SF Pro Display, Inter, system-ui, sans-serif"
    fontSize: 64px
    fontWeight: 800
    letterSpacing: -0.02em

spacing:
  base: 4px
  scale: [4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 160]

rounded:
  sm: 6px
  md: 12px
  lg: 16px
  pill: 9999px

components:
  button-sold-out:
    backgroundColor: "{colors.button-disabled}"
    textColor: "{colors.surface}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.pill}"
    padding: 10px 28px
  option-toggle:
    typography: "{typography.body-sm}"
    textColor: "{colors.text-muted}"
    border: "none"
  section-marker:
    typography: "{typography.label-mono}"
    textColor: "{colors.text-primary}"
  feature-card:
    backgroundColor: "{colors.surface}"
    border: "none"
    padding: 32px 24px
  specs-diagram:
    border: "1px solid {colors.border-strong}"
    rounded: "{rounded.md}"
    backgroundColor: "{colors.surface}"
  footer-cta-link:
    typography: "{typography.footer-cta}"
    textColor: "{colors.text-primary}"
    borderTop: "1px solid {colors.border-strong}"
    padding: 48px 32px
  product-hero-3d:
    backgroundColor: "{colors.surface}"
    elevation: "ambient-glow"
  exploded-unboxing:
    backgroundColor: "{colors.surface}"
    accentColor: "{colors.accent-lavender}"
  floating-keycap-carousel:
    backgroundColor: "{colors.surface}"
    layout: "arc-3d"
  interactive-spec-diagram:
    border: "1px solid {colors.border-strong}"
    hoverGlow: "{colors.interactive-highlight}"
---

# Design Analysis — Work Louder × OpenAI Codex Micro Product Page

> Analysis generated with the `anydesign` skill.
> Date: 2026-08-19
> Analysis emphasis: reconstruction + design system

---

## Source

- **Source type**: local video (screen recording)
- **Path / URL**: `/Users/gimhyeongju/Desktop/화면 기록 2026-07-31 10.55.12.mov`
- **Capture method**: OpenCV frame extraction at ~3s intervals (13 frames, 36.2s total scroll-through)
- **Detected limitations**: 데스크톱 뷰포트만 캡처됨. 네비게이션/헤더 미노출. 호버·스크롤 애니메이션은 정지 프레임으로만 추론. 정확한 폰트 패밀리·브레이크포인트는 CSS 없이 시각 추정.

---

## TL;DR

OpenAI × Work Louder 협업 하드웨어(Codex Micro/Creator Micro) 제품 랜딩 페이지로, Apple·teenage engineering 계열의 초미니멀 에디토리얼 톤이다. `{colors.surface}` (#FDFDFD) 단색 배경 위 `{colors.primary}` (#000000) 초대형 디스플레이 타이포와 3D 제품 렌더가 페이지의 거의 전부를 차지하며, UI 크롬은 거의 없다. 재구축 시 핵심은 **타이포 스케일 대비**와 **제품 3D/라인아트 에셋 품질**이다.

---

## 1. Visual identity

### 1.1 Surface description

**Personality** (5): clinical, editorial, premium, hardware-forward, restrained

**Mood**: 자신감 있고 차분함. 마케팅 카피보다 제품 실물·기능 설명이 주인공. "도구를 만드는 사람"에게 말하는 톤.

**Detectable stylistic references**: Apple product page(대형 타이포 + 3D 히어로), teenage engineering(하드웨어 미니멀리즘), Linear/Vercel급 여백·중립 팔레트 — 단 chromatic accent는 거의 없고 제품 RGB가 유일한 색 전압.

**Information density**: balanced — 히어로·기능 섹션은 여백 극대, 스펙·3-up 그리드 구간은 중간 밀도

**Implicit positioning**: AI 코딩 에이전트(Codex)를 쓰는 개발자·크리에이터. 하드웨어 얼리어답터.

**Confidence**: ⚠️ medium — 영상 스크롤로 전체 흐름은 확보했으나 헤더·모바일·인터랙션 미확인

### 1.2 Brand voice / Atmosphere

이 페이지는 "소프트웨어를 판다"기보다 **물리적 인터페이스로 AI 에이전트를 손에 쥔다**는 믿음 위에 서 있다. 마케팅 문장은 짧고 기능적이며, 감성적 수식어 대신 하드웨어 스펙·동작(조이스틱으로 워크플로 실행, 다이얼로 추론 수준 조절)을 구체적으로 말한다. 배경이 거의 순백인 이유는 제품 렌더와 블랙 타이포가 이미 충분한 시각 무게를 갖기 때문이다 — UI가 제품을 가리면 안 된다.

브랜드 보이스는 OpenAI의 "You can just build things" 철학과 Work Louder의 커스텀 입력기 문화가 합쳐진 형태다. 카피에 "Let's build", "핑으로 돌아가기" 같은 개발자 밈·은어가 섞여 있어, 엔터프라이즈가 아닌 **빌더 커뮤니티**를 향한다. 한국어 로컬라이제이션이 자연스럽게 녹아 있어 글로벌 브랜드의 현지화 페이지처럼 느껴진다.

전체적으로 "화려한 랜딩"을 거부한다. 그라데이션 배경·일러스트·아이콘 남용 없이, **제품 사진·기술 도면·대형 타이포** 세 가지 수단만으로 설득한다. 이 절제가 프리미엄 하드웨어 브랜드의 신뢰를 만든다.

### 1.3 The "ONE brand thing"

- **The thing**: 초대형 블랙 디스플레이 타이포(`{typography.display-xl}`)와 포토리얼 3D 제품 렌더의 **스케일 대비** — 텍스트가 화면 너비를 가로지르고 제품이 그 위·앞에 떠 있는 합성
- **Why it carries the brand**: 이 조합만으로 "프리미엄 하드웨어 × 테크 거대" 협업임을 즉시 전달. 일반 e-commerce 레이아웃과 완전히 다름
- **How everything else supports it**: 배경 `{colors.surface}`, UI 버튼 최소화, 섹션 구분도 헤어라인·여백으로만 처리
- **Where it appears**: 히어로("OpenAI x WorkLoud"), 제품명("Codex Micro"), 푸터 CTA("핑으로 돌아가기 →"). 스펙·기능 섹션에서는 타이포가 작아지고 도면·3D 클로즈업이 주도

*Confidence*: ✅ high

---

## 2. Design System (tokens)

### 2.1 Colors

| Token | Hex | Role | Where it appears | Confidence |
|---|---|---|---|---|
| `primary` | `#000000` | 디스플레이 타이포, 아이콘, 도면 선 | 히어로, 푸터 CTA, 라인아트 | ✅ high |
| `surface` | `#FDFDFD` | 페이지 배경 | 전 섹션 | ✅ high |
| `surface-elevated` | `#F3F3F3` | 미세한 면 분리 | 키캡 3D 그림자 영역 | ⚠️ medium |
| `text-primary` | `#000000` | 본문·제목 | 기능 설명, 스펙 | ✅ high |
| `text-muted` | `#75777A` | 보조 설명, 옵션 라벨 | 클릭감/저소음, 스펙 라벨 | ⚠️ medium |
| `text-subtle` | `#9A8F94` | 비활성·캡션 | 품절 근처 보조 텍스트 | ⚠️ medium |
| `border` | `#E6E3E5` | 약한 구분선 | 내부 카드 경계 | ⚠️ medium |
| `border-strong` | `#CDD4DC` | 섹션·도면 테두리 | 스펙 다이어그램, 푸터 상단선 | ✅ high |
| `accent-blue-wash` | `#AECEF5` | 기능 섹션 대기 배경 | 3-up 그리드 제품 클로즈업 뒤 | ✅ high |
| `accent-lavender` | `#C7C6DB` | 패키징 내부·제품 베이스 | unboxing 렌더 | ✅ high |
| `accent-glow` | `#D9DBE6` | 제품 하단 앰비언트 글로우 | 히어로 박스 렌더 | ⚠️ medium |
| `button-disabled` | `#B2BDC7` | 비활성 CTA | "품절" pill 버튼 | ⚠️ medium |
| `interactive-highlight` | `#AECEF5` | 호버/선택 글로우 | 스펙 도면 키 호버 | ⚠️ medium |

**Chromatic accents (제품 전용, UI 토큰 아님)**:
- RGB 핑크 키 글로우 — 에이전트 상태 표시 데모용 (추정 `#E8A0B0`–`#F0B8C8`, ❓ low)
- 홀로그래픽 패키징 테두리 — 무지개 iridescent, CSS 단색 토큰화 불가

### 2.2 Typography

- **Detected family**: Helvetica Now / SF Pro Display 계열 heavy sans *(confidence: ⚠️ medium — CSS 미확인, 시각 유사)*
- **Suggested fallback**: `Inter, system-ui, sans-serif`

**Observed scale:**

| Token | Size | Weight | Line-height | Use |
|---|---|---|---|---|
| `display-xl` | ~96px | 900 | 0.95 | "OpenAI x WorkLoud" 히어로 |
| `display-lg` | ~72px | 800 | 1.0 | "Codex Micro" 제품명 |
| `h2` | ~36px | 700 | 1.2 | 기능 섹션 제목 |
| `body` | 16px | 400 | 1.6 | 기능·스펙 본문 |
| `body-sm` | 14px | 400 | 1.5 | 옵션, 보조 카피 |
| `label-mono` | 13px | 500 | — | `[01]` `[02]` `[03]` 마커 |
| `footer-cta` | ~64px | 800 | — | "핑으로 돌아가기 →" |

**Notable tracking**: 디스플레이에 negative tracking (`-0.02em` ~ `-0.03em`). 본문은 neutral.

### 2.3 Spacing

- **Inferred base unit**: 4px
- **Observable multiples**: 16, 24, 32, 48, 64, 96, 128 — 섹션 간 ~96–160px, 카드 내부 24–32px
- **Consistency**: ✅ high — 여백이 시스템적으로 넓음

### 2.4 Radii

- `sm` 6px: 미세 UI (추정)
- `md` 12px: 스펙 도면 프레임
- `pill` 9999px: "품절" 버튼, 2U 스페이스 키 형태
- 제품 키캡: ~8–12px 라운드 스퀘어 (하드웨어, UI 토큰과 별도)

### 2.5 Elevation system

| Level | Name | Treatment | Use |
|---|---|---|---|
| 0 | Flat | No shadow | 페이지 배경, 텍스트 섹션 |
| 1 | Product float | soft `0 20px 60px rgba(77,76,82,0.12)` | 3D 제품 렌더 |
| 2 | Ambient glow | bottom radial `#D9DBE6` → transparent | 히어로 박스 하단 |
| 3 | Interactive | `0 0 0 2px #AECEF5` glow | 스펙 도면 키 호버 |

**Decorative depth**:
- **Polarity flips**: 없음 — 전 페이지 `{colors.surface}` 단일 극성
- **Atmospheric wash**: 기능 3-up 섹션에 `{colors.accent-blue-wash}` (#AECEF5) 배경 톤 (제품 뒤 대기색)
- **Holographic border**: 패키징 리드 일러스트 테두리 — 히어로·언박싱 섹션에만

### 2.6 Borders

- Base: `1px solid {colors.border-strong}` (#CDD4DC)
- 스펙 다이어그램 외곽·푸터 상단 구분선에 사용
- Focus: `{colors.interactive-highlight}` 글로우 (도면 인터랙션)

### 2.7 Accessibility quick-check

See companion `design-a11y.md`. Summary:
- `{colors.text-primary}` on `{colors.surface}`: **21.0:1** — AAA ✅
- `{colors.text-muted}` on `{colors.surface}`: **5.33:1** — AA ✅
- `{colors.text-subtle}` on `{colors.surface}`: **2.54:1** — fail ❌ (캡션 전용으로 제한 필요)

---

## 3. Components Inventory

### 3.1 Generic components

#### button-sold-out
- **Variants**: disabled pill only ("품절")
- **Observed sizes**: md (~40px tall)
- **Visible states**: disabled (gray fill, no hover)
- **Padding**: ~10px vertical, ~28px horizontal
- **Radius**: `{rounded.pill}`
- **Confidence**: ✅ high

#### Option toggle
- **Variants**: text-only inline ("클릭감", "저소음")
- **Visible states**: default + info icon (i)
- **Typography**: `{typography.body-sm}`, `{colors.text-muted}`
- **Confidence**: ⚠️ medium — 선택 상태 미확인

#### Section marker
- **Format**: `[01]`, `[02]`, `[03]` prefix before heading
- **Typography**: `{typography.label-mono}`
- **Confidence**: ✅ high

#### Feature card (3-column)
- **Structure**: 상단 3D 클로즈업 이미지 + 하단 제목 + 본문
- **Border**: none
- **Padding**: ~32px
- **Confidence**: ✅ high

#### specs-diagram
- **Structure**: 좌 라인아트 SVG (`{components.specs-diagram}`) + 우 스펙 리스트 split 패널
- **Diagram**: 흑백 벡터, 키 호버 시 `{colors.interactive-highlight}` 글로우
- **List**: 라벨(한국어) + 값, `{typography.body}`
- **Confidence**: ✅ high

#### Footer CTA link
- **Structure**: `{components.footer-cta-link}` — 상단 1px border + 초대형 텍스트 링크
- **Copy pattern**: "핑으로 돌아가기 →" (arrow suffix)
- **Confidence**: ✅ high

### 3.2 Signature components

#### product-hero-3d
- **What it is**: 화면 너비급 디스플레이 타이포 뒤·위에 떠 있는 제품 3D 합성 (`{components.product-hero-3d}`)
- **Why it's signature**: 일반 커머스 히어로와 구별되는 Work Louder/OpenAI 협업 시그니처
- **Composition**: `{typography.display-xl}` + product render + `{colors.accent-glow}` ambient
- **Where it appears**: 히어로, 제품명 섹션, unboxing 합성
- **Confidence**: ✅ high

#### exploded-unboxing
- **What it is**: 리드·본체·베이스가 대각선으로 떠 있는 3요소 분해 구도
- **Why it's signature**: 패키징 경험을 정적 이미지로 서사화
- **Composition**: white box + holographic border + lavender interior `{colors.accent-lavender}`
- **Where it appears**: "OpenAI x WorkLoud" 히어로 스크롤 구간
- **Confidence**: ✅ high

#### interactive-spec-diagram
- **What it is**: Creator Micro 탑뷰 기술 도면, 키 호버 시 하이라이트·커서 변경
- **Why it's signature**: 스펙을 표가 아닌 **탐색 가능한 도면**으로 제시
- **Composition**: 1px `{colors.border-strong}` stroke + `{colors.interactive-highlight}` hover
- **Where it appears**: 사양 섹션 (~20–35s 구간)
- **Confidence**: ✅ high

#### floating-keycap-carousel
- **What it is**: "Codex Micro" 타이틀 아래 아이콘 키캡이 호 형태로 떠 있는 3D 키캡 쇼케이스
- **Why it's signature**: 커스텀 키캡 아이콘(OpenAI, 터미널, 편집, 다운로드)을 제품 정체성으로 승격
- **Where it appears**: 제품명 직후 섹션
- **Confidence**: ✅ high

---

## 4. Layout & Composition

### 4.1 Grid & containers

- **Inferable grid**: 단일 컬럼 중심, 콘텐츠 max-width ~1200–1400px (추정)
- **Vertical rhythm**: 섹션 간 ~96–128px+, 거의 뷰포트 단위 스크롤
- **Visual hierarchy**: 디스플레이 타이포 scale → 3D 제품 → h2 → body 순
- **Density**: 히어로·제품 쇼케이스는 sparse, 3-up·스펙은 moderate

### 4.2 Composition patterns

- **Giant-type hero** with product overlay
- **Floating keycap arc** (product detail)
- **Split feature** (copy left, 3D right) — RGB 상태 섹션
- **3-column feature grid** with numbered markers `[01]–[03]`
- **50/50 specs split** (diagram + list)
- **Full-width footer CTA band** with hairline separator
- **Purchase/options strip** (품절, 클릭감/저소음) — 상단 근처

### 4.3 Responsive behavior

#### Breakpoints

| Name | Width | Key changes |
|---|---|---|
| Mobile | < 600px | ❓ low — 미캡처. 3-up → 1-up 스택 예상 |
| Tablet | 600–959px | ❓ low — 3-up → 2-up 또는 1-up 예상 |
| Desktop | ≥ 960px | ✅ high — 캡처 기준. 3-up 그리드, split 레이아웃 |
| Wide | ≥ 1280px | ⚠️ medium — 넓은 여백 흡수 추정 |

#### Touch targets

- Primary CTA "품절": ~40px 높이 — WCAG 44px 미달 ⚠️
- 스펙 도면 키: ~48px+ (그리드 셀) — ✅
- 푸터 CTA: 전체 밴드 클릭 영역 — ✅

#### Collapsing strategy

- **3-up grid**: desktop 3열 → mobile 1열 (추정)
- **Specs split**: desktop 좌우 → mobile 상하 스택 (추정)
- **Hero type**: font-size `clamp()` 축소 가능성 ⚠️

### 4.4 Image behavior

- **3D product renders**: PNG/WebGL, transparent shadow, `{colors.surface}` 위 float
- **Line-art diagrams**: SVG 벡터, 1px stroke, interactive hover states
- **Keycap 3D**: 개별 메쉬, arc 배치, 아이콘 키캡 라벨
- **Packaging**: holographic border는 텍스처/셰이더 에셋
- **Photography**: 없음 — 전부 CG 렌더
- **Icons**: 커스텀 키캡 아이콘 세트 (32종 언급), Lucide/Heroicons 아님

---

## 5. Reconstruction Notes

### Suggested stack

**Next.js (or similar SSG) + Three.js/R3F + Tailwind CSS (optional)**

Justification: 3D 제품 렌더·스크롤 기반 랜딩은 React + R3F 패턴과 일치. UI 크롬이 얇아 Tailwind로 토큰 매핑 용이. 정확한 프레임워크는 HTML/CSS 미확인으로 ❓ low.

### Quick wins

- `{colors.surface}` + `{colors.text-primary}` 이원 팔레트로 70% 재현
- `{typography.display-xl}` + negative tracking 히어로
- 3-column CSS grid 기능 섹션
- `[01]` mono section markers
- 스펙 split: SVG diagram + definition list

### Tricky bits

- 포토리얼 3D 제품·키캡 arc — 전용 3D 에셋·라이팅 필요
- 홀로그래픽 패키징 테두리 — 커스텀 셰이더/텍스처
- 스펙 도면 키 호버 인터랙션 — SVG + JS state
- 스크롤 기반 패럴랙스/진입 애니메이션 (영상에서 암시, 프레임 미확정)
- RGB 키 글로우 — 하드웨어 데모용 동적 lighting

### Implicit states to define

- Option toggle selected (클릭감 vs 저소음)
- In-stock CTA (현재 품절만 확인)
- Nav/header (미캡처)
- Spec diagram 모든 키 tooltip
- Reduced-motion fallback

### Confidence map

| Layer | Confidence | Why |
|---|---|---|
| Identity | ✅ high | 명확한 에디토리얼 하드웨어 톤 |
| Colors | ⚠️ medium | 히어로·기능 프레임에서 hex 추출, RGB 핑크는 추정 |
| Typography | ⚠️ medium | 스케일·weight 명확, 폰트명 미확인 |
| Spacing | ⚠️ medium | 패턴 일관, 정확 px 미측정 |
| Components | ✅ high | 13프레임으로 주요 패턴 확인 |
| Layout | ⚠️ medium | 데스크톱 스크롤만, 반응형 미확인 |

---

## 6. Do's and Don'ts

### Do

- **`{colors.surface}` 위에 `{colors.text-primary}` 디스플레이 타이포를 화면 너비 scale로 배치** — 히어로의 기본 공식
- **제품 3D/CG를 카피와 동등한 시각 무게로 취급** — 텍스트만으로 섹션을 채우지 말 것
- **기능 섹션에 `[01]`–`[03]` `{typography.label-mono}` 마커 사용** — 순서·스캔 가능성 확보
- **스펙은 표 대신 `{components.specs-diagram}` + 리스트 split으로 제시** — 브랜드 고유 패턴 유지
- **`{colors.accent-blue-wash}` 를 3-up 제품 클로즈업 배경 대기색으로만 사용** — 전역 accent 금지
- **푸터 CTA는 `{typography.footer-cta}` + 상단 `1px {colors.border-strong}`** — 마지막 전환은 거대 텍스트 링크로
- **카피 톤은 빌더 대상 한국어** — "에이전트", "추론 수준", "PR 리뷰" 등 개발 워크플로 용어 유지

### Don't

- **UI에 saturated primary color 버튼 도입 금지** — conversion은 제품·대형 타이포가 담당, chromatic CTA 없음
- **`{colors.text-subtle}` 을 본문에 사용하지 말 것** — AA 미달 (2.54:1)
- **그라데이션 배경을 섹션 전체에 깔지 말 것** — wash는 제품 뒤 국소 영역만
- **일반 icon set(Lucide 등)으로 키캡 아이콘 대체 금지** — 32종 커스텀 아이콘이 정체성
- **카드 border/shadow로 elevation 쌓지 말 것** — flat surface + 제품 float shadow만
- **display weight를 700 이하로 낮추지 말 것** — 히어로는 800–900이 브랜드 실루엣
- **스펙 도면을 단순 이미지로만 넣지 말 것** — 호버 하이라이트 인터랙션 유지

---

## 7. Open Questions

- 상단 네비게이션·로고·카트 UI가 있는가? (영상에 미포함)
- 정확한 web font 패밀리 (Helvetica Now 커스텀 라이선스? SF Pro?)
- 모바일·태블릿 레이아웃 breakpoint와 3-up 그리드 collapse 규칙
- 스크롤 패럴랙스·진입 애니메이션의 정확한 easing/duration
- "품절" 외 in-stock CTA 스타일 (색상·라벨)
- 옵션 토글(클릭감/저소음) selected 상태 시각 처리
- 실제 배포 URL (worklouder.cc 등) — CSS 변수 직접 추출 가능 여부
- RGB 핑크 accent의 정확한 hex (제품 LED 데모용)

*영상 스크롤 기준 주요 섹션·토큰·컴포넌트는 재구축 가능 수준으로 확보. 위 항목은 fidelity 향상용.*

---

## 8. Companion files

- [x] `design-tokens.json` — DTCG format tokens
- [x] `design-a11y.md` — WCAG contrast report
- [x] `.anydesign-capture/frame_*.png` — 13 extracted frames (0s–35s)

---

*End of analysis.*
