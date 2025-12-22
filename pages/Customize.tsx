
import React from 'react';
import { AppState, Translations } from '../types';
import { COLORS, MARKERS, CHARACTER_TYPES, CHARACTER_STYLES } from '../constants';
import { Character } from './Play';

interface CustomizeProps {
  appState: AppState;
  updateColor: (color: string) => void;
  updateMarker: (marker: AppState['playerMarker']) => void;
  updateCharacterType: (type: AppState['characterType']) => void;
  updateCharacterStyle: (style: AppState['characterStyle']) => void;
  t: Translations;
}

const Customize: React.FC<CustomizeProps> = ({ 
  appState, 
  updateColor, 
  updateMarker, 
  updateCharacterType, 
  updateCharacterStyle,
  t 
}) => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="font-game text-5xl text-gray-800 mb-12 text-center">{t.customizeHeader}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* Character Preview Section */}
        <section className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-50 flex flex-col items-center justify-center">
           <h2 className="font-game text-2xl mb-8 self-start flex items-center gap-3">
            <span>✨</span> {t.characterHeader}
          </h2>
          <div className="mb-8 scale-150 py-10">
             <Character 
               accentColor={appState.accentColor} 
               type={appState.characterType} 
               style={appState.characterStyle} 
               size="lg"
             />
          </div>
          
          <div className="w-full space-y-6">
            {/* Gender Toggle */}
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 block">{t.genderHeader}</label>
              <div className="grid grid-cols-2 gap-3">
                 {CHARACTER_TYPES.map(type => (
                   <button
                     key={type.id}
                     onClick={() => updateCharacterType(type.id as any)}
                     className={`py-3 rounded-2xl font-bold flex items-center justify-center gap-2 border-2 transition-all ${
                       appState.characterType === type.id 
                       ? 'bg-gray-900 text-white border-gray-900 shadow-lg scale-105' 
                       : 'bg-gray-50 text-gray-500 border-transparent hover:bg-gray-100'
                     }`}
                   >
                     <span>{type.icon}</span> {t[type.labelKey as keyof Translations]}
                   </button>
                 ))}
              </div>
            </div>

            {/* Style Toggle */}
            <div>
               <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 block">{t.styleHeader}</label>
               <div className="grid grid-cols-3 gap-2">
                 {CHARACTER_STYLES.map(style => (
                   <button
                     key={style.id}
                     onClick={() => updateCharacterStyle(style.id as any)}
                     className={`py-3 rounded-xl text-xs font-bold flex flex-col items-center gap-1 border-2 transition-all ${
                       appState.characterStyle === style.id 
                       ? 'bg-white border-gray-900 text-gray-900 shadow-md' 
                       : 'bg-gray-50 border-transparent text-gray-400 hover:bg-gray-100'
                     }`}
                     style={appState.characterStyle === style.id ? { borderColor: appState.accentColor, color: appState.accentColor } : {}}
                   >
                     <span className="text-lg">{style.icon}</span>
                     {t[style.labelKey as keyof Translations]}
                   </button>
                 ))}
               </div>
            </div>
          </div>
        </section>

        <div className="space-y-12">
           {/* Color Section */}
          <section className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-50">
            <h2 className="font-game text-2xl mb-8 flex items-center gap-3">
              <span>🎨</span> {t.paletteHeader}
            </h2>
            <div className="flex flex-wrap gap-4">
              {COLORS.map((color) => (
                <button
                  key={color.hex}
                  onClick={() => updateColor(color.hex)}
                  className={`
                    w-12 h-12 rounded-xl transition-all relative overflow-hidden group
                    ${appState.accentColor === color.hex ? 'ring-4 ring-offset-4 ring-gray-200 scale-110' : 'hover:scale-105'}
                  `}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                >
                  {appState.accentColor === color.hex && (
                    <div className="absolute inset-0 flex items-center justify-center text-white text-xl">
                      ✓
                    </div>
                  )}
                </button>
              ))}
            </div>
            <p className="mt-8 text-gray-500 text-sm italic">
              {t.paletteDesc}
            </p>
          </section>

          {/* Marker Section */}
          <section className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-50">
            <h2 className="font-game text-2xl mb-8 flex items-center gap-3">
              <span>💎</span> {t.markerHeader}
            </h2>
            <div className="space-y-4">
              {MARKERS.map((marker) => (
                <button
                  key={marker.id}
                  onClick={() => updateMarker(marker.id as AppState['playerMarker'])}
                  className={`
                    w-full p-4 rounded-2xl flex items-center gap-4 transition-all border-2
                    ${appState.playerMarker === marker.id 
                      ? 'bg-gray-50 border-gray-200' 
                      : 'bg-white border-transparent hover:bg-gray-50'}
                  `}
                >
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm"
                    style={{ backgroundColor: appState.playerMarker === marker.id ? appState.accentColor : '#f3f4f6' }}
                  >
                    {marker.emoji}
                  </div>
                  <div className="text-left">
                    <div className={`font-bold ${appState.playerMarker === marker.id ? 'text-gray-900' : 'text-gray-500'}`}>
                      {t[marker.labelKey as keyof Translations]}
                    </div>
                    {appState.playerMarker === marker.id && <div className="text-xs text-green-600 font-bold uppercase">{t.activeLabel}</div>}
                  </div>
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>

      <div 
        className="mt-16 p-12 rounded-[3rem] text-center border-4 border-dashed transition-colors"
        style={{ borderColor: appState.accentColor, backgroundColor: `${appState.accentColor}05` }}
      >
        <div className="text-6xl mb-6">✨</div>
        <h3 className="font-game text-3xl mb-4" style={{ color: appState.accentColor }}>{t.readyTitle}</h3>
        <p className="text-gray-600 mb-8 max-w-lg mx-auto font-medium">
          {t.readyDesc}
        </p>
        <button 
          onClick={() => window.location.hash = '#/play'}
          className="px-10 py-4 rounded-full text-white font-game text-xl shadow-lg hover:scale-105 transition-transform"
          style={{ backgroundColor: appState.accentColor }}
        >
          {t.goToGame}
        </button>
      </div>
    </div>
  );
};

export default Customize;
