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
      className="wood-panel h-16 flex items-center justify-between px-6 rounded-b-lg border-b-4 border-amber-800/50 shadow-lg"
    >
      {/* Day and Time */}
      <div className="flex items-center gap-3">
        <span className="text-2xl">{timeIcons[state.timeOfDay]}</span>
        <div className="text-primary-foreground">
          <h2 className="font-display text-lg font-bold">Day {state.day} of 3</h2>
          <p className="text-xs opacity-80 capitalize">{state.timeOfDay}</p>
        </div>
      </div>

      {/* Resources */}
      <div className="flex items-center gap-8">
        {/* Ammunition */}
        <div className={`flex items-center gap-2 ${isLowAmmo ? 'resource-warning' : ''}`}>
          <span className="text-xl">🔫</span>
          <div className="text-primary-foreground">
            <p className="text-xs opacity-70">Ammunition</p>
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

      {/* Morale */}
      <div className="flex items-center gap-3 min-w-[180px]">
        <span className="text-xl">🚩</span>
        <div className="flex-1">
          <p className="text-xs text-primary-foreground opacity-70 mb-1">Morale</p>
          <div className="h-3 bg-stone-dark rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: state.morale > 50 
                  ? 'linear-gradient(90deg, hsl(142 70% 35%), hsl(142 70% 45%))' 
                  : state.morale > 25 
                    ? 'linear-gradient(90deg, hsl(38 92% 50%), hsl(38 92% 60%))'
                    : 'linear-gradient(90deg, hsl(0 72% 51%), hsl(0 72% 61%))',
              }}
              initial={{ width: 0 }}
              animate={{ width: `${state.morale}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <p className="text-xs text-primary-foreground text-right mt-0.5">{state.morale}%</p>
        </div>
      </div>
    </motion.div>
  );
};
