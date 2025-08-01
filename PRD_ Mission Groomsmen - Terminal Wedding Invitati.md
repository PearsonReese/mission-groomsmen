# PRD: Mission Groomsmen - Terminal Wedding Invitation App

## Executive Summary

**Mission Groomsmen** is a sophisticated, production-ready web application that transforms groomsmen invitations into an immersive Mission Impossible-themed terminal experience. Built with React, TypeScript, and Tailwind CSS with a fully configurable data structure and extensive easter egg system. The application has far exceeded the original single-day scope to include advanced features, special user handling, mobile optimization, and hidden Mission Impossible easter eggs.

## Product Overview

### **What We're Building**

A mobile-optimized terminal simulator that presents groomsmen invitations as classified missions with Mission Impossible music and audio controls.

### **Problem Statement**

Traditional groomsmen invitations lack personality and memorable experiences. Need a quick, engaging solution that works on mobile devices.

### **Solution**

A focused, single-day implementation with mobile-first design, name identification, and Mission Impossible audio experience.

## Core Requirements (Single-Day Focus)

### **Must-Have Features (MVP)**

#### Mobile-First Terminal Interface
- **Responsive design** optimized for mobile devices
- **Dark mode terminal aesthetic** with green text on black background
- **Touch-friendly interactions** for mobile users
- **Simplified command input** with button options and text input

#### Name Identification System
- **First question**: "Enter your name to access classified system"
- **Fuzzy matching** for predefined groomsmen names
- **Fallback options** for names not in the list
- **Personalized experience** based on identified person

#### Audio Experience
- **Mission Impossible theme music** that plays throughout the experience
- **Audio popup dialog** on first visit: "Please unmute your audio for the full experience"
- **Audio controls** (play/pause/mute) for user control
- **Background music** that loops seamlessly

#### Mission Impossible Theme
- **"Mission Briefing"** introduction sequence
- **Classified document styling** with redacted text effects
- **"Do you accept this mission?"** core interaction prompt
- **Simple yes/no response** with humorous follow-ups

### **Simplified User Flow**

1. **Audio Popup**: "Please unmute your audio for the full experience"
2. **Name Input**: "Enter your name to access classified system"
3. **Authentication**: "VERIFYING CLEARANCE LEVEL..."
4. **Mission Briefing**: "AGENT [NAME], YOU HAVE A NEW MISSION"
5. **Mission Details**: Wedding information and role
6. **Mission Acceptance**: "DO YOU ACCEPT THIS MISSION? (Y/N)"
7. **Confirmation**: Success sequence

### **Actual Groomsmen Names** ✅ CONFIGURED
```typescript
const groomsmenNames = [
  "Brad Swann",      // Best Man with special authentication
  "Kris Tarver", 
  "Will Howard",     // Bride's brother with special handling
  "Jordan Yan",
  "Beau Swann",      // Swann brother disambiguation system
  "Tel Holland",
  "Sam Rojas",
  "Mark Williard",
  "Maison Holes",
  "Adam Simpson",
  "Brent Adams",
  "Emma Howard"      // Bride - special fiancée flow
];
```

## Technical Requirements

### **Technology Stack**
- **Frontend**: React with TypeScript
- **Build Tool**: Vite
- **Runtime**: Bun for improved performance
- **Styling**: Tailwind CSS (mobile-first)
- **Audio**: Web Audio API or HTML5 Audio
- **Deployment**: Cloudflare Pages (free tier)

### **Development Setup** ✅ COMPLETED
```bash
# Project has been initialized with:
✅ React 19 + TypeScript
✅ Bun runtime and bundler  
✅ Tailwind CSS v4.1.11 configured
✅ shadcn/ui components (New York style, zinc theme)
✅ Path aliases configured (@/ → src/)
✅ Dark/light theme support with CSS variables
✅ Lucide React icons
```

**Available shadcn/ui Components:**
- Button, Card, Form, Input, Label, Select
- Ready for terminal-style UI implementation

**Current Project Structure:**
```
mission-groomsmen/
├── src/
│   ├── App.tsx              # Currently demo content - needs replacement
│   ├── components/ui/       # shadcn/ui components ready
│   ├── lib/utils.ts         # Utility functions (cn, etc.)
│   └── index.css           # Tailwind + custom animations
├── styles/globals.css       # Theme variables & dark mode
└── package.json            # All dependencies configured
```

### **Key Components**

#### Audio Manager
- **Background music player** with Mission Impossible theme
- **Audio popup dialog** component
- **Audio controls** (play/pause/mute)
- **Mobile audio handling** (iOS Safari compatibility)

#### Name Identification
- **Fuzzy search** for groomsmen names
- **Input validation** and suggestions
- **Fallback handling** for unknown names
- **Personalized content** based on identified person

#### Mobile Terminal Interface
- **Responsive terminal layout** for mobile screens
- **Touch-friendly buttons** for common commands
- **Text input** for name and responses
- **Smooth animations** optimized for mobile

## Deployment Strategy

### **Cloudflare Pages Setup**
- **Free hosting** on Cloudflare Pages
- **Custom domain** (optional)
- **Automatic deployments** from GitHub
- **CDN optimization** for fast loading

### **Audio Assets**
- **Mission Impossible theme** (royalty-free or licensed)
- **Audio file optimization** for web
- **Fallback handling** for audio-blocked browsers

## Implementation Timeline (Single Day)

## Implementation Status

### **Foundation** ✅ COMPLETED
- ✅ Project setup with React 19 + TypeScript + Bun runtime
- ✅ Tailwind CSS v4.1.11 configuration  
- ✅ shadcn/ui components (Button, Card, Input, etc.)
- ✅ Dark theme terminal aesthetic
- ✅ Path aliases and build configuration

### **Core Terminal Interface** ✅ COMPLETED
- ✅ Full-featured terminal UI component with dark theme
- ✅ Mobile-responsive terminal layout with touch support
- ✅ Animated typing effects and blinking cursor
- ✅ Command input and output system with scrolling
- ✅ Mission Impossible terminal styling and color scheme

### **Advanced Features** ✅ COMPLETED  
- ✅ Sophisticated name identification with fuzzy matching
- ✅ Special Swann brothers disambiguation system with biometric questions
- ✅ Complete audio system with Mission Impossible theme music
- ✅ Audio popup dialog and persistent controls with mobile optimization
- ✅ Full mission briefing sequence with structured content
- ✅ Special bride handling for Emma Howard with unique fiancée flow
- ✅ Best Man (Brad Swann) with ultimate clearance and security verification
- ✅ Howard family gender detection for Will/Emma disambiguation
- ✅ Security violation detection for unauthorized users
- ✅ Comprehensive error handling and user feedback
- ✅ Mobile-first design with touch-friendly button CTAs
- ✅ Line break display fixes for proper terminal formatting

### **Data Architecture** ✅ COMPLETED
- ✅ **Fully configurable mission data in single location** (`missionData.ts`)
- ✅ **Structured terminal messages and responses**
- ✅ **Special person handling (bride, best man, Swann brothers)**
- ✅ **Easter egg system with celebrity flows and hidden features**
- ✅ **Easy-to-modify content without touching component code**
- ✅ **Type-safe configuration with TypeScript**

### **Easter Egg System** 🎬 NEW FEATURE ADDED
- 🎬 **Celebrity Flows**: Tom Cruise, Ethan Hunt, Pearson Reese (groom) with custom missions
- 🎮 **Konami Code**: Classic ↑↑↓↓←→←→BA sequence for secret mode
- ✨ **Magic Strings**: "mission impossible", "self destruct", "impossible" trigger special responses
- 💻 **Console Easter Eggs**: Styled console messages with hints for developers
- 🔍 **Hidden Features**: Multiple discovery methods following web easter egg best practices
- 📱 **Mobile Compatible**: All easter eggs work seamlessly on mobile devices

### **Deployment & Polish** ✅ READY FOR DEPLOYMENT
- ✅ Code quality and linting complete
- ✅ Mobile optimization and responsive design complete
- ✅ Audio system implementation complete with fallback handling
- ✅ Easter egg system fully implemented and tested
- ✅ **BUILD SYSTEM FIXED**: Static assets now properly bundled for deployment
- ✅ **DEPLOYMENT SCRIPT**: Created `deploy.sh` with Cloudflare Pages instructions
- 🔄 **NEXT**: Deploy to Cloudflare Pages using updated build
- 🔄 **NEXT**: Production performance monitoring

## Success Criteria

### **Technical Requirements** ✅ ACHIEVED
- ✅ **Foundation Setup**: React 19 + TypeScript + Bun + Tailwind + shadcn/ui
- ✅ **Mobile-first responsive design**: Fully responsive terminal interface
- ✅ **Name identification with fuzzy matching**: Advanced matching with partial name support
- ✅ **Mission Impossible audio experience**: Complete audio system with controls
- ✅ **Audio popup dialog on first visit**: Implemented with persistent controls
- ✅ **Configurable data architecture**: All content centralized in missionData.ts
- 🔄 **Cloudflare Pages deployment**: Final deployment step

### **User Experience** ✅ ACHIEVED
- ✅ **Engaging Mission Impossible theme**: Complete terminal styling with authentic feel
- ✅ **Smooth mobile interactions**: Touch-friendly interface with optimized UX
- ✅ **Audio enhances the experience**: Mission Impossible theme music integration
- ✅ **Personalized content based on name**: Special handling for bride and Swann brothers
- ✅ **Sophisticated user flow**: Multi-state authentication and mission briefing system

### **Advanced Features** ✅ ACHIEVED (Far Beyond Original Scope)
- ✅ **Special Person Recognition**: Bride (Emma) gets unique fiancée briefing
- ✅ **Best Man Authentication**: Brad Swann gets ultimate clearance with security question
- ✅ **Swann Brothers Disambiguation**: Biometric question system ("Does your dog have balls?")
- ✅ **Howard Family Detection**: Gender-based detection for Will/Emma Howard
- ✅ **Security System**: Unauthorized access detection and lockdown
- ✅ **Error Handling**: Comprehensive user feedback and suggestions
- ✅ **Content Management**: Easily configurable without code changes
- ✅ **Easter Egg System**: Hidden celebrity flows and secret features
- ✅ **Mobile Optimization**: Touch-friendly buttons replace keyboard inputs on mobile
- ✅ **Line Break Rendering**: Proper visual line breaks for terminal formatting

## Configuration Guide

### **Centralized Data Architecture** 

All mission content is now centralized in `/src/utils/missionData.ts` for easy modification:

```typescript
// CORE CONFIGURATION - Easy to modify
export const groomsmenNames = [
  "Brad Swann",      // Best Man - gets special authentication
  "Kris Tarver", 
  "Will Howard",     // Bride's brother - special handling
  "Jordan Yan",
  "Beau Swann",      // Swann brother - triggers disambiguation
  "Tel Holland",
  "Sam Rojas",
  "Mark Williard",
  "Maison Holes",
  "Adam Simpson",
  "Brent Adams",
  "Emma Howard"      // Bride - special fiancée flow
];

export const weddingDetails = {
  date: "Saturday, December 13, 2025",
  ceremony: { 
    location: "Armstrong Browning Library",
    description: "Home to the world's largest collection of Victorian poets...",
    address: "Baylor University Campus, Waco, TX"
  },
  reception: { 
    location: "Hotel Herringbone",
    description: "Luxury boutique hotel in downtown Waco...",
    address: "319 S. 4th Street, Waco, TX 76701",
    venues: ["Red Herring", "Song Bird", "Lucky Buck's"]
  }
};

// SPECIAL PERSON CONFIGURATION
export const specialPersons = {
  bride: { name: "Emma Howard", titles: { /* fiancée detection/welcome */ } },
  bestMan: { 
    name: "Brad Swann", 
    securityQuestion: "What's the best battery brand to use to hit the Pentagon?",
    securityAnswer: "Billo"
  },
  swannBrothers: { 
    names: ["Brad Swann", "Beau Swann"],
    disambiguationQuestion: "Does your dog have balls?",
    answers: { yes: "Beau Swann", no: "Brad Swann" }
  }
};

// EASTER EGGS - NEW! Hidden Mission Impossible features
export const easterEggs = {
  tomCruise: { /* Tom Cruise celebrity flow */ },
  ethanHunt: { /* Ethan Hunt IMF agent flow */ },
  pearsonReese: { /* Groom's special flow */ },
  konamiCode: { /* ↑↑↓↓←→←→BA sequence */ },
  magicStrings: { /* "mission impossible", "self destruct", etc. */ }
};

// TERMINAL MESSAGES - All terminal text centralized
export const terminalMessages = {
  intro: [/* intro sequence */],
  authentication: {/* auth messages for different user types */},
  errors: {/* comprehensive error handling */}
};

// BRIDE-SPECIFIC CONTENT
export const brideContent = {
  mission: {/* special fiancée briefing */},
  responses: {/* bride-specific responses */}
};

// BEST MAN CONTENT
export const bestManContent = {
  mission: {/* special best man briefing */},
  responses: {/* best man responses */}
};
```

### **Easy Content Modification**

**To update wedding details:**
- Edit `weddingDetails` object in `missionData.ts`

**To add/remove groomsmen:**
- Update `groomsmenNames` array

**To change terminal messages:**
- Modify arrays in `terminalMessages` object

**To customize special person handling:**
- Update `specialPersons` configuration

**To change mission briefing:**
- Edit `missionBriefing` object

**To add easter eggs:**
- Add new flows to `easterEggs` object

**To customize special person flows:**
- Update `specialPersons`, `brideContent`, `bestManContent` objects

**No code changes needed** - all content is data-driven!

## Risk Mitigation

### **Audio Issues**
- **Fallback experience** for audio-blocked browsers
- **Audio controls** for user preference
- **Mobile audio handling** for iOS Safari

### **Mobile Performance**
- **Optimized assets** for fast loading
- **Touch-friendly interface** design
- **Responsive text sizing** for readability

### **Name Recognition**
- **Fuzzy matching** with tolerance for typos
- **Fallback options** for unknown names
- **Clear input instructions** for users

## Immediate Next Steps

### **Phase 1: Terminal Interface Implementation**

1. **Create Terminal Component** (`src/components/Terminal.tsx`)
   - Dark terminal UI with green text on black background
   - Mobile-responsive design
   - Command prompt simulation
   - Text animation effects

2. **Replace App.tsx Content**
   - Remove demo content (Bun + React branding)
   - Implement full-screen terminal layout
   - Add Mission Impossible styling

3. **Add Terminal Styling**
   - Terminal font (monospace)
   - Green terminal text (`#00ff00`)
   - Black background (`#000000`)
   - Blinking cursor animation
   - Terminal scanlines effect (optional)

### **Phase 2: Core Features Implementation**

4. **Audio System Setup**
   - Add Mission Impossible theme audio file to `public/audio/`
   - Create `AudioManager` component
   - Implement audio popup dialog
   - Add play/pause/mute controls

5. **Name Identification System**
   - Create fuzzy string matching utility
   - Implement groomsmen names database
   - Add name input validation
   - Create personalized responses

6. **Mission Flow Implementation**
   - Authentication sequence
   - Mission briefing display
   - Response handling (Y/N)
   - Success confirmation

### **Required Assets** ✅ COMPLETED
- ✅ Mission Impossible theme music (4.7MB file in place with fallback handling)
- ✅ Actual groomsmen names list (12 groomsmen + bride configured)
- ✅ Wedding details (December 13, 2025, Armstrong Browning Library + Hotel Herringbone)

### **Commands to Start Development** ✅ READY
```bash
# Start development server
bun run dev

# Build for production (includes static asset copying)
bun run build

# Deploy with instructions
./deploy.sh

# All dependencies already configured - no additional packages needed
# Project is ready for immediate deployment
```

### **Build System** ✅ FIXED
- ✅ **Static Asset Handling**: `build.ts` now copies `public/` directory to build output
- ✅ **Audio File Bundling**: `mission-impossible-theme.mp3` properly included in production builds
- ✅ **Cloudflare Pages Compatible**: Build output structure matches Pages requirements
- ✅ **Deployment Scripts**: `deploy.sh` (Linux/Mac) and `deploy.ps1` (Windows) provide step-by-step deployment instructions
- ✅ **Audio Error Resolution**: Fixed `DEMUXER_ERROR_COULD_NOT_OPEN` by ensuring audio file is bundled in build

### **File Structure** ✅ COMPLETED
```
src/
├── components/
│   ├── Terminal.tsx          ✅ Main terminal interface (1,296 lines)
│   ├── AudioManager.tsx      ✅ Audio controls and popup (138 lines)
│   └── ui/                   ✅ shadcn/ui components (Button, Card, Input, etc.)
├── utils/
│   └── missionData.ts        ✅ Complete data configuration (804 lines)
├── hooks/
│   └── useAudio.ts           ✅ Audio state management (175 lines)
├── lib/
│   └── utils.ts              ✅ Utility functions
└── index.css                 ✅ Terminal styling and mobile optimizations
```

## Current Application Status

### **🎉 MISSION IMPOSSIBLE: ACCOMPLISHED!**

The **Mission Groomsmen** application has far exceeded all expectations, evolving from a simple single-day project into a sophisticated, production-ready wedding invitation system with extensive easter egg features:

#### **Core Achievements:**
- ✅ **Authentic Terminal Experience**: Full Mission Impossible terminal interface with proper line breaks
- ✅ **Advanced User Recognition**: Fuzzy name matching with 12 real groomsmen + bride
- ✅ **Audio Integration**: Complete Mission Impossible theme music system (4.7MB file)
- ✅ **Mobile-First Design**: Touch-friendly buttons replace keyboard inputs on mobile
- ✅ **Configurable Architecture**: All content centralized in 804-line missionData.ts
- ✅ **Type Safe**: Full TypeScript implementation with comprehensive error handling

#### **Special Person Flows:**
- ✅ **Emma Howard (Bride)**: Unique fiancée mission with special briefing
- ✅ **Brad Swann (Best Man)**: Ultimate clearance with security question authentication
- ✅ **Beau/Brad Swann**: Biometric disambiguation system ("Does your dog have balls?")
- ✅ **Will Howard**: Brother detection with gender-based flow
- ✅ **Security System**: Unauthorized access detection and lockdown

#### **🎬 Easter Egg System (NEW!):**
- 🎬 **Tom Cruise Flow**: Epic wedding stunt mission with explosions and wall-climbing
- 🕵️ **Ethan Hunt Flow**: IMF infiltration mission with high-tech gadgets
- 💍 **Pearson Reese (Groom)**: Special groom mission ("Don't mess up your vows!")
- 🎮 **Konami Code**: ↑↑↓↓←→←→BA unlocks secret mode with infinite lives
- ✨ **Magic Strings**: "mission impossible", "self destruct", "impossible" trigger special responses
- 💻 **Console Easter Eggs**: Styled developer console messages with hints

#### **Mobile Optimization:**
- ✅ **Touch-Friendly CTAs**: Mobile users get buttons instead of "Press Enter" prompts
- ✅ **Responsive Design**: Perfect experience across desktop, tablet, and mobile
- ✅ **iOS Safari Compatibility**: Audio system optimized for mobile browsers
- ✅ **Mobile Easter Eggs**: All hidden features work seamlessly on touch devices

#### **Ready for Production:**
- ✅ **Code Quality**: 1,296-line Terminal component with comprehensive functionality
- ✅ **Audio System**: Complete with popup dialog, controls, and fallback handling
- ✅ **Error Handling**: Comprehensive user feedback and suggestion system
- ✅ **Data Architecture**: Easily configurable without touching component code
- ✅ **Wedding Details**: Real venue information (Armstrong Browning Library + Hotel Herringbone)

#### **Immediate Next Steps:**
1. **Deploy to Cloudflare Pages** - Code is production-ready
2. **Share with groomsmen** - Experience is complete and engaging
3. **Monitor usage** - Track which easter eggs get discovered

#### **Final Assessment:**
**The application has transformed from a simple invitation into an immersive, gamified experience that guests will talk about long after the wedding!** 🚀

**Total Development Scope**: What started as a single-day MVP has become a sophisticated application with:
- **2,500+ lines of code** across 8 main files
- **15+ special user flows** including celebrity easter eggs
- **6 different easter egg types** following web development best practices
- **Mobile-first responsive design** with touch optimization
- **Production-ready architecture** with comprehensive error handling

**Mission Status: IMPOSSIBLE ACHIEVED!** 🎬💍
