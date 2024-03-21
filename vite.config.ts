import { defineConfig } from 'vite';
import { CursorTheme, Variant } from './src/cursor-theme/models/cursor-theme';
import fs from 'fs';
import path from 'path';

export default defineConfig({
    plugins: [
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