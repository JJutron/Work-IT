# Step 2 — 구현 프롬프트 (Claude Code / v0 / Cursor)

> 이 프롬프트는 `design.md` + `01-design-refined.md` + `design-tokens.json`을
> 코드 생성 도구에 바로 붙여넣을 수 있도록 압축한 버전입니다.

---

## PROMPT START

Build a **single-page product landing** for "Work Louder × OpenAI Codex Micro" with the following exact design system. Stack: **Next.js 14 + Tailwind CSS + optional R3F for 3D hero**. Korean locale (`ko-KR`).

### Design tokens (use as Tailwind theme extension)

```js
// tailwind.config — theme.extend
colors: {
  ink: '#191817',
  surface: '#FDFDFD',
  muted: '#6e6a64',
  border: '#CDD4DC',
  'blue-wash': '#9cd5fe',
  lavender: '#C7C6DB',
  pink: { 400: '#f077af' },
  disabled: '#B2BDC7',
},
fontFamily: {
  sans: ['"OpenAI Sans"', 'Inter', 'system-ui', 'sans-serif'],
  mono: ['"SF Mono"', 'ui-monospace', 'monospace'],
},
fontSize: {
  'display-xl': ['clamp(4rem, calc(4rem + 3 * ((100vw - 23.4375rem) / 66.5625)), 7rem)', { lineHeight: '0.95', letterSpacing: '-0.03em', fontWeight: '900' }],
  'display-lg': ['clamp(2.5rem, calc(2.5rem + 2 * ((100vw - 23.4375rem) / 66.5625)), 4.5rem)', { lineHeight: '1', letterSpacing: '-0.025em', fontWeight: '800' }],
  h2: ['clamp(2rem, calc(2rem + 1 * ((100vw - 23.4375rem) / 66.5625)), 3rem)', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '700' }],
},
borderRadius: { pill: '9999px', lg: '1rem', md: '0.38rem' },
transitionTimingFunction: { editorial: 'cubic-bezier(0.2, 0.8, 0.2, 1)' },
```

### Page sections (top to bottom)

1. **Hero**
   - Full-width white background
   - Giant black text behind product: "OpenAI × WorkLoud" (`text-display-xl text-ink`)
   - Centered 3D product box render with soft bottom glow (`shadow-[0_20px_60px_rgba(77,76,82,0.12)]`)
   - Holographic border on packaging lid (CSS gradient border or image)

2. **Product name + keycap arc**
   - "Codex Micro" (`text-display-lg`)
   - Row of floating 3D keycaps in arc formation with icons (OpenAI, terminal, edit, download)

3. **Purchase strip**
   - "보증 및 고객 지원이 제공됩니다." + toggle labels "클릭감" / "저소음" + pill button "품절" (`bg-disabled rounded-pill`)

4. **Feature — agents in color**
   - Split: left copy "에이전트의 상태를 컬러로 확인하세요" + body; right pink-framed device close-up with RGB key glow
   - Background wash: `bg-blue-wash/30` behind product only

5. **Feature grid [01]–[03]**
   - 3-column grid (`grid-cols-1 md:grid-cols-3 gap-8`)
   - Each card: 3D close-up image + `[01]` mono label + h2 + body paragraph
   - Topics: workflow joystick, command keys, reasoning dial

6. **Specs split**
   - Left: interactive SVG line-art diagram of Creator Micro top view
   - Keys highlight with `ring-2 ring-blue-wash` on hover
   - Right: definition list (연결, 호환성, 조명, 소재, 키보드, 키캡, 소프트웨어, 포함사항)
   - Diagram border: `border border-border rounded-lg`

7. **Footer CTA**
   - Top border `border-t border-border`
   - Giant link: "핑으로 돌아가기 →" (`text-[clamp(2rem,5vw,4rem)] font-extrabold`)

### Component rules (MUST follow)

- NO saturated primary CTA buttons — only gray "품절" pill observed
- Display type: weight ≥ 800, negative tracking
- Section markers: `[01]` format in `font-mono text-sm`
- No card shadows — flat white sections only
- Product float shadow is the only elevation
- Muted text: `#6e6a64` only — never `#9CA3AF` for body
- Spacing between sections: `py-24` to `py-32` (96–128px)

### Do NOT

- Add navbar with colorful links (not in reference)
- Use shadcn default blue primary buttons
- Add gradient backgrounds to full sections
- Use Inter alone without trying OpenAI Sans first
- Miniaturize hero 3D into icon size

### Deliverables

- Responsive page (375px–1440px fluid type)
- Semantic HTML + accessible alt text on all product images
- Hover states on spec diagram keys
- `prefers-reduced-motion` fallback (static hero)

## PROMPT END
