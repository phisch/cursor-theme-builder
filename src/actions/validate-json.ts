import * as core from '@actions/core';
import Ajv from 'ajv';
import { existsSync, readFileSync } from 'fs';
import { cursorThemeSchema } from '../cursor-theme/schema/cursor-theme';

async function run() {
  try {
    const cursorThemeJson = core.getInput('cursor_theme_json', {required:true});

    if (!existsSync(cursorThemeJson)) {
      throw new Error(`Cursor theme json file does not exist: ${cursorThemeJson}`);
    }
    
    const json = JSON.parse(readFileSync(cursorThemeJson, 'utf8'));

    const ajv = new Ajv();
    const validate = ajv.compile(cursorThemeSchema);
    
    if (!validate(json)) {
      core.info(JSON.stringify(validate.errors, null, 2));
      throw new Error(`Cursor theme json file is not valid!`);
    }

  }
  catch (error: any) {
    core.setFailed(error.message);
  }
}

run()