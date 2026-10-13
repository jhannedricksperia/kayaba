import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Serves the files in /api under `vite dev` / `vite preview` so the AI card and chat work
// locally. On Vercel the same files run as serverless functions.
function localApi(env) {
  const attach = (server) => {
    server.middlewares.use('/api', async (req, res) => {
      const [path, qs = ''] = (req.url || '').split('?');
      const name = path.replace(/^\//, '');
      const query = Object.fromEntries(new URLSearchParams(qs));
      const file = resolve('api', `${name}.js`);
      if (!/^[a-z0-9-]+$/i.test(name) || !existsSync(file)) {
        res.statusCode = 404;
        res.end('Not found');
        return;
      }
      let raw = '';
      for await (const chunk of req) raw += chunk;
      let body = {};
      try {
        body = JSON.parse(raw || '{}');
      } catch {
        /* handler validates */
      }
      Object.assign(process.env, env);
      const { default: handler } = await import(/* @vite-ignore */ `${pathToFileURL(file).href}?t=${Date.now()}`);
      const shim = {
        status(code) {
          res.statusCode = code;
          return shim;
        },
        setHeader(name, value) {
          res.setHeader(name, value);
        },
        json(value) {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(value));
        },
      };
      try {
        await handler({ method: req.method, body, query, headers: req.headers, socket: req.socket }, shim);
      } catch (e) {
        res.statusCode = 500;
        res.end('Server error');
      }
    });
  };
  return { name: 'local-api', configureServer: attach, configurePreviewServer: attach };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return { plugins: [react(), localApi(env)] };
});
