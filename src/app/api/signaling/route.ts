// app/api/signaling/route.ts
import { NextRequest, NextResponse } from 'next/server';

// In-memory store for signaling
const connections = new Map<
  string,
  {
    desktop?: { lastSeen: number };
    mobile?: { lastSeen: number };
    messages: Array<{
      id: string;
      from: 'desktop' | 'mobile';
      to: 'desktop' | 'mobile';
      type: string;
      data: any;
      timestamp: number;
    }>;
  }
>();

// Helper to clean up old connections
function cleanupOldConnections() {
  const now = Date.now();
  const FIVE_MINUTES = 5 * 60 * 1000;
  
  for (const [code, conn] of connections.entries()) {
    const desktopOld = conn.desktop && now - conn.desktop.lastSeen > FIVE_MINUTES;
    const mobileOld = conn.mobile && now - conn.mobile.lastSeen > FIVE_MINUTES;
    
    if (desktopOld && mobileOld) {
      connections.delete(code);
      console.log(`Cleaned up connection: ${code}`);
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pairingCode, role, type, data } = body;

    console.log(`[SIGNALING] POST from ${role}: ${type}`, { pairingCode });

    if (!pairingCode || !role || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Initialize connection
    if (!connections.has(pairingCode)) {
      connections.set(pairingCode, { messages: [] });
      console.log(`Created new connection: ${pairingCode}`);
    }

    const conn = connections.get(pairingCode)!;

    // Update presence
    if (role === 'desktop') {
      conn.desktop = { lastSeen: Date.now() };
    } else if (role === 'mobile') {
      conn.mobile = { lastSeen: Date.now() };
    }

    // Add message (except heartbeats)
    if (type !== 'heartbeat') {
      // Determine recipient
      const to = role === 'desktop' ? 'mobile' : 'desktop';
      
      conn.messages.push({
        id: Math.random().toString(36).substring(2, 15),
        from: role,
        to,
        type,
        data,
        timestamp: Date.now(),
      });
      
      console.log(`[SIGNALING] Stored ${type} from ${role} to ${to}`);
      
      // Keep last 50 messages
      if (conn.messages.length > 50) {
        conn.messages = conn.messages.slice(-50);
      }
    }

    // Cleanup occasionally
    if (Math.random() < 0.1) {
      cleanupOldConnections();
    }

    return NextResponse.json({
      success: true,
      status: conn.desktop && conn.mobile ? 'connected' : 'waiting',
      hasDesktop: !!conn.desktop,
      hasMobile: !!conn.mobile,
      messageCount: conn.messages.length,
    });

  } catch (error) {
    console.error('Signaling API POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const pairingCode = searchParams.get('pairingCode');
    const role = searchParams.get('role');
    const since = searchParams.get('since');

    console.log(`[SIGNALING] GET from ${role}`, { pairingCode, since });

    if (!pairingCode || !role) {
      return NextResponse.json({ error: 'Missing pairingCode or role' }, { status: 400 });
    }

    const conn = connections.get(pairingCode);
    if (!conn) {
      console.log(`Connection not found: ${pairingCode}`);
      return NextResponse.json({ error: 'Connection not found' }, { status: 404 });
    }

    // Update presence
    if (role === 'desktop') {
      conn.desktop = { lastSeen: Date.now() };
    } else if (role === 'mobile') {
      conn.mobile = { lastSeen: Date.now() };
    }

    // Get messages for this role
    const filteredMessages = conn.messages.filter(msg => msg.to === role);
    
    // Get new messages since timestamp
    const newMessages = since 
      ? filteredMessages.filter(msg => msg.timestamp > parseInt(since))
      : filteredMessages;

    console.log(`[SIGNALING] Returning ${newMessages.length} messages to ${role}`);

    return NextResponse.json({
      status: conn.desktop && conn.mobile ? 'connected' : 'waiting',
      hasDesktop: !!conn.desktop,
      hasMobile: !!conn.mobile,
      messages: newMessages,
      timestamp: Date.now(),
      totalMessages: conn.messages.length,
    });

  } catch (error) {
    console.error('Signaling API GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Debug endpoint
export async function PUT(request: NextRequest) {
  return NextResponse.json({
    totalConnections: connections.size,
    connections: Array.from(connections.entries()).map(([code, conn]) => ({
      code,
      desktop: conn.desktop ? { 
        lastSeen: new Date(conn.desktop.lastSeen).toISOString(),
        age: Date.now() - conn.desktop.lastSeen 
      } : null,
      mobile: conn.mobile ? { 
        lastSeen: new Date(conn.mobile.lastSeen).toISOString(),
        age: Date.now() - conn.mobile.lastSeen 
      } : null,
      messages: conn.messages.map(m => ({
        id: m.id,
        from: m.from,
        to: m.to,
        type: m.type,
        timestamp: new Date(m.timestamp).toISOString(),
        dataSize: JSON.stringify(m.data).length
      }))
    }))
  });
}