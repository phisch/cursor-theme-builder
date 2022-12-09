import * as core from '@actions/core';
import { existsSync, readFileSync } from 'fs';
import { TypeCompiler } from '@sinclair/typebox/compiler'
import { CursorTheme } from '../cursor-theme/models/cursor-theme';

async function run() {
  try {
    const cursorThemeJson = core.getInput('cursor_theme_json', {required:true});

    if (!existsSync(cursorThemeJson)) {
      throw new Error(`Cursor theme json file does not exist: ${cursorThemeJson}`);
    }
    
    const json = JSON.parse(readFileSync(cursorThemeJson, 'utf8'));
    const C = TypeCompiler.Compile(CursorTheme);

    if (!C.Check(json)) {
      const errors = [...C.Errors(json)]
      core.info(JSON.stringify(errors, null, 2));
      throw new Error(`Cursor theme json file is not valid!`);
    }
  }
  catch (error: any) {
    core.setFailed(error.message);
  }
}

run()