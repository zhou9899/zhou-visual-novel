// Background Images
const backgrounds = {
  forest: {
    url: "https://images2.alphacoders.com/680/680395.jpg",
    particles: 30,
    color: "#2d6a4f",
    music: "forest"
  },
  castle: {
    url: "https://images8.alphacoders.com/130/1304871.jpg",
    particles: 25,
    color: "#5a189a",
    music: "castle"
  },
  mountain: {
    url: "https://images3.alphacoders.com/103/1031584.jpg",
    particles: 40,
    color: "#6c757d",
    music: "mountain"
  },
  magic_ruins: {
    url: "https://images4.alphacoders.com/845/845906.jpg",
    particles: 50,
    color: "#9d4edd",
    music: "magic"
  },
  study_room: {
    url: "https://images5.alphacoders.com/878/878056.jpg",
    particles: 20,
    color: "#3a0ca3",
    music: "study"
  },
  world_map: {
    url: "https://images7.alphacoders.com/699/699458.jpg",
    particles: 35,
    color: "#1a759f",
    music: "world"
  },
  battle_arena: {
    url: "https://images4.alphacoders.com/130/1305189.jpg",
    particles: 45,
    color: "#e63946",
    music: "battle"
  },
  sky_night: {
    url: "https://getwallpapers.com/wallpaper/full/c/7/d/1119268-beautiful-fantasy-nature-wallpapers-2560x1600-for-windows-10.jpg",
    particles: 60,
    color: "#3c096c",
    music: "sky"
  }
};

// Background manager
const BackgroundManager = {
  currentBg: null,
  
  loadBackground(sceneId) {
    const bg = backgrounds[sceneId] || backgrounds.forest;
    this.currentBg = bg;
    
    const backLayer = document.getElementById('bg-layer-back');
    const midLayer = document.getElementById('bg-layer-mid');
    const frontLayer = document.getElementById('bg-layer-front');
    
    // Set background image
    backLayer.style.backgroundImage = `url('${bg.url}')`;
    
    // Apply parallax effect
    backLayer.classList.add('sway-slow');
    midLayer.classList.add('sway-medium');
    frontLayer.classList.add('sway-fast');
    
    // Change ambient color
    document.documentElement.style.setProperty('--ambient-color', bg.color);
    
    return bg.particles;
  },
  
  createParticles(count, color) {
    const container = document.getElementById('ambient-effects');
    container.innerHTML = '';
    
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'ambient-particle';
      
      // Random position
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      
      // Random size
      const size = 5 + Math.random() * 15;
      
      // Random color variations
      const r = parseInt(color.slice(1, 3), 16) + Math.floor(Math.random() * 60 - 30);
      const g = parseInt(color.slice(3, 5), 16) + Math.floor(Math.random() * 60 - 30);
      const b = parseInt(color.slice(5, 7), 16) + Math.floor(Math.random() * 60 - 30);
      
      // Set styles
      particle.style.left = `${left}vw`;
      particle.style.top = `${top}vh`;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.background = `radial-gradient(circle, rgb(${r}, ${g}, ${b}), transparent)`;
      particle.style.animation = `floatEffect ${3 + Math.random() * 4}s linear infinite`;
      particle.style.animationDelay = `${Math.random() * 2}s`;
      
      container.appendChild(particle);
    }
  },
  
  createMagicIcons(count = 5) {
    const container = document.getElementById('background');
    
    for (let i = 0; i < count; i++) {
      const icon = document.createElement('div');
      icon.className = 'magic-icon';
      
      // Random position
      icon.style.left = `${Math.random() * 90 + 5}vw`;
      icon.style.top = `${Math.random() * 70 + 10}vh`;
      
      // Random size
      const size = 20 + Math.random() * 30;
      icon.style.width = `${size}px`;
      icon.style.height = `${size}px`;
      
      // Random animation duration
      const duration = 5 + Math.random() * 8;
      icon.style.animation = `floatMagic ${duration}s linear infinite`;
      icon.style.opacity = 0.5 + Math.random() * 0.5;
      
      // Random color filter
      const hue = Math.random() * 360;
      icon.style.filter = `hue-rotate(${hue}deg)`;
      
      container.appendChild(icon);
      
      // Remove after animation completes
      setTimeout(() => {
        if (icon.parentNode) {
          icon.remove();
        }
      }, duration * 1000);
    }
  }
};

// Start magic icon interval
setInterval(() => {
  if (document.getElementById('game-screen').classList.contains('active')) {
    BackgroundManager.createMagicIcons(2 + Math.floor(Math.random() * 3));
  }
}, 4000);

// Export for use in other modules
window.BackgroundManager = BackgroundManager;
