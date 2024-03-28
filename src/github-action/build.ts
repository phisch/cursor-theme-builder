import { existsSync } from "node:fs";
import * as core from "@actions/core";
import { CursorThemeBuilder } from "$lib/builder/cursor-theme";

async function run() {
	try {
		const cursorThemeJson = core.getInput("cursor_theme_json", {
			required: true,
		});

		if (!existsSync(cursorThemeJson)) {
			throw new Error(
				`Cursor theme json file does not exist: ${cursorThemeJson}`,
			);
		}

		const outputDirectory = core.getInput("output_directory", {
			required: true,
		});

		const generator = new CursorThemeBuilder(
			cursorThemeJson,
			outputDirectory,
		);

		generator.build();
	} catch (error: unknown) {
		if (error instanceof Error) {
			core.setFailed(error.message);
		}
	}
}

run();
