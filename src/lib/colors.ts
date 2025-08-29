/**
 * Brand Color Palette for Fal Parts
 * Based on logo colors: #272627 (Black), #b3984a (Gold), #e62626 (Red)
 */

export const colors = {
  // Logo Colors
  logo: {
    black: "#272627",
    gold: "#b3984a",
    red: "#e62626",
  },

  // Primary Brand Colors (Gold)
  primary: {
    50: "#fdfbf7",
    100: "#f9f5ed",
    200: "#f3e9d8",
    300: "#e8d4b8",
    400: "#d9b98a",
    500: "#b3984a", // Main brand color
    600: "#a28a3e",
    700: "#8a7233",
    800: "#6f5b2a",
    900: "#5a4a22",
  },

  // Secondary Brand Colors (Black)
  secondary: {
    50: "#f5f5f5",
    100: "#e7e7e7",
    200: "#d1d1d1",
    300: "#b0b0b0",
    400: "#888888",
    500: "#6d6d6d",
    600: "#5d5d5d",
    700: "#4f4f4f",
    800: "#454545",
    900: "#272627", // Main brand color
  },

  // Accent Colors (Red)
  accent: {
    50: "#fef2f2",
    100: "#fee2e2",
    200: "#fecaca",
    300: "#fca5a5",
    400: "#f87171",
    500: "#e62626", // Main brand color
    600: "#dc2626",
    700: "#b91c1c",
    800: "#991b1b",
    900: "#7f1d1d",
  },

  // Neutral Colors
  neutral: {
    50: "#fafafa",
    100: "#f5f5f5",
    200: "#eeeeee",
    300: "#e0e0e0",
    400: "#bdbdbd",
    500: "#9e9e9e",
    600: "#757575",
    700: "#616161",
    800: "#424242",
    900: "#212121",
  },

  // Status Colors
  success: {
    light: "#81c784",
    main: "#4caf50",
    dark: "#388e3c",
  },

  warning: {
    light: "#ffb74d",
    main: "#ff9800",
    dark: "#f57c00",
  },

  error: {
    light: "#ef5350",
    main: "#e62626", // Same as accent.red
    dark: "#d32f2f",
  },

  info: {
    light: "#64b5f6",
    main: "#2196f3",
    dark: "#1976d2",
  },
} as const;

/**
 * CSS Custom Properties for use in styled-components or CSS
 */
export const cssVariables = {
  // Logo Colors
  "--logo-black": colors.logo.black,
  "--logo-gold": colors.logo.gold,
  "--logo-red": colors.logo.red,

  // Primary Colors
  "--primary-50": colors.primary[50],
  "--primary-100": colors.primary[100],
  "--primary-200": colors.primary[200],
  "--primary-300": colors.primary[300],
  "--primary-400": colors.primary[400],
  "--primary-500": colors.primary[500],
  "--primary-600": colors.primary[600],
  "--primary-700": colors.primary[700],
  "--primary-800": colors.primary[800],
  "--primary-900": colors.primary[900],

  // Secondary Colors
  "--secondary-50": colors.secondary[50],
  "--secondary-100": colors.secondary[100],
  "--secondary-200": colors.secondary[200],
  "--secondary-300": colors.secondary[300],
  "--secondary-400": colors.secondary[400],
  "--secondary-500": colors.secondary[500],
  "--secondary-600": colors.secondary[600],
  "--secondary-700": colors.secondary[700],
  "--secondary-800": colors.secondary[800],
  "--secondary-900": colors.secondary[900],

  // Accent Colors
  "--accent-50": colors.accent[50],
  "--accent-100": colors.accent[100],
  "--accent-200": colors.accent[200],
  "--accent-300": colors.accent[300],
  "--accent-400": colors.accent[400],
  "--accent-500": colors.accent[500],
  "--accent-600": colors.accent[600],
  "--accent-700": colors.accent[700],
  "--accent-800": colors.accent[800],
  "--accent-900": colors.accent[900],

  // Status Colors
  "--success-light": colors.success.light,
  "--success-main": colors.success.main,
  "--success-dark": colors.success.dark,
  "--warning-light": colors.warning.light,
  "--warning-main": colors.warning.main,
  "--warning-dark": colors.warning.dark,
  "--error-light": colors.error.light,
  "--error-main": colors.error.main,
  "--error-dark": colors.error.dark,
  "--info-light": colors.info.light,
  "--info-main": colors.info.main,
  "--info-dark": colors.info.dark,
} as const;

/**
 * Tailwind CSS class names for common color combinations
 */
export const colorClasses = {
  // Primary brand colors
  "bg-primary": "bg-[#b3984a]",
  "text-primary": "text-[#b3984a]",
  "border-primary": "border-[#b3984a]",
  "hover:bg-primary": "hover:bg-[#b3984a]",
  "hover:text-primary": "hover:text-[#b3984a]",
  "hover:border-primary": "hover:border-[#b3984a]",

  // Secondary brand colors
  "bg-secondary": "bg-[#272627]",
  "text-secondary": "text-[#272627]",
  "border-secondary": "border-[#272627]",
  "hover:bg-secondary": "hover:bg-[#272627]",
  "hover:text-secondary": "hover:text-[#272627]",
  "hover:border-secondary": "hover:border-[#272627]",

  // Accent brand colors
  "bg-accent": "bg-[#e62626]",
  "text-accent": "text-[#e62626]",
  "border-accent": "border-[#e62626]",
  "hover:bg-accent": "hover:bg-[#e62626]",
  "hover:text-accent": "hover:text-[#e62626]",
  "hover:border-accent": "hover:border-[#e62626]",

  // Logo colors
  "bg-logo-gold": "bg-[#b3984a]",
  "text-logo-gold": "text-[#b3984a]",
  "border-logo-gold": "border-[#b3984a]",
  "bg-logo-black": "bg-[#272627]",
  "text-logo-black": "text-[#272627]",
  "border-logo-black": "border-[#272627]",
  "bg-logo-red": "bg-[#e62626]",
  "text-logo-red": "text-[#e62626]",
  "border-logo-red": "border-[#e62626]",
} as const;

/**
 * Common color combinations for UI components
 */
export const uiColors = {
  // Buttons
  primaryButton: {
    background: colors.primary[500],
    text: "#ffffff",
    hover: colors.primary[600],
    border: colors.primary[500],
  },
  secondaryButton: {
    background: "transparent",
    text: colors.secondary[900],
    hover: colors.neutral[100],
    border: colors.secondary[900],
  },
  accentButton: {
    background: colors.accent[500],
    text: "#ffffff",
    hover: colors.accent[600],
    border: colors.accent[500],
  },

  // Cards
  card: {
    background: "#ffffff",
    border: colors.neutral[200],
    shadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
  },

  // Headers
  header: {
    background: "#ffffff",
    text: colors.secondary[900],
    border: colors.neutral[200],
  },

  // Navigation
  nav: {
    active: colors.primary[500],
    inactive: colors.neutral[600],
    hover: colors.primary[400],
  },

  // Status indicators
  status: {
    success: colors.success.main,
    warning: colors.warning.main,
    error: colors.error.main,
    info: colors.info.main,
  },
} as const;

export default colors;
