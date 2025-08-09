# Analytics Events Tracking Documentation

This document outlines all the analytics events being tracked in the Mission Groomsmen Terminal application.

## Session Management Events

### `session_start`
- **Triggered**: When a user starts a new session
- **Data**: `{ userName, sessionId }`
- **Location**: `initializeSession()` function

### `session_restart`
- **Triggered**: When a user restarts the terminal experience
- **Data**: `{ userName, previousGameState, sessionDuration }`
- **Location**: `restartTerminal()` function

### `session_update`
- **Triggered**: When game state changes
- **Data**: `{ sessionId, gameState, completedMission, easterEggsActivated }`
- **Location**: `updateGameState()` function

## Authentication Events

### `authentication_attempt`
- **Triggered**: When a user attempts to authenticate
- **Data**: `{ userName, success }`
- **Location**: `initializeSession()` function

### `unauthorized_access_attempt`
- **Triggered**: When an unauthorized user tries to access the system
- **Data**: `{ userName, attemptNumber, maxAttempts }`
- **Location**: Name input validation

### `security_lockdown`
- **Triggered**: When max unauthorized attempts are exceeded
- **Data**: `{ userName, totalAttempts, reason }`
- **Location**: Security violation handling

## Verification Events

### `verification_failure`
- **Triggered**: When a user fails a verification question
- **Data**: `{ userName, attemptNumber, maxAttempts, question }`
- **Location**: Verification question handling

### `verification_lockout`
- **Triggered**: When max verification attempts are exceeded
- **Data**: `{ userName, totalAttempts, maxAttempts, reason }`
- **Location**: Verification failure handling

## Easter Egg Events

### `easter_egg_konami_code`
- **Triggered**: When Konami code is activated
- **Data**: `{ userName }`
- **Location**: `handleKonamiCode()` function

### `easter_egg_magic_string`
- **Triggered**: When magic strings are detected
- **Data**: `{ string, input, userName }`
- **Location**: `checkMagicStrings()` function

### `easter_egg_tomCruise`
- **Triggered**: When Tom Cruise easter egg is activated
- **Data**: `{ userName }`
- **Location**: Easter egg flow detection

### `easter_egg_ethanHunt`
- **Triggered**: When Ethan Hunt easter egg is activated
- **Data**: `{ userName }`
- **Location**: Easter egg flow detection

### `easter_egg_pearsonReese`
- **Triggered**: When Pearson Reese easter egg is activated
- **Data**: `{ userName }`
- **Location**: Easter egg flow detection

### `easter_egg_jordanSwann`
- **Triggered**: When Jordan Swann easter egg is activated
- **Data**: `{ userName }`
- **Location**: Swann disambiguation flow

## Mission Events

### `mission_accepted`
- **Triggered**: When a user accepts the mission
- **Data**: `{ userName }`
- **Location**: Mission choice handling

### `mission_declined`
- **Triggered**: When a user declines the mission
- **Data**: `{ userName }`
- **Location**: Mission choice handling

### Bridesmaids
- Bridesmaids follow the same event lifecycle as groomsmen with the same analytics events. Their detection and authorization are handled via last-name matching against `bridesmaidNames` and produce role-specific briefings and responses.

### `invalid_mission_response`
- **Triggered**: When a user provides invalid response to mission choice
- **Data**: `{ userName, response }`
- **Location**: Mission choice validation

### `mission_complete`
- **Triggered**: When a user completes the mission
- **Data**: `{ userName }`
- **Location**: `logMissionComplete()` function

### `mission_completed`
- **Triggered**: When mission is fully completed with additional details
- **Data**: `{ userName, groomAdviceProvided, adviceLength, gameState }`
- **Location**: Groom advice completion

## Groom Advice Events

### `groom_advice_submitted`
- **Triggered**: When user submits groom advice
- **Data**: `{ userName, adviceLength, saveSuccess }`
- **Location**: Groom advice submission

### `groom_advice_skipped`
- **Triggered**: When user skips groom advice
- **Data**: `{ userName }`
- **Location**: Groom advice skip

## Audio Events

### `audio_play`
- **Triggered**: When audio is played
- **Data**: `{ sessionId }`
- **Location**: AudioManager component

### `audio_pause`
- **Triggered**: When audio is paused
- **Data**: `{ sessionId }`
- **Location**: AudioManager component

### `audio_mute`
- **Triggered**: When audio is muted
- **Data**: `{ sessionId }`
- **Location**: AudioManager component

### `audio_skip`
- **Triggered**: When user skips audio dialog
- **Data**: `{ sessionId }`
- **Location**: AudioManager component

## Mobile Interaction Events

### `mobile_cta_used`
- **Triggered**: When mobile CTA buttons are used
- **Data**: `{ action, answer }`
- **Location**: Mobile CTA button handlers

## Database Schema

The analytics events are stored in the `analytics_events` table with the following structure:

```sql
CREATE TABLE analytics_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  event_data TEXT, -- JSON string
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Usage in Admin Dashboard

These events are used in the admin dashboard to provide insights into:
- User engagement patterns
- Popular easter eggs
- Authentication success rates
- Mission completion rates
- Audio usage statistics
- Mobile vs desktop usage
- Verification question performance

## Implementation Notes

- All events are logged asynchronously to avoid blocking the UI
- Events include session context when available
- Failed API calls don't break the user experience
- Events are structured for easy analysis and reporting 