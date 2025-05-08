import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  // server: {
  //   historyApiFallback: true,
  //   https: {
  //     key: './localhost+1-key.pem',
  //     cert: './localhost+1.pem',
  //   },
  //   host: 'localhost',
  //   port: 3000,
  // },
  server: {
    allowedHosts: [
      'subcommittee-teeth-excitement-prevent.trycloudflare.com',
      'experts-trader-void-workflow.trycloudflare.com',
      'brand-yearly-points-avoiding.trycloudflare.com',
    ],
  },
});
