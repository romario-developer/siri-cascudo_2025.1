import { unifiedTheme } from '@siri-cascudo/shared/styles/theme';

export const theme = unifiedTheme;
      large: '1.25rem',        // 20px
      xlarge: '1.5rem',        // 24px
      xxlarge: '2rem',         // 32px
    },
    breakpoints: {
      mobile: '576px',
      tablet: '768px',
      desktop: '992px',
      largeDesktop: '1200px',
    },
    spacing: {
      xxsmall: '0.25rem',      // 4px
      xsmall: '0.5rem',        // 8px
      small: '0.75rem',        // 12px
      medium: '1rem',          // 16px
      large: '1.5rem',         // 24px
      xlarge: '2rem',          // 32px
      xxlarge: '3rem',         // 48px
    },
    borderRadius: {
      small: '4px',
      medium: '8px',
      large: '16px',
      round: '50%',
    },
    shadows: {
      small: '0 2px 4px rgba(0, 0, 0, 0.1)',
      medium: '0 4px 8px rgba(0, 0, 0, 0.1)',
      large: '0 8px 16px rgba(0, 0, 0, 0.1)',
    },
    transitions: {
      fast: '0.2s ease',
      medium: '0.3s ease',
      slow: '0.5s ease',
    },
  };
  
  export default theme;