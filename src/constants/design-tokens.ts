export const designTokens = {
  colors: {
    primary: {
      0: '#9C7626',
      1: '#FFCE69',
      2: '#FFF6E4',
    },
    secondary: {
      0: '#1E3E90',
      1: '#799EFF',
      2: '#D3DFFF',
    },
    accent: {
      red: '#FF696C',
      green: '#5EB930',
      orange: '#FFBE69',
      pink: '#FF69FC',
      sky: '#69DCFF',
      light: {
        red: '#FFD7D7',
        green: '#D5FFC0',
        orange: '#FFEDD5',
        pink: '#FFD7F6',
        sky: '#D7F9FF',
      },
    },
    gray: {
      primary: {
        0: '#685D4F',
        1: '#EBE1D5',
        2: '#F0E9E2',
      },
      accent: {
        blue: '#6B678B',
        red: '#9C716F',
        green: '#6D895F',
      },
    },
    background: '#FFFCEB',
    dark: '#473100',
    light: '#FFFEF4',
  },
  
  gradients: {
    google: 'linear-gradient(135deg, #4285F4 0%, #EA4335 35%, #FBBC05 68%, #34A853 100%)',
    predict: {
      safe: {
        1: 'linear-gradient(135deg, #D5FFC0 0%, #FFFEF4 23%, #FFFEF4 80%, #5EB930 100%)',
        2: 'linear-gradient(135deg, #5EB930 0%, rgba(255, 254, 244, 0) 23%)',
      },
      danger: {
        1: 'linear-gradient(135deg, #FFD7D7 0%, #FFFEF4 23%, #FFFEF4 80%, #FF696C 100%)',
        2: 'linear-gradient(135deg, #FF696C 0%, rgba(255, 254, 244, 0) 23%)',
      },
    },
    role: {
      admin: 'linear-gradient(135deg, #EBE1D5 0%, #FFF6E4 23%, #FFFEF4 80%, #FFCE69 100%)',
      masterAdmin: 'linear-gradient(135deg, #D3DFFF 0%, #FFD7D7 23%, #FFFEF4 80%, #799EFF 100%)',
    },
  },
  
  shadows: {
    sm: '2px 2px 2px rgba(71, 49, 0, 0.15), inset -4px 0 4px rgba(71, 49, 0, 0.05)',
    xl: '2px 4px 6px rgba(71, 49, 0, 0.25)',
    huge: '4px 8px 8px rgba(71, 49, 0, 0.5)',
  },
  
  spacing: {
    xs: '2px',
    sm: '4px',
    md: '8px',
    xl: '12px',
  },
} as const;

export type DesignTokens = typeof designTokens;
