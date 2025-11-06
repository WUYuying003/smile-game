// 笑容收集之旅 - Hand Tracking Game with MediaPipe
// Canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const video = document.getElementById('video');

// MediaPipe Hands
let hands;
let camera;
let handDetected = false;
let fingerTipPosition = null;

// Game settings
let gameState = 'waiting_camera'; // waiting_camera, playing, level_complete, game_over, wrong
let score = 0;
let level = 1;
let currentTarget = 1;
let targets = [];
let particles = [];

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
                width: 1280,
                height: 720,
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
            width: 1280,
            height: 720
        });
        
        await camera.start();
        
        // Update status
        document.getElementById('cameraStatus').innerHTML = 
            '<span class="status-icon">✅</span><span class="status-text">摄像头已就绪</span>';
        
        // Hide camera modal and start game
        document.getElementById('cameraModal').style.display = 'none';
        gameState = 'playing';
        generateTargets();
        
        return true;
    } catch (error) {
        console.error('Camera error:', error);
        document.getElementById('cameraStatus').innerHTML = 
            '<span class="status-icon">❌</span><span class="status-text">摄像头错误</span>';
        alert('无法访问摄像头。请确保已授予权限。');
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

// Draw finger tip indicator
function drawFingerIndicator() {
    if (fingerTipPosition) {
        const {x, y} = fingerTipPosition;
        
        // Draw outer circle
        ctx.strokeStyle = COLORS.white;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.stroke();
        
        // Draw inner circle
        ctx.fillStyle = COLORS.accent;
        ctx.beginPath();
        ctx.arc(x, y, 15, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw crosshair
        ctx.strokeStyle = COLORS.white;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x - 10, y);
        ctx.lineTo(x + 10, y);
        ctx.moveTo(x, y - 10);
        ctx.lineTo(x, y + 10);
        ctx.stroke();
    }
}

// Draw targets
function drawTargets() {
    for (let target of targets) {
        const {x, y, number, completed, beingTouched, wrong} = target;
        
        // Draw countdown progress for current target
        if (number === currentTarget && !completed && target.startTime) {
            const elapsed = (Date.now() - target.startTime) / 1000;
            const remaining = Math.max(0, 1 - elapsed / 10.0);
            
            if (remaining > 0) {
                const angle = remaining * Math.PI * 2;
                ctx.strokeStyle = remaining > 0.5 ? COLORS.accent : COLORS.wrong;
                ctx.lineWidth = 5;
                ctx.beginPath();
                ctx.arc(x, y, TARGET_RADIUS + 15, -Math.PI / 2, -Math.PI / 2 + angle);
                ctx.stroke();
            }
        }
        
        // Choose color and draw
        let color;
        if (wrong) {
            color = COLORS.wrong;
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(x, y, TARGET_RADIUS, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw X
            ctx.strokeStyle = COLORS.white;
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(x - 20, y - 20);
            ctx.lineTo(x + 20, y + 20);
            ctx.moveTo(x - 20, y + 20);
            ctx.lineTo(x + 20, y - 20);
            ctx.stroke();
        } else if (completed) {
            color = COLORS.primary;
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(x, y, TARGET_RADIUS, 0, Math.PI * 2);
            ctx.fill();
        } else if (number === currentTarget) {
            color = beingTouched ? COLORS.success : COLORS.white;
            ctx.strokeStyle = color;
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.arc(x, y, TARGET_RADIUS, 0, Math.PI * 2);
            ctx.stroke();
            
            // Draw number
            ctx.fillStyle = color;
            ctx.font = 'bold 48px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(number.toString(), x, y);
        } else {
            color = COLORS.secondary;
            ctx.strokeStyle = color;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(x, y, TARGET_RADIUS, 0, Math.PI * 2);
            ctx.stroke();
            
            ctx.fillStyle = color;
            ctx.font = 'bold 36px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(number.toString(), x, y);
        }
    }
}

// Particle system
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
        const size = 25 * scale;
        
        // Draw smiley
        ctx.fillStyle = COLORS.accent;
        ctx.beginPath();
        ctx.arc(currentX, currentY, size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = COLORS.white;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(currentX, currentY, size, 0, Math.PI * 2);
        ctx.stroke();
        
        if (size > 10) {
            // Eyes
            ctx.fillStyle = COLORS.black;
            ctx.beginPath();
            ctx.arc(currentX - size * 0.3, currentY - size * 0.2, size * 0.15, 0, Math.PI * 2);
            ctx.arc(currentX + size * 0.3, currentY - size * 0.2, size * 0.15, 0, Math.PI * 2);
            ctx.fill();
            
            // Smile
            ctx.strokeStyle = COLORS.black;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(currentX, currentY + size * 0.2, size * 0.4, 0, Math.PI, false);
            ctx.stroke();
        }
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
    // Draw video feed as background (flipped horizontally for mirror effect)
    ctx.save();
    ctx.scale(-1, 1); // Flip horizontally
    ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
    ctx.restore();
    
    // Optional: Add slight overlay for better visibility of UI elements
    ctx.fillStyle = 'rgba(26, 13, 46, 0.2)'; // Subtle purple overlay
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw game elements on top of video
    drawTargets();
    
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
