<script setup>//./pages/oauth-done.vue

const route = useRoute()

let messageText = '(no message)'
if (route.query.message) {
	try {
		let messageObject = JSON.parse(decodeURIComponent(route.query.message))
		messageText = JSON.stringify(messageObject, null, 2)
	} catch (e) {
		console.error(e)
		messageText = '(error decoding message)'
	}
}

</script>
<template>
<div class="max-w-lg mx-auto px-4 py-8 space-y-6">

<h1 class="text-2xl font-semibold">welcome back from your trip through OAuth</h1>
<p class="text-gray-700">Received message payload:</p>
<pre class="bg-gray-100 p-4 rounded text-sm overflow-auto whitespace-pre-wrap">{{messageText}}</pre>
<p><NuxtLink to="/">Home</NuxtLink> <NuxtLink to="/oauth-start">OAuth Start</NuxtLink></p>

</div>
</template>
<style scoped>

</style>
