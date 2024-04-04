<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import type * as Monaco from 'monaco-editor/esm/vs/editor/editor.api';
	import animations from '../store/animations';
	import { TypeCompiler } from '@sinclair/typebox/compiler';
	import { AnimationList } from '$lib/models/animation/animation';

	let editor: Monaco.editor.IStandaloneCodeEditor;
	let monaco: typeof Monaco;
	let editorContainer: HTMLElement;
	let markers: Monaco.editor.IMarker[] = [];
	const validator = TypeCompiler.Compile(AnimationList);

	let value: string;

	const defaultAnimations: AnimationList = [
		{
			selector: '#spinner',
			instructions: [
				{
					name: 'animate',
					args: {
						delay: 0,
						duration: 1000,
						ease: 'in-out-cubic'
					}
				},
				{
					name: 'rotate',
					args: {
						degrees: 360
					}
				}
			]
		}
	];

	function update() {
		if (editor && markers.length === 0) {
			try {
				const newValue = editor.getValue();
				if (newValue === value) return;
				const newAnimations = JSON.parse(newValue);
				if (validator.Check(newAnimations)) {
					animations.set(newAnimations);
				}
				value = newValue;
			} catch (error) {
				return;
			}
		}
	}

	onMount(async () => {
		monaco = (await import('$lib/monaco')).default;

		editor = monaco.editor.create(editorContainer, {
			language: 'json',
			theme: 'vs-dark',
			automaticLayout: true,
			tabSize: 2
		});

		const model = monaco.editor.createModel(
			JSON.stringify(defaultAnimations, null, 2),
			'json',
			monaco.Uri.parse('inmemory://animations.json')
		);
		editor.setModel(model);

		model.onDidChangeDecorations(() => {
			markers = monaco.editor.getModelMarkers({ owner: 'json' });
			update();
		});
		model.onDidChangeContent(() => {
			markers = monaco.editor.getModelMarkers({ owner: 'json' });
			update();
		});
	});

	onDestroy(() => {
		monaco?.editor.getModels().forEach((model) => model.dispose());
		editor?.dispose();
	});
</script>

<div class="container" bind:this={editorContainer} />

<style>
	.container {
		flex: 1;
		min-width: 0;
		min-height: 0;
	}
</style>
