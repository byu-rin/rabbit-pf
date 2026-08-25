/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Lab monochrome (dark-gray computational lab) ──
        lab: {
          void: '#08080a',
          ink: '#0a0a0b',
          carbon: '#0f0f11',
          slate: '#141417',
          panel: '#17171b',
          ash: '#26262b',
          steel: '#3a3a42',
          fog: '#5c5c66',
          mist: '#8a8a94',
          chalk: '#c4c4cc',
          glow: '#e8e8ee',
        },

        // Primary Brand
        cosmic: {
          lavender: '#B5A7D6',
          blue: '#6B7AA1',
        },
        milky: {
          white: '#F7F5FB',
          cloud: '#FAFBFC',
        },
        deep: {
          space: '#1A1629',
        },

        // Secondary Brand
        peach: {
          dream: '#F5D5B8',
        },
        sage: {
          green: '#A8C5A6',
        },
        dusty: {
          rose: '#C4A9A0',
        },
        silver: {
          mist: '#D9D7E3',
        },

        // Backgrounds
        twilight: {
          gray: '#E8E6F0',
        },
        stone: {
          gray: '#B0ADB9',
        },

        // Text
        dusky: {
          blue: '#3E3B4E',
        },
        soft: {
          gray: '#7A7885',
        },

        // Interactive
        active: {
          cosmic: '#9B8CC0',
          green: '#8CB68A',
        },
        focus: {
          ring: '#6B7AA1',
        },

        // Galaxy
        nebula: {
          purple: '#8B5A8E',
        },
        galaxy: {
          navy: '#2D1B3D',
          cyan: '#4A9BA8',
        },
        star: {
          gold: '#F4D46F',
        },

        // Rabbit
        rabbit: {
          cream: '#F5E6D3',
          brown: '#8B6F47',
          pink: '#D9A4A4',
          eye: '#2D1B1B',
        },

        // Bottle
        bottle: {
          glass: '#C5E8E8',
          shadow: '#7BA3A8',
          cap: '#F4D46F',
        },
        water: {
          blue: '#5DADE2',
        },
      },
      fontFamily: {
        display: ['"Space Mono"', 'monospace'],
        heading: ['"IBM Plex Mono"', 'monospace'],
        body: ['"IBM Plex Mono"', 'monospace'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      fontSize: {
        'hero': '72px',
        'page-title': '48px',
        'section-title': '32px',
        'lg-heading': '24px',
        'heading': '18px',
        'body': '16px',
        'small': '14px',
        'tiny': '12px',
      },
      lineHeight: {
        'tight': '1.1',
        'normal': '1.2',
        'relaxed': '1.6',
      },
      letterSpacing: {
        'tight': '0.25px',
        'normal': '0.5px',
        'loose': '1px',
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '40px',
        '2xl': '60px',
        '3xl': '80px',
      },
      borderRadius: {
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px',
      },
      boxShadow: {
        'subtle': '0 2px 8px rgba(26, 22, 41, 0.08)',
        'medium': '0 4px 16px rgba(26, 22, 41, 0.12)',
        'deep': '0 8px 24px rgba(26, 22, 41, 0.15)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'twinkle': 'twinkle 3s ease-in-out infinite',
        'drift': 'drift 30s linear infinite',
        'blink': 'blink 0.1s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '0.8' },
        },
        drift: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '33%': { transform: 'translate(5%, 2%)' },
          '66%': { transform: 'translate(-3%, -4%)' },
        },
        blink: {
          '0%': { opacity: '1' },
          '50%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
