# API Service Logging Summary

## 🎯 **Overview**
Added comprehensive console logging to track all API transactions in the Mission Groomsmen application.

## 📊 **Logging Features Added**

### **1. Request/Response Tracking**
- **Unique Request IDs**: Each API call gets a unique identifier for easy tracking
- **Timestamps**: ISO timestamps for all log entries
- **Full Request Details**: Method, endpoint, headers, and body data
- **Response Details**: Status codes, response data, and error information

### **2. Method-Specific Logging**

#### **Session Management**
- `🚀 Starting session for user: [username]`
- `✅ Session started successfully: [sessionId]`
- `❌ Failed to start session for: [username]`
- `🔄 Updating session: [sessionId] -> [gameState] (completed: [boolean])`
- `🧹 Clearing session: [sessionId]`

#### **Groom Advice**
- `💬 Submitting groom advice from [username] ([length] chars)`
- `📝 Groom advice submission ✅ succeeded / ❌ failed`

#### **Analytics Events**
- `📊 Logging analytics event: [eventType] [eventData]`
- `🥚 Logging easter egg: [type] [details]`
- `🎯 Logging mission completion for: [username]`
- `🎵 Logging audio event: [action]`
- `🔐 Logging authentication attempt: [username] ([success/failed])`

#### **Error Handling**
- `⚠️ Cannot [action]: No session ID available`
- `❌ API Error [requestId]: [details]`

### **3. Service Initialization**
- `🔧 API Service initialized: [config]`
  - Shows base URL, environment, and restored session ID

## 🔍 **Console Output Examples**

### **Successful Session Start**
```
🔧 API Service initialized: {baseUrl: "https://...", environment: "production", restoredSessionId: "none"}
🚀 Starting session for user: John Doe
🌐 [2024-01-15T10:30:00.000Z] API Request [abc123def]: {method: "POST", endpoint: "https://.../api/session/start", sessionId: null, body: {userName: "John Doe"}}
✅ [2024-01-15T10:30:01.000Z] API Response [abc123def]: {status: 200, data: {success: true, sessionId: "session_1705312201000_abc123"}}
✅ Session started successfully: session_1705312201000_abc123
```

### **Analytics Event**
```
🥚 Logging easter egg: konami_code {userName: "John Doe"}
📊 Logging analytics event: easter_egg_konami_code {userName: "John Doe"}
🌐 [2024-01-15T10:30:05.000Z] API Request [def456ghi]: {method: "POST", endpoint: "https://.../api/analytics/event", sessionId: "session_1705312201000_abc123", body: {sessionId: "...", eventType: "easter_egg_konami_code", eventData: {userName: "John Doe"}}}
✅ [2024-01-15T10:30:06.000Z] API Response [def456ghi]: {status: 200, data: {success: true, message: "Analytics event logged"}}
```

### **Error Handling**
```
⚠️ Cannot submit groom advice: No session ID available
❌ [2024-01-15T10:30:10.000Z] API Error [ghi789jkl]: {endpoint: "/api/groom-advice", sessionId: null, error: "HTTP error! status: 500", fullError: Error}
```

## 🛠️ **Benefits**

### **Debugging**
- Track API calls in real-time
- Identify failed requests quickly
- Monitor session state changes
- Debug authentication issues

### **Development**
- Verify data being sent to backend
- Check response formats
- Monitor performance
- Validate error handling

### **Production Monitoring**
- Track user interactions
- Monitor API performance
- Identify backend issues
- Validate analytics data

## 📱 **Usage**

The logging is automatically active when the application runs. To view the logs:

1. **Browser**: Open Developer Tools → Console
2. **Development**: All logs will appear in the terminal
3. **Production**: Logs will appear in browser console

## 🔧 **Configuration**

The logging level can be controlled by:
- **Environment**: Different base URLs for dev/prod
- **Session State**: Automatic session restoration logging
- **Error Handling**: Non-blocking error logging

## 📈 **Monitoring Dashboard**

All logged events are also sent to the Cloudflare Worker backend for:
- Admin dashboard analytics
- User behavior tracking
- Performance monitoring
- Error reporting 