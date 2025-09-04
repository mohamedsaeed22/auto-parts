# Responsive and RTL Design Guide

## Overview
This guide explains how to use our responsive and RTL-aware components to build consistent layouts across all screen sizes and language directions.

## Layout Components

### Layout
Base layout component that handles RTL/LTR direction and responsive container widths.

```tsx
import { Layout } from "@/components/ui/layout";

// Basic usage
<Layout>
  <h1>Content</h1>
</Layout>

// Full width
<Layout fullWidth>
  <h1>Content</h1>
</Layout>
```

### Container
Responsive container with predefined max-widths.

```tsx
import { Container } from "@/components/ui/container";

// Available sizes: sm, md, lg, xl, full
<Container size="lg">
  <h1>Content</h1>
</Container>
```

### Grid
Responsive grid layout system.

```tsx
import { Grid } from "@/components/ui/grid";

// Responsive columns
<Grid cols={4} gap={6}>
  <div>Item 1</div>
  <div>Item 2</div>
</Grid>
```

### Section
Consistent page section with spacing and background variants.

```tsx
import { Section } from "@/components/ui/section";

<Section
  spacing="lg"
  background="light"
  containerSize="xl"
>
  <h1>Section Content</h1>
</Section>
```

### Flex
RTL-aware flex container with responsive options.

```tsx
import { Flex } from "@/components/ui/flex";

<Flex
  direction="row"
  align="center"
  justify="between"
  responsive
  gap={4}
>
  <div>Left/Right Content</div>
  <div>Right/Left Content</div>
</Flex>
```

## RTL Support

### Text Alignment
Use the provided utility functions for RTL-aware text alignment:

```tsx
import { getTextAlign, getOppositeTextAlign } from "@/lib/i18n/config";

// In your component
const textAlign = getTextAlign(locale); // "left" or "right"
```

### Flex Direction
Use the provided utility functions for RTL-aware flex direction:

```tsx
import { getFlexDirection, getOppositeFlexDirection } from "@/lib/i18n/config";

// In your component
const flexDirection = getFlexDirection(locale); // "row" or "row-reverse"
```

## Responsive Design

### Breakpoints
We follow Tailwind CSS breakpoints:
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px
- 2xl: 1536px

### Best Practices
1. Always start with mobile-first design
2. Use the provided components for consistent layouts
3. Test all layouts in both RTL and LTR modes
4. Ensure text and content flow properly in both directions
5. Use relative units (rem, em) instead of fixed pixels
6. Test on various screen sizes and devices

## Translation Structure

### Namespaces
Organize translations by feature/page:
```typescript
import { namespaces } from "@/lib/i18n/config";

// Available namespaces:
// - common, header, footer, cart
// - home, about, contact, products, categories
// - auth, product, checkout, profile
// - forms, buttons, notifications, validation
```

### Usage in Components
```tsx
import { useTranslation } from "react-i18next";

function MyComponent() {
  const { t, i18n } = useTranslation(["common", "products"]);
  const isRTL = i18n.language === "ar";

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      {t("common:title")}
    </div>
  );
}
```

## Testing

### RTL Testing
1. Test all components in both RTL and LTR modes
2. Verify text alignment and content flow
3. Check button and icon positioning
4. Validate form layouts and input fields
5. Test navigation and menu components

### Responsive Testing
1. Test on multiple devices and orientations
2. Verify layout at all breakpoints
3. Check touch targets on mobile devices
4. Validate image scaling and aspect ratios
5. Test navigation and menu behavior