import { useRef, useEffect, useCallback } from 'react';
import { GameState, Position, Defender, Enemy } from '@/types/game';

interface GameCanvasProps {
  state: GameState;
  onPlaceDefender: (position: Position) => void;
}

export const GameCanvas = ({ state, onPlaceDefender }: GameCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const drawFort = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Sky gradient based on time of day
    const skyGradient = ctx.createLinearGradient(0, 0, 0, height);
    if (state.timeOfDay === 'dawn') {
      skyGradient.addColorStop(0, '#ffb366');
      skyGradient.addColorStop(0.5, '#ff8533');
      skyGradient.addColorStop(1, '#87ceeb');
    } else if (state.timeOfDay === 'dusk') {
      skyGradient.addColorStop(0, '#4a1a4a');
      skyGradient.addColorStop(0.5, '#ff6b33');
      skyGradient.addColorStop(1, '#ffb366');
    } else {
      skyGradient.addColorStop(0, '#87ceeb');
      skyGradient.addColorStop(1, '#b0d4e8');
    }
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, width, height);

    // Realistic ground with multiple layers
    const groundY = height * 0.25;
    
    // Base dirt layer
    const groundGradient = ctx.createLinearGradient(0, groundY, 0, height);
    groundGradient.addColorStop(0, '#9a7b55');
    groundGradient.addColorStop(0.3, '#8b6b45');
    groundGradient.addColorStop(0.7, '#7a5b35');
    groundGradient.addColorStop(1, '#6a4b25');
    ctx.fillStyle = groundGradient;
    ctx.fillRect(0, groundY, width, height - groundY);
    
    // Add grass patches near the fort
    ctx.fillStyle = '#5a7a40';
    for (let i = 0; i < 30; i++) {
      const grassX = Math.random() * (width - 150);
      const grassY = groundY + Math.random() * (height - groundY - 50);
      ctx.beginPath();
      ctx.ellipse(grassX, grassY, 15 + Math.random() * 20, 5 + Math.random() * 8, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Add dirt patches and texture
    for (let i = 0; i < 40; i++) {
      const patchX = Math.random() * (width - 120);
      const patchY = groundY + 20 + Math.random() * (height - groundY - 60);
      ctx.fillStyle = `rgba(${100 + Math.random() * 40}, ${70 + Math.random() * 30}, ${40 + Math.random() * 20}, 0.4)`;
      ctx.beginPath();
      ctx.arc(patchX, patchY, 3 + Math.random() * 8, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Small rocks scattered on ground
    ctx.fillStyle = '#6b6b6b';
    for (let i = 0; i < 20; i++) {
      const rockX = Math.random() * (width - 150);
      const rockY = groundY + 30 + Math.random() * (height - groundY - 80);
      ctx.beginPath();
      ctx.ellipse(rockX, rockY, 4 + Math.random() * 6, 3 + Math.random() * 4, Math.random() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw battle paths/lanes with dirt track appearance
    [150, 270, 390].forEach(y => {
      // Main path - worn dirt
      const pathGradient = ctx.createLinearGradient(0, y - 30, 0, y + 30);
      pathGradient.addColorStop(0, '#8a7860');
      pathGradient.addColorStop(0.5, '#7a6850');
      pathGradient.addColorStop(1, '#8a7860');
      ctx.fillStyle = pathGradient;
      ctx.fillRect(0, y - 28, width - 100, 56);
      
      // Path edges - trampled grass
      ctx.fillStyle = '#6a7a50';
      ctx.fillRect(0, y - 32, width - 100, 4);
      ctx.fillRect(0, y + 28, width - 100, 4);
      
      // Wheel tracks / footprints
      ctx.strokeStyle = '#6a5840';
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 12]);
      ctx.beginPath();
      ctx.moveTo(0, y - 10);
      ctx.lineTo(width - 100, y - 10);
      ctx.moveTo(0, y + 10);
      ctx.lineTo(width - 100, y + 10);
      ctx.stroke();
      ctx.setLineDash([]);
    });

    // Fort wall (right side) - Realistic stone fort
    const fortX = width - 120;
    
    // Fort foundation - darker stone base
    ctx.fillStyle = '#3a3028';
    ctx.fillRect(fortX - 5, height - 40, 130, 40);
    
    // Wall shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fillRect(fortX - 15, 60, 20, height - 80);
    
    // Main wall with stone texture
    const wallGradient = ctx.createLinearGradient(fortX, 0, fortX + 120, 0);
    wallGradient.addColorStop(0, '#6b5b48');
    wallGradient.addColorStop(0.2, '#8b7b68');
    wallGradient.addColorStop(0.5, '#7a6a58');
    wallGradient.addColorStop(0.8, '#8b7b68');
    wallGradient.addColorStop(1, '#5b4b38');
    ctx.fillStyle = wallGradient;
    ctx.fillRect(fortX, 50, 120, height - 70);
    
    // Stone block pattern on wall
    ctx.strokeStyle = '#4a4038';
    ctx.lineWidth = 1;
    for (let row = 0; row < 12; row++) {
      const yPos = 50 + row * 40;
      const offset = row % 2 === 0 ? 0 : 30;
      for (let col = 0; col < 3; col++) {
        ctx.strokeRect(fortX + offset + col * 60, yPos, 60, 40);
      }
    }
    
    // Battlements (merlons) on top
    for (let i = 0; i < 4; i++) {
      const merlonX = fortX + 5 + i * 30;
      ctx.fillStyle = '#6b5b48';
      ctx.fillRect(merlonX, 30, 22, 35);
      ctx.strokeStyle = '#4a4038';
      ctx.strokeRect(merlonX, 30, 22, 35);
    }
    
    // Watchtower on top
    ctx.fillStyle = '#5b4b38';
    ctx.fillRect(fortX + 35, 10, 50, 50);
    ctx.fillStyle = '#8B0000';
    ctx.fillRect(fortX + 40, 15, 40, 5); // Tower accent
    
    // Fort gate - Large wooden door
    ctx.fillStyle = '#3d2d1d';
    ctx.fillRect(fortX + 10, 220, 45, 100);
    
    // Gate arch
    ctx.beginPath();
    ctx.arc(fortX + 32, 220, 22, Math.PI, 0);
    ctx.fillStyle = '#5b4b3c';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(fortX + 32, 220, 18, Math.PI, 0);
    ctx.fillStyle = '#3d2d1d';
    ctx.fill();
    
    // Gate details - metal bands
    ctx.fillStyle = '#2a2a2a';
    ctx.fillRect(fortX + 10, 240, 45, 4);
    ctx.fillRect(fortX + 10, 280, 45, 4);
    ctx.fillRect(fortX + 10, 300, 45, 4);
    
    // Gate ring
    ctx.beginPath();
    ctx.arc(fortX + 45, 270, 5, 0, Math.PI * 2);
    ctx.strokeStyle = '#4a4a4a';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Jhansi triangular flag (pennant style - maroon with gold border)
    // Flag pole
    ctx.fillStyle = '#4a3a2a';
    ctx.fillRect(fortX + 55, 0, 5, 70);
    
    // Pole top ornament
    ctx.beginPath();
    ctx.arc(fortX + 57.5, 0, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#DAA520';
    ctx.fill();
    
    // Triangular flag (pennant pointing right)
    ctx.beginPath();
    ctx.moveTo(fortX + 60, 8); // Top left at pole
    ctx.lineTo(fortX + 115, 30); // Right point
    ctx.lineTo(fortX + 60, 52); // Bottom left at pole
    ctx.closePath();
    
    // Maroon fill with slight gradient
    const flagGradient = ctx.createLinearGradient(fortX + 60, 8, fortX + 115, 30);
    flagGradient.addColorStop(0, '#8B0000');
    flagGradient.addColorStop(1, '#a01010');
    ctx.fillStyle = flagGradient;
    ctx.fill();
    
    // Gold border
    ctx.strokeStyle = '#DAA520';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Flag emblem - simple sun symbol
    ctx.beginPath();
    ctx.arc(fortX + 80, 30, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#DAA520';
    ctx.fill();
    
    // Small gold tassels at the tip
    ctx.beginPath();
    ctx.arc(fortX + 115, 30, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#DAA520';
    ctx.fill();
    
    // Add some arrow slits to the wall
    ctx.fillStyle = '#1a1a1a';
    for (let i = 0; i < 3; i++) {
      ctx.fillRect(fortX + 15, 100 + i * 80, 4, 20);
      ctx.fillRect(fortX + 65, 140 + i * 80, 4, 20);
    }
  }, [state.timeOfDay]);

  const drawDefender = useCallback((ctx: CanvasRenderingContext2D, defender: Defender) => {
    const { x, y } = defender.position;
    
    // Range indicator (subtle)
    if (state.selectedUnit === null) {
      ctx.beginPath();
      ctx.arc(x, y, defender.range, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(100, 150, 255, 0.1)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(100, 150, 255, 0.3)';
      ctx.stroke();
    }

    // Unit body
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    
    if (defender.type === 'rani') {
      // Golden glow for Rani
      ctx.shadowColor = '#ffd700';
      ctx.shadowBlur = 15;
      ctx.fillStyle = '#c9a227';
    } else if (defender.type === 'cannon') {
      ctx.fillStyle = '#4a4a4a';
    } else {
      ctx.fillStyle = '#ffffff';
    }
    ctx.fill();
    ctx.shadowBlur = 0;
    
    // Unit border
    ctx.strokeStyle = defender.type === 'rani' ? '#ffd700' : '#3366cc';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Unit icon
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = defender.type === 'rani' ? '#ffffff' : '#333333';
    const icons = { musketeer: '🔫', swordsman: '⚔️', cannon: '💣', rani: '👑' };
    ctx.fillText(icons[defender.type], x, y);

    // Health bar
    const healthPercent = defender.health / defender.maxHealth;
    ctx.fillStyle = '#333';
    ctx.fillRect(x - 20, y - 35, 40, 6);
    ctx.fillStyle = healthPercent > 0.5 ? '#22c55e' : healthPercent > 0.25 ? '#f59e0b' : '#ef4444';
    ctx.fillRect(x - 20, y - 35, 40 * healthPercent, 6);
  }, [state.selectedUnit]);

  const drawEnemy = useCallback((ctx: CanvasRenderingContext2D, enemy: Enemy) => {
    const { x, y } = enemy.position;
    
    // Enemy body
    ctx.beginPath();
    if (enemy.type === 'cavalry') {
      // Larger for cavalry
      ctx.ellipse(x, y, 25, 18, 0, 0, Math.PI * 2);
    } else {
      ctx.arc(x, y, enemy.type === 'artillery' ? 22 : 18, 0, Math.PI * 2);
    }
    
    // Red coat color
    ctx.fillStyle = '#cc3333';
    ctx.fill();
    ctx.strokeStyle = '#991111';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Enemy icon - all British soldiers use the same icon
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('💂', x, y);

    // Health bar
    const healthPercent = enemy.health / enemy.maxHealth;
    ctx.fillStyle = '#333';
    ctx.fillRect(x - 15, y - 30, 30, 5);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(x - 15, y - 30, 30 * healthPercent, 5);
  }, []);

  const drawPlacementIndicator = useCallback((ctx: CanvasRenderingContext2D, mousePos: Position) => {
    if (!state.selectedUnit) return;
    
    ctx.beginPath();
    ctx.arc(mousePos.x, mousePos.y, 20, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(100, 200, 100, 0.5)';
    ctx.fill();
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.stroke();
    ctx.setLineDash([]);
  }, [state.selectedUnit]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = container.clientWidth;
    const height = container.clientHeight;
    canvas.width = width;
    canvas.height = height;

    // Clear and draw
    ctx.clearRect(0, 0, width, height);
    drawFort(ctx, width, height);
    
    // Draw defenders
    state.defenders.forEach(defender => drawDefender(ctx, defender));
    
    // Draw enemies
    state.enemies.forEach(enemy => drawEnemy(ctx, enemy));

  }, [state, drawFort, drawDefender, drawEnemy]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!state.selectedUnit) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Allow placement on the battlefield (left of fort, on the ground)
    if (x < canvas.width - 100 && y > 100 && y < canvas.height - 20) {
      onPlaceDefender({ x, y });
    }
  };

  return (
    <div 
      ref={containerRef} 
      className="flex-1 h-full rounded-lg overflow-hidden border-4 border-stone-dark shadow-lg"
    >
      <canvas
        ref={canvasRef}
        onClick={handleClick}
        className={`w-full h-full ${state.selectedUnit ? 'cursor-crosshair' : 'cursor-default'}`}
      />
    </div>
  );
};
