import { PRESET_DECKS } from '../data/presetDecks';

const STORAGE_KEYS = {
  DECKS: 'flashlearn_custom_decks',
  ACTIVE_DECK_ID: 'flashlearn_active_deck_id',
  THEME: 'flashlearn_theme',
  SETTINGS: 'flashlearn_settings',
  STATS: 'flashlearn_stats'
};

export const loadDecks = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.DECKS);
    const customDecks = saved ? JSON.parse(saved) : [];
    // Combine presets with custom decks
    return [...PRESET_DECKS, ...customDecks];
  } catch (e) {
    console.error('Failed to load decks from localStorage', e);
    return PRESET_DECKS;
  }
};

export const saveCustomDecks = (decks) => {
  try {
    const customOnly = decks.filter(d => !d.isPreset);
    localStorage.setItem(STORAGE_KEYS.DECKS, JSON.stringify(customOnly));
  } catch (e) {
    console.error('Failed to save decks', e);
  }
};

export const loadSettings = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return saved ? JSON.parse(saved) : { autoPlayAudio: false, shuffleMode: false, loopMode: true };
  } catch (e) {
    return { autoPlayAudio: false, shuffleMode: false, loopMode: true };
  }
};

export const saveSettings = (settings) => {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings', e);
  }
};

export const loadTheme = () => {
  return localStorage.getItem(STORAGE_KEYS.THEME) || 'dark';
};

export const saveTheme = (theme) => {
  localStorage.setItem(STORAGE_KEYS.THEME, theme);
};
