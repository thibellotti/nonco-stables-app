import { chromium } from 'playwright';
import { readFileSync, mkdirSync } from 'node:fs';
const dir = new URL('.', import.meta.url).pathname;
const lottieJs = readFileSync(dir + 'node_modules/lottie-web/build/player/lottie.min.js', 'utf8');
const data = readFileSync(dir + 'orbital-mark.json', 'utf8');
mkdirSync(dir + 'verify', { recursive: true });
const html = `<!doctype html><html><head><meta charset=utf8><style>html,body{margin:0;background:#141414}#c{width:256px;height:256px}</style></head><body><div id="c"></div><script>${lottieJs}</script><script>const a=lottie.loadAnimation({container:document.getElementById('c'),renderer:'svg',loop:false,autoplay:false,animationData:${data}});a.addEventListener('DOMLoaded',()=>{window.__r=true});window.seek=f=>a.goToAndStop(f,true);</script></body></html>`;
const b = await chromium.launch({ channel: 'chrome', headless: true });
const ctx = await b.newContext({ viewport: { width: 256, height: 256 }, deviceScaleFactor: 3 });
const p = await ctx.newPage();
await p.setContent(html, { waitUntil: 'load' });
await p.waitForFunction('window.__r===true', null, { timeout: 15000 });
for (const f of [0, 180, 360]) { await p.evaluate(fr => window.seek(fr), f); await p.locator('#c').screenshot({ path: `${dir}verify/f${f}.png` }); }
await b.close(); console.log('ok');
