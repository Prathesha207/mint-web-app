const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });
const connections = new Map();

wss.on('connection', (ws, req) => {
  const code = new URL(req.url, `https//${req.headers.host}`).searchParams.get('code');
  const role = new URL(req.url, `https//${req.headers.host}`).searchParams.get('role');

  if (!connections.has(code)) {
    connections.set(code, { desktop: null, mobile: null });
  }

  const conn = connections.get(code);
  if (role === 'desktop') conn.desktop = ws;
  if (role === 'mobile') conn.mobile = ws;

  ws.on('message', (message) => {
    const data = JSON.parse(message);
    const target = data.target === 'mobile' ? conn.mobile : conn.desktop;
    if (target && target.readyState === WebSocket.OPEN) {
      target.send(JSON.stringify(data));
    }
  });

  ws.on('close', () => {
    if (role === 'desktop') conn.desktop = null;
    if (role === 'mobile') conn.mobile = null;
  });
});