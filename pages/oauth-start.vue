<script setup>//in the [ara.team] [Nuxt] repo, this is the file ./pages/oauth-start.vue

</script>
<template>
<div class="max-w-sm mx-auto px-4 py-8 space-y-6">

<p>Welcome to the experiments page of ara.team! 🚧 We're coding with AI to brainstorm how a static site, with no database, can link Web 2.0 and web3 identity. Begin your test flow through OAuth with the provider of your choice:</p>

<div><form method="POST" action="http://oauth2.ara.team/auth/signin/google">
<button type="submit" class="myContinueButton bg-blue-500 hover:bg-blue-600">
Continue with Google
</button></form></div>

<div><form method="POST" action="http://oauth2.ara.team/auth/signin/twitter">
<button type="submit" class="myContinueButton bg-sky-500 hover:bg-sky-600">
Continue with 𝕏
</button></form></div>

<div><form method="POST" action="http://oauth2.ara.team/auth/signin/github">
<button type="submit" class="myContinueButton bg-gray-500 hover:bg-gray-600">
Continue with GitHub
</button></form></div>

<div><form method="POST" action="http://oauth2.ara.team/auth/signin/discord">
<button type="submit" class="myContinueButton bg-indigo-500 hover:bg-indigo-600">
Continue with Discord
</button></form></div>

</div>
</template>
<style scoped>

.myContinueButton {
	@apply block w-full text-center py-2 px-4 rounded text-white no-underline;
}

</style>
