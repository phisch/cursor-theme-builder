import * as core from "@actions/core";
import type { CursorTheme } from "../cursor-theme/models/cursor-theme";
import { FigmaExporter } from "../export/figma-exporter";

async function run() {
	try {
		const cursor_theme: CursorTheme = {
			name: core.getInput("theme_name", { required: true }),
			variants: [],
		};

		const author_name = core.getInput("author_name", { required: false });
		if (author_name) {
			cursor_theme.author = author_name;
		}

		const description = core.getInput("description", { required: false });
		if (description) {
			cursor_theme.description = description;
		}

		const exporter = new FigmaExporter(
			core.getInput("access_token", { required: true }),
			core.getInput("file_key", { required: true }),
			cursor_theme,
			core.getInput("output_directory", { required: true }),
		);

		await exporter.export();
	} catch (error: unknown) {
		if (error instanceof Error) {
			core.setFailed(error.message);
		}
	}
}

run();
