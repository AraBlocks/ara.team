//this file is nuxt.config.ts
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2024-11-01',//from create cloudflare nuxt 
	devtools: {
		enabled: true,
	},
	nitro: {
		preset: 'cloudflare-pages',
	},
	modules: [
		'nitro-cloudflare-dev',
		'@nuxtjs/tailwindcss',//from nuxt tailwind
	],
	css: [
		'~/assets/css/main.css',//for tailwind to get styles to cascade
	],
	app: {
		head: {
			link: [
				//noto sans, europe sans serif and monospaced
				{rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;700&display=swap&subset=latin,latin-ext,cyrillic,greek,vietnamese'},//includes Hungarian, Polish, Turkish
				{rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+Mono:wght@400;700&display=swap&subset=latin'},

				//asia san serif
				{rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap'},//Japanese
				{rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700&display=swap'},//Korean
				{rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;700&display=swap'},//simplified Chinese

				//more
				{rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;700&display=swap'},//Arabic
				{rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;700&display=swap'},//Devanagari (Hindi, Marathi, more)

				//roboto for terms documents
				{
					rel: 'stylesheet',
					href: 'https://fonts.googleapis.com/css2?' + (
						'family=Roboto:ital,wght@0,400;1,400;0,500;1,500' +//note 500, tailwind semibold
						'&display=swap' +
						'&subset=latin,latin-ext'
					),
				},
			],
		},
	},
	build: {
		analyze: {//added for visualizer; enable Nuxt’s built-in analyzer, which uses Rollup Plugin Visualizer under the hood
			template: 'treemap',//try out "sunburst", "treemap", "network", "raw-data", or "list"
			brotliSize: true,//current browsers downloading from Cloudflare will use Brotli compression
		},
	},
	analyzeDir: 'size',//added for visualizer; put the report files in a folder named "size" rather than .nuxt/analyze
})
