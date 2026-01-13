import { motion } from 'framer-motion';
import { GameState } from '@/types/game';

interface GameOverScreenProps {
  state: GameState;
  onRestart: () => void;
}

export const GameOverScreen = ({ state, onRestart }: GameOverScreenProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 bg-black/80 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="max-w-lg w-full mx-4"
      >
        <div className="parchment rounded-lg p-8 text-center">
          {state.victory ? (
            <>
              <span className="text-6xl mb-4 block">🏆</span>
              <h2 className="font-display text-4xl font-bold text-primary mb-4">
                Victory!
              </h2>
              <p className="text-foreground leading-relaxed mb-6">
                Against all odds, Jhansi has held! The British forces retreat as the 
                defenders stand victorious on the ancient walls. Rani Lakshmibai's 
                legend grows ever stronger.
              </p>
            </>
          ) : (
            <>
              <span className="text-6xl mb-4 block">⚔️</span>
              <h2 className="font-display text-4xl font-bold text-destructive mb-4">
                The Fort Has Fallen
              </h2>
              <p className="text-foreground leading-relaxed mb-6">
                Though Jhansi has fallen, the spirit of resistance lives on. 
                Rani Lakshmibai's bravery will inspire generations to come. 
                History remembers the brave.
              </p>
            </>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6 text-left">
            <div className="bg-card p-3 rounded">
              <p className="text-sm text-muted-foreground">Days Survived</p>
              <p className="font-display font-bold text-2xl text-foreground">{state.day}</p>
            </div>
            <div className="bg-card p-3 rounded">
              <p className="text-sm text-muted-foreground">Defenders Deployed</p>
              <p className="font-display font-bold text-2xl text-foreground">{state.defenders.length}</p>
            </div>
          </div>

          {/* Quote */}
          <p className="text-accent italic font-display mb-6">
            "Main apni Jhansi nahi doongi"<br />
            <span className="text-sm text-muted-foreground">"I shall not give up my Jhansi"</span>
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRestart}
            className="brass-button px-8 py-3 rounded-lg font-display font-bold"
          >
            Try Again
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};
