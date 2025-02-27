//this file is tailwind.config.js
module.exports = {
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

					//google fonts
					'"Noto Sans"',

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
			},
		},
	},
	plugins: [
	],
}
