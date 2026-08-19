# Step 1 — 분석 보강 (URL + CSS 변수)

> Source URL: https://openai.com/supply/co-lab/work-louder/
> CSS extraction: `css-vars.json` (1,145 vars from 15 stylesheets)
> Date: 2026-08-19

## 보강 요약

영상 분석(❓ medium) → **공식 URL CSS 추출(✅ high)** 로 다음 항목이 확정·정밀화되었습니다.

| 항목 | 영상 추정 | URL 확정 |
|---|---|---|
| 폰트 | Helvetica Now / SF Pro | **OpenAI Sans** (`--font-sans`) |
| 디스플레이 ink | `#000000` | **`#191817`** (`--math-editorial-ink`) |
| 디스플레이 scale | ~96px 고정 | **`clamp(4rem → 7rem)`** (`--type-xl-size`) |
| H2 scale | ~36px | **`clamp(2rem → 3rem)`** (`--type-h2-size`) |
| Body | 16px | **15.2px** (`--type-p1-size: 1.0625rem`) |
| Caption | 14px | **14px** (`--type-p2-size: .875rem`) |
| Radius pill | 9999px | **`9999px`** (`--radius-full`) ✅ |
| Radius card | 12px | **16px** (`--radius-lg: 1rem`) |
| Easing | unknown | **`cubic-bezier(.2, .8, .2, 1)`** (`--daybreak-ease-out`) |
| Accent pink | 추정 | **`#f077af`** (`--color-primitive-pink-400`) |
| Blue wash | `#AECEF5` | **`#9cd5fe`** (`--supply-text-gradient-sky`) |
| Muted text | `#75777A` | **`#6e6a64`** (`--color-primary-60`) |

## 확정 토큰 (high confidence)

### Typography
```css
--font-sans: "OpenAI Sans", "OpenAI Sans Variable Scripts", sans-serif;
--font-mono: "SF Mono", Consolas, ui-monospace, monospace;
--type-xl-size: clamp(4rem, calc(4rem + 3 * ((100vw - 23.4375rem) / 66.5625)), 7rem);
--type-h2-size: clamp(2rem, calc(2rem + 1 * ((100vw - 23.4375rem) / 66.5625)), 3rem);
--type-h3-size: clamp(1.5rem, calc(1.5rem + .375 * ((100vw - 23.4375rem) / 66.5625)), 1.875rem);
--type-p1-size: 1.0625rem;
--type-p2-size: .875rem;
--font-weight-black: 900;
--font-weight-semibold: 600;
```

### Colors
```css
--math-editorial-ink: #191817;
--color-primary-60: #6e6a64;        /* muted body */
--color-background: (theme-driven, light ≈ #FDFDFD);
--color-primitive-pink-400: #f077af; /* agent RGB demo */
--supply-text-gradient-sky: #9cd5fe;
--supply-text-gradient-blue: #6e85d4;
```

### Layout / Motion
```css
--spacing: .25rem;                  /* 4px base */
--radius-full: 9999px;
--radius-lg: 1rem;
--daybreak-ease-out: cubic-bezier(.2, .8, .2, 1);
--supply-page-content-offset: 2rem;
```

## 페이지 구조 (공식 콘텐츠 매핑)

| 섹션 | EN (live) | KO (영상) |
|---|---|---|
| Hero | Codex Micro — Your command center for agentic work | 동일 구조 |
| Price | $230.00 | (미표시) |
| Options | Clicky / Silent | 클릭감 / 저소음 |
| CTA | Out of stock | 품절 |
| Feature 1 | Your agents, in color | 에이전트의 상태를 컬러로 확인하세요 |
| Feature 2-4 | [01]–[03] grid | 동일 |
| Specs | Split diagram + list | 사양 |
| Footer | Back to shop → | 핑으로 돌아가기 → |

## 반응형 (CSS evidence)

- **Fluid typography**: 모든 heading이 `clamp(min, calc, max)` — discrete breakpoint보다 fluid scale 우선
- **Viewport range**: `23.4375rem` (375px) ~ `90rem` (1440px) 기준 보간
- **Mobile nav width**: `calc(100vw - 3.5rem)`

## 영상 분석 대비 수정 사항

1. `text-primary` `#000000` → `#191817` (미세하게 warm black)
2. `accent-blue-wash` `#AECEF5` → `#9cd5fe` (sky gradient 계열)
3. 폰트 패밀리 확정: OpenAI Sans (Inter fallback 가능)
4. 디스플레이는 고정 px가 아닌 fluid clamp — 재구축 시 `clamp()` 필수
5. 한국어 로컬라이제이션은 동일 레이아웃·다른 카피 (i18n 레이어)

## 미해결 (여전히 Open Questions)

- `--color-background` 실제 computed value (테마 토글 가능)
- 3D 에셋 포맷 (glTF / Lottie / video loop)
- 스크롤 패럴랙스 구현 방식 (CSS vs JS)
