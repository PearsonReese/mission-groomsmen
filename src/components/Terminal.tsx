import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { AudioManager } from '@/components/AudioManager';
import { useAudio } from '@/hooks/useAudio';
import { apiService } from '@/services/api';

import { 
  groomsmenNames, 
  missionBriefing, 
  responses, 
  weddingDetails,
  specialPersons,
  verificationQuestions,
  terminalMessages,
  brideContent,
  bestManContent,
  missionPrompts,
  easterEggs,
  groomAdviceData,
  contactInfoData,
  familyAndFriendsNames
} from '@/utils/missionData';

interface TerminalLine {
  text: string;
  type: 'system' | 'user' | 'error' | 'success' | 'classified';
  delay?: number;
}

type GameState = 'intro' | 'name_input' | 'swann_disambiguation' | 'swann_second_question' | 'reese_groom_question' | 'beau_verification' | 'howard_bride_detection' | 'howard_younger_brother_detection' | 'tarver_groomsman_detection' | 'holland_groomsman_detection' | 'williard_groomsman_detection' | 'jones_groomsman_detection' | 'best_man_authentication' | 'verification' | 'authentication' | 'mission_choice' | 'email_collection' | 'address_collection' | 'groom_advice' | 'completed';

export function Terminal() {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [gameState, setGameState] = useState<GameState>('intro');
  const [userName, setUserName] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const [showAudioManager, setShowAudioManager] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [konamiSequence, setKonamiSequence] = useState<string[]>([]);
  const [konamiActivated, setKonamiActivated] = useState(false);
  const [verificationAttempts, setVerificationAttempts] = useState(0);
  const [currentVerificationUser, setCurrentVerificationUser] = useState('');
  const [pendingSwanns, setPendingSwanns] = useState<string[]>([]);
  const [unauthorizedAttempts, setUnauthorizedAttempts] = useState(0);
  const [groomAdvice, setGroomAdvice] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userAddress, setUserAddress] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const introStartedRef = useRef(false);
  
  // Move audio state to Terminal level to persist across AudioManager unmounts
  const audio = useAudio('/audio/mission-impossible-theme.mp3');

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || 'ontouchstart' in window);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Dynamic viewport height handler for mobile browsers
  useEffect(() => {
    let ticking = false;
    
    const updateViewportHeight = () => {
      // Calculate actual viewport height and set as CSS custom property
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
      ticking = false;
    };

    const throttledUpdate = () => {
      if (!ticking) {
        requestAnimationFrame(updateViewportHeight);
        ticking = true;
      }
    };

    // Set initial height
    updateViewportHeight();

    // Update on resize and orientation change (immediate)
    window.addEventListener('resize', throttledUpdate, { passive: true });
    window.addEventListener('orientationchange', updateViewportHeight, { passive: true });
    
    // Update on scroll (throttled for performance)
    window.addEventListener('scroll', throttledUpdate, { passive: true });

    // Also update when the page visibility changes (mobile browser UI changes)
    document.addEventListener('visibilitychange', updateViewportHeight);

    return () => {
      window.removeEventListener('resize', throttledUpdate);
      window.removeEventListener('orientationchange', updateViewportHeight);
      window.removeEventListener('scroll', throttledUpdate);
      document.removeEventListener('visibilitychange', updateViewportHeight);
    };
  }, []);

  // Konami code detection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (konamiActivated) return; // Prevent multiple activations
      
      const newSequence = [...konamiSequence, e.code];
      setKonamiSequence(newSequence);
      
      // Keep only the last 10 keys
      if (newSequence.length > 10) {
        newSequence.shift();
      }
      
      // Check if Konami code is complete
      if (newSequence.length === 10) {
        const isKonamiCode = easterEggs.konamiCode.sequence.every((key, index) => key === newSequence[index]);
        if (isKonamiCode) {
          setKonamiActivated(true);
          handleKonamiCode();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [konamiSequence, konamiActivated]);

  // Auto-scroll to bottom when new lines are added
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  // Blinking cursor effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Auto-focus management for mobile keyboard
  useEffect(() => {
    // Focus states that should trigger keyboard on mobile
    const focusStates = [
      'name_input', 
      'swann_second_question', 
      'best_man_authentication', 
      'verification', 
      'authentication', 
      'mission_choice',
      'email_collection',
      'address_collection',
      'groom_advice',
      'completed'
    ];
    
    if (focusStates.includes(gameState) && !isTyping && inputRef.current) {
      // Small delay to ensure DOM is ready
      const focusTimer = setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          // Force keyboard to open on mobile by triggering a click
          if (isMobile) {
            inputRef.current.click();
          }
        }
      }, 100);
      
      return () => clearTimeout(focusTimer);
    }
  }, [gameState, isTyping, isMobile]);

  // Initial focus when component mounts and game state is ready
  useEffect(() => {
    if (gameState === 'name_input' && !isTyping && inputRef.current) {
      const initialFocusTimer = setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          // Force keyboard to open on mobile
          if (isMobile) {
            inputRef.current.click();
          }
        }
      }, 200);
      
      return () => clearTimeout(initialFocusTimer);
    }
  }, [gameState, isTyping, isMobile]);

  // Handle focus when mobile state changes (responsive design)
  useEffect(() => {
    const focusStates = [
      'name_input', 
      'swann_second_question', 
      'best_man_authentication', 
      'verification', 
      'authentication', 
      'mission_choice',
      'email_collection',
      'address_collection',
      'groom_advice',
      'completed'
    ];
    
    if (focusStates.includes(gameState) && !isTyping && inputRef.current) {
      const responsiveFocusTimer = setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          // Force keyboard to open on mobile
          if (isMobile) {
            inputRef.current.click();
          }
        }
      }, 150);
      
      return () => clearTimeout(responsiveFocusTimer);
    }
  }, [isMobile, gameState, isTyping]);

  // Console easter egg message
  useEffect(() => {
    console.log('%c🎬 MISSION IMPOSSIBLE WEDDING INVITATION 🎬', 'color: #00ff00; font-size: 20px; font-weight: bold;');
    console.log('%c🕵️ Welcome to the classified groomsman recruitment system!', 'color: #00ff00; font-size: 14px;');
    console.log('%c💍 This terminal is designed to recruit the most elite groomsmen for Operation: Eternal Bond', 'color: #00ff00; font-size: 14px;');
    console.log('%c🚨 SECURITY NOTICE: 3 unauthorized attempts will trigger lockdown', 'color: #ff0000; font-size: 14px;');
    console.log('%c🎮 Try typing the Konami code (↑↑↓↓←→←→BA) for a secret surprise!', 'color: #ffff00; font-size: 14px;');
    console.log('%c🎬 Or try entering names like "Tom Cruise", "Ethan Hunt", or "Pearson Reese" for special missions!', 'color: #ffff00; font-size: 14px;');
    console.log('%c💥 Type "self destruct" or "mission impossible" for more easter eggs!', 'color: #ff0000; font-size: 14px;');
  }, []);

  // Helper function to render line content (handles ---LINE--- conversion)
  const renderLineContent = (text: string) => {
    if (text === '---LINE---') {
      return (
        <hr className="border-green-400 border-t-2 my-2 w-full" />
      );
    }
    return text;
  };

  // Handle Konami code activation
  const handleKonamiCode = async () => {
    await addLines(easterEggs.konamiCode.message);
    // Log Konami code discovery
    await apiService.logEasterEgg('konami_code', { userName });
  };

  // Check for magic string easter eggs
  const checkMagicStrings = async (input: string) => {
    const inputLower = input.toLowerCase();
    
    for (const [magicString, easterEgg] of Object.entries(easterEggs.magicStrings)) {
      if (inputLower.includes(magicString.toLowerCase())) {
        await addLines(easterEgg.message);
        // Log magic string discovery
        await apiService.logEasterEgg('magic_string', { string: magicString, input, userName });
        return true;
      }
    }
    return false;
  };

  // Check for easter egg celebrity flows
  const checkEasterEggFlows = (input: string): string | null => {
    const inputLower = input.toLowerCase().trim();
    
    // Check Tom Cruise easter egg
    for (const name of easterEggs.tomCruise.names) {
      if (inputLower.includes(name.toLowerCase())) {
        return 'tomCruise';
      }
    }
    
    // Check Ethan Hunt easter egg
    for (const name of easterEggs.ethanHunt.names) {
      if (inputLower.includes(name.toLowerCase())) {
        return 'ethanHunt';
      }
    }
    
    // Check Pearson Reese easter egg
    for (const name of easterEggs.pearsonReese.names) {
      if (inputLower.includes(name.toLowerCase())) {
        return 'pearsonReese';
      }
    }
    
    // Check Jordan Swann easter egg
    for (const name of easterEggs.jordanSwann.names) {
      if (inputLower.includes(name.toLowerCase())) {
        return 'jordanSwann';
      }
    }
    
    return null;
  };

  // Add multiple lines with typing effect
  const addLines = async (newLines: TerminalLine[]) => {
    setIsTyping(true);
    
    for (const line of newLines) {
      await new Promise(resolve => setTimeout(resolve, line.delay || 800));
      setLines(prev => [...prev, line]);
    }
    
    setIsTyping(false);
    
    // Enhanced focus management for mobile keyboard
    if (inputRef.current) {
      inputRef.current.focus();
      // Force keyboard to open on mobile by triggering a click
      if (isMobile) {
        inputRef.current.click();
      }
    }
  };

  // Start the intro sequence only after audio dialog is closed
  const startIntroSequence = async () => {
    // Prevent double execution in StrictMode
    if (introStartedRef.current) return;
    introStartedRef.current = true;
    
    await addLines(terminalMessages.intro);
    setGameState('name_input');
  };

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

  // Helper function to update game state and backend session
  const updateGameState = async (newState: GameState, completedMission: boolean = false) => {
    setGameState(newState);
    await apiService.updateSession(newState, completedMission);
  };

  // Restart the terminal experience
  const restartTerminal = async () => {
    // Log restart event before clearing session
    if (userName) {
      const sessionParts = sessionId ? sessionId.split('_') : [];
      const sessionStartTime = sessionParts.length > 1 && sessionParts[1] ? parseInt(sessionParts[1]) : Date.now();
      await apiService.logEvent('session_restart', { 
        userName,
        previousGameState: gameState,
        sessionDuration: Date.now() - sessionStartTime
      });
    }
    
    setLines([]);
    setCurrentInput('');
    setGameState('intro');
    setUserName('');
    setIsTyping(false);
    setUnauthorizedAttempts(0); // Reset unauthorized attempts on restart
    setGroomAdvice(''); // Reset groom advice on restart
    setUserEmail(''); // Reset email on restart
    setUserAddress(''); // Reset address on restart
    setSessionId(null); // Clear session ID
    introStartedRef.current = false;
    
    // Clear session from backend
    apiService.clearSession();
    
    // Scroll to top of terminal
    if (terminalRef.current) {
      terminalRef.current.scrollTop = 0;
    }
    
    await addLines(terminalMessages.restart);
    await startIntroSequence();
  };

  // Exact last name matching for groomsmen
  const findMatchingGroomsman = (input: string): string | null => {
    const inputLower = input.toLowerCase().trim();
    
    // Find groomsman whose last name exactly matches the input
    const matchedGroomsman = groomsmenNames.find(name => {
      const nameParts = name.toLowerCase().split(' ');
      const lastName = nameParts[nameParts.length - 1]; // Get the last part as the last name
      return lastName === inputLower;
    });
    
    return matchedGroomsman || null;
  };

  // Check if input matches multiple Swann family members
  const findAllSwannMatches = (input: string): string[] => {
    const inputLower = input.toLowerCase().trim();
    
    return specialPersons.swannFamily.names.filter(name => {
      const nameParts = name.toLowerCase().split(' ');
      const lastName = nameParts[nameParts.length - 1]; // Get the last part as the last name
      
      // Check if input matches the last name exactly
      return lastName === inputLower;
    });
  };

  // Check if a user needs verification
  const needsVerification = (userName: string): boolean => {
    return Object.keys(verificationQuestions).includes(userName);
  };

  // Fuzzy match verification answers
  const isCorrectVerificationAnswer = (userAnswer: string, correctAnswers: string[]): boolean => {
    const userLower = userAnswer.toLowerCase().trim();
    return correctAnswers.some(correct => {
      const correctLower = correct.toLowerCase();
      return userLower === correctLower || 
             userLower.includes(correctLower) || 
             correctLower.includes(userLower);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Handle restart command
    if (currentInput.toLowerCase().trim() === 'restart' && gameState === 'completed') {
      setCurrentInput('');
      await restartTerminal();
      return;
    }
    
    // Handle mobile button CTA for authentication state
    if (gameState === 'authentication' && !isTyping) {
      // Trigger the authentication case with empty input
      const input = '';
      setCurrentInput('');
      
      // Add empty user input to terminal
      setLines(prev => [...prev, { text: `> `, type: 'user' }]);
      
      // Security check: Only allow authorized users to access briefing
      // Check if user is a groomsman, an easter egg character, Howard Family, or other family members
      const isGroomsman = groomsmenNames.some(name => name.toLowerCase() === userName.toLowerCase());
      const isEasterEgg = easterEggs.tomCruise.names.some(name => name.toLowerCase() === userName.toLowerCase()) ||
                          easterEggs.ethanHunt.names.some(name => name.toLowerCase() === userName.toLowerCase()) ||
                          easterEggs.pearsonReese.names.some(name => name.toLowerCase() === userName.toLowerCase()) ||
                          easterEggs.jordanSwann.names.some(name => name.toLowerCase() === userName.toLowerCase());
      const isHowardFamily = userName.toLowerCase() === 'howard family';
      const isOtherFamily = userName.toLowerCase().includes(' family') && !isHowardFamily;
      
      const authorizedUser = isGroomsman || isEasterEgg || isHowardFamily || isOtherFamily;
      
      if (!authorizedUser) {
        // Unauthorized user trying to access briefing - block them
        const securityLines: TerminalLine[] = [
          { text: '', type: 'system', delay: 300 },
          { text: '🚨 SECURITY VIOLATION DETECTED 🚨', type: 'error', delay: 800 },
          { text: '🔒 UNAUTHORIZED ACCESS ATTEMPT BLOCKED', type: 'error', delay: 800 },
          { text: '📞 INCIDENT REPORTED TO SECURITY', type: 'error', delay: 600 },
          { text: '', type: 'system', delay: 500 },
          { text: 'Connection terminated.', type: 'error', delay: 800 }
        ];
        
        await addLines(securityLines);
        setGameState('completed');
        return;
      }
      
      // Handle the authentication case - check for easter egg flows first
      if (userName.toLowerCase() === 'tom cruise') {
        // Tom Cruise easter egg briefing
        const tomCruiseBriefingLines = [
          ...easterEggs.tomCruise.mission.header,
          { text: `📅 DATE: ${weddingDetails.date}`, type: 'system' as const, delay: 600 },
          ...easterEggs.tomCruise.mission.parameters,
          ...easterEggs.tomCruise.mission.equipment,
          ...easterEggs.tomCruise.mission.footer
        ];

        await addLines(tomCruiseBriefingLines);
        setGameState('mission_choice');
      } else if (userName.toLowerCase() === 'ethan hunt') {
        // Ethan Hunt easter egg briefing
        const ethanHuntBriefingLines = [
          ...easterEggs.ethanHunt.mission.header,
          { text: `📅 DATE: ${weddingDetails.date}`, type: 'system' as const, delay: 600 },
          ...easterEggs.ethanHunt.mission.parameters,
          ...easterEggs.ethanHunt.mission.equipment,
          ...easterEggs.ethanHunt.mission.footer
        ];

        await addLines(ethanHuntBriefingLines);
        setGameState('mission_choice');
      } else if (userName.toLowerCase() === 'pearson reese') {
        // Pearson Reese easter egg briefing
        const pearsonReeseBriefingLines = [
          ...easterEggs.pearsonReese.mission.header,
          { text: `📅 DATE: ${weddingDetails.date}`, type: 'system' as const, delay: 600 },
          ...easterEggs.pearsonReese.mission.parameters,
          ...easterEggs.pearsonReese.mission.equipment,
          ...easterEggs.pearsonReese.mission.footer
        ];

        await addLines(pearsonReeseBriefingLines);
        setGameState('mission_choice');
      } else if (userName.toLowerCase() === 'jordan swann') {
        // Jordan Swann easter egg briefing
        const jordanSwannBriefingLines = [
          ...easterEggs.jordanSwann.mission.header,
          { text: `📅 DATE: ${weddingDetails.date}`, type: 'system' as const, delay: 600 },
          ...easterEggs.jordanSwann.mission.parameters,
          ...easterEggs.jordanSwann.mission.equipment,
          ...easterEggs.jordanSwann.mission.footer
        ];

        await addLines(jordanSwannBriefingLines);
        setGameState('mission_choice');
      } else if (userName.toLowerCase() === specialPersons.bride.name.toLowerCase()) {
        // Build the complete bride mission briefing from structured data
        const fianceeBriefingLines = [
          ...brideContent.mission.header,
          { text: `📅 DATE: ${weddingDetails.date}`, type: 'system' as const, delay: 600 },
          ...brideContent.mission.parameters,
          ...brideContent.mission.equipment,
          ...brideContent.mission.footer
        ];

        await addLines(fianceeBriefingLines);
        setGameState('mission_choice');
      } else if (userName.toLowerCase() === specialPersons.bestMan.name.toLowerCase()) {
        // Best Man briefing
        const bestManBriefingLines = [
          ...bestManContent.mission.header,
          { text: `📅 DATE: ${weddingDetails.date}`, type: 'system' as const, delay: 600 },
          ...bestManContent.mission.parameters,
          ...bestManContent.mission.equipment,
          ...bestManContent.mission.footer
        ];

        await addLines(bestManBriefingLines);
        setGameState('mission_choice');
      } else if (userName.toLowerCase() === 'howard family') {
        // Howard Family briefing
        const howardFamilyBriefingLines = [
          { text: '', type: 'system' as const, delay: 300 },
          { text: '🏠 FAMILY BRIEFING - HOWARD FAMILY 🏠', type: 'classified' as const, delay: 800 },
          { text: 'TOP SECRET - FAMILY EYES ONLY', type: 'classified' as const, delay: 600 },
          { text: 'MISSION CODE: OPERATION: FAMILY SUPPORT', type: 'classified' as const, delay: 600 },
          { text: '', type: 'system' as const, delay: 500 },
          { text: 'Your mission, should you choose to accept it, is to support the bride and groom in this epic wedding mission!', type: 'system' as const, delay: 1000 },
          { text: '', type: 'system' as const, delay: 500 },
          { text: 'FAMILY MISSION DETAILS:', type: 'classified' as const, delay: 800 },
          { text: '---LINE---', type: 'system' as const, delay: 300 },
          { text: '', type: 'system' as const, delay: 200 },
          { text: '👰 TARGET EVENT: Family Wedding Support', type: 'system' as const, delay: 600 },
          { text: `📅 DATE: ${weddingDetails.date}`, type: 'system' as const, delay: 600 },
          { text: '', type: 'system' as const, delay: 300 },
          { text: '👰 CEREMONY LOCATION: Armstrong Browning Library', type: 'system' as const, delay: 600 },
          { text: '👰 RECEPTION LOCATION: Hotel Herringbone', type: 'system' as const, delay: 600 },
          { text: '', type: 'system' as const, delay: 300 },
          { text: 'FAMILY MISSION PARAMETERS:', type: 'classified' as const, delay: 800 },
          { text: '• Provide emotional support to the bride and groom', type: 'system' as const, delay: 400 },
          { text: '• Share family wisdom and advice', type: 'system' as const, delay: 400 },
          { text: '• Coordinate with other family members', type: 'system' as const, delay: 400 },
          { text: '• Ensure everyone feels welcome and included', type: 'system' as const, delay: 400 },
          { text: '• Capture precious family moments', type: 'system' as const, delay: 400 },
          { text: '', type: 'system' as const, delay: 300 },
          { text: 'SPECIAL FAMILY EQUIPMENT:', type: 'classified' as const, delay: 800 },
          { text: '• Family love and support', type: 'system' as const, delay: 400 },
          { text: '• Generations of family wisdom', type: 'system' as const, delay: 400 },
          { text: '• Smile for family photos', type: 'system' as const, delay: 400 },
          { text: '• Unlimited hugs and encouragement', type: 'system' as const, delay: 400 },
          { text: '', type: 'system' as const, delay: 500 },
          { text: 'This mission will test your family bonds, love for the bride and groom, and ability to make everyone feel special. The success of Operation: Family Support depends on your family love.', type: 'system' as const, delay: 1000 },
          { text: '', type: 'system' as const, delay: 500 },
          { text: '---LINE---', type: 'system' as const, delay: 300 },
          { text: '', type: 'system' as const, delay: 500 },
          { text: '🏠 DO YOU ACCEPT THIS FAMILY MISSION? 🏠', type: 'classified' as const, delay: 1000 },
          { text: '', type: 'system' as const, delay: 500 },
          { text: 'Type Y for YES or N for NO:', type: 'system' as const, delay: 600 }
        ];

        await addLines(howardFamilyBriefingLines);
        setGameState('mission_choice');
      } else if (isOtherFamily) {
        // Generic family and friends briefing for other family members
        const familyName = userName.replace(' Family', '');
        const genericFamilyBriefingLines = [
          { text: '', type: 'system' as const, delay: 300 },
          { text: `🏠 FAMILY AND FRIENDS BRIEFING - ${familyName.toUpperCase()} FAMILY 🏠`, type: 'classified' as const, delay: 800 },
          { text: 'TOP SECRET - FAMILY AND FRIENDS EYES ONLY', type: 'classified' as const, delay: 600 },
          { text: 'MISSION CODE: OPERATION: FAMILY AND FRIENDS SUPPORT', type: 'classified' as const, delay: 600 },
          { text: '', type: 'system' as const, delay: 500 },
          { text: 'Your mission, should you choose to accept it, is to support the bride and groom in this epic wedding mission!', type: 'system' as const, delay: 1000 },
          { text: '', type: 'system' as const, delay: 500 },
          { text: 'FAMILY AND FRIENDS MISSION DETAILS:', type: 'classified' as const, delay: 800 },
          { text: '---LINE---', type: 'system' as const, delay: 300 },
          { text: '', type: 'system' as const, delay: 200 },
          { text: '👰 TARGET EVENT: Family Wedding Support', type: 'system' as const, delay: 600 },
          { text: `📅 DATE: ${weddingDetails.date}`, type: 'system' as const, delay: 600 },
          { text: '', type: 'system' as const, delay: 300 },
          { text: '👰 CEREMONY LOCATION: Armstrong Browning Library', type: 'system' as const, delay: 600 },
          { text: '👰 RECEPTION LOCATION: Hotel Herringbone', type: 'system' as const, delay: 600 },
          { text: '', type: 'system' as const, delay: 300 },
          { text: 'FAMILY AND FRIENDS MISSION PARAMETERS:', type: 'classified' as const, delay: 800 },
          { text: '• Provide emotional support to the bride and groom', type: 'system' as const, delay: 400 },
          { text: '• Share wisdom and advice', type: 'system' as const, delay: 400 },
          { text: '• Coordinate with other family and friends', type: 'system' as const, delay: 400 },
          { text: '• Ensure everyone feels welcome and included', type: 'system' as const, delay: 400 },
          { text: '• Capture precious moments', type: 'system' as const, delay: 400 },
          { text: '', type: 'system' as const, delay: 300 },
          { text: 'SPECIAL FAMILY AND FRIENDS EQUIPMENT:', type: 'classified' as const, delay: 800 },
          { text: '• Family and friends love and support', type: 'system' as const, delay: 400 },
          { text: '• Generations of wisdom', type: 'system' as const, delay: 400 },
          { text: '• Smile for photos', type: 'system' as const, delay: 400 },
          { text: '• Unlimited hugs and encouragement', type: 'system' as const, delay: 400 },
          { text: '', type: 'system' as const, delay: 500 },
          { text: 'This mission will test your family and friends bonds, love for the bride and groom, and ability to make everyone feel special. The success of Operation: Family Support depends on your family love.', type: 'system' as const, delay: 1000 },
          { text: '', type: 'system' as const, delay: 500 },
          { text: '---LINE---', type: 'system' as const, delay: 300 },
          { text: '', type: 'system' as const, delay: 500 },
          { text: '🏠 DO YOU ACCEPT THIS FAMILY AND FRIENDS MISSION? 🏠', type: 'classified' as const, delay: 1000 },
          { text: '', type: 'system' as const, delay: 500 },
          { text: 'Type Y for YES or N for NO:', type: 'system' as const, delay: 600 }
        ];

        await addLines(genericFamilyBriefingLines);
        setGameState('mission_choice');
      } else {
        // Standard groomsman briefing
        const briefingLines = [
          ...missionPrompts.standard.header,
          { text: missionBriefing.classification, type: 'classified' as const, delay: 600 },
          { text: `MISSION CODE: ${missionBriefing.missionCode}`, type: 'classified' as const, delay: 600 },
          { text: '', type: 'system' as const, delay: 500 },
          { text: missionBriefing.objective, type: 'system' as const, delay: 1000 }
        ];

        // Split briefing into lines for better display
        const briefingParts = missionBriefing.briefing.split('\n');
        briefingParts.forEach(part => {
          if (part.trim()) {
            briefingLines.push({ text: part, type: 'system' as const, delay: 300 });
          } else {
            briefingLines.push({ text: '', type: 'system' as const, delay: 200 });
          }
        });

        briefingLines.push(...missionPrompts.standard.footer);

        await addLines(briefingLines);
        setGameState('mission_choice');
      }
      return;
    }
    
    if (!currentInput.trim() || isTyping) return;

    // Add user input to terminal
    setLines(prev => [...prev, { text: `> ${currentInput}`, type: 'user' }]);
    const input = currentInput;
    setCurrentInput('');

    // Check for magic string easter eggs first
    const magicStringFound = await checkMagicStrings(input);
    if (magicStringFound) return;

    switch (gameState) {
      case 'name_input':
        // Check for Swann disambiguation first (before easter egg flows)
        const swannMatches = findAllSwannMatches(input);
        
        if (swannMatches.length > 1) {
          // Multiple Swann family members detected - ask disambiguation question
          setPendingSwanns(swannMatches);
          const disambiguationLines = [
            ...terminalMessages.swannDisambiguation,
            { text: specialPersons.swannFamily.firstQuestion, type: 'system' as const, delay: 800 }
          ];
          
          await addLines(disambiguationLines);
          await updateGameState('swann_disambiguation');
          break;
        }

        // Handle Reese family / groom question
        if (input.toLowerCase().trim() === 'reese') {
          const reeseQuestionLines: TerminalLine[] = [
            { text: '', type: 'system', delay: 500 },
            { text: '🏠 REESE FAMILY MEMBER DETECTED', type: 'classified', delay: 800 },
            { text: 'Are you the one getting married?', type: 'system', delay: 800 },
            { text: '', type: 'system', delay: 300 },
            { text: 'Type or press Y for YES or N for NO:', type: 'system', delay: 600 }
          ];

          await addLines(reeseQuestionLines);
          await updateGameState('reese_groom_question');
          break;
        }
        
        // Check for easter egg celebrity flows (after Swann disambiguation)
        const easterEggFlow = checkEasterEggFlows(input);
        if (easterEggFlow) {
          let easterEggData;
          let easterEggName;
          
          switch (easterEggFlow) {
            case 'tomCruise':
              easterEggData = easterEggs.tomCruise;
              easterEggName = 'Tom Cruise';
              break;
            case 'ethanHunt':
              easterEggData = easterEggs.ethanHunt;
              easterEggName = 'Ethan Hunt';
              break;
            case 'pearsonReese':
              easterEggData = easterEggs.pearsonReese;
              easterEggName = 'Pearson Reese';
              break;
            case 'jordanSwann':
              easterEggData = easterEggs.jordanSwann;
              easterEggName = 'Jordan Swann';
              break;
            default:
              break;
          }
          
          if (easterEggData && easterEggName) {
            setUserName(easterEggName);
            
            // Initialize backend session for easter egg user
            await initializeSession(easterEggName);
            
            // Log easter egg activation
            await apiService.logEasterEgg(easterEggFlow, { userName: easterEggName });
            
            const authLines: TerminalLine[] = [
              ...terminalMessages.authentication.verifying,
              { text: easterEggData.detection, type: 'classified', delay: 1000 },
              { text: easterEggData.clearance, type: 'success', delay: 800 },
              { text: easterEggData.privileges, type: 'success', delay: 600 },
              { text: easterEggData.status, type: 'success', delay: 600 },
              { text: '', type: 'system', delay: 800 },
              { text: easterEggData.welcome, type: 'classified', delay: 1000 },
              { text: '', type: 'system', delay: 500 },
              { text: 'Press ENTER to receive your special mission briefing...', type: 'system', delay: 800 }
            ];
            
            await addLines(authLines);
            await updateGameState('authentication');
            return;
          }
        }
        
        const matchedName = findMatchingGroomsman(input);
        
        // Special case: last name Howard - ask for gender to determine flow
        // Only trigger this if we don't have an exact match (i.e., not Emma Howard)
        const inputLower = input.toLowerCase().trim();
        const isHoward = inputLower === 'howard';
        if (isHoward) {
          const howardBrideDetectionLines: TerminalLine[] = [
            { text: '', type: 'system', delay: 500 },
            { text: '💍 POTENTIAL BRIDE-TO-BE DETECTED', type: 'classified', delay: 800 },
            { text: '', type: 'system', delay: 500 },
            { text: 'Multiple Howard family members detected in system...', type: 'system', delay: 800 },
            { text: 'Additional verification required for proper authentication:', type: 'system', delay: 800 },
            { text: '', type: 'system', delay: 300 },
            { text: 'Have you ever kissed the soon to be groom?', type: 'system', delay: 800 },
            { text: '', type: 'system', delay: 300 },
            { text: 'Type Y for YES or N for NO:', type: 'system', delay: 600 }
          ];
          await addLines(howardBrideDetectionLines);
          await updateGameState('howard_bride_detection');
          break;
                }

        // Branching for last names that overlap with groomsmen
        if (inputLower === 'tarver') {
          const tarverDetectionLines: TerminalLine[] = [
            { text: '', type: 'system', delay: 500 },
            { text: '🎯 POTENTIAL TARVER GROOMSMAN DETECTED', type: 'classified', delay: 800 },
            { text: '', type: 'system', delay: 500 },
            { text: 'Multiple Tarver family members detected in system...', type: 'system', delay: 800 },
            { text: 'Do you potentially see yourself as a groomsman for Pearson?', type: 'system', delay: 800 },
            { text: '', type: 'system', delay: 300 },
            { text: 'Type Y for YES or N for NO:', type: 'system', delay: 600 }
          ];
          await addLines(tarverDetectionLines);
          await updateGameState('tarver_groomsman_detection');
          break;
        } else if (inputLower === 'holland') {
          const hollandDetectionLines: TerminalLine[] = [
            { text: '', type: 'system', delay: 500 },
            { text: '🎯 POTENTIAL HOLLAND GROOMSMAN DETECTED', type: 'classified', delay: 800 },
            { text: '', type: 'system', delay: 500 },
            { text: 'Multiple Holland family members detected in system...', type: 'system', delay: 800 },
            { text: 'Do you potentially see yourself as a groomsman for Pearson?', type: 'system', delay: 800 },
            { text: '', type: 'system', delay: 300 },
            { text: 'Type Y for YES or N for NO:', type: 'system', delay: 600 }
          ];
          await addLines(hollandDetectionLines);
          await updateGameState('holland_groomsman_detection');
          break;
        } else if (inputLower === 'williard') {
          const williardDetectionLines: TerminalLine[] = [
            { text: '', type: 'system', delay: 500 },
            { text: '🎯 POTENTIAL WILLIARD GROOMSMAN DETECTED', type: 'classified', delay: 800 },
            { text: '', type: 'system', delay: 500 },
            { text: 'Multiple Williard family members detected in system...', type: 'system', delay: 800 },
            { text: 'Do you potentially see yourself as a groomsman for Pearson?', type: 'system', delay: 800 },
            { text: '', type: 'system', delay: 300 },
            { text: 'Type Y for YES or N for NO:', type: 'system', delay: 600 }
          ];
          await addLines(williardDetectionLines);
          await updateGameState('williard_groomsman_detection');
          break;
        } else if (inputLower === 'jones') {
          const jonesDetectionLines: TerminalLine[] = [
            { text: '', type: 'system', delay: 500 },
            { text: '🎯 POTENTIAL JONES GROOMSMAN DETECTED', type: 'classified', delay: 800 },
            { text: '', type: 'system', delay: 500 },
            { text: 'Multiple Jones family members detected in system...', type: 'system', delay: 800 },
            { text: 'Do you potentially see yourself as a groomsman for Pearson?', type: 'system', delay: 800 },
            { text: '', type: 'system', delay: 300 },
            { text: 'Type Y for YES or N for NO:', type: 'system', delay: 600 }
          ];
          await addLines(jonesDetectionLines);
          await updateGameState('jones_groomsman_detection');
          break;
        }

        // Check for family and friends names (not Reese or Howard)
        const isFamilyName = familyAndFriendsNames.some(name => name.toLowerCase() === inputLower);
        if (isFamilyName) {
          const familyName = familyAndFriendsNames.find(name => name.toLowerCase() === inputLower);
          const familyAuthLines: TerminalLine[] = [
            { text: '', type: 'system', delay: 500 },
            { text: `🏠 ${familyName?.toUpperCase()} FAMILY DETECTED`, type: 'classified', delay: 800 },
            { text: '', type: 'system', delay: 500 },
            { text: `🏠 WELCOME, ${familyName?.toUpperCase()} FAMILY MEMBER`, type: 'classified', delay: 800 },
            { text: '🏠 FAMILY CLEARANCE LEVEL: GRANTED', type: 'success', delay: 800 },
            { text: '🏠 FAMILY PRIVILEGES: FAMILY AND FRIENDS BRIEFING ACCESS', type: 'success', delay: 600 },
            { text: '🏠 FAMILY STATUS: CONFIRMED', type: 'success', delay: 600 },
            { text: '', type: 'system', delay: 500 },
            { text: `🏠 Welcome to the ${familyName} family and friends briefing!`, type: 'classified', delay: 1000 },
            { text: '', type: 'system', delay: 500 },
            { text: 'Press ENTER to receive your family and friends briefing...', type: 'system', delay: 800 }
          ];
          
          setUserName(`${familyName} Family`);
          await initializeSession(`${familyName} Family`);
          await addLines(familyAuthLines);
          await updateGameState('authentication');
          break;
        }
        
        setUserName(matchedName || input);
        
        // Initialize backend session
        await initializeSession(matchedName || input);

        const authLines: TerminalLine[] = [...terminalMessages.authentication.verifying];

        if (matchedName) {
          // Special treatment for Emma (the bride!)
          if (matchedName.toLowerCase() === specialPersons.bride.name.toLowerCase()) {
            authLines.push(
              { text: specialPersons.bride.titles.detection, type: 'classified', delay: 1000 },
              ...(terminalMessages.authentication.success.bride as TerminalLine[])
            );
          } else if (matchedName.toLowerCase() === specialPersons.bestMan.name.toLowerCase()) {
            // Best Man needs additional authentication
            authLines.push(
              { text: specialPersons.bestMan.titles.detection, type: 'classified', delay: 1000 },
              ...(terminalMessages.authentication.success.bestMan as TerminalLine[])
            );
          } else {
            authLines.push(
              { text: `✓ IDENTITY CONFIRMED: ${matchedName.toUpperCase()}`, type: 'success', delay: 800 },
              ...(terminalMessages.authentication.success.standard as TerminalLine[])
            );
          }
        } else {
          // Track unauthorized access attempts
          const currentAttempts = unauthorizedAttempts + 1;
          setUnauthorizedAttempts(currentAttempts);
          
          // Log unauthorized access attempt
          await apiService.logEvent('unauthorized_access_attempt', { 
            userName: input, 
            attemptNumber: currentAttempts,
            maxAttempts: 3 
          });
          
          authLines.push(
            { text: `❌ IDENTITY NOT IN DATABASE: ${input.toUpperCase()}`, type: 'error', delay: 800 },
            { text: `🚨 UNAUTHORIZED ACCESS ATTEMPT #${currentAttempts}`, type: 'error', delay: 800 },
            ...(terminalMessages.errors.unauthorized as TerminalLine[])
          );

          if (currentAttempts >= 3) {
            // Max attempts exceeded - security lockdown
            await apiService.logEvent('security_lockdown', { 
              userName: input, 
              totalAttempts: currentAttempts,
              reason: 'max_unauthorized_attempts_exceeded'
            });
            
            authLines.push(
              { text: '', type: 'system', delay: 500 },
              { text: '🚨 SECURITY LOCKDOWN ACTIVATED 🚨', type: 'error', delay: 1000 },
              { text: '📞 INCIDENT REPORTED TO SECURITY', type: 'error', delay: 800 },
              { text: '🔒 TERMINAL ACCESS PERMANENTLY BLOCKED', type: 'error', delay: 800 },
              { text: '', type: 'system', delay: 500 },
              { text: 'Connection terminated.', type: 'error', delay: 1000 }
            );
            
            await addLines(authLines);
            setGameState('completed');
            return;
          } else {
            // Show remaining attempts and stay in name_input state
            const remainingAttempts = 3 - currentAttempts;
            authLines.push(
              { text: '', type: 'system', delay: 500 },
              { text: `⚠️  WARNING: ${remainingAttempts} attempt${remainingAttempts > 1 ? 's' : ''} remaining before security lockdown`, type: 'error', delay: 800 },
              { text: '', type: 'system', delay: 500 },
              { text: 'Please enter your correct last name to access the system.', type: 'system', delay: 800 }
            );
            
            await addLines(authLines);
            // Stay in name_input state to allow more attempts
            return;
          }
        }

        // Only show welcome message and proceed if user is authorized
        if (matchedName) {
          // Special welcome message for Emma
          if (matchedName.toLowerCase() === specialPersons.bride.name.toLowerCase()) {
            authLines.push(
              { text: '', type: 'system', delay: 800 },
              { text: specialPersons.bride.titles.welcome, type: 'classified', delay: 1000 },
              { text: '💍 You have special access to the wedding planning terminal', type: 'classified', delay: 800 },
              { text: '', type: 'system', delay: 500 },
              { text: terminalMessages.authentication.prompts.bride, type: 'system', delay: 800 }
            );
          } else if (matchedName.toLowerCase() === specialPersons.bestMan.name.toLowerCase()) {
            // Best Man needs additional security verification
            authLines.push(
              { text: '', type: 'system', delay: 800 },
              { text: specialPersons.bestMan.titles.welcome, type: 'classified', delay: 1000 },
                                  { text: '🎖️ You have ultimate clearance but require additional verification', type: 'classified' as const, delay: 800 },
              { text: '', type: 'system', delay: 500 }
            );
            
            await addLines(authLines);
            
            // Start Best Man authentication
            const bestManAuthLines = [
              ...terminalMessages.bestManAuthentication,
              { text: specialPersons.bestMan.securityQuestion, type: 'system' as const, delay: 800 },
              { text: '', type: 'system' as const, delay: 300 },
              { text: 'Enter your response:', type: 'system' as const, delay: 600 }
            ];
            
            await addLines(bestManAuthLines);
            setGameState('best_man_authentication');
            return;
          } else {
            authLines.push(
              { text: '', type: 'system', delay: 800 },
              { text: `WELCOME, AGENT ${matchedName.toUpperCase()}`, type: 'classified', delay: 1000 },
              { text: '', type: 'system', delay: 500 }
            );
            
            // Check if user needs verification (but skip Jordan Swann - she's family)
            if (needsVerification(matchedName) && matchedName !== "Jordan Swann") {
              authLines.push(
                { text: '🔐 ADDITIONAL VERIFICATION REQUIRED', type: 'classified', delay: 800 }
              );
              
              await addLines(authLines);
              
              // Start verification process
              setCurrentVerificationUser(matchedName);
              setVerificationAttempts(0);
              
              const verificationData = verificationQuestions[matchedName as keyof typeof verificationQuestions];
              const verificationLines = [
                ...terminalMessages.verificationStart,
                { text: verificationData.question, type: 'system' as const, delay: 800 },
                { text: '', type: 'system' as const, delay: 300 },
                { text: 'Enter your response:', type: 'system' as const, delay: 600 }
              ];
              
              await addLines(verificationLines);
              setGameState('verification');
              return;
            } else {
              authLines.push(
                { text: terminalMessages.authentication.prompts.standard, type: 'system', delay: 800 }
              );
            }
          }
          
          await addLines(authLines);
          setGameState('authentication');
        } else {
          // This should never be reached now since unauthorized users are handled above
          // But keeping as a fallback just in case
          await addLines(authLines);
          setGameState('completed');
        }
        break;

      case 'howard_bride_detection':
        const kissAnswer = input.toLowerCase().trim();
        
        if (kissAnswer === 'y' || kissAnswer === 'yes') {
          // Emma Howard - fiancée flow (answered yes to kissing)
          setUserName('Emma Howard');
          
          // Initialize backend session for Emma
          await initializeSession('Emma Howard');
          const emmaAuthLines: TerminalLine[] = [
            { text: '', type: 'system', delay: 500 },
            { text: specialPersons.bride.titles.detection, type: 'classified', delay: 1000 },
            { text: '', type: 'system', delay: 500 },
            { text: '💍 FIANCÉE CLEARANCE LEVEL: MAXIMUM', type: 'success', delay: 800 },
            { text: '👰 FIANCÉE PRIVILEGES: UNLIMITED', type: 'success', delay: 600 },
            { text: '💕 FIANCÉE STATUS: CONFIRMED', type: 'success', delay: 600 },
            { text: '', type: 'system', delay: 800 },
            { text: specialPersons.bride.titles.welcome, type: 'classified', delay: 1000 },
            { text: '💍 You have special access to the wedding planning terminal', type: 'classified', delay: 800 },
            { text: '', type: 'system', delay: 500 },
            { text: terminalMessages.authentication.prompts.bride, type: 'system', delay: 800 }
          ];
          await addLines(emmaAuthLines);
          setGameState('authentication');
        } else if (kissAnswer === 'n' || kissAnswer === 'no') {
          // Ask follow-up question to differentiate Will from other Howard family members
          const brotherQuestionLines: TerminalLine[] = [
            { text: '', type: 'system', delay: 500 },
            { text: 'Are you the fun (the bride might say annoying) younger brother?', type: 'system', delay: 800 },
            { text: '', type: 'system', delay: 300 },
            { text: 'Type Y for YES or N for NO:', type: 'system', delay: 600 }
          ];
          await addLines(brotherQuestionLines);
          setGameState('howard_younger_brother_detection');
        } else {
          // Invalid response
          const errorLines: TerminalLine[] = [
            { text: '', type: 'system', delay: 300 },
            { text: '⚠️  INVALID RESPONSE', type: 'error', delay: 600 },
            { text: 'Please type Y for YES or N for NO:', type: 'system', delay: 600 }
          ];
          await addLines(errorLines);
        }
        break;

      case 'howard_younger_brother_detection':
        const brotherAnswer = input.toLowerCase().trim();
        if (brotherAnswer === 'y' || brotherAnswer === 'yes') {
          // Will Howard - groomsman flow
          setUserName('Will Howard');
          await initializeSession('Will Howard');
          const willAuthLines: TerminalLine[] = [
            { text: '', type: 'system', delay: 500 },
            { text: '✓ IDENTITY CONFIRMED: WILL HOWARD', type: 'success', delay: 800 },
            { text: '🛡️  GROOMSMAN & BRIDE\'S BROTHER CLEARANCE GRANTED', type: 'success', delay: 800 },
            { text: '', type: 'system', delay: 500 },
            { text: 'Welcome, Will! You have special access as both groomsman and the bride\'s brother.', type: 'classified', delay: 1000 },
            { text: '', type: 'system', delay: 500 },
            { text: terminalMessages.authentication.prompts.standard, type: 'system', delay: 800 }
          ];
          await addLines(willAuthLines);
          setGameState('authentication');
        } else if (brotherAnswer === 'n' || brotherAnswer === 'no') {
          // Generic Howard family path
          setUserName('Howard Family');
          await initializeSession('Howard Family');
          const familyAuthLines: TerminalLine[] = [
            { text: '', type: 'system', delay: 500 },
            { text: '✓ IDENTITY CONFIRMED: HOWARD FAMILY', type: 'success', delay: 800 },
            { text: '👪 FAMILY CLEARANCE GRANTED', type: 'success', delay: 800 },
            { text: '', type: 'system', delay: 500 },
            { text: 'Welcome, Howard family member! You now have access to the family and friends briefing and invitation coordination portal.', type: 'classified', delay: 1000 },
            { text: '', type: 'system', delay: 500 },
            { text: 'Press ENTER to receive your family and friends briefing...', type: 'system', delay: 800 }
          ];
          await addLines(familyAuthLines);
          setGameState('authentication');
        } else {
          const errorLines: TerminalLine[] = [
            { text: '', type: 'system', delay: 300 },
            { text: '⚠️  INVALID RESPONSE', type: 'error', delay: 600 },
            { text: 'Please type Y for YES or N for NO:', type: 'system', delay: 600 }
          ];
          await addLines(errorLines);
        }
        break;

      case 'tarver_groomsman_detection': {
        const tarverAnswer = input.toLowerCase().trim();
        if (tarverAnswer === 'y' || tarverAnswer === 'yes') {
          const groomsman = 'Kris Tarver';
          setUserName(groomsman);
          await initializeSession(groomsman);
          const authLines: TerminalLine[] = [
            ...terminalMessages.authentication.verifying,
            { text: `✓ IDENTITY CONFIRMED: ${groomsman.toUpperCase()}`, type: 'success', delay: 800 }
          ];
          if (needsVerification(groomsman)) {
            authLines.push({ text: '🔐 ADDITIONAL VERIFICATION REQUIRED', type: 'classified', delay: 800 });
            await addLines(authLines);
            setCurrentVerificationUser(groomsman);
            setVerificationAttempts(0);
            const verificationData = verificationQuestions[groomsman as keyof typeof verificationQuestions];
            const verificationLines = [
              ...terminalMessages.verificationStart,
              { text: verificationData.question, type: 'system' as const, delay: 800 },
              { text: '', type: 'system' as const, delay: 300 },
              { text: 'Enter your response:', type: 'system' as const, delay: 600 }
            ];
            await addLines(verificationLines);
            setGameState('verification');
            return;
          } else {
            authLines.push(...(terminalMessages.authentication.success.standard as TerminalLine[]));
            authLines.push({ text: terminalMessages.authentication.prompts.standard, type: 'system' as const, delay: 800 });
            await addLines(authLines);
            setGameState('authentication');
          }
        } else if (tarverAnswer === 'n' || tarverAnswer === 'no') {
          const familyName = 'Tarver';
          setUserName(`${familyName} Family`);
          await initializeSession(`${familyName} Family`);
          const familyAuthLines: TerminalLine[] = [
            { text: '', type: 'system', delay: 500 },
            { text: `🏠 ${familyName.toUpperCase()} FAMILY DETECTED`, type: 'classified', delay: 800 },
            { text: '', type: 'system', delay: 500 },
            { text: `🏠 WELCOME, ${familyName.toUpperCase()} FAMILY MEMBER`, type: 'classified', delay: 800 },
            { text: '🏠 FAMILY CLEARANCE LEVEL: GRANTED', type: 'success', delay: 800 },
            { text: '🏠 FAMILY PRIVILEGES: FAMILY AND FRIENDS BRIEFING ACCESS', type: 'success', delay: 600 },
            { text: '🏠 FAMILY STATUS: CONFIRMED', type: 'success', delay: 600 },
            { text: '', type: 'system', delay: 500 },
            { text: `🏠 Welcome to the ${familyName} family and friends briefing!`, type: 'classified', delay: 1000 },
            { text: '', type: 'system', delay: 500 },
            { text: 'Press ENTER to receive your family and friends briefing...', type: 'system', delay: 800 }
          ];
          await addLines(familyAuthLines);
          setGameState('authentication');
        } else {
          await addLines(terminalMessages.errors.invalidBiometric as TerminalLine[]);
        }
      }
      break;

      case 'holland_groomsman_detection': {
        const hollandAnswer = input.toLowerCase().trim();
        if (hollandAnswer === 'y' || hollandAnswer === 'yes') {
          const groomsman = 'Tel Holland';
          setUserName(groomsman);
          await initializeSession(groomsman);
          const authLines: TerminalLine[] = [
            ...terminalMessages.authentication.verifying,
            { text: `✓ IDENTITY CONFIRMED: ${groomsman.toUpperCase()}`, type: 'success', delay: 800 }
          ];
          if (needsVerification(groomsman)) {
            authLines.push({ text: '🔐 ADDITIONAL VERIFICATION REQUIRED', type: 'classified', delay: 800 });
            await addLines(authLines);
            setCurrentVerificationUser(groomsman);
            setVerificationAttempts(0);
            const verificationData = verificationQuestions[groomsman as keyof typeof verificationQuestions];
            const verificationLines = [
              ...terminalMessages.verificationStart,
              { text: verificationData.question, type: 'system' as const, delay: 800 },
              { text: '', type: 'system' as const, delay: 300 },
              { text: 'Enter your response:', type: 'system' as const, delay: 600 }
            ];
            await addLines(verificationLines);
            setGameState('verification');
            return;
          } else {
            authLines.push(...(terminalMessages.authentication.success.standard as TerminalLine[]));
            authLines.push({ text: terminalMessages.authentication.prompts.standard, type: 'system' as const, delay: 800 });
            await addLines(authLines);
            setGameState('authentication');
          }
        } else if (hollandAnswer === 'n' || hollandAnswer === 'no') {
          const familyName = 'Holland';
          setUserName(`${familyName} Family`);
          await initializeSession(`${familyName} Family`);
          const familyAuthLines: TerminalLine[] = [
            { text: '', type: 'system', delay: 500 },
            { text: `🏠 ${familyName.toUpperCase()} FAMILY DETECTED`, type: 'classified', delay: 800 },
            { text: '', type: 'system', delay: 500 },
            { text: `🏠 WELCOME, ${familyName.toUpperCase()} FAMILY MEMBER`, type: 'classified', delay: 800 },
            { text: '🏠 FAMILY CLEARANCE LEVEL: GRANTED', type: 'success', delay: 800 },
            { text: '🏠 FAMILY PRIVILEGES: FAMILY AND FRIENDS BRIEFING ACCESS', type: 'success', delay: 600 },
            { text: '🏠 FAMILY STATUS: CONFIRMED', type: 'success', delay: 600 },
            { text: '', type: 'system', delay: 500 },
            { text: `🏠 Welcome to the ${familyName} family and friends briefing!`, type: 'classified', delay: 1000 },
            { text: '', type: 'system', delay: 500 },
            { text: 'Press ENTER to receive your family and friends briefing...', type: 'system', delay: 800 }
          ];
          await addLines(familyAuthLines);
          setGameState('authentication');
        } else {
          await addLines(terminalMessages.errors.invalidBiometric as TerminalLine[]);
        }
      }
      break;

      case 'williard_groomsman_detection': {
        const williardAnswer = input.toLowerCase().trim();
        if (williardAnswer === 'y' || williardAnswer === 'yes') {
          const groomsman = 'Mark Williard';
          setUserName(groomsman);
          await initializeSession(groomsman);
          const authLines: TerminalLine[] = [
            ...terminalMessages.authentication.verifying,
            { text: `✓ IDENTITY CONFIRMED: ${groomsman.toUpperCase()}`, type: 'success', delay: 800 }
          ];
          if (needsVerification(groomsman)) {
            authLines.push({ text: '🔐 ADDITIONAL VERIFICATION REQUIRED', type: 'classified', delay: 800 });
            await addLines(authLines);
            setCurrentVerificationUser(groomsman);
            setVerificationAttempts(0);
            const verificationData = verificationQuestions[groomsman as keyof typeof verificationQuestions];
            const verificationLines = [
              ...terminalMessages.verificationStart,
              { text: verificationData.question, type: 'system' as const, delay: 800 },
              { text: '', type: 'system' as const, delay: 300 },
              { text: 'Enter your response:', type: 'system' as const, delay: 600 }
            ];
            await addLines(verificationLines);
            setGameState('verification');
            return;
          } else {
            authLines.push(...(terminalMessages.authentication.success.standard as TerminalLine[]));
            authLines.push({ text: terminalMessages.authentication.prompts.standard, type: 'system' as const, delay: 800 });
            await addLines(authLines);
            setGameState('authentication');
          }
        } else if (williardAnswer === 'n' || williardAnswer === 'no') {
          const familyName = 'Williard';
          setUserName(`${familyName} Family`);
          await initializeSession(`${familyName} Family`);
          const familyAuthLines: TerminalLine[] = [
            { text: '', type: 'system', delay: 500 },
            { text: `🏠 ${familyName.toUpperCase()} FAMILY DETECTED`, type: 'classified', delay: 800 },
            { text: '', type: 'system', delay: 500 },
            { text: `🏠 WELCOME, ${familyName.toUpperCase()} FAMILY MEMBER`, type: 'classified', delay: 800 },
            { text: '🏠 FAMILY CLEARANCE LEVEL: GRANTED', type: 'success', delay: 800 },
            { text: '🏠 FAMILY PRIVILEGES: FAMILY AND FRIENDS BRIEFING ACCESS', type: 'success', delay: 600 },
            { text: '🏠 FAMILY STATUS: CONFIRMED', type: 'success', delay: 600 },
            { text: '', type: 'system', delay: 500 },
            { text: `🏠 Welcome to the ${familyName} family and friends briefing!`, type: 'classified', delay: 1000 },
            { text: '', type: 'system', delay: 500 },
            { text: 'Press ENTER to receive your family and friends briefing...', type: 'system', delay: 800 }
          ];
          await addLines(familyAuthLines);
          setGameState('authentication');
        } else {
          await addLines(terminalMessages.errors.invalidBiometric as TerminalLine[]);
        }
      }
      break;

      case 'jones_groomsman_detection': {
        const jonesAnswer = input.toLowerCase().trim();
        if (jonesAnswer === 'y' || jonesAnswer === 'yes') {
          const groomsman = 'Levi Jones';
          setUserName(groomsman);
          await initializeSession(groomsman);
          const authLines: TerminalLine[] = [
            ...terminalMessages.authentication.verifying,
            { text: `✓ IDENTITY CONFIRMED: ${groomsman.toUpperCase()}`, type: 'success', delay: 800 }
          ];
          if (needsVerification(groomsman)) {
            authLines.push({ text: '🔐 ADDITIONAL VERIFICATION REQUIRED', type: 'classified', delay: 800 });
            await addLines(authLines);
            setCurrentVerificationUser(groomsman);
            setVerificationAttempts(0);
            const verificationData = verificationQuestions[groomsman as keyof typeof verificationQuestions];
            const verificationLines = [
              ...terminalMessages.verificationStart,
              { text: verificationData.question, type: 'system' as const, delay: 800 },
              { text: '', type: 'system' as const, delay: 300 },
              { text: 'Enter your response:', type: 'system' as const, delay: 600 }
            ];
            await addLines(verificationLines);
            setGameState('verification');
            return;
          } else {
            authLines.push(...(terminalMessages.authentication.success.standard as TerminalLine[]));
            authLines.push({ text: terminalMessages.authentication.prompts.standard, type: 'system' as const, delay: 800 });
            await addLines(authLines);
            setGameState('authentication');
          }
        } else if (jonesAnswer === 'n' || jonesAnswer === 'no') {
          const familyName = 'Jones';
          setUserName(`${familyName} Family`);
          await initializeSession(`${familyName} Family`);
          const familyAuthLines: TerminalLine[] = [
            { text: '', type: 'system', delay: 500 },
            { text: `🏠 ${familyName.toUpperCase()} FAMILY DETECTED`, type: 'classified', delay: 800 },
            { text: '', type: 'system', delay: 500 },
            { text: `🏠 WELCOME, ${familyName.toUpperCase()} FAMILY MEMBER`, type: 'classified', delay: 800 },
            { text: '🏠 FAMILY CLEARANCE LEVEL: GRANTED', type: 'success', delay: 800 },
            { text: '🏠 FAMILY PRIVILEGES: FAMILY AND FRIENDS BRIEFING ACCESS', type: 'success', delay: 600 },
            { text: '🏠 FAMILY STATUS: CONFIRMED', type: 'success', delay: 600 },
            { text: '', type: 'system', delay: 500 },
            { text: `🏠 Welcome to the ${familyName} family and friends briefing!`, type: 'classified', delay: 1000 },
            { text: '', type: 'system', delay: 500 },
            { text: 'Press ENTER to receive your family and friends briefing...', type: 'system', delay: 800 }
          ];
          await addLines(familyAuthLines);
          setGameState('authentication');
        } else {
          await addLines(terminalMessages.errors.invalidBiometric as TerminalLine[]);
        }
      }
      break;

      case 'best_man_authentication':
        const bestManAnswer = input.toLowerCase().trim();
        
        if (bestManAnswer === specialPersons.bestMan.securityAnswer.toLowerCase()) {
          const bestManConfirmLines = [
            ...terminalMessages.bestManConfirmation,
            { text: specialPersons.bestMan.titles.clearance, type: 'success' as const, delay: 800 },
            { text: specialPersons.bestMan.titles.privileges, type: 'success' as const, delay: 600 },
            { text: specialPersons.bestMan.titles.status, type: 'success' as const, delay: 600 },
            { text: '', type: 'system' as const, delay: 800 },
            { text: specialPersons.bestMan.titles.welcome, type: 'classified' as const, delay: 1000 },
            { text: '🎖️ You have ultimate clearance to the wedding planning terminal', type: 'classified' as const, delay: 800 },
            { text: '', type: 'system' as const, delay: 500 },
            { text: terminalMessages.authentication.prompts.bestMan, type: 'system' as const, delay: 800 }
          ];
          
          await addLines(bestManConfirmLines);
          setGameState('authentication');
        } else {
          await addLines(terminalMessages.errors.invalidBestManResponse as TerminalLine[]);
        }
        break;

      case 'swann_disambiguation':
        const answer = input.toLowerCase().trim();
        
        if (answer === 'y' || answer === 'yes') {
          // Only Beau answers yes - go to Beau verification
          const identifiedSwann = specialPersons.swannFamily.firstAnswers.yes;
          setUserName(identifiedSwann);
          
          const beauVerificationLines = [
            ...terminalMessages.swannConfirmation,
            { text: `✓ IDENTITY CONFIRMED: ${identifiedSwann.toUpperCase()}`, type: 'success' as const, delay: 800 },
            { text: '', type: 'system' as const, delay: 500 },
            { text: '🔐 ADDITIONAL VERIFICATION REQUIRED FOR BEAU SWANN', type: 'classified' as const, delay: 800 },
            { text: '', type: 'system' as const, delay: 500 },
            { text: specialPersons.swannFamily.beauVerificationQuestion, type: 'system' as const, delay: 800 },
            { text: '', type: 'system' as const, delay: 300 },
            { text: 'Enter your response:', type: 'system' as const, delay: 600 }
          ];

          await addLines(beauVerificationLines);
          setGameState('beau_verification');
        } else if (answer === 'n' || answer === 'no') {
          // Both Brad and Jordan answer no, need second question
          const secondQuestionLines = [
            ...terminalMessages.swannSecondQuestion,
            { text: specialPersons.swannFamily.secondQuestion, type: 'system' as const, delay: 800 }
          ];
          
          await addLines(secondQuestionLines);
          setGameState('swann_second_question');
        } else {
          await addLines(terminalMessages.errors.invalidBiometric as TerminalLine[]);
        }
        break;

      case 'beau_verification':
        const beauAnswer = input.toLowerCase().trim();
        
        if (specialPersons.swannFamily.beauVerificationAnswers.includes(beauAnswer)) {
          // Correct answer - proceed to authentication
          const beauAuthLines = [
            { text: '✅ VERIFICATION SUCCESSFUL', type: 'success' as const, delay: 800 },
            { text: '', type: 'system' as const, delay: 500 },
            { text: '🔐 ALL VERIFICATION PROTOCOLS COMPLETE', type: 'classified' as const, delay: 800 },
            { text: '', type: 'system' as const, delay: 500 },
            ...terminalMessages.authentication.success.standard,
            { text: '', type: 'system' as const, delay: 800 },
            { text: `WELCOME, AGENT ${userName.toUpperCase()}`, type: 'classified' as const, delay: 1000 },
            { text: '', type: 'system' as const, delay: 500 },
            { text: terminalMessages.authentication.prompts.standard, type: 'system' as const, delay: 800 }
          ];

          await addLines(beauAuthLines);
          setGameState('authentication');
        } else {
          // Incorrect answer
          await addLines(terminalMessages.errors.invalidBeauVerification as TerminalLine[]);
        }
        break;

      case 'reese_groom_question': {
        const reeseAns = input.toLowerCase().trim();
        if (reeseAns === 'y' || reeseAns === 'yes') {
          const groomName = 'Pearson Reese';
          setUserName(groomName);
          await initializeSession(groomName);

          const groomData = easterEggs.pearsonReese;
          const groomAuthLines: TerminalLine[] = [
            ...terminalMessages.authentication.verifying,
            { text: groomData.detection, type: 'classified', delay: 1000 },
            { text: groomData.clearance, type: 'success', delay: 800 },
            { text: groomData.privileges, type: 'success', delay: 600 },
            { text: groomData.status, type: 'success', delay: 600 },
            { text: '', type: 'system', delay: 800 },
            { text: groomData.welcome, type: 'classified', delay: 1000 },
            { text: '', type: 'system', delay: 500 },
            { text: 'Press ENTER to receive your special groom mission briefing...', type: 'system', delay: 800 }
          ];

          await addLines(groomAuthLines);
          setGameState('authentication');
        } else if (reeseAns === 'n' || reeseAns === 'no') {
          const familyName = 'Reese';
          setUserName(`${familyName} Family`);
          await initializeSession(`${familyName} Family`);

          const familyAuthLines: TerminalLine[] = [
            { text: '', type: 'system', delay: 500 },
            { text: `🏠 ${familyName.toUpperCase()} FAMILY DETECTED`, type: 'classified', delay: 800 },
            { text: '', type: 'system', delay: 500 },
            { text: `🏠 WELCOME, ${familyName.toUpperCase()} FAMILY MEMBER`, type: 'classified', delay: 800 },
            { text: '🏠 FAMILY CLEARANCE LEVEL: GRANTED', type: 'success', delay: 800 },
            { text: '🏠 FAMILY PRIVILEGES: FAMILY AND FRIENDS BRIEFING ACCESS', type: 'success', delay: 600 },
            { text: '🏠 FAMILY STATUS: CONFIRMED', type: 'success', delay: 600 },
            { text: '', type: 'system', delay: 500 },
            { text: `🏠 Welcome to the ${familyName} family and friends briefing!`, type: 'classified', delay: 1000 },
            { text: '', type: 'system', delay: 500 },
            { text: 'Press ENTER to receive your family and friends briefing...', type: 'system', delay: 800 }
          ];

          await addLines(familyAuthLines);
          setGameState('authentication');
        } else {
          await addLines(terminalMessages.errors.invalidBiometric as TerminalLine[]);
        }
        break; }

      case 'swann_second_question':
        const secondAnswer = input.toLowerCase().trim();
        let identifiedSwann = '';
        
        if (secondAnswer === 'y' || secondAnswer === 'yes') {
          identifiedSwann = specialPersons.swannFamily.secondAnswers.yes; // Jordan (blood sister)
        } else if (secondAnswer === 'n' || secondAnswer === 'no') {
          identifiedSwann = specialPersons.swannFamily.secondAnswers.no; // Brad (brother-in-law, Best Man)
        } else {
          await addLines(terminalMessages.errors.invalidBiometric as TerminalLine[]);
          break;
        }
        
        setUserName(identifiedSwann);
        
        const swannAuthLines = [
          ...terminalMessages.swannConfirmation,
          { text: `✓ IDENTITY CONFIRMED: ${identifiedSwann.toUpperCase()}`, type: 'success' as const, delay: 800 },
          ...terminalMessages.authentication.success.standard,
          { text: '', type: 'system' as const, delay: 800 },
          { text: `WELCOME, AGENT ${identifiedSwann.toUpperCase()}`, type: 'classified' as const, delay: 1000 },
          { text: '', type: 'system' as const, delay: 500 }
        ];

        // Check if Brad (Best Man) needs additional verification
        if (identifiedSwann.toLowerCase() === specialPersons.bestMan.name.toLowerCase()) {
          swannAuthLines.push(
            { text: '🎖️ You have ultimate clearance but require additional verification', type: 'classified' as const, delay: 800 },
            { text: '', type: 'system' as const, delay: 500 }
          );
          
          await addLines(swannAuthLines);
          
          // Start Best Man authentication
          const bestManAuthLines = [
            ...terminalMessages.bestManAuthentication
          ];
          
          await addLines(bestManAuthLines);
          setGameState('best_man_authentication');
          return;
        }
        // Check if this user needs verification (but skip Jordan Swann - she's family)
        else if (needsVerification(identifiedSwann) && identifiedSwann !== "Jordan Swann") {
          swannAuthLines.push(
            { text: '🔐 ADDITIONAL VERIFICATION REQUIRED', type: 'classified', delay: 800 }
          );
          
          await addLines(swannAuthLines);
          
          // Start verification process
          setCurrentVerificationUser(identifiedSwann);
          setVerificationAttempts(0);
          
          const verificationData = verificationQuestions[identifiedSwann as keyof typeof verificationQuestions];
          const verificationLines = [
            ...terminalMessages.verificationStart,
            { text: verificationData.question, type: 'system' as const, delay: 800 },
            { text: '', type: 'system' as const, delay: 300 },
            { text: 'Enter your response:', type: 'system' as const, delay: 600 }
          ];
          
          await addLines(verificationLines);
          setGameState('verification');
          return;
        } else {
          // Check if this is Jordan Swann for easter egg flow
          if (identifiedSwann.toLowerCase() === 'jordan swann') {
            // Jordan Swann easter egg flow - show special messages but continue to authentication
            const jordanSwannAuthLines: TerminalLine[] = [
              ...terminalMessages.swannConfirmation,
              { text: `✓ IDENTITY CONFIRMED: ${identifiedSwann.toUpperCase()}`, type: 'success' as const, delay: 800 },
              { text: easterEggs.jordanSwann.detection, type: 'classified' as const, delay: 1000 },
              { text: easterEggs.jordanSwann.clearance, type: 'success' as const, delay: 800 },
              { text: easterEggs.jordanSwann.privileges, type: 'success' as const, delay: 600 },
              { text: easterEggs.jordanSwann.status, type: 'success' as const, delay: 600 },
              { text: '', type: 'system' as const, delay: 800 },
              { text: easterEggs.jordanSwann.welcome, type: 'classified' as const, delay: 1000 },
              { text: '', type: 'system' as const, delay: 500 },
              { text: 'Press ENTER to receive your special mission briefing...', type: 'system' as const, delay: 800 }
            ];
            
            // Log Jordan Swann easter egg activation
            await apiService.logEasterEgg('jordanSwann', { userName: identifiedSwann });
            
            await addLines(jordanSwannAuthLines);
            setGameState('authentication');
            return;
          } else {
            swannAuthLines.push(
              { text: terminalMessages.authentication.prompts.standard, type: 'system', delay: 800 }
            );
          }
        }

        await addLines(swannAuthLines);
        setGameState('authentication');
        break;

      case 'verification':
        const verificationAnswer = input.trim();
        const verificationData = verificationQuestions[currentVerificationUser as keyof typeof verificationQuestions];
        
        if (isCorrectVerificationAnswer(verificationAnswer, verificationData.correctAnswers)) {
          // Correct answer - proceed to authentication
          const successLines = [
            ...terminalMessages.verificationSuccess,
            { text: `✓ IDENTITY CONFIRMED: ${currentVerificationUser.toUpperCase()}`, type: 'success' as const, delay: 800 },
            { text: '', type: 'system' as const, delay: 500 },
            { text: terminalMessages.authentication.prompts.standard, type: 'system' as const, delay: 800 }
          ];
          
          await addLines(successLines);
          setGameState('authentication');
        } else {
          // Incorrect answer
          const currentAttempts = verificationAttempts + 1;
          setVerificationAttempts(currentAttempts);
          
          // Log verification failure
          await apiService.logEvent('verification_failure', {
            userName: currentVerificationUser,
            attemptNumber: currentAttempts,
            maxAttempts: verificationData.maxAttempts,
            question: verificationData.question
          });
          
          if (currentAttempts >= verificationData.maxAttempts) {
            // Max attempts exceeded - lockout
            await apiService.logEvent('verification_lockout', {
              userName: currentVerificationUser,
              totalAttempts: currentAttempts,
              maxAttempts: verificationData.maxAttempts,
              reason: 'max_verification_attempts_exceeded'
            });
            
            await addLines(terminalMessages.verificationLockout);
            setGameState('completed');
          } else {
            // Show error and retry
            const remainingAttempts = verificationData.maxAttempts - currentAttempts;
            const failureLines = [
              ...terminalMessages.verificationFailure,
              { text: `Attempts remaining: ${remainingAttempts}`, type: 'error' as const, delay: 600 },
              { text: '', type: 'system' as const, delay: 300 },
              { text: verificationData.question, type: 'system' as const, delay: 800 },
              { text: '', type: 'system' as const, delay: 300 },
              { text: 'Enter your response:', type: 'system' as const, delay: 600 }
            ];
            
            await addLines(failureLines);
          }
        }
        break;

      case 'authentication':
        // This case is handled by the empty input authentication flow above
        // Users press ENTER with empty input to trigger the mission briefing
        break;

      case 'mission_choice':
        const choice = input.toLowerCase().trim();
        
        // Check if user is a family member (not Howard Family)
        const isOtherFamily = userName.toLowerCase().includes(' family') && userName.toLowerCase() !== 'howard family';
        
        // Special responses for easter egg flows first
        if (userName.toLowerCase() === 'tom cruise') {
          if (choice === 'y' || choice === 'yes') {
            // Log mission acceptance
            await apiService.logEvent('mission_accepted', { userName });
                                await addLines(easterEggs.tomCruise.responses.accept as TerminalLine[]);
                    setGameState('groom_advice');
            break;
          } else if (choice === 'n' || choice === 'no') {
            // Log mission decline
            await apiService.logEvent('mission_declined', { userName });
            await addLines(easterEggs.tomCruise.responses.decline as TerminalLine[]);
            break;
          } else {
            const errorLines = [
              { text: '', type: 'system' as const, delay: 300 },
              { text: '⚠️  INVALID TOM CRUISE RESPONSE', type: 'error' as const, delay: 600 },
              { text: 'Please type Y for YES or N for NO:', type: 'system' as const, delay: 600 }
            ];

            await addLines(errorLines);
            break;
          }
        }
        
        if (userName.toLowerCase() === 'ethan hunt') {
          if (choice === 'y' || choice === 'yes') {
            // Log mission acceptance
            await apiService.logEvent('mission_accepted', { userName });
                                await addLines(easterEggs.ethanHunt.responses.accept as TerminalLine[]);
                    setGameState('groom_advice');
            break;
          } else if (choice === 'n' || choice === 'no') {
            // Log mission decline
            await apiService.logEvent('mission_declined', { userName });
            await addLines(easterEggs.ethanHunt.responses.decline as TerminalLine[]);
            break;
          } else {
            const errorLines = [
              { text: '', type: 'system' as const, delay: 300 },
              { text: '⚠️  INVALID ETHAN HUNT RESPONSE', type: 'error' as const, delay: 600 },
              { text: 'Please type Y for YES or N for NO:', type: 'system' as const, delay: 600 }
            ];

            await addLines(errorLines);
            break;
          }
        }
        
        if (userName.toLowerCase() === 'pearson reese') {
          if (choice === 'y' || choice === 'yes') {
            // Log mission acceptance
            await apiService.logEvent('mission_accepted', { userName });
                                await addLines(easterEggs.pearsonReese.responses.accept as TerminalLine[]);
                    setGameState('groom_advice');
            break;
          } else if (choice === 'n' || choice === 'no') {
            // Log mission decline
            await apiService.logEvent('mission_declined', { userName });
            await addLines(easterEggs.pearsonReese.responses.decline as TerminalLine[]);
            break;
          } else {
            const errorLines = [
              { text: '', type: 'system' as const, delay: 300 },
              { text: '⚠️  INVALID GROOM RESPONSE', type: 'error' as const, delay: 600 },
              { text: 'Please type Y for YES or N for NO:', type: 'system' as const, delay: 600 }
            ];

            await addLines(errorLines);
            break;
          }
        }
        
        if (userName.toLowerCase() === 'jordan swann') {
          if (choice === 'y' || choice === 'yes') {
            // Log mission acceptance
            await apiService.logEvent('mission_accepted', { userName });
                                await addLines(easterEggs.jordanSwann.responses.accept as TerminalLine[]);
                    setGameState('groom_advice');
            break;
          } else if (choice === 'n' || choice === 'no') {
            // Log mission decline
            await apiService.logEvent('mission_declined', { userName });
            await addLines(easterEggs.jordanSwann.responses.decline as TerminalLine[]);
            break;
          } else {
            const errorLines = [
              { text: '', type: 'system' as const, delay: 300 },
              { text: '⚠️  INVALID SISTER-IN-LAW RESPONSE', type: 'error' as const, delay: 600 },
              { text: 'Please type Y for YES or N for NO:', type: 'system' as const, delay: 600 }
            ];

            await addLines(errorLines);
            break;
          }
        }
        
        // Special responses for Emma (the bride!)
        if (userName.toLowerCase() === specialPersons.bride.name.toLowerCase()) {
          if (choice === 'y' || choice === 'yes') {
            // Log mission acceptance
            await apiService.logEvent('mission_accepted', { userName });
                                await addLines(brideContent.responses.accept as TerminalLine[]);
                    setGameState('groom_advice');
            break;
          } else if (choice === 'n' || choice === 'no') {
            // Log mission decline
            await apiService.logEvent('mission_declined', { userName });
            await addLines(brideContent.responses.decline as TerminalLine[]);
            break;
          } else {
            const errorLines = [
              { text: '', type: 'system' as const, delay: 300 },
              { text: '⚠️  INVALID BRIDE RESPONSE', type: 'error' as const, delay: 600 },
              { text: 'Please type Y for YES or N for NO:', type: 'system' as const, delay: 600 }
            ];

            await addLines(errorLines);
            break;
          }
        }
        
        // Special responses for Best Man
        if (userName.toLowerCase() === specialPersons.bestMan.name.toLowerCase()) {
          if (choice === 'y' || choice === 'yes') {
            // Log mission acceptance
            await apiService.logEvent('mission_accepted', { userName });
                                await addLines(bestManContent.responses.accept as TerminalLine[]);
            setGameState('groom_advice');
                    return;
          } else if (choice === 'n' || choice === 'no') {
            // Log mission decline
            await apiService.logEvent('mission_declined', { userName });
            await addLines(bestManContent.responses.decline as TerminalLine[]);
            return;
          } else {
            const errorLines = [
              { text: '', type: 'system' as const, delay: 300 },
              { text: '⚠️  INVALID BEST MAN RESPONSE', type: 'error' as const, delay: 600 },
              { text: 'Please type Y for YES or N for NO:', type: 'system' as const, delay: 600 }
            ];

            await addLines(errorLines);
            break;
          }
        }
        
        // Special responses for Howard Family
        if (userName.toLowerCase() === 'howard family') {
          if (choice === 'y' || choice === 'yes') {
            // Log mission acceptance
            await apiService.logEvent('mission_accepted', { userName });
            
            const howardFamilyAcceptLines: TerminalLine[] = [
              { text: '', type: 'system' as const, delay: 500 },
              { text: '🏠 FAMILY MISSION ACCEPTED 🏠', type: 'success' as const, delay: 800 },
              { text: '', type: 'system' as const, delay: 500 },
              { text: '🏠 EXCELLENT! Your commitment to the bride and groom has been confirmed.', type: 'success' as const, delay: 800 },
              { text: '🏠 Standby for family coordination and support duties...', type: 'success' as const, delay: 800 },
              { text: '🏠 Welcome to the most important family mission ever!', type: 'success' as const, delay: 800 },
              { text: '🏠 You\'re going to be the best family member ever!', type: 'success' as const, delay: 800 },
              { text: '🏠 Remember: What happens in the family, stays in the family forever.', type: 'success' as const, delay: 800 },
              { text: '', type: 'system' as const, delay: 1000 },
              { text: '🏠 Save this date in your calendar immediately!', type: 'classified' as const, delay: 800 },
              { text: '🏠 Family meetings and support planning to follow.', type: 'classified' as const, delay: 800 },
              { text: '', type: 'system' as const, delay: 800 },
              { text: '✨ Family mission briefing complete. This terminal will self-destruct in...', type: 'system' as const, delay: 1000 },
              { text: 'Just kidding! Welcome to the most important family mission ever! 🏠', type: 'success' as const, delay: 1500 }
            ];
            
            await addLines(howardFamilyAcceptLines);
            setGameState('groom_advice');
            break;
          } else if (choice === 'n' || choice === 'no') {
            // Log mission decline
            await apiService.logEvent('mission_declined', { userName });
            
            const howardFamilyDeclineLines: TerminalLine[] = [
              { text: '', type: 'system' as const, delay: 500 },
              { text: '💔 FAMILY MISSION DECLINED', type: 'error' as const, delay: 800 },
              { text: '', type: 'system' as const, delay: 500 },
              { text: '🏠 This is... unexpected. Please reconsider, Family Member.', type: 'error' as const, delay: 800 },
              { text: '🏠 Your family mission requires your specific skill set.', type: 'error' as const, delay: 800 },
              { text: '🏠 Are you sure? The fate of family harmony depends on you.', type: 'error' as const, delay: 800 },
              { text: '🏠 We\'ll give you time to think about it. This mission is too important to refuse.', type: 'error' as const, delay: 800 },
              { text: '🏠 Your family love is more valuable than any mission. Consider it again.', type: 'error' as const, delay: 800 },
              { text: '', type: 'system' as const, delay: 1000 },
              { text: 'Type Y to reconsider, or N to confirm declination:', type: 'system' as const, delay: 800 }
            ];
            
            await addLines(howardFamilyDeclineLines);
            break;
          } else {
            const errorLines = [
              { text: '', type: 'system' as const, delay: 300 },
              { text: '⚠️  INVALID FAMILY RESPONSE', type: 'error' as const, delay: 600 },
              { text: 'Please type Y for YES or N for NO:', type: 'system' as const, delay: 600 }
            ];

            await addLines(errorLines);
            break;
          }
        }
        
        // Special responses for other family members
        if (isOtherFamily) {
          if (choice === 'y' || choice === 'yes') {
            // Log mission acceptance
            await apiService.logEvent('mission_accepted', { userName });
            
            const familyName = userName.replace(' Family', '');
            const familyAcceptLines: TerminalLine[] = [
              { text: '', type: 'system' as const, delay: 500 },
              { text: '🏠 FAMILY AND FRIENDS MISSION ACCEPTED 🏠', type: 'success' as const, delay: 800 },
              { text: '', type: 'system' as const, delay: 500 },
              { text: '🏠 EXCELLENT! Your commitment to the bride and groom has been confirmed.', type: 'success' as const, delay: 800 },
              { text: '🏠 Standby for coordination and support duties...', type: 'success' as const, delay: 800 },
              { text: '🏠 Welcome to the most important mission ever!', type: 'success' as const, delay: 800 },
              { text: `🏠 You're going to be the best ${familyName} family member ever!`, type: 'success' as const, delay: 800 },
              { text: '🏠 Remember: What happens in the family, stays in the family forever.', type: 'success' as const, delay: 800 },
              { text: '', type: 'system' as const, delay: 1000 },
              { text: '🏠 Save this date in your calendar immediately!', type: 'classified' as const, delay: 800 },
              { text: '🏠 Family and friends meetings and support planning to follow.', type: 'classified' as const, delay: 800 },
              { text: '', type: 'system' as const, delay: 800 },
              { text: '✨ Family and friends mission briefing complete. This terminal will self-destruct in...', type: 'system' as const, delay: 1000 },
              { text: 'Just kidding! Welcome to the most important family and friends mission ever! 🏠', type: 'success' as const, delay: 1500 }
            ];
            
            await addLines(familyAcceptLines);
            setGameState('groom_advice');
            break;
          } else if (choice === 'n' || choice === 'no') {
            // Log mission decline
            await apiService.logEvent('mission_declined', { userName });
            
            const familyName = userName.replace(' Family', '');
            const familyDeclineLines: TerminalLine[] = [
              { text: '', type: 'system' as const, delay: 500 },
              { text: '💔 FAMILY MISSION DECLINED', type: 'error' as const, delay: 800 },
              { text: '', type: 'system' as const, delay: 500 },
              { text: '🏠 This is... unexpected. Please reconsider.', type: 'error' as const, delay: 800 },
              { text: '🏠 Your family and friends mission requires your specific skill set.', type: 'error' as const, delay: 800 },
              { text: `🏠 Are you sure? The fate of wedding harmony depends on you.`, type: 'error' as const, delay: 800 },
              { text: '🏠 We\'ll give you time to think about it. This mission is too important to refuse.', type: 'error' as const, delay: 800 },
              { text: '🏠 Your family and friends love is more valuable than any mission. Consider it again.', type: 'error' as const, delay: 800 },
              { text: '', type: 'system' as const, delay: 1000 },
              { text: 'Type Y to reconsider, or N to confirm declination:', type: 'system' as const, delay: 800 }
            ];
            
            await addLines(familyDeclineLines);
            break;
          } else {
            const errorLines = [
              { text: '', type: 'system' as const, delay: 300 },
              { text: '⚠️  INVALID FAMILY RESPONSE', type: 'error' as const, delay: 600 },
              { text: 'Please type Y for YES or N for NO:', type: 'system' as const, delay: 600 }
            ];

            await addLines(errorLines);
            break;
          }
        }
        
        if (choice === 'y' || choice === 'yes') {
          // Log mission acceptance
          await apiService.logEvent('mission_accepted', { userName });
          
          const acceptLines: TerminalLine[] = [
            { text: '', type: 'system', delay: 500 },
            { text: '🎯 MISSION ACCEPTED 🎯', type: 'success', delay: 800 },
            { text: '', type: 'system', delay: 500 }
          ];

          responses.accept.forEach(response => {
            acceptLines.push({ text: response, type: 'success', delay: 800 });
          });

          acceptLines.push(...(responses.acceptComplete as TerminalLine[]));

          await addLines(acceptLines);
          
          // Show email collection prompt
          await addLines(contactInfoData.email.prompt);
          setGameState('email_collection');
        } else if (choice === 'n' || choice === 'no') {
          // Log mission decline
          await apiService.logEvent('mission_declined', { userName });
          
          const declineLines: TerminalLine[] = [
            { text: '', type: 'system', delay: 500 },
            { text: '❌ MISSION DECLINED', type: 'error', delay: 800 },
            { text: '', type: 'system', delay: 500 }
          ];

          responses.decline.forEach(response => {
            declineLines.push({ text: response, type: 'error', delay: 800 });
          });

          declineLines.push(...(responses.declinePrompt as TerminalLine[]));

          await addLines(declineLines);
        } else {
          // Log invalid response
          await apiService.logEvent('invalid_mission_response', { 
            userName, 
            response: choice 
          });
          
          await addLines(terminalMessages.errors.invalidResponse as TerminalLine[]);
        }
        break;

      case 'email_collection':
        const email = input.trim();
        
        if (email) {
          // Basic email validation
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (emailRegex.test(email)) {
            setUserEmail(email);
            
            // Submit email to backend
            const saveSuccess = await apiService.submitEmail(userName, email);
            
            // Log email collection
            await apiService.logEvent('email_collected', { 
              userName, 
              email,
              saveSuccess
            });
            
            await addLines(contactInfoData.email.submit);
            
            // Show address collection prompt
            await addLines(contactInfoData.address.prompt);
            setGameState('address_collection');
          } else {
            // Invalid email format
            await apiService.logEvent('invalid_email_format', { 
              userName, 
              email 
            });
            
            const errorLines = [
              { text: '', type: 'system' as const, delay: 300 },
              { text: '⚠️  INVALID EMAIL FORMAT', type: 'error' as const, delay: 600 },
              { text: 'Please enter a valid email address:', type: 'system' as const, delay: 600 }
            ];
            
            await addLines(errorLines);
          }
        } else {
          // User skipped email
          await apiService.logEvent('email_skipped', { userName });
          await addLines(contactInfoData.email.skip);
          
          // Show address collection prompt
          await addLines(contactInfoData.address.prompt);
          setGameState('address_collection');
        }
        break;

      case 'address_collection':
        const address = input.trim();
        
        if (address) {
          setUserAddress(address);
          
          // Submit address to backend
          const saveSuccess = await apiService.submitAddress(userName, address);
          
          // Log address collection
          await apiService.logEvent('address_collected', { 
            userName, 
            address,
            saveSuccess
          });
          
          await addLines(contactInfoData.address.submit);
          setGameState('groom_advice');
        } else {
          // User skipped address
          await apiService.logEvent('address_skipped', { userName });
          await addLines(contactInfoData.address.skip);
          setGameState('groom_advice');
        }
        break;

      case 'groom_advice':
        // Show the groom advice prompt if not already shown
        if (!lines.some(line => line.text.includes('FINAL MISSION DEBRIEFING'))) {
          await addLines(groomAdviceData.prompt);
        }
        
        // Handle the groom advice submission
        if (groomAdvice.trim()) {
          // User provided advice - Save to backend
          const saveSuccess = await apiService.submitGroomAdvice(userName, groomAdvice);
          
          // Log groom advice submission
          await apiService.logEvent('groom_advice_submitted', {
            userName,
            adviceLength: groomAdvice.length,
            saveSuccess
          });
          
          if (saveSuccess) {
            await addLines(groomAdviceData.submit);
            console.log(`✅ Groom advice saved from ${userName}`);
          } else {
            await addLines(groomAdviceData.submit); // Still show success to user
            console.log(`⚠️ Groom advice failed to save from ${userName}:`, groomAdvice);
          }
        } else {
          // User skipped - log skip event
          await apiService.logEvent('groom_advice_skipped', { userName });
          await addLines(groomAdviceData.skip);
        }
        
        // Update session as completed
        await apiService.updateSession('completed', true);
        await apiService.logMissionComplete(userName);
        
        // Log mission completion with additional details
        await apiService.logEvent('mission_completed', {
          userName,
          groomAdviceProvided: !!groomAdvice.trim(),
          adviceLength: groomAdvice.trim().length,
          emailProvided: !!userEmail.trim(),
          addressProvided: !!userAddress.trim(),
          gameState: 'completed'
        });
        
        setGameState('completed');
        break;
    }
  };

  const getLineClass = (type: TerminalLine['type']) => {
    switch (type) {
      case 'system':
        return 'text-green-400';
      case 'user':
        return 'text-blue-400';
      case 'error':
        return 'text-red-400';
      case 'success':
        return 'text-green-500';
      case 'classified':
        return 'text-yellow-400 font-bold';
      default:
        return 'text-green-400';
    }
  };

  // Helper function to render submit button with green arrow
  const renderSubmitButton = () => (
    <Button
      type="submit"
      className="ml-2 bg-green-500 hover:bg-green-600 text-black font-mono font-bold py-2 px-3 rounded border-2 border-green-400 shadow-lg flex-shrink-0"
      disabled={isTyping}
    >
      <svg 
        className="w-4 h-4" 
        fill="currentColor" 
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          fillRule="evenodd" 
          d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" 
          clipRule="evenodd" 
        />
      </svg>
    </Button>
  );

  return (
    <div className="terminal-app-container h-screen-safe w-screen bg-black p-2 sm:p-4 font-mono flex flex-col overflow-hidden">
      {/* Audio Manager - shows popup or controls */}
      {showAudioManager && (
        <AudioManager 
          audio={audio}
          showDialog={true}
          onAudioEnabled={() => {
            setShowAudioManager(false);
            startIntroSequence();
          }} 
        />
      )}
      
      <Card className="terminal-card flex-1 flex flex-col w-full max-w-none sm:max-w-4xl mx-auto bg-black border-green-500 border-2 shadow-2xl shadow-green-500/20 min-h-0">
        <div 
          ref={terminalRef}
          className="terminal-screen flex-1 overflow-y-auto p-3 sm:p-6 space-y-1 scrollbar-thin scrollbar-track-black scrollbar-thumb-green-500 text-sm sm:text-base min-h-0"
        >
          {lines.map((line, index) => (
            <div 
              key={index} 
              className={`terminal-line terminal-line-${line.type} ${getLineClass(line.type)} whitespace-pre-wrap leading-relaxed break-words`}
            >
              {renderLineContent(line.text)}
            </div>
          ))}
          
          {/* Input line */}
          {(gameState === 'name_input' || gameState === 'best_man_authentication') && !isTyping && (
            <form onSubmit={handleSubmit} className="terminal-input-form flex items-center mt-4 touch-manipulation">
              <span className="terminal-prompt text-green-400 mr-1 sm:mr-2 text-sm sm:text-base">&gt;</span>
              <span className={`terminal-cursor mr-1 ${showCursor ? 'opacity-100' : 'opacity-0'} text-green-400 text-sm sm:text-base`}>
                █
              </span>
              <Input
                ref={inputRef}
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                className="terminal-input flex-1 bg-transparent border-none text-green-400 focus:ring-0 focus:outline-none p-0 font-mono text-sm sm:text-base min-w-0"
                placeholder={gameState === 'name_input' ? 'Enter your last name...' : 'Type Y for YES or N for NO...'}
                autoFocus
                disabled={isTyping}
              />
              {renderSubmitButton()}
            </form>
          )}
          
          {/* Mobile CTA Buttons for Swann disambiguation */}
          {gameState === 'swann_disambiguation' && !isTyping && isMobile && (
            <div className="mobile-cta-container mt-4 space-y-3">
              <Button
                onClick={async () => {
                  const answer = 'y';
                  setCurrentInput('');
                  
                  // Log mobile CTA interaction
                  await apiService.logEvent('mobile_cta_used', {
                    action: 'swann_disambiguation_yes',
                    answer
                  });
                  
                  // Add user input to terminal
                  setLines(prev => [...prev, { text: `> ${answer}`, type: 'user' }]);
                  
                  // Only Beau answers yes - go to Beau verification
                  const identifiedSwann = specialPersons.swannFamily.firstAnswers.yes;
                  setUserName(identifiedSwann);
                  
                  // Initialize backend session for identified Swann
                  await initializeSession(identifiedSwann);
                  
                  const beauVerificationLines = [
                    ...terminalMessages.swannConfirmation,
                    { text: `✓ IDENTITY CONFIRMED: ${identifiedSwann.toUpperCase()}`, type: 'success' as const, delay: 800 },
                    { text: '', type: 'system' as const, delay: 500 },
                    { text: '🔐 ADDITIONAL VERIFICATION REQUIRED FOR BEAU SWANN', type: 'classified' as const, delay: 800 },
                    { text: '', type: 'system' as const, delay: 500 },
                    { text: specialPersons.swannFamily.beauVerificationQuestion, type: 'system' as const, delay: 800 },
                    { text: '', type: 'system' as const, delay: 300 },
                    { text: 'Enter your response:', type: 'system' as const, delay: 600 }
                  ];

                  await addLines(beauVerificationLines);
                  await updateGameState('beau_verification');
                }}
                className="w-full bg-green-500 hover:bg-green-600 text-black font-mono font-bold py-3 px-4 rounded border-2 border-green-400 shadow-lg"
                disabled={isTyping}
              >
                ✅ YES
              </Button>
              
              <Button
                onClick={async () => {
                  const answer = 'n';
                  setCurrentInput('');
                  
                  // Add user input to terminal
                  setLines(prev => [...prev, { text: `> ${answer}`, type: 'user' }]);
                  
                  // Both Brad and Jordan answer no, need second question
                  const secondQuestionLines = [
                    ...terminalMessages.swannSecondQuestion,
                    { text: specialPersons.swannFamily.secondQuestion, type: 'system' as const, delay: 800 }
                  ];
                  
                  await addLines(secondQuestionLines);
                  setGameState('swann_second_question');
                }}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-mono font-bold py-3 px-4 rounded border-2 border-blue-400 shadow-lg"
                disabled={isTyping}
              >
                ❌ NO
              </Button>
            </div>
          )}

          {/* Mobile CTA Buttons for Reese groom question */}
          {gameState === 'reese_groom_question' && !isTyping && isMobile && (
            <div className="mobile-cta-container mt-4 space-y-3">
              <Button
                onClick={async () => {
                  const answer = 'y';
                  setCurrentInput('');
                  setLines(prev => [...prev, { text: `> ${answer}`, type: 'user' }]);

                  const groomName = 'Pearson Reese';
                  setUserName(groomName);
                  await initializeSession(groomName);

                  const groomData = easterEggs.pearsonReese;
                  const groomAuthLines: TerminalLine[] = [
                    ...terminalMessages.authentication.verifying,
                    { text: groomData.detection, type: 'classified', delay: 1000 },
                    { text: groomData.clearance, type: 'success', delay: 800 },
                    { text: groomData.privileges, type: 'success', delay: 600 },
                    { text: groomData.status, type: 'success', delay: 600 },
                    { text: '', type: 'system', delay: 800 },
                    { text: groomData.welcome, type: 'classified', delay: 1000 },
                    { text: '', type: 'system', delay: 500 },
                    { text: 'Press ENTER to receive your special groom mission briefing...', type: 'system', delay: 800 }
                  ];

                  await addLines(groomAuthLines);
                  await updateGameState('authentication');
                }}
                className="w-full bg-green-500 hover:bg-green-600 text-black font-mono font-bold py-3 px-4 rounded border-2 border-green-400 shadow-lg"
                disabled={isTyping}
              >
                ✅ YES
              </Button>

              <Button
                onClick={async () => {
                  const answer = 'n';
                  setCurrentInput('');
                  setLines(prev => [...prev, { text: `> ${answer}`, type: 'user' }]);

                  const familyName = 'Reese';
                  setUserName(`${familyName} Family`);
                  await initializeSession(`${familyName} Family`);

                  const familyAuthLines: TerminalLine[] = [
                    { text: '', type: 'system', delay: 500 },
                    { text: `🏠 ${familyName.toUpperCase()} FAMILY DETECTED`, type: 'classified', delay: 800 },
                    { text: '', type: 'system', delay: 500 },
                    { text: `🏠 WELCOME, ${familyName.toUpperCase()} FAMILY MEMBER`, type: 'classified', delay: 800 },
                    { text: '🏠 FAMILY CLEARANCE LEVEL: GRANTED', type: 'success', delay: 800 },
                    { text: '🏠 FAMILY PRIVILEGES: FAMILY AND FRIENDS BRIEFING ACCESS', type: 'success', delay: 600 },
                    { text: '🏠 FAMILY STATUS: CONFIRMED', type: 'success', delay: 600 },
                    { text: '', type: 'system', delay: 500 },
                    { text: `🏠 Welcome to the ${familyName} family and friends briefing!`, type: 'classified', delay: 1000 },
                    { text: '', type: 'system', delay: 500 },
                    { text: 'Press ENTER to receive your family and friends briefing...', type: 'system', delay: 800 }
                  ];

                  await addLines(familyAuthLines);
                  setGameState('authentication');
                }}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-mono font-bold py-3 px-4 rounded border-2 border-blue-400 shadow-lg"
                disabled={isTyping}
              >
                ❌ NO
              </Button>
            </div>
          )}

          {/* Mobile CTA Buttons for Swann second question */}
          {gameState === 'swann_second_question' && !isTyping && isMobile && (
            <div className="mobile-cta-container mt-4 space-y-3">
              <Button
                onClick={async () => {
                  const answer = 'y';
                  setCurrentInput('');
                  
                  // Add user input to terminal
                  setLines(prev => [...prev, { text: `> ${answer}`, type: 'user' }]);
                  
                  // Blood related = Jordan (blood sister)
                  const identifiedSwann = specialPersons.swannFamily.secondAnswers.yes;
                  setUserName(identifiedSwann);
                  
                  // Initialize backend session for identified Swann
                  await initializeSession(identifiedSwann);
                  
                  // Jordan Swann easter egg flow
                  const jordanSwannAuthLines: TerminalLine[] = [
                    ...terminalMessages.swannConfirmation,
                    { text: `✓ IDENTITY CONFIRMED: ${identifiedSwann.toUpperCase()}`, type: 'success' as const, delay: 800 },
                    { text: easterEggs.jordanSwann.detection, type: 'classified' as const, delay: 1000 },
                    { text: easterEggs.jordanSwann.clearance, type: 'success' as const, delay: 800 },
                    { text: easterEggs.jordanSwann.privileges, type: 'success' as const, delay: 600 },
                    { text: easterEggs.jordanSwann.status, type: 'success' as const, delay: 600 },
                    { text: '', type: 'system' as const, delay: 800 },
                    { text: easterEggs.jordanSwann.welcome, type: 'classified' as const, delay: 1000 },
                    { text: '', type: 'system' as const, delay: 500 },
                    { text: 'Press ENTER to receive your special mission briefing...', type: 'system' as const, delay: 800 }
                  ];

                  // Log Jordan Swann easter egg activation
                  await apiService.logEasterEgg('jordanSwann', { userName: identifiedSwann });

                  await addLines(jordanSwannAuthLines);
                  await updateGameState('authentication');
                }}
                className="w-full bg-green-500 hover:bg-green-600 text-black font-mono font-bold py-3 px-4 rounded border-2 border-green-400 shadow-lg"
                disabled={isTyping}
              >
                ✅ YES
              </Button>
              
              <Button
                onClick={async () => {
                  const answer = 'n';
                  setCurrentInput('');
                  
                  // Add user input to terminal
                  setLines(prev => [...prev, { text: `> ${answer}`, type: 'user' }]);
                  
                  // Not blood related = Brad (brother-in-law, Best Man)
                  const identifiedSwann = specialPersons.swannFamily.secondAnswers.no;
                  setUserName(identifiedSwann);
                  
                  // Initialize backend session for identified Swann
                  await initializeSession(identifiedSwann);
                  
                  const swannAuthLines = [
                    ...terminalMessages.swannConfirmation,
                    { text: `✓ IDENTITY CONFIRMED: ${identifiedSwann.toUpperCase()}`, type: 'success' as const, delay: 800 },
                    ...terminalMessages.authentication.success.standard,
                    { text: '', type: 'system' as const, delay: 800 },
                    { text: `WELCOME, AGENT ${identifiedSwann.toUpperCase()}`, type: 'classified' as const, delay: 1000 },
                    { text: '🎖️ You have ultimate clearance but require additional verification', type: 'classified' as const, delay: 800 },
                    { text: '', type: 'system' as const, delay: 500 }
                  ];
                  
                  await addLines(swannAuthLines);
                  
                  // Start Best Man authentication
                  const bestManAuthLines = [
                    ...terminalMessages.bestManAuthentication
                  ];
                  
                  await addLines(bestManAuthLines);
                  await updateGameState('best_man_authentication');
                }}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-mono font-bold py-3 px-4 rounded border-2 border-blue-400 shadow-lg"
                disabled={isTyping}
              >
                ❌ NO
              </Button>
            </div>
          )}


          
          {/* Mobile CTA Buttons for Howard bride detection */}
          {gameState === 'howard_bride_detection' && !isTyping && isMobile && (
            <div className="mobile-cta-container mt-4 space-y-3">
              <Button
                onClick={async () => {
                  const answer = 'y';
                  setCurrentInput('');
                  
                  // Add user input to terminal
                  setLines(prev => [...prev, { text: `> ${answer}`, type: 'user' }]);
                  
                  // Emma Howard - fiancée flow (answered yes to kissing)
                  setUserName('Emma Howard');
                  
                  // Initialize backend session for Emma
                  await initializeSession('Emma Howard');
                  
                  const emmaAuthLines: TerminalLine[] = [
                    { text: '', type: 'system', delay: 500 },
                    { text: specialPersons.bride.titles.detection, type: 'classified', delay: 1000 },
                    { text: '', type: 'system', delay: 500 },
                    { text: '💍 FIANCÉE CLEARANCE LEVEL: MAXIMUM', type: 'success', delay: 800 },
                    { text: '👰 FIANCÉE PRIVILEGES: UNLIMITED', type: 'success', delay: 600 },
                    { text: '💕 FIANCÉE STATUS: CONFIRMED', type: 'success', delay: 600 },
                    { text: '', type: 'system', delay: 800 },
                    { text: specialPersons.bride.titles.welcome, type: 'classified', delay: 1000 },
                    { text: '💍 You have special access to the wedding planning terminal', type: 'classified', delay: 800 },
                    { text: '', type: 'system', delay: 500 },
                    { text: terminalMessages.authentication.prompts.bride, type: 'system', delay: 800 }
                  ];
                  await addLines(emmaAuthLines);
                  await updateGameState('authentication');
                }}
                className="w-full bg-pink-500 hover:bg-pink-600 text-white font-mono font-bold py-3 px-4 rounded border-2 border-pink-400 shadow-lg"
                disabled={isTyping}
              >
                💕 YES
              </Button>
              
              <Button
                onClick={async () => {
                  const answer = 'n';
                  setCurrentInput('');
                  
                  // Add user input to terminal
                  setLines(prev => [...prev, { text: `> ${answer}`, type: 'user' }]);
                  
                  // Ask follow-up question about younger brother
                  const brotherQuestionLines: TerminalLine[] = [
                    { text: '', type: 'system', delay: 500 },
                    { text: 'Are you the fun (the bride might say annoying) younger brother?', type: 'system', delay: 800 },
                    { text: '', type: 'system', delay: 300 },
                    { text: 'Type Y for YES or N for NO:', type: 'system', delay: 600 }
                  ];
                  await addLines(brotherQuestionLines);
                  await updateGameState('howard_younger_brother_detection');
                }}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-mono font-bold py-3 px-4 rounded border-2 border-blue-400 shadow-lg"
                disabled={isTyping}
              >
                🛡️ NO
              </Button>
            </div>
          )}

          {/* Mobile CTA Buttons for Howard younger brother detection */}
          {gameState === 'howard_younger_brother_detection' && !isTyping && isMobile && (
            <div className="mobile-cta-container mt-4 space-y-3">
              <Button
                onClick={async () => {
                  const answer = 'y';
                  setCurrentInput('');
                  setLines(prev => [...prev, { text: `> ${answer}`, type: 'user' }]);
                  // Will Howard flow
                  setUserName('Will Howard');
                  await initializeSession('Will Howard');
                  const willAuthLines: TerminalLine[] = [
                    { text: '', type: 'system', delay: 500 },
                    { text: '✓ IDENTITY CONFIRMED: WILL HOWARD', type: 'success', delay: 800 },
                    { text: '🛡️  GROOMSMAN & BRIDE\'S BROTHER CLEARANCE GRANTED', type: 'success', delay: 800 },
                    { text: '', type: 'system', delay: 500 },
                    { text: 'Welcome, Will! You have special access as both groomsman and the bride\'s brother.', type: 'classified', delay: 1000 },
                    { text: '', type: 'system', delay: 500 },
                    { text: terminalMessages.authentication.prompts.standard, type: 'system', delay: 800 }
                  ];
                  await addLines(willAuthLines);
                  await updateGameState('authentication');
                }}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-mono font-bold py-3 px-4 rounded border-2 border-green-400 shadow-lg"
                disabled={isTyping}
              >
                ✅ YES
              </Button>

              <Button
                onClick={async () => {
                  const answer = 'n';
                  setCurrentInput('');
                  setLines(prev => [...prev, { text: `> ${answer}`, type: 'user' }]);
                  // Generic Howard family path
                  setUserName('Howard Family');
                  await initializeSession('Howard Family');
                  const familyAuthLines: TerminalLine[] = [
                    { text: '', type: 'system', delay: 500 },
                    { text: '✓ IDENTITY CONFIRMED: HOWARD FAMILY', type: 'success', delay: 800 },
                    { text: '👪 FAMILY CLEARANCE GRANTED', type: 'success', delay: 800 },
                    { text: '', type: 'system', delay: 500 },
                    { text: 'Welcome, Howard family member! You now have access to the family and friends briefing and invitation coordination portal.', type: 'classified', delay: 1000 },
                    { text: '', type: 'system', delay: 500 },
                    { text: 'Press ENTER to receive your family and friends briefing...', type: 'system', delay: 800 }
                  ];
                  await addLines(familyAuthLines);
                  await updateGameState('authentication');
                }}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-mono font-bold py-3 px-4 rounded border-2 border-blue-400 shadow-lg"
                disabled={isTyping}
              >
                👪 NO
              </Button>
            </div>
          )}

          {/* Mobile CTA Buttons for Tarver groomsman detection */}
          {gameState === 'tarver_groomsman_detection' && !isTyping && isMobile && (
            <div className="mobile-cta-container mt-4 space-y-3">
              <Button
                onClick={async () => {
                  const answer = 'y';
                  setCurrentInput('');
                  setLines(prev => [...prev, { text: `> ${answer}`, type: 'user' }]);

                  const groomsman = 'Kris Tarver';
                  setUserName(groomsman);
                  await initializeSession(groomsman);

                  const authLines: TerminalLine[] = [
                    ...terminalMessages.authentication.verifying,
                    { text: `✓ IDENTITY CONFIRMED: ${groomsman.toUpperCase()}`, type: 'success', delay: 800 }
                  ];

                  if (needsVerification(groomsman)) {
                    authLines.push({ text: '🔐 ADDITIONAL VERIFICATION REQUIRED', type: 'classified', delay: 800 });
                    await addLines(authLines);
                    setCurrentVerificationUser(groomsman);
                    setVerificationAttempts(0);

                    const verificationData = verificationQuestions[groomsman as keyof typeof verificationQuestions];
                    const verificationLines = [
                      ...terminalMessages.verificationStart,
                      { text: verificationData.question, type: 'system' as const, delay: 800 },
                      { text: '', type: 'system' as const, delay: 300 },
                      { text: 'Enter your response:', type: 'system' as const, delay: 600 }
                    ];
                    await addLines(verificationLines);
                    setGameState('verification');
                    return;
                  } else {
                    authLines.push(...(terminalMessages.authentication.success.standard as TerminalLine[]));
                    authLines.push({ text: terminalMessages.authentication.prompts.standard, type: 'system' as const, delay: 800 });
                    await addLines(authLines);
                    setGameState('authentication');
                  }
                }}
                className="w-full bg-green-500 hover:bg-green-600 text-black font-mono font-bold py-3 px-4 rounded border-2 border-green-400 shadow-lg"
                disabled={isTyping}
              >
                ✅ YES
              </Button>

              <Button
                onClick={async () => {
                  const answer = 'n';
                  setCurrentInput('');
                  setLines(prev => [...prev, { text: `> ${answer}`, type: 'user' }]);

                  const familyName = 'Tarver';
                  setUserName(`${familyName} Family`);
                  await initializeSession(`${familyName} Family`);

                  const familyAuthLines: TerminalLine[] = [
                    { text: '', type: 'system', delay: 500 },
                    { text: `🏠 ${familyName.toUpperCase()} FAMILY DETECTED`, type: 'classified', delay: 800 },
                    { text: '', type: 'system', delay: 500 },
                    { text: `🏠 WELCOME, ${familyName.toUpperCase()} FAMILY MEMBER`, type: 'classified', delay: 800 },
                    { text: '🏠 FAMILY CLEARANCE LEVEL: GRANTED', type: 'success', delay: 800 },
                    { text: '🏠 FAMILY PRIVILEGES: FAMILY AND FRIENDS BRIEFING ACCESS', type: 'success', delay: 600 },
                    { text: '🏠 FAMILY STATUS: CONFIRMED', type: 'success', delay: 600 },
                    { text: '', type: 'system', delay: 500 },
                    { text: `🏠 Welcome to the ${familyName} family and friends briefing!`, type: 'classified', delay: 1000 },
                    { text: '', type: 'system', delay: 500 },
                    { text: 'Press ENTER to receive your family and friends briefing...', type: 'system', delay: 800 }
                  ];

                  await addLines(familyAuthLines);
                  setGameState('authentication');
                }}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-mono font-bold py-3 px-4 rounded border-2 border-blue-400 shadow-lg"
                disabled={isTyping}
              >
                ❌ NO
              </Button>
            </div>
          )}

          {/* Mobile CTA Buttons for Holland groomsman detection */}
          {gameState === 'holland_groomsman_detection' && !isTyping && isMobile && (
            <div className="mobile-cta-container mt-4 space-y-3">
              <Button
                onClick={async () => {
                  const answer = 'y';
                  setCurrentInput('');
                  setLines(prev => [...prev, { text: `> ${answer}`, type: 'user' }]);

                  const groomsman = 'Tel Holland';
                  setUserName(groomsman);
                  await initializeSession(groomsman);

                  const authLines: TerminalLine[] = [
                    ...terminalMessages.authentication.verifying,
                    { text: `✓ IDENTITY CONFIRMED: ${groomsman.toUpperCase()}`, type: 'success', delay: 800 }
                  ];

                  if (needsVerification(groomsman)) {
                    authLines.push({ text: '🔐 ADDITIONAL VERIFICATION REQUIRED', type: 'classified', delay: 800 });
                    await addLines(authLines);
                    setCurrentVerificationUser(groomsman);
                    setVerificationAttempts(0);

                    const verificationData = verificationQuestions[groomsman as keyof typeof verificationQuestions];
                    const verificationLines = [
                      ...terminalMessages.verificationStart,
                      { text: verificationData.question, type: 'system' as const, delay: 800 },
                      { text: '', type: 'system' as const, delay: 300 },
                      { text: 'Enter your response:', type: 'system' as const, delay: 600 }
                    ];
                    await addLines(verificationLines);
                    setGameState('verification');
                    return;
                  } else {
                    authLines.push(...(terminalMessages.authentication.success.standard as TerminalLine[]));
                    authLines.push({ text: terminalMessages.authentication.prompts.standard, type: 'system' as const, delay: 800 });
                    await addLines(authLines);
                    setGameState('authentication');
                  }
                }}
                className="w-full bg-green-500 hover:bg-green-600 text-black font-mono font-bold py-3 px-4 rounded border-2 border-green-400 shadow-lg"
                disabled={isTyping}
              >
                ✅ YES
              </Button>
              <Button
                onClick={async () => {
                  const answer = 'n';
                  setCurrentInput('');
                  setLines(prev => [...prev, { text: `> ${answer}`, type: 'user' }]);

                  const familyName = 'Holland';
                  setUserName(`${familyName} Family`);
                  await initializeSession(`${familyName} Family`);

                  const familyAuthLines: TerminalLine[] = [
                    { text: '', type: 'system', delay: 500 },
                    { text: `🏠 ${familyName.toUpperCase()} FAMILY DETECTED`, type: 'classified', delay: 800 },
                    { text: '', type: 'system', delay: 500 },
                    { text: `🏠 WELCOME, ${familyName.toUpperCase()} FAMILY MEMBER`, type: 'classified', delay: 800 },
                    { text: '🏠 FAMILY CLEARANCE LEVEL: GRANTED', type: 'success', delay: 800 },
                    { text: '🏠 FAMILY PRIVILEGES: FAMILY AND FRIENDS BRIEFING ACCESS', type: 'success', delay: 600 },
                    { text: '🏠 FAMILY STATUS: CONFIRMED', type: 'success', delay: 600 },
                    { text: '', type: 'system', delay: 500 },
                    { text: `🏠 Welcome to the ${familyName} family and friends briefing!`, type: 'classified', delay: 1000 },
                    { text: '', type: 'system', delay: 500 },
                    { text: 'Press ENTER to receive your family and friends briefing...', type: 'system', delay: 800 }
                  ];

                  await addLines(familyAuthLines);
                  setGameState('authentication');
                }}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-mono font-bold py-3 px-4 rounded border-2 border-blue-400 shadow-lg"
                disabled={isTyping}
              >
                ❌ NO
              </Button>
            </div>
          )}

          {/* Mobile CTA Buttons for Williard groomsman detection */}
          {gameState === 'williard_groomsman_detection' && !isTyping && isMobile && (
            <div className="mobile-cta-container mt-4 space-y-3">
              <Button
                onClick={async () => {
                  const answer = 'y';
                  setCurrentInput('');
                  setLines(prev => [...prev, { text: `> ${answer}`, type: 'user' }]);

                  const groomsman = 'Mark Williard';
                  setUserName(groomsman);
                  await initializeSession(groomsman);

                  const authLines: TerminalLine[] = [
                    ...terminalMessages.authentication.verifying,
                    { text: `✓ IDENTITY CONFIRMED: ${groomsman.toUpperCase()}`, type: 'success', delay: 800 }
                  ];

                  if (needsVerification(groomsman)) {
                    authLines.push({ text: '🔐 ADDITIONAL VERIFICATION REQUIRED', type: 'classified', delay: 800 });
                    await addLines(authLines);
                    setCurrentVerificationUser(groomsman);
                    setVerificationAttempts(0);

                    const verificationData = verificationQuestions[groomsman as keyof typeof verificationQuestions];
                    const verificationLines = [
                      ...terminalMessages.verificationStart,
                      { text: verificationData.question, type: 'system' as const, delay: 800 },
                      { text: '', type: 'system' as const, delay: 300 },
                      { text: 'Enter your response:', type: 'system' as const, delay: 600 }
                    ];
                    await addLines(verificationLines);
                    setGameState('verification');
                    return;
                  } else {
                    authLines.push(...(terminalMessages.authentication.success.standard as TerminalLine[]));
                    authLines.push({ text: terminalMessages.authentication.prompts.standard, type: 'system' as const, delay: 800 });
                    await addLines(authLines);
                    setGameState('authentication');
                  }
                }}
                className="w-full bg-green-500 hover:bg-green-600 text-black font-mono font-bold py-3 px-4 rounded border-2 border-green-400 shadow-lg"
                disabled={isTyping}
              >
                ✅ YES
              </Button>
              <Button
                onClick={async () => {
                  const answer = 'n';
                  setCurrentInput('');
                  setLines(prev => [...prev, { text: `> ${answer}`, type: 'user' }]);

                  const familyName = 'Williard';
                  setUserName(`${familyName} Family`);
                  await initializeSession(`${familyName} Family`);

                  const familyAuthLines: TerminalLine[] = [
                    { text: '', type: 'system', delay: 500 },
                    { text: `🏠 ${familyName.toUpperCase()} FAMILY DETECTED`, type: 'classified', delay: 800 },
                    { text: '', type: 'system', delay: 500 },
                    { text: `🏠 WELCOME, ${familyName.toUpperCase()} FAMILY MEMBER`, type: 'classified', delay: 800 },
                    { text: '🏠 FAMILY CLEARANCE LEVEL: GRANTED', type: 'success', delay: 800 },
                    { text: '🏠 FAMILY PRIVILEGES: FAMILY AND FRIENDS BRIEFING ACCESS', type: 'success', delay: 600 },
                    { text: '🏠 FAMILY STATUS: CONFIRMED', type: 'success', delay: 600 },
                    { text: '', type: 'system', delay: 500 },
                    { text: `🏠 Welcome to the ${familyName} family and friends briefing!`, type: 'classified', delay: 1000 },
                    { text: '', type: 'system', delay: 500 },
                    { text: 'Press ENTER to receive your family and friends briefing...', type: 'system', delay: 800 }
                  ];

                  await addLines(familyAuthLines);
                  setGameState('authentication');
                }}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-mono font-bold py-3 px-4 rounded border-2 border-blue-400 shadow-lg"
                disabled={isTyping}
              >
                ❌ NO
              </Button>
            </div>
          )}

          {/* Mobile CTA Buttons for Jones groomsman detection */}
          {gameState === 'jones_groomsman_detection' && !isTyping && isMobile && (
            <div className="mobile-cta-container mt-4 space-y-3">
              <Button
                onClick={async () => {
                  const answer = 'y';
                  setCurrentInput('');
                  setLines(prev => [...prev, { text: `> ${answer}`, type: 'user' }]);

                  const groomsman = 'Levi Jones';
                  setUserName(groomsman);
                  await initializeSession(groomsman);

                  const authLines: TerminalLine[] = [
                    ...terminalMessages.authentication.verifying,
                    { text: `✓ IDENTITY CONFIRMED: ${groomsman.toUpperCase()}`, type: 'success', delay: 800 }
                  ];

                  if (needsVerification(groomsman)) {
                    authLines.push({ text: '🔐 ADDITIONAL VERIFICATION REQUIRED', type: 'classified', delay: 800 });
                    await addLines(authLines);
                    setCurrentVerificationUser(groomsman);
                    setVerificationAttempts(0);

                    const verificationData = verificationQuestions[groomsman as keyof typeof verificationQuestions];
                    const verificationLines = [
                      ...terminalMessages.verificationStart,
                      { text: verificationData.question, type: 'system' as const, delay: 800 },
                      { text: '', type: 'system' as const, delay: 300 },
                      { text: 'Enter your response:', type: 'system' as const, delay: 600 }
                    ];
                    await addLines(verificationLines);
                    setGameState('verification');
                    return;
                  } else {
                    authLines.push(...(terminalMessages.authentication.success.standard as TerminalLine[]));
                    authLines.push({ text: terminalMessages.authentication.prompts.standard, type: 'system' as const, delay: 800 });
                    await addLines(authLines);
                    setGameState('authentication');
                  }
                }}
                className="w-full bg-green-500 hover:bg-green-600 text-black font-mono font-bold py-3 px-4 rounded border-2 border-green-400 shadow-lg"
                disabled={isTyping}
              >
                ✅ YES
              </Button>
              <Button
                onClick={async () => {
                  const answer = 'n';
                  setCurrentInput('');
                  setLines(prev => [...prev, { text: `> ${answer}`, type: 'user' }]);

                  const familyName = 'Jones';
                  setUserName(`${familyName} Family`);
                  await initializeSession(`${familyName} Family`);

                  const familyAuthLines: TerminalLine[] = [
                    { text: '', type: 'system', delay: 500 },
                    { text: `🏠 ${familyName.toUpperCase()} FAMILY DETECTED`, type: 'classified', delay: 800 },
                    { text: '', type: 'system', delay: 500 },
                    { text: `🏠 WELCOME, ${familyName.toUpperCase()} FAMILY MEMBER`, type: 'classified', delay: 800 },
                    { text: '🏠 FAMILY CLEARANCE LEVEL: GRANTED', type: 'success', delay: 800 },
                    { text: '🏠 FAMILY PRIVILEGES: FAMILY AND FRIENDS BRIEFING ACCESS', type: 'success', delay: 600 },
                    { text: '🏠 FAMILY STATUS: CONFIRMED', type: 'success', delay: 600 },
                    { text: '', type: 'system', delay: 500 },
                    { text: `🏠 Welcome to the ${familyName} family and friends briefing!`, type: 'classified', delay: 1000 },
                    { text: '', type: 'system', delay: 500 },
                    { text: 'Press ENTER to receive your family and friends briefing...', type: 'system', delay: 800 }
                  ];

                  await addLines(familyAuthLines);
                  setGameState('authentication');
                }}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-mono font-bold py-3 px-4 rounded border-2 border-blue-400 shadow-lg"
                disabled={isTyping}
              >
                ❌ NO
              </Button>
            </div>
          )}

          {/* Desktop input for Howard younger brother detection */}
          {gameState === 'howard_younger_brother_detection' && !isTyping && !isMobile && (
            <form onSubmit={handleSubmit} className="terminal-input-form flex items-center mt-4 touch-manipulation">
              <span className="terminal-prompt text-green-400 mr-1 sm:mr-2 text-sm sm:text-base">&gt;</span>
              <span className={`terminal-cursor mr-1 ${showCursor ? 'opacity-100' : 'opacity-0'} text-green-400 text-sm sm:text-base`}>
                █
              </span>
              <Input
                ref={inputRef}
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                className="terminal-input flex-1 bg-transparent border-none text-green-400 focus:ring-0 focus:outline-none p-0 font-mono text-sm sm:text-base min-w-0"
                placeholder="Type Y for YES or N for NO..."
                autoFocus
                disabled={isTyping}
              />
              {renderSubmitButton()}
            </form>
          )}

          {/* Desktop input for Reese groom question */}
          {gameState === 'reese_groom_question' && !isTyping && !isMobile && (
            <form onSubmit={handleSubmit} className="terminal-input-form flex items-center mt-4 touch-manipulation">
              <span className="terminal-prompt text-green-400 mr-1 sm:mr-2 text-sm sm:text-base">&gt;</span>
              <span className={`terminal-cursor mr-1 ${showCursor ? 'opacity-100' : 'opacity-0'} text-green-400 text-sm sm:text-base`}>
                █
              </span>
              <Input
                ref={inputRef}
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                className="terminal-input flex-1 bg-transparent border-none text-green-400 focus:ring-0 focus:outline-none p-0 font-mono text-sm sm:text-base min-w-0"
                placeholder="Type Y for YES or N for NO..."
                autoFocus
                disabled={isTyping}
              />
              {renderSubmitButton()}
            </form>
          )}

          {/* Desktop input for Swann disambiguation */}
          {gameState === 'swann_disambiguation' && !isTyping && !isMobile && (
            <form onSubmit={handleSubmit} className="terminal-input-form flex items-center mt-4 touch-manipulation">
              <span className="terminal-prompt text-green-400 mr-1 sm:mr-2 text-sm sm:text-base">&gt;</span>
              <span className={`terminal-cursor mr-1 ${showCursor ? 'opacity-100' : 'opacity-0'} text-green-400 text-sm sm:text-base`}>
                █
              </span>
              <Input
                ref={inputRef}
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                className="terminal-input flex-1 bg-transparent border-none text-green-400 focus:ring-0 focus:outline-none p-0 font-mono text-sm sm:text-base min-w-0"
                placeholder="Type Y for YES or N for NO..."
                autoFocus
                disabled={isTyping}
              />
              {renderSubmitButton()}
            </form>
          )}

          {/* Desktop input for Swann second question */}
          {gameState === 'swann_second_question' && !isTyping && !isMobile && (
            <form onSubmit={handleSubmit} className="terminal-input-form flex items-center mt-4 touch-manipulation">
              <span className="terminal-prompt text-green-400 mr-1 sm:mr-2 text-sm sm:text-base">&gt;</span>
              <span className={`terminal-cursor mr-1 ${showCursor ? 'opacity-100' : 'opacity-0'} text-green-400 text-sm sm:text-base`}>
                █
              </span>
              <Input
                ref={inputRef}
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                className="terminal-input flex-1 bg-transparent border-none text-green-400 focus:ring-0 focus:outline-none p-0 font-mono text-sm sm:text-base min-w-0"
                placeholder="Type Y for YES or N for NO..."
                autoFocus
                disabled={isTyping}
              />
              {renderSubmitButton()}
            </form>
          )}

          {/* Input for Beau verification (desktop and mobile) */}
          {gameState === 'beau_verification' && !isTyping && (
            <form onSubmit={handleSubmit} className="terminal-input-form flex items-center mt-4 touch-manipulation">
              <span className="terminal-prompt text-green-400 mr-1 sm:mr-2 text-sm sm:text-base">&gt;</span>
              <span className={`terminal-cursor mr-1 ${showCursor ? 'opacity-100' : 'opacity-0'} text-green-400 text-sm sm:text-base`}>
                █
              </span>
              <Input
                ref={inputRef}
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                className="terminal-input flex-1 bg-transparent border-none text-green-400 focus:ring-0 focus:outline-none p-0 font-mono text-sm sm:text-base min-w-0"
                placeholder="Enter your response..."
                autoFocus
                disabled={isTyping}
              />
              {renderSubmitButton()}
            </form>
          )}



          {/* Desktop input for verification */}
          {gameState === 'verification' && !isTyping && !isMobile && (
            <form onSubmit={handleSubmit} className="terminal-input-form flex items-center mt-4 touch-manipulation">
              <span className="terminal-prompt text-green-400 mr-1 sm:mr-2 text-sm sm:text-base">&gt;</span>
              <span className={`terminal-cursor mr-1 ${showCursor ? 'opacity-100' : 'opacity-0'} text-green-400 text-sm sm:text-base`}>
                █
              </span>
              <Input
                ref={inputRef}
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                className="terminal-input flex-1 bg-transparent border-none text-green-400 focus:ring-0 focus:outline-none p-0 font-mono text-sm sm:text-base min-w-0"
                placeholder="Enter your response..."
                autoFocus
                disabled={isTyping}
              />
              {renderSubmitButton()}
            </form>
          )}

          {/* Mobile input for verification (non-Kris Tarver users) */}
          {gameState === 'verification' && !isTyping && isMobile && currentVerificationUser !== 'Kris Tarver' && (
            <form onSubmit={handleSubmit} className="terminal-input-form flex items-center mt-4 touch-manipulation">
              <span className="terminal-prompt text-green-400 mr-1 sm:mr-2 text-sm sm:text-base">&gt;</span>
              <span className={`terminal-cursor mr-1 ${showCursor ? 'opacity-100' : 'opacity-0'} text-green-400 text-sm sm:text-base`}>
                █
              </span>
              <Input
                ref={inputRef}
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                className="terminal-input flex-1 bg-transparent border-none text-green-400 focus:ring-0 focus:outline-none p-0 font-mono text-sm sm:text-base min-w-0"
                placeholder="Enter your response..."
                autoFocus
                disabled={isTyping}
              />
              {renderSubmitButton()}
            </form>
          )}

          {/* Mobile CTA Buttons for verification state */}
          {gameState === 'verification' && !isTyping && isMobile && currentVerificationUser === 'Kris Tarver' && (
            <div className="mobile-cta-container mt-4 space-y-3">
              <Button
                onClick={async () => {
                  const answer = 'highly classified';
                  setCurrentInput('');
                  
                  // Add user input to terminal
                  setLines(prev => [...prev, { text: `> ${answer}`, type: 'user' }]);
                  
                  // Handle verification answer
                  const verificationData = verificationQuestions[currentVerificationUser as keyof typeof verificationQuestions];
                  
                  if (isCorrectVerificationAnswer(answer, verificationData.correctAnswers)) {
                    // Correct answer - proceed to authentication
                    const successLines = [
                      ...terminalMessages.verificationSuccess,
                      { text: `✓ IDENTITY CONFIRMED: ${currentVerificationUser.toUpperCase()}`, type: 'success' as const, delay: 800 },
                      { text: '', type: 'system' as const, delay: 500 },
                      { text: terminalMessages.authentication.prompts.standard, type: 'system' as const, delay: 800 }
                    ];
                    
                    await addLines(successLines);
                    await updateGameState('authentication');
                  } else {
                    // Incorrect answer
                    const currentAttempts = verificationAttempts + 1;
                    setVerificationAttempts(currentAttempts);
                    
                    // Log verification failure
                    await apiService.logEvent('verification_failure', {
                      userName: currentVerificationUser,
                      attemptNumber: currentAttempts,
                      maxAttempts: verificationData.maxAttempts,
                      question: verificationData.question
                    });
                    
                    if (currentAttempts >= verificationData.maxAttempts) {
                      // Max attempts exceeded - lockout
                      await apiService.logEvent('verification_lockout', {
                        userName: currentVerificationUser,
                        totalAttempts: currentAttempts,
                        maxAttempts: verificationData.maxAttempts,
                        reason: 'max_verification_attempts_exceeded'
                      });
                      
                      await addLines(terminalMessages.verificationLockout);
                      setGameState('completed');
                    } else {
                      // Show error and retry
                      const remainingAttempts = verificationData.maxAttempts - currentAttempts;
                      const failureLines = [
                        ...terminalMessages.verificationFailure,
                        { text: `Attempts remaining: ${remainingAttempts}`, type: 'error' as const, delay: 600 },
                        { text: '', type: 'system' as const, delay: 300 },
                        { text: verificationData.question, type: 'system' as const, delay: 800 },
                        { text: '', type: 'system' as const, delay: 300 },
                        { text: 'Enter your response:', type: 'system' as const, delay: 600 }
                      ];
                      
                      await addLines(failureLines);
                    }
                  }
                }}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-mono font-bold py-3 px-4 rounded border-2 border-blue-400 shadow-lg"
                disabled={isTyping}
              >
                🔒 HIGHLY CLASSIFIED
              </Button>
              
              <Button
                onClick={async () => {
                  const answer = 'top notch';
                  setCurrentInput('');
                  
                  // Add user input to terminal
                  setLines(prev => [...prev, { text: `> ${answer}`, type: 'user' }]);
                  
                  // Handle verification answer
                  const verificationData = verificationQuestions[currentVerificationUser as keyof typeof verificationQuestions];
                  
                  if (isCorrectVerificationAnswer(answer, verificationData.correctAnswers)) {
                    // Correct answer - proceed to authentication
                    const successLines = [
                      ...terminalMessages.verificationSuccess,
                      { text: `✓ IDENTITY CONFIRMED: ${currentVerificationUser.toUpperCase()}`, type: 'success' as const, delay: 800 },
                      { text: '', type: 'system' as const, delay: 500 },
                      { text: terminalMessages.authentication.prompts.standard, type: 'system' as const, delay: 800 }
                    ];
                    
                    await addLines(successLines);
                    await updateGameState('authentication');
                  } else {
                    // Incorrect answer
                    const currentAttempts = verificationAttempts + 1;
                    setVerificationAttempts(currentAttempts);
                    
                    // Log verification failure
                    await apiService.logEvent('verification_failure', {
                      userName: currentVerificationUser,
                      attemptNumber: currentAttempts,
                      maxAttempts: verificationData.maxAttempts,
                      question: verificationData.question
                    });
                    
                    if (currentAttempts >= verificationData.maxAttempts) {
                      // Max attempts exceeded - lockout
                      await apiService.logEvent('verification_lockout', {
                        userName: currentVerificationUser,
                        totalAttempts: currentAttempts,
                        maxAttempts: verificationData.maxAttempts,
                        reason: 'max_verification_attempts_exceeded'
                      });
                      
                      await addLines(terminalMessages.verificationLockout);
                      setGameState('completed');
                    } else {
                      // Show error and retry
                      const remainingAttempts = verificationData.maxAttempts - currentAttempts;
                      const failureLines = [
                        ...terminalMessages.verificationFailure,
                        { text: `Attempts remaining: ${remainingAttempts}`, type: 'error' as const, delay: 600 },
                        { text: '', type: 'system' as const, delay: 300 },
                        { text: verificationData.question, type: 'system' as const, delay: 800 },
                        { text: '', type: 'system' as const, delay: 300 },
                        { text: 'Enter your response:', type: 'system' as const, delay: 600 }
                      ];
                      
                      await addLines(failureLines);
                    }
                  }
                }}
                className="w-full bg-green-500 hover:bg-green-600 text-black font-mono font-bold py-3 px-4 rounded border-2 border-green-400 shadow-lg"
                disabled={isTyping}
              >
                ⭐ TOP NOTCH
              </Button>
            </div>
          )}
          
          {/* Mobile CTA Button for authentication state */}
          {gameState === 'authentication' && !isTyping && isMobile && (
            <div className="mobile-cta-container mt-4">
              <Button
                onClick={async () => {
                  // Trigger the authentication case with empty input
                  const input = '';
                  setCurrentInput('');
                  
                  // Add empty user input to terminal
                  setLines(prev => [...prev, { text: `> `, type: 'user' }]);
                  
                  // Security check: Only allow authorized users to access briefing
                  // Check if user is a groomsman, an easter egg character, Howard Family, or other family members
                  const isGroomsman = groomsmenNames.some(name => name.toLowerCase() === userName.toLowerCase());
                  const isEasterEgg = easterEggs.tomCruise.names.some(name => name.toLowerCase() === userName.toLowerCase()) ||
                                      easterEggs.ethanHunt.names.some(name => name.toLowerCase() === userName.toLowerCase()) ||
                                      easterEggs.pearsonReese.names.some(name => name.toLowerCase() === userName.toLowerCase()) ||
                                      easterEggs.jordanSwann.names.some(name => name.toLowerCase() === userName.toLowerCase());
                  const isHowardFamily = userName.toLowerCase() === 'howard family';
                  const isOtherFamily = userName.toLowerCase().includes(' family') && !isHowardFamily;
                  
                  const authorizedUser = isGroomsman || isEasterEgg || isHowardFamily || isOtherFamily;
                  
                  if (!authorizedUser) {
                    // Unauthorized user trying to access briefing - block them
                    const securityLines: TerminalLine[] = [
                      { text: '', type: 'system', delay: 300 },
                      { text: '🚨 SECURITY VIOLATION DETECTED 🚨', type: 'error', delay: 800 },
                      { text: '🔒 UNAUTHORIZED ACCESS ATTEMPT BLOCKED', type: 'error', delay: 800 },
                      { text: '📞 INCIDENT REPORTED TO SECURITY', type: 'error', delay: 600 },
                      { text: '', type: 'system', delay: 500 },
                      { text: 'Connection terminated.', type: 'error', delay: 800 }
                    ];
                    
                    await addLines(securityLines);
                    setGameState('completed');
                    return;
                  }
                  
                  // Handle the authentication case - check for special briefings
                  if (userName.toLowerCase() === 'tom cruise') {
                    // Tom Cruise easter egg briefing
                    const tomCruiseBriefingLines = [
                      ...easterEggs.tomCruise.mission.header,
                      { text: `📅 DATE: ${weddingDetails.date}`, type: 'system' as const, delay: 600 },
                      ...easterEggs.tomCruise.mission.parameters,
                      ...easterEggs.tomCruise.mission.equipment,
                      ...easterEggs.tomCruise.mission.footer
                    ];

                    await addLines(tomCruiseBriefingLines);
                    setGameState('mission_choice');
                  } else if (userName.toLowerCase() === 'ethan hunt') {
                    // Ethan Hunt easter egg briefing
                    const ethanHuntBriefingLines = [
                      ...easterEggs.ethanHunt.mission.header,
                      { text: `📅 DATE: ${weddingDetails.date}`, type: 'system' as const, delay: 600 },
                      ...easterEggs.ethanHunt.mission.parameters,
                      ...easterEggs.ethanHunt.mission.equipment,
                      ...easterEggs.ethanHunt.mission.footer
                    ];

                    await addLines(ethanHuntBriefingLines);
                    setGameState('mission_choice');
                  } else if (userName.toLowerCase() === 'pearson reese') {
                    // Pearson Reese easter egg briefing
                    const pearsonReeseBriefingLines = [
                      ...easterEggs.pearsonReese.mission.header,
                      { text: `📅 DATE: ${weddingDetails.date}`, type: 'system' as const, delay: 600 },
                      ...easterEggs.pearsonReese.mission.parameters,
                      ...easterEggs.pearsonReese.mission.equipment,
                      ...easterEggs.pearsonReese.mission.footer
                    ];

                    await addLines(pearsonReeseBriefingLines);
                    setGameState('mission_choice');
                  } else if (userName.toLowerCase() === 'jordan swann') {
                    // Jordan Swann easter egg briefing
                    const jordanSwannBriefingLines = [
                      ...easterEggs.jordanSwann.mission.header,
                      { text: `📅 DATE: ${weddingDetails.date}`, type: 'system' as const, delay: 600 },
                      ...easterEggs.jordanSwann.mission.parameters,
                      ...easterEggs.jordanSwann.mission.equipment,
                      ...easterEggs.jordanSwann.mission.footer
                    ];

                    await addLines(jordanSwannBriefingLines);
                    setGameState('mission_choice');
                  } else if (userName.toLowerCase() === specialPersons.bride.name.toLowerCase()) {
                    // Build the complete bride mission briefing from structured data
                    const fianceeBriefingLines = [
                      ...brideContent.mission.header,
                      { text: `📅 DATE: ${weddingDetails.date}`, type: 'system' as const, delay: 600 },
                      ...brideContent.mission.parameters,
                      ...brideContent.mission.equipment,
                      ...brideContent.mission.footer
                    ];

                    await addLines(fianceeBriefingLines);
                    setGameState('mission_choice');
                  } else if (userName.toLowerCase() === specialPersons.bestMan.name.toLowerCase()) {
                    // Best Man briefing
                    const bestManBriefingLines = [
                      ...bestManContent.mission.header,
                      { text: `📅 DATE: ${weddingDetails.date}`, type: 'system' as const, delay: 600 },
                      ...bestManContent.mission.parameters,
                      ...bestManContent.mission.equipment,
                      ...bestManContent.mission.footer
                    ];

                    await addLines(bestManBriefingLines);
                    setGameState('mission_choice');
                  } else if (userName.toLowerCase() === 'howard family') {
                            // Howard Family briefing
        const howardFamilyBriefingLines = [
          { text: '', type: 'system' as const, delay: 300 },
                                { text: '🏠 FAMILY AND FRIENDS BRIEFING - HOWARD FAMILY 🏠', type: 'classified' as const, delay: 800 },
                      { text: 'TOP SECRET - FAMILY AND FRIENDS EYES ONLY', type: 'classified' as const, delay: 600 },
                      { text: 'MISSION CODE: OPERATION: FAMILY SUPPORT', type: 'classified' as const, delay: 600 },
                      { text: '', type: 'system' as const, delay: 500 },
                      { text: 'Your mission, should you choose to accept it, is to support the bride and groom in this epic wedding mission!', type: 'system' as const, delay: 1000 },
                      { text: '', type: 'system' as const, delay: 500 },
                      { text: 'FAMILY MISSION DETAILS:', type: 'classified' as const, delay: 800 },
                      { text: '---LINE---', type: 'system' as const, delay: 300 },
                      { text: '', type: 'system' as const, delay: 200 },
                      { text: '👰 TARGET EVENT: Family Wedding Support', type: 'system' as const, delay: 600 },
                      { text: `📅 DATE: ${weddingDetails.date}`, type: 'system' as const, delay: 600 },
                      { text: '', type: 'system' as const, delay: 300 },
                      { text: '👰 CEREMONY LOCATION: Armstrong Browning Library', type: 'system' as const, delay: 600 },
                      { text: '👰 RECEPTION LOCATION: Hotel Herringbone', type: 'system' as const, delay: 600 },
                      { text: '', type: 'system' as const, delay: 300 },
                      { text: 'FAMILY MISSION PARAMETERS:', type: 'classified' as const, delay: 800 },
                      { text: '• Provide emotional support to the bride and groom', type: 'system' as const, delay: 400 },
                      { text: '• Share family wisdom and advice', type: 'system' as const, delay: 400 },
                      { text: '• Coordinate with other family members', type: 'system' as const, delay: 400 },
                      { text: '• Ensure everyone feels welcome and included', type: 'system' as const, delay: 400 },
                      { text: '• Capture precious family moments', type: 'system' as const, delay: 400 },
                      { text: '', type: 'system' as const, delay: 300 },
                      { text: 'SPECIAL FAMILY EQUIPMENT:', type: 'classified' as const, delay: 800 },
                      { text: '• Family love and support', type: 'system' as const, delay: 400 },
                      { text: '• Generations of family wisdom', type: 'system' as const, delay: 400 },
                      { text: '• Camera for family photos', type: 'system' as const, delay: 400 },
                      { text: '• Unlimited hugs and encouragement', type: 'system' as const, delay: 400 },
                      { text: '', type: 'system' as const, delay: 500 },
                      { text: 'This mission will test your family bonds, love for the bride and groom, and ability to make everyone feel special. The success of Operation: Family Support depends on your family love.', type: 'system' as const, delay: 1000 },
                      { text: '', type: 'system' as const, delay: 500 },
                      { text: '---LINE---', type: 'system' as const, delay: 300 },
                      { text: '', type: 'system' as const, delay: 500 },
                      { text: '🏠 DO YOU ACCEPT THIS FAMILY MISSION? 🏠', type: 'classified' as const, delay: 1000 },
                      { text: '', type: 'system' as const, delay: 500 },
                      { text: 'Type Y for YES or N for NO:', type: 'system' as const, delay: 600 }
                    ];

                    await addLines(howardFamilyBriefingLines);
                    setGameState('mission_choice');
                  } else if (isOtherFamily) {
                    // Generic family and friends briefing for other family members
                    const familyName = userName.replace(' Family', '');
                    const genericFamilyBriefingLines = [
                      { text: '', type: 'system' as const, delay: 300 },
                      { text: `🏠 FAMILY AND FRIENDS BRIEFING - ${familyName.toUpperCase()} FAMILY 🏠`, type: 'classified' as const, delay: 800 },
                      { text: 'TOP SECRET - FAMILY AND FRIENDS EYES ONLY', type: 'classified' as const, delay: 600 },
                      { text: 'MISSION CODE: OPERATION: FAMILY AND FRIENDS SUPPORT', type: 'classified' as const, delay: 600 },
                      { text: '', type: 'system' as const, delay: 500 },
                      { text: 'Your mission, should you choose to accept it, is to support the bride and groom in this epic wedding mission!', type: 'system' as const, delay: 1000 },
                      { text: '', type: 'system' as const, delay: 500 },
                      { text: 'FAMILY AND FRIENDS MISSION DETAILS:', type: 'classified' as const, delay: 800 },
                      { text: '---LINE---', type: 'system' as const, delay: 300 },
                      { text: '', type: 'system' as const, delay: 200 },
                      { text: '👰 TARGET EVENT: Family and Friends Wedding Support', type: 'system' as const, delay: 600 },
                      { text: `📅 DATE: ${weddingDetails.date}`, type: 'system' as const, delay: 600 },
                      { text: '', type: 'system' as const, delay: 300 },
                      { text: '👰 CEREMONY LOCATION: Armstrong Browning Library', type: 'system' as const, delay: 600 },
                      { text: '👰 RECEPTION LOCATION: Hotel Herringbone', type: 'system' as const, delay: 600 },
                      { text: '', type: 'system' as const, delay: 300 },
                      { text: 'FAMILY AND FRIENDS MISSION PARAMETERS:', type: 'classified' as const, delay: 800 },
                      { text: '• Provide emotional support to the bride and groom', type: 'system' as const, delay: 400 },
                      { text: '• Share wisdom and advice', type: 'system' as const, delay: 400 },
                      { text: '• Coordinate with other family and friends', type: 'system' as const, delay: 400 },
                      { text: '• Ensure everyone feels welcome and included', type: 'system' as const, delay: 400 },
                      { text: '• Capture precious moments', type: 'system' as const, delay: 400 },
                      { text: '', type: 'system' as const, delay: 300 },
                      { text: 'SPECIAL FAMILY AND FRIENDS EQUIPMENT:', type: 'classified' as const, delay: 800 },
                      { text: '• Family and friends love and support', type: 'system' as const, delay: 400 },
                      { text: '• Generations of wisdom', type: 'system' as const, delay: 400 },
                      { text: '• Smile for photos', type: 'system' as const, delay: 400 },
                      { text: '• Unlimited hugs and encouragement', type: 'system' as const, delay: 400 },
                      { text: '', type: 'system' as const, delay: 500 },
                      { text: 'This mission will test your family and friends bonds, love for the bride and groom, and ability to make everyone feel special. The success of Operation: Family Support depends on your family love.', type: 'system' as const, delay: 1000 },
                      { text: '', type: 'system' as const, delay: 500 },
                      { text: '---LINE---', type: 'system' as const, delay: 300 },
                      { text: '', type: 'system' as const, delay: 500 },
                      { text: '🏠 DO YOU ACCEPT THIS FAMILY AND FRIENDS MISSION? 🏠', type: 'classified' as const, delay: 1000 },
                      { text: '', type: 'system' as const, delay: 500 },
                      { text: 'Type Y for YES or N for NO:', type: 'system' as const, delay: 600 }
                    ];

                    await addLines(genericFamilyBriefingLines);
                    setGameState('mission_choice');
                  } else {
                    // Standard groomsman briefing
                    const briefingLines = [
                      ...missionPrompts.standard.header,
                      { text: missionBriefing.classification, type: 'classified' as const, delay: 600 },
                      { text: `MISSION CODE: ${missionBriefing.missionCode}`, type: 'classified' as const, delay: 600 },
                      { text: '', type: 'system' as const, delay: 500 },
                      { text: missionBriefing.objective, type: 'system' as const, delay: 1000 }
                    ];

                    // Split briefing into lines for better display
                    const briefingParts = missionBriefing.briefing.split('\n');
                    briefingParts.forEach(part => {
                      if (part.trim()) {
                        briefingLines.push({ text: part, type: 'system' as const, delay: 300 });
                      } else {
                        briefingLines.push({ text: '', type: 'system' as const, delay: 200 });
                      }
                    });

                    briefingLines.push(...missionPrompts.standard.footer);

                    await addLines(briefingLines);
                    setGameState('mission_choice');
                  }
                }}
                className="w-full bg-green-500 hover:bg-green-600 text-black font-mono font-bold py-3 px-4 rounded border-2 border-green-400 shadow-lg"
                disabled={isTyping}
              >
                {userName.toLowerCase() === 'tom cruise'
                  ? '🎬 RECEIVE TOM CRUISE BRIEFING'
                  : userName.toLowerCase() === 'ethan hunt'
                  ? '🕵️ RECEIVE IMF BRIEFING'
                  : userName.toLowerCase() === 'pearson reese'
                  ? '💍 RECEIVE GROOM BRIEFING'
                  : userName.toLowerCase() === 'jordan swann'
                  ? '👯 RECEIVE SISTER BRIEFING'
                  : userName.toLowerCase() === specialPersons.bride.name.toLowerCase() 
                  ? '💍 RECEIVE FIANCÉE BRIEFING' 
                  : userName.toLowerCase() === specialPersons.bestMan.name.toLowerCase()
                  ? '🎖️ RECEIVE BEST MAN BRIEFING'
                  : userName.toLowerCase() === 'howard family'
                  ? '🏠 RECEIVE FAMILY AND FRIENDS BRIEFING'
                  : userName.toLowerCase().includes(' family')
                  ? '🏠 RECEIVE FAMILY AND FRIENDS BRIEFING'
                  : '📋 RECEIVE MISSION BRIEFING'
                }
              </Button>
            </div>
          )}
          
          {/* Desktop input for authentication state */}
          {gameState === 'authentication' && !isTyping && !isMobile && (
            <form onSubmit={handleSubmit} className="terminal-input-form flex items-center mt-4 touch-manipulation">
              <span className="terminal-prompt text-green-400 mr-1 sm:mr-2 text-sm sm:text-base">&gt;</span>
              <span className={`terminal-cursor mr-1 ${showCursor ? 'opacity-100' : 'opacity-0'} text-green-400 text-sm sm:text-base`}>
                █
              </span>
              <Input
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                className="terminal-input flex-1 bg-transparent border-none text-green-400 focus:ring-0 focus:outline-none p-0 font-mono text-sm sm:text-base min-w-0"
                placeholder="Press ENTER..."
                autoFocus
                disabled={isTyping}
              />
              {renderSubmitButton()}
            </form>
          )}
          
          {/* Mobile CTA Buttons for mission choice state */}
          {gameState === 'mission_choice' && !isTyping && isMobile && (
            <div className="mobile-cta-container mt-4 space-y-3">
              <Button
                onClick={async () => {
                  const choice = 'y';
                  setCurrentInput('');
                  
                  // Add user input to terminal
                  setLines(prev => [...prev, { text: `> ${choice}`, type: 'user' }]);
                  
                  // Special responses for easter egg flows first
                  if (userName.toLowerCase() === 'tom cruise') {
                    // Log mission acceptance
                    await apiService.logEvent('mission_accepted', { userName });
                    await addLines(easterEggs.tomCruise.responses.accept as TerminalLine[]);
                    
                    // Show email collection prompt
                    await addLines(contactInfoData.email.prompt);
                    setGameState('email_collection');
                    return;
                  }
                  
                  if (userName.toLowerCase() === 'ethan hunt') {
                    // Log mission acceptance
                    await apiService.logEvent('mission_accepted', { userName });
                    await addLines(easterEggs.ethanHunt.responses.accept as TerminalLine[]);
                    
                    // Show email collection prompt
                    await addLines(contactInfoData.email.prompt);
                    setGameState('email_collection');
                    return;
                  }
                  
                  if (userName.toLowerCase() === 'pearson reese') {
                    // Log mission acceptance
                    await apiService.logEvent('mission_accepted', { userName });
                    await addLines(easterEggs.pearsonReese.responses.accept as TerminalLine[]);
                    
                    // Show email collection prompt
                    await addLines(contactInfoData.email.prompt);
                    setGameState('email_collection');
                    return;
                  }
                  
                  if (userName.toLowerCase() === 'jordan swann') {
                    // Log mission acceptance
                    await apiService.logEvent('mission_accepted', { userName });
                    await addLines(easterEggs.jordanSwann.responses.accept as TerminalLine[]);
                    
                    // Show email collection prompt
                    await addLines(contactInfoData.email.prompt);
                    setGameState('email_collection');
                    return;
                  }
                  
                  // Special responses for Emma (the bride!)
                  if (userName.toLowerCase() === specialPersons.bride.name.toLowerCase()) {
                    // Log mission acceptance
                    await apiService.logEvent('mission_accepted', { userName });
                    await addLines(brideContent.responses.accept as TerminalLine[]);
                    
                    // Show email collection prompt
                    await addLines(contactInfoData.email.prompt);
                    setGameState('email_collection');
                    return;
                  }
                  
                  // Special responses for Best Man
                  if (userName.toLowerCase() === specialPersons.bestMan.name.toLowerCase()) {
                    // Log mission acceptance
                    await apiService.logEvent('mission_accepted', { userName });
                    await addLines(bestManContent.responses.accept as TerminalLine[]);
                    
                    // Show email collection prompt
                    await addLines(contactInfoData.email.prompt);
                    setGameState('email_collection');
                    return;
                  }
                  
                  // Special responses for Howard Family
                  if (userName.toLowerCase() === 'howard family') {
                    // Log mission acceptance
                    await apiService.logEvent('mission_accepted', { userName });
                    
                    const howardFamilyAcceptLines: TerminalLine[] = [
                      { text: '', type: 'system' as const, delay: 500 },
                      { text: '🏠 FAMILY MISSION ACCEPTED 🏠', type: 'success' as const, delay: 800 },
                      { text: '', type: 'system' as const, delay: 500 },
                      { text: '🏠 EXCELLENT! Your commitment to the bride and groom has been confirmed.', type: 'success' as const, delay: 800 },
                      { text: '🏠 Standby for family coordination and support duties...', type: 'success' as const, delay: 800 },
                      { text: '🏠 Welcome to the most important family mission ever!', type: 'success' as const, delay: 800 },
                      { text: '🏠 You\'re going to be the best family member ever!', type: 'success' as const, delay: 800 },
                      { text: '🏠 Remember: What happens in the family, stays in the family forever.', type: 'success' as const, delay: 800 },
                      { text: '', type: 'system' as const, delay: 1000 },
                      { text: '🏠 Save this date in your calendar immediately!', type: 'classified' as const, delay: 800 },
                      { text: '🏠 Family meetings and support planning to follow.', type: 'classified' as const, delay: 800 },
                      { text: '', type: 'system' as const, delay: 800 },
                      { text: '✨ Family mission briefing complete. This terminal will self-destruct in...', type: 'system' as const, delay: 1000 },
                      { text: 'Just kidding! Welcome to the most important family mission ever! 🏠', type: 'success' as const, delay: 1500 }
                    ];
                    
                    await addLines(howardFamilyAcceptLines);
                    
                    // Show email collection prompt
                    await addLines(contactInfoData.email.prompt);
                    setGameState('email_collection');
                    return;
                  }
                  
                  // Special responses for other family members
                  if (userName.toLowerCase().includes(' family') && userName.toLowerCase() !== 'howard family') {
                    // Log mission acceptance
                    await apiService.logEvent('mission_accepted', { userName });
                    
                    const familyName = userName.replace(' Family', '');
                    const familyAcceptLines: TerminalLine[] = [
                      { text: '', type: 'system' as const, delay: 500 },
                      { text: '🏠 FAMILY AND FRIENDS MISSION ACCEPTED 🏠', type: 'success' as const, delay: 800 },
                      { text: '', type: 'system' as const, delay: 500 },
                      { text: '🏠 EXCELLENT! Your commitment to the bride and groom has been confirmed.', type: 'success' as const, delay: 800 },
                      { text: '🏠 Standby for coordination and support duties...', type: 'success' as const, delay: 800 },
                      { text: '🏠 Welcome to the most important mission ever!', type: 'success' as const, delay: 800 },
                      { text: `🏠 You're going to be the best ${familyName} family member ever!`, type: 'success' as const, delay: 800 },
                      { text: '🏠 Remember: What happens in the family, stays in the family forever.', type: 'success' as const, delay: 800 },
                      { text: '', type: 'system' as const, delay: 1000 },
                      { text: '🏠 Save this date in your calendar immediately!', type: 'classified' as const, delay: 800 },
                      { text: '🏠 Family and friends meetings and support planning to follow.', type: 'classified' as const, delay: 800 },
                      { text: '', type: 'system' as const, delay: 800 },
                      { text: '✨ Family and friends mission briefing complete. This terminal will self-destruct in...', type: 'system' as const, delay: 1000 },
                      { text: 'Just kidding! Welcome to the most important family and friends mission ever! 🏠', type: 'success' as const, delay: 1500 }
                    ];
                    
                    await addLines(familyAcceptLines);
                    
                    // Show email collection prompt
                    await addLines(contactInfoData.email.prompt);
                    setGameState('email_collection');
                    return;
                  }
                  
                  // Log mission acceptance
                  await apiService.logEvent('mission_accepted', { userName });
                  
                  // Standard groomsman response
                  const acceptLines: TerminalLine[] = [
                    { text: '', type: 'system', delay: 500 },
                    { text: '🎯 MISSION ACCEPTED 🎯', type: 'success', delay: 800 },
                    { text: '', type: 'system', delay: 500 }
                  ];

                  responses.accept.forEach(response => {
                    acceptLines.push({ text: response, type: 'success', delay: 800 });
                  });

                  acceptLines.push(...(responses.acceptComplete as TerminalLine[]));

                  await addLines(acceptLines);
                  
                  // Show email collection prompt
                  await addLines(contactInfoData.email.prompt);
                  setGameState('email_collection');
                }}
                className="w-full bg-green-500 hover:bg-green-600 text-black font-mono font-bold py-3 px-4 rounded border-2 border-green-400 shadow-lg"
                disabled={isTyping}
              >
                ✅ ACCEPT MISSION
              </Button>
              
              <Button
                onClick={async () => {
                  const choice = 'n';
                  setCurrentInput('');
                  
                  // Add user input to terminal
                  setLines(prev => [...prev, { text: `> ${choice}`, type: 'user' }]);
                  
                  // Special responses for easter egg flows first
                  if (userName.toLowerCase() === 'tom cruise') {
                    // Log mission decline
                    await apiService.logEvent('mission_declined', { userName });
                    await addLines(easterEggs.tomCruise.responses.decline as TerminalLine[]);
                    return;
                  }
                  
                  if (userName.toLowerCase() === 'ethan hunt') {
                    // Log mission decline
                    await apiService.logEvent('mission_declined', { userName });
                    await addLines(easterEggs.ethanHunt.responses.decline as TerminalLine[]);
                    return;
                  }
                  
                  if (userName.toLowerCase() === 'pearson reese') {
                    // Log mission decline
                    await apiService.logEvent('mission_declined', { userName });
                    await addLines(easterEggs.pearsonReese.responses.decline as TerminalLine[]);
                    return;
                  }
                  
                  if (userName.toLowerCase() === 'jordan swann') {
                    // Log mission decline
                    await apiService.logEvent('mission_declined', { userName });
                    await addLines(easterEggs.jordanSwann.responses.decline as TerminalLine[]);
                    return;
                  }
                  
                  // Special responses for Emma (the bride!)
                  if (userName.toLowerCase() === specialPersons.bride.name.toLowerCase()) {
                    // Log mission decline
                    await apiService.logEvent('mission_declined', { userName });
                    await addLines(brideContent.responses.decline as TerminalLine[]);
                    return;
                  }
                  
                  // Special responses for Best Man
                  if (userName.toLowerCase() === specialPersons.bestMan.name.toLowerCase()) {
                    // Log mission decline
                    await apiService.logEvent('mission_declined', { userName });
                    await addLines(bestManContent.responses.decline as TerminalLine[]);
                    return;
                  }
                  
                  // Special responses for Howard Family
                  if (userName.toLowerCase() === 'howard family') {
                    // Log mission decline
                    await apiService.logEvent('mission_declined', { userName });
                    
                    const howardFamilyDeclineLines: TerminalLine[] = [
                      { text: '', type: 'system' as const, delay: 500 },
                      { text: '💔 FAMILY MISSION DECLINED', type: 'error' as const, delay: 800 },
                      { text: '', type: 'system' as const, delay: 500 },
                      { text: '🏠 This is... unexpected. Please reconsider, Family Member.', type: 'error' as const, delay: 800 },
                      { text: '🏠 Your family mission requires your specific skill set.', type: 'error' as const, delay: 800 },
                      { text: '🏠 Are you sure? The fate of family harmony depends on you.', type: 'error' as const, delay: 800 },
                      { text: '🏠 We\'ll give you time to think about it. This mission is too important to refuse.', type: 'error' as const, delay: 800 },
                      { text: '🏠 Your family love is more valuable than any mission. Consider it again.', type: 'error' as const, delay: 800 },
                      { text: '', type: 'system' as const, delay: 1000 },
                      { text: 'Type Y to reconsider, or N to confirm declination:', type: 'system' as const, delay: 800 }
                    ];
                    
                    await addLines(howardFamilyDeclineLines);
                    return;
                  }
                  
                  // Special responses for other family members
                  if (userName.toLowerCase().includes(' family') && userName.toLowerCase() !== 'howard family') {
                    // Log mission decline
                    await apiService.logEvent('mission_declined', { userName });
                    
                    const familyName = userName.replace(' Family', '');
                    const familyDeclineLines: TerminalLine[] = [
                      { text: '', type: 'system' as const, delay: 500 },
                      { text: '💔 FAMILY MISSION DECLINED', type: 'error' as const, delay: 800 },
                      { text: '', type: 'system' as const, delay: 500 },
                      { text: '🏠 This is... unexpected. Please reconsider.', type: 'error' as const, delay: 800 },
                      { text: '🏠 Your family and friends mission requires your specific skill set.', type: 'error' as const, delay: 800 },
                      { text: `🏠 Are you sure? The fate of wedding harmony depends on you.`, type: 'error' as const, delay: 800 },
                      { text: '🏠 We\'ll give you time to think about it. This mission is too important to refuse.', type: 'error' as const, delay: 800 },
                      { text: '🏠 Your family and friends love is more valuable than any mission. Consider it again.', type: 'error' as const, delay: 800 },
                      { text: '', type: 'system' as const, delay: 1000 },
                      { text: 'Type Y to reconsider, or N to confirm declination:', type: 'system' as const, delay: 800 }
                    ];
                    
                    await addLines(familyDeclineLines);
                    return;
                  }
                  
                  // Log mission decline
                  await apiService.logEvent('mission_declined', { userName });
                  
                  // Standard groomsman response
                  const declineLines: TerminalLine[] = [
                    { text: '', type: 'system', delay: 500 },
                    { text: '❌ MISSION DECLINED', type: 'error', delay: 800 },
                    { text: '', type: 'system', delay: 500 }
                  ];

                  responses.decline.forEach(response => {
                    declineLines.push({ text: response, type: 'error', delay: 800 });
                  });

                  declineLines.push(...(responses.declinePrompt as TerminalLine[]));

                  await addLines(declineLines);
                }}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-mono font-bold py-3 px-4 rounded border-2 border-red-400 shadow-lg"
                disabled={isTyping}
              >
                ❌ DECLINE MISSION
              </Button>
            </div>
          )}

          {/* Mobile CTA Buttons for email collection state */}
          {gameState === 'email_collection' && !isTyping && isMobile && (
            <div className="mobile-cta-container mt-4">
              <div className="mb-3 text-green-400 text-sm text-center">
                Please provide your email address for mission updates:
              </div>
              <Input
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                className="terminal-input bg-transparent border-green-500 text-green-400 focus:ring-green-500 focus:border-green-400 font-mono text-sm mb-3"
                placeholder="Enter your email address..."
                autoFocus
                disabled={isTyping}
              />
              <div className="space-y-3">
                <Button
                  onClick={async () => {
                    const email = currentInput.trim();
                    setCurrentInput('');
                    
                    // Add user input to terminal
                    setLines(prev => [...prev, { text: `> ${email}`, type: 'user' }]);
                    
                    if (email) {
                      // Basic email validation
                      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                      if (emailRegex.test(email)) {
                        setUserEmail(email);
                        
                        // Submit email to backend
                        const saveSuccess = await apiService.submitEmail(userName, email);
                        
                        // Log email collection
                        await apiService.logEvent('email_collected', { 
                          userName, 
                          email,
                          saveSuccess
                        });
                        
                        await addLines(contactInfoData.email.submit);
                        
                        // Show address collection prompt
                        await addLines(contactInfoData.address.prompt);
                        setGameState('address_collection');
                      } else {
                        // Invalid email format
                        await apiService.logEvent('invalid_email_format', { 
                          userName, 
                          email 
                        });
                        
                        const errorLines = [
                          { text: '', type: 'system' as const, delay: 300 },
                          { text: '⚠️  INVALID EMAIL FORMAT', type: 'error' as const, delay: 600 },
                          { text: 'Please enter a valid email address:', type: 'system' as const, delay: 600 }
                        ];
                        
                        await addLines(errorLines);
                      }
                    } else {
                      // User skipped email
                      await apiService.logEvent('email_skipped', { userName });
                      await addLines(contactInfoData.email.skip);
                      
                      // Show address collection prompt
                      await addLines(contactInfoData.address.prompt);
                      setGameState('address_collection');
                    }
                  }}
                  className="w-full bg-green-500 hover:bg-green-600 text-black font-mono font-bold py-3 px-4 rounded border-2 border-green-400 shadow-lg"
                  disabled={isTyping}
                >
                  📧 SUBMIT EMAIL
                </Button>
                
                <Button
                  onClick={async () => {
                    setCurrentInput('');
                    
                    // User skipped email
                    await apiService.logEvent('email_skipped', { userName });
                    await addLines(contactInfoData.email.skip);
                    
                    // Show address collection prompt
                    await addLines(contactInfoData.address.prompt);
                    setGameState('address_collection');
                  }}
                  className="w-full bg-gray-500 hover:bg-gray-600 text-white font-mono font-bold py-3 px-4 rounded border-2 border-gray-400 shadow-lg"
                  disabled={isTyping}
                >
                  ⏭️ SKIP EMAIL
                </Button>
              </div>
            </div>
          )}

          {/* Mobile CTA Buttons for address collection state */}
          {gameState === 'address_collection' && !isTyping && isMobile && (
            <div className="mobile-cta-container mt-4">
              <div className="mb-3 text-green-400 text-sm text-center">
                Please provide your mailing address for formal invitation:
              </div>
              <Textarea
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                className="terminal-textarea bg-transparent border-green-500 text-green-400 focus:ring-green-500 focus:border-green-400 font-mono text-sm resize-none mb-3"
                placeholder="Enter your mailing address..."
                rows={3}
                autoFocus
                disabled={isTyping}
              />
              <div className="space-y-3">
                <Button
                  onClick={async () => {
                    const address = currentInput.trim();
                    setCurrentInput('');
                    
                    // Add user input to terminal
                    setLines(prev => [...prev, { text: `> ${address}`, type: 'user' }]);
                    
                    if (address) {
                      setUserAddress(address);
                      
                      // Submit address to backend
                      const saveSuccess = await apiService.submitAddress(userName, address);
                      
                      // Log address collection
                      await apiService.logEvent('address_collected', { 
                        userName, 
                        address,
                        saveSuccess
                      });
                      
                      await addLines(contactInfoData.address.submit);
                      setGameState('groom_advice');
                    } else {
                      // User skipped address
                      await apiService.logEvent('address_skipped', { userName });
                      await addLines(contactInfoData.address.skip);
                      setGameState('groom_advice');
                    }
                  }}
                  className="w-full bg-green-500 hover:bg-green-600 text-black font-mono font-bold py-3 px-4 rounded border-2 border-green-400 shadow-lg"
                  disabled={isTyping}
                >
                  📮 SUBMIT ADDRESS
                </Button>
                
                <Button
                  onClick={async () => {
                    setCurrentInput('');
                    
                    // User skipped address
                    await apiService.logEvent('address_skipped', { userName });
                    await addLines(contactInfoData.address.skip);
                    setGameState('groom_advice');
                  }}
                  className="w-full bg-gray-500 hover:bg-gray-600 text-white font-mono font-bold py-3 px-4 rounded border-2 border-gray-400 shadow-lg"
                  disabled={isTyping}
                >
                  ⏭️ SKIP ADDRESS
                </Button>
              </div>
            </div>
          )}

          {/* Mobile CTA Buttons for groom advice state */}
          {gameState === 'groom_advice' && !isTyping && isMobile && (
            <div className="mobile-cta-container mt-4">
              <div className="mb-3 text-green-400 text-sm text-center">
                Enter your response below (or leave blank to skip):
              </div>
              <Textarea
                value={groomAdvice}
                onChange={(e) => setGroomAdvice(e.target.value)}
                className="terminal-textarea bg-transparent border-green-500 text-green-400 focus:ring-green-500 focus:border-green-400 font-mono text-sm resize-none mb-3"
                placeholder="Share your advice or any funny stories about the bride or groom... Responses may or may not be shared in the groomsmen's group chat"
                rows={4}
                autoFocus
                disabled={isTyping}
              />
              <div className="space-y-3">
                <Button
                  onClick={async () => {
                    // Handle the groom advice submission
                    if (groomAdvice.trim()) {
                      // User provided advice - Save to backend
                      const saveSuccess = await apiService.submitGroomAdvice(userName, groomAdvice);
                      
                      // Log groom advice submission
                      await apiService.logEvent('groom_advice_submitted', {
                        userName,
                        adviceLength: groomAdvice.length,
                        saveSuccess
                      });
                      
                      if (saveSuccess) {
                        await addLines(groomAdviceData.submit);
                        console.log(`✅ Groom advice saved from ${userName}`);
                      } else {
                        await addLines(groomAdviceData.submit); // Still show success to user
                        console.log(`⚠️ Groom advice failed to save from ${userName}:`, groomAdvice);
                      }
                    } else {
                      // User skipped - log skip event
                      await apiService.logEvent('groom_advice_skipped', { userName });
                      await addLines(groomAdviceData.skip);
                    }
                    
                    // Update session as completed
                    await apiService.updateSession('completed', true);
                    await apiService.logMissionComplete(userName);
                    
                    // Log mission completion with additional details
                    await apiService.logEvent('mission_completed', {
                      userName,
                      groomAdviceProvided: !!groomAdvice.trim(),
                      adviceLength: groomAdvice.trim().length,
                      gameState: 'completed'
                    });
                    
                    setGameState('completed');
                  }}
                  className="w-full bg-green-500 hover:bg-green-600 text-black font-mono font-bold py-3 px-4 rounded border-2 border-green-400 shadow-lg"
                  disabled={isTyping}
                >
                  📝 SUBMIT
                </Button>
                
                <Button
                  onClick={async () => {
                    setGroomAdvice('');
                    
                    // User skipped - log skip event
                    await apiService.logEvent('groom_advice_skipped', { userName });
                    await addLines(groomAdviceData.skip);
                    
                    // Update session as completed
                    await apiService.updateSession('completed', true);
                    await apiService.logMissionComplete(userName);
                    
                    // Log mission completion with additional details
                    await apiService.logEvent('mission_completed', {
                      userName,
                      groomAdviceProvided: false,
                      adviceLength: 0,
                      gameState: 'completed'
                    });
                    
                    setGameState('completed');
                  }}
                  className="w-full bg-gray-500 hover:bg-gray-600 text-white font-mono font-bold py-3 px-4 rounded border-2 border-gray-400 shadow-lg"
                  disabled={isTyping}
                >
                  ⏭️ SKIP
                </Button>
              </div>
            </div>
          )}
          
          {/* Desktop input for email collection state */}
          {gameState === 'email_collection' && !isTyping && !isMobile && (
            <form onSubmit={handleSubmit} className="terminal-input-form flex items-center mt-4 touch-manipulation">
              <span className="terminal-prompt text-green-400 mr-1 sm:mr-2 text-sm sm:text-base">&gt;</span>
              <span className={`terminal-cursor mr-1 ${showCursor ? 'opacity-100' : 'opacity-0'} text-green-400 text-sm sm:text-base`}>
                █
              </span>
              <Input
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                className="terminal-input flex-1 bg-transparent border-none text-green-400 focus:ring-0 focus:outline-none p-0 font-mono text-sm sm:text-base min-w-0"
                placeholder="Enter your email address..."
                autoFocus
                disabled={isTyping}
              />
              {renderSubmitButton()}
            </form>
          )}

          {/* Desktop input for address collection state */}
          {gameState === 'address_collection' && !isTyping && !isMobile && (
            <form onSubmit={handleSubmit} className="terminal-input-form flex items-center mt-4 touch-manipulation">
              <span className="terminal-prompt text-green-400 mr-1 sm:mr-2 text-sm sm:text-base">&gt;</span>
              <span className={`terminal-cursor mr-1 ${showCursor ? 'opacity-100' : 'opacity-0'} text-green-400 text-sm sm:text-base`}>
                █
              </span>
              <Input
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                className="terminal-input flex-1 bg-transparent border-none text-green-400 focus:ring-0 focus:outline-none p-0 font-mono text-sm sm:text-base min-w-0"
                placeholder="Enter your mailing address..."
                autoFocus
                disabled={isTyping}
              />
              {renderSubmitButton()}
            </form>
          )}

          {/* Desktop input for mission choice state */}
          {gameState === 'mission_choice' && !isTyping && !isMobile && (
            <form onSubmit={handleSubmit} className="terminal-input-form flex items-center mt-4 touch-manipulation">
              <span className="terminal-prompt text-green-400 mr-1 sm:mr-2 text-sm sm:text-base">&gt;</span>
              <span className={`terminal-cursor mr-1 ${showCursor ? 'opacity-100' : 'opacity-0'} text-green-400 text-sm sm:text-base`}>
                █
              </span>
              <Input
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                className="terminal-input flex-1 bg-transparent border-none text-green-400 focus:ring-0 focus:outline-none p-0 font-mono text-sm sm:text-base min-w-0"
                placeholder="Type Y for YES or N for NO..."
                autoFocus
                disabled={isTyping}
              />
              {renderSubmitButton()}
            </form>
          )}

          {/* Groom advice textarea for desktop */}
          {gameState === 'groom_advice' && !isTyping && !isMobile && (
            <div className="terminal-groom-advice mt-4">
              <div className="mb-2 text-green-400 text-sm sm:text-base">
                Enter your response below (or leave blank to skip):
              </div>
              <form onSubmit={handleSubmit} className="terminal-input-form">
                <Textarea
                  value={groomAdvice}
                  onChange={(e) => setGroomAdvice(e.target.value)}
                  className="terminal-textarea bg-transparent border-green-500 text-green-400 focus:ring-green-500 focus:border-green-400 font-mono text-sm sm:text-base resize-none"
                  placeholder="Share your advice or any funny stories about the bride or groom... Responses may or may not be shared in the groomsmen's group chat"
                  rows={4}
                  autoFocus
                  disabled={isTyping}
                />
                <div className="mt-3 flex gap-2">
                  <Button
                    type="submit"
                    className="bg-green-500 hover:bg-green-600 text-black font-mono font-bold py-2 px-4 rounded border-2 border-green-400 shadow-lg"
                    disabled={isTyping}
                  >
                    📝 SUBMIT
                  </Button>
                  <Button
                    type="button"
                    onClick={async () => {
                      setGroomAdvice('');
                      
                      // User skipped - log skip event
                      await apiService.logEvent('groom_advice_skipped', { userName });
                      await addLines(groomAdviceData.skip);
                      
                      // Update session as completed
                      await apiService.updateSession('completed', true);
                      await apiService.logMissionComplete(userName);
                      
                      // Log mission completion with additional details
                      await apiService.logEvent('mission_completed', {
                        userName,
                        groomAdviceProvided: false,
                        adviceLength: 0,
                        gameState: 'completed'
                      });
                      
                      setGameState('completed');
                    }}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-mono font-bold py-2 px-4 rounded border-2 border-gray-400 shadow-lg"
                    disabled={isTyping}
                  >
                    ⏭️ SKIP
                  </Button>
                </div>
              </form>
            </div>
          )}
          
          {/* Show typing indicator */}
          {isTyping && (
            <div className="terminal-typing-indicator text-green-400 animate-pulse text-sm sm:text-base">
              &gt; <span className="typing-dots animate-bounce">...</span>
            </div>
          )}
          
          {/* Mobile CTA Button for restart */}
          {gameState === 'completed' && !isTyping && isMobile && (
            <div className="mobile-cta-container mt-4">
              <Button
                onClick={async () => {
                  const input = 'restart';
                  setCurrentInput('');
                  
                  // Add user input to terminal
                  setLines(prev => [...prev, { text: `> ${input}`, type: 'user' }]);
                  
                  // Handle restart command
                  await restartTerminal();
                }}
                className="w-full bg-green-500 hover:bg-green-600 text-black font-mono font-bold py-3 px-4 rounded border-2 border-green-400 shadow-lg"
                disabled={isTyping}
              >
                🔄 RESTART MISSION
              </Button>
            </div>
          )}
          
          {/* Desktop input for restart */}
          {gameState === 'completed' && !isTyping && !isMobile && (
            <div className="terminal-restart-prompt mt-4 text-green-400 text-sm sm:text-base">
              <div className="mb-2">Type "restart" to experience the mission again.</div>
              <form onSubmit={handleSubmit} className="terminal-input-form flex items-center">
                <span className="terminal-prompt text-green-400 mr-1 sm:mr-2 text-sm sm:text-base">&gt;</span>
                <span className={`terminal-cursor mr-1 ${showCursor ? 'opacity-100' : 'opacity-0'} text-green-400 text-sm sm:text-base`}>
                  █
                </span>
                <Input
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  className="terminal-input flex-1 bg-transparent border-none text-green-400 focus:ring-0 focus:outline-none p-0 font-mono text-sm sm:text-base min-w-0"
                  placeholder="Type 'restart'..."
                  autoFocus
                />
                {renderSubmitButton()}
              </form>
            </div>
          )}
        </div>
        
        {/* Audio controls footer */}
        {!showAudioManager && (
          <div className="terminal-footer border-t border-green-500 p-2 sm:p-4 flex-shrink-0 bg-black">
            <AudioManager audio={audio} showDialog={false} />
          </div>
        )}
      </Card>
    </div>
  );
}