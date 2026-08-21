import Store from 'electron-store'

export interface HistoryRecord {
  id: string;
  date: string;
  title: string;
  duration: string;
  platforms: ('youtube' | 'vk' | 'telegram')[];
  xpGained: number;
}

export interface GamificationState {
  xp: number;
  rank: string;
  streak: number;
  lastUploadDate: string | null;
  medals: string[];
  equippedShip: string;
}

export interface StoreSchema {
  gamification: GamificationState;
  history: HistoryRecord[];
  secureTokens: Record<string, string>;
}

// Ранги по порогам XP
const RANKS = [
  { name: 'Rookie', xp: 0 },
  { name: 'Ensign', xp: 500 },
  { name: 'Lieutenant', xp: 1500 },
  { name: 'Captain', xp: 3000 },
  { name: 'Commander', xp: 5000 },
  { name: 'Admiral', xp: 10000 },
  { name: 'Galactic Overlord', xp: 20000 }
];

export function calculateRank(xp: number): string {
  let currentRank = RANKS[0].name;
  for (const rank of RANKS) {
    if (xp >= rank.xp) {
      currentRank = rank.name;
    } else {
      break;
    }
  }
  return currentRank;
}

const store = new Store<StoreSchema>({
  defaults: {
    gamification: {
      xp: 0,
      rank: 'Rookie',
      streak: 0,
      lastUploadDate: null,
      medals: [],
      equippedShip: 'ufo'
    },
    history: [],
    secureTokens: {}
  }
});

import { safeStorage } from 'electron';
import log from 'electron-log/main';

export function setSecureToken(key: string, value: string) {
  const tokens = store.get('secureTokens');
  try {
    if (safeStorage.isEncryptionAvailable()) {
      const encrypted = safeStorage.encryptString(value);
      tokens[key] = encrypted.toString('base64');
    } else {
      log.warn('SafeStorage not available. Storing token as plain text.');
      tokens[key] = value;
    }
    store.set('secureTokens', tokens);
  } catch (error) {
    log.error('Failed to save secure token:', error);
  }
}

export function getSecureToken(key: string): string | null {
  const tokens = store.get('secureTokens');
  const encryptedValue = tokens[key];
  if (!encryptedValue) return null;
  
  try {
    if (safeStorage.isEncryptionAvailable()) {
      return safeStorage.decryptString(Buffer.from(encryptedValue, 'base64'));
    } else {
      return encryptedValue;
    }
  } catch (error) {
    log.error('Failed to decrypt token for key', key, ':', error);
    return null;
  }
}

export function getGamification(): GamificationState {
  return store.get('gamification');
}

export function getHistory(): HistoryRecord[] {
  return store.get('history');
}

export function addHistoryRecord(record: HistoryRecord) {
  const history = store.get('history');
  history.unshift(record); // Add to beginning
  store.set('history', history);
}

export function awardXP(amount: number) {
  const g = store.get('gamification');
  g.xp += amount;
  g.rank = calculateRank(g.xp);
  
  // Basic streak logic
  const today = new Date().toISOString().split('T')[0];
  if (g.lastUploadDate) {
    const lastDate = new Date(g.lastUploadDate);
    const currDate = new Date(today);
    const diffTime = Math.abs(currDate.getTime() - lastDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    
    if (diffDays === 1) {
      g.streak += 1;
    } else if (diffDays > 1) {
      g.streak = 1;
    }
  } else {
    g.streak = 1;
  }
  g.lastUploadDate = today;

  store.set('gamification', g);
  return g;
}

export function setEquippedShip(ship: string) {
  const g = store.get('gamification');
  g.equippedShip = ship;
  store.set('gamification', g);
  return g;
}

export default store;
