
import React from 'react';
import { Language } from '../types';

interface LanguageSelectorProps {
  current: Language;
  onChange: (lang: Language) => void;
}

const languages: { code: Language; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'ms', label: 'Melayu', flag: '🇲🇾' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'ta', label: 'தமிழ்', flag: '🇮🇳' },
];

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ current, onChange }) => {
  return (
    <div className="relative group">
      <select
        value={current}
        onChange={(e) => onChange(e.target.value as Language)}
        className="appearance-none bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 pr-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-opacity-50 cursor-pointer hover:bg-white transition-colors"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.label}
          </option>
        ))}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
};

export default LanguageSelector;
