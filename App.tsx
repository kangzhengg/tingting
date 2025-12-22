
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Language, AppState } from './types';
import { TRANSLATIONS } from './constants';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Play from './pages/Play';
import Learn from './pages/Learn';
import Customize from './pages/Customize';
import Credits from './pages/Credits';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>({
    language: 'en',
    accentColor: '#fb923c', // Default Peach
    playerMarker: 'stone',
    characterType: 'boy',
    characterStyle: 'casual'
  });

  const updateLanguage = (lang: Language) => {
    setAppState(prev => ({ ...prev, language: lang }));
  };

  const updateColor = (color: string) => {
    setAppState(prev => ({ ...prev, accentColor: color }));
  };

  const updateMarker = (marker: AppState['playerMarker']) => {
    setAppState(prev => ({ ...prev, playerMarker: marker }));
  };

  const updateCharacterType = (type: AppState['characterType']) => {
    setAppState(prev => ({ ...prev, characterType: type }));
  };

  const updateCharacterStyle = (style: AppState['characterStyle']) => {
    setAppState(prev => ({ ...prev, characterStyle: style }));
  };

  const t = TRANSLATIONS[appState.language];

  return (
    <Router>
      <div className="min-h-screen flex flex-col transition-colors duration-500" style={{ backgroundColor: `${appState.accentColor}10` }}>
        <Navbar 
          language={appState.language} 
          setLanguage={updateLanguage} 
          accentColor={appState.accentColor}
          t={t}
        />
        
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home t={t} accentColor={appState.accentColor} />} />
            <Route path="/play" element={<Play appState={appState} t={t} />} />
            <Route path="/learn" element={<Learn appState={appState} t={t} />} />
            <Route path="/customize" element={<Customize 
              appState={appState} 
              updateColor={updateColor} 
              updateMarker={updateMarker} 
              updateCharacterType={updateCharacterType}
              updateCharacterStyle={updateCharacterStyle}
              t={t} 
            />} />
            <Route path="/credits" element={<Credits t={t} />} />
          </Routes>
        </main>

        <footer className="py-6 text-center text-gray-400 text-sm">
          &copy; 2024 Ting-Ting. {t.footerNote}
        </footer>
      </div>
    </Router>
  );
};

export default App;
