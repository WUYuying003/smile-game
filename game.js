// Coin Collection Journey - Hand Tracking Game with MediaPipe
// Canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const video = document.getElementById('video');

// Disable image smoothing for pixel art
ctx.imageSmoothingEnabled = false;
ctx.mozImageSmoothingEnabled = false;
ctx.webkitImageSmoothingEnabled = false;
ctx.msImageSmoothingEnabled = false;

// Animated coin sprite frames (16x16 spinning coin animation)
const COIN_FRAMES = [
    // Frame 1 - Full circle
    [[0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0],
     [0,0,1,1,2,2,2,2,2,2,2,2,1,1,0,0],
     [0,1,2,2,2,3,3,3,3,3,3,2,2,2,1,0],
     [0,1,2,3,3,3,1,1,1,1,3,3,3,2,1,0],
     [1,2,2,3,1,1,1,1,1,1,1,1,3,2,2,1],
     [1,2,3,3,1,1,1,1,1,1,1,1,3,3,2,1],
     [1,2,3,1,1,1,1,1,1,1,1,1,1,3,2,1],
     [1,2,3,1,1,1,1,1,1,1,1,1,1,3,2,1],
     [1,2,3,1,1,1,1,1,1,1,1,1,1,3,2,1],
     [1,2,3,3,1,1,1,1,1,1,1,1,3,3,2,1],
     [1,2,2,3,1,1,1,1,1,1,1,1,3,2,2,1],
     [0,1,2,3,3,3,1,1,1,1,3,3,3,2,1,0],
     [0,1,2,2,2,3,3,3,3,3,3,2,2,2,1,0],
     [0,0,1,1,2,2,2,2,2,2,2,2,1,1,0,0],
     [0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0],
     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]],
    
    // Frame 2 - Tilted
    [[0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0],
     [0,0,1,1,2,2,2,2,2,2,2,2,1,1,0,0],
     [0,1,2,2,2,3,3,3,3,3,3,2,2,2,1,0],
     [0,1,2,3,3,1,1,1,1,1,1,3,3,2,1,0],
     [1,2,2,3,1,1,1,1,1,1,1,1,3,2,2,1],
     [1,2,3,1,1,1,1,1,1,1,1,1,1,3,2,1],
     [1,2,3,1,1,1,1,1,1,1,1,1,1,3,2,1],
     [1,2,3,1,1,1,1,1,1,1,1,1,1,3,2,1],
     [1,2,3,1,1,1,1,1,1,1,1,1,1,3,2,1],
     [1,2,3,1,1,1,1,1,1,1,1,1,1,3,2,1],
     [1,2,2,3,1,1,1,1,1,1,1,1,3,2,2,1],
     [0,1,2,3,3,1,1,1,1,1,1,3,3,2,1,0],
     [0,1,2,2,2,3,3,3,3,3,3,2,2,2,1,0],
     [0,0,1,1,2,2,2,2,2,2,2,2,1,1,0,0],
     [0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0],
     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]],
    
    // Frame 3 - Thin vertical
    [[0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0],
     [0,0,0,0,0,1,2,2,2,2,1,0,0,0,0,0],
     [0,0,0,0,1,2,2,3,3,2,2,1,0,0,0,0],
     [0,0,0,0,1,2,3,1,1,3,2,1,0,0,0,0],
     [0,0,0,0,1,2,3,1,1,3,2,1,0,0,0,0],
     [0,0,0,0,1,2,3,1,1,3,2,1,0,0,0,0],
     [0,0,0,0,1,2,3,1,1,3,2,1,0,0,0,0],
     [0,0,0,0,1,2,3,1,1,3,2,1,0,0,0,0],
     [0,0,0,0,1,2,3,1,1,3,2,1,0,0,0,0],
     [0,0,0,0,1,2,3,1,1,3,2,1,0,0,0,0],
     [0,0,0,0,1,2,3,1,1,3,2,1,0,0,0,0],
     [0,0,0,0,1,2,3,1,1,3,2,1,0,0,0,0],
     [0,0,0,0,1,2,2,3,3,2,2,1,0,0,0,0],
     [0,0,0,0,0,1,2,2,2,2,1,0,0,0,0,0],
     [0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0],
     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]]
];
// 0 = transparent, 1 = dark orange, 2 = orange, 3 = yellow
let coinAnimationFrame = 0;
const COIN_FRAME_SPEED = 0.2; // Frames per game update

// MediaPipe Hands
let hands;
let camera;
let handDetected = false;
let fingerTipPosition = null;

// Game settings
let gameState = 'waiting_camera'; // waiting_camera, playing, level_complete, game_over, wrong, victory
let score = 0;
let level = 1;
let currentTarget = 1;
let targets = [];
let particles = [];
const VICTORY_LEVEL = 8; // 完成第8关通关
let secretCodeRevealed = false;

// Timing
let targetTimer = 10.0;
let targetStartTime = Date.now();
let wrongModalStartTime = null;
const WRONG_MODAL_DURATION = 2000;

// Target settings
let targetsPerLevel = 2;
const TARGET_RADIUS = 50;
const TOUCH_THRESHOLD = 80; // Larger threshold for hand tracking

// Colors - Purple, Yellow theme
const COLORS = {
    bg: '#1a0d2e',
    bgLight: '#2d1b4e',
    primary: '#9d4edd',
    secondary: '#c77dff',
    accent: '#ffd60a',
    white: '#ffffff',
    black: '#000000',
    gray: '#4a4a4a',
    grayLight: '#808080',
    wrong: '#e63946',
    success: '#06ffa5',
};

// Track touch state
let fingerTouchedLastFrame = false;

// Draw animated pixelated coin
function drawPixelCoin(x, y, size) {
    const frameIndex = Math.floor(coinAnimationFrame) % COIN_FRAMES.length;
    const frame = COIN_FRAMES[frameIndex];
    const pixelSize = size / 16; // 16x16 grid
    
    for (let row = 0; row < 16; row++) {
        for (let col = 0; col < 16; col++) {
            const pixel = frame[row][col];
            if (pixel === 0) continue; // transparent
            
            const px = x - size/2 + col * pixelSize;
            const py = y - size/2 + row * pixelSize;
            
            if (pixel === 1) {
                ctx.fillStyle = '#8B4513'; // dark orange/brown
            } else if (pixel === 2) {
                ctx.fillStyle = '#FFA500'; // orange
            } else if (pixel === 3) {
                ctx.fillStyle = COLORS.accent; // yellow
            }
            
            ctx.fillRect(Math.floor(px), Math.floor(py), Math.ceil(pixelSize), Math.ceil(pixelSize));
        }
    }
}

// Draw pixelated number in a circle
function drawPixelNumber(x, y, number, radius, color, filled = false) {
    // Draw square background
    const size = radius * 2;
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    
    if (filled) {
        ctx.fillStyle = color;
        ctx.fillRect(x - radius, y - radius, size, size);
        ctx.fillStyle = COLORS.black;
    } else {
        ctx.strokeRect(x - radius, y - radius, size, size);
        ctx.fillStyle = color;
    }
    
    // Draw number
    ctx.font = `bold ${radius * 1.2}px "Press Start 2P", monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(number.toString(), x, y);
}

// Initialize MediaPipe Hands
async function initializeHands() {
    hands = new Hands({
        locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
        }
    });

    hands.setOptions({
        maxNumHands: 2,
        modelComplexity: 1,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.7
    });

    hands.onResults(onHandResults);
}

// Handle hand detection results
function onHandResults(results) {
    handDetected = results.multiHandLandmarks && results.multiHandLandmarks.length > 0;
    
    if (handDetected) {
        // Get index finger tip (landmark 8) from first detected hand
        const landmarks = results.multiHandLandmarks[0];
        const indexTip = landmarks[8];
        
        // Convert to canvas coordinates (flip horizontally for mirror effect)
        fingerTipPosition = {
            x: (1 - indexTip.x) * canvas.width,
            y: indexTip.y * canvas.height
        };
    } else {
        fingerTipPosition = null;
    }
}

// Initialize camera
async function initializeCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                width: 1920,
                height: 1080,
                facingMode: 'user'
            }
        });
        
        video.srcObject = stream;
        
        await new Promise((resolve) => {
            video.onloadedmetadata = () => {
                resolve();
            };
        });
        
        camera = new Camera(video, {
            onFrame: async () => {
                await hands.send({image: video});
            },
            width: 1920,
            height: 1080
        });
        
        await camera.start();
        
        // Update status
        document.getElementById('cameraStatus').innerHTML = 
            '<span class="status-icon">✅</span><span class="status-text">Camera Ready</span>';
        
        // Hide camera modal and start game
        document.getElementById('cameraModal').style.display = 'none';
        gameState = 'playing';
        generateTargets();
        
        return true;
    } catch (error) {
        console.error('Camera error:', error);
        document.getElementById('cameraStatus').innerHTML = 
            '<span class="status-icon">❌</span><span class="status-text">Camera Error</span>';
        alert('Cannot access camera. Please grant permission.');
        return false;
    }
}

// Initialize game
async function init() {
    await initializeHands();
    setupEventListeners();
    gameLoop();
}

// Generate random target positions
function generateTargets() {
    targets = [];
    targetsPerLevel = Math.min(2 + level - 1, 8);
    
    const margin = 80;
    
    for (let i = 0; i < targetsPerLevel; i++) {
        let x, y, valid;
        let attempts = 0;
        
        do {
            x = Math.floor(Math.random() * (canvas.width - margin * 2) + margin);
            y = Math.floor(Math.random() * (canvas.height - margin * 2 - 150) + margin + 100);
            
            valid = true;
            for (let target of targets) {
                const dist = Math.sqrt((x - target.x) ** 2 + (y - target.y) ** 2);
                if (dist < TARGET_RADIUS * 3) {
                    valid = false;
                    break;
                }
            }
            
            attempts++;
            if (attempts > 100) break;
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

// Draw finger tip indicator (pixelated square)
function drawFingerIndicator() {
    if (fingerTipPosition) {
        const {x, y} = fingerTipPosition;
        const size = 16; // 16x16 pixel square
        
        // Draw outer square (white border)
        ctx.strokeStyle = COLORS.white;
        ctx.lineWidth = 4;
        ctx.strokeRect(x - size, y - size, size * 2, size * 2);
        
        // Draw inner square (yellow)
        ctx.fillStyle = COLORS.accent;
        ctx.fillRect(x - size/2, y - size/2, size, size);
        
        // Draw crosshair (pixelated)
        ctx.fillStyle = COLORS.white;
        ctx.fillRect(x - 8, y - 2, 16, 4); // horizontal
        ctx.fillRect(x - 2, y - 8, 4, 16); // vertical
    }
}

// Draw targets (pixelated squares)
function drawTargets() {
    for (let target of targets) {
        const {x, y, number, completed, beingTouched, wrong} = target;
        const squareSize = TARGET_RADIUS * 2;
        
        // Draw countdown progress for current target (pixelated border)
        if (number === currentTarget && !completed && target.startTime) {
            const elapsed = (Date.now() - target.startTime) / 1000;
            const remaining = Math.max(0, 1 - elapsed / 10.0);
            
            if (remaining > 0) {
                const progressColor = remaining > 0.5 ? COLORS.accent : COLORS.wrong;
                const progressSize = squareSize + 30;
                const borderWidth = 8;
                
                // Draw progress on all four sides
                ctx.fillStyle = progressColor;
                const progressAmount = remaining;
                
                // Top
                if (progressAmount > 0) {
                    const topWidth = Math.min(1, progressAmount * 4) * progressSize;
                    ctx.fillRect(x - progressSize/2, y - progressSize/2 - borderWidth, topWidth, borderWidth);
                }
                // Right
                if (progressAmount > 0.25) {
                    const rightHeight = Math.min(1, (progressAmount - 0.25) * 4) * progressSize;
                    ctx.fillRect(x + progressSize/2, y - progressSize/2, borderWidth, rightHeight);
                }
                // Bottom
                if (progressAmount > 0.5) {
                    const bottomWidth = Math.min(1, (progressAmount - 0.5) * 4) * progressSize;
                    ctx.fillRect(x + progressSize/2 - bottomWidth, y + progressSize/2, bottomWidth, borderWidth);
                }
                // Left
                if (progressAmount > 0.75) {
                    const leftHeight = Math.min(1, (progressAmount - 0.75) * 4) * progressSize;
                    ctx.fillRect(x - progressSize/2 - borderWidth, y + progressSize/2 - leftHeight, borderWidth, leftHeight);
                }
            }
        }
        
        // Choose color and draw pixelated square
        let color;
        if (wrong) {
            // Wrong - red square with X
            ctx.fillStyle = COLORS.wrong;
            ctx.fillRect(x - squareSize/2, y - squareSize/2, squareSize, squareSize);
            
            // Draw X (pixelated)
            ctx.fillStyle = COLORS.white;
            const xSize = 8;
            for (let i = -20; i <= 20; i += 4) {
                ctx.fillRect(x + i - xSize/2, y + i - xSize/2, xSize, xSize);
                ctx.fillRect(x + i - xSize/2, y - i - xSize/2, xSize, xSize);
            }
        } else if (completed) {
            // Completed - purple square
            ctx.fillStyle = COLORS.primary;
            ctx.fillRect(x - squareSize/2, y - squareSize/2, squareSize, squareSize);
        } else if (number === currentTarget) {
            // Current target - white or green border with number
            color = beingTouched ? COLORS.success : COLORS.white;
            ctx.strokeStyle = color;
            ctx.lineWidth = 6;
            ctx.strokeRect(x - squareSize/2, y - squareSize/2, squareSize, squareSize);
            
            // Draw number
            drawPixelNumber(x, y, number, TARGET_RADIUS * 0.6, color, false);
        } else {
            // Future target - purple border with number
            color = COLORS.secondary;
            ctx.strokeStyle = color;
            ctx.lineWidth = 4;
            ctx.strokeRect(x - squareSize/2, y - squareSize/2, squareSize, squareSize);
            
            // Draw number
            drawPixelNumber(x, y, number, TARGET_RADIUS * 0.5, color, false);
        }
    }
}

// Particle system (pixelated spinning coin)
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
        const size = 48 * scale; // Larger for visibility (3x16 pixels)
        
        // Draw animated pixelated coin
        drawPixelCoin(currentX, currentY, size);
    }
}

// Check if finger touches target
function checkTouch(fingerX, fingerY) {
    for (let target of targets) {
        if (!target.completed) {
            const dist = Math.sqrt((fingerX - target.x) ** 2 + (fingerY - target.y) ** 2);
            
            if (dist < TOUCH_THRESHOLD) {
                target.beingTouched = true;
                return target.number;
            } else {
                target.beingTouched = false;
            }
        }
    }
    return null;
}

// Complete target
function completeTarget(fingerX, fingerY) {
    for (let target of targets) {
        if (target.number === currentTarget) {
            target.completed = true;
            target.beingTouched = false;
            
            particles.push(new Particle(fingerX, fingerY, 100, 60));
            
            score++;
            currentTarget++;
            
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

// Update game state
function update() {
    // Update coin animation
    coinAnimationFrame += COIN_FRAME_SPEED;
    if (coinAnimationFrame >= COIN_FRAMES.length * 10) {
        coinAnimationFrame = 0;
    }
    
    // Update particles
    particles = particles.filter(p => {
        const done = p.update();
        return !done;
    });
    
    if (gameState === 'playing') {
        // Check for hand interaction
        if (fingerTipPosition) {
            const touchedTarget = checkTouch(fingerTipPosition.x, fingerTipPosition.y);
            
            if (touchedTarget !== null && !fingerTouchedLastFrame) {
                if (touchedTarget === currentTarget) {
                    completeTarget(fingerTipPosition.x, fingerTipPosition.y);
                } else {
                    wrongTouch(touchedTarget);
                }
                fingerTouchedLastFrame = true;
            } else if (touchedTarget === null) {
                fingerTouchedLastFrame = false;
            }
        } else {
            fingerTouchedLastFrame = false;
        }
        
        // Check if level complete
        if (currentTarget > targetsPerLevel && particles.length === 0) {
            // Check for victory (completed level 8)
            if (level >= VICTORY_LEVEL) {
                gameState = 'victory';
                document.getElementById('victoryModal').style.display = 'flex';
                document.getElementById('totalScore').textContent = score;
                document.getElementById('totalLevels').textContent = level;
                // Secret code already displayed in HTML
            } else {
                gameState = 'level_complete';
                document.getElementById('levelCompleteModal').style.display = 'flex';
                document.getElementById('nextLevel').textContent = level + 1;
                document.getElementById('targetsCount').textContent = Math.min(2 + level, 8);
            }
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
    } else if (gameState === 'level_complete') {
        // Check for finger touch on next level button
        if (fingerTipPosition) {
            checkNextLevelTouch(); // Update touch state for visual feedback
            if (buttonTouchState.nextLevel && !fingerTouchedLastFrame) {
                nextLevel();
                fingerTouchedLastFrame = true;
            }
        } else {
            buttonTouchState.nextLevel = false;
            fingerTouchedLastFrame = false;
        }
    } else if (gameState === 'victory') {
        // Victory screen - no interaction needed, code already shown
        fingerTouchedLastFrame = false;
    } else if (gameState === 'wrong') {
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
    
    // Update button visual feedback
    const nextButton = document.getElementById('nextButton');
    const secretCodeArea = document.getElementById('secretCodeArea');
    
    if (nextButton) {
        if (buttonTouchState.nextLevel) {
            nextButton.classList.add('touched');
        } else {
            nextButton.classList.remove('touched');
        }
    }
    
    if (secretCodeArea) {
        if (buttonTouchState.secretCode) {
            secretCodeArea.classList.add('touched');
        } else {
            secretCodeArea.classList.remove('touched');
        }
    }
}

// Draw everything
function draw() {
    // Draw video feed as background (flipped horizontally for mirror effect)
    ctx.save();
    ctx.scale(-1, 1); // Flip horizontally
    ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
    ctx.restore();
    
    // Optional: Add slight overlay for better visibility of UI elements
    ctx.fillStyle = 'rgba(26, 13, 46, 0.2)'; // Subtle purple overlay
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw game elements on top of video
    if (gameState !== 'victory') {
        drawTargets();
    }
    
    for (let particle of particles) {
        particle.draw();
    }
    
    // Draw finger indicator on top
    drawFingerIndicator();
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

// Button touch state tracking
let buttonTouchState = {
    nextLevel: false,
    secretCode: false
};

// Check if finger touches next level button area
function checkNextLevelTouch() {
    if (!fingerTipPosition || gameState !== 'level_complete') return false;
    
    const buttonArea = {
        x: canvas.width / 2,
        y: canvas.height / 2 + 80,
        width: 200,
        height: 60
    };
    
    const isTouching = fingerTipPosition.x > buttonArea.x - buttonArea.width / 2 &&
           fingerTipPosition.x < buttonArea.x + buttonArea.width / 2 &&
           fingerTipPosition.y > buttonArea.y - buttonArea.height / 2 &&
           fingerTipPosition.y < buttonArea.y + buttonArea.height / 2;
    
    buttonTouchState.nextLevel = isTouching;
    return isTouching;
}

// Check if finger touches secret code area
function checkSecretCodeTouch() {
    if (!fingerTipPosition || gameState !== 'victory') return false;
    
    const codeArea = {
        x: canvas.width / 2,
        y: canvas.height / 2 + 100,
        width: 300,
        height: 80
    };
    
    const isTouching = fingerTipPosition.x > codeArea.x - codeArea.width / 2 &&
           fingerTipPosition.x < codeArea.x + codeArea.width / 2 &&
           fingerTipPosition.y > codeArea.y - codeArea.height / 2 &&
           fingerTipPosition.y < codeArea.y + codeArea.height / 2;
    
    buttonTouchState.secretCode = isTouching;
    return isTouching;
}

// Event listeners
function setupEventListeners() {
    // Enable camera button
    document.getElementById('enableCameraButton').addEventListener('click', async () => {
        await initializeCamera();
    });
    
    // Keyboard events
    document.addEventListener('keydown', (e) => {
        if (e.key === 'r' || e.key === 'R') {
            resetGame();
            document.getElementById('gameOverModal').style.display = 'none';
            document.getElementById('levelCompleteModal').style.display = 'none';
            document.getElementById('wrongModal').style.display = 'none';
            document.getElementById('victoryModal').style.display = 'none';
            secretCodeRevealed = false;
        }
    });
    
    // Button events - kept for compatibility
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
