/* ==================== MINI MINECRAFT GAME FOR HOME PAGE ==================== */

// Mini Game State
let miniGameState = {
    score: 0,
    blocksDestroyed: 0,
    isPlaying: false
};

// Block Types and Points
const miniBlockTypes = {
    grass: { points: 10, color: '#5DBB63', clicks: 1 },
    dirt: { points: 15, color: '#8B5A2B', clicks: 1 },
    stone: { points: 20, color: '#7D7D7D', clicks: 2 },
    diamond: { points: 50, color: '#7EC8E3', clicks: 3 }
};

// Initialize Mini Game
function initMiniGame() {
    createMiniGrid();
    setupMiniControls();
}

// Create Mini Game Grid (6x6)
function createMiniGrid() {
    const grid = document.getElementById('miniGameGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    const gridSize = 6; // 6x6 grid for home page
    
    for (let i = 0; i < gridSize * gridSize; i++) {
        const cell = document.createElement('div');
        cell.className = 'mini-game-cell';
        cell.dataset.index = i;
        cell.dataset.clicks = 0;
        
        // Randomly populate blocks
        if (Math.random() > 0.4) {
            const blockTypes = ['grass', 'dirt', 'stone', 'diamond'];
            const weights = [0.4, 0.3, 0.2, 0.1]; // Probability weights
            const randomBlock = weightedRandom(blockTypes, weights);
            
            cell.classList.add('has-block', `block-${randomBlock}`);
            cell.dataset.blockType = randomBlock;
            cell.dataset.clicks = 0;
        }
        
        // Add click handler
        cell.addEventListener('click', handleMiniCellClick);
        
        grid.appendChild(cell);
    }
}

// Weighted Random Selection
function weightedRandom(items, weights) {
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    let random = Math.random() * totalWeight;
    
    for (let i = 0; i < items.length; i++) {
        if (random < weights[i]) {
            return items[i];
        }
        random -= weights[i];
    }
    return items[items.length - 1];
}

// Handle Mini Cell Click
function handleMiniCellClick(e) {
    const cell = e.target;
    
    if (!miniGameState.isPlaying) {
        return;
    }
    
    // Mining mode - destroy blocks
    if (cell.classList.contains('has-block')) {
        const blockType = cell.dataset.blockType;
        const clicksNeeded = miniBlockTypes[blockType].clicks;
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
        
        // Add opacity effect based on damage
        const damagePercent = (currentClicks / clicksNeeded);
        cell.style.opacity = 1 - (damagePercent * 0.4);
        
        // Block destroyed
        if (currentClicks >= clicksNeeded) {
            destroyMiniBlock(cell, blockType);
        }
    }
}

// Destroy Mini Block
function destroyMiniBlock(cell, blockType) {
    const points = miniBlockTypes[blockType].points;
    
    // Update score
    miniGameState.score += points;
    miniGameState.blocksDestroyed++;
    
    updateMiniStats();
    
    // Particle effect
    createMiniParticles(cell, blockType);
    
    // Remove block with animation
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
            
            // Respawn a new block after a delay
            setTimeout(() => {
                if (miniGameState.isPlaying && !cell.classList.contains('has-block')) {
                    const blockTypes = ['grass', 'dirt', 'stone', 'diamond'];
                    const weights = [0.4, 0.3, 0.2, 0.1];
                    const newBlock = weightedRandom(blockTypes, weights);
                    
                    cell.classList.add('has-block', `block-${newBlock}`);
                    cell.dataset.blockType = newBlock;
                    cell.dataset.clicks = 0;
                    
                    gsap.from(cell, {
                        scale: 0,
                        duration: 0.3,
                        ease: 'back.out'
                    });
                }
            }, 500);
        }
    });
}

// Create Mini Particles
function createMiniParticles(cell, blockType) {
    const rect = cell.getBoundingClientRect();
    const color = miniBlockTypes[blockType].color;
    
    for (let i = 0; i < 4; i++) {
        const particle = document.createElement('div');
        particle.className = 'mini-particle';
        particle.style.cssText = `
            position: fixed;
            left: ${rect.left + rect.width / 2}px;
            top: ${rect.top + rect.height / 2}px;
            width: 6px;
            height: 6px;
            background-color: ${color};
            pointer-events: none;
            z-index: 1000;
            border-radius: 1px;
        `;
        document.body.appendChild(particle);
        
        // Animate particle
        gsap.to(particle, {
            x: (Math.random() - 0.5) * 60,
            y: (Math.random() - 0.5) * 60,
            opacity: 0,
            duration: 0.5,
            ease: 'power2.out',
            onComplete: () => particle.remove()
        });
    }
}

// Mini Game Controls
function setupMiniControls() {
    const startBtn = document.getElementById('miniStartBtn');
    const resetBtn = document.getElementById('miniResetBtn');
    
    if (!startBtn || !resetBtn) return;
    
    startBtn.addEventListener('click', () => {
        if (!miniGameState.isPlaying) {
            startMiniGame();
            startBtn.textContent = 'STOP MINING';
            startBtn.classList.remove('btn-primary');
            startBtn.classList.add('btn-alert');
        } else {
            stopMiniGame();
            startBtn.textContent = 'START MINING';
            startBtn.classList.remove('btn-alert');
            startBtn.classList.add('btn-primary');
        }
    });
    
    resetBtn.addEventListener('click', resetMiniGame);
}

// Start Mini Game
function startMiniGame() {
    miniGameState.isPlaying = true;
    miniGameState.score = 0;
    miniGameState.blocksDestroyed = 0;
    
    updateMiniStats();
    
    // Fill any empty cells
    const cells = document.querySelectorAll('.mini-game-cell');
    cells.forEach(cell => {
        if (!cell.classList.contains('has-block')) {
            const blockTypes = ['grass', 'dirt', 'stone', 'diamond'];
            const weights = [0.4, 0.3, 0.2, 0.1];
            const blockType = weightedRandom(blockTypes, weights);
            
            cell.classList.add('has-block', `block-${blockType}`);
            cell.dataset.blockType = blockType;
            cell.dataset.clicks = 0;
            
            gsap.from(cell, {
                scale: 0,
                duration: 0.3,
                delay: Math.random() * 0.3,
                ease: 'back.out'
            });
        }
    });
}

// Stop Mini Game
function stopMiniGame() {
    miniGameState.isPlaying = false;
}

// Reset Mini Game
function resetMiniGame() {
    stopMiniGame();
    miniGameState.score = 0;
    miniGameState.blocksDestroyed = 0;
    
    updateMiniStats();
    
    const startBtn = document.getElementById('miniStartBtn');
    if (startBtn) {
        startBtn.textContent = 'START MINING';
        startBtn.classList.remove('btn-alert');
        startBtn.classList.add('btn-primary');
    }
    
    createMiniGrid();
}

// Update Mini Stats
function updateMiniStats() {
    const scoreEl = document.getElementById('miniScore');
    const blocksEl = document.getElementById('miniBlocks');
    
    if (scoreEl) scoreEl.textContent = miniGameState.score;
    if (blocksEl) blocksEl.textContent = miniGameState.blocksDestroyed;
}

// Initialize on page load
if (document.getElementById('miniGameGrid')) {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initMiniGame, 500); // Delay to ensure other scripts load first
    });
}
