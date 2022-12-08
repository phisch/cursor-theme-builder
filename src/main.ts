import './styles.scss'

import * as monaco from 'monaco-editor'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import { cursorThemeSchema } from './json-schema/cursor-theme'
import example_json from '../example/theme.json'

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
  schemas: [
    {
      fileMatch: ["*"],
      schema: cursorThemeSchema,
      uri: "https://phisch.github.io/cursor-theme-generator/schemas/cursor-theme.json",
    },
  ]
});

const code = JSON.stringify(example_json, null, 2);
const cursor_theme_editor = document.querySelector("#schema-validator .editor");
if (cursor_theme_editor != null) {
  monaco.editor.create(cursor_theme_editor as HTMLElement, {
    language: 'json',
    model: monaco.editor.createModel(code, 'json'),
    theme: "vs-dark",
    automaticLayout: true,
    tabSize: 2
  });
}
