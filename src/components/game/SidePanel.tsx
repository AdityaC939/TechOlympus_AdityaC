import { motion } from 'framer-motion';
import { GameState, DEFENDER_CARDS, UnitType } from '@/types/game';

interface SidePanelProps {
  state: GameState;
  onSelectUnit: (unit: UnitType | null) => void;
}

export const SidePanel = ({ state, onSelectUnit }: SidePanelProps) => {
  const canAfford = (type: UnitType) => {
    switch (type) {
      case 'musketeer': return state.resources.ammunition >= 15;
      case 'swordsman': return state.resources.food >= 5;
      case 'cannon': return state.resources.ammunition >= 50;
      case 'rani': return state.raniAvailable;
      default: return false;
    }
  };

  return (
    <motion.div
      initial={{ x: 100 }}
      animate={{ x: 0 }}
      className="w-64 h-full flex flex-col gap-3"
    >
      {/* Unit Selection */}
      <div className="parchment rounded-lg p-4 flex-1 border-2 border-amber-700/50 shadow-lg">
        <h3 className="font-display text-lg font-bold text-foreground mb-3 border-b-2 border-amber-600 pb-2 flex items-center gap-2">
          <span>⚔</span> Defenders
        </h3>
        
        <div className="space-y-2">
          {DEFENDER_CARDS.map((card) => {
            const isSelected = state.selectedUnit === card.type;
            const affordable = canAfford(card.type);
            const isRani = card.type === 'rani';
            
            return (
              <motion.button
                key={card.type}
                whileHover={{ scale: affordable ? 1.02 : 1 }}
                whileTap={{ scale: affordable ? 0.98 : 1 }}
                onClick={() => affordable && onSelectUnit(isSelected ? null : card.type)}
                disabled={!affordable}
                className={`
                  w-full p-3 rounded-lg border-2 transition-all text-left
                  ${isRani ? 'hero-glow border-accent' : 'border-stone-light'}
                  ${isSelected ? 'bg-accent/30 border-accent' : 'bg-card'}
                  ${!affordable ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-accent'}
                `}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{card.icon}</span>
                  <div className="flex-1">
                    <p className="font-display font-bold text-sm text-foreground">{card.name}</p>
                    <p className="text-xs text-muted-foreground">{card.description}</p>
                  </div>
                </div>
                
                {card.cost.ammo && (
                  <p className="text-xs text-primary mt-1">Cost: {card.cost.ammo} ammo</p>
                )}
                {card.cost.food && (
                  <p className="text-xs text-primary mt-1">Cost: {card.cost.food} food</p>
                )}
                {isRani && !state.raniAvailable && (
                  <p className="text-xs text-destructive mt-1">Already deployed</p>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Wave Counter */}
      <div className="parchment rounded-lg p-4 border-2 border-amber-700/50 shadow-lg">
        <h3 className="font-display text-lg font-bold text-foreground mb-2 flex items-center gap-2">
          <span>🏹</span> Wave {state.wave} of {state.totalWaves}
        </h3>
        
        {state.waveCountdown > 0 && state.enemies.length === 0 && (
          <div className="mb-3">
            <p className="text-sm text-muted-foreground mb-1">Next wave in:</p>
            <p className="font-bold text-2xl text-primary">
              {Math.ceil(state.waveCountdown)}s
            </p>
          </div>
        )}
        
        <div className="flex gap-1">
          {Array.from({ length: state.totalWaves }).map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full ${
                i < state.wave ? 'bg-success' : 'bg-stone-light'
              }`}
            />
          ))}
        </div>
        
        <div className="mt-3 pt-3 border-t border-border">
          <p className="text-xs text-muted-foreground">Enemies remaining:</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-lg">⚔️</span>
            <span className="font-bold text-foreground">{state.enemies.length}</span>
          </div>
        </div>
      </div>

      {/* Story Panel */}
      <div className="parchment rounded-lg p-4 border-2 border-amber-700/50 shadow-lg">
        <div className="flex items-center gap-2 mb-2">
          <span>📜</span>
          <span className="font-display text-sm font-bold text-amber-800">Chronicle</span>
        </div>
        <p className="text-sm text-foreground leading-relaxed italic border-l-2 border-amber-600 pl-2">
          {state.day === 1 && "The British forces gather at the horizon. Rani Lakshmibai stands ready at your side."}
          {state.day === 2 && "The cannons have fallen silent briefly. Reinforce your positions wisely."}
          {state.day >= 3 && "The final stand approaches. Hold the walls of Jhansi with all your might!"}
        </p>
      </div>
    </motion.div>
  );
};
