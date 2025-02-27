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
})
