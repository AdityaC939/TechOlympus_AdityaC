import { useState, useCallback, useRef, useEffect } from 'react';
import { 
  GameState, Defender, Enemy, UnitType, EnemyType, 
  UNIT_STATS, ENEMY_STATS, Decision, Resources, Position 
} from '@/types/game';

const INITIAL_STATE: GameState = {
  day: 1,
  wave: 0,
  totalWaves: 3,
  timeOfDay: 'dawn',
  resources: { ammunition: 300, food: 100, medical: 50 },
  morale: 100,
  defenders: [],
  enemies: [],
  isPlaying: false,
  isPaused: false,
  speed: 1,
  selectedUnit: null,
  activeDecision: null,
  waveCountdown: 30,
  raniAvailable: true,
  raniCooldown: 0,
  gameOver: false,
  victory: false,
};

const DECISIONS: Decision[] = [
  {
    id: 'reinforce_or_evacuate',
    title: 'A Difficult Choice',
    description: 'The eastern wall shows signs of damage. Civilians gather at the gates, seeking safety.',
    quote: '"We will not abandon our people, nor shall we abandon our walls."',
    options: [
      {
        id: 'reinforce',
        text: 'Reinforce the Walls',
        consequence: 'Spend resources to strengthen defenses',
        effect: { ammunition: -30, morale: 10 },
      },
      {
        id: 'evacuate',
        text: 'Evacuate Civilians',
        consequence: 'Use food to help civilians escape',
        effect: { food: -20, morale: 15 },
      },
    ],
  },
  {
    id: 'messenger',
    title: 'Call for Aid',
    description: 'A brave messenger volunteers to ride to Tantia Tope for reinforcements.',
    quote: '"Every soul that fights for Jhansi is worth a hundred of theirs."',
    options: [
      {
        id: 'send',
        text: 'Send the Messenger',
        consequence: 'Risk losing supplies for potential reinforcements',
        effect: { food: -15, ammunition: -10 },
      },
      {
        id: 'conserve',
        text: 'Conserve Resources',
        consequence: 'Keep supplies but remain isolated',
        effect: { morale: -10 },
      },
    ],
  },
];

export const useGameState = () => {
  const [state, setState] = useState<GameState>(INITIAL_STATE);
  const gameLoopRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);

  const generateEnemyWave = useCallback((waveNum: number, day: number): Enemy[] => {
    const enemies: Enemy[] = [];
    const baseCount = 4 + waveNum + (day - 1) * 2;
    
    // Speed multiplier increases each wave - waves get faster
    const speedMultiplier = 1.5 + (waveNum - 1) * 0.5; // Wave 1: 1.5x, Wave 2: 2x, Wave 3: 2.5x
    
    const lanes = [0, 1, 2];
    lanes.forEach(lane => {
      const count = Math.floor(baseCount / 3) + (lane === 1 ? 1 : 0);
      for (let i = 0; i < count; i++) {
        const type: EnemyType = 
          Math.random() > 0.8 ? 'cavalry' : 
          Math.random() > 0.7 ? 'artillery' : 'infantry';
        
        const stats = ENEMY_STATS[type];
        const startX = -50 - (i * 60);
        const laneY = 150 + lane * 120;
        
        enemies.push({
          id: `enemy-${Date.now()}-${lane}-${i}`,
          type,
          position: { x: startX, y: laneY },
          targetPosition: { x: 600, y: laneY },
          health: stats.health * (1 + day * 0.1),
          maxHealth: stats.health * (1 + day * 0.1),
          speed: stats.speed * speedMultiplier,
          damage: stats.damage,
          lane,
        });
      }
    });
    
    return enemies;
  }, []);

  const startGame = useCallback(() => {
    setState(prev => ({
      ...prev,
      isPlaying: true,
      wave: 1,
      enemies: generateEnemyWave(1, prev.day),
    }));
  }, [generateEnemyWave]);

  const placeDefender = useCallback((position: Position) => {
    setState(prev => {
      if (!prev.selectedUnit) return prev;
      
      const card = prev.selectedUnit;
      const stats = UNIT_STATS[card];
      
      // Check if Rani is already placed
      if (card === 'rani') {
        if (!prev.raniAvailable) return prev;
        if (prev.defenders.some(d => d.type === 'rani')) return prev;
      }
      
      // Check resource costs
      const cost = card === 'musketeer' ? { ammo: 15 } : 
                   card === 'swordsman' ? { food: 5 } :
                   card === 'cannon' ? { ammo: 50 } : {};
      
      if (cost.ammo && prev.resources.ammunition < cost.ammo) return prev;
      if (cost.food && prev.resources.food < cost.food) return prev;
      
      const newDefender: Defender = {
        id: `defender-${Date.now()}`,
        ...stats,
        position,
        lastAttack: 0,
      };
      
      return {
        ...prev,
        defenders: [...prev.defenders, newDefender],
        resources: {
          ...prev.resources,
          ammunition: prev.resources.ammunition - (cost.ammo || 0),
          food: prev.resources.food - (cost.food || 0),
        },
        raniAvailable: card === 'rani' ? false : prev.raniAvailable,
        selectedUnit: null,
      };
    });
  }, []);

  const selectUnit = useCallback((unit: UnitType | null) => {
    setState(prev => ({ ...prev, selectedUnit: unit }));
  }, []);

  const togglePause = useCallback(() => {
    setState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  }, []);

  const setSpeed = useCallback((speed: number) => {
    setState(prev => ({ ...prev, speed }));
  }, []);

  const makeDecision = useCallback((optionId: string) => {
    setState(prev => {
      if (!prev.activeDecision) return prev;
      
      const option = prev.activeDecision.options.find(o => o.id === optionId);
      if (!option) return prev;
      
      return {
        ...prev,
        activeDecision: null,
        resources: {
          ammunition: prev.resources.ammunition + (option.effect.ammunition || 0),
          food: prev.resources.food + (option.effect.food || 0),
          medical: prev.resources.medical + (option.effect.medical || 0),
        },
        morale: Math.max(0, Math.min(100, prev.morale + (option.effect.morale || 0))),
      };
    });
  }, []);

  const gameLoop = useCallback((timestamp: number) => {
    const deltaTime = timestamp - lastUpdateRef.current;
    if (deltaTime < 16) {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
      return;
    }
    lastUpdateRef.current = timestamp;

    setState(prev => {
      if (!prev.isPlaying || prev.isPaused || prev.gameOver || prev.activeDecision) {
        return prev;
      }

      let newState = { ...prev };
      const dt = (deltaTime / 1000) * prev.speed;

      // Move enemies
      const updatedEnemies = prev.enemies.map(enemy => {
        const dx = enemy.targetPosition.x - enemy.position.x;
        const moveX = Math.min(Math.abs(dx), enemy.speed * dt * 60) * Math.sign(dx);
        
        return {
          ...enemy,
          position: {
            ...enemy.position,
            x: enemy.position.x + moveX,
          },
        };
      });

      // Check for enemies reaching the fort
      const reachedFort = updatedEnemies.filter(e => e.position.x >= 580);
      if (reachedFort.length > 0) {
        newState.morale -= reachedFort.length * 5;
      }

      // Remove enemies that reached the fort
      newState.enemies = updatedEnemies.filter(e => e.position.x < 580);

      // Defender attacks
      const now = Date.now();
      let updatedDefenders = [...prev.defenders];
      
      updatedDefenders = updatedDefenders.map(defender => {
        if (now - defender.lastAttack < defender.cooldown) return defender;

        // Find closest enemy in range
        const enemiesInRange = newState.enemies.filter(enemy => {
          const dx = enemy.position.x - defender.position.x;
          const dy = enemy.position.y - defender.position.y;
          return Math.sqrt(dx * dx + dy * dy) <= defender.range;
        });

        if (enemiesInRange.length > 0) {
          const target = enemiesInRange[0];
          const previousHealth = target.health;
          target.health -= defender.damage;
          
          // If enemy was killed, defender takes damage too (exhaustion from combat)
          if (previousHealth > 0 && target.health <= 0) {
            const damageToDefender = target.damage * 0.5; // Defender takes 50% of enemy damage
            return { 
              ...defender, 
              lastAttack: now,
              health: defender.health - damageToDefender
            };
          }
          
          // Use ammunition
          if (defender.type === 'musketeer' || defender.type === 'cannon') {
            newState.resources.ammunition -= defender.type === 'cannon' ? 3 : 1;
          }
          
          return { ...defender, lastAttack: now };
        }
        
        return defender;
      });

      // Remove dead defenders
      newState.defenders = updatedDefenders.filter(d => d.health > 0);

      // Remove dead enemies
      newState.enemies = newState.enemies.filter(e => e.health > 0);

      // Check wave completion
      if (newState.enemies.length === 0 && prev.enemies.length > 0) {
        if (prev.wave >= prev.totalWaves) {
          // Day complete
          if (prev.day >= 3) {
            newState.victory = true;
            newState.gameOver = true;
          } else {
            // Show decision
            const decision = DECISIONS[Math.floor(Math.random() * DECISIONS.length)];
            newState.activeDecision = { ...decision };
            newState.day += 1;
            newState.wave = 0;
            newState.waveCountdown = 30;
            
            // Update time of day
            const times: Array<'dawn' | 'day' | 'dusk'> = ['dawn', 'day', 'dusk'];
            newState.timeOfDay = times[(newState.day - 1) % 3];
          }
        } else {
          newState.wave += 1;
          newState.waveCountdown = 15;
        }
      }

      // Wave countdown
      if (newState.enemies.length === 0 && newState.waveCountdown > 0) {
        newState.waveCountdown -= dt;
        if (newState.waveCountdown <= 0) {
          newState.enemies = generateEnemyWave(newState.wave || 1, newState.day);
        }
      }

      // Check game over conditions
      if (newState.morale <= 0) {
        newState.gameOver = true;
        newState.victory = false;
      }

      // Check if Rani is dead
      const rani = newState.defenders.find(d => d.type === 'rani');
      if (rani && rani.health <= 0) {
        newState.gameOver = true;
        newState.victory = false;
      }

      return newState;
    });

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [generateEnemyWave]);

  useEffect(() => {
    if (state.isPlaying && !state.isPaused) {
      lastUpdateRef.current = performance.now();
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
    
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [state.isPlaying, state.isPaused, gameLoop]);

  const resetGame = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  return {
    state,
    startGame,
    placeDefender,
    selectUnit,
    togglePause,
    setSpeed,
    makeDecision,
    resetGame,
  };
};
