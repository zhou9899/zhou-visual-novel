// Main Application Controller
class VisualNovelApp {
  constructor() {
    this.initializeApp();
  }

  initializeApp() {
    console.log('Zhou Visual Novel - Initializing...');
    
    // Check if all required managers are loaded
    if (!window.UIManager || !window.StoryManager || !window.CharacterManager || !window.BackgroundManager) {
      console.error('Required modules not loaded!');
      this.showError('Failed to load game modules. Please refresh the page.');
      return;
    }
    
    // Initialize game state if not exists
    if (!window.gameState) {
      window.gameState = {
        player: null,
        scene: null,
        timestamp: null
      };
    }
    
    // Add custom styles for additional effects
    this.addCustomStyles();
    
    // Preload critical assets
    this.preloadAssets();
    
    console.log('Zhou Visual Novel - Ready!');
  }

  addCustomStyles() {
    const style = document.createElement('style');
    style.textContent = `
      /* Additional animations */
      @keyframes fadeOut {
        from { opacity: 1; transform: translateX(-50%) translateY(0); }
        to { opacity: 0; transform: translateX(-50%) translateY(-20px); }
      }
      
      /* Message toast */
      .message-toast {
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(74, 29, 150, 0.95);
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        border: 2px solid #9d4edd;
        z-index: 1000;
        animation: fadeIn 0.3s ease-out;
        backdrop-filter: blur(10px);
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
        font-weight: 500;
        max-width: 80%;
        text-align: center;
      }
      
      /* Stats display */
      .stats-display {
        position: fixed;
        top: 20px;
        left: 20px;
        background: rgba(0, 0, 0, 0.7);
        padding: 15px;
        border-radius: 10px;
        border: 2px solid #5a189a;
        z-index: 50;
        backdrop-filter: blur(5px);
      }
      
      .stat-item {
        display: flex;
        justify-content: space-between;
        margin: 5px 0;
        padding: 3px 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }
      
      .stat-name {
        color: #e0aaff;
      }
      
      .stat-value {
        color: #9d4edd;
        font-weight: bold;
      }
      
      /* Scene transition overlay */
      .scene-transition {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #000;
        z-index: 10000;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.5s ease;
      }
      
      .scene-transition.active {
        opacity: 1;
      }
      
      /* Loading spinner */
      .loading-spinner {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 50px;
        height: 50px;
        border: 5px solid rgba(157, 78, 221, 0.3);
        border-radius: 50%;
        border-top-color: #9d4edd;
        animation: spin 1s linear infinite;
        z-index: 10001;
      }
      
      @keyframes spin {
        0% { transform: translate(-50%, -50%) rotate(0deg); }
        100% { transform: translate(-50%, -50%) rotate(360deg); }
      }
      
      /* Achievement popup */
      .achievement-popup {
        position: fixed;
        top: 80px;
        right: 20px;
        background: linear-gradient(135deg, #5a189a, #7b2cbf);
        padding: 15px;
        border-radius: 10px;
        border: 2px solid #9d4edd;
        z-index: 1000;
        animation: slideIn 0.5s ease-out;
        transform: translateX(120%);
        transition: transform 0.5s ease;
        max-width: 300px;
      }
      
      .achievement-popup.show {
        transform: translateX(0);
      }
      
      @keyframes slideIn {
        from { transform: translateX(120%); }
        to { transform: translateX(0); }
      }
    `;
    document.head.appendChild(style);
  }

  preloadAssets() {
    // Preload critical images
    const imagesToPreload = [
      'https://files.catbox.moe/kc600j.png',
      'https://files.catbox.moe/b4syzg.png'
    ];
    
    imagesToPreload.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }

  showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(230, 57, 70, 0.95);
      color: white;
      padding: 30px;
      border-radius: 15px;
      border: 3px solid #ff6b6b;
      z-index: 10000;
      text-align: center;
      max-width: 80%;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    `;
    errorDiv.innerHTML = `
      <h3 style="margin-bottom: 15px; color: #ffccd5;">
        <i class="fas fa-exclamation-triangle"></i> Error
      </h3>
      <p style="margin-bottom: 20px;">${message}</p>
      <button onclick="location.reload()" style="
        background: white;
        color: #e63946;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
        font-weight: bold;
      ">
        <i class="fas fa-redo"></i> Reload Page
      </button>
    `;
    document.body.appendChild(errorDiv);
  }

  showStats() {
    if (!window.gameState || !window.gameState.player) return;
    
    const stats = gameState.player.stats;
    const statsDiv = document.createElement('div');
    statsDiv.className = 'stats-display';
    statsDiv.innerHTML = `
      <div style="color: #c77dff; margin-bottom: 10px; font-weight: bold;">
        <i class="fas fa-chart-bar"></i> Stats
      </div>
      <div class="stat-item">
        <span class="stat-name">Magic:</span>
        <span class="stat-value">${stats.magic}</span>
      </div>
      <div class="stat-item">
        <span class="stat-name">Strength:</span>
        <span class="stat-value">${stats.strength}</span>
      </div>
      <div class="stat-item">
        <span class="stat-name">Scene:</span>
        <span class="stat-value">${gameState.scene || 'Unknown'}</span>
      </div>
    `;
    
    // Remove existing stats display
    const existingStats = document.querySelector('.stats-display');
    if (existingStats) existingStats.remove();
    
    document.body.appendChild(statsDiv);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (statsDiv.parentNode) {
        statsDiv.style.opacity = '0';
        statsDiv.style.transition = 'opacity 0.5s ease';
        setTimeout(() => {
          if (statsDiv.parentNode) statsDiv.remove();
        }, 500);
      }
    }, 5000);
  }

  showAchievement(title, description) {
    const achievement = document.createElement('div');
    achievement.className = 'achievement-popup';
    achievement.innerHTML = `
      <div style="color: #ffcc00; font-size: 1.2em; margin-bottom: 5px;">
        <i class="fas fa-trophy"></i> ${title}
      </div>
      <div style="color: #e0aaff; font-size: 0.9em;">
        ${description}
      </div>
    `;
    
    document.body.appendChild(achievement);
    
    // Animate in
    setTimeout(() => achievement.classList.add('show'), 100);
    
    // Remove after 4 seconds
    setTimeout(() => {
      achievement.classList.remove('show');
      setTimeout(() => {
        if (achievement.parentNode) achievement.remove();
      }, 500);
    }, 4000);
  }

  transitionScene(sceneId, callback) {
    const transition = document.createElement('div');
    transition.className = 'scene-transition';
    document.body.appendChild(transition);
    
    // Fade in
    setTimeout(() => {
      transition.classList.add('active');
    }, 10);
    
    // Execute scene change
    setTimeout(() => {
      if (callback) callback();
      
      // Fade out
      setTimeout(() => {
        transition.classList.remove('active');
        setTimeout(() => {
          if (transition.parentNode) transition.remove();
        }, 500);
      }, 300);
    }, 500);
  }
}

// Global helper functions
window.showStats = () => {
  if (window.vnApp) window.vnApp.showStats();
};

window.showAchievement = (title, description) => {
  if (window.vnApp) window.vnApp.showAchievement(title, description);
};

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.vnApp = new VisualNovelApp();
  
  // Add a welcome achievement on first load
  const firstLoad = !localStorage.getItem('vn_first_load');
  if (firstLoad) {
    localStorage.setItem('vn_first_load', 'true');
    setTimeout(() => {
      if (window.vnApp) {
        window.vnApp.showAchievement('First Journey', 'Welcome to Zhou Visual Novel!');
      }
    }, 2000);
  }
});

// Export for debugging
console.log('App initialized - Use showStats() to display current stats');
