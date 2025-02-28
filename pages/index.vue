<script setup>
//this file is index.vue

//no script yet

/*
<code>here is some example code</code>
<code>and some example pre</code>
<input type="text" placeholder="placeholder text" value="value text" />
<button>Example button that doesn't do anything</button>
<p>here just a regular paragraph</p>
and a line of text outside of any tags other than the template's div
*/

</script>
<template>
<div class="p-4 columns-1 sm:columns-2 lg:columns-3" style="column-gap: 1rem;">
<!-- ^Container:
		 - p-4: outer padding (A)
		 - columns-1 sm:columns-2 lg:columns-3: responsive column count
		 - inline style for column-gap (A) -->
	
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

	<!-- You can add as many cards as needed -->
	
</div>
</template>
