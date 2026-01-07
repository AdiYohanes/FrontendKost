# Design System - Kost Management

## 1. Color Palette

### Primary Colors
- **Orange Primary**: `bg-orange-500` (#F97316)
  - Used for: Primary buttons, active states, focus rings, brand accents.
  - Hover: `bg-orange-600` (#EA580C)
- **White Surface**: `bg-white` (#FFFFFF)
  - Used for: Main backgrounds, cards, input backgrounds (active).

### Neutral Colors
- **Text Primary**: `text-gray-900` (#111827)
- **Text Secondary**: `text-gray-500` (#6B7280)
- **Border/Stroke**: `border-gray-200` (#E5E7EB)
- **Input Background**: `bg-gray-50` (#F9FAFB) -> `bg-white` (on focus).

### Semantic Colors
- **Error**: `text-red-600`
- **Link**: `text-blue-600` (Social), `text-gray-500` (Footer links).

---

## 2. Typography

### Font Family
- Default Sans (Inter/Geist)

### Hierarchy
- **Heading 1 (H1)**: `text-4xl font-bold tracking-tight`
  - Usage: Main Page Titles (Desktop)
- **Heading 2 (H2)**: `text-3xl font-bold tracking-tight`
  - Usage: Section Headers, Mobile Page Titles
- **Body Large**: `text-lg`
  - Usage: Subtitles, Introductory text.
- **Body Default**: `text-base`
  - Usage: Standard content, form inputs.
- **Caption**: `text-sm` or `text-xs`
  - Usage: Helper text, footer notes.

---

## 3. Spacing & Layout

### Container
- **Max Width**: `max-w-md` (28rem) for forms/cards to ensure readability.
- **Padding**:
  - Mobile: `p-6`
  - Tablet/Desktop: `p-12` or `p-8`

### Corner Radius
- **Buttons**: `rounded-full` (Pill shape)
- **Inputs**: `rounded-2xl` (Soft, modern rect)
- **Cards**: `rounded-3xl`

---

## 4. Components

### Buttons
- **Primary**: 
  - Bg: Orange-500
  - Text: White, Bold
  - Shape: Full Rounded
  - Shadow: `shadow-lg shadow-orange-500/30`
  - Animation: `hover:-translate-y-1 active:scale-95`
- **Social/Outline**:
  - Bg: White
  - Border: Gray-200
  - Shape: Full Rounded
  - Hover: Scale up slightly (`hover:scale-[1.02]`)

### Forms
- **Input Fields**:
  - Height: `h-14` (Touch friendly)
  - Bg: Gray-50 (Default) -> White (Focus)
  - Border: Transparent (Default) -> Orange-300 (Hover/Group Focus)
  - Icon: Left-aligned, Gray-400 -> Orange-500 (Active)

---

## 5. Visual Effects & Animation

### Shadows
- **Soft Glow**: `shadow-orange-500/30` for primary actions.
- **Drop Shadow**: `drop-shadow-xl` for isolated assets (Mascot).

### Animations
- **Float**: Continuous gentle up/down motion (Mascot).
- **Slide Up**: Elements enter from bottom (`slide-in-from-bottom-4`).
- **Fade In**: Opacity transition upon mounting.
- **Stagger**: Progressive delays (`delay-100`, `delay-200`) for list/form items.
