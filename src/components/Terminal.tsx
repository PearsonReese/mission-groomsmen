import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AudioManager } from '@/components/AudioManager';
import { useAudio } from '@/hooks/useAudio';
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
  easterEggs
} from '@/utils/missionData';

interface TerminalLine {
  text: string;
  type: 'system' | 'user' | 'error' | 'success' | 'classified';
  delay?: number;
}

type GameState = 'intro' | 'name_input' | 'swann_disambiguation' | 'swann_second_question' | 'howard_gender' | 'best_man_authentication' | 'verification' | 'authentication' | 'mission_choice' | 'completed';

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
      'howard_gender', 
      'best_man_authentication', 
      'verification', 
      'authentication', 
      'mission_choice',
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
      'howard_gender', 
      'best_man_authentication', 
      'verification', 
      'authentication', 
      'mission_choice',
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
  };

  // Check for magic string easter eggs
  const checkMagicStrings = async (input: string) => {
    const inputLower = input.toLowerCase();
    
    for (const [magicString, easterEgg] of Object.entries(easterEggs.magicStrings)) {
      if (inputLower.includes(magicString.toLowerCase())) {
        await addLines(easterEgg.message);
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

  // Restart the terminal experience
  const restartTerminal = async () => {
    setLines([]);
    setCurrentInput('');
    setGameState('intro');
    setUserName('');
    setIsTyping(false);
    introStartedRef.current = false;
    
    // Scroll to top of terminal
    if (terminalRef.current) {
      terminalRef.current.scrollTop = 0;
    }
    
    await addLines(terminalMessages.restart);
    await startIntroSequence();
  };

  // Enhanced fuzzy name matching for full names
  const findMatchingGroomsman = (input: string): string | null => {
    const inputLower = input.toLowerCase().trim();
    
    // Exact match first
    const exactMatch = groomsmenNames.find(name => 
      name.toLowerCase() === inputLower
    );
    if (exactMatch) return exactMatch;

    // Try to match against each groomsman
    const fuzzyMatch = groomsmenNames.find(name => {
      const fullNameLower = name.toLowerCase();
      const nameParts = fullNameLower.split(' ');
      const inputParts = inputLower.split(' ');
      
      // Check if input matches first name only
      if (inputParts.length === 1) {
        const inputWord = inputParts[0];
        const firstName = nameParts[0];
        // Match first name exactly or partially
        if (firstName && inputWord && (firstName.startsWith(inputWord) || firstName.includes(inputWord))) {
          return true;
        }
        // Also check if it matches the last name
        if (nameParts.length > 1) {
          const lastName = nameParts[1];
          if (lastName && inputWord && (lastName.startsWith(inputWord) || lastName.includes(inputWord))) {
            return true;
          }
        }
      }
      
      // Check if input matches multiple parts (first + last name)
      if (inputParts.length >= 2) {
        const firstName = nameParts[0];
        const inputFirstName = inputParts[0];
        // Try to match first name and last name
        const firstNameMatch = firstName && inputFirstName && (firstName.includes(inputFirstName) || inputFirstName.includes(firstName));
        const lastNameMatch = nameParts.length > 1 && (() => {
          const lastName = nameParts[1];
          const inputLastName = inputParts[1];
          return lastName && inputLastName && (lastName.includes(inputLastName) || inputLastName.includes(lastName));
        })();
        if (firstNameMatch && lastNameMatch) {
          return true;
        }
      }
      
      // Fallback: check if any input part matches any name part
      return nameParts.some(namePart => 
        inputParts.some(inputPart => 
          namePart.includes(inputPart) || inputPart.includes(namePart)
        )
      );
    });
    
    return fuzzyMatch || null;
  };

  // Check if input matches multiple Swann family members
  const findAllSwannMatches = (input: string): string[] => {
    const inputLower = input.toLowerCase().trim();
    
    return specialPersons.swannFamily.names.filter(name => {
      const fullNameLower = name.toLowerCase();
      const nameParts = fullNameLower.split(' ');
      const firstName = nameParts[0];
      
      // Check if input matches first name or last name or is just "swann"
      if (inputLower === 'swann' || 
          (firstName && (firstName.startsWith(inputLower) || 
          firstName.includes(inputLower) ||
          inputLower.includes(firstName)))) {
        return true;
      }
      
      return false;
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
      const authorizedUser = groomsmenNames.some(name => name.toLowerCase() === userName.toLowerCase());
      
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
        // Check for easter egg celebrity flows first
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
            default:
              break;
          }
          
          if (easterEggData && easterEggName) {
            setUserName(easterEggName);
            
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
            setGameState('authentication');
            return;
          }
        }
        
        // Check for Swann disambiguation first
        const swannMatches = findAllSwannMatches(input);
        
        if (swannMatches.length > 1) {
          // Multiple Swann family members detected - ask disambiguation question
          setPendingSwanns(swannMatches);
          const disambiguationLines = [
            ...terminalMessages.swannDisambiguation,
            { text: specialPersons.swannFamily.firstQuestion, type: 'system' as const, delay: 800 }
          ];
          
          await addLines(disambiguationLines);
          setGameState('swann_disambiguation');
          break;
        }
        
        const matchedName = findMatchingGroomsman(input);
        setUserName(matchedName || input);

        // Special case: last name Howard - ask for gender to determine flow
        const inputLower = input.toLowerCase().trim();
        const isHoward = inputLower === 'howard' || inputLower.endsWith(' howard');
        const isEmma = inputLower === 'emma howard';
        if (isHoward && !isEmma) {
          const howardGenderLines: TerminalLine[] = [
            { text: '', type: 'system', delay: 500 },
            { text: '🛡️  HOWARD FAMILY CONNECTION DETECTED', type: 'classified', delay: 800 },
            { text: '', type: 'system', delay: 500 },
            { text: 'Multiple Howard family members detected in system...', type: 'system', delay: 800 },
            { text: 'Please specify your gender for proper authentication:', type: 'system', delay: 800 },
            { text: '', type: 'system', delay: 300 },
            { text: 'Type M for MALE or F for FEMALE:', type: 'system', delay: 600 }
          ];
          await addLines(howardGenderLines);
          setGameState('howard_gender');
          break;
        }

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
          // Check for close matches to provide helpful feedback
          const inputLower = input.toLowerCase();
          const possibleMatches = groomsmenNames.filter(name => {
            const nameLower = name.toLowerCase();
            const firstName = nameLower.split(' ')[0] || '';
            const lastName = nameLower.split(' ')[1] || '';
            
            // Check for partial matches
            return firstName.includes(inputLower) || 
                   lastName.includes(inputLower) || 
                   inputLower.includes(firstName) ||
                   (lastName && inputLower.includes(lastName));
          });

          authLines.push(
            { text: `❌ IDENTITY NOT IN DATABASE: ${input.toUpperCase()}`, type: 'error', delay: 800 },
            ...(terminalMessages.errors.unauthorized as TerminalLine[])
          );

          if (possibleMatches.length > 0) {
            authLines.push(
              { text: '', type: 'system', delay: 500 },
              { text: `💡 Did you mean: ${possibleMatches[0]}?`, type: 'system', delay: 800 },
              { text: 'Please try entering your full name as it appears on the groomsman list.', type: 'system', delay: 800 }
            );
          }

          authLines.push(...(terminalMessages.errors.lockdown as TerminalLine[]));
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
          // Unauthorized access - no further progression
          await addLines(authLines);
          setGameState('completed'); // Lock them out, don't allow progression
        }
        break;

      case 'howard_gender':
        const gender = input.toLowerCase().trim();
        
        if (gender === 'm' || gender === 'male') {
          // Will Howard - groomsman flow
          setUserName('Will Howard');
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
        } else if (gender === 'f' || gender === 'female') {
          // Emma Howard - fiancée flow
          setUserName('Emma Howard');
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
        } else {
          // Invalid gender response
          const errorLines: TerminalLine[] = [
            { text: '', type: 'system', delay: 300 },
            { text: '⚠️  INVALID GENDER RESPONSE', type: 'error', delay: 600 },
            { text: 'Please type M for MALE or F for FEMALE:', type: 'system', delay: 600 }
          ];
          await addLines(errorLines);
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
          // Only Beau answers yes - go directly to authentication
          const identifiedSwann = specialPersons.swannFamily.firstAnswers.yes;
          setUserName(identifiedSwann);
          
          const swannAuthLines = [
            ...terminalMessages.swannConfirmation,
            { text: `✓ IDENTITY CONFIRMED: ${identifiedSwann.toUpperCase()}`, type: 'success' as const, delay: 800 },
            ...terminalMessages.authentication.success.standard,
            { text: '', type: 'system' as const, delay: 800 },
            { text: `WELCOME, AGENT ${identifiedSwann.toUpperCase()}`, type: 'classified' as const, delay: 1000 },
            { text: '', type: 'system' as const, delay: 500 },
            { text: terminalMessages.authentication.prompts.standard, type: 'system' as const, delay: 800 }
          ];

          await addLines(swannAuthLines);
          setGameState('authentication');
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
            ...terminalMessages.bestManAuthentication,
            { text: specialPersons.bestMan.securityQuestion, type: 'system' as const, delay: 800 },
            { text: '', type: 'system' as const, delay: 300 },
            { text: 'Enter your response:', type: 'system' as const, delay: 600 }
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
          
          if (currentAttempts >= verificationData.maxAttempts) {
            // Max attempts exceeded - lockout
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
        
        // Special responses for easter egg flows first
        if (userName.toLowerCase() === 'tom cruise') {
          if (choice === 'y' || choice === 'yes') {
            await addLines(easterEggs.tomCruise.responses.accept as TerminalLine[]);
            setGameState('completed');
            break;
          } else if (choice === 'n' || choice === 'no') {
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
            await addLines(easterEggs.ethanHunt.responses.accept as TerminalLine[]);
            setGameState('completed');
            break;
          } else if (choice === 'n' || choice === 'no') {
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
            await addLines(easterEggs.pearsonReese.responses.accept as TerminalLine[]);
            setGameState('completed');
            break;
          } else if (choice === 'n' || choice === 'no') {
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
            await addLines(easterEggs.jordanSwann.responses.accept as TerminalLine[]);
            setGameState('completed');
            break;
          } else if (choice === 'n' || choice === 'no') {
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
            await addLines(brideContent.responses.accept as TerminalLine[]);
            setGameState('completed');
            break;
          } else if (choice === 'n' || choice === 'no') {
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
            await addLines(bestManContent.responses.accept as TerminalLine[]);
            setGameState('completed');
            break;
          } else if (choice === 'n' || choice === 'no') {
            await addLines(bestManContent.responses.decline as TerminalLine[]);
            break;
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
        
        if (choice === 'y' || choice === 'yes') {
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
          setGameState('completed');
        } else if (choice === 'n' || choice === 'no') {
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
          await addLines(terminalMessages.errors.invalidResponse as TerminalLine[]);
        }
        break;
    }
  };

  const getLineClass = (type: TerminalLine['type']) => {
    switch (type) {
      case 'user':
        return 'text-blue-400';
      case 'error':
        return 'text-red-400';
      case 'success':
        return 'text-green-400';
      case 'classified':
        return 'text-yellow-400 font-bold';
      default:
        return 'text-green-400';
    }
  };

  return (
    <div className="terminal-app-container h-screen w-screen bg-black p-2 sm:p-4 font-mono flex flex-col overflow-hidden">
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
      
      <Card className="terminal-card flex-1 flex flex-col w-full max-w-none sm:max-w-4xl mx-auto bg-black border-green-500 border-2 shadow-2xl shadow-green-500/20 min-h-0 max-h-full">
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
          {(gameState === 'name_input' || gameState === 'howard_gender' || gameState === 'best_man_authentication') && !isTyping && (
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
                placeholder=""
                autoFocus
                disabled={isTyping}
              />
            </form>
          )}
          
          {/* Mobile CTA Buttons for Swann disambiguation */}
          {gameState === 'swann_disambiguation' && !isTyping && isMobile && (
            <div className="mobile-cta-container mt-4 space-y-3">
              <Button
                onClick={async () => {
                  const answer = 'y';
                  setCurrentInput('');
                  
                  // Add user input to terminal
                  setLines(prev => [...prev, { text: `> ${answer}`, type: 'user' }]);
                  
                  // Only Beau answers yes - go directly to authentication
                  const identifiedSwann = specialPersons.swannFamily.firstAnswers.yes;
                  setUserName(identifiedSwann);
                  
                  const swannAuthLines = [
                    ...terminalMessages.swannConfirmation,
                    { text: `✓ IDENTITY CONFIRMED: ${identifiedSwann.toUpperCase()}`, type: 'success' as const, delay: 800 },
                    ...terminalMessages.authentication.success.standard,
                    { text: '', type: 'system' as const, delay: 800 },
                    { text: `WELCOME, AGENT ${identifiedSwann.toUpperCase()}`, type: 'classified' as const, delay: 1000 },
                    { text: '', type: 'system' as const, delay: 500 },
                    { text: terminalMessages.authentication.prompts.standard, type: 'system' as const, delay: 800 }
                  ];

                  await addLines(swannAuthLines);
                  setGameState('authentication');
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

                  await addLines(jordanSwannAuthLines);
                  setGameState('authentication');
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
                    ...terminalMessages.bestManAuthentication,
                    { text: specialPersons.bestMan.securityQuestion, type: 'system' as const, delay: 800 },
                    { text: '', type: 'system' as const, delay: 300 },
                    { text: 'Enter your response:', type: 'system' as const, delay: 600 }
                  ];
                  
                  await addLines(bestManAuthLines);
                  setGameState('best_man_authentication');
                }}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-mono font-bold py-3 px-4 rounded border-2 border-blue-400 shadow-lg"
                disabled={isTyping}
              >
                ❌ NO
              </Button>
            </div>
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
            </form>
          )}

          {/* Mobile CTA Buttons for verification state */}
          {gameState === 'verification' && !isTyping && isMobile && (
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
                    setGameState('authentication');
                  } else {
                    // Incorrect answer
                    const currentAttempts = verificationAttempts + 1;
                    setVerificationAttempts(currentAttempts);
                    
                    if (currentAttempts >= verificationData.maxAttempts) {
                      // Max attempts exceeded - lockout
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
                    setGameState('authentication');
                  } else {
                    // Incorrect answer
                    const currentAttempts = verificationAttempts + 1;
                    setVerificationAttempts(currentAttempts);
                    
                    if (currentAttempts >= verificationData.maxAttempts) {
                      // Max attempts exceeded - lockout
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
                  const authorizedUser = groomsmenNames.some(name => name.toLowerCase() === userName.toLowerCase());
                  
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
                  
                  // Handle the authentication case - check if it's Emma for special briefing
                  if (userName.toLowerCase() === specialPersons.bride.name.toLowerCase()) {
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
                  : userName.toLowerCase() === specialPersons.bride.name.toLowerCase() 
                  ? '💍 RECEIVE FIANCÉE BRIEFING' 
                  : userName.toLowerCase() === specialPersons.bestMan.name.toLowerCase()
                  ? '🎖️ RECEIVE BEST MAN BRIEFING'
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
                    await addLines(easterEggs.tomCruise.responses.accept as TerminalLine[]);
                    setGameState('completed');
                    return;
                  }
                  
                  if (userName.toLowerCase() === 'ethan hunt') {
                    await addLines(easterEggs.ethanHunt.responses.accept as TerminalLine[]);
                    setGameState('completed');
                    return;
                  }
                  
                  if (userName.toLowerCase() === 'pearson reese') {
                    await addLines(easterEggs.pearsonReese.responses.accept as TerminalLine[]);
                    setGameState('completed');
                    return;
                  }
                  
                  // Special responses for Emma (the bride!)
                  if (userName.toLowerCase() === specialPersons.bride.name.toLowerCase()) {
                    await addLines(brideContent.responses.accept as TerminalLine[]);
                    setGameState('completed');
                    return;
                  }
                  
                  // Special responses for Best Man
                  if (userName.toLowerCase() === specialPersons.bestMan.name.toLowerCase()) {
                    await addLines(bestManContent.responses.accept as TerminalLine[]);
                    setGameState('completed');
                    return;
                  }
                  
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
                  setGameState('completed');
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
                    await addLines(easterEggs.tomCruise.responses.decline as TerminalLine[]);
                    return;
                  }
                  
                  if (userName.toLowerCase() === 'ethan hunt') {
                    await addLines(easterEggs.ethanHunt.responses.decline as TerminalLine[]);
                    return;
                  }
                  
                  if (userName.toLowerCase() === 'pearson reese') {
                    await addLines(easterEggs.pearsonReese.responses.decline as TerminalLine[]);
                    return;
                  }
                  
                  // Special responses for Emma (the bride!)
                  if (userName.toLowerCase() === specialPersons.bride.name.toLowerCase()) {
                    await addLines(brideContent.responses.decline as TerminalLine[]);
                    return;
                  }
                  
                  // Special responses for Best Man
                  if (userName.toLowerCase() === specialPersons.bestMan.name.toLowerCase()) {
                    await addLines(bestManContent.responses.decline as TerminalLine[]);
                    return;
                  }
                  
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
            </form>
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