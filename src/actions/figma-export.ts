import * as core from "@actions/core";
import type { CursorTheme } from "../cursor-theme/models/cursor-theme";
import { FigmaExporter } from "../export/figma-exporter";

async function run() {
	try {
		const accessToken = core.getInput("access_token", { required: true });
		const fileKey = core.getInput("file_key", { required: true });

		const themeName = core.getInput("theme_name", { required: true });
		const themeAuthor =
			core.getInput("theme_author", { required: false }) || undefined;
		const themeDescription =
			core.getInput("theme_description", { required: false }) || undefined;

		const targetDirectory =
			core.getInput("target_directory", { required: false }) || "./export";

		const cursorTheme: CursorTheme = {
			name: themeName,
			author: themeAuthor,
			description: themeDescription,
			variants: [],
		};

		const exporter = new FigmaExporter(
			accessToken,
			fileKey,
			cursorTheme,
			targetDirectory,
		);

		core.setOutput("version", await exporter.export());
	} catch (error: unknown) {
		if (error instanceof Error) {
			core.setFailed(error.message);
		}
	}
}

run();
