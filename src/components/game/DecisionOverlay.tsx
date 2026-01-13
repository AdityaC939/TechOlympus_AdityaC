import { motion, AnimatePresence } from 'framer-motion';
import { Decision } from '@/types/game';

interface DecisionOverlayProps {
  decision: Decision | null;
  onDecide: (optionId: string) => void;
}

export const DecisionOverlay = ({ decision, onDecide }: DecisionOverlayProps) => {
  if (!decision) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 flex items-center justify-center z-50"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="max-w-2xl w-full mx-4"
        >
          {/* Ornate border decoration */}
          <div className="relative">
            {/* Corner decorations */}
            <div className="absolute -top-3 -left-3 w-8 h-8 border-t-4 border-l-4 border-accent" />
            <div className="absolute -top-3 -right-3 w-8 h-8 border-t-4 border-r-4 border-accent" />
            <div className="absolute -bottom-3 -left-3 w-8 h-8 border-b-4 border-l-4 border-accent" />
            <div className="absolute -bottom-3 -right-3 w-8 h-8 border-b-4 border-r-4 border-accent" />

            <div className="parchment p-8 rounded-lg">
              {/* Quote */}
              <p className="text-center text-accent font-display italic mb-6 text-lg">
                {decision.quote}
              </p>

              {/* Title */}
              <h2 className="font-display text-3xl font-bold text-foreground text-center mb-4">
                {decision.title}
              </h2>

              {/* Description */}
              <p className="text-muted-foreground text-center mb-8 leading-relaxed">
                {decision.description}
              </p>

              {/* Options */}
              <div className="space-y-4">
                {decision.options.map((option) => (
                  <motion.button
                    key={option.id}
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onDecide(option.id)}
                    className="w-full p-4 bg-card border-2 border-stone-light rounded-lg text-left hover:border-accent transition-all group"
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-2xl">⚔️</span>
                      <div className="flex-1">
                        <h3 className="font-display font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                          {option.text}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {option.consequence}
                        </p>
                        
                        {/* Effect preview */}
                        <div className="flex gap-4 mt-2 text-xs">
                          {option.effect.ammunition && (
                            <span className={option.effect.ammunition > 0 ? 'text-success' : 'text-destructive'}>
                              🔫 {option.effect.ammunition > 0 ? '+' : ''}{option.effect.ammunition}
                            </span>
                          )}
                          {option.effect.food && (
                            <span className={option.effect.food > 0 ? 'text-success' : 'text-destructive'}>
                              🌾 {option.effect.food > 0 ? '+' : ''}{option.effect.food}
                            </span>
                          )}
                          {option.effect.morale && (
                            <span className={option.effect.morale > 0 ? 'text-success' : 'text-destructive'}>
                              🚩 {option.effect.morale > 0 ? '+' : ''}{option.effect.morale}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
