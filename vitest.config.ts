import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [react()],
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: './tests/setup.ts',
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@asamuzakjp/css-color': path.resolve(__dirname, './tests/mocks/empty.ts'),
            '@csstools/css-calc': path.resolve(__dirname, './tests/mocks/empty.ts'),
            'sonner': path.resolve(__dirname, './tests/mocks/empty.ts'),
        },
        server: {
            deps: {
                inline: [
                    /@csstools/,
                    /@asamuzakjp/,
                ]
            }
        }
    },
});
