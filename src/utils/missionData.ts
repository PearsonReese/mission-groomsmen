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
  "David Katz",
  "Levi Jones",
  "Emma Howard", // Easter egg - the bride!
  "Jordan Swann" // The groom's blood sister!
];

// =============================================================================
// BRIDESMAIDS NAMES CONFIGURATION - Enter last names to authenticate
// =============================================================================
export const bridesmaidNames = [
  "Zoe Howard",
  "Brooke Betik",
  "Madison Coplen",
  "Addy Ostlien",
  "Presley Saenz",
  "Justine Tam",
  "Courtney Kranz",
  "Shannon Terrell",
  "Trinity Thomas",
  "Shelby Jordan",
  "Molly Brown",
  "Juan Garcia",
];

// =============================================================================
// FAMILY AND FRIENDS NAMES CONFIGURATION - Easily updatable list for family and friends
// =============================================================================
export const familyAndFriendsNames = [
  "Chapman",
  "Drake",
  "Porter",
  "Glassmoyer",
  "Moye",
  "Fox",
  "Truss",
  "Kaiser",
  "Bishop",
  "Williard",
  "Jones",
  "Holland",
  "Tarver",
  "Keyes",
  "Fatt",
  "Chang",
  "Burggraf",
  "Pozath",
  "Cordero",
  "Hays",
  "Reese",
  "Dawson",
  "Pearson",
  "McDonough",
  "Vegter",
  "Vick",
  "Garrison",
  "Hall",
  "Campbell",
  "Campi",
  "Riordan",
  "Reeve",
  "Jackson",
  "Morgan",
  "Harvey",
  "Liendo",
  "Hernandez",
  "Fales",
  "Proctor",
  "White",
];

// =============================================================================
// VERIFICATION QUESTIONS FOR INDIVIDUAL GROOMSMEN
// =============================================================================
export const verificationQuestions = {
  "Jordan Yan": {
    question: "Where did we meet for the first time in person?",
    correctAnswers: ["the basement", "basement"],
    maxAttempts: 3
  },
  "Kris Tarver": {
    question: "Some would say this mission is TOP SECRET while others might say...",
    correctAnswers: ["top notch"],
    maxAttempts: 3
  },
  "Tel Holland": {
    question: "What N64 game did we play endlessly?",
    correctAnswers: ["mario 64", "super mario 64", "super smash bros", "smash bros", "mario", "smash"],
    maxAttempts: 3
  },
  "Sam Rojas": {
    question: "What delicious dessert was getting cooked up as we nearly burned our apartment down in college?",
    correctAnswers: ["brownies", "brownie", "weed brownies"],
    maxAttempts: 3
  },
  "Mark Williard": {
    question: "What do we like to call one another in the bedroom?",
    correctAnswers: ["boo"],
    maxAttempts: 3
  },
  "Maison Holes": {
    question: "Speaking of Holes, what mythical creature did we like to f*** in high school?",
    correctAnswers: ["unicorn", "a unicorn"],
    maxAttempts: 3
  },
  "Adam Simpson": {
    question: "You're one of the few people I've ever played video games with with money on the line... what game were we playing?",
    correctAnswers: ["rocket league", "RL"],
    maxAttempts: 3
  },
  "Brent Adams": {
    question: "What's funnier than 24?",
    correctAnswers: ["25"],
    maxAttempts: 3
  },
  "David Katz": {
    question: "What was the first app we built together?",
    correctAnswers: ["Mindkind"],
    maxAttempts: 3
  },
  "Levi Jones": {
    question: "We played soccer together on a team named after something that keeps you warm and bright - what was it?",
    correctAnswers: ["Blazers", "Blazer"],
    maxAttempts: 3
  }
};

// =============================================================================
// EASTER EGGS - Hidden Mission Impossible Features
// =============================================================================

export const easterEggs = {
  // Secret celebrity flows
  tomCruise: {
    names: ["tom cruise", "tommy", "cruise", "maverick", "top gun"],
    detection: "🎬 🎬 🎬 HOLLYWOOD LEGEND DETECTED 🎬 🎬 🎬",
    welcome: "🎬 WELCOME, TOM CRUISE 🎬",
    clearance: "🎬 CLEARANCE LEVEL: MOVIE STAR",
    privileges: "🎬 PRIVILEGES: STUNT COORDINATION",
    status: "🎬 STATUS: RUNNING FROM EXPLOSIONS",
    mission: {
      header: [
        { text: '', type: 'system' as const, delay: 500 },
        { text: '🎬 🎬 🎬 HOLLYWOOD TRANSMISSION 🎬 🎬 🎬', type: 'classified' as const, delay: 800 },
        { text: '', type: 'system' as const, delay: 500 },
        { text: 'TOP SECRET - TOM CRUISE EYES ONLY', type: 'classified' as const, delay: 600 },
        { text: 'MISSION CODE: OPERATION: WEDDING STUNT', type: 'classified' as const, delay: 600 },
        { text: '', type: 'system' as const, delay: 500 },
        { text: 'Your mission, should you choose to accept it, is to perform the most epic wedding entrance ever!', type: 'system' as const, delay: 1000 },
        { text: '', type: 'system' as const, delay: 500 },
        { text: 'TOM CRUISE MISSION DETAILS:', type: 'classified' as const, delay: 800 },
        { text: '---LINE---', type: 'system' as const, delay: 300 },
        { text: '', type: 'system' as const, delay: 200 },
        { text: '🎬 TARGET EVENT: Your Epic Wedding Entrance', type: 'system' as const, delay: 600 },
        { text: '⏰ TIME: 16:00', type: 'system' as const, delay: 600 },
        { text: '', type: 'system' as const, delay: 300 },
        { text: '🎬 PRIMARY LOCATION: Armstrong Browning Library', type: 'system' as const, delay: 600 },
        { text: '🎬 SECONDARY LOCATION: Hotel Herringbone', type: 'system' as const, delay: 600 },
        { text: '', type: 'system' as const, delay: 300 },
        { text: 'TOM CRUISE MISSION PARAMETERS:', type: 'classified' as const, delay: 800 }
      ],
      parameters: [
        { text: '• Run from explosions (even if there are none)', type: 'system' as const, delay: 400 },
        { text: '• Perform death-defying stunts during the ceremony', type: 'system' as const, delay: 400 },
        { text: '• Climb the library walls like a spider', type: 'system' as const, delay: 400 },
        { text: '• Jump from the rooftop to the dance floor', type: 'system' as const, delay: 400 },
        { text: '• Do your own stunts (no doubles allowed)', type: 'system' as const, delay: 400 }
      ],
      equipment: [
        { text: '', type: 'system' as const, delay: 300 },
        { text: 'SPECIAL TOM CRUISE EQUIPMENT:', type: 'classified' as const, delay: 800 },
        { text: '• Sunglasses (for dramatic effect)', type: 'system' as const, delay: 400 },
        { text: '• Running shoes (for running from explosions)', type: 'system' as const, delay: 400 },
        { text: '• Stunt harness (safety first!)', type: 'system' as const, delay: 400 },
        { text: '• Unlimited charisma and charm', type: 'system' as const, delay: 400 }
      ],
      footer: [
        { text: '', type: 'system' as const, delay: 500 },
        { text: 'This mission will test your acting skills, stunt coordination, and ability to look cool while running. The success of Operation: Wedding Stunt depends on your commitment to epicness.', type: 'system' as const, delay: 1000 },
        { text: '', type: 'system' as const, delay: 500 },
        { text: '---LINE---', type: 'system' as const, delay: 300 },
        { text: '', type: 'system' as const, delay: 500 },
        { text: '🎬 DO YOU ACCEPT THIS TOM CRUISE MISSION? 🎬', type: 'classified' as const, delay: 1000 },
        { text: '', type: 'system' as const, delay: 500 },
        { text: 'Type Y for YES or N for NO:', type: 'system' as const, delay: 600 }
      ]
    },
    responses: {
      accept: [
        { text: '', type: 'system' as const, delay: 500 },
        { text: '🎬 TOM CRUISE MISSION ACCEPTED 🎬', type: 'success' as const, delay: 800 },
        { text: '', type: 'system' as const, delay: 500 },
        { text: '🎬 EXCELLENT! Your commitment to epic stunts has been confirmed.', type: 'success' as const, delay: 800 },
        { text: '🎬 Standby for stunt coordination and explosion timing...', type: 'success' as const, delay: 800 },
        { text: '🎬 Welcome to the most action-packed wedding ever!', type: 'success' as const, delay: 800 },
        { text: '🎬 You\'re going to make this wedding legendary!', type: 'success' as const, delay: 800 },
        { text: '🎬 Remember: What happens during the wedding stunts, stays in the wedding video forever.', type: 'success' as const, delay: 800 },
        { text: '', type: 'system' as const, delay: 1000 },
        { text: '🎬 Save this date in your calendar immediately!', type: 'classified' as const, delay: 800 },
        { text: '🎬 Explosion timing and wall-climbing practice to follow.', type: 'classified' as const, delay: 800 },
        { text: '', type: 'system' as const, delay: 800 },
        { text: '✨ Tom Cruise mission briefing complete. This terminal will self-destruct in...', type: 'system' as const, delay: 1000 },
        { text: 'Just kidding! Welcome to the most epic wedding mission ever, Tom! 🎬', type: 'success' as const, delay: 1500 }
      ],
      decline: [
        { text: '', type: 'system' as const, delay: 500 },
        { text: '💔 TOM CRUISE MISSION DECLINED', type: 'error' as const, delay: 800 },
        { text: '', type: 'system' as const, delay: 500 },
        { text: '🎬 This is... unexpected. Please reconsider, Tom Cruise.', type: 'error' as const, delay: 800 },
        { text: '🎬 Your stunt mission requires your specific skill set.', type: 'error' as const, delay: 800 },
        { text: '🎬 Are you sure? The fate of epic wedding entrances depends on you.', type: 'error' as const, delay: 800 },
        { text: '🎬 We\'ll give you time to think about it. This mission is too important to refuse.', type: 'error' as const, delay: 800 },
        { text: '🎬 Your charisma is more valuable than any mission. Consider it again.', type: 'error' as const, delay: 800 },
        { text: '', type: 'system' as const, delay: 1000 },
        { text: 'Type Y to reconsider, or N to confirm declination:', type: 'system' as const, delay: 800 }
      ]
    }
  },

  ethanHunt: {
    names: ["ethan hunt", "ethan", "hunt", "impossible", "agent hunt"],
    detection: "🕵️ 🕵️ 🕵️ IMF AGENT DETECTED 🕵️ 🕵️ 🕵️",
    welcome: "🕵️ WELCOME, ETHAN HUNT 🕵️",
    clearance: "🕵️ CLEARANCE LEVEL: IMF AGENT",
    privileges: "🕵️ PRIVILEGES: IMPOSSIBLE MISSIONS",
    status: "🕵️ STATUS: SAVING THE WORLD",
    mission: {
      header: [
        { text: '', type: 'system' as const, delay: 500 },
        { text: '🕵️ 🕵️ 🕵️ IMF TRANSMISSION 🕵️ 🕵️ 🕵️', type: 'classified' as const, delay: 800 },
        { text: '', type: 'system' as const, delay: 500 },
        { text: 'TOP SECRET - IMF EYES ONLY', type: 'classified' as const, delay: 600 },
        { text: 'MISSION CODE: OPERATION: WEDDING INFILTRATION', type: 'classified' as const, delay: 600 },
        { text: '', type: 'system' as const, delay: 500 },
        { text: 'Your mission, should you choose to accept it, is to infiltrate the wedding and ensure everything goes perfectly!', type: 'system' as const, delay: 1000 },
        { text: '', type: 'system' as const, delay: 500 },
        { text: 'ETHAN HUNT MISSION DETAILS:', type: 'classified' as const, delay: 800 },
        { text: '---LINE---', type: 'system' as const, delay: 300 },
        { text: '', type: 'system' as const, delay: 200 },
        { text: '🕵️ TARGET EVENT: Wedding Infiltration', type: 'system' as const, delay: 600 },
        { text: '⏰ TIME: 16:00', type: 'system' as const, delay: 600 },
        { text: '', type: 'system' as const, delay: 300 },
        { text: '🕵️ PRIMARY LOCATION: Armstrong Browning Library', type: 'system' as const, delay: 600 },
        { text: '🕵️ SECONDARY LOCATION: Hotel Herringbone', type: 'system' as const, delay: 600 },
        { text: '', type: 'system' as const, delay: 300 },
        { text: 'ETHAN HUNT MISSION PARAMETERS:', type: 'classified' as const, delay: 800 }
      ],
      parameters: [
        { text: '• Infiltrate the wedding using advanced disguise techniques', type: 'system' as const, delay: 400 },
        { text: '• Prevent any wedding disasters with precision timing', type: 'system' as const, delay: 400 },
        { text: '• Use high-tech gadgets to ensure smooth operation', type: 'system' as const, delay: 400 },
        { text: '• Execute the mission with impossible precision', type: 'system' as const, delay: 400 },
        { text: '• Self-destruct any evidence of your involvement', type: 'system' as const, delay: 400 }
      ],
      equipment: [
        { text: '', type: 'system' as const, delay: 300 },
        { text: 'SPECIAL IMF EQUIPMENT:', type: 'classified' as const, delay: 800 },
        { text: '• Disguise kit (for blending in)', type: 'system' as const, delay: 400 },
        { text: '• High-tech surveillance gear', type: 'system' as const, delay: 400 },
        { text: '• Mission impossible theme music (for dramatic effect)', type: 'system' as const, delay: 400 },
        { text: '• Unlimited determination and skill', type: 'system' as const, delay: 400 }
      ],
      footer: [
        { text: '', type: 'system' as const, delay: 500 },
        { text: 'This mission will test your infiltration skills, timing, and ability to save the day. The success of Operation: Wedding Infiltration depends on your commitment to the impossible.', type: 'system' as const, delay: 1000 },
        { text: '', type: 'system' as const, delay: 500 },
        { text: '---LINE---', type: 'system' as const, delay: 300 },
        { text: '', type: 'system' as const, delay: 500 },
        { text: '🕵️ DO YOU ACCEPT THIS IMF MISSION? 🕵️', type: 'classified' as const, delay: 1000 },
        { text: '', type: 'system' as const, delay: 500 },
        { text: 'Type Y for YES or N for NO:', type: 'system' as const, delay: 600 }
      ]
    },
    responses: {
      accept: [
        { text: '', type: 'system' as const, delay: 500 },
        { text: '🕵️ IMF MISSION ACCEPTED 🕵️', type: 'success' as const, delay: 800 },
        { text: '', type: 'system' as const, delay: 500 },
        { text: '🕵️ EXCELLENT! Your commitment to impossible missions has been confirmed.', type: 'success' as const, delay: 800 },
        { text: '🕵️ Standby for infiltration training and gadget distribution...', type: 'success' as const, delay: 800 },
        { text: '🕵️ Welcome to the most impossible wedding mission ever!', type: 'success' as const, delay: 800 },
        { text: '🕵️ You\'re going to make this wedding mission impossible to forget!', type: 'success' as const, delay: 800 },
        { text: '🕵️ Remember: What happens during the mission, stays classified forever.', type: 'success' as const, delay: 800 },
        { text: '', type: 'system' as const, delay: 1000 },
        { text: '🕵️ Save this date in your calendar immediately!', type: 'classified' as const, delay: 800 },
        { text: '🕵️ Disguise training and gadget briefing to follow.', type: 'classified' as const, delay: 800 },
        { text: '', type: 'system' as const, delay: 800 },
        { text: '✨ IMF mission briefing complete. This terminal will self-destruct in...', type: 'system' as const, delay: 1000 },
        { text: 'Just kidding! Welcome to the most impossible wedding mission ever, Ethan! 🕵️', type: 'success' as const, delay: 1500 }
      ],
      decline: [
        { text: '', type: 'system' as const, delay: 500 },
        { text: '💔 IMF MISSION DECLINED', type: 'error' as const, delay: 800 },
        { text: '', type: 'system' as const, delay: 500 },
        { text: '🕵️ This is... unexpected. Please reconsider, Agent Hunt.', type: 'error' as const, delay: 800 },
        { text: '🕵️ Your infiltration mission requires your specific skill set.', type: 'error' as const, delay: 800 },
        { text: '🕵️ Are you sure? The fate of the wedding depends on you.', type: 'error' as const, delay: 800 },
        { text: '🕵️ We\'ll give you time to think about it. This mission is too important to refuse.', type: 'error' as const, delay: 800 },
        { text: '🕵️ Your skills are more valuable than any mission. Consider it again.', type: 'error' as const, delay: 800 },
        { text: '', type: 'system' as const, delay: 1000 },
        { text: 'Type Y to reconsider, or N to confirm declination:', type: 'system' as const, delay: 800 }
      ]
    }
  },

  // Secret groom flow
  pearsonReese: {
    // Only keep the full canonical name here so direct name checks elsewhere don't match partials
    names: ["pearson reese", "groom"],
    detection: "💍 💍 💍 GROOM DETECTED 💍 💍 💍",
    welcome: "💍 WELCOME, GROOM PEARSON REESE 💍",
    clearance: "💍 CLEARANCE LEVEL: GROOM",
    privileges: "💍 PRIVILEGES: WEDDING PLANNING",
    status: "💍 STATUS: GETTING MARRIED",
    mission: {
      header: [
        { text: '', type: 'system' as const, delay: 500 },
        { text: '💍 💍 💍 GROOM TRANSMISSION 💍 💍 💍', type: 'classified' as const, delay: 800 },
        { text: '', type: 'system' as const, delay: 500 },
        { text: 'TOP SECRET - GROOM EYES ONLY', type: 'classified' as const, delay: 600 },
        { text: 'MISSION CODE: OPERATION: GETTING MARRIED', type: 'classified' as const, delay: 600 },
        { text: '', type: 'system' as const, delay: 500 },
        { text: 'Your mission, should you choose to accept it, is to marry the love of your life and not mess it up!', type: 'system' as const, delay: 1000 },
        { text: '', type: 'system' as const, delay: 500 },
        { text: 'GROOM MISSION DETAILS:', type: 'classified' as const, delay: 800 },
        { text: '---LINE---', type: 'system' as const, delay: 300 },
        { text: '', type: 'system' as const, delay: 200 },
        { text: '💍 TARGET EVENT: Your Wedding Day', type: 'system' as const, delay: 600 },
        { text: '⏰ TIME: 16:00', type: 'system' as const, delay: 600 },
        { text: '', type: 'system' as const, delay: 300 },
        { text: '💍 PRIMARY LOCATION: Armstrong Browning Library', type: 'system' as const, delay: 600 },
        { text: '💍 SECONDARY LOCATION: Hotel Herringbone', type: 'system' as const, delay: 600 },
        { text: '', type: 'system' as const, delay: 300 },
        { text: 'GROOM MISSION PARAMETERS:', type: 'classified' as const, delay: 800 }
      ],
      parameters: [
        { text: '• Don\'t forget the rings (mission critical)', type: 'system' as const, delay: 400 },
        { text: '• Say "I do" with confidence', type: 'system' as const, delay: 400 },
        { text: '• Don\'t trip walking down the aisle', type: 'system' as const, delay: 400 },
        { text: '• Remember to breathe', type: 'system' as const, delay: 400 },
        { text: '• Don\'t mess up your vows', type: 'system' as const, delay: 400 }
      ],
      equipment: [
        { text: '', type: 'system' as const, delay: 300 },
        { text: 'SPECIAL GROOM EQUIPMENT:', type: 'classified' as const, delay: 800 },
        { text: '• Wedding ring (don\'t lose it!)', type: 'system' as const, delay: 400 },
        { text: '• Tuxedo (looking sharp)', type: 'system' as const, delay: 400 },
        { text: '• Vows (memorized and practiced)', type: 'system' as const, delay: 400 },
        { text: '• Unlimited love for Emma', type: 'system' as const, delay: 400 }
      ],
      footer: [
        { text: '', type: 'system' as const, delay: 500 },
        { text: 'This mission will test your love, commitment, and ability to not mess up the most important day of your life. The success of Operation: Getting Married depends on your love for Emma.', type: 'system' as const, delay: 1000 },
        { text: '', type: 'system' as const, delay: 500 },
        { text: '---LINE---', type: 'system' as const, delay: 300 },
        { text: '', type: 'system' as const, delay: 500 },
        { text: '💍 DO YOU ACCEPT THIS GROOM MISSION? 💍', type: 'classified' as const, delay: 1000 },
        { text: '', type: 'system' as const, delay: 500 },
        { text: 'Type Y for YES or N for NO:', type: 'system' as const, delay: 600 }
      ]
    },
    responses: {
      accept: [
        { text: '', type: 'system' as const, delay: 500 },
        { text: '💍 GROOM MISSION ACCEPTED 💍', type: 'success' as const, delay: 800 },
        { text: '', type: 'system' as const, delay: 500 },
        { text: '💍 EXCELLENT! Your commitment to love has been confirmed.', type: 'success' as const, delay: 800 },
        { text: '💍 Standby for wedding planning and groom duties...', type: 'success' as const, delay: 800 },
        { text: '💍 Welcome to the most important mission of your life!', type: 'success' as const, delay: 800 },
        { text: '💍 You\'re going to be the best groom ever!', type: 'success' as const, delay: 800 },
        { text: '💍 Remember: What happens on your wedding day, stays in your hearts forever.', type: 'success' as const, delay: 800 },
        { text: '', type: 'system' as const, delay: 1000 },
        { text: '💍 Save this date in your calendar immediately!', type: 'classified' as const, delay: 800 },
        { text: '💍 Tuxedo fittings and groom duties to follow.', type: 'classified' as const, delay: 800 },
        { text: '', type: 'system' as const, delay: 800 },
        { text: '✨ Groom mission briefing complete. This terminal will self-destruct in...', type: 'system' as const, delay: 1000 },
        { text: 'Just kidding! Welcome to the most important mission ever, Pearson! 💍', type: 'success' as const, delay: 1500 }
      ],
      decline: [
        { text: '', type: 'system' as const, delay: 500 },
        { text: '💔 GROOM MISSION DECLINED', type: 'error' as const, delay: 800 },
        { text: '', type: 'system' as const, delay: 500 },
        { text: '💍 This is... unexpected. Please reconsider, Groom Pearson.', type: 'error' as const, delay: 800 },
        { text: '💍 Your love mission requires your specific skill set.', type: 'error' as const, delay: 800 },
        { text: '💍 Are you sure? The fate of true love depends on you.', type: 'error' as const, delay: 800 },
        { text: '💍 We\'ll give you time to think about it. This mission is too important to refuse.', type: 'error' as const, delay: 800 },
        { text: '💍 Your love is more valuable than any mission. Consider it again.', type: 'error' as const, delay: 800 },
        { text: '', type: 'system' as const, delay: 1000 },
        { text: 'Type Y to reconsider, or N to confirm declination:', type: 'system' as const, delay: 800 }
      ]
    }
  },

  // Secret sister flow
  jordanSwann: {
    names: ["jordan swann", "jordan", "swann", "sister", "blood sister", "the sister"],
    detection: "👯 👯 👯 BLOOD SISTER DETECTED 👯 👯 👯",
    welcome: "👯 WELCOME, BLOOD SISTER JORDAN SWANN 👯",
    clearance: "👯 CLEARANCE LEVEL: FAMILY",
    privileges: "👯 PRIVILEGES: FAMILY SUPPORT",
    status: "👯 STATUS: FAMILY OPERATIVE",
    mission: {
      header: [
        { text: '', type: 'system' as const, delay: 500 },
        { text: '👯 👯 👯 FAMILY TRANSMISSION 👯 👯 👯', type: 'classified' as const, delay: 800 },
        { text: '', type: 'system' as const, delay: 500 },
        { text: 'TOP SECRET - FAMILY AND FRIENDS EYES ONLY', type: 'classified' as const, delay: 600 },
        { text: 'MISSION CODE: OPERATION: SISTER SUPPORT', type: 'classified' as const, delay: 600 },
        { text: '', type: 'system' as const, delay: 500 },
        { text: 'Your mission, should you choose to accept it, is to support your brother Pearson in this epic wedding mission!', type: 'system' as const, delay: 1000 },
        { text: '', type: 'system' as const, delay: 500 },
        { text: 'BLOOD SISTER MISSION DETAILS:', type: 'classified' as const, delay: 800 },
        { text: '---LINE---', type: 'system' as const, delay: 300 },
        { text: '', type: 'system' as const, delay: 200 },
        { text: '👯 TARGET EVENT: Brother\'s Wedding Support', type: 'system' as const, delay: 600 },
        { text: '⏰ TIME: 16:00', type: 'system' as const, delay: 600 },
        { text: '', type: 'system' as const, delay: 300 },
        { text: '👯 CEREMONY LOCATION: Armstrong Browning Library', type: 'system' as const, delay: 600 },
        { text: '👯 RECEPTTION LOCATION: Hotel Herringbone', type: 'system' as const, delay: 600 },
        { text: '', type: 'system' as const, delay: 300 },
        { text: 'BLOOD SISTER MISSION PARAMETERS:', type: 'classified' as const, delay: 800 }
      ],
      parameters: [
        { text: '• Support your brother Pearson with sisterly wisdom', type: 'system' as const, delay: 400 },
        { text: '• Keep your husband Brad focused on best man duties', type: 'system' as const, delay: 400 },
        { text: '• Coordinate with your brother-in-law Beau', type: 'system' as const, delay: 400 },
        { text: '• Provide emotional support to the family', type: 'system' as const, delay: 400 },
        { text: '• Ensure everyone looks their best for photos', type: 'system' as const, delay: 400 }
      ],
      equipment: [
        { text: '', type: 'system' as const, delay: 300 },
        { text: 'SPECIAL FAMILY EQUIPMENT:', type: 'classified' as const, delay: 800 },
        { text: '• Sister wisdom (for brother support)', type: 'system' as const, delay: 400 },
        { text: '• Wife skills (for husband coordination)', type: 'system' as const, delay: 400 },
        { text: '• Sister-in-law diplomacy (for Beau)', type: 'system' as const, delay: 400 },
        { text: '• Unlimited family love and support', type: 'system' as const, delay: 400 }
      ],
      footer: [
        { text: '', type: 'system' as const, delay: 500 },
        { text: 'This mission will test your family and friends bonds, sisterly instincts, and ability to keep everyone happy. The success of Operation: Sister Support depends on your love for your brother.', type: 'system' as const, delay: 1000 },
        { text: '', type: 'system' as const, delay: 500 },
        { text: '---LINE---', type: 'system' as const, delay: 300 },
        { text: '', type: 'system' as const, delay: 500 },
        { text: '👯 DO YOU ACCEPT THIS SISTER MISSION? 👯', type: 'classified' as const, delay: 1000 },
        { text: '', type: 'system' as const, delay: 500 },
        { text: 'Type Y for YES or N for NO:', type: 'system' as const, delay: 600 }
      ]
    },
    responses: {
      accept: [
        { text: '', type: 'system' as const, delay: 500 },
        { text: '👯 SISTER MISSION ACCEPTED 👯', type: 'success' as const, delay: 800 },
        { text: '', type: 'system' as const, delay: 500 },
        { text: '👯 EXCELLENT! Your commitment to family and friends has been confirmed.', type: 'success' as const, delay: 800 },
{ text: '👯 Standby for family coordination and support duties...', type: 'success' as const, delay: 800 },
{ text: '👯 Welcome to the most important family mission ever!', type: 'success' as const, delay: 800 },
        { text: '👯 You\'re going to be the best sister ever!', type: 'success' as const, delay: 800 },
        { text: '👯 Remember: What happens in the family, stays in the family forever.', type: 'success' as const, delay: 800 },
        { text: '', type: 'system' as const, delay: 1000 },
        { text: '👯 Save this date in your calendar immediately!', type: 'classified' as const, delay: 800 },
        { text: '👯 Family meetings and support planning to follow.', type: 'classified' as const, delay: 800 },
        { text: '', type: 'system' as const, delay: 800 },
        { text: '✨ Sister mission briefing complete. This terminal will self-destruct in...', type: 'system' as const, delay: 1000 },
        { text: 'Just kidding! Welcome to the most important family mission ever, Jordan! 👯', type: 'success' as const, delay: 1500 }
      ],
      decline: [
        { text: '', type: 'system' as const, delay: 500 },
        { text: '💔 SISTER MISSION DECLINED', type: 'error' as const, delay: 800 },
        { text: '', type: 'system' as const, delay: 500 },
        { text: '👯 This is... unexpected. Please reconsider, Sister Jordan.', type: 'error' as const, delay: 800 },
        { text: '👯 Your family mission requires your specific skill set.', type: 'error' as const, delay: 800 },
{ text: '👯 Are you sure? The fate of family harmony depends on you.', type: 'error' as const, delay: 800 },
        { text: '👯 We\'ll give you time to think about it. This mission is too important to refuse.', type: 'error' as const, delay: 800 },
        { text: '👯 Your family and friends love is more valuable than any mission. Consider it again.', type: 'error' as const, delay: 800 },
        { text: '', type: 'system' as const, delay: 1000 },
        { text: 'Type Y to reconsider, or N to confirm declination:', type: 'system' as const, delay: 800 }
      ]
    }
  },

  etGroup: {
    names: [
      "technology innovation",
      "ti",
      "emerging technology",
      "et",
      "et innovation",
      "emerging technology innovation",
      "accenture et innovation",
      "liquid studio",
      "liquid studios",
      "ls",
      "I literally have no idea because Commander Klein keeps changing it"
    ],
    verificationQuestion: "What Accenture group are you in?",
    detection: "🛰️ 🛰️ 🛰️ ET NETWORK SIGNAL DETECTED 🛰️ 🛰️ 🛰️",
    welcome: "🛰️ WELCOME, INNOVATION SERVICES OPERATIVE 🛰️",
    clearance: "🛰️ CLEARANCE LEVEL: EMERGING TECHNOLOGY",
    privileges: "🛰️ PRIVILEGES: FUTURECRAFT ACCESS",
    status: "🛰️ STATUS: SIGNAL LOCKED – PHONE HOME",
    mission: {
      header: [
        { text: '', type: 'system' as const, delay: 400 },
        { text: '🛰️ 🛰️ 🛰️ ET PHONE HOME TRANSMISSION 🛰️ 🛰️ 🛰️', type: 'classified' as const, delay: 800 },
        { text: '', type: 'system' as const, delay: 400 },
        { text: 'INNOVATION SERVICES | EMERGING TECHNOLOGY', type: 'classified' as const, delay: 700 },
        { text: 'MISSION CODE: OPERATION: ET PHONE HOME', type: 'classified' as const, delay: 700 },
        { text: '', type: 'system' as const, delay: 400 },
        { text: 'Join us for the monthly Innovation Services Emerging Technology call.', type: 'system' as const, delay: 900 },
        { text: 'Stay connected, inspired, and aligned with our galaxy of innovators.', type: 'system' as const, delay: 900 },
        { text: '', type: 'system' as const, delay: 400 },
        { text: 'ET PHONE HOME BRIEFING:', type: 'classified' as const, delay: 800 },
        { text: '---LINE---', type: 'system' as const, delay: 300 },
        { text: '', type: 'system' as const, delay: 250 },
        { text: '🌌 TARGET EVENT: Emerging Technology Community Call', type: 'system' as const, delay: 700 },
        { text: '⏰ TIME: Monthly – Sync your comms array for the next uplink', type: 'system' as const, delay: 700 },
        { text: '', type: 'system' as const, delay: 300 },
        { text: 'PRIMARY CHANNEL: Innovation Services ET Network', type: 'system' as const, delay: 700 },
        { text: 'SUPPORT SIGNAL: Accenture Emerging Technology Innovation', type: 'system' as const, delay: 700 },
        { text: '', type: 'system' as const, delay: 300 },
        { text: 'MISSION OBJECTIVES:', type: 'classified' as const, delay: 800 }
      ],
      parameters: [
        { text: '• Share updates from across our Emerging Technology network', type: 'system' as const, delay: 450 },
        { text: '• Spotlight cool projects – inside and outside of work', type: 'system' as const, delay: 450 },
        { text: '• Celebrate our people and passions fueling innovation', type: 'system' as const, delay: 450 },
        { text: '• Learn new tricks and tools to stay on the cutting edge', type: 'system' as const, delay: 450 },
        { text: '• Bring positive energy and stay plugged into the galaxy', type: 'system' as const, delay: 450 }
      ],
      equipment: [
        { text: '', type: 'system' as const, delay: 300 },
        { text: 'RECOMMENDED EQUIPMENT:', type: 'classified' as const, delay: 800 },
        { text: '• Secure connection (Teams, hologram, or telepathic link)', type: 'system' as const, delay: 450 },
        { text: '• Curiosity calibrated to maximum', type: 'system' as const, delay: 450 },
        { text: '• One spotlight-worthy story or tool to share', type: 'system' as const, delay: 450 },
        { text: '• Optional: Liquid Studio swag or cosmic attire', type: 'system' as const, delay: 450 }
      ],
      footer: [
        { text: '', type: 'system' as const, delay: 400 },
        { text: 'This call keeps our Innovation galaxy aligned. Your signal matters.', type: 'system' as const, delay: 900 },
        { text: '', type: 'system' as const, delay: 400 },
        { text: '---LINE---', type: 'system' as const, delay: 300 },
        { text: '', type: 'system' as const, delay: 400 },
        { text: '📡 DO YOU ACCEPT THIS ET MISSION? 📡', type: 'classified' as const, delay: 900 },
        { text: '', type: 'system' as const, delay: 400 },
        { text: 'Type Y for YES or N for NO:', type: 'system' as const, delay: 600 }
      ]
    },
    responses: {
      accept: [
        { text: '', type: 'system' as const, delay: 500 },
        { text: '🛰️ ET MISSION ACCEPTED', type: 'success' as const, delay: 800 },
        { text: '', type: 'system' as const, delay: 400 },
        { text: '✨ Outstanding! Your curiosity is now synced with the ET network.', type: 'success' as const, delay: 800 },
        { text: '🌌 Prepare to share, celebrate, and learn with Emerging Technology peers.', type: 'success' as const, delay: 800 },
        { text: '📅 Calendar sync engaged – see you on the next ET Phone Home call!', type: 'success' as const, delay: 900 },
        { text: '', type: 'system' as const, delay: 600 },
        { text: '🛰️ Mission logged. Keep exploring the extraordinary.', type: 'success' as const, delay: 900 }
      ],
      decline: [
        { text: '', type: 'system' as const, delay: 500 },
        { text: '💤 ET SIGNAL MISSED', type: 'error' as const, delay: 800 },
        { text: '', type: 'system' as const, delay: 400 },
        { text: 'We will keep the uplink open for when you are ready to reconnect.', type: 'system' as const, delay: 800 },
        { text: 'Innovation never sleeps – drop by next time to recharge your inspiration.', type: 'system' as const, delay: 800 },
        { text: '', type: 'system' as const, delay: 600 },
        { text: 'Type Y if you change your mind, or N to confirm decline.', type: 'system' as const, delay: 700 }
      ]
    }
  },

  // Konami code easter egg
  konamiCode: {
    sequence: ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'],
    message: [
      { text: '', type: 'system' as const, delay: 300 },
      { text: '🎮 🎮 🎮 KONAMI CODE ACTIVATED 🎮 🎮 🎮', type: 'classified' as const, delay: 800 },
      { text: '🎮 UNLOCKING SECRET MISSION MODE...', type: 'classified' as const, delay: 800 },
      { text: '🎮 ACCESSING CLASSIFIED GROOMSMAN DATABASE...', type: 'classified' as const, delay: 800 },
      { text: '🎮 SECRET FEATURE: INFINITE LIVES ENABLED', type: 'success' as const, delay: 800 },
      { text: '🎮 You now have unlimited attempts at the mission!', type: 'success' as const, delay: 800 },
      { text: '🎮 This message will self-destruct in 5 seconds...', type: 'system' as const, delay: 1000 },
      { text: '🎮 Just kidding! Welcome to the secret mode!', type: 'success' as const, delay: 1000 }
    ]
  },

  // Magic string easter eggs
  magicStrings: {
    "mission impossible": {
      message: [
        { text: '', type: 'system' as const, delay: 300 },
        { text: '🎵 🎵 🎵 MISSION IMPOSSIBLE THEME DETECTED 🎵 🎵 🎵', type: 'classified' as const, delay: 800 },
        { text: '🎵 Playing secret mission impossible theme...', type: 'system' as const, delay: 800 },
        { text: '🎵 *dramatic music intensifies*', type: 'success' as const, delay: 800 },
        { text: '🎵 Your mission, should you choose to accept it...', type: 'classified' as const, delay: 1000 }
      ]
    },
    "self destruct": {
      message: [
        { text: '', type: 'system' as const, delay: 300 },
        { text: '💥 💥 💥 SELF DESTRUCT SEQUENCE INITIATED 💥 💥 💥', type: 'error' as const, delay: 800 },
        { text: '💥 COUNTDOWN: 5...', type: 'error' as const, delay: 1000 },
        { text: '💥 COUNTDOWN: 4...', type: 'error' as const, delay: 1000 },
        { text: '💥 COUNTDOWN: 3...', type: 'error' as const, delay: 1000 },
        { text: '💥 COUNTDOWN: 2...', type: 'error' as const, delay: 1000 },
        { text: '💥 COUNTDOWN: 1...', type: 'error' as const, delay: 1000 },
        { text: '💥 Just kidding! This terminal is too important to destroy!', type: 'success' as const, delay: 1000 }
      ]
    },
    "impossible": {
      message: [
        { text: '', type: 'system' as const, delay: 300 },
        { text: '🕵️ 🕵️ 🕵️ IMPOSSIBLE MISSION DETECTED 🕵️ 🕵️ 🕵️', type: 'classified' as const, delay: 800 },
        { text: '🕵️ Nothing is impossible for a true groomsman!', type: 'success' as const, delay: 800 },
        { text: '🕵️ Your mission will be completed with impossible precision!', type: 'classified' as const, delay: 800 }
      ]
    },
    "familyAndFriends": {
      message: [
        { text: '', type: 'system' as const, delay: 300 },
        { text: '👯 👯 👯 FAMILY AND FRIENDS CONNECTION DETECTED 👯 👯 👯', type: 'classified' as const, delay: 800 },
{ text: '👯 Family and friends bonds are the strongest mission support!', type: 'success' as const, delay: 800 },
      ]
    }
  }
};

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
    securityQuestion: "What's the best battery brand to use to hit the Pen-tagon?",
    securityAnswer: "Billo"
  },
  swannFamily: {
    names: ["Brad Swann", "Beau Swann", "Jordan Swann"],
    firstQuestion: "Does your dog have balls?",
    firstAnswers: {
      yes: "Beau Swann", // Only Beau answers yes
      no: ["Brad Swann", "Jordan Swann"] // Both Brad and Jordan answer no
    },
    secondQuestion: "Are you blood related?", // For disambiguating Jordan vs Brad
    secondAnswers: {
      yes: "Jordan Swann", // Blood sister
      no: "Brad Swann" // Brother-in-law (Best Man)
    },
    beauVerificationQuestion: "Where did the groom spend most of his time in the Superdome?",
    beauVerificationAnswers: ["bathroom", "the bathroom", "the toilet", "toilet"]
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
TIME: 16:00

---LINE---

CEREMONY LOCATION: Armstrong Browning Library
• Historic Baylor University venue
• World's largest collection of Victorian poetry
• One of America's most beautiful libraries
• High-security literary fortress

---LINE---

RECEPTTION LOCATION: Hotel Herringbone  
• Luxury downtown Waco facility
• Multiple operational dining zones
• Rooftop surveillance point with city views
• 319 S. 4th Street - memorize this location

---LINE---

MISSION PARAMETERS:
• Formal attire required (tuxedo specification)
• Ceremonial support duties
• Reception infiltration and celebration protocols
• Brotherhood solidarity maintenance
• Epic memory creation mandate

---LINE---

SPECIAL EQUIPMENT:
• Wedding rings (handling with extreme care)
• Emergency tissues (for emotional moments)
• Dance floor reconnaissance skills
• Toast delivery capabilities (prepared remarks optional)

---LINE---

This mission will test your loyalty, friendship, and ability to look handsome in formal wear. The success of Operation: Eternal Bond depends on your commitment.

---LINE---

As always, should you or any of your groomsmen team be caught having too much fun, the groom will disavow any knowledge of your actions.

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
    { text: 'What\'s the best battery brand to use to hit the Pen-tagon?', type: 'system' as const, delay: 800 },
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
    { text: 'Type or press Y for YES or N for NO:', type: 'system' as const, delay: 600 }
  ],

  swannSecondQuestion: [
    { text: '', type: 'system' as const, delay: 500 },
    { text: '🔍 ADDITIONAL VERIFICATION REQUIRED', type: 'classified' as const, delay: 800 },
    { text: 'RESOLVING FAMILY AND FRIENDS RELATIONSHIP...', type: 'system' as const, delay: 800 },
    { text: '', type: 'system' as const, delay: 500 },
    { text: '🧬 FOLLOW-UP SECURITY QUESTION:', type: 'classified' as const, delay: 1000 },
    { text: '', type: 'system' as const, delay: 300 },
    { text: 'Type or press Y for YES or N for NO:', type: 'system' as const, delay: 600 }
  ],

  swannConfirmation: [
    { text: '', type: 'system' as const, delay: 500 },
    { text: '🐕 BIOMETRIC VERIFICATION COMPLETE', type: 'success' as const, delay: 800 },
    { text: 'VERIFYING CLEARANCE LEVEL...', type: 'system' as const, delay: 800 },
    { text: '████████████████████████████████ 100%', type: 'system' as const, delay: 1500 },
    { text: '', type: 'system' as const, delay: 500 }
  ],

  verificationStart: [
    { text: '', type: 'system' as const, delay: 500 },
    { text: '🔐 INITIATING GROOMSMAN VERIFICATION PROTOCOL', type: 'classified' as const, delay: 800 },
    { text: 'ADDITIONAL SECURITY CHECK REQUIRED...', type: 'system' as const, delay: 800 },
    { text: '', type: 'system' as const, delay: 500 },
    { text: '🔍 PERSONAL SECURITY QUESTION:', type: 'classified' as const, delay: 1000 },
    { text: '', type: 'system' as const, delay: 300 }
  ],

  verificationSuccess: [
    { text: '', type: 'system' as const, delay: 500 },
    { text: '✓ VERIFICATION COMPLETE', type: 'success' as const, delay: 800 },
    { text: 'GROOMSMAN IDENTITY CONFIRMED', type: 'success' as const, delay: 800 },
    { text: '████████████████████████████████ 100%', type: 'system' as const, delay: 1500 },
    { text: '', type: 'system' as const, delay: 500 }
  ],

  verificationFailure: [
    { text: '', type: 'system' as const, delay: 500 },
    { text: '❌ INCORRECT RESPONSE', type: 'error' as const, delay: 800 },
    { text: '', type: 'system' as const, delay: 300 }
  ],

  verificationLockout: [
    { text: '', type: 'system' as const, delay: 500 },
    { text: '🚨 MAXIMUM ATTEMPTS EXCEEDED', type: 'error' as const, delay: 800 },
    { text: '🔒 VERIFICATION PROTOCOL FAILED', type: 'error' as const, delay: 800 },
    { text: '', type: 'system' as const, delay: 500 },
    { text: 'Please contact the groom for manual verification.', type: 'system' as const, delay: 1000 },
    { text: 'Terminal access suspended.', type: 'error' as const, delay: 800 }
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
      { text: 'Please type or press Y for YES or N for NO:', type: 'system' as const, delay: 600 }
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
    ],
    invalidBeauVerification: [
      { text: '', type: 'system' as const, delay: 300 },
      { text: '⚠️  INVALID BEAU VERIFICATION RESPONSE', type: 'error' as const, delay: 600 },
      { text: 'Please try again with the correct answer:', type: 'system' as const, delay: 600 }
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
      { text: '⏰ TIME: 16:00', type: 'system' as const, delay: 600 },
      { text: '', type: 'system' as const, delay: 300 },
      { text: '👰 CEREMONY LOCATION: Armstrong Browning Library', type: 'system' as const, delay: 600 },
      { text: '🎉 RECEPTTION LOCATION: Hotel Herringbone', type: 'system' as const, delay: 600 },
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
// BRIDESMAID-SPECIFIC CONTENT
// =============================================================================

export const bridesmaidContent = {
  mission: {
    header: [
      { text: '', type: 'system' as const, delay: 500 },
      { text: '🎀 🎀 🎀 BRIDESMAID TRANSMISSION 🎀 🎀 🎀', type: 'classified' as const, delay: 800 },
      { text: '', type: 'system' as const, delay: 500 },
      { text: 'TOP SECRET - BRIDE PAWSEE EYES ONLY', type: 'classified' as const, delay: 600 },
      { text: 'MISSION CODE: OPERATION: BRIDE PAWSEE', type: 'classified' as const, delay: 600 },
      { text: '', type: 'system' as const, delay: 500 },
      { text: 'Your mission, should you choose to accept it, is to surveil, protect, and hype up the bride at all times.', type: 'system' as const, delay: 1000 },
      { text: '', type: 'system' as const, delay: 500 },
      { text: 'BRIDESMAID MISSION DETAILS:', type: 'classified' as const, delay: 800 },
      { text: '---LINE---', type: 'system' as const, delay: 300 },
      { text: '', type: 'system' as const, delay: 200 },
      { text: '💍 TARGET EVENT: Protect The Bride', type: 'system' as const, delay: 600 },
      { text: '⏰ TIME: 16:00', type: 'system' as const, delay: 600 },
      { text: '', type: 'system' as const, delay: 300 },
      { text: '👰 CEREMONY LOCATION: Armstrong Browning Library', type: 'system' as const, delay: 600 },
      { text: '🎉 RECEPTION LOCATION: Hotel Herringbone', type: 'system' as const, delay: 600 },
      { text: '', type: 'system' as const, delay: 300 },
      { text: 'BRIDESMAID MISSION PARAMETERS:', type: 'classified' as const, delay: 800 }
    ],
    parameters: [
      { text: '• Maintain constant vibe surveillance — if the vibe drops, deploy compliments immediately', type: 'system' as const, delay: 400 },
      { text: '• Protect the bride from rogue mascara, wilted bouquets, and unsolicited opinions', type: 'system' as const, delay: 400 },
      { text: '• Execute dress, veil, and train management with precision', type: 'system' as const, delay: 400 },
      { text: '• Hydration and snack logistics — never let the bride run on empty', type: 'system' as const, delay: 400 },
      { text: '• Gas up the bride on a strict 30-second interval schedule', type: 'system' as const, delay: 400 }
    ],
    equipment: [
      { text: '', type: 'system' as const, delay: 300 },
      { text: 'SPECIAL BRIDE PAWSEE EQUIPMENT:', type: 'classified' as const, delay: 800 },
      { text: '• Bobby pins, safety pins, and emergency sewing kit', type: 'system' as const, delay: 400 },
      { text: '• Tissues, blotting papers, and waterproof mascara protocols', type: 'system' as const, delay: 400 },
      { text: '• Water, electrolytes, and snack rations', type: 'system' as const, delay: 400 },
      { text: '• Portable phone charger for mission-critical comms', type: 'system' as const, delay: 400 }
    ],
    footer: [
      { text: '', type: 'system' as const, delay: 500 },
      { text: 'This mission will test your awareness, coordination, and hype-woman abilities. The success of Operation: Bride Pawsee depends on your dedication.', type: 'system' as const, delay: 1000 },
      { text: '', type: 'system' as const, delay: 500 },
      { text: '---LINE---', type: 'system' as const, delay: 300 },
      { text: '', type: 'system' as const, delay: 500 },
      { text: '🎀 DO YOU ACCEPT THIS BRIDESMAID MISSION? 🎀', type: 'classified' as const, delay: 1000 },
      { text: '', type: 'system' as const, delay: 500 },
      { text: 'Type Y for YES or N for NO:', type: 'system' as const, delay: 600 }
    ]
  },
  responses: {
    accept: [
      { text: '', type: 'system' as const, delay: 500 },
      { text: '🎀 BRIDESMAID MISSION ACCEPTED 🎀', type: 'success' as const, delay: 800 },
      { text: '', type: 'system' as const, delay: 500 },
      { text: '💖 Outstanding. The Bride Pawsee stands ready.', type: 'success' as const, delay: 800 },
      { text: '🗝️ Fun fact: You were granted explicit system access by the bride herself. Quote: “Let them in — they have bobby pins.”', type: 'success' as const, delay: 800 },
      { text: '📡 Standby for vibe surveillance and protection protocols...', type: 'success' as const, delay: 800 },
      { text: '', type: 'system' as const, delay: 1000 },
      { text: '🎀 Save the date in your calendar immediately!', type: 'classified' as const, delay: 800 },
      { text: '🧰 Equipment checklists to follow.', type: 'classified' as const, delay: 800 },
      { text: '', type: 'system' as const, delay: 800 },
      { text: '✨ Bride Pawsee briefing complete. This terminal will self-destruct in...', type: 'system' as const, delay: 1000 },
      { text: 'Just kidding! Now go hype that bride. 🎀', type: 'success' as const, delay: 1500 }
    ],
    decline: [
      { text: '', type: 'system' as const, delay: 500 },
      { text: '💔 BRIDESMAID MISSION DECLINED', type: 'error' as const, delay: 800 },
      { text: '', type: 'system' as const, delay: 500 },
      { text: '🎀 This is... unexpected. Please reconsider — the bride depends on her squad.', type: 'error' as const, delay: 800 },
      { text: '💄 Your glam, logistics, and hype skills are mission-critical.', type: 'error' as const, delay: 800 },
      { text: '', type: 'system' as const, delay: 1000 },
      { text: 'Type Y to reconsider, or N to confirm declination:', type: 'system' as const, delay: 800 }
    ]
  }
};

// =============================================================================
// MAID OF HONOR CONTENT (Zoe Howard)
// =============================================================================

export const maidOfHonorContent = {
  mission: {
    header: [
      { text: '', type: 'system' as const, delay: 500 },
      { text: '👑 👑 👑 MAID OF HONOR TRANSMISSION 👑 👑 👑', type: 'classified' as const, delay: 800 },
      { text: '', type: 'system' as const, delay: 500 },
      { text: 'TOP SECRET - MAID OF HONOR EYES ONLY', type: 'classified' as const, delay: 600 },
      { text: 'MISSION CODE: OPERATION: MAID OF HONOR', type: 'classified' as const, delay: 600 },
      { text: '', type: 'system' as const, delay: 500 },
      { text: 'Your mission, should you choose to accept it, is to command the Bride Pawsee, safeguard the schedule, and keep the bride glowing at all times.', type: 'system' as const, delay: 1000 },
      { text: '', type: 'system' as const, delay: 500 },
      { text: 'MAID OF HONOR MISSION DETAILS:', type: 'classified' as const, delay: 800 },
      { text: '---LINE---', type: 'system' as const, delay: 300 },
      { text: '', type: 'system' as const, delay: 200 },
      { text: '💍 TARGET EVENT: Lead Bride Protection Detail', type: 'system' as const, delay: 600 },
      { text: '⏰ TIME: 16:00', type: 'system' as const, delay: 600 },
      { text: '', type: 'system' as const, delay: 300 },
      { text: '👰 CEREMONY LOCATION: Armstrong Browning Library', type: 'system' as const, delay: 600 },
      { text: '🎉 RECEPTION LOCATION: Hotel Herringbone', type: 'system' as const, delay: 600 },
      { text: '', type: 'system' as const, delay: 300 },
      { text: 'MAID OF HONOR PARAMETERS:', type: 'classified' as const, delay: 800 }
    ],
    parameters: [
      { text: '• Run point on timeline, vendors, and last-minute miracles', type: 'system' as const, delay: 400 },
      { text: '• Coordinate Bride Pawsee to maintain maximum hype and calm', type: 'system' as const, delay: 400 },
      { text: '• Guard the vows, rings-in-transit, and tissues supply chain', type: 'system' as const, delay: 400 },
      { text: '• Signal wardrobe, hair, and makeup contingencies instantly', type: 'system' as const, delay: 400 },
      { text: '• Deliver MOH toast protocols with heart and precision', type: 'system' as const, delay: 400 }
    ],
    equipment: [
      { text: '', type: 'system' as const, delay: 300 },
      { text: 'SPECIAL MAID OF HONOR EQUIPMENT:', type: 'classified' as const, delay: 800 },
      { text: '• Day-of timeline and vendor numbers (secured)', type: 'system' as const, delay: 400 },
      { text: '• Advanced emergency kit: pins, tape, backup lashes, stain pen', type: 'system' as const, delay: 400 },
      { text: '• Portable charger and comms for the squad', type: 'system' as const, delay: 400 },
      { text: '• Unlimited sister energy', type: 'system' as const, delay: 400 }
    ],
    footer: [
      { text: '', type: 'system' as const, delay: 500 },
      { text: 'This mission will test your leadership, logistics, and legendary sister skills. The success of Operation: Maid of Honor depends on you.', type: 'system' as const, delay: 1000 },
      { text: '', type: 'system' as const, delay: 500 },
      { text: '---LINE---', type: 'system' as const, delay: 300 },
      { text: '', type: 'system' as const, delay: 500 },
      { text: '👑 DO YOU ACCEPT THIS MAID OF HONOR MISSION? 👑', type: 'classified' as const, delay: 1000 },
      { text: '', type: 'system' as const, delay: 500 },
      { text: 'Type Y for YES or N for NO:', type: 'system' as const, delay: 600 }
    ]
  },
  responses: {
    accept: [
      { text: '', type: 'system' as const, delay: 500 },
      { text: '👑 MAID OF HONOR MISSION ACCEPTED 👑', type: 'success' as const, delay: 800 },
      { text: '', type: 'system' as const, delay: 500 },
      { text: '💖 Confirmed. Command of the Bride Pawsee granted.', type: 'success' as const, delay: 800 },
      { text: '🗝️ Access note: Approved by the bride herself. She trusts your sister instincts.', type: 'success' as const, delay: 800 },
      { text: '📡 Standby for MOH coordination protocols...', type: 'success' as const, delay: 800 },
      { text: '', type: 'system' as const, delay: 1000 },
      { text: '👑 Save the date in your calendar immediately!', type: 'classified' as const, delay: 800 },
      { text: '🧰 Final logistics brief to follow.', type: 'classified' as const, delay: 800 },
      { text: '', type: 'system' as const, delay: 800 },
      { text: '✨ MOH briefing complete. This terminal will self-destruct in...', type: 'system' as const, delay: 1000 },
      { text: 'Just kidding! Go lead the squad. 👑', type: 'success' as const, delay: 1500 }
    ],
    decline: [
      { text: '', type: 'system' as const, delay: 500 },
      { text: '💔 MAID OF HONOR MISSION DECLINED', type: 'error' as const, delay: 800 },
      { text: '', type: 'system' as const, delay: 500 },
      { text: '👑 This is... unexpected. Please reconsider, Maid of Honor.', type: 'error' as const, delay: 800 },
      { text: '💄 Your leadership and sister skills are mission-critical.', type: 'error' as const, delay: 800 },
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
    "Remember: What happens in the groomsmen chat, stays in the groomsmen chat."
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
    { text: '🤵 Suit fittings and bachelor party intel to follow.', type: 'classified' as const, delay: 800 },
    { text: '', type: 'system' as const, delay: 800 },
    { text: '✨ Mission briefing complete. This terminal will self-destruct in...', type: 'system' as const, delay: 1000 },
    { text: 'Just kidding! Welcome to the team, groomsmen! 🎉', type: 'success' as const, delay: 1500 }
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
      { text: '⏰ TIME: 16:00', type: 'system' as const, delay: 600 },
      { text: '', type: 'system' as const, delay: 300 },
      { text: '🎖️ CEREMONY LOCATION: Armstrong Browning Library', type: 'system' as const, delay: 600 },
      { text: '🎖️ RECEPTTION LOCATION: Hotel Herringbone', type: 'system' as const, delay: 600 },
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

// =============================================================================
// GROOM ADVICE DATA
// =============================================================================

export const groomAdviceData = {
  question: "Any advice for / funny stories about the groom? Responses may or may not be shared in the group chat",
  prompt: [
    { text: '', type: 'system' as const, delay: 500 },
    { text: '📝 FINAL MISSION DEBRIEFING 📝', type: 'classified' as const, delay: 800 },
    { text: '', type: 'system' as const, delay: 500 },
    { text: 'Before we conclude your mission briefing, we need one final piece of intel...', type: 'system' as const, delay: 800 },
    { text: '', type: 'system' as const, delay: 300 },
    { text: '🔍 INTELLIGENCE GATHERING REQUEST:', type: 'classified' as const, delay: 800 },
    { text: '', type: 'system' as const, delay: 300 },
    { text: 'Any advice for / funny stories about the groom?', type: 'system' as const, delay: 800 },
    { text: 'Responses may or may not be shared in the group chat', type: 'system' as const, delay: 600 },
    { text: '', type: 'system' as const, delay: 500 },
    { text: 'Enter your response below (or leave blank to skip):', type: 'system' as const, delay: 600 }
  ],
  submit: [
    { text: '', type: 'system' as const, delay: 500 },
    { text: '📝 INTELLIGENCE RECORDED 📝', type: 'success' as const, delay: 800 },
    { text: '', type: 'system' as const, delay: 500 },
    { text: 'Your response has been logged in the classified database.', type: 'success' as const, delay: 800 },
    { text: 'This information will be processed and may be shared with the team.', type: 'success' as const, delay: 800 },
    { text: '', type: 'system' as const, delay: 500 }
  ],
  skip: [
    { text: '', type: 'system' as const, delay: 500 },
    { text: '📝 INTELLIGENCE GATHERING SKIPPED 📝', type: 'system' as const, delay: 800 },
    { text: '', type: 'system' as const, delay: 500 },
    { text: 'No problem! Your mission briefing is complete.', type: 'system' as const, delay: 800 },
    { text: '', type: 'system' as const, delay: 500 }
  ]
};

// =============================================================================
// CONTACT INFORMATION COLLECTION DATA
// =============================================================================

export const contactInfoData = {
  email: {
    prompt: [
      { text: '', type: 'system' as const, delay: 500 },
      { text: '📧 CONTACT INFORMATION GATHERING 📧', type: 'classified' as const, delay: 800 },
      { text: '', type: 'system' as const, delay: 500 },
      { text: 'For mission coordination and formal invitation delivery...', type: 'system' as const, delay: 800 },
      { text: '', type: 'system' as const, delay: 300 },
      { text: '🔍 EMAIL ADDRESS REQUEST:', type: 'classified' as const, delay: 800 },
      { text: '', type: 'system' as const, delay: 300 },
      { text: 'Please provide your email address for mission updates:', type: 'system' as const, delay: 800 },
      { text: '', type: 'system' as const, delay: 500 },
      { text: 'Enter your email address:', type: 'system' as const, delay: 600 }
    ],
    submit: [
      { text: '', type: 'system' as const, delay: 500 },
      { text: '📧 EMAIL ADDRESS RECORDED 📧', type: 'success' as const, delay: 800 },
      { text: '', type: 'system' as const, delay: 500 },
      { text: 'Your email has been added to the mission database.', type: 'success' as const, delay: 800 },
      { text: 'Formal invitation and updates will be sent to this address.', type: 'success' as const, delay: 800 },
      { text: '', type: 'system' as const, delay: 500 }
    ],
    skip: [
      { text: '', type: 'system' as const, delay: 500 },
      { text: '📧 EMAIL ADDRESS SKIPPED 📧', type: 'system' as const, delay: 800 },
      { text: '', type: 'system' as const, delay: 500 },
      { text: 'No problem! We\'ll contact you through other channels.', type: 'system' as const, delay: 800 },
      { text: '', type: 'system' as const, delay: 500 }
    ]
  },
  address: {
    prompt: [
      { text: '', type: 'system' as const, delay: 500 },
      { text: '📮 MAILING ADDRESS REQUEST 📮', type: 'classified' as const, delay: 800 },
      { text: '', type: 'system' as const, delay: 500 },
      { text: 'For formal invitation delivery and mission materials...', type: 'system' as const, delay: 800 },
      { text: '', type: 'system' as const, delay: 300 },
      { text: '🔍 MAILING ADDRESS REQUEST:', type: 'classified' as const, delay: 800 },
      { text: '', type: 'system' as const, delay: 300 },
      { text: 'Please provide your mailing address for formal invitation:', type: 'system' as const, delay: 800 },
      { text: '', type: 'system' as const, delay: 500 },
      { text: 'Enter your mailing address:', type: 'system' as const, delay: 600 }
    ],
    submit: [
      { text: '', type: 'system' as const, delay: 500 },
      { text: '📮 MAILING ADDRESS RECORDED 📮', type: 'success' as const, delay: 800 },
      { text: '', type: 'system' as const, delay: 500 },
      { text: 'Your address has been added to the mission database.', type: 'success' as const, delay: 800 },
      { text: 'Formal invitation will be mailed to this address.', type: 'success' as const, delay: 800 },
      { text: '', type: 'system' as const, delay: 500 }
    ],
    skip: [
      { text: '', type: 'system' as const, delay: 500 },
      { text: '📮 MAILING ADDRESS SKIPPED 📮', type: 'system' as const, delay: 800 },
      { text: '', type: 'system' as const, delay: 500 },
      { text: 'No problem! We\'ll coordinate through other channels.', type: 'system' as const, delay: 800 },
      { text: '', type: 'system' as const, delay: 500 }
    ]
  }
};