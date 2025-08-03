// API service for Mission Groomsmen backend integration
// Handles communication with Cloudflare Worker

interface UserSessionData {
  userName: string;
  gameState: string;
  completedMission: boolean;
  groomAdvice?: string;
  easterEggsActivated: string[];
}

interface AnalyticsEvent {
  sessionId: string;
  eventType: string;
  eventData?: any;
}

class ApiService {
  private baseUrl: string;
  private sessionId: string | null = null;

  constructor() {
    // Set your Cloudflare Worker URL here
    this.baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://mission-groomsmen-api.reese-wedding.workers.dev' 
      : 'http://127.0.0.1:8787'; // For local development with Wrangler
    
    // Try to restore session from localStorage
    this.sessionId = localStorage.getItem('mission_session_id');
    
    console.log(`🔧 API Service initialized:`, {
      baseUrl: this.baseUrl,
      environment: process.env.NODE_ENV || 'development',
      restoredSessionId: this.sessionId || 'none'
    });
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    const requestId = Math.random().toString(36).substr(2, 9);
    const timestamp = new Date().toISOString();
    
    // Log outgoing request
    console.log(`🌐 [${timestamp}] API Request [${requestId}]:`, {
      method: options.method || 'GET',
      endpoint: `${this.baseUrl}${endpoint}`,
      sessionId: this.sessionId,
      body: options.body ? JSON.parse(options.body as string) : undefined,
      headers: options.headers
    });

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      const responseData = await response.json();
      
      // Log successful response
      console.log(`✅ [${timestamp}] API Response [${requestId}]:`, {
        status: response.status,
        statusText: response.statusText,
        data: responseData,
        endpoint
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return responseData;
    } catch (error) {
      // Log error response
      console.error(`❌ [${timestamp}] API Error [${requestId}]:`, {
        endpoint,
        sessionId: this.sessionId,
        error: error instanceof Error ? error.message : 'Unknown error',
        fullError: error
      });
      
      // Don't throw error to avoid breaking the app if backend is down
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Start a new user session
  async startSession(userName: string): Promise<string | null> {
    console.log(`🚀 Starting session for user: ${userName}`);
    
    const result = await this.makeRequest('/api/session/start', {
      method: 'POST',
      body: JSON.stringify({ userName }),
    });

    if (result.success && result.sessionId) {
      this.sessionId = result.sessionId;
      localStorage.setItem('mission_session_id', result.sessionId);
      console.log(`✅ Session started successfully: ${result.sessionId}`);
      return this.sessionId;
    }

    console.log(`❌ Failed to start session for: ${userName}`);
    return null;
  }

  // Update session state
  async updateSession(gameState: string, completedMission: boolean = false, easterEggsActivated: string[] = []): Promise<void> {
    if (!this.sessionId) {
      console.log(`⚠️ Cannot update session: No session ID available`);
      return;
    }

    console.log(`🔄 Updating session: ${this.sessionId} -> ${gameState} (completed: ${completedMission})`);
    
    await this.makeRequest('/api/session/update', {
      method: 'PUT',
      body: JSON.stringify({
        sessionId: this.sessionId,
        gameState,
        completedMission,
        easterEggsActivated,
      }),
    });
  }

  // Submit contact information
  async submitContactInfo(userName: string, email?: string, address?: string): Promise<boolean> {
    if (!this.sessionId) {
      console.log(`⚠️ Cannot submit contact info: No session ID available`);
      return false;
    }

    console.log(`📧 Submitting contact info from ${userName}`, { 
      hasEmail: !!email, 
      hasAddress: !!address,
      emailLength: email?.length || 0,
      addressLength: address?.length || 0
    });
    
    const result = await this.makeRequest('/api/contact-info', {
      method: 'POST',
      body: JSON.stringify({
        sessionId: this.sessionId,
        userName,
        email,
        address,
      }),
    });

    const success = result.success === true;
    console.log(`📝 Contact info submission ${success ? '✅ succeeded' : '❌ failed'}`);
    return success;
  }

  // Submit email address
  async submitEmail(userName: string, email: string): Promise<boolean> {
    console.log(`📧 Submitting email for ${userName}: ${email}`);
    return this.submitContactInfo(userName, email);
  }

  // Submit mailing address
  async submitAddress(userName: string, address: string): Promise<boolean> {
    console.log(`📮 Submitting address for ${userName} (${address.length} chars)`);
    return this.submitContactInfo(userName, undefined, address);
  }

  // Submit groom advice
  async submitGroomAdvice(userName: string, advice: string): Promise<boolean> {
    if (!this.sessionId) {
      console.log(`⚠️ Cannot submit groom advice: No session ID available`);
      return false;
    }

    console.log(`💬 Submitting groom advice from ${userName} (${advice.length} chars)`);
    
    const result = await this.makeRequest('/api/groom-advice', {
      method: 'POST',
      body: JSON.stringify({
        sessionId: this.sessionId,
        userName,
        advice,
      }),
    });

    const success = result.success === true;
    console.log(`📝 Groom advice submission ${success ? '✅ succeeded' : '❌ failed'}`);
    return success;
  }

  // Log analytics events (easter eggs, audio play, etc.)
  async logEvent(eventType: string, eventData?: any): Promise<void> {
    if (!this.sessionId) {
      console.log(`⚠️ Cannot log event ${eventType}: No session ID available`);
      return;
    }

    console.log(`📊 Logging analytics event: ${eventType}`, eventData || '');
    
    await this.makeRequest('/api/analytics/event', {
      method: 'POST',
      body: JSON.stringify({
        sessionId: this.sessionId,
        eventType,
        eventData,
      }),
    });
  }

  // Convenience methods for common analytics events
  async logEasterEgg(easterEggType: string, details?: any): Promise<void> {
    console.log(`🥚 Logging easter egg: ${easterEggType}`, details || '');
    await this.logEvent(`easter_egg_${easterEggType}`, details);
  }

  async logMissionComplete(userName: string): Promise<void> {
    console.log(`🎯 Logging mission completion for: ${userName}`);
    await this.logEvent('mission_complete', { userName });
  }

  async logAudioEvent(action: 'play' | 'pause' | 'mute' | 'skip'): Promise<void> {
    console.log(`🎵 Logging audio event: ${action}`);
    await this.logEvent(`audio_${action}`);
  }

  async logAuthenticationAttempt(userName: string, success: boolean): Promise<void> {
    console.log(`🔐 Logging authentication attempt: ${userName} (${success ? 'success' : 'failed'})`);
    await this.logEvent('authentication_attempt', { userName, success });
  }

  // Get current session ID
  getSessionId(): string | null {
    return this.sessionId;
  }

  // Clear session (for restart)
  clearSession(): void {
    console.log(`🧹 Clearing session: ${this.sessionId || 'none'}`);
    this.sessionId = null;
    localStorage.removeItem('mission_session_id');
  }
}

// Create singleton instance
export const apiService = new ApiService();

// Export types for use in components
export type { UserSessionData, AnalyticsEvent };