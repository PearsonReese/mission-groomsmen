// Cloudflare Worker for Mission Groomsmen Backend
// Deploy this to Cloudflare Workers

export interface Env {
  DB: D1Database;
  ADMIN_PASSWORD: string; // Set in Worker environment variables
}

declare global {
  interface D1Database {
    prepare(query: string): D1PreparedStatement;
  }
  
  interface D1PreparedStatement {
    bind(...values: any[]): D1PreparedStatement;
    run(): Promise<D1Result>;
    first(): Promise<any>;
    all(): Promise<{ results: any[] }>;
  }
}

interface UserSessionData {
  userName: string;
  gameState: string;
  ipAddress?: string;
  userAgent?: string;
  completedMission: boolean;
  groomAdvice?: string;
  easterEggsActivated: string[];
}

interface AnalyticsEvent {
  sessionId: string;
  eventType: string;
  eventData?: any;
}

// Generate unique session ID
function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Handle CORS
function corsHeaders(): HeadersInit {
  return {
    'Access-Control-Allow-Origin': '*', // In production, replace with your domain
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 200, headers: corsHeaders() });
    }

    try {
      // API Routes
      if (path === '/api/session/start' && request.method === 'POST') {
        return await startSession(request, env);
      }
      
      if (path === '/api/session/update' && request.method === 'PUT') {
        return await updateSession(request, env);
      }
      
      if (path === '/api/groom-advice' && request.method === 'POST') {
        return await submitGroomAdvice(request, env);
      }
      
      if (path === '/api/contact-info' && request.method === 'POST') {
        return await submitContactInfo(request, env);
      }
      
      if (path === '/api/analytics/event' && request.method === 'POST') {
        return await logAnalyticsEvent(request, env);
      }
      
      if (path === '/api/admin/dashboard' && request.method === 'GET') {
        return await getAdminDashboard(request, env);
      }
      
      if (path === '/api/admin/advice' && request.method === 'GET') {
        return await getAllGroomAdvice(request, env);
      }

      return new Response('Not Found', { status: 404, headers: corsHeaders() });
    } catch (error) {
      console.error('Worker error:', error);
      return new Response('Internal Server Error', { 
        status: 500, 
        headers: corsHeaders() 
      });
    }
  },
};

// Start a new user session
async function startSession(request: Request, env: Env): Promise<Response> {
  const data = await request.json() as { userName: string };
  const sessionId = generateSessionId();
  
  const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';
  const userAgent = request.headers.get('User-Agent') || 'unknown';

  try {
    await env.DB.prepare(`
      INSERT INTO user_sessions (session_id, user_name, ip_address, user_agent, game_state)
      VALUES (?, ?, ?, ?, 'intro')
    `).bind(sessionId, data.userName, clientIP, userAgent).run();

    return new Response(JSON.stringify({ 
      success: true, 
      sessionId,
      message: 'Session started successfully' 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders() }
    });
  } catch (error) {
    console.error('Database error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Failed to start session' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders() }
    });
  }
}

// Update session state
async function updateSession(request: Request, env: Env): Promise<Response> {
  const data = await request.json() as {
    sessionId: string;
    gameState: string;
    completedMission?: boolean;
    easterEggsActivated?: string[];
  };

  try {
    const easterEggsJson = data.easterEggsActivated ? 
      JSON.stringify(data.easterEggsActivated) : null;

    await env.DB.prepare(`
      UPDATE user_sessions 
      SET game_state = ?, 
          completed_mission = ?, 
          easter_eggs_activated = ?,
          updated_at = CURRENT_TIMESTAMP,
          completed_at = CASE WHEN ? = TRUE THEN CURRENT_TIMESTAMP ELSE completed_at END
      WHERE session_id = ?
    `).bind(
      data.gameState, 
      data.completedMission || false,
      easterEggsJson,
      data.completedMission || false,
      data.sessionId
    ).run();

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Session updated successfully' 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders() }
    });
  } catch (error) {
    console.error('Database error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Failed to update session' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders() }
    });
  }
}

// Submit groom advice
async function submitGroomAdvice(request: Request, env: Env): Promise<Response> {
  const data = await request.json() as {
    sessionId: string;
    userName: string;
    advice: string;
  };

  try {
    await env.DB.prepare(`
      INSERT INTO groom_advice (session_id, user_name, advice_text)
      VALUES (?, ?, ?)
    `).bind(data.sessionId, data.userName, data.advice).run();

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Groom advice submitted successfully' 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders() }
    });
  } catch (error) {
    console.error('Database error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Failed to submit advice' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders() }
    });
  }
}

// Submit contact information
async function submitContactInfo(request: Request, env: Env): Promise<Response> {
  const data = await request.json() as {
    sessionId: string;
    userName: string;
    email?: string;
    address?: string;
  };

  try {
    // Check if contact info already exists for this session
    const existing = await env.DB.prepare(`
      SELECT id FROM contact_info WHERE session_id = ?
    `).bind(data.sessionId).first();

    if (existing) {
      // Update existing record
      await env.DB.prepare(`
        UPDATE contact_info 
        SET email_address = COALESCE(?, email_address),
            mailing_address = COALESCE(?, mailing_address),
            email_collected_at = CASE WHEN ? IS NOT NULL THEN CURRENT_TIMESTAMP ELSE email_collected_at END,
            address_collected_at = CASE WHEN ? IS NOT NULL THEN CURRENT_TIMESTAMP ELSE address_collected_at END,
            updated_at = CURRENT_TIMESTAMP
        WHERE session_id = ?
      `).bind(data.email, data.address, data.email, data.address, data.sessionId).run();
    } else {
      // Insert new record
      await env.DB.prepare(`
        INSERT INTO contact_info (session_id, user_name, email_address, mailing_address, email_collected_at, address_collected_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `).bind(
        data.sessionId, 
        data.userName, 
        data.email, 
        data.address,
        data.email ? new Date().toISOString() : null,
        data.address ? new Date().toISOString() : null
      ).run();
    }

    // Update session to track contact collection status
    const updateFields = [];
    const updateValues = [];
    
    if (data.email !== undefined) {
      updateFields.push('email_collected = ?');
      updateValues.push(!!data.email);
    }
    
    if (data.address !== undefined) {
      updateFields.push('address_collected = ?');
      updateValues.push(!!data.address);
    }
    
    if (updateFields.length > 0) {
      updateValues.push(data.sessionId);
      await env.DB.prepare(`
        UPDATE user_sessions 
        SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
        WHERE session_id = ?
      `).bind(...updateValues).run();
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Contact information submitted successfully' 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders() }
    });
  } catch (error) {
    console.error('Database error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Failed to submit contact information' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders() }
    });
  }
}

// Log analytics events
async function logAnalyticsEvent(request: Request, env: Env): Promise<Response> {
  const data = await request.json() as AnalyticsEvent;

  try {
    await env.DB.prepare(`
      INSERT INTO analytics_events (session_id, event_type, event_data)
      VALUES (?, ?, ?)
    `).bind(
      data.sessionId, 
      data.eventType, 
      data.eventData ? JSON.stringify(data.eventData) : null
    ).run();

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Analytics event logged' 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders() }
    });
  } catch (error) {
    console.error('Database error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Failed to log event' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders() }
    });
  }
}

// Admin dashboard data
async function getAdminDashboard(request: Request, env: Env): Promise<Response> {
  // Simple authentication check
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || authHeader !== `Bearer ${env.ADMIN_PASSWORD}`) {
    return new Response('Unauthorized', { status: 401, headers: corsHeaders() });
  }

  try {
    // Get summary statistics
    const totalSessions = await env.DB.prepare('SELECT COUNT(*) as count FROM user_sessions').first();
    const completedMissions = await env.DB.prepare('SELECT COUNT(*) as count FROM user_sessions WHERE completed_mission = TRUE').first();
    const totalAdvice = await env.DB.prepare('SELECT COUNT(*) as count FROM groom_advice').first();
    
    // Get recent sessions
    const recentSessions = await env.DB.prepare(`
      SELECT user_name, game_state, completed_mission, started_at, completed_at
      FROM user_sessions
      ORDER BY started_at DESC
      LIMIT 20
    `).all();

    // Get easter egg analytics
    const easterEggStats = await env.DB.prepare(`
      SELECT event_type, COUNT(*) as count
      FROM analytics_events
      WHERE event_type LIKE 'easter_egg%'
      GROUP BY event_type
      ORDER BY count DESC
    `).all();

    const dashboardData = {
      statistics: {
        totalSessions: totalSessions?.count || 0,
        completedMissions: completedMissions?.count || 0,
        completionRate: totalSessions?.count > 0 ? 
          ((completedMissions?.count || 0) / totalSessions.count * 100).toFixed(1) : '0',
        totalAdvice: totalAdvice?.count || 0,
      },
      recentSessions: recentSessions.results || [],
      easterEggStats: easterEggStats.results || [],
    };

    return new Response(JSON.stringify(dashboardData), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders() }
    });
  } catch (error) {
    console.error('Database error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Failed to fetch dashboard data' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders() }
    });
  }
}

// Get all groom advice for admin
async function getAllGroomAdvice(request: Request, env: Env): Promise<Response> {
  // Simple authentication check
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || authHeader !== `Bearer ${env.ADMIN_PASSWORD}`) {
    return new Response('Unauthorized', { status: 401, headers: corsHeaders() });
  }

  try {
    const advice = await env.DB.prepare(`
      SELECT ga.user_name, ga.advice_text, ga.submitted_at, us.completed_mission
      FROM groom_advice ga
      JOIN user_sessions us ON ga.session_id = us.session_id
      ORDER BY ga.submitted_at DESC
    `).all();

    return new Response(JSON.stringify({ 
      success: true, 
      advice: advice.results || [] 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders() }
    });
  } catch (error) {
    console.error('Database error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Failed to fetch advice' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders() }
    });
  }
}