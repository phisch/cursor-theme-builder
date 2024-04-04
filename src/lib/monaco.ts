import * as monaco from 'monaco-editor';
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import { CursorTheme, Variant } from './models/cursor-theme';
import { AnimationList } from './models/animation/animation';

self.MonacoEnvironment = {
	getWorker: function (_: string, label: string) {
		return new jsonWorker();
	}
};

monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
	validate: true,
	schemaRequest: 'warning',
	schemaValidation: 'warning',
	schemas: [
		{
			fileMatch: ['theme.json'],
			schema: CursorTheme,
			uri: 'https://phisch.github.io/cursor-theme-builder/schemas/CursorTheme.json'
		},
		{
			uri: 'https://phisch.github.io/cursor-theme-builder/schemas/Variant',
			schema: Variant
		},
		{
			fileMatch: ['animations.json'],
			uri: 'https://phisch.github.io/cursor-theme-builder/schemas/Animations.json',
			schema: AnimationList
		}
	]
});

export default monaco;
