
import React from 'react';
import { Translations } from '../types';

interface CreditsProps {
  t: Translations;
}

const Credits: React.FC<CreditsProps> = ({ t }) => {
  const contributors = [
    { name: "Alex Rivera", role: t.roleCreative, avatar: "🎨" },
    { name: "Sophie Chen", role: t.roleLead, avatar: "💻" },
    { name: "Marcus Thorne", role: t.roleUX, avatar: "✨" },
    { name: "Elena Gilbert", role: t.roleMotion, avatar: "🌀" },
    { name: "Julian Voss", role: t.roleTranslator, avatar: "🌍" },
    { name: "The Playground Kids", role: t.roleBeta, avatar: "🎈" }
  ];

  return (
    <div className="max-w-3xl mx-auto py-16 px-4">
      <div className="text-center mb-16">
        <h1 className="font-game text-5xl text-gray-800 mb-4">{t.creditsTitle}</h1>
        <p className="text-xl text-gray-500 font-medium">{t.creditsSubtitle}</p>
      </div>

      <div className="space-y-4">
        {contributors.map((person, idx) => (
          <div 
            key={person.name}
            className="group flex items-center justify-between p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all hover:scale-[1.01]"
          >
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-blue-50 transition-colors">
                {person.avatar}
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-lg">{person.name}</h3>
                <p className="text-gray-400 text-sm font-semibold uppercase tracking-wider">{person.role}</p>
              </div>
            </div>
            <div className="hidden sm:block text-gray-200 font-game text-2xl">
              #{idx + 1}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-20 border-t border-gray-100 pt-12 text-center">
        <h4 className="font-game text-2xl text-gray-700 mb-6">{t.specialThanks}</h4>
        <div className="flex flex-wrap justify-center gap-4">
          {t.thanksTags.map(tag => (
            <span key={tag} className="px-5 py-2 bg-gray-100 text-gray-500 rounded-full text-sm font-bold">
              {tag}
            </span>
          ))}
        </div>
        <p className="mt-12 text-gray-400 text-sm italic">
          {t.creditsFooter}
        </p>
      </div>
    </div>
  );
};

export default Credits;
