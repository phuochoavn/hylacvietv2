/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                gold: {
                    50: '#faf5ef',
                    100: '#f5ebe0',
                    200: '#e8d5bd',
                    300: '#d4b896',
                    400: '#b8956e',
                    500: '#a37a52',
                    600: '#8b6544',
                    700: '#704f38',
                    800: '#5c4130',
                    900: '#4d372a',
                }
            },
            fontFamily: {
                sans: ['Be Vietnam Pro', 'system-ui', 'sans-serif'],
                display: ['Cormorant Garamond', 'serif'],
            }
        },
    },
    plugins: [],
}
