/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  corePlugins: {
    preflight: false,
  },
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Calm, low-stimulation neurodivergent-friendly palette
        canvas: {
          light: '#f8faf9', // soft off-white with hint of sage
          dark: '#141816',
          card: '#ffffff',
          'card-dark': '#1c221f',
        },
        calm: {
          50: '#f4f7f5',
          100: '#e5ece7',
          200: '#cbd8ce',
          300: '#a5bcb0',
          400: '#7a9c8c',
          500: '#5a8270', // primary brand sage
          600: '#456758',
          700: '#385247',
          800: '#2f433b',
          900: '#283832',
        },
        slatecalm: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        status: {
          pending: '#854d0e', // soft accessible amber
          'pending-bg': '#fef9c3',
          in_progress: '#1e40af', // soft accessible blue
          'in_progress-bg': '#dbeafe',
          completed: '#115e59', // soft teal
          'completed-bg': '#ccfbf1',
          validated: '#166534', // calm forest green
          'validated-bg': '#dcfce7',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 8px -2px rgba(0, 0, 0, 0.05), 0 1px 4px -1px rgba(0, 0, 0, 0.03)',
        'soft-lg': '0 8px 20px -4px rgba(0, 0, 0, 0.06), 0 4px 10px -2px rgba(0, 0, 0, 0.03)',
      }
    },
  },
  plugins: [],
}
