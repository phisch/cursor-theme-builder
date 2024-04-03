<script lang="ts">
	import CursorAnimator from '../components/cursor-animator.svelte';
</script>

<h1>Cursor Theme Generator</h1>
<p>This page documents and demonstrates the cursor theme generator.</p>

<h2>SVG Animator</h2>
<p>One of the most banger features, is support to define animations for cursor sprites.</p>
<p>
	Please drag and drop your own SVG files on top of the one below to replace it, and then write your
	animation instructions into the editor next to it. As long as your json follows the schema, it
	will apply all animations to the SVG next to it!
</p>
<CursorAnimator />
<h2>Schema validator</h2>
<p>
	This editor validates your cursor-theme.json against the cursor theme schema. Feel free to use
	this to write your schema or validate your existing schema.
</p>

<style lang="scss">
	:global(html, body) {
		min-height: 100vh;
		overflow: auto;
		margin: 0;
		background: rgb(20,20,24);
		color: rgb(250, 250, 255);
		font: 16px 'Arial', sans-serif;
	}

	:global(body > div > *) {
		width: 50vw;
		min-width: 980px;
		margin-right: auto;
		margin-left: auto;
	}

	:global(#cursor-animator) {
		margin: 2em auto;
	}
	
</style>
