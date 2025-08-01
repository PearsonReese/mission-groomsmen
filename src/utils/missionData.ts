// =============================================================================
// CORE CONFIGURATION - Update these values to customize the application
// =============================================================================

export const groomsmenNames = [
  "Brad Swann",
  "Kris Tarver", 
  "Will Howard",
  "Jordan Yan",
  "Beau Swann",
  "Tel Holland",
  "Sam Rojas",
  "Mark Williard",
  "Maison Holes",
  "Adam Simpson",
  "Brent Adams",
  "Emma Howard" // Easter egg - the bride!
];

export const weddingDetails = {
  date: "Saturday, December 13, 2025",
  ceremony: {
    location: "Armstrong Browning Library",
    description: "Home to the world's largest collection of Victorian poets Robert and Elizabeth Barrett Browning. One of America's most beautiful libraries and a historic Baylor University landmark.",
    address: "Baylor University Campus, Waco, TX"
  },
  reception: {
    location: "Hotel Herringbone", 
    description: "Luxury boutique hotel in downtown Waco featuring sophisticated accommodations, multiple dining venues, and rooftop bar with stunning views.",
    address: "319 S. 4th Street, Waco, TX 76701",
    venues: [
      "Red Herring - Mediterranean restaurant with live piano lounge",
      "Song Bird - Wine & charcuterie bar with outdoor seating", 
      "Lucky Buck's - Rooftop bar with views of Magnolia Silos"
    ]
  }
};

// =============================================================================
// SPECIAL PERSON CONFIGURATION
// =============================================================================

export const specialPersons = {
  bride: {
    name: "Emma Howard",
    titles: {
      detection: "💍 💍 💍 FIANCÉE DETECTED 💍 💍 💍",
      welcome: "💖 WELCOME, FIANCÉE EMMA HOWARD 💖",
      clearance: "💍 FIANCÉE CLEARANCE LEVEL: MAXIMUM",
      privileges: "👰 FIANCÉE PRIVILEGES: UNLIMITED",
      status: "💕 FIANCÉE STATUS: CONFIRMED"
    }
  },
  bestMan: {
    name: "Brad Swann",
    titles: {
      detection: "🎖️ 🎖️ 🎖️ BEST MAN DETECTED 🎖️ 🎖️ 🎖️",
      welcome: "🎖️ WELCOME, BEST MAN BRAD SWANN 🎖️",
      clearance: "🎖️ BEST MAN CLEARANCE LEVEL: ULTIMATE",
      privileges: "🎖️ BEST MAN PRIVILEGES: SUPREME",
      status: "🎖️ BEST MAN STATUS: CONFIRMED"
    },
    securityQuestion: "What's the best battery brand to use to hit the Pentagon?",
    securityAnswer: "Billo"
  },
  swannBrothers: {
    names: ["Brad Swann", "Beau Swann"],
    disambiguationQuestion: "Does your dog have balls?",
    answers: {
      yes: "Beau Swann",
      no: "Brad Swann"
    }
  }
};

export const missionBriefing = {
  classification: "TOP SECRET - EYES ONLY",
  missionCode: "OPERATION: ETERNAL BOND",
  objective: "Your mission, should you choose to accept it, involves a critical operation requiring your specialized skills as a groomsman operative.",
  briefing: `
MISSION DETAILS:
---LINE---

TARGET EVENT: Wedding Ceremony & Reception
DATE: ${weddingDetails.date}
TIME: [CLASSIFIED - Details to follow in subsequent briefing]

PRIMARY LOCATION: Armstrong Browning Library
• Historic Baylor University venue
• World's largest collection of Victorian poetry
• One of America's most beautiful libraries
• High-security literary fortress

SECONDARY LOCATION: Hotel Herringbone  
• Luxury downtown Waco facility
• Multiple operational dining zones
• Rooftop surveillance point with city views
• 319 S. 4th Street - memorize this location

MISSION PARAMETERS:
• Formal attire required (tuxedo specification)
• Ceremonial support duties
• Reception infiltration and celebration protocols
• Brotherhood solidarity maintenance
• Epic memory creation mandate

SPECIAL EQUIPMENT:
• Wedding rings (handling with extreme care)
• Emergency tissues (for emotional moments)
• Dance floor reconnaissance skills
• Toast delivery capabilities (prepared remarks essential)

This mission will test your loyalty, friendship, and ability to look incredibly handsome in formal wear. The success of Operation: Eternal Bond depends on your commitment.

---LINE---

As always, should you or any of your groomsman team be caught having too much fun, the groom will disavow any knowledge of your actions.

This message will self-destruct in... just kidding, you'll want to save the date.
  `.trim()
};

// =============================================================================
// TERMINAL MESSAGES CONFIGURATION
// =============================================================================

export const terminalMessages = {
  intro: [
    { text: 'INITIALIZING SECURE CONNECTION...', type: 'system' as const, delay: 500 },
    { text: '████████████████████████████████ 100%', type: 'system' as const, delay: 1000 },
    { text: '', type: 'system' as const, delay: 500 },
    { text: '⚠️  CLASSIFIED SYSTEM ACCESS ⚠️', type: 'classified' as const, delay: 800 },
    { text: '', type: 'system' as const, delay: 300 },
    { text: 'MISSION IMPOSSIBLE FORCE', type: 'system' as const, delay: 600 },
    { text: 'GROOMSMAN RECRUITMENT DIVISION', type: 'system' as const, delay: 600 },
    { text: '', type: 'system' as const, delay: 500 },
    { text: 'Please enter your last name to access classified system:', type: 'system' as const, delay: 800 }
  ],

  authentication: {
    verifying: [
      { text: '', type: 'system' as const, delay: 500 },
      { text: 'VERIFYING CLEARANCE LEVEL...', type: 'system' as const, delay: 800 },
      { text: '████████████████████████████████ 100%', type: 'system' as const, delay: 1500 },
      { text: '', type: 'system' as const, delay: 500 }
    ],
    success: {
      standard: [
        { text: '✓ SECURITY CLEARANCE: GROOMSMAN LEVEL', type: 'success' as const, delay: 600 },
        { text: '✓ ACCESS GRANTED', type: 'success' as const, delay: 600 }
      ],
      bride: [
        { text: '⚠️  UNAUTHORIZED ACCESS ATTEMPT', type: 'error' as const, delay: 800 },
        { text: '🚨 SECURITY PROTOCOL OVERRIDE', type: 'error' as const, delay: 800 },
        { text: '', type: 'system' as const, delay: 500 },
        { text: '💍 FIANCÉE CLEARANCE LEVEL: MAXIMUM', type: 'success' as const, delay: 800 },
        { text: '👰 FIANCÉE PRIVILEGES: UNLIMITED', type: 'success' as const, delay: 600 },
        { text: '💕 FIANCÉE STATUS: CONFIRMED', type: 'success' as const, delay: 600 }
      ],
      bestMan: [
        { text: '⚠️  UNAUTHORIZED ACCESS ATTEMPT', type: 'error' as const, delay: 800 },
        { text: '🚨 SECURITY PROTOCOL OVERRIDE', type: 'error' as const, delay: 800 },
        { text: '', type: 'system' as const, delay: 500 },
        { text: '🎖️ BEST MAN CLEARANCE LEVEL: ULTIMATE', type: 'success' as const, delay: 800 },
        { text: '🎖️ BEST MAN PRIVILEGES: SUPREME', type: 'success' as const, delay: 600 },
        { text: '🎖️ BEST MAN STATUS: CONFIRMED', type: 'success' as const, delay: 600 }
      ]
    },
    prompts: {
      standard: 'Press ENTER to receive your mission briefing...',
      bride: 'Press ENTER to receive your special fiancée briefing...',
      bestMan: 'Press ENTER to receive your special best man briefing...'
    }
  },

  bestManAuthentication: [
    { text: '', type: 'system' as const, delay: 500 },
    { text: '🎖️ BEST MAN SECURITY PROTOCOL INITIATED', type: 'classified' as const, delay: 800 },
    { text: 'INITIATING ULTIMATE CLEARANCE VERIFICATION...', type: 'system' as const, delay: 800 },
    { text: '', type: 'system' as const, delay: 500 },
    { text: '🔐 ULTIMATE SECURITY QUESTION FOR BEST MAN VERIFICATION:', type: 'classified' as const, delay: 1000 },
    { text: '', type: 'system' as const, delay: 300 },
    { text: 'What\'s the best battery brand to use to hit the Pentagon?', type: 'system' as const, delay: 800 },
    { text: '', type: 'system' as const, delay: 300 },
    { text: 'Enter your response:', type: 'system' as const, delay: 600 }
  ],

  bestManConfirmation: [
    { text: '', type: 'system' as const, delay: 500 },
    { text: '🎖️ ULTIMATE CLEARANCE VERIFICATION COMPLETE', type: 'success' as const, delay: 800 },
    { text: 'VERIFYING BEST MAN CLEARANCE LEVEL...', type: 'system' as const, delay: 800 },
    { text: '████████████████████████████████ 100%', type: 'system' as const, delay: 1500 },
    { text: '', type: 'system' as const, delay: 500 }
  ],

  swannDisambiguation: [
    { text: '', type: 'system' as const, delay: 500 },
    { text: '⚠️  MULTIPLE SWANN OPERATIVES DETECTED', type: 'error' as const, delay: 800 },
    { text: 'INITIATING ADVANCED BIOMETRIC VERIFICATION...', type: 'system' as const, delay: 800 },
    { text: '', type: 'system' as const, delay: 500 },
    { text: '🔍 SECURITY QUESTION FOR IDENTITY VERIFICATION:', type: 'classified' as const, delay: 1000 },
    { text: '', type: 'system' as const, delay: 300 },
    { text: 'Type Y for YES or N for NO:', type: 'system' as const, delay: 600 }
  ],

  swannConfirmation: [
    { text: '', type: 'system' as const, delay: 500 },
    { text: '🐕 BIOMETRIC VERIFICATION COMPLETE', type: 'success' as const, delay: 800 },
    { text: 'VERIFYING CLEARANCE LEVEL...', type: 'system' as const, delay: 800 },
    { text: '████████████████████████████████ 100%', type: 'system' as const, delay: 1500 },
    { text: '', type: 'system' as const, delay: 500 }
  ],

  restart: [
    { text: '', type: 'system' as const, delay: 500 },
    { text: '🔄 SYSTEM RESTART INITIATED', type: 'system' as const, delay: 800 },
    { text: '████████████████████████████████ 100%', type: 'system' as const, delay: 1500 },
    { text: '', type: 'system' as const, delay: 500 },
    { text: '✨ TERMINAL RESET COMPLETE', type: 'success' as const, delay: 800 },
    { text: '', type: 'system' as const, delay: 500 }
  ],

  errors: {
    unauthorized: [
      { text: '🚨 SECURITY BREACH DETECTED', type: 'error' as const, delay: 600 },
      { text: '🔒 ACCESS DENIED - UNAUTHORIZED PERSONNEL', type: 'error' as const, delay: 600 }
    ],
    lockdown: [
      { text: '', type: 'system' as const, delay: 500 },
      { text: '⚠️  INITIATING SECURITY LOCKDOWN...', type: 'error' as const, delay: 800 },
      { text: '██████████████████████████████████ 100%', type: 'error' as const, delay: 1500 },
      { text: '', type: 'system' as const, delay: 500 },
      { text: '🚫 TERMINAL ACCESS REVOKED', type: 'error' as const, delay: 800 },
      { text: '📞 SECURITY HAS BEEN NOTIFIED', type: 'error' as const, delay: 600 },
      { text: '', type: 'system' as const, delay: 800 },
      { text: 'If you believe this is an error, please contact the groom directly.', type: 'system' as const, delay: 1000 },
      { text: 'Valid groomsmen names are required for access.', type: 'system' as const, delay: 800 }
    ],
    securityViolation: [
      { text: '', type: 'system' as const, delay: 300 },
      { text: '🚨 SECURITY VIOLATION DETECTED 🚨', type: 'error' as const, delay: 800 },
      { text: '🔒 UNAUTHORIZED ACCESS ATTEMPT BLOCKED', type: 'error' as const, delay: 800 },
      { text: '📞 INCIDENT REPORTED TO SECURITY', type: 'error' as const, delay: 600 },
      { text: '', type: 'system' as const, delay: 500 },
      { text: 'Connection terminated.', type: 'error' as const, delay: 800 }
    ],
    invalidResponse: [
      { text: '', type: 'system' as const, delay: 300 },
      { text: '⚠️  INVALID RESPONSE', type: 'error' as const, delay: 600 },
      { text: 'Please type Y for YES or N for NO:', type: 'system' as const, delay: 600 }
    ],
    invalidBiometric: [
      { text: '', type: 'system' as const, delay: 300 },
      { text: '⚠️  INVALID BIOMETRIC RESPONSE', type: 'error' as const, delay: 600 },
      { text: 'Please answer Y for YES or N for NO:', type: 'system' as const, delay: 600 }
    ],
    invalidBestManResponse: [
      { text: '', type: 'system' as const, delay: 300 },
      { text: '⚠️  INVALID BEST MAN RESPONSE', type: 'error' as const, delay: 600 },
      { text: 'Please enter the correct answer:', type: 'system' as const, delay: 600 }
    ]
  }
};

// =============================================================================
// BRIDE-SPECIFIC CONTENT
// =============================================================================

export const brideContent = {
  mission: {
    header: [
      { text: '', type: 'system' as const, delay: 500 },
      { text: '💖 💖 💖 FIANCÉE TRANSMISSION 💖 💖 💖', type: 'classified' as const, delay: 800 },
      { text: '', type: 'system' as const, delay: 500 },
      { text: 'TOP SECRET - FIANCÉE EYES ONLY', type: 'classified' as const, delay: 600 },
      { text: 'MISSION CODE: OPERATION: ETERNAL LOVE', type: 'classified' as const, delay: 600 },
      { text: '', type: 'system' as const, delay: 500 },
      { text: 'Your mission, should you choose to accept it, is to be the most beautiful fiancée ever!', type: 'system' as const, delay: 1000 },
      { text: '', type: 'system' as const, delay: 500 },
      { text: 'FIANCÉE MISSION DETAILS:', type: 'classified' as const, delay: 800 },
      { text: '---LINE---', type: 'system' as const, delay: 300 },
      { text: '', type: 'system' as const, delay: 200 },
      { text: '💍 TARGET EVENT: Your Wedding Day', type: 'system' as const, delay: 600 },
      { text: '⏰ TIME: [CLASSIFIED - You probably know this better than anyone]', type: 'system' as const, delay: 600 },
      { text: '', type: 'system' as const, delay: 300 },
      { text: '👰 PRIMARY LOCATION: Armstrong Browning Library', type: 'system' as const, delay: 600 },
      { text: '🎉 SECONDARY LOCATION: Hotel Herringbone', type: 'system' as const, delay: 600 },
      { text: '', type: 'system' as const, delay: 300 },
      { text: 'FIANCÉE MISSION PARAMETERS:', type: 'classified' as const, delay: 800 }
    ],
    parameters: [
      { text: '• Look absolutely stunning (mission critical)', type: 'system' as const, delay: 400 },
      { text: '• Say "I do" with confidence', type: 'system' as const, delay: 400 },
      { text: '• Dance like nobody\'s watching', type: 'system' as const, delay: 400 },
      { text: '• Enjoy every moment of your special day', type: 'system' as const, delay: 400 },
      { text: '• Let your groom know how much you love him', type: 'system' as const, delay: 400 }
    ],
    equipment: [
      { text: '', type: 'system' as const, delay: 300 },
      { text: 'SPECIAL BRIDE EQUIPMENT:', type: 'classified' as const, delay: 800 },
      { text: '• Wedding dress (handling with extreme care)', type: 'system' as const, delay: 400 },
      { text: '• Emergency tissues (for happy tears)', type: 'system' as const, delay: 400 },
      { text: '• Dance floor confidence', type: 'system' as const, delay: 400 },
      { text: '• Unlimited love and joy', type: 'system' as const, delay: 400 }
    ],
    footer: [
      { text: '', type: 'system' as const, delay: 500 },
      { text: 'This mission will be the most important one of your life. The success of Operation: Eternal Love depends on your happiness.', type: 'system' as const, delay: 1000 },
      { text: '', type: 'system' as const, delay: 500 },
      { text: '---LINE---', type: 'system' as const, delay: 300 },
      { text: '', type: 'system' as const, delay: 500 },
      { text: '💕 DO YOU ACCEPT THIS BRIDE MISSION? 💕', type: 'classified' as const, delay: 1000 },
      { text: '', type: 'system' as const, delay: 500 },
      { text: 'Type Y for YES or N for NO:', type: 'system' as const, delay: 600 }
    ]
  },
  responses: {
    accept: [
      { text: '', type: 'system' as const, delay: 500 },
      { text: '💕 BRIDE MISSION ACCEPTED 💕', type: 'success' as const, delay: 800 },
      { text: '', type: 'system' as const, delay: 500 },
      { text: '💖 EXCELLENT! Your commitment to love has been confirmed.', type: 'success' as const, delay: 800 },
      { text: '👰 Standby for wedding planning updates...', type: 'success' as const, delay: 800 },
      { text: '💍 Welcome to the most important mission of your life!', type: 'success' as const, delay: 800 },
      { text: '💕 Your groom is going to be the luckiest man alive!', type: 'success' as const, delay: 800 },
      { text: '💖 Remember: What happens on your wedding day, stays in your hearts forever.', type: 'success' as const, delay: 800 },
      { text: '', type: 'system' as const, delay: 1000 },
      { text: '💍 Save this date in your calendar immediately!', type: 'classified' as const, delay: 800 },
      { text: '💕 Check your email for wedding planning details.', type: 'classified' as const, delay: 800 },
      { text: '👰 Dress fittings and bridal party intel to follow.', type: 'classified' as const, delay: 800 },
      { text: '', type: 'system' as const, delay: 800 },
      { text: '✨ Bride mission briefing complete. This terminal will self-destruct in...', type: 'system' as const, delay: 1000 },
      { text: 'Just kidding! Welcome to the most beautiful mission ever, Bride to-be Emma! 💕', type: 'success' as const, delay: 1500 }
    ],
    decline: [
      { text: '', type: 'system' as const, delay: 500 },
      { text: '💔 BRIDE MISSION DECLINED', type: 'error' as const, delay: 800 },
      { text: '', type: 'system' as const, delay: 500 },
      { text: '💕 This is... unexpected. Please reconsider, Bride Emma.', type: 'error' as const, delay: 800 },
      { text: '💖 Your love mission requires your specific skill set.', type: 'error' as const, delay: 800 },
      { text: '💍 Are you sure? The fate of true love depends on you.', type: 'error' as const, delay: 800 },
      { text: '💕 We\'ll give you time to think about it. This mission is too important to refuse.', type: 'error' as const, delay: 800 },
      { text: '💖 Your love is more valuable than any mission. Consider it again.', type: 'error' as const, delay: 800 },
      { text: '', type: 'system' as const, delay: 1000 },
      { text: 'Type Y to reconsider, or N to confirm declination:', type: 'system' as const, delay: 800 }
    ]
  }
};

// =============================================================================
// MISSION RESPONSE CONFIGURATION
// =============================================================================

export const responses = {
  accept: [
    "EXCELLENT. Your commitment to the mission has been noted.",
    "Standby for further instructions...",
    "Welcome to the team, Agent. Your country (and the happy couple) thanks you.",
    "Mission briefing packet will be delivered via secure channels.",
    "Remember: What happens in the groomsman chat, stays in the groomsman chat."
  ],
  decline: [
    "This is... unexpected. Please reconsider, Agent.",
    "The mission requires your specific skill set.",
    "Are you sure? The fate of the bachelor party depends on you.",
    "We'll give you time to think about it. This mission is too important to refuse.",
    "Your friendship is more valuable than any mission. Consider it again."
  ],
  acceptComplete: [
    { text: '', type: 'system' as const, delay: 1000 },
    { text: '📱 Save this date in your calendar immediately!', type: 'classified' as const, delay: 800 },
    { text: '📧 Check your email for formal invitation details.', type: 'classified' as const, delay: 800 },
    { text: '🤵 Suit fittings and bachelor party intel to follow.', type: 'classified' as const, delay: 800 },
    { text: '', type: 'system' as const, delay: 800 },
    { text: '✨ Mission briefing complete. This terminal will self-destruct in...', type: 'system' as const, delay: 1000 },
    { text: 'Just kidding! Welcome to the team, groomsman! 🎉', type: 'success' as const, delay: 1500 }
  ],
  declinePrompt: [
    { text: '', type: 'system' as const, delay: 1000 },
    { text: 'Type Y to reconsider, or N to confirm declination:', type: 'system' as const, delay: 800 }
  ]
};

// =============================================================================
// MISSION PROMPTS
// =============================================================================

export const missionPrompts = {
  standard: {
    header: [
      { text: '', type: 'system' as const, delay: 500 },
      { text: '⦿ INCOMING TRANSMISSION ⦿', type: 'classified' as const, delay: 800 },
      { text: '', type: 'system' as const, delay: 500 }
    ],
    footer: [
      { text: '', type: 'system' as const, delay: 800 },
      { text: '💀 DO YOU ACCEPT THIS MISSION? 💀', type: 'classified' as const, delay: 1000 },
      { text: '', type: 'system' as const, delay: 500 },
      { text: 'Type Y for YES or N for NO:', type: 'system' as const, delay: 600 }
    ]
  }
};

// =============================================================================
// BEST MAN CONTENT
// =============================================================================

export const bestManContent = {
  mission: {
    header: [
      { text: '', type: 'system' as const, delay: 500 },
      { text: '🎖️ 🎖️ 🎖️ BEST MAN TRANSMISSION 🎖️ 🎖️ 🎖️', type: 'classified' as const, delay: 800 },
      { text: '', type: 'system' as const, delay: 500 },
      { text: 'TOP SECRET - BEST MAN EYES ONLY', type: 'classified' as const, delay: 600 },
      { text: 'MISSION CODE: OPERATION: BEST MAN SUPREME', type: 'classified' as const, delay: 600 },
      { text: '', type: 'system' as const, delay: 500 },
      { text: 'Your mission, should you choose to accept it, is to be the ultimate best man!', type: 'system' as const, delay: 1000 },
      { text: '', type: 'system' as const, delay: 500 },
      { text: 'BEST MAN MISSION DETAILS:', type: 'classified' as const, delay: 800 },
      { text: '---LINE---', type: 'system' as const, delay: 300 },
      { text: '', type: 'system' as const, delay: 200 },
      { text: '🎖️ TARGET EVENT: Your Best Man Duties', type: 'system' as const, delay: 600 },
      { text: '⏰ TIME: [CLASSIFIED - You\'ll be the first to know]', type: 'system' as const, delay: 600 },
      { text: '', type: 'system' as const, delay: 300 },
      { text: '🎖️ PRIMARY LOCATION: Armstrong Browning Library', type: 'system' as const, delay: 600 },
      { text: '🎖️ SECONDARY LOCATION: Hotel Herringbone', type: 'system' as const, delay: 600 },
      { text: '', type: 'system' as const, delay: 300 },
      { text: 'BEST MAN MISSION PARAMETERS:', type: 'classified' as const, delay: 800 }
    ],
    parameters: [
      { text: '• Hold the rings with your life (mission critical)', type: 'system' as const, delay: 400 },
      { text: '• Deliver the best best man speech ever', type: 'system' as const, delay: 400 },
      { text: '• Keep the groom calm and collected', type: 'system' as const, delay: 400 },
      { text: '• Lead the groomsmen with authority', type: 'system' as const, delay: 400 },
      { text: '• Be the ultimate wingman for life', type: 'system' as const, delay: 400 }
    ],
    equipment: [
      { text: '', type: 'system' as const, delay: 300 },
      { text: 'SPECIAL BEST MAN EQUIPMENT:', type: 'classified' as const, delay: 800 },
      { text: '• Wedding rings (handling with extreme care)', type: 'system' as const, delay: 400 },
      { text: '• Best man speech (prepared and practiced)', type: 'system' as const, delay: 400 },
      { text: '• Leadership skills (for groomsmen coordination)', type: 'system' as const, delay: 400 },
      { text: '• Unlimited friendship and loyalty', type: 'system' as const, delay: 400 }
    ],
    footer: [
      { text: '', type: 'system' as const, delay: 500 },
      { text: 'This mission will test your friendship, loyalty, and ability to be the ultimate best man. The success of Operation: Best Man Supreme depends on your commitment.', type: 'system' as const, delay: 1000 },
      { text: '', type: 'system' as const, delay: 500 },
      { text: '---LINE---', type: 'system' as const, delay: 300 },
      { text: '', type: 'system' as const, delay: 500 },
      { text: '🎖️ DO YOU ACCEPT THIS BEST MAN MISSION? 🎖️', type: 'classified' as const, delay: 1000 },
      { text: '', type: 'system' as const, delay: 500 },
      { text: 'Type Y for YES or N for NO:', type: 'system' as const, delay: 600 }
    ]
  },
  responses: {
    accept: [
      { text: '', type: 'system' as const, delay: 500 },
      { text: '🎖️ BEST MAN MISSION ACCEPTED 🎖️', type: 'success' as const, delay: 800 },
      { text: '', type: 'system' as const, delay: 500 },
      { text: '🎖️ EXCELLENT! Your commitment to friendship has been confirmed.', type: 'success' as const, delay: 800 },
      { text: '🎖️ Standby for best man duties and speech preparation...', type: 'success' as const, delay: 800 },
      { text: '🎖️ Welcome to the most important mission of your friendship!', type: 'success' as const, delay: 800 },
      { text: '🎖️ You\'re going to be the best best man ever!', type: 'success' as const, delay: 800 },
      { text: '🎖️ Remember: What happens in the best man role, stays in the wedding photos forever.', type: 'success' as const, delay: 800 },
      { text: '', type: 'system' as const, delay: 1000 },
      { text: '🎖️ Save this date in your calendar immediately!', type: 'classified' as const, delay: 800 },
      { text: '🎖️ Check your email for best man duties and speech guidelines.', type: 'classified' as const, delay: 800 },
      { text: '🎖️ Suit fittings and bachelor party planning to follow.', type: 'classified' as const, delay: 800 },
      { text: '', type: 'system' as const, delay: 800 },
      { text: '✨ Best man mission briefing complete. This terminal will self-destruct in...', type: 'system' as const, delay: 1000 },
      { text: 'Just kidding! Welcome to the ultimate best man mission, Brad! 🎖️', type: 'success' as const, delay: 1500 }
    ],
    decline: [
      { text: '', type: 'system' as const, delay: 500 },
      { text: '💔 BEST MAN MISSION DECLINED', type: 'error' as const, delay: 800 },
      { text: '', type: 'system' as const, delay: 500 },
      { text: '🎖️ This is... unexpected. Please reconsider, Best Man Brad.', type: 'error' as const, delay: 800 },
      { text: '🎖️ Your friendship mission requires your specific skill set.', type: 'error' as const, delay: 800 },
      { text: '🎖️ Are you sure? The fate of the wedding depends on you.', type: 'error' as const, delay: 800 },
      { text: '🎖️ We\'ll give you time to think about it. This mission is too important to refuse.', type: 'error' as const, delay: 800 },
      { text: '🎖️ Your friendship is more valuable than any mission. Consider it again.', type: 'error' as const, delay: 800 },
      { text: '', type: 'system' as const, delay: 1000 },
      { text: 'Type Y to reconsider, or N to confirm declination:', type: 'system' as const, delay: 800 }
    ]
  }
};