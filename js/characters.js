// Character Sprites
const characters = {
  male: {
    happy: "https://files.catbox.moe/kc600j.png",
    sad: "https://files.catbox.moe/taaxhj.png",
    angry: "https://files.catbox.moe/lnk8a4.png",
    surprised: "https://files.catbox.moe/kc600j.png", // Using happy as fallback
    neutral: "https://files.catbox.moe/kc600j.png",
    magic: "https://files.catbox.moe/kc600j.png"
  },
  female: {
    happy: "https://files.catbox.moe/b4syzg.png",
    sad: "https://files.catbox.moe/h1xv4q.png",
    angry: "https://files.catbox.moe/riubye.png",
    surprised: "https://files.catbox.moe/b4syzg.png", // Using happy as fallback
    neutral: "https://files.catbox.moe/b4syzg.png",
    magic: "https://files.catbox.moe/b4syzg.png"
  }
};

// Character Manager
const CharacterManager = {
  currentEmotion: 'neutral',
  currentGender: 'male',
  
  setGender(gender) {
    this.currentGender = gender;
  },
  
  setSprite(emotion) {
    this.currentEmotion = emotion;
    const characterImg = document.getElementById('character');
    const genderSprites = characters[this.currentGender];
    
    if (genderSprites && genderSprites[emotion]) {
      characterImg.src = genderSprites[emotion];
      characterImg.classList.add('fade-in');
      
      // Remove fade-in class after animation
      setTimeout(() => {
        characterImg.classList.remove('fade-in');
      }, 300);
    }
  },
  
  show() {
    const characterImg = document.getElementById('character');
    characterImg.style.opacity = '1';
  },
  
  hide() {
    const characterImg = document.getElementById('character');
    characterImg.style.opacity = '0';
  },
  
  react(type = 'glow') {
    const characterImg = document.getElementById('character');
    
    // Remove previous reactions
    characterImg.classList.remove('reaction-bounce', 'glow-effect', 'shake-effect');
    
    switch(type) {
      case 'bounce':
        characterImg.classList.add('reaction-bounce');
        break;
      case 'glow':
        characterImg.classList.add('glow-effect');
        break;
      case 'shake':
        characterImg.classList.add('shake-effect');
        break;
    }
    
    // Remove after animation
    setTimeout(() => {
      characterImg.classList.remove('reaction-bounce', 'glow-effect', 'shake-effect');
    }, 1200);
  },
  
  setName(name) {
    const nameTag = document.getElementById('character-name');
    if (name && name.trim() !== '') {
      nameTag.textContent = name;
      nameTag.style.display = 'block';
    } else {
      nameTag.style.display = 'none';
    }
  }
};

// Add CSS for new effects
const style = document.createElement('style');
style.textContent = `
  .glow-effect {
    animation: glowEffect 1s alternate infinite;
    filter: drop-shadow(0 0 10px rgba(157, 78, 221, 0.5));
  }
  
  .shake-effect {
    animation: shake 0.5s ease-in-out;
  }
  
  @keyframes shake {
    0%, 100% { transform: translateX(-50%) translateY(0); }
    25% { transform: translateX(-50%) translateY(-5px); }
    75% { transform: translateX(-50%) translateY(5px); }
  }
  
  .fade-in {
    animation: fadeIn 0.3s ease-out;
  }
`;
document.head.appendChild(style);

// Export for use in other modules
window.CharacterManager = CharacterManager;
