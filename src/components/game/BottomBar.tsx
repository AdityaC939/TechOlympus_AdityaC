import { motion } from 'framer-motion';
import { Pause, Play, FastForward, Volume2 } from 'lucide-react';
import { GameState } from '@/types/game';

interface BottomBarProps {
  state: GameState;
  onTogglePause: () => void;
  onSetSpeed: (speed: number) => void;
}

export const BottomBar = ({ state, onTogglePause, onSetSpeed }: BottomBarProps) => {
  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="wood-panel h-14 flex items-center justify-between px-6 rounded-t-lg border-t-4 border-amber-800/50 shadow-lg"
    >
      {/* Left: Action Buttons */}
      <div className="flex items-center gap-3">
        <button className="brass-button px-4 py-2 rounded font-display text-sm font-bold hover:opacity-90 transition-opacity">
          Place Defenders
        </button>
        <button 
          className="brass-button px-4 py-2 rounded font-display text-sm font-bold opacity-50 cursor-not-allowed"
          disabled
        >
          Evacuate Civilians
        </button>
      </div>

      {/* Center: Minimap placeholder */}
      <div className="w-32 h-10 bg-stone-dark rounded border border-stone-light flex items-center justify-center">
        <span className="text-xs text-primary-foreground opacity-70">Minimap</span>
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-4">
        <button
          onClick={onTogglePause}
          className="w-10 h-10 rounded-full bg-stone-dark flex items-center justify-center hover:bg-stone transition-colors"
        >
          {state.isPaused ? (
            <Play className="w-5 h-5 text-primary-foreground" />
          ) : (
            <Pause className="w-5 h-5 text-primary-foreground" />
          )}
        </button>

        <div className="flex items-center gap-1 bg-stone-dark rounded-full px-2 py-1">
          {[1, 2].map(speed => (
            <button
              key={speed}
              onClick={() => onSetSpeed(speed)}
              className={`px-3 py-1 rounded-full text-sm font-bold transition-colors ${
                state.speed === speed 
                  ? 'bg-accent text-accent-foreground' 
                  : 'text-primary-foreground hover:bg-stone'
              }`}
            >
              {speed}x
            </button>
          ))}
        </div>

        <button className="w-10 h-10 rounded-full bg-stone-dark flex items-center justify-center hover:bg-stone transition-colors">
          <Volume2 className="w-5 h-5 text-primary-foreground" />
        </button>
      </div>
    </motion.div>
  );
};
