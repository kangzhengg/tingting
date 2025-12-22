
import React from 'react';
import { AppState, Translations } from '../types';
import { HOPSCOTCH_RULES } from '../constants';

interface LearnProps {
  appState: AppState;
  t: Translations;
}

const Learn: React.FC<LearnProps> = ({ appState, t }) => {
  const rules = HOPSCOTCH_RULES[appState.language];

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="text-center mb-16">
        <h1 className="font-game text-5xl text-gray-800 mb-4">{t.rulesHeader}</h1>
        <div className="w-24 h-2 rounded-full mx-auto" style={{ backgroundColor: appState.accentColor }}></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {rules.map((rule, idx) => (
          <div 
            key={rule.number}
            className="group p-8 rounded-[2rem] bg-white shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex gap-6 items-start"
          >
            <div 
              className="shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-inner rotate-3 group-hover:rotate-0 transition-transform"
              style={{ backgroundColor: `${appState.accentColor}20` }}
            >
              {rule.icon}
            </div>
            <div>
              <div className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-1">
                {t.stepLabel} {rule.number}
              </div>
              <p className="text-gray-700 text-lg leading-relaxed font-medium">
                {rule.text}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-20 p-10 rounded-[3rem] bg-gray-900 text-white flex flex-col md:flex-row items-center gap-10">
        <div className="text-6xl">💡</div>
        <div>
          <h3 className="text-2xl font-game mb-2">{t.proTipTitle}</h3>
          <p className="text-gray-300 leading-relaxed text-lg">
            {t.proTipDesc}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Learn;
