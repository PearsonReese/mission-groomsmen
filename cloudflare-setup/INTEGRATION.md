# Frontend Integration Guide

This guide shows you exactly what code to add to your existing `src/components/Terminal.tsx` file to integrate with the backend API.

## Step 1: Add Import

Add this import at the top of `Terminal.tsx`:

```typescript
import { apiService } from '@/services/api';
```

## Step 2: Add Session State

In the Terminal component, add this state variable around line 52 (after other useState hooks):

```typescript
const [sessionId, setSessionId] = useState<string | null>(null);
```

## Step 3: Add Session Initialization Function

Add this function after the `startIntroSequence` function (around line 285):

```typescript
const initializeSession = async (userName: string) => {
  try {
    const sessionId = await apiService.startSession(userName);
    if (sessionId) {
      setSessionId(sessionId);
      // Log authentication attempt
      await apiService.logAuthenticationAttempt(userName, true);
    }
  } catch (error) {
    console.error('Failed to initialize session:', error);
    // Don't break the app if backend is down
  }
};
```

## Step 4: Update Name Input Handler

In the `handleSubmit` function, find the `case 'name_input':` section (around line 500) and add session initialization after `setUserName(userName)`:

```typescript
case 'name_input':
  // ... existing code ...
  setUserName(userName);
  
  // Initialize backend session
  await initializeSession(userName);
  
  // ... rest of existing code ...
  break;
```

## Step 5: Update Groom Advice Handler

Replace the entire `case 'groom_advice':` section (around line 1140) with:

```typescript
case 'groom_advice':
  // Show the groom advice prompt if not already shown
  if (!lines.some(line => line.text.includes('FINAL MISSION DEBRIEFING'))) {
    await addLines(groomAdviceData.prompt);
  }
  
  // Handle the groom advice submission
  if (groomAdvice.trim()) {
    // User provided advice - Save to backend
    const saveSuccess = await apiService.submitGroomAdvice(userName, groomAdvice);
    
    if (saveSuccess) {
      await addLines(groomAdviceData.submit);
      console.log(`✅ Groom advice saved from ${userName}`);
    } else {
      await addLines(groomAdviceData.submit); // Still show success to user
      console.log(`⚠️ Groom advice failed to save from ${userName}:`, groomAdvice);
    }
  } else {
    // User skipped
    await addLines(groomAdviceData.skip);
  }
  
  // Update session as completed
  await apiService.updateSession('completed', true);
  await apiService.logMissionComplete(userName);
  
  setGameState('completed');
  break;
```

## Step 6: Update Restart Function

In the `restartTerminal` function (around line 288), add these lines:

```typescript
const restartTerminal = async () => {
  setLines([]);
  setCurrentInput('');
  setGameState('intro');
  setUserName('');
  setIsTyping(false);
  setUnauthorizedAttempts(0);
  setGroomAdvice('');
  setSessionId(null); // ADD THIS LINE
  introStartedRef.current = false;
  
  // Clear session from backend
  apiService.clearSession(); // ADD THIS LINE
  
  // ... rest of existing code ...
};
```

## Step 7: Add Game State Tracking

Throughout the `handleSubmit` function, wherever you call `setGameState(newState)`, add this line right after:

```typescript
await apiService.updateSession(newGameState);
```

For example:
```typescript
setGameState('verification');
await apiService.updateSession('verification');
```

## Step 8: Add Easter Egg Logging

In your easter egg handlers, add logging calls:

```typescript
// For Tom Cruise easter egg
await apiService.logEasterEgg('tom_cruise', { userName });

// For Konami code
await apiService.logEasterEgg('konami_code', { userName });

// For magic strings
await apiService.logEasterEgg('magic_string', { string: input, userName });
```

## Step 9: Audio Event Logging (Optional)

If you want to track audio interactions, add these to your AudioManager integration:

```typescript
// When audio plays
await apiService.logAudioEvent('play');

// When audio pauses
await apiService.logAudioEvent('pause');

// When audio mutes
await apiService.logAudioEvent('mute');
```

## Testing Integration

1. Make sure your Cloudflare Worker is deployed and running
2. Update the API URLs in `src/services/api.ts` and `src/components/AdminDashboard.tsx`
3. Test the app - it should work exactly the same, but now save data to your backend
4. Check the admin dashboard at `/admin` to see collected data

## Troubleshooting

- If the app breaks, check the browser console for API errors
- The app is designed to continue working even if the backend is down
- All API calls are non-blocking and won't interrupt the user experience