<script setup>
//this file is index.vue

/*
prove to google that dashboard me also controls the home page so they let us use oauth
https://console.cloud.google.com/apis/credentials
https://search.google.com/search-console/not-verified
https://support.google.com/webmasters/answer/9008080#meta_tag_verification
*/
useSeoMeta({
	googleSiteVerification: '_QVRB2Q1vXow6EkXoTMWm1AAZN-mOLJRwPx8g8YolU4',
})

</script>
<template>
<div class="p-4 columns-1 lg:columns-2 xl:columns-3" style="column-gap: 1rem;">
<!-- ^Container:
- p-4: outer padding (A)
- columns-1 sm:columns-2 lg:columns-3: responsive column count
- inline style for column-gap (A) -->

<div class="break-inside-avoid mb-4">
<svg class="inline-block" width="180" height="180" viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="300" cy="300" r="300" fill="black"/>
<path d="M442.885 338.807H406.904L394.126 313.256H351.38L364.154 338.807H156.119L137 377.045H383.273L409.694 429.885H452.441L426.023 377.045H462L442.885 338.807Z" fill="white"/>
<path d="M211.215 300.574L198.437 326.129H241.187L253.965 300.574H442.885L462 262.34H273.08L299.502 209.5L319.579 249.658H362.329L299.502 124L230.33 262.34H137L156.119 300.574H211.215Z" fill="white"/>
<path d="M146.559 429.885H189.309L209.386 389.727H166.636L146.559 429.885Z" fill="white"/>
</svg>
</div>
	
<!-- Each card:
- break-inside-avoid: prevents a card from being split between columns
- mb-4: vertical gap (A) between cards
- bg-white, rounded, border, shadow-sm: visual styling
- p-4: internal padding (B) -->
<div class="break-inside-avoid mb-4 bg-white rounded border border-gray-200 shadow-sm p-4">

<p>$ARA is <code>0xa92e7c...ef7df5</code>. Always check the contract address!</p>

<p>Ara directly connects creators and fans, enabling distribution and payment without platform fees and limits.</p>
</div>

<div class="break-inside-avoid mb-4 bg-white rounded border border-gray-200 shadow-sm p-4">
<p>Liquidity mining ran <b>2021-July-24 00:00:00 UTC</b> through <b>2025-May-23</b></p>
<p>1 Get ARA in the <a href="https://arablocks.medium.com/ara-available-now-on-metamask-198ec078c997">🦊 MetaMask</a> mobile app;</p>

<p>2 Pool ARA with USDC in <a href="https://app.sushi.com/analytics/pools/0x81ef0c70fa76c8e7563cb26ee34a2e7f2a77c410?chainId=1">🍣 SushiSwap</a> to get SLP;</p>

<p>3 Stake SLP in ARA’s <a href="https://app.gysr.io/pool/0x05dff8d71cd222e09bb71e44e0be7cc8f03a07c9">💦 Liquidity Mining Gysr</a> to earn ARA;</p>

<p>4 Stake ARA for ARA in the <a href="https://app.gysr.io/pool/0x13088d77e86e87ad2f77608814f609ea96ca7a87">💎 Hodl Gysr</a></p>

<p><a href="https://arablocks.medium.com/liquidity-mining-ara-announcement-important-links-and-step-by-step-guide-a42dc52fbf23">🚜 Announcement and full guide</a></p>
</div>

<div class="break-inside-avoid mb-4 bg-white rounded border border-gray-200 shadow-sm p-4">
<p><a href="https://coinmarketcap.com/currencies/ara-blocks">💰 CoinMarketCap</a></p>
<p><a href="https://www.coingecko.com/en/coins/ara-token">🦎 CoinGecko</a></p>
<p><a href="https://etherscan.io/token/0xa92e7c82b11d10716ab534051b271d2f6aef7df5">🔍 Etherscan</a></p>
<p><a href="https://www.dextools.io/app/sushiswap/pair-explorer/0x81ef0c70fa76c8e7563cb26ee34a2e7f2a77c410">❄️ DEXTools for SushiSwap pair</a></p>
<p><a href="https://www.dextools.io/app/uniswap/pair-explorer/0x6d2f0fabb11ea0b1f4416711758e86e86fa7c154">❄️ (Earlier) DEXTools for Uniswap pair</a></p>

<p><a href="https://v2.info.uniswap.org/token/0xa92e7c82b11d10716ab534051b271d2f6aef7df5">🦄 (Earlier) Uniswap v2 ARA/ETH liquidity pool</a></p>
<p><a href="https://info.uniswap.org/#/pools/0x0bc1a6edafa658e6501d2107d8f31d490752b94b">🦄 (Earlier) Uniswap v3 ARA/ETH liquidity pool</a></p>
</div>

<div class="break-inside-avoid mb-4 bg-white rounded border border-gray-200 shadow-sm p-4">
<p><a href="https://ara.team/">🌐 Official Ara webpage</a> you're on it! <i><code>https://ara.team</code></i></p>
<p><a href="https://snapshot.org/#/aradao.eth">⚡️ Ara DAO</a></p>
<p><a href="https://github.com/AraBlocks/papers/blob/master/ara-whitepaper-en.pdf">📖 Ara Whitepaper</a></p>
<p><a href="https://github.com/AraBlocks/ara-file-manager/releases">🖥 Ara File Manager desktop app</a></p>
</div>

<div class="break-inside-avoid mb-4 bg-white rounded border border-gray-200 shadow-sm p-4">
<p><a href="https://t.me/arablocks">✈️ Telegram</a></p>
<p><a href="https://discord.gg/6ZMVgTVTGy">🎮 Discord</a></p>
<p><a href="https://github.com/AraBlocks">💾 GitHub</a></p>
</div>

<div class="break-inside-avoid mb-4 bg-white rounded border border-gray-200 shadow-sm p-4">
<p><a href="https://www.twitter.com/arablocks">𝕏 X née Twitter</a></p>
<p><a href="https://arablocks.medium.com/">⚫️ Medium</a></p>
<p><a href="https://www.instagram.com/arablocks">📷 Instagram</a></p>
<p><a href="https://www.facebook.com/AraBlocks">🟦 Facebook</a></p>
<p><a href="https://www.linkedin.com/company/ara-blocks">💼 Linkedin</a></p>
<p><a href="https://linktr.ee/arablocks">🌲 Linktree</a></p>
</div>

<div class="break-inside-avoid mb-4 bg-white rounded border border-gray-200 shadow-sm p-4">
<p>So actually this website doesn't use cookies 🍪</p>
<p>
<NuxtLink to="/terms">Terms and Conditions</NuxtLink>{{' '}}
<NuxtLink to="/terms#privacy">Privacy Notice</NuxtLink>{{' '}}
<NuxtLink to="/terms#cookies">Cookie Info</NuxtLink>{{' '}}
<NuxtLink to="/terms#sms">SMS and MMS Terms</NuxtLink>
</p>
</div>
	
</div>
</template>
