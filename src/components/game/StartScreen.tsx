import { motion } from 'framer-motion';
import parchmentBg from '@/assets/parchment-bg.png';

interface StartScreenProps {
  onStart: () => void;
}

export const StartScreen = ({ onStart }: StartScreenProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${parchmentBg})`,
        }}
      />
      
      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-accent/30 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: window.innerHeight + 20,
            }}
            animate={{
              y: -20,
              transition: {
                duration: 5 + Math.random() * 5,
                repeat: Infinity,
                delay: Math.random() * 5,
              },
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-3xl w-full text-center"
      >
        {/* Title */}
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h1 className="font-display text-6xl md:text-7xl font-bold text-primary-foreground mb-2 drop-shadow-lg">
            Pride of Jhansi
          </h1>
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-accent" />
            <span className="text-accent text-2xl">⚔️</span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-accent" />
          </div>
          <p className="font-display text-xl text-primary-foreground/80 mb-8">
            Defend the Fort • March 1858
          </p>
        </motion.div>

        {/* Story intro */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="parchment rounded-lg p-6 mb-8 max-w-2xl mx-auto"
        >
          <p className="text-foreground leading-relaxed italic">
            "The British East India Company's forces surround Jhansi Fort, and you stand 
            beside the legendary <strong>Rani Lakshmibai</strong> as she prepares to defend 
            her kingdom. This isn't just another siege—it's a fight for independence, dignity, 
            and the future of India."
          </p>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-3 gap-4 mb-8"
        >
          {[
            { icon: '🏰', title: '7 Days', desc: 'Defend the siege' },
            { icon: '⚔️', title: 'Strategic', desc: 'Place defenders wisely' },
            { icon: '📜', title: 'Choices', desc: 'Shape your legacy' },
          ].map((feature, i) => (
            <div key={i} className="parchment rounded-lg p-4">
              <span className="text-3xl mb-2 block">{feature.icon}</span>
              <h3 className="font-display font-bold text-foreground">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </motion.div>

        {/* Start button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStart}
          className="brass-button px-12 py-4 rounded-lg font-display text-xl font-bold shadow-lg hover:shadow-xl transition-all"
        >
          Begin the Siege
        </motion.button>

        {/* Historical note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-6 text-sm text-primary-foreground/60"
        >
          A tribute to Rani Lakshmibai and the defenders of Jhansi
        </motion.p>
      </motion.div>
    </div>
  );
};
