
import React from 'react';
import { Link } from 'react-router-dom';
import { Translations } from '../types';

interface HomeProps {
  t: Translations;
  accentColor: string;
}

const Home: React.FC<HomeProps> = ({ t, accentColor }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <div className="relative mb-8">
        <div 
          className="absolute inset-0 blur-3xl opacity-20 animate-pulse"
          style={{ backgroundColor: accentColor }}
        ></div>
        <div className="relative font-game text-7xl md:text-9xl text-gray-800 leading-tight">
          Ting<span className="text-gray-300">-</span>Ting
        </div>
      </div>
      
      <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl font-medium">
        {t.heroSubtitle}
      </p>

      <div className="flex flex-col sm:flex-row gap-6 w-full max-w-md">
        <Link
          to="/play"
          className="flex-1 py-5 px-8 rounded-2xl text-white font-game text-xl shadow-xl hover:shadow-2xl transition-all hover:scale-105 flex items-center justify-center gap-3"
          style={{ backgroundColor: accentColor }}
        >
          <span>🎮</span> {t.playNow}
        </Link>
        <Link
          to="/learn"
          className="flex-1 py-5 px-8 rounded-2xl bg-white text-gray-700 border-2 border-gray-100 font-game text-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center gap-3"
        >
          <span>📖</span> {t.howToPlay}
        </Link>
      </div>

      <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
        <FeatureCard 
          icon="✨" 
          title={t.feature1Title} 
          description={t.feature1Desc}
        />
        <FeatureCard 
          icon="🌍" 
          title={t.feature2Title} 
          description={t.feature2Desc}
        />
        <FeatureCard 
          icon="🎨" 
          title={t.feature3Title} 
          description={t.feature3Desc}
        />
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: string, title: string, description: string }) => (
  <div className="p-8 rounded-3xl bg-white shadow-sm border border-gray-50">
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="font-bold text-lg mb-2 text-gray-800">{title}</h3>
    <p className="text-gray-500 leading-relaxed">{description}</p>
  </div>
);

export default Home;
