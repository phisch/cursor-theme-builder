import { defineConfig } from 'vite';
import { CursorTheme, Variant } from './src/cursor-theme/models/cursor-theme';
import fs from 'node:fs';
import path from 'node:path';
import biomePlugin from 'vite-plugin-biome';

export default defineConfig({
    plugins: [
        biomePlugin(
            {
                mode: 'lint',
                files: 'src',
                failOnError: true,
            }
        ),
        {
            name: 'generate-schema',
            apply: 'build',
            writeBundle() {
                const directory = 'dist/schemas';
                fs.mkdirSync(directory, { recursive: true });
                fs.writeFileSync(
                    path.join(directory, 'CursorTheme'),
                    JSON.stringify(CursorTheme, null, 2)
                );
                fs.writeFileSync(
                    path.join(directory, 'Variant'),
                    JSON.stringify(Variant, null, 2)
                );
            },
        }
    ],
});