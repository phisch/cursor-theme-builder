import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import fs from 'node:fs';
import path from 'node:path';
import { Animations, CursorTheme, Variant } from './src/lib/models/cursor-theme';
import svg from '@poppanator/sveltekit-svg';

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
                    path.join(directory, 'CursorTheme'),
                    JSON.stringify(CursorTheme, null, 2)
                );
                fs.writeFileSync(
                    path.join(directory, 'Variant'),
                    JSON.stringify(Variant, null, 2)
                );
                fs.writeFileSync(
                    path.join(directory, 'Animations'),
                    JSON.stringify(Animations, null, 2)
                );
            },
        }
	]
});
