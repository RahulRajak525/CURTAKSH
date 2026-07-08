/** @type {import('tailwindcss').Config} */

// Colours are driven by runtime-mutable CSS variables (see styles/tokens.css and
// lib/theme.ts). Each palette entry reads an RGB channel triplet var so that
// Tailwind's `/<alpha>` opacity modifiers keep working while the Light Engine
// lerps the values live.
const channel = (name) => `rgb(var(${name}) / <alpha-value>)`

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: channel('--bg-rgb'),
        surface: channel('--surface-rgb'),
        ink: channel('--ink-rgb'),
        muted: channel('--muted-rgb'),
        line: channel('--line-rgb'),
        accent: channel('--accent-rgb'),
        glow: channel('--glow-rgb'),
      },
      fontFamily: {
        display: 'var(--font-display)',
        sans: 'var(--font-sans)',
        mono: 'var(--font-mono)',
      },
      fontSize: {
        // Fluid type scale — clamp(min, preferred, max)
        'display-1': [
          'clamp(3rem, 8vw, 8rem)',
          { lineHeight: '0.94', letterSpacing: '-0.03em', fontWeight: '400' },
        ],
        'display-2': [
          'clamp(2.25rem, 5.5vw, 5rem)',
          { lineHeight: '0.98', letterSpacing: '-0.025em', fontWeight: '400' },
        ],
        h1: [
          'clamp(2rem, 4vw, 3.5rem)',
          { lineHeight: '1.04', letterSpacing: '-0.02em' },
        ],
        h2: [
          'clamp(1.6rem, 3vw, 2.5rem)',
          { lineHeight: '1.08', letterSpacing: '-0.015em' },
        ],
        h3: [
          'clamp(1.3rem, 2.2vw, 1.85rem)',
          { lineHeight: '1.15', letterSpacing: '-0.01em' },
        ],
        h4: [
          'clamp(1.1rem, 1.6vw, 1.35rem)',
          { lineHeight: '1.25', letterSpacing: '-0.005em' },
        ],
        body: [
          'clamp(1rem, 1.1vw, 1.125rem)',
          { lineHeight: '1.6', letterSpacing: '0' },
        ],
        small: ['0.875rem', { lineHeight: '1.5' }],
        label: [
          '0.72rem',
          { lineHeight: '1', letterSpacing: '0.15em', fontWeight: '500' },
        ],
      },
      spacing: {
        // 4px base scale is Tailwind's default; add named section rhythm.
        section: 'clamp(96px, 14vh, 220px)',
        gutter: 'clamp(20px, 5vw, 80px)',
      },
      maxWidth: {
        container: '1440px',
        prose: '68ch',
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '16px',
        xl: '24px',
      },
      backdropBlur: {
        glass: '20px',
      },
      boxShadow: {
        // Light-reactive shadow driven by theme vars.
        soft: '0 var(--shadow-y) var(--shadow-blur) rgb(var(--shadow-color-rgb) / var(--shadow-alpha))',
        glow: '0 0 60px -10px rgb(var(--glow-rgb) / 0.45)',
      },
      transitionTimingFunction: {
        settle: 'cubic-bezier(0.22, 1, 0.36, 1)',
        entrance: 'cubic-bezier(0.16, 1, 0.3, 1)',
        drape: 'cubic-bezier(0.83, 0, 0.17, 1)',
      },
      transitionDuration: {
        fast: '200ms',
        base: '450ms',
        slow: '800ms',
        cinematic: '1200ms',
      },
    },
  },
  plugins: [],
}
