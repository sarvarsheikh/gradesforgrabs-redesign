import { spawn } from 'child_process';
import fs from 'fs';

async function testModal() {
  const chrome = spawn('google-chrome', [
    '--headless',
    '--disable-gpu',
    '--remote-debugging-port=9223',
    '--window-size=1440,900',
    'http://localhost:4173/'
  ]);

  await new Promise(r => setTimeout(r, 1500));
  try {
    const listResp = await fetch('http://127.0.0.1:9223/json');
    const tabs = await listResp.json();
    const tab = tabs.find(t => t.type === 'page');
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
    await new Promise(r => setTimeout(r, 1000));

    // Scroll to cinema and click first reel
    await send('Runtime.evaluate', {
      expression: `
        document.querySelector('#cinema')?.scrollIntoView({ behavior: 'instant' });
        document.querySelector('.reel-card')?.click();
      `
    });
    await new Promise(r => setTimeout(r, 800));

    const shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('/home/network/Documents/gradesforgrabs-redesign/shot_modal.png', Buffer.from(shot.data, 'base64'));
    console.log('Saved shot_modal.png successfully');
    ws.close();
  } finally {
    chrome.kill();
  }
}

testModal().catch(console.error);
