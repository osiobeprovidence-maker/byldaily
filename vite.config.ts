import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

const firebaseEnvKeys = [
  'API_KEY',
  'AUTH_DOMAIN',
  'PROJECT_ID',
  'STORAGE_BUCKET',
  'MESSAGING_SENDER_ID',
  'APP_ID',
] as const;

const firebaseEnvAliases: Partial<Record<(typeof firebaseEnvKeys)[number], string[]>> = {
  AUTH_DOMAIN: ['AUTHDOMAIN'],
  STORAGE_BUCKET: ['STORAGEBUCKET'],
  MESSAGING_SENDER_ID: ['MESSAGINGSENDER_ID'],
};

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), '');
  const firebaseEnv = Object.fromEntries(
    firebaseEnvKeys.map((key) => {
      const names = [key, ...(firebaseEnvAliases[key] ?? [])];

      return [
        key,
        names
          .flatMap((name) => [env[`VITE_FIREBASE_${name}`], env[`FIREBASE_${name}`]])
          .find(Boolean) ?? '',
      ];
    }),
  );

  return {
    plugins: [react(), tailwindcss()],
    define: {
      __FIREBASE_ENV__: JSON.stringify(firebaseEnv),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            ui: ['lucide-react', 'motion'],
            firebase: ['firebase/app', 'firebase/auth'],
          },
        },
      },
    },
  };
});
