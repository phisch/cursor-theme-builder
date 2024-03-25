import typescript from "@rollup/plugin-typescript";
import license from "rollup-plugin-license";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import commonjsShim from "@rollup/plugin-esm-shim";

const config = [
	{
		input: "src/github-action/build.ts",
		output: {
			file: "action/build/dist/main.js",
			format: "es",
		},
		external: ["sharp", "@svgdotjs/svg.js", "svgdom"],
		plugins: [
			typescript(),
			resolve(),
			commonjsShim(),
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
