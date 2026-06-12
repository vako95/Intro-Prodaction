export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px',
  xxxl: '64px'
};

export const typography = {
  fontFamily: {
    primary: '"Google Sans Flex", sans-serif',
    heading: '"Gilda Display", serif',
    mono: 'monospace'
  },
  fontSize: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '28px',
    '4xl': '32px',
    '5xl': '40px'
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75
  }
};

export const colors = {
  primary: {
    main: 'rgba(170, 132, 83, 1)',
    light: 'rgba(204, 159, 100, 1)',
    dark: 'rgba(136, 106, 66, 1)',
    alpha: {
      10: 'rgba(170, 132, 83, 0.1)',
      20: 'rgba(170, 132, 83, 0.2)',
      30: 'rgba(170, 132, 83, 0.3)',
      50: 'rgba(170, 132, 83, 0.5)'
    }
  },
  neutral: {
    black: '#000000',
    white: '#FFFFFF',
    gray: {
      50: '#F9F9F9',
      100: '#F5F5F5',
      200: '#EEEEEE',
      300: '#DDDDDD',
      400: '#CCCCCC',
      500: '#999999',
      600: '#666666',
      700: '#555555',
      800: '#333333',
      900: '#222222'
    }
  },
  semantic: {
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6'
  },
  background: {
    primary: '#000000',
    secondary: 'rgba(20, 18, 18, 1)',
    overlay: 'rgba(0, 0, 0, 0.68)',
    card: '#FFFFFF'
  }
};

export const borderRadius = {
  none: '0',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  full: '9999px'
};

export const shadows = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  md: '0 2px 8px rgba(0, 0, 0, 0.1)',
  lg: '0 4px 12px rgba(0, 0, 0, 0.15)',
  xl: '0 8px 16px rgba(0, 0, 0, 0.15)',
  '2xl': '0 12px 24px rgba(0, 0, 0, 0.2)'
};

export const transitions = {
  fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  normal: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '500ms cubic-bezier(0.4, 0, 0.2, 1)'
};

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
};

export const zIndex = {
  base: 1,
  dropdown: 100,
  sticky: 200,
  modal: 1000,
  popover: 1100,
  tooltip: 1200
};
