# WCAG 2.1 Contrast Report — Work Louder × OpenAI Codex Micro

Source: frame extraction from screen recording (2026-08-19)

Thresholds: **AA normal** ≥ 4.5:1 · **AA large** ≥ 3:1 · **AAA normal** ≥ 7:1 · **AAA large** ≥ 4.5:1

| Pair | FG | BG | Ratio | AA normal | AA large | AAA normal | AAA large |
|---|---|---|---|---|---|---|---|
| `text-primary` on `surface` | `#000000` | `#FFFFFF` | 21.0:1 | ✅ | ✅ | ✅ | ✅ |
| `text-muted` on `surface` | `#6B6B6B` | `#FFFFFF` | 5.33:1 | ✅ | ✅ | ❌ | ✅ |
| `text-subtle` on `surface` | `#9CA3AF` | `#FFFFFF` | 2.54:1 | ❌ | ❌ | ❌ | ❌ |
| `button-disabled` text on `surface` | `#B2BDC7` | `#FFFFFF` | ~1.8:1 | ❌ | ❌ | ❌ | ❌ |

## Recommendations

1. **`text-subtle` (#9A8F94)**: 본문·라벨에 사용 금지. 장식적 캡션 또는 18pt+ bold에만 제한.
2. **품절 버튼**: gray pill on white — 대비 부족 가능. `text-primary` on `button-disabled` 조합 검증 필요.
3. **디스플레이 타이포**: 64px+ → large text 기준 AA 3:1 충족. black on white는 AAA.
