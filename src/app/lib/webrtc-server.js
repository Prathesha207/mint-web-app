const WebSocket = require('ws');
const http = require('http');

// Create HTTP server
const server = http.createServer();
const wss = new WebSocket.Server({ server });

// Store active connections
const connections = new Map();

// STUN/TURN servers (you can add your own TURN server later)
const iceServers = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' },
    { urls: 'stun:stun4.l.google.com:19302' }
  ]
};

wss.on('connection', (ws, req) => {
  const sessionId = new URL(req.url, `https//${req.headers.host}`).searchParams.get('session');

  console.log(`New WebSocket connection for session: ${sessionId}`);

  if (!sessionId) {
    ws.close(1008, 'No session ID provided');
    return;
  }

  // Store connection
  ws.sessionId = sessionId;
  ws.role = null; // 'sender' or 'receiver'
  connections.set(sessionId, ws);

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      console.log(`Message in session ${sessionId} (${data.type}):`, data);

      switch (data.type) {
        case 'join':
          ws.role = data.role;
          console.log(`${sessionId}: ${data.role} joined`);

          // Notify other peer if both are connected
          const peerWs = connections.get(sessionId);
          if (peerWs && peerWs !== ws) {
            peerWs.send(JSON.stringify({
              type: 'peer-joined',
              role: data.role
            }));
          }
          break;

        case 'offer':
        case 'answer':
        case 'ice-candidate':
          // Forward signaling messages to the other peer
          forwardToPeer(sessionId, ws, data);
          break;

        case 'ping':
          ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
          break;

        case 'disconnect':
          console.log(`Disconnect: ${sessionId} (${ws.role})`);
          cleanupConnection(sessionId, ws);
          break;
      }
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  });

  ws.on('close', () => {
    console.log(`Connection closed: ${sessionId} (${ws.role})`);
    cleanupConnection(sessionId, ws);
  });

  ws.on('error', (error) => {
    console.error(`WebSocket error (${sessionId}):`, error);
    cleanupConnection(sessionId, ws);
  });
});

function forwardToPeer(sessionId, senderWs, message) {
  // Find other peer in the same session
  const peerWs = connections.get(sessionId);

  if (peerWs && peerWs !== senderWs && peerWs.readyState === WebSocket.OPEN) {
    console.log(`Forwarding ${message.type} from ${senderWs.role} to ${peerWs.role}`);
    peerWs.send(JSON.stringify(message));
  } else {
    console.log(`No peer available to forward ${message.type}`);
    // Notify sender that peer is not available
    if (senderWs.readyState === WebSocket.OPEN) {
      senderWs.send(JSON.stringify({
        type: 'peer-unavailable',
        message: 'Waiting for peer to connect...'
      }));
    }
  }
}

function cleanupConnection(sessionId, ws) {
  // Notify other peer about disconnection
  const peerWs = connections.get(sessionId);
  if (peerWs && peerWs !== ws && peerWs.readyState === WebSocket.OPEN) {
    peerWs.send(JSON.stringify({
      type: 'peer-disconnected',
      role: ws.role
    }));
  }

  // Remove from connections map
  connections.delete(sessionId);
}

// Start server
const PORT = process.env.WEBSOCKET_PORT || 8080;
server.listen(PORT, () => {
  console.log(`WebRTC Signaling Server running on ws://localhost:${PORT}`);
});

// Keep alive ping every 30 seconds
setInterval(() => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.ping();
    }
  });
}, 30000);