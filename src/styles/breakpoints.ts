// Breakpoint definitions for responsive design
export const sizes = {
  mobile: '576px',
  tablet: '768px',
  laptop: '992px',
  desktop: '1200px',
} as const

export const Device = {
  mobile: `(min-width: ${sizes.mobile})`,
  tablet: `(min-width: ${sizes.tablet})`,
  laptop: `(min-width: ${sizes.laptop})`,
  desktop: `(min-width: ${sizes.desktop})`,
} as const
