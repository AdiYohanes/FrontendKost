# Design System Guide - Kost Management Frontend

## 📐 Design Philosophy

Project ini menggunakan **Modern Dashboard Design System** yang terinspirasi dari:

### 1. **shadcn/ui** (Primary Design System)

- **Website**: https://ui.shadcn.com/
- **Philosophy**: Unstyled, accessible components yang bisa di-customize
- **Approach**: Copy-paste components, bukan npm package
- **Base**: Radix UI primitives + Tailwind CSS

### 2. **Radix UI** (Accessibility Foundation)

- **Website**: https://www.radix-ui.com/
- **Purpose**: Unstyled, accessible UI primitives
- **Features**:
  - WAI-ARIA compliant
  - Keyboard navigation
  - Focus management
  - Screen reader support

### 3. **Tailwind CSS v4** (Styling Framework)

- **Website**: https://tailwindcss.com/
- **Approach**: Utility-first CSS
- **Benefits**:
  - Rapid development
  - Consistent design
  - Responsive by default
  - Dark mode ready

---

## 🎨 Design System Components

### Component Architecture

```
shadcn/ui Components (Styled)
    ↓
Radix UI Primitives (Unstyled, Accessible)
    ↓
Tailwind CSS (Utility Classes)
```

### Installed Components

Semua component UI ada di `components/ui/`:

1. **Button** (`button.tsx`)
   - Variants: default, destructive, outline, secondary, ghost, link
   - Sizes: default, sm, lg, icon
   - Based on: `@radix-ui/react-slot`

2. **Input** (`input.tsx`)
   - Standard text input
   - Type-safe with React.forwardRef

3. **Label** (`label.tsx`)
   - Form labels
   - Based on: `@radix-ui/react-label`

4. **Card** (`card.tsx`)
   - Container component
   - Parts: Card, CardHeader, CardTitle, CardContent, CardFooter

5. **Badge** (`badge.tsx`)
   - Status indicators
   - Variants: default, secondary, destructive, outline

6. **Form** (`form.tsx`)
   - Form wrapper with React Hook Form integration
   - Based on: `@radix-ui/react-label`

7. **Dialog** (`dialog.tsx`)
   - Modal dialogs
   - Based on: `@radix-ui/react-dialog`
   - Parts: Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter

8. **Select** (`select.tsx`)
   - Dropdown select
   - Based on: `@radix-ui/react-select`
   - Accessible with keyboard navigation

9. **Table** (`table.tsx`)
   - Data tables
   - Parts: Table, TableHeader, TableBody, TableRow, TableHead, TableCell

10. **Sheet** (`sheet.tsx`)
    - Side panels/drawers
    - Based on: `@radix-ui/react-dialog`
    - Used for mobile sidebar

11. **Scroll Area** (`scroll-area.tsx`)
    - Custom scrollable areas
    - Based on: `@radix-ui/react-scroll-area`

12. **Separator** (`separator.tsx`)
    - Divider lines
    - Based on: `@radix-ui/react-separator`

13. **Avatar** (`avatar.tsx`)
    - User avatars
    - Based on: `@radix-ui/react-avatar`

14. **Dropdown Menu** (`dropdown-menu.tsx`)
    - Context menus
    - Based on: `@radix-ui/react-dropdown-menu`

15. **Sonner** (`sonner.tsx`)
    - Toast notifications
    - Based on: `sonner` library

---

## 🎨 Color System

### Primary Brand Colors

```css
/* Green Primary - Main brand color */
--primary: #1baa56 --primary-hover: #148041 /* Used for: */ - Primary buttons -
  Active states - Links - Focus rings - Success states;
```

### Neutral Colors

```css
/* Text */
--foreground: #111827 (gray-900) --muted-foreground: #6b7280 (gray-500)
  /* Backgrounds */ --background: #ffffff (white) --muted: #f9fafb (gray-50)
  /* Borders */ --border: #e5e7eb (gray-200);
```

### Semantic Colors

```css
/* Status Colors */
--destructive: red-600 (errors, delete actions) --success: green-600
  (success states) --warning: yellow-600 (warnings) --info: blue-600
  (information);
```

### Room Status Colors (Custom)

```typescript
// lib/utils/roomUtils.ts
AVAILABLE: "bg-green-100 text-green-800";
OCCUPIED: "bg-blue-100 text-blue-800";
MAINTENANCE: "bg-yellow-100 text-yellow-800";
```

---

## 📝 Typography

### Font Stack

```css
font-family: "Geist Sans", "Inter", system-ui, sans-serif;
```

### Type Scale

```css
/* Headings */
text-3xl (30px) - Page titles
text-2xl (24px) - Section headers
text-xl (20px) - Card titles
text-lg (18px) - Subsections

/* Body */
text-base (16px) - Default body text
text-sm (14px) - Secondary text, labels
text-xs (12px) - Captions, helper text
```

### Font Weights

```css
font-bold (700) - Headings, emphasis
font-semibold (600) - Subheadings
font-medium (500) - Labels, buttons
font-normal (400) - Body text
```

---

## 📏 Spacing System

### Tailwind Spacing Scale

```css
/* Common spacing values */
p-2 (8px)   - Tight padding
p-4 (16px)  - Default padding
p-6 (24px)  - Card padding
p-8 (32px)  - Section padding

gap-2 (8px)   - Tight gaps
gap-4 (16px)  - Default gaps
gap-6 (24px)  - Section gaps
```

### Layout Spacing

```css
/* Page padding */
p-6 - Mobile/tablet
p-8 - Desktop

/* Component spacing */
space-y-4 - Vertical stack (forms)
space-y-6 - Vertical stack (sections)
gap-4 - Grid/flex gaps
```

---

## 🔲 Border Radius

```css
/* Component-specific */
rounded-md (6px)   - Buttons, inputs, cards
rounded-lg (8px)   - Larger cards
rounded-full       - Pills, avatars

/* Custom */
rounded-2xl (16px) - Special cards
rounded-3xl (24px) - Hero sections
```

---

## 🎭 Component Patterns

### 1. Data Tables

```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Column</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Data</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

**Features:**

- Responsive
- Sortable columns
- Pagination
- Search/filter
- Loading states
- Empty states

### 2. Forms

```tsx
<form onSubmit={handleSubmit(onSubmit)}>
  <Card>
    <CardHeader>
      <CardTitle>Form Title</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="field">Label</Label>
        <Input id="field" {...register("field")} />
        {errors.field && (
          <p className="text-sm text-destructive">{errors.field.message}</p>
        )}
      </div>
    </CardContent>
  </Card>
  <Button type="submit">Submit</Button>
</form>
```

**Features:**

- React Hook Form integration
- Zod validation
- Error messages
- Loading states
- Accessible labels

### 3. Status Badges

```tsx
<Badge className={getRoomStatusColor(status)}>{status}</Badge>
```

**Pattern:**

- Color-coded by status
- Consistent styling
- Utility function for colors

### 4. Confirmation Dialogs

```tsx
<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Confirm Action</DialogTitle>
      <DialogDescription>Are you sure?</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button variant="destructive" onClick={onConfirm}>
        Confirm
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

**Usage:**

- Destructive actions (delete)
- Important confirmations
- Accessible with keyboard

---

## 🎯 Design Principles

### 1. **Consistency**

- Reuse components
- Follow established patterns
- Use design tokens (colors, spacing)

### 2. **Accessibility**

- Semantic HTML
- ARIA labels
- Keyboard navigation
- Focus management
- Screen reader support

### 3. **Responsiveness**

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Flexible layouts
- Touch-friendly targets (min 44x44px)

### 4. **Performance**

- Lazy loading
- Code splitting
- Optimized images
- Minimal bundle size

### 5. **User Feedback**

- Loading states
- Success/error messages
- Optimistic updates
- Confirmation dialogs

---

## 📚 References & Resources

### Official Documentation

1. **shadcn/ui**
   - Docs: https://ui.shadcn.com/docs
   - Components: https://ui.shadcn.com/docs/components
   - Themes: https://ui.shadcn.com/themes

2. **Radix UI**
   - Docs: https://www.radix-ui.com/primitives/docs/overview/introduction
   - Components: https://www.radix-ui.com/primitives/docs/components

3. **Tailwind CSS**
   - Docs: https://tailwindcss.com/docs
   - Utilities: https://tailwindcss.com/docs/utility-first

4. **Lucide Icons**
   - Icons: https://lucide.dev/icons/
   - React: https://lucide.dev/guide/packages/lucide-react

### Design Inspiration

1. **Vercel Dashboard** - Clean, modern dashboard design
2. **Linear App** - Minimalist, fast UI
3. **Stripe Dashboard** - Professional data tables
4. **GitHub UI** - Accessible, consistent components

---

## 🛠️ How to Add New Components

### From shadcn/ui

```bash
# Install a new component
npx shadcn-ui@latest add [component-name]

# Example: Add Tabs component
npx shadcn-ui@latest add tabs
```

### Custom Components

1. Create in `components/ui/` or `components/`
2. Follow existing patterns
3. Use Tailwind utilities
4. Make it accessible
5. Add TypeScript types
6. Document usage

### Example Custom Component

```tsx
// components/ui/status-badge.tsx
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "active" | "inactive" | "pending";
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const colors = {
    active: "bg-green-100 text-green-800",
    inactive: "bg-gray-100 text-gray-800",
    pending: "bg-yellow-100 text-yellow-800",
  };

  return <Badge className={cn(colors[status], className)}>{status}</Badge>;
}
```

---

## 🎨 Customization

### Theme Colors

Edit `app/globals.css`:

```css
@layer base {
  :root {
    --primary: 142 71% 45%; /* #1baa56 */
    --primary-foreground: 0 0% 100%;
    /* ... other colors */
  }
}
```

### Component Variants

Use `class-variance-authority` (CVA):

```tsx
import { cva } from "class-variance-authority";

const buttonVariants = cva("base-classes", {
  variants: {
    variant: {
      default: "bg-primary text-primary-foreground",
      destructive: "bg-destructive text-destructive-foreground",
    },
    size: {
      default: "h-10 px-4 py-2",
      sm: "h-9 px-3",
      lg: "h-11 px-8",
    },
  },
});
```

---

## ✅ Summary

**Design System Stack:**

- 🎨 **shadcn/ui** - Component library
- ♿ **Radix UI** - Accessible primitives
- 🎯 **Tailwind CSS** - Utility-first styling
- 🎭 **Lucide Icons** - Icon system
- 📱 **Responsive** - Mobile-first design
- ♿ **Accessible** - WCAG 2.1 AA compliant

**Key Features:**

- ✅ Copy-paste components (not npm dependencies)
- ✅ Fully customizable
- ✅ Type-safe with TypeScript
- ✅ Accessible by default
- ✅ Dark mode ready
- ✅ Production-ready

**Philosophy:**

> "Own your components. Copy, paste, and customize. Not a component library, but a collection of reusable components that you can copy and paste into your apps."
> — shadcn/ui

Ini memberikan **full control** atas UI components sambil tetap mengikuti **best practices** untuk accessibility dan user experience! 🚀
