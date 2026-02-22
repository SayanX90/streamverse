/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#0F0F0F',
                card: '#1A1A1A',
                accent: '#E50914',
                secondary: '#1DB954',
                textPrimary: '#FFFFFF',
                textSecondary: '#9CA3AF'
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            keyframes: {
                'zoom-in-out': {
                    '0%': { transform: 'scale(1)' },
                    '100%': { transform: 'scale(1.1)' },
                },
                'slide-up': {
                    '0%': { transform: 'translateY(100%)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                }
            },
            animation: {
                'zoom-in-out': 'zoom-in-out 20s infinite alternate',
                'slide-up': 'slide-up 0.5s ease-out forwards',
            }
        },
    },
    plugins: [],
}
