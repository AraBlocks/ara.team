<script setup>
//this file is index.vue

</script>
<template>
<div class="p-4 columns-1 sm:columns-2 lg:columns-3" style="column-gap: 1rem;">
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
<h2 class="text-lg font-bold mb-2">Card 1</h2>
<p>This is some sample text in card 1. It may be short or long, and the card will adjust its height accordingly.</p>
</div>

<div class="break-inside-avoid mb-4 bg-white rounded border border-gray-200 shadow-sm p-4">
<h2 class="text-lg font-bold mb-2">Card 2</h2>
<p>
Card 2 contains a bit more text to demonstrate how cards of varying heights are managed.
The content wraps naturally within the card, and the card grows taller as needed.
</p>
</div>

<div class="break-inside-avoid mb-4 bg-white rounded border border-gray-200 shadow-sm p-4">
<h2 class="text-lg font-bold mb-2">Card 3</h2>
<p>
Card 3 is here. Additional cards can be added in the same way.
</p>
</div>
	
</div>
</template>
