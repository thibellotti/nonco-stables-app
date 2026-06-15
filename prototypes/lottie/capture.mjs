// Render orbital-mark.json to a PNG frame sequence by driving system Chrome via Playwright,
// then leave ffmpeg to assemble GIF/MP4. Offline: lottie + data are inlined, system Chrome is used.
import { chromium } from 'playwright';
import { readFileSync, mkdirSync, rmSync } from 'node:fs';

const dir = new URL('.', import.meta.url).pathname;
const lottieJs = readFileSync(dir + 'node_modules/lottie-web/build/player/lottie.min.js', 'utf8');
const data = readFileSync(dir + 'orbital-mark.json', 'utf8');
const OP = JSON.parse(data).op;
const BG = process.argv[2] || '#141414';

rmSync(dir + 'frames', { recursive: true, force: true });
mkdirSync(dir + 'frames', { recursive: true });

const html = `<!doctype html><html><head><meta charset=utf8><style>
html,body{margin:0;background:${BG}}#c{width:256px;height:256px}</style></head>
<body><div id="c"></div><script>${lottieJs}</script><script>
const anim=lottie.loadAnimation({container:document.getElementById('c'),renderer:'svg',loop:false,autoplay:false,animationData:${data}});
anim.addEventListener('DOMLoaded',()=>{window.__ready=true});
window.seek=f=>anim.goToAndStop(f,true);
</script></body></html>`;

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const ctx = await browser.newContext({ viewport: { width: 256, height: 256 }, deviceScaleFactor: 3 });
const page = await ctx.newPage();
await page.setContent(html, { waitUntil: 'load' });
await page.waitForFunction('window.__ready === true', null, { timeout: 15000 });

const el = page.locator('#c');
let n = 0;
for (let f = 0; f < OP; f += 4) { // 60fps source → 30fps capture
  await page.evaluate((fr) => window.seek(fr), f);
  await el.screenshot({ path: `${dir}frames/${String(n).padStart(3, '0')}.png` });
  n++;
}
await browser.close();
console.log('captured', n, 'frames @', BG);
