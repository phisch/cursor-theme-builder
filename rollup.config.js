import typescript from "@rollup/plugin-typescript";
import license from "rollup-plugin-license";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";

const config = [
	{
		input: "src/github-action/export.ts",
		output: {
			file: "action/export/dist/main.js",
			format: "es",
		},
		plugins: [
			typescript(),
			resolve(),
			commonjs(),
			json(),
			license({
				thirdParty: {
					output: {
						file: "action/export/dist/licenses.txt"
					},
					includePrivate: true,
				},
			}),
		],
	},
	{
		input: "src/github-action/validate.ts",
		output: {
			file: "action/validate/dist/main.js",
			format: "es",
		},
		plugins: [
			typescript(),
			resolve(),
			commonjs(),
			json(),
			license({
				thirdParty: {
					output: {
						file: "action/validate/dist/licenses.txt"
					},
					includePrivate: true,
				},
			}),
		],
	},
	{
		input: "src/github-action/build.ts",
		output: {
			file: "action/build/dist/main.js",
			format: "es",
		},
		plugins: [
			typescript(),
			resolve(),
			commonjs(),
			json(),
			license({
				thirdParty: {
					output: {
						file: "action/build/dist/licenses.txt"
					},
					includePrivate: true,
				},
			}),
		],
	},
];

export default config;
