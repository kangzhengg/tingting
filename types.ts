export type Language = 'en' | 'ms' | 'zh' | 'ta';

export type GamePhase = 'THROWING' | 'HOPPING_OUT' | 'HOPPING_BACK' | 'PICKING_UP' | 'FINISHED_ROUND' | 'GAME_OVER';

export interface Translations {
  home: string;
  play: string;
  learn: string;
  customize: string;
  credits: string;
  playNow: string;
  howToPlay: string;
  heroTitle: string;
  heroSubtitle: string;
  rulesHeader: string;
  creditsTitle: string;
  creditsSubtitle: string;
  // Home Page Features
  feature1Title: string;
  feature1Desc: string;
  feature2Title: string;
  feature2Desc: string;
  feature3Title: string;
  feature3Desc: string;
  // Customize Page
  customizeHeader: string;
  paletteHeader: string;
  paletteDesc: string;
  markerHeader: string;
  characterHeader: string;
  genderHeader: string;
  styleHeader: string;
  readyTitle: string;
  readyDesc: string;
  goToGame: string;
  activeLabel: string;
  markerStone: string;
  markerShell: string;
  markerCoin: string;
  markerHouse: string;
  boyLabel: string;
  girlLabel: string;
  styleCasual: string;
  styleSporty: string;
  styleFancy: string;
  // Credits Page
  specialThanks: string;
  creditsFooter: string;
  roleCreative: string;
  roleLead: string;
  roleUX: string;
  roleMotion: string;
  roleTranslator: string;
  roleBeta: string;
  roleAdvisor: string;
  thanksTags: string[];
  // Learn Page
  stepLabel: string;
  proTipTitle: string;
  proTipDesc: string;
  // Game specific UI
  score: string;
  level: string;
  lives: string;
  phaseThrowing: string;
  phaseHopping: string;
  phaseBack: string;
  phasePick: string;
  phaseClear: string;
  balanced: string;
  wait: string;
  gameOver: string;
  tryAgain: string;
  champion: string;
  totalPoints: string;
  missedThrow: string;
  lostBalance: string;
  steppedMarker: string;
  steppedOutside: string;
  wrongBox: string;
  footerNote: string;
  // Balance Meter Hints
  balanceSafe: string;
  balanceUnsafe: string;
}

export interface RuleStep {
  number: number;
  text: string;
  icon: string;
}

export interface AppState {
  language: Language;
  accentColor: string;
  playerMarker: 'stone' | 'shell' | 'coin' | 'house';
  characterType: 'boy' | 'girl';
  characterStyle: 'casual' | 'sporty' | 'fancy';
}