# Fal Parts Brand Color System

## Overview

This document outlines the comprehensive color system for Fal Parts, based on the logo colors:

- **Primary (Gold)**: `#b3984a` - Main brand color
- **Secondary (Black)**: `#272627` - Text and structure
- **Accent (Red)**: `#e62626` - Calls to action and highlights

## Color Palette

### Logo Colors

```css
--logo-black: #272627
--logo-gold: #b3984a
--logo-red: #e62626
```

### Primary Colors (Gold)

```css
--primary-50: #fdfbf7
--primary-100: #f9f5ed
--primary-200: #f3e9d8
--primary-300: #e8d4b8
--primary-400: #d9b98a
--primary-500: #b3984a  /* Main brand color */
--primary-600: #a28a3e
--primary-700: #8a7233
--primary-800: #6f5b2a
--primary-900: #5a4a22
```

### Secondary Colors (Black)

```css
--secondary-50: #f5f5f5
--secondary-100: #e7e7e7
--secondary-200: #d1d1d1
--secondary-300: #b0b0b0
--secondary-400: #888888
--secondary-500: #6d6d6d
--secondary-600: #5d5d6d
--secondary-700: #4f4f4f
--secondary-800: #454545
--secondary-900: #272627  /* Main brand color */
```

### Accent Colors (Red)

```css
--accent-50: #fef2f2
--accent-100: #fee2e2
--accent-200: #fecaca
--accent-300: #fca5a5
--accent-400: #f87171
--accent-500: #e62626  /* Main brand color */
--accent-600: #dc2626
--accent-700: #b91c1c
--accent-800: #991b1b
--accent-900: #7f1d1d
```

### Neutral Colors

```css
--neutral-50: #fafafa
--neutral-100: #f5f5f5
--neutral-200: #eeeeee
--neutral-300: #e0e0e0
--neutral-400: #bdbdbd
--neutral-500: #9e9e9e
--neutral-600: #757575
--neutral-700: #616161
--neutral-800: #424242
--neutral-900: #212121
```

### Status Colors

```css
--success-main: #4caf50
--success-light: #81c784
--success-dark: #388e3c

--warning-main: #ff9800
--warning-light: #ffb74d
--warning-dark: #f57c00

--error-main: #e62626
--error-light: #ef5350
--error-dark: #d32f2f

--info-main: #2196f3
--info-light: #64b5f6
--info-dark: #1976d2
```

## Usage Guidelines

### 1. Primary Color (Gold) - `#b3984a`

**Use for:**

- Main brand elements
- Primary buttons
- Active navigation states
- Important highlights
- Brand logos and icons

**Examples:**

```jsx
// Primary button
<Button className="bg-primary text-white">Primary Action</Button>

// Active navigation
<Link className="text-primary">Active Link</Link>

// Brand highlight
<div className="text-primary font-bold">Brand Text</div>
```

### 2. Secondary Color (Black) - `#272627`

**Use for:**

- Main text content
- Headers and titles
- Secondary buttons
- Borders and dividers
- Footer content

**Examples:**

```jsx
// Main text
<p className="text-secondary-900">Main content text</p>

// Secondary button
<Button className="bg-secondary text-white">Secondary Action</Button>

// Headers
<h1 className="text-secondary-900 font-bold">Page Title</h1>
```

### 3. Accent Color (Red) - `#e62626`

**Use for:**

- Calls to action
- Error states
- Sale badges
- Important alerts
- Delete actions

**Examples:**

```jsx
// Sale badge
<div className="bg-accent text-white">SALE</div>

// Error message
<div className="text-accent">Error occurred</div>

// Delete button
<Button className="bg-accent text-white">Delete</Button>
```

### 4. Neutral Colors

**Use for:**

- Background colors
- Disabled states
- Placeholder text
- Borders
- Subtle text

**Examples:**

```jsx
// Background
<div className="bg-neutral-50">Light background</div>

// Disabled text
<span className="text-neutral-400">Disabled text</span>

// Border
<div className="border-neutral-200">Bordered element</div>
```

## Component Usage

### Buttons

```jsx
// Primary button (Gold)
<Button variant="default" className="bg-primary text-white">
  Primary Action
</Button>

// Secondary button (Black)
<Button variant="secondary" className="bg-secondary text-white">
  Secondary Action
</Button>

// Accent button (Red)
<Button className="bg-accent text-white">
  Delete
</Button>
```

### Cards

```jsx
// Standard card
<div className="bg-card border border-border rounded-lg p-4">
  <h3 className="text-card-foreground font-bold">Card Title</h3>
  <p className="text-muted-foreground">Card content</p>
</div>
```

### Navigation

```jsx
// Active link
<Link className="text-primary font-medium">Active Page</Link>

// Inactive link
<Link className="text-neutral-600 hover:text-primary">Other Page</Link>
```

### Status Indicators

```jsx
// Success
<div className="text-success-main">Success message</div>

// Warning
<div className="text-warning-main">Warning message</div>

// Error
<div className="text-error-main">Error message</div>

// Info
<div className="text-info-main">Info message</div>
```

## Dark Mode Support

The color system automatically adapts to dark mode:

```css
/* Light mode */
--background: #ffffff
--foreground: #272627
--card: #ffffff
--card-foreground: #272627

/* Dark mode */
--background: #121212
--foreground: #ffffff
--card: #1e1e1e
--card-foreground: #ffffff
```

## Implementation

### 1. CSS Variables

All colors are defined as CSS custom properties in `globals.css`:

```css
:root {
  --primary: #b3984a;
  --secondary: #272627;
  --accent: #e62626;
  /* ... other colors */
}
```

### 2. Tailwind Classes

Use Tailwind's arbitrary value syntax for custom colors:

```jsx
<div className="bg-[#b3984a] text-white">Custom color</div>
```

### 3. Color Utility

Import the color utility for programmatic access:

```jsx
import { colors } from "@/lib/colors";

const primaryColor = colors.primary[500]; // #b3984a
```

## Best Practices

1. **Consistency**: Always use the defined color palette
2. **Accessibility**: Ensure sufficient contrast ratios
3. **Semantic Usage**: Use colors for their intended purpose
4. **Dark Mode**: Test all color combinations in both light and dark modes
5. **Brand Identity**: Maintain the gold/black/red color scheme

## Migration Guide

When updating existing components:

1. Replace `gray-*` with `neutral-*`
2. Replace `blue-*` with `info-*`
3. Replace `red-*` with `accent-*` or `error-*`
4. Replace `green-*` with `success-*`
5. Replace `yellow-*` with `warning-*`
6. Use `primary` for brand elements
7. Use `secondary` for text and structure

Example migration:

```jsx
// Before
<div className="bg-gray-100 text-gray-900 border-gray-200">
  <span className="text-blue-600">Link</span>
</div>

// After
<div className="bg-neutral-100 text-neutral-900 border-neutral-200">
  <span className="text-primary">Link</span>
</div>
```
