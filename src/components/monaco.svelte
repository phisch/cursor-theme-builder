<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import type * as Monaco from "monaco-editor/esm/vs/editor/editor.api";
    import animations from "../store/animations";
    import { Animations } from "$lib/models/cursor-theme";
    import { TypeCompiler } from "@sinclair/typebox/compiler";

    let editor: Monaco.editor.IStandaloneCodeEditor;
    let monaco: typeof Monaco;
    let editorContainer: HTMLElement;
    let markers: Monaco.editor.IMarker[] = [];
    const validator = TypeCompiler.Compile(Animations);

    const defaultAnimations: Animations = [
        {
            selector: "#spinner",
            instructions: [
                {
                    name: "animate",
                    arguments: {
                        delay: 0,
                        duration: 1000,
                        when: "now",
                    },
                },
                {
                    name: "rotate",
                    arguments: {
                        degrees: 360,
                    },
                },
            ],
        },
    ];

    function update() {
        if (editor && markers.length === 0) {
            try {
                const newAnimations = JSON.parse(editor.getValue());
                if (validator.Check(newAnimations)) {
                    animations.set(newAnimations);
                }
            } catch (error) {
                return;
            }
        }
    }

    onMount(async () => {
        monaco = (await import("$lib/monaco")).default;

        editor = monaco.editor.create(editorContainer, {
            language: "json",
            theme: "vs-dark",
            automaticLayout: true,
            tabSize: 2,
        });

        const model = monaco.editor.createModel(
            JSON.stringify(defaultAnimations, null, 2),
            "json",
            monaco.Uri.parse("inmemory://animations.json"),
        );
        editor.setModel(model);

        model.onDidChangeDecorations(() => {
            markers = monaco.editor.getModelMarkers({ owner: "json" });
            update();
        });
        model.onDidChangeContent(() => {
            markers = monaco.editor.getModelMarkers({ owner: "json" });
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
