import './styles.scss'

import * as monaco from 'monaco-editor'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import example_json from '../example/theme.json'
import { CursorTheme } from './cursor-theme/models/cursor-theme'
import { Animation } from './cursor-theme/models/animation/animation'
import { SvgAnimator } from './animator/svg-animator'


self.MonacoEnvironment = {
    getWorker(_, label) {
        if (label === 'json') {
            return new jsonWorker()
        }
        return new editorWorker()
    }
}

monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
    validate: true,
    schemaRequest: 'ignore',
    schemas: [
        {
            fileMatch: ["theme.json"],
            schema: CursorTheme,
            uri: "https://phisch.github.io/cursor-theme-generator/schemas/cursor-theme.json",
        },
        {
            fileMatch: ["animation.json"],
            schema: Animation,
            uri: "https://phisch.github.io/cursor-theme-generator/schemas/cursor-theme2.json",
        },
    ]
});

const code = JSON.stringify(example_json, null, 2);
const cursor_theme_editor = document.querySelector("#schema-validator .editor");
if (cursor_theme_editor != null) {
    monaco.editor.create(cursor_theme_editor as HTMLElement, {
        language: 'json',
        model: monaco.editor.createModel(code, 'json', monaco.Uri.parse('inmemory://theme.json')),
        theme: "vs-dark",
        automaticLayout: false,
        tabSize: 2
    });
}

// get the example animation json
import example_animation from '../example/animation.json'
import { SVG } from '@svgdotjs/svg.js'

const animation = JSON.stringify(example_animation, null, 2);

const animationEditor = document.querySelector("#animation-editor");
const monacoAnimator = monaco.editor.create(animationEditor as HTMLElement, {
    language: 'json',
    model: monaco.editor.createModel(animation, 'json', monaco.Uri.parse('inmemory://animation.json')),
    theme: "vs-dark",
    automaticLayout: true,
    tabSize: 2,
});

monacoAnimator.onDidChangeModelDecorations((_) => {
    const markers = monaco.editor.getModelMarkers({
        resource: monaco.Uri.parse('inmemory://animation.json'),
    });

    if (markers.length == 0) {
        const element = SVG(document.querySelector('#svg-container svg'));
        const animation = JSON.parse(monacoAnimator.getModel()?.getValue()!) as Animation;
        new SvgAnimator(element, [animation]);
    }
});


const dropTarget = document.querySelector('#svg-container') as HTMLDivElement;

dropTarget.addEventListener('dragover', (event: DragEvent) => {
    event.preventDefault();
});

dropTarget.addEventListener('drop', (event: DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer?.files[0];
    if (file?.type === 'image/svg+xml') {
        const reader = new FileReader();
        reader.onload = () => {
            const contents = reader.result as string;
            
            const fragment = document.createRange().createContextualFragment(contents);
            const svgElement = fragment.firstElementChild as SVGSVGElement;

            const currentSvg = dropTarget.querySelector('svg');
            if (currentSvg) {
                dropTarget.replaceChild(svgElement, currentSvg);
            } else {
                dropTarget.appendChild(svgElement);
            }
        };
        reader.readAsText(file);
    }
});
