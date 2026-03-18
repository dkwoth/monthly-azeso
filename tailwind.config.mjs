/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        accent: '#c0392b',
      },
      fontFamily: {
        sans: ['Pretendard', 'Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
      },
      fontSize: {
        logo: ['120px', { lineHeight: '1', fontWeight: '900' }],
        'logo-sm': ['60px', { lineHeight: '1', fontWeight: '900' }],
      },
      letterSpacing: {
        logo: '0.05em',
        wide: '0.1em',
      },
      transitionProperty: {
        card: 'transform, box-shadow',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
