// Global JSX declarations for custom elements and web components

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'ion-icon': {
        name?: string
        size?: string
        color?: string
        class?: string
      }
    }
  }
}

export {}
