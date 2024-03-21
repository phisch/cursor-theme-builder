import { defineConfig } from 'vite';
import { CursorTheme } from './src/cursor-theme/models/cursor-theme';
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
                    path.join(
                        directory,
                        'cursor-theme.json'
                    ),
                    JSON.stringify(CursorTheme, null, 2)
                );
            },
        }
    ],
});