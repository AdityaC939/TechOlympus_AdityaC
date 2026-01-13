import { motion } from 'framer-motion';
import { GameState } from '@/types/game';

interface TopHUDProps {
  state: GameState;
}

export const TopHUD = ({ state }: TopHUDProps) => {
  const timeIcons: Record<string, string> = {
    dawn: '🌅',
    day: '☀️',
    dusk: '🌆',
    night: '🌙',
  };

  const isLowAmmo = state.resources.ammunition < 50;
  const isLowFood = state.resources.food < 20;
  const isLowMedical = state.resources.medical < 10;

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="wood-panel h-16 flex items-center justify-between px-6 rounded-b-lg border-b-4 border-amber-800/50 shadow-lg relative z-20"
    >
      {/* Day and Time */}
      <div className="flex items-center gap-3">
        <span className="text-2xl">{timeIcons[state.timeOfDay]}</span>
        <div className="text-primary-foreground">
          <h2 className="font-display text-lg font-bold">Day {state.day} of 3</h2>
          <p className="text-xs opacity-80 capitalize">{state.timeOfDay}</p>
        </div>
      </div>

      {/* Wave Info & Countdown - Centered */}
      <div className="flex items-center gap-4">
        <div className="bg-stone-dark/80 rounded-lg px-4 py-2 flex items-center gap-3 border border-amber-600/50">
          <div className="text-primary-foreground text-center">
            <p className="text-xs opacity-70">Wave</p>
            <p className="font-display font-bold text-lg">{state.wave}/{state.totalWaves}</p>
          </div>
          
          {state.waveCountdown > 0 && state.enemies.length === 0 && (
            <div className="border-l border-amber-600/50 pl-3">
              <p className="text-xs text-primary-foreground opacity-70">Next Wave</p>
              <p className="font-display font-bold text-xl text-warning">
                {Math.ceil(state.waveCountdown)}s
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Resources */}
      <div className="flex items-center gap-6">
        {/* Ammunition */}
        <div className={`flex items-center gap-2 ${isLowAmmo ? 'resource-warning' : ''}`}>
          <span className="text-xl">🔫</span>
          <div className="text-primary-foreground">
            <p className="text-xs opacity-70">Ammo</p>
            <p className={`font-bold text-lg ${isLowAmmo ? 'text-destructive' : ''}`}>
              {state.resources.ammunition}
            </p>
          </div>
        </div>

        {/* Food */}
        <div className={`flex items-center gap-2 ${isLowFood ? 'resource-warning' : ''}`}>
          <span className="text-xl">🌾</span>
          <div className="text-primary-foreground">
            <p className="text-xs opacity-70">Food</p>
            <p className={`font-bold text-lg ${isLowFood ? 'text-destructive' : ''}`}>
              {state.resources.food}
            </p>
          </div>
        </div>

        {/* Medical */}
        <div className={`flex items-center gap-2 ${isLowMedical ? 'resource-warning' : ''}`}>
          <span className="text-xl">🩹</span>
          <div className="text-primary-foreground">
            <p className="text-xs opacity-70">Medical</p>
            <p className={`font-bold text-lg ${isLowMedical ? 'text-destructive' : ''}`}>
              {state.resources.medical}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
