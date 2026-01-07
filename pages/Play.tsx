import React, { useState, useEffect, useRef } from 'react';
import { AppState, Translations, GamePhase } from '../types';
import { MARKERS } from '../constants';

const HOPS_SEQUENCE = [1, [2, 3], 4, [5, 6], 7, [8, 9], 10];
const SAFE_MIN = 25;
const SAFE_MAX = 75;

// Enhanced Sound Manager using Web Audio API for a more "juicy" feedback system
const createSoundManager = () => {
  let audioCtx: AudioContext | null = null;

  const init = () => {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  };

  const playSound = (params: {
    freq: number;
    type: OscillatorType;
    duration: number;
    volume?: number;
    pitchSlide?: number;
    harmonics?: boolean;
  }) => {
    init();
    if (!audioCtx) return;
    
    // Increased default volume to 0.3 for louder feedback
    const { freq, type, duration, volume = 0.3, pitchSlide = 0, harmonics = false } = params;
    const now = audioCtx.currentTime;
    
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    if (pitchSlide !== 0) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(1, freq + pitchSlide), now + duration);
    }
    
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(now + duration);

    // Add a quick secondary harmonic for "richer" sounds
    if (harmonics) {
        const osc2 = audioCtx.createOscillator();
        const gain2 = audioCtx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(freq * 2, now);
        gain2.gain.setValueAtTime(volume * 0.5, now);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + duration * 0.5);
        osc2.connect(gain2);
        gain2.connect(audioCtx.destination);
        osc2.start();
        osc2.stop(now + duration * 0.5);
    }
  };

  return {
    // A bouncy "pop" sound for landing - volume increased
    hop: () => {
      playSound({ freq: 150, type: 'sine', duration: 0.1, volume: 0.5, pitchSlide: 100, harmonics: true });
    },
    // A magical chime for picking up the marker - volume increased
    pickup: () => {
      const notes = [880, 1108, 1318, 1760];
      notes.forEach((f, i) => {
        setTimeout(() => playSound({ freq: f, type: 'triangle', duration: 0.2, volume: 0.25 }), i * 40);
      });
    },
    // A dissonant "uh-oh" slide - volume increased
    foul: () => {
      playSound({ freq: 200, type: 'sawtooth', duration: 0.4, volume: 0.3, pitchSlide: -150 });
      playSound({ freq: 120, type: 'square', duration: 0.4, volume: 0.2, pitchSlide: -100 });
    },
    // Celebratory melody for winning the whole game - volume increased
    win: () => {
      const melody = [523, 523, 659, 783, 659, 1046];
      const durs = [0.2, 0.2, 0.2, 0.2, 0.2, 0.6];
      melody.forEach((f, i) => {
        setTimeout(() => playSound({ freq: f, type: 'triangle', duration: durs[i], volume: 0.3, harmonics: true }), i * 200);
      });
    },
    // Sad melody for Game Over - volume increased
    gameOver: () => {
      const notes = [392, 370, 349, 311];
      notes.forEach((f, i) => {
        setTimeout(() => playSound({ freq: f, type: 'sawtooth', duration: 0.6, volume: 0.3, pitchSlide: -20 }), i * 300);
      });
    },
    // A bright "ding-ling" for clearing a level - volume increased
    levelUp: () => {
      playSound({ freq: 1046, type: 'sine', duration: 0.15, volume: 0.3, harmonics: true });
      setTimeout(() => playSound({ freq: 1567, type: 'sine', duration: 0.3, volume: 0.25, harmonics: true }), 100);
    }
  };
};

const sounds = createSoundManager();

const Row: React.FC<React.PropsWithChildren<{}>> = ({ children }) => (
  <div className="flex justify-center gap-2">
    {children}
  </div>
);

export const Character: React.FC<{ 
  accentColor: string; 
  type: 'boy' | 'girl'; 
  style: 'casual' | 'sporty' | 'fancy';
  age?: 'kid' | 'adult' | 'elderly';
  size?: 'sm' | 'md' | 'lg';
}> = ({ accentColor, type, style, age = 'kid', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-10 h-12',
    md: 'w-14 h-16 md:w-16 md:h-20',
    lg: 'w-24 h-28 md:w-32 md:h-36'
  };

  const faceSizeClasses = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10 md:w-12 md:h-12',
    lg: 'w-16 h-16 md:w-20 md:h-20'
  };

  const shirtColor = type === 'boy' ? '#3b82f6' : '#f472b6';
  const hairColor = age === 'elderly' ? '#e5e7eb' : '#1f2937';

  // Proportions based on age
  const ageStyles: React.CSSProperties = {
    transform: age === 'adult' ? 'scaleY(1.15)' : age === 'elderly' ? 'scaleY(0.95)' : 'scale(1)',
    transition: 'transform 0.3s ease'
  };

  return (
    <div className={`relative ${sizeClasses[size]} animate-character-bounce flex flex-col items-center justify-center`} style={ageStyles}>
      <div className="absolute -bottom-1 w-10 h-2.5 bg-black/10 rounded-full blur-[2px] animate-character-shadow"></div>
      
      <div className="relative z-20 -mb-2">
         {/* Hair and Head Shape */}
         {type === 'boy' ? (
           <div className={`absolute -top-1 left-1/2 -translate-x-1/2 w-4 h-5 rounded-full rotate-12 z-10`} style={{ backgroundColor: hairColor }}></div>
         ) : (
           <>
             <div className="absolute -left-3 top-3 w-5 h-5 rounded-full shadow-sm z-10" style={{ backgroundColor: hairColor }}></div>
             <div className="absolute -right-3 top-3 w-5 h-5 rounded-full shadow-sm z-10" style={{ backgroundColor: hairColor }}></div>
             <div className="absolute -top-2 right-0 w-4 h-4 rounded-full rotate-45 z-30 flex items-center justify-center" style={{ backgroundColor: accentColor }}>
                <div className="w-1 h-1 bg-white/50 rounded-full"></div>
             </div>
           </>
         )}

         {style === 'sporty' && (
           <div className="absolute top-2 left-0 right-0 h-2 bg-white/90 z-30 border-y border-black/5 flex items-center justify-center">
              <div className="w-full h-[1px] bg-gray-200"></div>
           </div>
         )}
         {style === 'fancy' && (
           <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-xl z-30 drop-shadow-sm animate-pulse">👑</div>
         )}
         
         <div className={`${faceSizeClasses[size]} bg-[#ffe4e1] rounded-full border-2 border-black/5 shadow-sm flex flex-col items-center justify-center overflow-hidden`}>
            {/* Elderly glasses */}
            {age === 'elderly' && (
              <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-center items-center gap-1 z-20 opacity-60">
                <div className="w-4 h-4 border border-black rounded-full"></div>
                <div className="w-4 h-4 border border-black rounded-full"></div>
              </div>
            )}
            
            <div className="flex gap-2.5 mt-1">
              <div className="w-2.5 h-2.5 bg-gray-900 rounded-full relative animate-blink">
                 <div className="absolute top-0.5 right-0.5 w-1 h-1 bg-white rounded-full"></div>
              </div>
              <div className="w-2.5 h-2.5 bg-gray-900 rounded-full relative animate-blink">
                 <div className="absolute top-0.5 right-0.5 w-1 h-1 bg-white rounded-full"></div>
              </div>
            </div>
            <div className="flex justify-between w-full px-2 mt-1">
              <div className="w-2.5 h-1.5 bg-pink-300 rounded-full opacity-60 animate-pulse"></div>
              <div className="w-2.5 h-1.5 bg-pink-300 rounded-full opacity-60 animate-pulse"></div>
            </div>
         </div>
      </div>

      <div 
        className="relative z-10 w-10 h-9 md:w-12 md:h-11 rounded-t-[1.8rem] rounded-b-xl border-b-4 border-black/15 shadow-md flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: shirtColor }}
      >
        {style === 'casual' && (
          <div className="w-6 h-3 border border-white/20 rounded-t-sm rounded-b-md mt-4 bg-white/10"></div>
        )}
        {style === 'sporty' && (
           <div className="flex gap-1 mt-2">
              <div className="w-1 h-6 bg-white/30 rounded-full"></div>
              <div className="w-1 h-6 bg-white/30 rounded-full"></div>
           </div>
        )}
        {style === 'fancy' && (
           <div className="absolute inset-0 flex items-center justify-center opacity-30">
              <div className="w-full h-[1px] bg-white rotate-45"></div>
              <div className="w-full h-[1px] bg-white -rotate-45"></div>
           </div>
        )}
        
        <div className="absolute -left-1 top-3 w-2.5 h-5 rounded-full border-r-2 border-black/5" style={{ backgroundColor: shirtColor }}></div>
        <div className="absolute -right-1 top-3 w-2.5 h-5 rounded-full border-l-2 border-black/5" style={{ backgroundColor: shirtColor }}></div>
      </div>
    </div>
  );
};

interface BoxProps {
  num: number;
  isMarker: boolean;
  isTarget: boolean;
  active: boolean;
  onClick: (num: number) => void;
  accentColor: string;
  markerEmoji?: string;
  isFoul?: boolean;
  appState: AppState;
}

const Box: React.FC<BoxProps> = ({ num, isMarker, isTarget, active, onClick, accentColor, markerEmoji, isFoul, appState }) => {
  return (
    <div 
      onClick={() => onClick(num)}
      className={`
        relative w-20 h-20 md:w-24 md:h-24 border-4 rounded-2xl flex items-center justify-center cursor-pointer transition-all duration-200 font-game text-2xl md:text-3xl
        ${active ? 'bg-white shadow-xl scale-110 z-10' : 'bg-white/30 hover:bg-white/50'}
        ${isTarget ? 'border-dashed animate-pulse' : 'border-gray-200'}
        ${isFoul && active ? 'bg-red-100 border-red-500 scale-95' : ''}
      `}
      style={active ? { borderColor: accentColor } : (isTarget ? { borderColor: accentColor } : {})}
    >
      <span className="absolute top-1 left-2 text-[10px] md:text-xs text-gray-400 font-sans">{num}</span>
      {isMarker && (
        <div className="absolute text-3xl md:text-4xl drop-shadow-md z-20">{markerEmoji}</div>
      )}
      {active && !isMarker && (
        <div className="flex items-center justify-center">
          <Character 
            accentColor={accentColor} 
            type={appState.characterType} 
            style={appState.characterStyle} 
            age={appState.characterAge} 
          />
        </div>
      )}
      {isTarget && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-12 h-12 border-2 border-dashed rounded-full animate-ping opacity-40" style={{ borderColor: accentColor }}></div>
        </div>
      )}
    </div>
  );
};

const Play: React.FC<{ appState: AppState; t: Translations }> = ({ appState, t }) => {
  const [level, setLevel] = useState(1);
  const [markerBox, setMarkerBox] = useState(1);
  const [phase, setPhase] = useState<GamePhase>('THROWING');
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');
  const [foulReason, setFoulReason] = useState<string | null>(null);
  const [foulEffect, setFoulEffect] = useState(false);
  const [balancePos, setBalancePos] = useState(50); 
  const [balanceDirection, setBalanceDirection] = useState(1);

  const selectedMarker = MARKERS.find(m => m.id === appState.playerMarker);
  const isInGreenZone = balancePos >= SAFE_MIN && balancePos <= SAFE_MAX;

  useEffect(() => {
    generateNewMarker();
  }, []);

  const generateNewMarker = () => {
    const allowedBoxes = [2, 3, 5, 6, 8, 9];
    const randomBox = allowedBoxes[Math.floor(Math.random() * allowedBoxes.length)];
    setMarkerBox(randomBox);
  };

  useEffect(() => {
    let interval: number;
    if (phase === 'HOPPING_OUT' || phase === 'HOPPING_BACK' || phase === 'PICKING_UP') {
      const speed = 0.8 + (level * 0.25);
      interval = window.setInterval(() => {
        setBalancePos(prev => {
          let next = prev + (balanceDirection * speed);
          if (next >= 100) { setBalanceDirection(-1); return 100; }
          if (next <= 0) { setBalanceDirection(1); return 0; }
          return next;
        });
      }, 16);
    }
    return () => clearInterval(interval);
  }, [phase, balanceDirection, level]);

  useEffect(() => {
    updateInstruction();
  }, [phase, level, currentStepIndex, lives, foulReason, t]);

  const updateInstruction = () => {
    if (lives <= 0) {
      setMessage(t.gameOver);
      return;
    }
    if (foulReason) {
      setMessage(foulReason);
      return;
    }
    switch (phase) {
      case 'THROWING': setMessage(`${t.level} ${level}: ${t.phaseThrowing}`); break;
      case 'HOPPING_OUT': setMessage(t.phaseHopping); break;
      case 'HOPPING_BACK': setMessage(t.phaseBack); break;
      case 'PICKING_UP': setMessage(t.phasePick); break;
      case 'FINISHED_ROUND': setMessage(t.phaseClear); break;
    }
  };

  const triggerFoul = (reason: string) => {
    sounds.foul();
    setFoulEffect(true);
    setFoulReason(reason);
    setLives(prev => {
        const nextLives = prev - 1;
        if (nextLives <= 0) {
          setPhase('GAME_OVER');
          sounds.gameOver();
        }
        return nextLives;
    });
    setTimeout(() => {
      setFoulEffect(false);
      setFoulReason(null);
    }, 800);
  };

  const handleBoxClick = (clickedBox: number) => {
    if (phase === 'GAME_OVER' || (phase === 'FINISHED_ROUND' && level === 10)) {
      setLevel(1);
      setLives(3);
      setScore(0);
      setPhase('THROWING');
      setCurrentStepIndex(-1);
      setBalancePos(50);
      generateNewMarker();
      return;
    }

    if (foulEffect) return;

    if (phase === 'THROWING') {
      if (clickedBox === markerBox) {
        sounds.hop();
        setPhase('HOPPING_OUT');
        setScore(prev => prev + 100);
        let nextIndex = 0;
        const firstStep = HOPS_SEQUENCE[nextIndex];
        if (firstStep === markerBox) nextIndex = 1;
        setCurrentStepIndex(nextIndex);
      } else {
        triggerFoul(t.missedThrow);
      }
      return;
    }

    if (phase === 'HOPPING_OUT' || phase === 'HOPPING_BACK' || phase === 'PICKING_UP') {
      if (!isInGreenZone) {
        triggerFoul(t.lostBalance);
        return;
      }

      if (phase === 'PICKING_UP') {
        if (clickedBox === markerBox) {
          sounds.pickup();
          setScore(prev => prev + 200);
          let nextIndex = currentStepIndex - 1;
          if (nextIndex < 0) completeRound();
          else {
            setPhase('HOPPING_BACK');
            setCurrentStepIndex(nextIndex);
          }
        } else triggerFoul(t.wrongBox);
        return;
      }

      const currentStep = HOPS_SEQUENCE[currentStepIndex];
      if (currentStep === undefined) return;

      const validForStep: number[] = Array.isArray(currentStep) 
        ? currentStep.filter(b => b !== markerBox)
        : (currentStep === markerBox ? [] : [currentStep]);

      if (validForStep.includes(clickedBox)) {
        sounds.hop();
        setScore(prev => prev + 50);
        if (phase === 'HOPPING_OUT') {
          if (currentStepIndex === HOPS_SEQUENCE.length - 1) {
            setPhase('HOPPING_BACK');
            if (Array.isArray(currentStep) && currentStep.includes(markerBox)) setPhase('PICKING_UP');
            else setCurrentStepIndex(HOPS_SEQUENCE.length - 2);
          } else {
            let nextIndex = currentStepIndex + 1;
            const nextStepVal = HOPS_SEQUENCE[nextIndex];
            if (!Array.isArray(nextStepVal) && nextStepVal === markerBox) nextIndex++;
            if (nextIndex >= HOPS_SEQUENCE.length) {
              setPhase('HOPPING_BACK');
              setCurrentStepIndex(HOPS_SEQUENCE.length - 2);
            } else setCurrentStepIndex(nextIndex);
          }
        } else {
          let nextIndex = currentStepIndex - 1;
          if (nextIndex >= 0) {
            const nextStep = HOPS_SEQUENCE[nextIndex];
            if (nextStep === markerBox || (Array.isArray(nextStep) && nextStep.includes(markerBox))) setPhase('PICKING_UP');
            else setCurrentStepIndex(nextIndex);
          } else completeRound();
        }
      } else {
        if (clickedBox === markerBox) triggerFoul(t.steppedMarker);
        else triggerFoul(t.steppedOutside);
      }
    }
  };

  const completeRound = () => {
    sounds.levelUp();
    setPhase('FINISHED_ROUND');
    setScore(prev => prev + 500);
    setTimeout(() => {
      if (level < 10) {
        setLevel(prev => prev + 1);
        setPhase('THROWING');
        setCurrentStepIndex(-1);
        setBalancePos(50);
        generateNewMarker();
      } else {
          setPhase('GAME_OVER');
          sounds.win();
      }
    }, 1000);
  };

  const getTargetBoxes = () => {
    if (phase === 'THROWING') return [markerBox];
    if (phase === 'PICKING_UP') return [markerBox];
    const step = HOPS_SEQUENCE[currentStepIndex];
    if (step === undefined) return [];
    if (Array.isArray(step)) return step.filter(b => b !== markerBox);
    return boxMatchesMarker(step) ? [] : [step];
  };

  const boxMatchesMarker = (step: any) => step === markerBox;

  const targetBoxes = getTargetBoxes();

  return (
    <div className={`max-w-4xl mx-auto pb-20 transition-all duration-300 ${foulEffect ? 'bg-red-50' : ''}`}>
      <div className="sticky top-16 z-40 bg-white/95 backdrop-blur-md p-4 mb-6 rounded-2xl shadow-xl border border-gray-100 flex flex-col gap-4">
        <div className="grid grid-cols-3 items-start px-2">
          <div className="flex flex-col items-start">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{t.lives}</span>
            <div className="flex items-center gap-1">
              {[...Array(3)].map((_, i) => (
                <span key={i} className={`text-xl transition-all duration-300 ${i < lives ? 'scale-110' : 'scale-75 opacity-20'}`}>❤️</span>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{t.level}</span>
            <div className="flex items-center gap-2">
               <span className="text-2xl font-game" style={{ color: appState.accentColor }}>{level}</span>
               <span className="font-bold text-[10px] text-gray-300 uppercase tracking-tighter">/ 10</span>
            </div>
          </div>
          <div className="flex flex-col items-end text-right">
             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{t.score}</span>
             <div className="text-xl font-game text-gray-800 leading-tight">{score}</div>
          </div>
        </div>
        {(phase === 'HOPPING_OUT' || phase === 'HOPPING_BACK' || phase === 'PICKING_UP') ? (
          <div className="px-2">
            <div className="h-8 w-full bg-gray-100 rounded-full relative overflow-hidden border border-gray-200 flex items-center shadow-inner">
              <div className="absolute left-[5%] text-[8px] font-black text-red-400 uppercase pointer-events-none">{t.balanceUnsafe}</div>
              <div className="absolute left-[50%] -translate-x-1/2 text-[8px] font-black text-green-700 uppercase pointer-events-none z-10">{t.balanceSafe}</div>
              <div className="absolute right-[5%] text-[8px] font-black text-red-400 uppercase pointer-events-none">{t.balanceUnsafe}</div>
              
              <div 
                className="absolute h-full bg-green-500/15 border-x border-green-500/20" 
                style={{ left: `${SAFE_MIN}%`, width: `${SAFE_MAX - SAFE_MIN}%` }}
              ></div>
              
              <div className="absolute h-full w-[1px] bg-gray-300 z-0" style={{ left: `${SAFE_MIN}%` }}></div>
              <div className="absolute h-full w-[1px] bg-gray-300 z-0" style={{ left: `${SAFE_MAX}%` }}></div>

              <div 
                className={`absolute h-5 w-5 rounded-full border-2 shadow-sm z-20 ${isInGreenZone ? 'bg-green-500 border-green-600' : 'bg-red-500 border-red-600'}`} 
                style={{ left: `calc(${balancePos}% - 10px)` }}
              ></div>
            </div>
          </div>
        ) : (
          <div className="h-8 flex items-center justify-center text-sm font-bold text-gray-400 animate-pulse bg-gray-50/50 rounded-xl uppercase tracking-widest">
            {lives > 0 ? message : t.tryAgain}
          </div>
        )}
      </div>

      <div className="flex flex-col items-center justify-center gap-4">
        {(phase !== 'THROWING' && lives > 0) && (
          <div className={`px-6 py-2 rounded-full font-bold text-sm shadow-sm transition-colors ${isInGreenZone ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
            {isInGreenZone ? t.balanced : t.wait}
          </div>
        )}

        <div className={`relative p-6 bg-white/50 rounded-[3.5rem] border-8 border-white shadow-2xl transition-transform ${foulEffect ? 'animate-shake' : ''}`}>
          <div className="space-y-2">
            {[10, [8, 9], 7, [5, 6], 4, [2, 3], 1].map((row, idx) => (
              <Row key={idx}>
                {Array.isArray(row) ? row.map(num => (
                  <Box key={num} num={num} isMarker={markerBox === num} isTarget={targetBoxes.includes(num)} active={isBoxInStep(num, HOPS_SEQUENCE[currentStepIndex])} onClick={handleBoxClick} accentColor={appState.accentColor} markerEmoji={selectedMarker?.emoji} isFoul={foulEffect} appState={appState} />
                )) : (
                  <Box num={row} isMarker={markerBox === row} isTarget={targetBoxes.includes(row)} active={isBoxInStep(row, HOPS_SEQUENCE[currentStepIndex])} onClick={handleBoxClick} accentColor={appState.accentColor} markerEmoji={selectedMarker?.emoji} isFoul={foulEffect} appState={appState} />
                )}
              </Row>
            ))}
          </div>
        </div>

        {(phase === 'GAME_OVER' || (phase === 'FINISHED_ROUND' && level === 10)) && (
           <div className="fixed inset-0 z-50 bg-gray-900/70 backdrop-blur-md flex items-center justify-center p-6">
              <div className="bg-white p-10 rounded-[3.5rem] text-center max-w-sm w-full shadow-2xl border-4" style={{ borderColor: appState.accentColor }}>
                 <div className="text-7xl mb-6">{lives <= 0 ? '😵' : (level === 10 && phase === 'FINISHED_ROUND' ? '👑' : '😵')}</div>
                 <h2 className="font-game text-4xl mb-3 text-gray-800">{(level === 10 && phase === 'FINISHED_ROUND') ? t.champion : t.gameOver}</h2>
                 <div className="bg-gray-50 rounded-2xl p-4 mb-8">
                    <div className="text-xs font-bold text-gray-400 uppercase mb-1">{t.totalPoints}</div>
                    <div className="text-4xl font-game" style={{ color: appState.accentColor }}>{score}</div>
                 </div>
                 <button onClick={() => handleBoxClick(0)} className="w-full py-5 rounded-2xl text-white font-game text-xl shadow-xl hover:scale-105 transition-all active:scale-95 uppercase" style={{ backgroundColor: appState.accentColor }}>{lives <= 0 ? t.tryAgain : t.playNow}</button>
              </div>
           </div>
        )}
      </div>
      
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-8px); }
          80% { transform: translateX(8px); }
        }
        @keyframes character-bounce {
          0%, 100% { transform: translateY(0) scaleX(1); }
          50% { transform: translateY(-15px) scaleX(0.95); }
        }
        @keyframes character-shadow {
          0%, 100% { transform: scaleX(1); opacity: 0.1; }
          50% { transform: scaleX(0.7); opacity: 0.05; }
        }
        @keyframes blink {
          0%, 90%, 100% { transform: scaleY(1); }
          95% { transform: scaleY(0.1); }
        }
        .animate-shake { animation: shake 0.3s cubic-bezier(.36,.07,.19,.97) both; }
        .animate-character-bounce { animation: character-bounce 0.5s infinite ease-in-out; }
        .animate-character-shadow { animation: character-shadow 0.5s infinite ease-in-out; }
        .animate-blink { animation: blink 4s infinite; }
      `}</style>
    </div>
  );
};

const isBoxInStep = (box: number, step: number | number[] | undefined) => {
  if (step === undefined) return false;
  if (Array.isArray(step)) return step.includes(box);
  return step === box;
};

export default Play;