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

  // Audio elements
  audio: {
    bgMusic: document.getElementById('bg-music'),
    ambientSfx: document.getElementById('ambient-sfx'),
    uiSfx: document.getElementById('ui-sfx'),
    audioContext: null,
    unlocked: false
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
    this.setupAudio();
  },

  // Setup audio system
  setupAudio() {
    // Create a user gesture unlock for audio
    const unlockAudio = () => {
      if (this.audio.unlocked) return;
      
      // Create and play a silent sound to unlock audio
      const buffer = this.audio.audioContext.createBuffer(1, 1, 22050);
      const source = this.audio.audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(this.audio.audioContext.destination);
      source.start(0);
      
      this.audio.unlocked = true;
      
      // Remove event listeners
      document.removeEventListener('click', unlockAudio);
      document.removeEventListener('touchstart', unlockAudio);
    };

    // Initialize AudioContext
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audio.audioContext = new AudioContext();
      
      // Add event listeners for first user interaction
      document.addEventListener('click', unlockAudio);
      document.addEventListener('touchstart', unlockAudio);
    } catch (e) {
      console.log('Web Audio API not supported:', e);
    }

    // Set up volume controls
    this.elements.musicVolume.addEventListener('input', () => {
      this.audio.bgMusic.volume = this.elements.musicVolume.value / 100;
    });

    this.elements.sfxVolume.addEventListener('input', () => {
      this.audio.uiSfx.volume = this.elements.sfxVolume.value / 100;
      this.audio.ambientSfx.volume = this.elements.sfxVolume.value / 100;
    });
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
        this.playSound('click');
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

    // Enable audio on first user interaction
    document.addEventListener('click', () => {
      this.audio.bgMusic.play().catch(e => {
        console.log('Audio play failed, will retry on game start:', e);
      });
    }, { once: true });
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
    
    // Start background music
    this.playMusic('assets/audio/music/main-theme.mp3').catch(e => {
      console.log('Could not play music:', e);
      // Fallback to silent audio to keep timing
    });
    
    // Start the game
    this.showScene('forest');
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
    
    // Play ambient sound for scene
    this.playAmbient(scene.background);
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
    this.playSound('complete');
    
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
    
    // Apply loaded volumes
    this.audio.bgMusic.volume = this.elements.musicVolume.value / 100;
    this.audio.uiSfx.volume = this.elements.sfxVolume.value / 100;
    this.audio.ambientSfx.volume = this.elements.sfxVolume.value / 100;
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
    // Already handled in loadSettings
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
    this.playSound('save');
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
    this.playSound('load');
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
  async playMusic(src) {
    try {
      if (this.audio.bgMusic.src !== src) {
        this.audio.bgMusic.src = src;
      }
      
      if (this.audio.audioContext && this.audio.audioContext.state === 'suspended') {
        await this.audio.audioContext.resume();
      }
      
      await this.audio.bgMusic.play();
      this.audio.bgMusic.volume = this.elements.musicVolume.value / 100;
      this.audio.bgMusic.loop = true;
    } catch (error) {
      console.log('Music playback failed:', error);
      // Don't throw, just log
    }
  },

  async playAmbient(sceneType) {
    const ambientMap = {
      forest: 'assets/audio/sfx/forest.mp3',
      castle: 'assets/audio/sfx/castle.mp3',
      study_room: 'assets/audio/sfx/study.mp3',
      world_map: 'assets/audio/sfx/world.mp3',
      mountain: 'assets/audio/sfx/mountain.mp3',
      magic_ruins: 'assets/audio/sfx/magic.mp3',
      battle_arena: 'assets/audio/sfx/battle.mp3',
      sky_night: 'assets/audio/sfx/sky.mp3'
    };
    
    const src = ambientMap[sceneType] || ambientMap.forest;
    
    try {
      if (this.audio.ambientSfx.src !== src) {
        this.audio.ambientSfx.src = src;
      }
      
      if (this.audio.audioContext && this.audio.audioContext.state === 'suspended') {
        await this.audio.audioContext.resume();
      }
      
      await this.audio.ambientSfx.play();
      this.audio.ambientSfx.volume = this.elements.sfxVolume.value / 100 * 0.3; // 30% of SFX volume
      this.audio.ambientSfx.loop = true;
    } catch (error) {
      console.log('Ambient playback failed:', error);
      // Don't throw, just log
    }
  },

  async playSound(type) {
    // For now, use a simple beep for SFX since we don't have sound files
    try {
      if (this.audio.audioContext && this.audio.audioContext.state === 'suspended') {
        await this.audio.audioContext.resume();
      }
      
      // Create a simple oscillator for sound effects
      if (this.audio.audioContext && this.audio.unlocked) {
        const oscillator = this.audio.audioContext.createOscillator();
        const gainNode = this.audio.audioContext.createGain();
        
        // Different frequencies for different sounds
        let frequency = 800;
        let duration = 0.1;
        
        switch(type) {
          case 'click':
            frequency = 600;
            duration = 0.05;
            break;
          case 'complete':
            frequency = 1000;
            duration = 0.15;
            break;
          case 'error':
            frequency = 300;
            duration = 0.2;
            break;
          case 'save':
            frequency = 1200;
            duration = 0.3;
            break;
          case 'load':
            frequency = 800;
            duration = 0.3;
            break;
        }
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audio.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(frequency, this.audio.audioContext.currentTime);
        gainNode.gain.setValueAtTime(this.elements.sfxVolume.value / 100, this.audio.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audio.audioContext.currentTime + duration);
        
        oscillator.start(this.audio.audioContext.currentTime);
        oscillator.stop(this.audio.audioContext.currentTime + duration);
      }
    } catch (error) {
      console.log('SFX playback failed:', error);
    }
  },

  // Return to main menu
  returnToMenu() {
    if (confirm('Return to main menu? Unsaved progress will be lost.')) {
      this.elements.gameScreen.classList.remove('active');
      this.elements.welcomeScreen.classList.add('active');
      this.audio.bgMusic.pause();
      this.audio.ambientSfx.pause();
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
