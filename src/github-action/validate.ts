import { existsSync, readFileSync } from "node:fs";
import * as core from "@actions/core";
import { TypeCompiler } from "@sinclair/typebox/build/require/compiler";
import { CursorTheme } from "../cursor-theme/models/cursor-theme";

async function run() {
	try {
		const cursorThemeJson = core.getInput("input_file", { required: true });

		if (!existsSync(cursorThemeJson)) {
			throw new Error(
				`Cursor theme json file does not exist: ${cursorThemeJson}`,
			);
		}

		const json = JSON.parse(readFileSync(cursorThemeJson, "utf8"));
		const C = TypeCompiler.Compile(CursorTheme);

		if (!C.Check(json)) {
			core.info(JSON.stringify([...C.Errors(json)], null, 2));
			throw new Error("Cursor theme json file is not valid!");
		}
	} catch (error: unknown) {
		if (error instanceof Error) {
			core.setFailed(error.message);
		}
	}
}

run();
