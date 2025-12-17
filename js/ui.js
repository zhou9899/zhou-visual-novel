// UI Manager
const UIManager = {
  // DOM Elements
  elements: {
    welcomeScreen: document.getElementById('welcome-screen'),
    gameScreen: document.getElementById('game-screen'),
    playerNameInput: document.getElementById('player-name-input'),
    startBtn: document.getElementById('start-btn'),
    loadBtn: document.getElementById('load-btn'),
    settingsBtn: document.getElementById('settings-btn'),
    saveGameBtn: document.getElementById('save-game'),
    loadGameBtn: document.getElementById('load-game'),
    settingsGameBtn: document.getElementById('settings-game'),
    skipBtn: document.getElementById('skip-btn'),
    autoBtn: document.getElementById('auto-btn'),
    backBtn: document.getElementById('back-btn'),
    dialogueBox: document.getElementById('dialogue-box'),
    dialogueText: document.getElementById('dialogue-text'),
    speakerName: document.getElementById('speaker-name'),
    choicesContainer: document.getElementById('choices-container'),
    continueIndicator: document.getElementById('dialogue-continue'),
    characterName: document.getElementById('character-name'),
    settingsModal: document.getElementById('settings-modal'),
    saveModal: document.getElementById('save-modal'),
    closeSettings: document.getElementById('close-settings'),
    closeSaves: document.getElementById('close-saves'),
    saveSettings: document.getElementById('save-settings'),
    musicVolume: document.getElementById('music-volume'),
    sfxVolume: document.getElementById('sfx-volume'),
    textSpeed: document.getElementById('text-speed'),
    saveSlots: document.getElementById('save-slots'),
    genderButtons: document.querySelectorAll('.gender-btn')
  },

  // Game State
  isTyping: false,
  currentText: '',
  typingSpeed: 20, // milliseconds per character
  autoPlay: false,
  skipMode: false,

  // Initialize UI
  initialize() {
    this.bindEvents();
    this.loadSettings();
    this.updateVolumeDisplays();
  },

  // Bind event listeners
  bindEvents() {
    // Welcome screen events
    this.elements.startBtn.addEventListener('click', () => this.startGame());
    this.elements.loadBtn.addEventListener('click', () => this.showLoadModal());
    this.elements.settingsBtn.addEventListener('click', () => this.showSettingsModal());
    
    // Gender selection
    this.elements.genderButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.elements.genderButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
    
    // Game control events
    this.elements.saveGameBtn.addEventListener('click', () => this.showSaveModal());
    this.elements.loadGameBtn.addEventListener('click', () => this.showLoadModal());
    this.elements.settingsGameBtn.addEventListener('click', () => this.showSettingsModal());
    this.elements.skipBtn.addEventListener('click', () => this.toggleSkip());
    this.elements.autoBtn.addEventListener('click', () => this.toggleAutoPlay());
    this.elements.backBtn.addEventListener('click', () => this.returnToMenu());
    
    // Modal events
    this.elements.closeSettings.addEventListener('click', () => this.hideSettingsModal());
    this.elements.closeSaves.addEventListener('click', () => this.hideSaveModal());
    this.elements.saveSettings.addEventListener('click', () => this.saveSettings());
    
    // Continue dialogue on click
    this.elements.dialogueBox.addEventListener('click', () => {
      if (this.isTyping) {
        this.completeText();
      } else if (this.elements.continueIndicator.style.display !== 'none') {
        this.continueDialogue();
      }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (!this.elements.gameScreen.classList.contains('active')) return;
      
      switch(e.key) {
        case ' ':
        case 'Enter':
          e.preventDefault();
          if (this.isTyping) {
            this.completeText();
          } else {
            this.continueDialogue();
          }
          break;
        case 's':
          if (e.ctrlKey) this.showSaveModal();
          break;
        case 'l':
          if (e.ctrlKey) this.showLoadModal();
          break;
        case 'Escape':
          this.returnToMenu();
          break;
      }
    });
  },

  // Start game
  startGame() {
    const playerName = this.elements.playerNameInput.value.trim() || 'Adventurer';
    const gender = document.querySelector('.gender-btn.active').dataset.gender;
    
    // Initialize player
    window.gameState = {
      player: {
        name: playerName,
        gender: gender,
        stats: {
          magic: 1,
          strength: 1
        }
      },
      scene: 'forest',
      timestamp: Date.now()
    };
    
    // Initialize managers
    CharacterManager.setGender(gender);
    CharacterManager.setName(playerName);
    StoryManager.initialize(gameState.player);
    
    // Switch to game screen
    this.elements.welcomeScreen.classList.remove('active');
    this.elements.gameScreen.classList.add('active');
    
    // Start the game
    this.showScene('forest');
    
    // Play background music
    this.playMusic('main');
  },

  // Show scene
  showScene(sceneId) {
    const scene = StoryManager.goToScene(sceneId);
    if (!scene) return;
    
    // Update background
    const particleCount = BackgroundManager.loadBackground(scene.background);
    BackgroundManager.createParticles(particleCount, backgrounds[scene.background].color);
    
    // Update character
    CharacterManager.setSprite(scene.sprite);
    CharacterManager.react('glow');
    
    // Update dialogue
    this.elements.speakerName.textContent = scene.speaker;
    this.typeText(StoryManager.formatText(scene.text));
    
    // Update choices
    this.updateChoices(scene.choices);
    
    // Hide continue indicator until text is done
    this.elements.continueIndicator.style.display = 'none';
  },

  // Type text with animation
  typeText(text) {
    this.isTyping = true;
    this.currentText = text;
    this.elements.dialogueText.textContent = '';
    
    let i = 0;
    const typeChar = () => {
      if (i < text.length && !this.skipMode) {
        this.elements.dialogueText.textContent += text.charAt(i);
        i++;
        
        // Play typing sound every few characters
        if (i % 3 === 0) {
          this.playSound('click');
        }
        
        setTimeout(typeChar, this.typingSpeed);
      } else {
        this.completeText();
      }
    };
    
    typeChar();
  },

  // Complete typing immediately
  completeText() {
    this.isTyping = false;
    this.elements.dialogueText.textContent = this.currentText;
    this.elements.continueIndicator.style.display = 'block';
    
    if (this.autoPlay) {
      setTimeout(() => this.continueDialogue(), 2000);
    }
  },

  // Continue to next or show choices
  continueDialogue() {
    const scene = StoryManager.getCurrentScene();
    
    if (scene.choices.length === 1 && !scene.choices[0].statCheck) {
      // Auto-advance if only one choice with no stat check
      this.makeChoice(0);
    }
    // If there are multiple choices, they're already displayed
  },

  // Update choices display
  updateChoices(choices) {
    this.elements.choicesContainer.innerHTML = '';
    
    choices.forEach((choice, index) => {
      const button = document.createElement('button');
      button.className = 'choice-btn';
      button.textContent = choice.text;
      
      // Check stat requirements
      if (choice.statCheck && !StoryManager.checkStatRequirement(choice)) {
        button.disabled = true;
        button.style.opacity = '0.5';
        button.title = `Requires ${choice.statCheck.type || choice.statCheck} ${choice.statCheck.min ? `(${choice.statCheck.min}+)` : ''}`;
      }
      
      button.addEventListener('click', () => this.makeChoice(index));
      this.elements.choicesContainer.appendChild(button);
    });
    
    // Show continue indicator if no choices (shouldn't happen but just in case)
    if (choices.length === 0) {
      this.elements.continueIndicator.style.display = 'block';
    }
  },

  // Make a choice
  makeChoice(choiceIndex) {
    const scene = StoryManager.getCurrentScene();
    const choice = scene.choices[choiceIndex];
    
    if (choice.statCheck && !StoryManager.checkStatRequirement(choice)) {
      this.playSound('error');
      this.showMessage("You don't meet the requirements for this choice!");
      return;
    }
    
    this.playSound('click');
    this.showScene(choice.next);
  },

  // Show message (toast notification)
  showMessage(text, duration = 3000) {
    const message = document.createElement('div');
    message.className = 'message-toast';
    message.textContent = text;
    message.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(74, 29, 150, 0.9);
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      border: 2px solid #9d4edd;
      z-index: 1000;
      animation: fadeIn 0.3s ease-out;
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
      message.style.animation = 'fadeOut 0.3s ease-out';
      setTimeout(() => message.remove(), 300);
    }, duration);
  },

  // Modal controls
  showSettingsModal() {
    this.elements.settingsModal.classList.add('active');
    this.playSound('click');
  },

  hideSettingsModal() {
    this.elements.settingsModal.classList.remove('active');
    this.playSound('click');
  },

  showSaveModal() {
    this.elements.saveModal.classList.add('active');
    this.updateSaveSlots();
    this.playSound('click');
  },

  hideSaveModal() {
    this.elements.saveModal.classList.remove('active');
    this.playSound('click');
  },

  showLoadModal() {
    this.showSaveModal(); // Reuse save modal for loading
  },

  // Settings management
  loadSettings() {
    const settings = JSON.parse(localStorage.getItem('vn_settings') || '{}');
    this.elements.musicVolume.value = settings.musicVolume || 70;
    this.elements.sfxVolume.value = settings.sfxVolume || 80;
    this.elements.textSpeed.value = settings.textSpeed || 20;
    this.typingSpeed = 100 - (settings.textSpeed || 20);
  },

  saveSettings() {
    const settings = {
      musicVolume: this.elements.musicVolume.value,
      sfxVolume: this.elements.sfxVolume.value,
      textSpeed: this.elements.textSpeed.value
    };
    
    localStorage.setItem('vn_settings', JSON.stringify(settings));
    this.typingSpeed = 100 - settings.textSpeed;
    this.updateVolumeDisplays();
    this.hideSettingsModal();
    this.showMessage('Settings saved!');
  },

  updateVolumeDisplays() {
    const bgMusic = document.getElementById('bg-music');
    const uiSfx = document.getElementById('ui-sfx');
    
    if (bgMusic) bgMusic.volume = this.elements.musicVolume.value / 100;
    if (uiSfx) uiSfx.volume = this.elements.sfxVolume.value / 100;
  },

  // Save slots
  updateSaveSlots() {
    this.elements.saveSlots.innerHTML = '';
    
    for (let i = 1; i <= 6; i++) {
      const save = JSON.parse(localStorage.getItem(`vn_save_${i}`) || 'null');
      const slot = document.createElement('div');
      slot.className = 'save-slot';
      if (save) slot.classList.add('active');
      
      slot.innerHTML = `
        <div class="save-title">Slot ${i}</div>
        <div class="save-info">
          ${save ? `${save.player.name} - ${save.scene}` : 'Empty'}
        </div>
      `;
      
      slot.addEventListener('click', () => this.handleSaveSlot(i, save));
      this.elements.saveSlots.appendChild(slot);
    }
  },

  handleSaveSlot(slotNumber, existingSave) {
    if (existingSave && this.elements.saveModal.classList.contains('active')) {
      // Loading
      this.loadGame(slotNumber);
    } else {
      // Saving
      this.saveGame(slotNumber);
    }
  },

  saveGame(slotNumber) {
    if (!window.gameState) return;
    
    gameState.timestamp = Date.now();
    localStorage.setItem(`vn_save_${slotNumber}`, JSON.stringify(gameState));
    this.updateSaveSlots();
    this.showMessage(`Game saved to slot ${slotNumber}!`);
  },

  loadGame(slotNumber) {
    const saveData = JSON.parse(localStorage.getItem(`vn_save_${slotNumber}`));
    if (!saveData) return;
    
    window.gameState = saveData;
    
    // Initialize with loaded data
    CharacterManager.setGender(saveData.player.gender);
    CharacterManager.setName(saveData.player.name);
    StoryManager.initialize(saveData.player);
    
    this.hideSaveModal();
    this.showScene(saveData.scene);
    this.showMessage(`Game loaded from slot ${slotNumber}!`);
  },

  // Game mode toggles
  toggleSkip() {
    this.skipMode = !this.skipMode;
    this.elements.skipBtn.style.background = this.skipMode ? '#e63946' : '';
    this.playSound('click');
  },

  toggleAutoPlay() {
    this.autoPlay = !this.autoPlay;
    this.elements.autoBtn.style.background = this.autoPlay ? '#2a9d8f' : '';
    this.playSound('click');
    
    if (this.autoPlay && !this.isTyping) {
      this.continueDialogue();
    }
  },

  // Audio controls
  playMusic(track) {
    const music = document.getElementById('bg-music');
    // In a real implementation, you would set different music files
    music.volume = this.elements.musicVolume.value / 100;
    music.play().catch(e => console.log('Music autoplay prevented:', e));
  },

  playSound(sound) {
    const sfx = document.getElementById('ui-sfx');
    // In a real implementation, you would set different sound files
    sfx.volume = this.elements.sfxVolume.value / 100;
    sfx.currentTime = 0;
    sfx.play().catch(e => console.log('SFX play error:', e));
  },

  // Return to main menu
  returnToMenu() {
    if (confirm('Return to main menu? Unsaved progress will be lost.')) {
      this.elements.gameScreen.classList.remove('active');
      this.elements.welcomeScreen.classList.add('active');
      this.playSound('click');
    }
  }
};

// Initialize UI when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  UIManager.initialize();
});

// Export for use in other modules
window.UIManager = UIManager;
