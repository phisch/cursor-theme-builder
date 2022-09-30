import * as core from '@actions/core';

async function run() {
  try {
    const figmaAccessToken = core.getInput('figma_access_token', {required:true});
    const figmaFileKey = core.getInput('figma_file_key', {required: true});
    const exportDirectory = core.getInput('export_directory', {required: true});
    
  } 
  catch (error: any) {
    core.setFailed(error.message);
  }
}

run()