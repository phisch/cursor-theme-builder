<script lang="ts">
	import Monaco from './monaco.svelte';
	import Svg from './svg.svelte';
</script>

<div id="cursor-animator">
	<Svg />
	<Monaco />
</div>

<style lang="scss">
	#cursor-animator {
		border: 1px solid black;
		min-height: 30vh;
		max-height: 60vh;
		resize: vertical;
		display: flex;
		flex-direction: row;

		:global(div[role='img']) {
			flex: 1;
		}

		:global(div) {
			flex: 3;
		}
	}
</style>
