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
				//europe sans serif and monospaced
				{rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;700&display=swap&subset=latin,latin-ext,cyrillic,greek,vietnamese'},//includes Hungarian, Polish, Turkish
				{rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+Mono:wght@400;700&display=swap&subset=latin'},

				//asia san serif
				{rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap'},//Japanese
				{rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700&display=swap'},//Korean
				{rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;700&display=swap'},//simplified Chinese

				//more
				{rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;700&display=swap'},//Arabic
				{rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;700&display=swap'},//Devanagari (Hindi, Marathi, more)
			],
		},
	},
	runtimeConfig: {
		// Runtime config maps environment variables from .env file to config properties
		// Environment variables must be prefixed with NUXT_ and use SCREAMING_SNAKE_CASE
		// They map to camelCase properties here:
		// .env file:                  maps to:
		// NUXT_AUTH_SECRET        -> authSecret
		// NUXT_DISCORD_CLIENT_ID  -> discordClientId
		authSecret: undefined,
		discordClientId: undefined,
		discordClientSecret: undefined,
		twitterClientId: undefined,
		twitterClientSecret: undefined,
		public: {
			// Public runtime config goes here (available client-side)
		}
	}
})
