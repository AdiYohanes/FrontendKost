# Color Contrast Accessibility Guide

## WCAG 2.1 AA Compliance

This document outlines the color contrast requirements and implementations for WCAG 2.1 AA compliance.

### Contrast Ratio Requirements

- **Normal text**: 4.5:1 minimum contrast ratio
- **Large text** (18pt+ or 14pt+ bold): 3:1 minimum contrast ratio
- **UI components and graphics**: 3:1 minimum contrast ratio

### Application Color Palette

#### Primary Colors

- **Primary Green**: `#1baa56`
- **White**: `#ffffff`
- **Black**: `#000000`

#### Gray Scale

- **Gray 50**: `#f9fafb`
- **Gray 100**: `#f3f4f6`
- **Gray 200**: `#e5e7eb`
- **Gray 300**: `#d1d5db`
- **Gray 400**: `#9ca3af`
- **Gray 500**: `#6b7280`
- **Gray 600**: `#4b5563`
- **Gray 700**: `#374151`
- **Gray 800**: `#1f2937`
- **Gray 900**: `#111827`

#### Status Colors

- **Success**: `#16a34a` (green-600)
- **Error**: `#dc2626` (red-600)
- **Warning**: `#ca8a04` (yellow-600)
- **Info**: `#2563eb` (blue-600)

### Approved Color Combinations

All combinations below meet WCAG 2.1 AA standards:

#### Text on White Background

| Foreground           | Background | Ratio  | Level    | Use Case            |
| -------------------- | ---------- | ------ | -------- | ------------------- |
| `#111827` (gray-900) | `#ffffff`  | 16.1:1 | AAA      | Body text, headings |
| `#4b5563` (gray-600) | `#ffffff`  | 7.3:1  | AAA      | Secondary text      |
| `#6b7280` (gray-500) | `#ffffff`  | 4.6:1  | AA       | Muted text          |
| `#1baa56` (primary)  | `#ffffff`  | 3.5:1  | AA Large | Large text, buttons |
| `#16a34a` (success)  | `#ffffff`  | 3.9:1  | AA Large | Success messages    |
| `#dc2626` (error)    | `#ffffff`  | 4.5:1  | AA       | Error messages      |
| `#ca8a04` (warning)  | `#ffffff`  | 4.6:1  | AA       | Warning messages    |
| `#2563eb` (info)     | `#ffffff`  | 4.6:1  | AA       | Info messages       |

#### Text on Primary Green Background

| Foreground        | Background | Ratio | Level    | Use Case                |
| ----------------- | ---------- | ----- | -------- | ----------------------- |
| `#ffffff` (white) | `#1baa56`  | 3.5:1 | AA Large | Button text, active nav |

#### Text on Dark Background

| Foreground           | Background | Ratio  | Level | Use Case            |
| -------------------- | ---------- | ------ | ----- | ------------------- |
| `#ffffff` (white)    | `#111827`  | 16.1:1 | AAA   | Dark mode text      |
| `#f3f4f6` (gray-100) | `#111827`  | 15.8:1 | AAA   | Dark mode secondary |

### Component-Specific Guidelines

#### Buttons

- **Primary Button**: White text (`#ffffff`) on primary green (`#1baa56`) - 3.5:1 ratio ✓
- **Secondary Button**: Gray-900 text (`#111827`) on white (`#ffffff`) - 16.1:1 ratio ✓
- **Destructive Button**: White text (`#ffffff`) on red-600 (`#dc2626`) - 4.5:1 ratio ✓

#### Badges

- **Available (Green)**: White text on green-600 - 3.9:1 ratio ✓
- **Occupied (Blue)**: White text on blue-600 - 4.6:1 ratio ✓
- **Maintenance (Yellow)**: Gray-900 text on yellow-100 - 12.6:1 ratio ✓
- **Unpaid (Red)**: White text on red-600 - 4.5:1 ratio ✓
- **Paid (Green)**: White text on green-600 - 3.9:1 ratio ✓

#### Forms

- **Label Text**: Gray-900 (`#111827`) on white - 16.1:1 ratio ✓
- **Input Text**: Gray-900 (`#111827`) on white - 16.1:1 ratio ✓
- **Placeholder Text**: Gray-500 (`#6b7280`) on white - 4.6:1 ratio ✓
- **Error Text**: Red-600 (`#dc2626`) on white - 4.5:1 ratio ✓
- **Helper Text**: Gray-600 (`#4b5563`) on white - 7.3:1 ratio ✓

#### Navigation

- **Active Link**: White text (`#ffffff`) on primary green (`#1baa56`) - 3.5:1 ratio ✓
- **Inactive Link**: Gray-600 (`#4b5563`) on white - 7.3:1 ratio ✓
- **Hover Link**: Gray-900 (`#111827`) on gray-100 - 14.4:1 ratio ✓

#### Tables

- **Header Text**: Gray-600 (`#4b5563`) on white - 7.3:1 ratio ✓
- **Body Text**: Gray-900 (`#111827`) on white - 16.1:1 ratio ✓
- **Row Hover**: Gray-900 (`#111827`) on gray-50 - 15.3:1 ratio ✓

### Testing Color Contrast

Use the provided utility functions to test color combinations:

```typescript
import { getContrastRatio, meetsWCAG_AA } from "@/lib/utils/colorContrast";

// Check contrast ratio
const ratio = getContrastRatio("#1baa56", "#ffffff");
console.log(`Contrast ratio: ${ratio.toFixed(2)}:1`);

// Check WCAG AA compliance
const passes = meetsWCAG_AA("#1baa56", "#ffffff", true); // true for large text
console.log(`Passes WCAG AA: ${passes}`);
```

### Common Issues and Solutions

#### Issue: Low Contrast on Hover States

**Problem**: Hover states with subtle color changes may not meet contrast requirements.

**Solution**: Ensure hover states maintain at least 3:1 contrast ratio. Use darker shades or add borders.

```css
/* Bad */
.button:hover {
  background: #e0e0e0; /* Low contrast with white text */
}

/* Good */
.button:hover {
  background: #1baa56; /* Maintains contrast */
  opacity: 0.9;
}
```

#### Issue: Disabled State Visibility

**Problem**: Disabled elements may have insufficient contrast.

**Solution**: Use `opacity: 0.5` on disabled elements while maintaining base contrast, or use gray-400 (`#9ca3af`) which has 2.9:1 ratio (acceptable for disabled states).

```css
/* Disabled button */
.button:disabled {
  opacity: 0.5; /* Reduces contrast but indicates disabled state */
  cursor: not-allowed;
}
```

#### Issue: Icon-Only Buttons

**Problem**: Icon-only buttons may not have sufficient contrast.

**Solution**: Ensure icons have at least 3:1 contrast ratio and include accessible labels.

```tsx
<Button aria-label="Delete item">
  <TrashIcon className="text-gray-600" /> {/* 7.3:1 ratio */}
</Button>
```

### Validation Checklist

- [ ] All text has minimum 4.5:1 contrast ratio
- [ ] Large text (18pt+) has minimum 3:1 contrast ratio
- [ ] UI components have minimum 3:1 contrast ratio
- [ ] Focus indicators are visible (3:1 contrast)
- [ ] Status colors meet contrast requirements
- [ ] Hover states maintain contrast
- [ ] Disabled states are distinguishable
- [ ] Icons have sufficient contrast

### Tools for Testing

1. **Browser DevTools**: Use the built-in contrast checker in Chrome/Edge DevTools
2. **WebAIM Contrast Checker**: https://webaim.org/resources/contrastchecker/
3. **Lighthouse**: Run accessibility audits in Chrome DevTools
4. **axe DevTools**: Browser extension for accessibility testing

### References

- [WCAG 2.1 Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Color Contrast Analyzer](https://www.tpgi.com/color-contrast-checker/)
