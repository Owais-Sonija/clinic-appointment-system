/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#2563eb',
                secondary: '#facc15',
                dark: '#0f172a',
                light: '#f8fafc',
            }
        },
    },
    plugins: [],
}
