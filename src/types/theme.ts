/**
 * Theme interface defining all design tokens for the application
 * Follows semantic naming conventions for better maintainability
 */
export interface Theme {
  // Surface & Backgrounds
  background: string
  backgroundSecondary: string
  backgroundTertiary: string
  backgroundElevated: string
  backgroundVariant: string
  backgroundApp: string
  surface: string

  // Text & Content
  textPrimary: string
  textSecondary: string
  textMuted: string
  textOnCard: string
  textOnCardSecondary: string

  // Brand & Action Colors
  primary: string
  accent: string
  neutral: string

  // UI Elements
  navHeight: string
  toggleActive: string
  toggleTranslate: string
  scrollbar: string
  shadow: string
  border: string

  // Typography Scale
  fontSizeXS: string
  fontSizeSM: string
  fontSizeMD: string
  fontSizeLG: string
  fontSizeXL: string
  fontSizeXXL: string
  fontSizeXXXL: string

  // RGBA Helpers (for dynamic alpha compositions)
  backgroundRgba: string
  textRgba: string
  overlayAlpha: string

  // Legacy aliases for backwards compatibility
  // TODO: Remove after migration is complete
  body: string // alias for background
  text: string // alias for textPrimary
  bodyRgba: string // alias for backgroundRgba
  carouselColor: string // alias for primary
  fontxs: string // alias for fontSizeXS
  fontsm: string // alias for fontSizeSM
  fontmd: string // alias for fontSizeMD
  font16px: string // alias for fontSizeMD
  fontlg: string // alias for fontSizeLG
  fontxl: string // alias for fontSizeXL
  fontxxl: string // alias for fontSizeXXL
  fontxxxl: string // alias for fontSizeXXXL
  fontButton: string // alias for fontSizeMD
  whiteBg: string // alias for background
  bg: string // alias for backgroundSecondary
  bgAlpha: string // alias for overlayAlpha
  bg2: string // alias for backgroundTertiary
  bg3: string // alias for backgroundElevated
  bg4: string // alias for backgroundVariant
  bg5: string // alias for backgroundVariant
  bg6: string // alias for surface
  bgtotal: string // alias for backgroundApp
  bgtgderecha: string // alias for surface
  backgroundSecondarytotal: string // alias for backgroundApp (typo in code)
  backgroundSecondaryAlpha: string // alias for overlayAlpha (typo in code)
  backgroundSecondary3: string // alias for backgroundElevated (typo in code)
  backgroundSecondary4: string // alias for backgroundVariant (typo in code)
  backgroundSecondary5: string // alias for backgroundVariant (typo in code)
  backgroundSecondary6: string // alias for surface (typo in code)
  backgroundSecondarytgderecha: string // alias for surface (typo in code)
  backgroundSecondarycards: string // alias for surface (typo in code)
  textSecondarycard: string // alias for textOnCard (typo in code)
  colorToggle: string // alias for toggleActive
  translateToggle: string // alias for toggleTranslate
  logorotate: string // constant value
  slideroffset: string // constant value
  sizeoficon: string // constant value
  colorSubtitle: string // alias for textSecondary
  colorScroll: string // alias for scrollbar
  bgcards: string // alias for surface
  colortitlecard: string // alias for textOnCard
  colorsubtitlecard: string // alias for textOnCardSecondary
  color1: string // alias for accent
  color2: string // alias for neutral
  bordercolorDash: string // alias for border
  boxshadow: string // alias for shadow
  placeholder: string // alias for textMuted
}

declare module 'styled-components' {
  export interface DefaultTheme extends Theme { }
}
