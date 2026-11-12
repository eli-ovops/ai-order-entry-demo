# Design

## Visual Theme

白底、低噪声、数据优先的企业操作台。使用克制的陶土红作为主操作色，搭配工业蓝作为辅助状态色，让“传统行业 + AI 录单”的场景显得可信而不过度科技化。

## Color Tokens

- `--color-bg`: `oklch(1 0 0)`
- `--color-surface`: `oklch(0.982 0 0)`
- `--color-panel`: `oklch(0.957 0.006 34)`
- `--color-ink`: `oklch(0.19 0.015 38)`
- `--color-muted`: `oklch(0.43 0.014 38)`
- `--color-line`: `oklch(0.88 0.005 38)`
- `--color-primary`: `oklch(0.54 0.155 33.5)`
- `--color-accent`: `oklch(0.46 0.13 205)`
- `--color-danger`: `oklch(0.55 0.18 24)`

## Typography

Use the system sans stack for fast local rendering and familiar enterprise UI density. Headings are compact and functional; large display typography is intentionally avoided.

## Components

- Left navigation on desktop, horizontal navigation on small screens.
- Rounded 6-8px controls and cards.
- Tables use horizontal scrolling on narrow viewports.
- Confidence and status are shown as semantic pills.
- Forms keep labels visible and fields editable.

## Motion

Only lightweight hover and state transitions. Reduced motion disables transition duration.

