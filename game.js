// 笑容收集之旅 - Pixel Game
// Canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Pixel settings - 16x16 grid
const PIXEL_SIZE = 16;
const GRID_WIDTH = canvas.width / PIXEL_SIZE;  // 120 tiles
const GRID_HEIGHT = canvas.height / PIXEL_SIZE; // 67.5 tiles

// Game settings
let gameState = 'playing'; // playing, level_complete, game_over, wrong
let score = 0;
let level = 1;
let currentTarget = 1;
let targets = [];
let particles = [];

// Timing
let targetTimer = 10.0;
let targetStartTime = Date.now();
let wrongModalStartTime = null;
const WRONG_MODAL_DURATION = 2000; // 2 seconds

// Target settings
let targetsPerLevel = 2;
const TARGET_RADIUS_PIXELS = 3; // 3 tiles (48px at 16px/tile)
const TOUCH_THRESHOLD_PIXELS = 4; // 4 tiles (64px)

// Colors - Purple, Yellow, Black, White, Gray theme
const COLORS = {
    bg: '#1a0d2e',           // Dark purple background
    bgLight: '#2d1b4e',      // Lighter purple
    primary: '#9d4edd',      // Purple
    secondary: '#c77dff',    // Light purple
    accent: '#ffd60a',       // Yellow
    white: '#ffffff',
    black: '#000000',
    gray: '#4a4a4a',
    grayLight: '#808080',
    wrong: '#e63946',        // Red for errors
    success: '#06ffa5',      // Cyan for success
};

// Pixel Smiley Character (16x16) - Based on uploaded image
const SMILEY_SPRITE = [
    [0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0],
    [0,0,0,1,2,2,2,2,2,2,2,2,1,0,0,0],
    [0,0,1,2,2,2,2,2,2,2,2,2,2,1,0,0],
    [0,1,2,2,2,2,2,2,2,2,2,2,2,2,1,0],
    [1,2,2,1,1,1,2,2,2,2,1,1,1,2,2,1],
    [1,2,2,1,1,1,2,2,2,2,1,1,1,2,2,1],
    [1,2,2,1,1,1,2,2,2,2,1,1,1,2,2,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,2,1,1,2,2,2,2,2,2,1,1,2,2,1],
    [1,2,2,1,1,2,2,2,2,2,2,1,1,2,2,1],
    [1,2,2,2,2,1,1,1,1,1,1,2,2,2,2,1],
    [0,1,2,2,2,2,2,2,2,2,2,2,2,2,1,0],
    [0,0,1,2,2,2,2,2,2,2,2,2,2,1,0,0],
    [0,0,0,1,2,2,2,2,2,2,2,2,1,0,0,0],
    [0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
];

// Color mapping for sprite: 0=transparent, 1=black, 2=yellow
const SPRITE_COLORS = {
    0: null,
    1: COLORS.black,
    2: COLORS.accent
};

// Initialize game
function init() {
    generateTargets();
    setupEventListeners();
    gameLoop();
}

// Generate random target positions
function generateTargets() {
    targets = [];
    targetsPerLevel = Math.min(2 + level - 1, 8);
    
    const margin = 6; // tiles from edge
    
    for (let i = 0; i < targetsPerLevel; i++) {
        let x, y, valid;
        let attempts = 0;
        
        do {
            x = Math.floor(Math.random() * (GRID_WIDTH - margin * 2) + margin);
            y = Math.floor(Math.random() * (GRID_HEIGHT - margin * 2 - 12) + margin + 6); // Avoid UI areas
            
            valid = true;
            for (let target of targets) {
                const dist = Math.sqrt((x - target.x) ** 2 + (y - target.y) ** 2);
                if (dist < TARGET_RADIUS_PIXELS * 3) {
                    valid = false;
                    break;
                }
            }
            
            attempts++;
            if (attempts > 100) break; // Prevent infinite loop
        } while (!valid);
        
        targets.push({
            number: i + 1,
            x: x,
            y: y,
            completed: false,
            beingTouched: false,
            wrong: false,
            startTime: i === 0 ? Date.now() : null
        });
    }
    
    currentTarget = 1;
    targetStartTime = Date.now();
}

// Draw pixel grid helper
function drawPixel(x, y, color, size = 1) {
    if (!color) return;
    ctx.fillStyle = color;
    ctx.fillRect(x * PIXEL_SIZE, y * PIXEL_SIZE, size * PIXEL_SIZE, size * PIXEL_SIZE);
}

// Draw pixel circle (approximated)
function drawPixelCircle(cx, cy, radius, color, filled = false) {
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    
    // Use traditional circle for smoother look, but align to pixel grid
    const pixelX = Math.round(cx) * PIXEL_SIZE + PIXEL_SIZE / 2;
    const pixelY = Math.round(cy) * PIXEL_SIZE + PIXEL_SIZE / 2;
    const pixelRadius = radius * PIXEL_SIZE;
    
    ctx.beginPath();
    ctx.arc(pixelX, pixelY, pixelRadius, 0, Math.PI * 2);
    
    if (filled) {
        ctx.fill();
    } else {
        ctx.lineWidth = PIXEL_SIZE * 0.3;
        ctx.stroke();
    }
}

// Draw smiley sprite
function drawSmiley(x, y, scale = 1) {
    const size = 16 * scale;
    const offsetX = x - size / 2;
    const offsetY = y - size / 2;
    
    for (let row = 0; row < 16; row++) {
        for (let col = 0; col < 16; col++) {
            const colorCode = SMILEY_SPRITE[row][col];
            const color = SPRITE_COLORS[colorCode];
            
            if (color) {
                const pixelX = offsetX + col * scale;
                const pixelY = offsetY + row * scale;
                drawPixel(pixelX, pixelY, color, scale);
            }
        }
    }
}

// Draw pixel text
function drawPixelText(text, x, y, size, color) {
    ctx.fillStyle = color;
    ctx.font = `${size * PIXEL_SIZE}px "Press Start 2P", monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x * PIXEL_SIZE, y * PIXEL_SIZE);
}

// Draw targets
function drawTargets() {
    for (let target of targets) {
        const { x, y, number, completed, beingTouched, wrong } = target;
        
        // Draw timer progress for current target
        if (number === currentTarget && !completed && target.startTime) {
            const elapsed = (Date.now() - target.startTime) / 1000;
            const remaining = Math.max(0, 1 - elapsed / 10.0);
            
            if (remaining > 0) {
                const angle = remaining * Math.PI * 2;
                const pixelX = x * PIXEL_SIZE + PIXEL_SIZE / 2;
                const pixelY = y * PIXEL_SIZE + PIXEL_SIZE / 2;
                const radius = (TARGET_RADIUS_PIXELS + 1) * PIXEL_SIZE;
                
                ctx.strokeStyle = remaining > 0.5 ? COLORS.accent : COLORS.wrong;
                ctx.lineWidth = PIXEL_SIZE * 0.5;
                ctx.beginPath();
                ctx.arc(pixelX, pixelY, radius, -Math.PI / 2, -Math.PI / 2 + angle);
                ctx.stroke();
            }
        }
        
        // Choose color
        let color;
        if (wrong) {
            color = COLORS.wrong;
            drawPixelCircle(x, y, TARGET_RADIUS_PIXELS, color, true);
            
            // Draw X
            const offset = TARGET_RADIUS_PIXELS * 0.5;
            ctx.strokeStyle = COLORS.white;
            ctx.lineWidth = PIXEL_SIZE * 0.3;
            ctx.beginPath();
            ctx.moveTo((x - offset) * PIXEL_SIZE, (y - offset) * PIXEL_SIZE);
            ctx.lineTo((x + offset) * PIXEL_SIZE, (y + offset) * PIXEL_SIZE);
            ctx.moveTo((x - offset) * PIXEL_SIZE, (y + offset) * PIXEL_SIZE);
            ctx.lineTo((x + offset) * PIXEL_SIZE, (y - offset) * PIXEL_SIZE);
            ctx.stroke();
        } else if (completed) {
            color = COLORS.primary;
            drawPixelCircle(x, y, TARGET_RADIUS_PIXELS, color, true);
        } else if (number === currentTarget) {
            color = beingTouched ? COLORS.success : COLORS.white;
            drawPixelCircle(x, y, TARGET_RADIUS_PIXELS, color, false);
            
            // Draw number
            drawPixelText(number.toString(), x, y, 1.5, color);
        } else {
            color = COLORS.secondary;
            drawPixelCircle(x, y, TARGET_RADIUS_PIXELS, color, false);
            drawPixelText(number.toString(), x, y, 1, color);
        }
    }
}

// Particle system for effects
class Particle {
    constructor(x, y, targetX, targetY) {
        this.x = x;
        this.y = y;
        this.targetX = targetX;
        this.targetY = targetY;
        this.progress = 0;
        this.speed = 0.05;
    }
    
    update() {
        this.progress += this.speed;
        return this.progress >= 1;
    }
    
    draw() {
        const currentX = this.x + (this.targetX - this.x) * this.progress;
        const currentY = this.y + (this.targetY - this.y) * this.progress;
        const scale = 1.5 - this.progress * 0.5;
        
        drawSmiley(currentX, currentY, scale);
    }
}

// Update game state
function update() {
    // Update particles
    particles = particles.filter(p => {
        const done = p.update();
        return !done;
    });
    
    if (gameState === 'playing') {
        // Check if level complete
        if (currentTarget > targetsPerLevel && particles.length === 0) {
            gameState = 'level_complete';
            document.getElementById('levelCompleteModal').style.display = 'flex';
            document.getElementById('nextLevel').textContent = level + 1;
            document.getElementById('targetsCount').textContent = Math.min(2 + level, 8);
        }
        
        // Check timer
        if (currentTarget <= targetsPerLevel) {
            const elapsed = (Date.now() - targetStartTime) / 1000;
            targetTimer = Math.max(0, 10 - elapsed);
            
            if (targetTimer <= 0) {
                gameState = 'game_over';
                document.getElementById('gameOverModal').style.display = 'flex';
                document.getElementById('finalScore').textContent = score;
                document.getElementById('finalLevel').textContent = level;
            }
        }
    } else if (gameState === 'wrong') {
        // Check if wrong modal should close
        if (Date.now() - wrongModalStartTime > WRONG_MODAL_DURATION) {
            gameState = 'playing';
            document.getElementById('wrongModal').style.display = 'none';
            generateTargets();
        }
    }
    
    // Update UI
    document.getElementById('score').textContent = score;
    document.getElementById('level').textContent = level;
    document.getElementById('timer').textContent = Math.ceil(targetTimer);
}

// Draw everything
function draw() {
    // Clear with background
    ctx.fillStyle = COLORS.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid pattern (subtle)
    ctx.strokeStyle = COLORS.bgLight;
    ctx.lineWidth = 1;
    for (let x = 0; x < GRID_WIDTH; x += 4) {
        ctx.beginPath();
        ctx.moveTo(x * PIXEL_SIZE, 0);
        ctx.lineTo(x * PIXEL_SIZE, canvas.height);
        ctx.stroke();
    }
    for (let y = 0; y < GRID_HEIGHT; y += 4) {
        ctx.beginPath();
        ctx.moveTo(0, y * PIXEL_SIZE);
        ctx.lineTo(canvas.width, y * PIXEL_SIZE);
        ctx.stroke();
    }
    
    // Draw targets
    drawTargets();
    
    // Draw particles
    for (let particle of particles) {
        particle.draw();
    }
    
    // Draw overlays based on state
    if (gameState === 'wrong') {
        ctx.fillStyle = 'rgba(26, 13, 46, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}

// Check if point touches target
function checkTouch(pixelX, pixelY) {
    for (let target of targets) {
        if (!target.completed) {
            const dist = Math.sqrt((pixelX - target.x) ** 2 + (pixelY - target.y) ** 2);
            
            if (dist < TOUCH_THRESHOLD_PIXELS) {
                target.beingTouched = true;
                return target.number;
            } else {
                target.beingTouched = false;
            }
        }
    }
    return null;
}

// Handle touch/click
function handleTouch(clientX, clientY) {
    if (gameState !== 'playing') return;
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const canvasX = (clientX - rect.left) * scaleX;
    const canvasY = (clientY - rect.top) * scaleY;
    
    const pixelX = Math.floor(canvasX / PIXEL_SIZE);
    const pixelY = Math.floor(canvasY / PIXEL_SIZE);
    
    const touchedTarget = checkTouch(pixelX, pixelY);
    
    if (touchedTarget !== null) {
        if (touchedTarget === currentTarget) {
            // Correct target
            completeTarget(pixelX, pixelY);
        } else {
            // Wrong target
            wrongTouch(touchedTarget);
        }
    }
}

// Complete target
function completeTarget(pixelX, pixelY) {
    for (let target of targets) {
        if (target.number === currentTarget) {
            target.completed = true;
            target.beingTouched = false;
            
            // Create particle
            particles.push(new Particle(pixelX, pixelY, 6, 3));
            
            score++;
            currentTarget++;
            
            // Start timer for next target
            if (currentTarget <= targetsPerLevel) {
                targetStartTime = Date.now();
                targets[currentTarget - 1].startTime = targetStartTime;
            }
            
            break;
        }
    }
}

// Wrong touch
function wrongTouch(touchedNumber) {
    gameState = 'wrong';
    wrongModalStartTime = Date.now();
    
    document.getElementById('wrongModal').style.display = 'flex';
    
    for (let target of targets) {
        if (target.number === touchedNumber) {
            target.wrong = true;
        }
    }
}

// Reset game
function resetGame() {
    score = 0;
    level = 1;
    currentTarget = 1;
    targetsPerLevel = 2;
    gameState = 'playing';
    particles = [];
    generateTargets();
}

// Next level
function nextLevel() {
    level++;
    currentTarget = 1;
    targetsPerLevel = Math.min(2 + level - 1, 8);
    gameState = 'playing';
    particles = [];
    generateTargets();
    document.getElementById('levelCompleteModal').style.display = 'none';
}

// Event listeners
function setupEventListeners() {
    // Mouse events
    canvas.addEventListener('click', (e) => {
        handleTouch(e.clientX, e.clientY);
    });
    
    // Touch events
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (e.touches.length > 0) {
            handleTouch(e.touches[0].clientX, e.touches[0].clientY);
        }
    });
    
    // Keyboard events
    document.addEventListener('keydown', (e) => {
        if (e.key === 'r' || e.key === 'R') {
            resetGame();
            document.getElementById('gameOverModal').style.display = 'none';
            document.getElementById('levelCompleteModal').style.display = 'none';
            document.getElementById('wrongModal').style.display = 'none';
        } else if (e.key === 'Escape') {
            // Pause (can be extended)
        }
    });
    
    // Button events
    document.getElementById('nextButton').addEventListener('click', () => {
        nextLevel();
    });
    
    document.getElementById('restartButton').addEventListener('click', () => {
        resetGame();
        document.getElementById('gameOverModal').style.display = 'none';
    });
}

// Game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start game when page loads
window.addEventListener('load', init);
