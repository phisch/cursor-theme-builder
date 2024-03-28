import * as monaco from 'monaco-editor';
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import { Animations, CursorTheme, Variant } from './models/cursor-theme';

self.MonacoEnvironment = {
	getWorker: function (_: string, label: string) {
		return new jsonWorker()
	}
};


monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
	validate: true,
	schemaRequest: 'warning',
	schemaValidation: 'warning',
	schemas: [
		{
			fileMatch: ["theme.json"],
			schema: CursorTheme,
			uri: "https://phisch.github.io/cursor-theme-generator/schemas/CursorTheme",
		},
		{
			uri: "https://phisch.github.io/cursor-theme-generator/schemas/Variant",
			schema: Variant
		},
		{
			fileMatch: ["animations.json"],
			uri: "https://phisch.github.io/cursor-theme-generator/schemas/Animations",
			schema: Animations,
		}
	],
});

export default monaco;