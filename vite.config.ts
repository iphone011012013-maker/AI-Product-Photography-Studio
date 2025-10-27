import path from 'path';
import { defineConfig } from 'vite'; // لاحظ إننا شيلنا loadEnv
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      // >> الجزء الأخطر (define) اتشال من هنا خلاص <<
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
