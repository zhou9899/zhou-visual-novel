// Main Application Controller
class VisualNovelApp {
  constructor() {
    this.initializeApp();
  }

  initializeApp() {
    console.log('Zhou Visual Novel - Initializing...');
    
    // Add custom styles for additional effects
    this.addCustomStyles();
    
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
    `;
    document.head.appendChild(style);
  }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.vnApp = new VisualNovelApp();
});
