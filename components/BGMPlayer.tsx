
import React, { useState, useEffect, useRef } from 'react';

const BGMPlayer: React.FC<{ accentColor: string }> = ({ accentColor }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3); // Default volume (0 to 1)
  const [showControls, setShowControls] = useState(false);
  
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const timerRef = useRef<number | null>(null);

  const NOTES = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25]; // C Major Pentatonic
  const MELODY = [0, 2, 4, 3, 2, 5, 4, 3]; // Note indices

  // Initialize Audio Context and Master Gain
  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      masterGainRef.current = audioCtxRef.current.createGain();
      masterGainRef.current.connect(audioCtxRef.current.destination);
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    // Set initial master volume
    if (masterGainRef.current) {
      masterGainRef.current.gain.setValueAtTime(volume * 0.2, audioCtxRef.current.currentTime);
    }
  };

  // Sync master gain when volume state changes
  useEffect(() => {
    if (masterGainRef.current && audioCtxRef.current) {
      masterGainRef.current.gain.setTargetAtTime(volume * 0.2, audioCtxRef.current.currentTime, 0.1);
    }
  }, [volume]);

  const playNote = (freq: number, startTime: number, duration: number) => {
    if (!audioCtxRef.current || !masterGainRef.current) return;
    
    const osc = audioCtxRef.current.createOscillator();
    const noteGain = audioCtxRef.current.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);

    // Note envelope
    noteGain.gain.setValueAtTime(0, startTime);
    noteGain.gain.linearRampToValueAtTime(0.5, startTime + 0.1); 
    noteGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.connect(noteGain);
    noteGain.connect(masterGainRef.current);

    osc.start(startTime);
    osc.stop(startTime + duration);
  };

  const startBGM = () => {
    initAudio();

    let step = 0;
    const scheduleNext = () => {
      if (!audioCtxRef.current) return;
      
      const secondsPerBeat = 0.6; 
      const now = audioCtxRef.current.currentTime;
      
      // Play a base chord every 4 beats
      if (step % 4 === 0) {
        playNote(NOTES[0] / 2, now, secondsPerBeat * 4);
        playNote(NOTES[2] / 2, now, secondsPerBeat * 4);
      }

      // Play melody note
      const noteFreq = NOTES[MELODY[step % MELODY.length]];
      playNote(noteFreq, now, secondsPerBeat * 1.5);

      step++;
      timerRef.current = window.setTimeout(scheduleNext, secondsPerBeat * 1000);
    };

    scheduleNext();
    setIsPlaying(true);
  };

  const stopBGM = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsPlaying(false);
  };

  const toggleBGM = () => {
    if (isPlaying) stopBGM();
    else startBGM();
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div 
      className="fixed bottom-6 right-6 z-[60] flex flex-col items-center gap-3"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Volume Slider Container */}
      <div 
        className={`bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-gray-100 transition-all duration-300 origin-bottom ${
          showControls && isPlaying ? 'scale-100 opacity-100 translate-y-0' : 'scale-0 opacity-0 translate-y-4'
        }`}
      >
        <div className="flex flex-col items-center gap-2">
           <span className="text-[10px] font-bold text-gray-400 uppercase">Volume</span>
           <input 
             type="range" 
             min="0" 
             max="1" 
             step="0.01" 
             value={volume} 
             onChange={(e) => setVolume(parseFloat(e.target.value))}
             className="h-24 w-1 accent-gray-800 cursor-pointer"
             style={{ writingMode: 'bt-lr', WebkitAppearance: 'slider-vertical' } as any}
           />
           <span className="text-[10px] font-bold text-gray-800">{Math.round(volume * 100)}%</span>
        </div>
      </div>

      {/* Main Toggle Button */}
      <button
        onClick={toggleBGM}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 group hover:scale-110 active:scale-95 ${
          isPlaying ? 'bg-white' : 'bg-gray-800'
        }`}
        style={isPlaying ? { border: `3px solid ${accentColor}` } : {}}
      >
        <span className={`text-2xl transition-transform ${isPlaying ? 'animate-bounce' : 'opacity-50'}`}>
          {isPlaying ? '🎵' : '🔇'}
        </span>
        
        {/* Pulse effect when playing */}
        {isPlaying && (
          <div className="absolute inset-0 rounded-full animate-ping opacity-20 pointer-events-none" style={{ backgroundColor: accentColor }}></div>
        )}
        
        {/* Tooltip */}
        {!showControls && (
          <div className="absolute bottom-full mb-3 right-0 bg-gray-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            {isPlaying ? 'Music Settings' : 'Play Background Music'}
          </div>
        )}
      </button>
    </div>
  );
};

export default BGMPlayer;
