
import React from 'react';
import { Translations } from '../types';

interface CreditsProps {
  t: Translations;
  accentColor: string;
}

const Credits: React.FC<CreditsProps> = ({ t, accentColor }) => {
  return (
    <div className="max-w-4xl mx-auto py-16 px-4">
      <div className="text-center mb-16">
        <h1 className="font-game text-6xl text-gray-800 mb-6">{t.creditsTitle}</h1>
        <div className="max-w-2xl mx-auto">
          <p className="text-xl text-gray-600 font-medium leading-relaxed">
            {t.creditsSubtitle}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 mb-16">
        {/* Primary Priority: Advisor */}
        <div 
          className="group relative overflow-hidden flex flex-col md:flex-row items-center justify-between p-10 bg-white rounded-[3rem] border-4 border-gray-100 shadow-xl transition-all hover:scale-[1.02]"
          style={{ borderColor: 'rgba(96, 165, 250, 0.2)' }}
        >
          <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
            <div className="w-24 h-24 bg-blue-50 rounded-[2rem] flex items-center justify-center text-5xl shadow-inner group-hover:rotate-6 transition-transform">
              🏛️
            </div>
            <div>
              <p className="text-blue-500 font-bold uppercase tracking-[0.2em] text-sm mb-2">{t.roleAdvisor}</p>
              <h3 className="font-game text-3xl text-gray-800">Badan Warisan Malaysia</h3>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-300 font-game text-2xl">
              01
            </div>
          </div>
        </div>

        {/* Developer Info Card - Refactored to be softer and themed */}
        <div 
          className="p-10 bg-white/60 backdrop-blur-sm rounded-[3rem] border-4 shadow-xl relative overflow-hidden transition-all hover:scale-[1.01]"
          style={{ borderColor: `${accentColor}33` }}
        >
          <div className="absolute top-0 right-0 p-8 opacity-5 text-8xl pointer-events-none">🎓</div>
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
            <div className="w-20 h-20 rounded-[1.5rem] flex items-center justify-center text-4xl shadow-sm" style={{ backgroundColor: `${accentColor}15` }}>
              👨‍💻
            </div>
            <div>
              <h4 className="font-game text-2xl mb-2 flex items-center justify-center md:justify-start gap-3 text-gray-800">
                <span style={{ color: accentColor }}>UM</span> CSIT Group 15 T1
              </h4>
              <div className="space-y-1 text-gray-500 font-semibold text-sm">
                <p>Faculty of Computer Science & Information Technology</p>
                <p>University Malaya</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-20 border-t border-gray-100 pt-12 text-center">
        <h4 className="font-game text-2xl text-gray-700 mb-8">{t.specialThanks}</h4>
        <div className="flex flex-wrap justify-center gap-4">
          {t.thanksTags.map(tag => (
            <span key={tag} className="px-6 py-3 bg-white border border-gray-100 text-gray-500 rounded-2xl text-sm font-bold shadow-sm hover:shadow-md transition-shadow">
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-16 max-w-lg mx-auto">
          <p className="text-gray-400 text-sm italic leading-relaxed">
            {t.creditsFooter}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Credits;
