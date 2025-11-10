/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {
			colors: {
				primary: {
					DEFAULT: '#1e3a8a',
					light: '#2d4eb3',
					dark: '#162a63'
				},
				accent: '#f59e0b'
			}
		}
	},
	plugins: []
};


