import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Outfit', 'sans-serif'],
        body: ['Sarabun', 'sans-serif'],
      },
      colors: {
        amber: {
          DEFAULT: '#F5B942',
          deep: '#E8A020',
          light: '#FDD07A',
          pale: '#FEF3D0',
        },
        brown: {
          DEFAULT: '#3D2B1F',
          mid: '#6B4226',
        },
        cream: '#FFFBF0',
        primary: {
          DEFAULT: '#FFCE69',
          dark: '#9C7626',
          light: '#FFF6E4',
          0: '#9C7626',
          1: '#FFCE69',
          2: '#FFF6E4',
        },
        secondary: {
          DEFAULT: '#799EFF',
          dark: '#1E3E90',
          light: '#D3DFFF',
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
        },
        'accent-light': {
          red: '#FFD7D7',
          green: '#D5FFC0',
          orange: '#FFEDD5',
          pink: '#FFD7F6',
          sky: '#D7F9FF',
        },
        gray: {
          primary: {
            DEFAULT: '#EBE1D5',
            dark: '#685D4F',
            light: '#F0E9E2',
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
        safe: '#5EB930',
        danger: '#FF696C',
        warning: '#FFBE69',
      },
      backgroundImage: {
        'gradient-google': 'linear-gradient(135deg, #4285F4 0%, #EA4335 35%, #FBBC05 68%, #34A853 100%)',
        'gradient-safe-1': 'linear-gradient(135deg, #D5FFC0 0%, #FFFEF4 23%, #FFFEF4 80%, #5EB930 100%)',
        'gradient-safe-2': 'linear-gradient(135deg, #5EB930 0%, rgba(255, 254, 244, 0) 23%)',
        'gradient-danger-1': 'linear-gradient(135deg, #FFD7D7 0%, #FFFEF4 23%, #FFFEF4 80%, #FF696C 100%)',
        'gradient-danger-2': 'linear-gradient(135deg, #FF696C 0%, rgba(255, 254, 244, 0) 23%)',
        'gradient-admin': 'linear-gradient(135deg, #EBE1D5 0%, #FFF6E4 23%, #FFFEF4 80%, #FFCE69 100%)',
        'gradient-master-admin': 'linear-gradient(135deg, #D3DFFF 0%, #FFD7D7 23%, #FFFEF4 80%, #799EFF 100%)',
      },
      boxShadow: {
        'sm': '2px 2px 2px rgba(71, 49, 0, 0.15), inset -4px 0 4px rgba(71, 49, 0, 0.05)',
        'xl': '2px 4px 6px rgba(71, 49, 0, 0.25)',
        'huge': '4px 8px 8px rgba(71, 49, 0, 0.5)',
      },
      spacing: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'xl': '12px',
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
      },
      animation: {
        'drift': 'drift 18s ease-in-out infinite',
        'float': 'floatMascot 4s ease-in-out infinite',
        'slide-left': 'slideLeft 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
        'slide-right': 'slideRight 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both',
        'fade-up': 'fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both',
        'fade-down': 'fadeDown 0.5s cubic-bezier(0.16, 1, 0.3, 1) both',
      },
      keyframes: {
        drift: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(30px, -20px) scale(1.05)' },
          '66%': { transform: 'translate(-20px, 30px) scale(0.95)' },
        },
        floatMascot: {
          '0%, 100%': { transform: 'translateY(0) rotate(-1deg)' },
          '50%': { transform: 'translateY(-10px) rotate(1deg)' },
        },
        slideLeft: {
          from: { opacity: '0', transform: 'translateX(-40px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        slideRight: {
          from: { opacity: '0', transform: 'translateX(40px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeDown: {
          from: { opacity: '0', transform: 'translateY(-20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
