export type UnitType = 'musketeer' | 'swordsman' | 'cannon' | 'rani';
export type EnemyType = 'infantry' | 'cavalry' | 'artillery';
export type TimeOfDay = 'dawn' | 'day' | 'dusk' | 'night';

export interface Position {
  x: number;
  y: number;
}

export interface Defender {
  id: string;
  type: UnitType;
  position: Position;
  health: number;
  maxHealth: number;
  range: number;
  damage: number;
  cooldown: number;
  lastAttack: number;
}

export interface Enemy {
  id: string;
  type: EnemyType;
  position: Position;
  targetPosition: Position;
  health: number;
  maxHealth: number;
  speed: number;
  damage: number;
  lane: number;
}

export interface Resources {
  ammunition: number;
  food: number;
  medical: number;
}

export interface Wave {
  waveNumber: number;
  enemies: { type: EnemyType; count: number }[];
  delay: number;
}

export interface Decision {
  id: string;
  title: string;
  description: string;
  quote: string;
  options: {
    id: string;
    text: string;
    consequence: string;
    effect: Partial<Resources> & { morale?: number };
  }[];
}

export interface GameState {
  day: number;
  wave: number;
  totalWaves: number;
  timeOfDay: TimeOfDay;
  resources: Resources;
  morale: number;
  defenders: Defender[];
  enemies: Enemy[];
  isPlaying: boolean;
  isPaused: boolean;
  speed: number;
  selectedUnit: UnitType | null;
  activeDecision: Decision | null;
  waveCountdown: number;
  raniAvailable: boolean;
  raniCooldown: number;
  gameOver: boolean;
  victory: boolean;
}

export interface DefenderCard {
  type: UnitType;
  name: string;
  cost: { ammo?: number; food?: number };
  description: string;
  icon: string;
}

export const DEFENDER_CARDS: DefenderCard[] = [
  { type: 'musketeer', name: 'Musketeer', cost: { ammo: 15 }, description: 'Ranged defender', icon: '🔫' },
  { type: 'swordsman', name: 'Swordsman', cost: { food: 5 }, description: 'Melee defender', icon: '⚔️' },
  { type: 'cannon', name: 'Cannon', cost: { ammo: 50 }, description: 'Area damage', icon: '💣' },
  { type: 'rani', name: 'Rani Lakshmibai', cost: {}, description: 'Hero unit', icon: '👑' },
];

export const UNIT_STATS: Record<UnitType, Omit<Defender, 'id' | 'position' | 'lastAttack'>> = {
  musketeer: { type: 'musketeer', health: 100, maxHealth: 100, range: 150, damage: 25, cooldown: 1500 },
  swordsman: { type: 'swordsman', health: 150, maxHealth: 150, range: 50, damage: 35, cooldown: 1000 },
  cannon: { type: 'cannon', health: 200, maxHealth: 200, range: 200, damage: 60, cooldown: 3000 },
  rani: { type: 'rani', health: 300, maxHealth: 300, range: 120, damage: 50, cooldown: 800 },
};

export const ENEMY_STATS: Record<EnemyType, { health: number; speed: number; damage: number }> = {
  infantry: { health: 80, speed: 0.5, damage: 15 },
  cavalry: { health: 120, speed: 1.2, damage: 25 },
  artillery: { health: 60, speed: 0.3, damage: 40 },
};
