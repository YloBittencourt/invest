/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0F172A', 
        muted: '#6E7889',   
        
        // Cobre os erros: bg-ink e border-ink-border
        ink: {
          DEFAULT: '#FFFFFF', // Fundo branco
          border: '#E2E8F0',  // Borda cinza claro
        },
        
        // Cobre o erro: text-text-primary
        text: {
          primary: '#0F172A',
        },

        // Cobre o erro: bg-cta/30
        cta: {
          DEFAULT: '#F0B429', // Mantive o amarelo do seu focus-visible
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        // Cobre o erro: font-body
        body: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}