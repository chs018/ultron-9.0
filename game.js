/* ==================== MINECRAFT GAME LOGIC ==================== */

// Game State
let gameState = {
    score: 0,
    blocksDestroyed: 0,
    isPlaying: false,
    selectedBlock: 'grass',
    startTime: null,
    timerInterval: null,
    highScore: localStorage.getItem('minecraftHighScore') || 0
};

// Block Types and Points
const blockTypes = {
    grass: { points: 10, color: '#5DBB63', clicks: 1 },
    dirt: { points: 15, color: '#8B5A2B', clicks: 2 },
    stone: { points: 20, color: '#7D7D7D', clicks: 3 },
    diamond: { points: 50, color: '#7EC8E3', clicks: 5 }
};

// Initialize Game
function initGame() {
    createGrid();
    setupBlockSelector();
    setupControls();
    updateHighScore();
    
    // Add click sound effect
    document.addEventListener('click', () => {
        if (gameState.isPlaying) {
            // Visual feedback
            console.log('Block interaction!');
        }
    });
}

// Create Game Grid
function createGrid() {
    const grid = document.getElementById('gameGrid');
    grid.innerHTML = '';
    
    const gridSize = 10; // 10x10 grid
    
    for (let i = 0; i < gridSize * gridSize; i++) {
        const cell = document.createElement('div');
        cell.className = 'game-cell';
        cell.dataset.index = i;
        cell.dataset.clicks = 0;
        
        // Randomly populate some blocks
        if (Math.random() > 0.5) {
            const randomBlock = ['grass', 'dirt', 'stone', 'diamond'][Math.floor(Math.random() * 4)];
            const blockProb = randomBlock === 'diamond' ? 0.1 : 1;
            
            if (Math.random() < blockProb) {
                cell.classList.add('has-block', `block-${randomBlock}`);
                cell.dataset.blockType = randomBlock;
                cell.dataset.clicks = 0;
            }
        }
        
        // Add click handler
        cell.addEventListener('click', handleCellClick);
        
        grid.appendChild(cell);
    }
}

// Handle Cell Click
function handleCellClick(e) {
    const cell = e.target;
    
    if (!gameState.isPlaying) {
        // Build mode - place blocks
        if (!cell.classList.contains('has-block')) {
            cell.classList.add('has-block', `block-${gameState.selectedBlock}`);
            cell.dataset.blockType = gameState.selectedBlock;
            cell.dataset.clicks = 0;
            
            // Animation
            gsap.from(cell, {
                scale: 0,
                duration: 0.2,
                ease: 'back.out'
            });
        }
        return;
    }
    
    // Mining mode - destroy blocks
    if (cell.classList.contains('has-block')) {
        const blockType = cell.dataset.blockType;
        const clicksNeeded = blockTypes[blockType].clicks;
        let currentClicks = parseInt(cell.dataset.clicks) || 0;
        
        currentClicks++;
        cell.dataset.clicks = currentClicks;
        
        // Visual feedback - shake
        gsap.to(cell, {
            x: Math.random() * 4 - 2,
            y: Math.random() * 4 - 2,
            duration: 0.1,
            ease: 'power2.out',
            onComplete: () => {
                gsap.to(cell, { x: 0, y: 0, duration: 0.1 });
            }
        });
        
        // Add cracks based on clicks
        const crackPercent = (currentClicks / clicksNeeded) * 100;
        cell.style.opacity = 1 - (crackPercent / 200);
        
        // Block destroyed
        if (currentClicks >= clicksNeeded) {
            destroyBlock(cell, blockType);
        }
    }
}

// Destroy Block
function destroyBlock(cell, blockType) {
    const points = blockTypes[blockType].points;
    
    // Update score
    gameState.score += points;
    gameState.blocksDestroyed++;
    
    updateStats();
    
    // Particle effect
    createParticles(cell, blockType);
    
    // Remove block
    gsap.to(cell, {
        scale: 0,
        rotation: 360,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
            cell.classList.remove('has-block', `block-${blockType}`);
            cell.dataset.blockType = '';
            cell.dataset.clicks = 0;
            cell.style.opacity = 1;
            gsap.set(cell, { scale: 1, rotation: 0 });
        }
    });
    
    // Check for high score
    if (gameState.score > gameState.highScore) {
        gameState.highScore = gameState.score;
        localStorage.setItem('minecraftHighScore', gameState.highScore);
        updateHighScore();
        
        // Celebration effect
        console.log('🎉 NEW HIGH SCORE!');
    }
}

// Create Particles
function createParticles(cell, blockType) {
    const rect = cell.getBoundingClientRect();
    const color = blockTypes[blockType].color;
    
    for (let i = 0; i < 6; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: fixed;
            left: ${rect.left + rect.width / 2}px;
            top: ${rect.top + rect.height / 2}px;
            width: 8px;
            height: 8px;
            background-color: ${color};
            pointer-events: none;
            z-index: 1000;
        `;
        document.body.appendChild(particle);
        
        // Animate particle
        gsap.to(particle, {
            x: (Math.random() - 0.5) * 100,
            y: (Math.random() - 0.5) * 100,
            opacity: 0,
            duration: 0.6,
            ease: 'power2.out',
            onComplete: () => particle.remove()
        });
    }
}

// Block Selector
function setupBlockSelector() {
    const options = document.querySelectorAll('.block-option');
    
    options.forEach(option => {
        option.addEventListener('click', () => {
            options.forEach(o => o.classList.remove('active'));
            option.classList.add('active');
            gameState.selectedBlock = option.dataset.block;
            
            // Animation
            gsap.from(option, {
                scale: 0.9,
                duration: 0.2,
                ease: 'back.out'
            });
        });
    });
}

// Game Controls
function setupControls() {
    const startBtn = document.getElementById('startBtn');
    const resetBtn = document.getElementById('resetBtn');
    const clearBtn = document.getElementById('clearBtn');
    
    startBtn.addEventListener('click', () => {
        if (!gameState.isPlaying) {
            startGame();
            startBtn.textContent = 'STOP GAME';
            startBtn.classList.remove('btn-primary');
            startBtn.classList.add('btn-alert');
        } else {
            stopGame();
            startBtn.textContent = 'START GAME';
            startBtn.classList.remove('btn-alert');
            startBtn.classList.add('btn-primary');
        }
    });
    
    resetBtn.addEventListener('click', resetGame);
    clearBtn.addEventListener('click', clearGrid);
}

// Start Game
function startGame() {
    gameState.isPlaying = true;
    gameState.startTime = Date.now();
    gameState.score = 0;
    gameState.blocksDestroyed = 0;
    
    updateStats();
    startTimer();
    
    // Populate grid with more blocks
    const cells = document.querySelectorAll('.game-cell');
    cells.forEach(cell => {
        if (!cell.classList.contains('has-block') && Math.random() > 0.6) {
            const blockType = ['grass', 'dirt', 'stone', 'diamond'][Math.floor(Math.random() * 4)];
            cell.classList.add('has-block', `block-${blockType}`);
            cell.dataset.blockType = blockType;
            cell.dataset.clicks = 0;
            
            gsap.from(cell, {
                scale: 0,
                duration: 0.3,
                delay: Math.random() * 0.5,
                ease: 'back.out'
            });
        }
    });
}

// Stop Game
function stopGame() {
    gameState.isPlaying = false;
    clearInterval(gameState.timerInterval);
}

// Reset Game
function resetGame() {
    stopGame();
    gameState.score = 0;
    gameState.blocksDestroyed = 0;
    gameState.startTime = null;
    
    updateStats();
    document.getElementById('timer').textContent = '00:00';
    document.getElementById('startBtn').textContent = 'START GAME';
    document.getElementById('startBtn').classList.remove('btn-alert');
    document.getElementById('startBtn').classList.add('btn-primary');
    
    createGrid();
}

// Clear Grid
function clearGrid() {
    const cells = document.querySelectorAll('.game-cell');
    cells.forEach((cell, index) => {
        gsap.to(cell, {
            scale: 0,
            duration: 0.2,
            delay: index * 0.01,
            ease: 'power2.in',
            onComplete: () => {
                cell.classList.remove('has-block', 'block-grass', 'block-dirt', 'block-stone', 'block-diamond');
                cell.dataset.blockType = '';
                cell.dataset.clicks = 0;
                cell.style.opacity = 1;
                gsap.set(cell, { scale: 1 });
            }
        });
    });
}

// Start Timer
function startTimer() {
    gameState.timerInterval = setInterval(() => {
        const elapsed = Date.now() - gameState.startTime;
        const minutes = Math.floor(elapsed / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        
        document.getElementById('timer').textContent = 
            `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }, 1000);
}

// Update Stats
function updateStats() {
    document.getElementById('score').textContent = gameState.score;
    document.getElementById('blocks').textContent = gameState.blocksDestroyed;
}

// Update High Score
function updateHighScore() {
    document.getElementById('highScore').textContent = gameState.highScore;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initGame);
