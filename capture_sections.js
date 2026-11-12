import { spawn } from 'child_process';
import fs from 'fs';

async function run() {
  const chrome = spawn('google-chrome', [
    '--headless',
    '--disable-gpu',
    '--remote-debugging-port=9222',
    '--window-size=1440,900',
    'http://localhost:4173/'
  ]);

  await new Promise(r => setTimeout(r, 1500));

  try {
    const listResp = await fetch('http://127.0.0.1:9222/json');
    const tabs = await listResp.json();
    const tab = tabs.find(t => t.type === 'page');
    if (!tab) throw new Error('No page tab found');

    const ws = new WebSocket(tab.webSocketDebuggerUrl);
    let id = 1;

    function send(method, params = {}) {
      return new Promise((resolve) => {
        const msgId = id++;
        const handler = (event) => {
          const data = JSON.parse(event.data);
          if (data.id === msgId) {
            ws.removeEventListener('message', handler);
            resolve(data.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id: msgId, method, params }));
      });
    }

    await new Promise(r => ws.addEventListener('open', r));

    // Wait for page ready
    await new Promise(r => setTimeout(r, 1000));

    async function capture(selector, filename) {
      await send('Runtime.evaluate', {
        expression: `document.querySelector('${selector}')?.scrollIntoView({ behavior: 'instant', block: 'start' });`
      });
      await new Promise(r => setTimeout(r, 800));
      const shot = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(filename, Buffer.from(shot.data, 'base64'));
      console.log(`Saved ${filename}`);
    }

    await capture('#cinema', '/home/network/Documents/gradesforgrabs-redesign/shot_cinema.png');
    await capture('#mission', '/home/network/Documents/gradesforgrabs-redesign/shot_mission.png');
    await capture('#blueprint', '/home/network/Documents/gradesforgrabs-redesign/shot_blueprint.png');
    await capture('#founder', '/home/network/Documents/gradesforgrabs-redesign/shot_founder.png');
    await capture('#simulator', '/home/network/Documents/gradesforgrabs-redesign/shot_simulator.png');
    await capture('#accolades', '/home/network/Documents/gradesforgrabs-redesign/shot_accolades.png');
    await capture('#involvement', '/home/network/Documents/gradesforgrabs-redesign/shot_involvement.png');

    ws.close();
  } finally {
    chrome.kill();
  }
}

run().catch(console.error);
