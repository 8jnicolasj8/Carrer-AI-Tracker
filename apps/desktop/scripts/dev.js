const { spawn } = require('child_process');
const esbuild = require('esbuild');
const path = require('path');
const http = require('http');

async function buildMainAndPreload() {
  await esbuild.build({
    entryPoints: [path.resolve(__dirname, '../src/main/index.ts')],
    bundle: true,
    platform: 'node',
    target: 'node20',
    outfile: path.resolve(__dirname, '../dist/main/index.js'),
    external: ['electron'],
    sourcemap: true,
  });

  await esbuild.build({
    entryPoints: [path.resolve(__dirname, '../src/main/preload.ts')],
    bundle: true,
    platform: 'node',
    target: 'node20',
    outfile: path.resolve(__dirname, '../dist/preload/index.js'),
    external: ['electron'],
    sourcemap: true,
  });
}

function waitForServer(url, timeout = 15000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const check = () => {
      http.get(url, (res) => {
        resolve();
      }).on('error', () => {
        if (Date.now() - start > timeout) {
          reject(new Error('Vite dev server timed out'));
        } else {
          setTimeout(check, 200);
        }
      });
    };
    check();
  });
}

async function start() {
  console.log('[dev] Compiling Electron main and preload...');
  await buildMainAndPreload();

  console.log('[dev] Starting Vite dev server...');
  const vite = spawn('npx', ['vite'], {
    cwd: path.resolve(__dirname, '..'),
    shell: true,
    stdio: 'inherit',
  });

  await waitForServer('http://localhost:5173');
  console.log('[dev] Vite dev server ready. Launching Electron...');

  const electronPath = require('electron');
  const electronProcess = spawn(electronPath, [path.resolve(__dirname, '../dist/main/index.js')], {
    cwd: path.resolve(__dirname, '..'),
    stdio: 'inherit',
    env: {
      ...process.env,
      VITE_DEV_SERVER_URL: 'http://localhost:5173',
      NODE_ENV: 'development',
    },
  });

  electronProcess.on('close', () => {
    vite.kill();
    process.exit();
  });
}

start().catch(err => {
  console.error(err);
  process.exit(1);
});
