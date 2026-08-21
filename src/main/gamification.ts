import store from './store'

export const MEDALS = [
  { id: 'first_contact', name: 'First Contact', description: 'Первая успешная загрузка в приложении', icon: '🛸' },
  { id: 'triple_threat', name: 'Triple Threat', description: 'Успешная выгрузка на все 3 платформы за одну миссию', icon: '🌍' },
  { id: '100_broadcasts', name: '100 Broadcasts', description: '100 успешных миссий суммарно', icon: '📡' },
  { id: 'hot_streak', name: 'Hot Streak', description: 'Поддерживать стрик 7 дней подряд', icon: '🔥' },
  { id: 'the_survivor', name: 'The Survivor', description: 'Секретная медаль за особую выдержку', icon: '💀' }
]

export function checkAchievements(mainWindow: any) {
  const g = store.get('gamification')
  const history = store.get('history')
  const newMedals: string[] = []

  const awardMedal = (id: string) => {
    if (!g.medals.includes(id)) {
      g.medals.push(id)
      newMedals.push(id)
      const medal = MEDALS.find(m => m.id === id)
      if (medal && mainWindow) {
        mainWindow.webContents.send('medal-unlocked', medal)
      }
    }
  }

  // First Contact
  if (history.length > 0) {
    awardMedal('first_contact')
  }

  // Triple Threat
  const hasTriple = history.some((h: any) => h.platforms && h.platforms.length >= 3)
  if (hasTriple) {
    awardMedal('triple_threat')
  }

  // 100 Broadcasts
  if (history.length >= 100) {
    awardMedal('100_broadcasts')
  }

  // Hot Streak
  if (g.streak >= 7) {
    awardMedal('hot_streak')
  }

  if (newMedals.length > 0) {
    store.set('gamification', g)
  }
}

export function processMissionXP(mainWindow: any, successPlatforms: string[], durationSeconds: number, isSurvivor: boolean) {
  let xpGained = successPlatforms.length * 100
  if (successPlatforms.length === 3) {
    xpGained += 100 // Full Broadcast Bonus
  }
  
  if (durationSeconds > 7200) { // > 2 hours
    xpGained += 50 // Endurance Run
  }

  const { awardXP } = require('./store')
  const oldG = store.get('gamification')
  const oldRank = oldG.rank
  
  const newG = awardXP(xpGained)

  if (oldRank !== newG.rank && mainWindow) {
    mainWindow.webContents.send('level-up', { oldRank, newRank: newG.rank })
  }

  // Medals
  if (isSurvivor) {
    const g = store.get('gamification')
    if (!g.medals.includes('the_survivor')) {
      g.medals.push('the_survivor')
      store.set('gamification', g)
      const medal = MEDALS.find(m => m.id === 'the_survivor')
      if (mainWindow) mainWindow.webContents.send('medal-unlocked', medal)
    }
  }

  checkAchievements(mainWindow)
  return xpGained
}
