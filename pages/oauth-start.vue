<script setup>//in the [ara.team] [Nuxt] repo, this is the file ./pages/oauth-start.vue

const cloud = true ? 'https://oauth2.ara.team' : 'http://localhost:5173'

</script>
<template>
<div class="max-w-sm mx-auto px-4 py-8 space-y-6">

<p>Welcome to the experiments page of ara.team! 🚧 We're coding with AI to brainstorm how a static site, with no database, can link Web 2.0 and web3 identity. Begin your test flow through OAuth with the provider of your choice:</p>

<p><a class="myContinueButton bg-blue-500   hover:bg-blue-600"   :href="`${cloud}/continue/google`">Continue with Google</a></p>
<p><a class="myContinueButton bg-sky-500    hover:bg-sky-600"    :href="`${cloud}/continue/twitter`">Continue with 𝕏</a></p>
<p><a class="myContinueButton bg-gray-500   hover:bg-gray-600"   :href="`${cloud}/continue/github`">Continue with GitHub</a></p>
<p><a class="myContinueButton bg-indigo-500 hover:bg-indigo-600" :href="`${cloud}/continue/discord`">Continue with Discord</a></p>

</div>
</template>
<style scoped>

.myContinueButton {
	@apply block w-full text-center py-2 px-4 rounded text-white no-underline;
}

</style>
