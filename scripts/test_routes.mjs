import http from 'http';
import { spawn } from 'child_process';

const port = 3030;
process.env.PORT = String(port);
process.env.NITRO_PORT = String(port);

const server = spawn('node', ['.output/server/index.mjs'], {
  env: process.env,
  stdio: ['ignore', 'pipe', 'pipe']
});

server.stdout.on('data', d => console.log('[Server stdout]', d.toString().trim()));
server.stderr.on('data', d => console.error('[Server stderr]', d.toString().trim()));

function testUrl(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://127.0.0.1:${port}${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ path, statusCode: res.statusCode, headers: res.headers, length: data.length, preview: data.slice(0, 100) });
      });
    }).on('error', reject);
  });
}

// Wait for server to boot
setTimeout(async () => {
  try {
    const routes = [
      '/',
      '/blog',
      '/categories',
      '/categories/technology',
      '/categories/home-and-diy',
      '/categories/food',
      '/categories/parenting',
      '/blog/autonomous-systems-agentic-workflows-2026',
      '/blog/modern-acoustic-wood-slat-paneling-guide',
      '/about',
      '/contact',
      '/privacy',
      '/terms',
      '/fonts/poppins-500-normal.woff2'
    ];

    console.log('--- Probing Headline Central routes ---');
    for (const r of routes) {
      const res = await testUrl(r);
      console.log(`[${res.statusCode}] ${res.path} (${res.length} bytes)`);
      if (res.statusCode !== 200) {
        throw new Error(`Route ${r} returned non-200 status: ${res.statusCode}`);
      }
    }
    console.log('--- All 14 routes passed with HTTP 200 OK! ---');
  } catch (err) {
    console.error('Test failed:', err);
    process.exitCode = 1;
  } finally {
    server.kill();
    process.exit();
  }
}, 2500);

