import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import fs from 'fs/promises';
import svgr from '@svgr/rollup';

export default defineConfig(({ mode }) => {
    // Cargar variables del archivo .env
    const env = loadEnv(mode, process.cwd(), '');

    return {
        resolve: {
            alias: {
                src: resolve(__dirname, 'src'),
            },
        },
        esbuild: {
            loader: 'jsx',
            include: /\.jsx?$/,
            exclude: [],
        },
        optimizeDeps: {
            esbuildOptions: {
                loader: {
                    '.js': 'jsx',
                    '.jsx': 'jsx'
                },
                plugins: [
                    {
                        name: 'load-js-files-as-jsx',
                        setup(build) {
                            build.onLoad({ filter: /\.js$/ }, async (args) => ({
                                loader: 'jsx',
                                contents: await fs.readFile(args.path, 'utf8'),
                            }));
                        },
                    },
                ],
            },
        },
        server: {
            port: Number(env.VITE_PORT) || 5173, // Usa VITE_PORT de .env o 5173 por defecto
        },
        plugins: [svgr(), react()],
    };
});