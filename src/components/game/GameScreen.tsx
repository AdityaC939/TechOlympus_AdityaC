import { motion } from 'framer-motion';
import { TopHUD } from './TopHUD';
import { SidePanel } from './SidePanel';
import { GameCanvas } from './GameCanvas';
import { BottomBar } from './BottomBar';
import { DecisionOverlay } from './DecisionOverlay';
import { GameOverScreen } from './GameOverScreen';
import { useGameState } from '@/hooks/useGameState';

export const GameScreen = () => {
  const {
    state,
    startGame,
    placeDefender,
    selectUnit,
    togglePause,
    setSpeed,
    makeDecision,
    resetGame,
  } = useGameState();

  // Start game on mount if not already playing
  if (!state.isPlaying && !state.gameOver) {
    startGame();
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-screen flex flex-col overflow-hidden relative"
    >
      {/* Stone border frame - historical theme */}
      <div 
        className="absolute inset-0 pointer-events-none z-50"
        style={{
          borderImage: 'repeating-linear-gradient(45deg, #6b5b48, #8b7b68 10px, #5a4a38 20px, #7a6a58 30px) 20',
          borderWidth: '12px',
          borderStyle: 'solid',
          boxShadow: 'inset 0 0 30px rgba(0,0,0,0.3)',
        }}
      />
      
      {/* Corner ornaments */}
      <div className="absolute top-0 left-0 w-16 h-16 z-50 pointer-events-none">
        <div className="absolute top-2 left-2 w-12 h-12 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 border-2 border-amber-500 shadow-lg flex items-center justify-center">
          <span className="text-amber-200 text-lg">⚔</span>
        </div>
      </div>
      <div className="absolute top-0 right-0 w-16 h-16 z-50 pointer-events-none">
        <div className="absolute top-2 right-2 w-12 h-12 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 border-2 border-amber-500 shadow-lg flex items-center justify-center">
          <span className="text-amber-200 text-lg">🛡</span>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-16 h-16 z-50 pointer-events-none">
        <div className="absolute bottom-2 left-2 w-12 h-12 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 border-2 border-amber-500 shadow-lg flex items-center justify-center">
          <span className="text-amber-200 text-lg">🗡</span>
        </div>
      </div>
      <div className="absolute bottom-0 right-0 w-16 h-16 z-50 pointer-events-none">
        <div className="absolute bottom-2 right-2 w-12 h-12 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 border-2 border-amber-500 shadow-lg flex items-center justify-center">
          <span className="text-amber-200 text-lg">🏰</span>
        </div>
      </div>

      {/* Main content with parchment background */}
      <div 
        className="flex-1 flex flex-col"
        style={{
          background: 'linear-gradient(180deg, hsl(38 40% 90%) 0%, hsl(36 35% 82%) 50%, hsl(30 30% 75%) 100%)',
        }}
      >
        {/* Top HUD */}
        <TopHUD state={state} />

        {/* Main game area */}
        <div className="flex-1 flex gap-4 p-4 overflow-hidden">
          {/* Game Canvas */}
          <GameCanvas state={state} onPlaceDefender={placeDefender} />

          {/* Side Panel */}
          <SidePanel state={state} onSelectUnit={selectUnit} />
        </div>

        {/* Bottom Bar */}
        <BottomBar 
          state={state} 
          onTogglePause={togglePause} 
          onSetSpeed={setSpeed} 
        />
      </div>

      {/* Decision Overlay */}
      <DecisionOverlay decision={state.activeDecision} onDecide={makeDecision} />

      {/* Game Over Screen */}
      {state.gameOver && <GameOverScreen state={state} onRestart={resetGame} />}

      {/* Pause overlay */}
      {state.isPaused && !state.activeDecision && !state.gameOver && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-black/50 flex items-center justify-center z-40"
        >
          <div className="parchment p-8 rounded-lg text-center border-4 border-amber-700 shadow-2xl">
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">⚔ Paused ⚔</h2>
            <p className="text-muted-foreground mb-6">The battle awaits your command</p>
            <button
              onClick={togglePause}
              className="brass-button px-6 py-2 rounded font-display font-bold hover:scale-105 transition-transform"
            >
              Resume Battle
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};
