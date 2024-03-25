import typescript from "@rollup/plugin-typescript";
import license from "rollup-plugin-license";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import commonjsShim from "@rollup/plugin-esm-shim";

const config = [
	{
		input: "src/github-action/validate.ts",
		output: {
			file: "action/validate/dist/main.js",
			format: "es",
		},
		plugins: [
			typescript(),
			resolve(),
			commonjsShim(),
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
	}
];

export default config;
