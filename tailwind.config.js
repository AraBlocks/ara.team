//this file is tailwind.config.js

import defaultTheme from 'tailwindcss/defaultTheme'

export default {

	//chat says now that we have our own tailwind config file, we have to add this list to help it scan our project files for class names
	content: [
		'./components/**/*.{vue,js,ts,jsx,tsx}',
		'./layouts/**/*.{vue,js,ts,jsx,tsx}',
		'./pages/**/*.{vue,js,ts,jsx,tsx}',
		'./plugins/**/*.{js,ts,jsx,tsx}',
		'./nuxt.config.{js,ts}',
	],
	theme: {
		extend: {
			fontFamily: {//you can confirm these work by adding 'Papyrus' to the start of any list, lol
				sans: [
					//packaged fonts
					'"Ginto Rounded"',

					//google fonts with lots of regions to avoid browser fallback or tofu
					'"Noto Sans"',//primary for Latin, Cyrillic, Greek, Vietnamese
					'"Noto Sans Arabic"',//for Arabic glyphs
					'"Noto Sans Devanagari"',//for Hindi, Marathi, etc.
					'"Noto Sans JP"',//for Japanese
					'"Noto Sans KR"',//for Korean
					'"Noto Sans SC"',//for simplified Chinese

					//system fonts
					'-apple-system',//for iphone and mac, leads to San Francisco, Apple's 2014 replacement for Helvetica Neue
					'BlinkMacSystemFont',//for Chrome on apple devices, also leads to San Francisco
					'"Segoe UI"',//for Windows
					'Roboto',//for Android
					'"Helvetica Neue"',//for older Apple devices
					'Arial',//widely available fallback
					'sans-serif',//generic fallback
				],
				mono: [

					//google fonts
					'"Noto Sans Mono"',

					//system fonts
					'ui-monospace',//modern UI monospaced font on some systems
					'SFMono-Regular',//default monospaced font on macs and iphones
					'Consolas',//standard on Windows
					'"Liberation Mono"',//common on Linux distributions
					'"Courier New"',//widely available fallback
					'monospace',//generic fallback
				],
				roboto: [//our own name to create the tailwind style font-roboto

					//google fonts
					'Roboto',

					//system fonts, an easier way to get all the defaults
					...defaultTheme.fontFamily.sans,
				],
			},
		},
	},
	plugins: [
	],
}
