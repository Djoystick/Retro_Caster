import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface Medal {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export const AchievementPopup = () => {
  const [medals, setMedals] = useState<Medal[]>([]);
  const [levels, setLevels] = useState<{oldRank: string, newRank: string}[]>([]);

  useEffect(() => {
    if ((window as any).api?.onMedalUnlocked) {
      ;(window as any).api.onMedalUnlocked((medal: Medal) => {
        setMedals(prev => [...prev, medal]);
        setTimeout(() => {
          setMedals(prev => prev.filter(m => m.id !== medal.id));
        }, 5000);
      });
    }

    if ((window as any).api?.onLevelUp) {
      ;(window as any).api.onLevelUp((data: {oldRank: string, newRank: string}) => {
        setLevels(prev => [...prev, data]);
        setTimeout(() => {
          setLevels(prev => prev.filter(l => l.newRank !== data.newRank));
        }, 5000);
      });
    }
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {levels.map(level => (
          <motion.div
            key={`level-${level.newRank}`}
            initial={{ opacity: 0, x: 50, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            className="bg-pixel-void border-2 border-pixel-yellow p-4 shadow-[0_0_15px_rgba(250,204,21,0.4)] flex items-center gap-4"
          >
            <div className="text-4xl">🌟</div>
            <div>
              <h3 className="text-pixel-yellow text-sm uppercase tracking-widest font-bold">LEVEL UP!</h3>
              <p className="text-pixel-light text-xs">Новое звание: <span className="text-pixel-cyan font-bold">{level.newRank}</span></p>
            </div>
          </motion.div>
        ))}

        {medals.map(medal => (
          <motion.div
            key={`medal-${medal.id}`}
            initial={{ opacity: 0, x: 50, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            className="bg-pixel-void border-2 border-pixel-green p-4 shadow-[0_0_15px_rgba(34,197,94,0.4)] flex items-center gap-4"
          >
            <div className="text-4xl">{medal.icon}</div>
            <div>
              <h3 className="text-pixel-green text-sm uppercase tracking-widest font-bold">MEDAL UNLOCKED!</h3>
              <p className="text-pixel-yellow font-bold text-sm">{medal.name}</p>
              <p className="text-pixel-light text-xs">{medal.description}</p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
