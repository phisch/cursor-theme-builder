import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import fs from 'node:fs';
import path from 'node:path';
import { CursorTheme, Variant } from './src/lib/models/cursor-theme';
import svg from '@poppanator/sveltekit-svg';
import { AnimationList } from './src/lib/models/animation/animation';

export default defineConfig({
	plugins: [
		sveltekit(),
		svg(),
		{
			name: 'generate-schema',
			apply: 'build',
			closeBundle() {
				const directory = 'build/schemas';
				fs.mkdirSync(directory, { recursive: true });
				fs.writeFileSync(
					path.join(directory, 'CursorTheme.json'),
					JSON.stringify(CursorTheme, null, 2)
				);
				fs.writeFileSync(path.join(directory, 'Variant'), JSON.stringify(Variant, null, 2));
				fs.writeFileSync(
					path.join(directory, 'Animations.json'),
					JSON.stringify(AnimationList, null, 2)
				);
			}
		}
	],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
