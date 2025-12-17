// Story Data
const story = {
  forest: {
    speaker: "Narrator",
    text: "Welcome to the enchanted forest, {player}! The air is filled with magical energy and the sound of ancient spirits whispering through the trees.",
    sprite: "happy",
    background: "forest",
    choices: [
      { text: "Explore deeper into the forest", next: "forest_deep", statCheck: null },
      { text: "Head towards the distant castle", next: "castle", statCheck: null },
      { text: "Check your magical abilities", next: "magic_check", statCheck: "magic" }
    ],
    onEnter: function(player) {
      player.stats.magic += 1;
      return "You feel the forest's magic enhancing your abilities! (+1 Magic)";
    }
  },
  
  forest_deep: {
    speaker: "Ancient Tree",
    text: "Deep in the forest, you encounter a sentient ancient tree. 'Traveler, I sense great potential within you. Will you accept my blessing?'",
    sprite: "neutral",
    background: "forest",
    choices: [
      { text: "Accept the tree's blessing", next: "tree_blessing", statCheck: null },
      { text: "Politely decline and continue", next: "castle", statCheck: null },
      { text: "Ask about the castle", next: "castle_info", statCheck: null }
    ]
  },
  
  tree_blessing: {
    speaker: "Ancient Tree",
    text: "The tree places a glowing leaf on your forehead. You feel ancient knowledge flowing through you!",
    sprite: "happy",
    background: "forest",
    choices: [
      { text: "Continue to the castle", next: "castle", statCheck: null }
    ],
    onEnter: function(player) {
      player.stats.magic += 3;
      player.stats.strength += 1;
      return "Ancient knowledge fills your mind! (+3 Magic, +1 Strength)";
    }
  },
  
  castle: {
    speaker: "Castle Guard",
    text: "You arrive at the magnificent Castle Zhou. The guards eye you curiously. 'State your business, traveler.'",
    sprite: "neutral",
    background: "castle",
    choices: [
      { text: "I seek knowledge of magic", next: "study_room", statCheck: null },
      { text: "I'm looking for adventure", next: "castle_quest", statCheck: "strength" },
      { text: "Just passing through", next: "world_map", statCheck: null }
    ]
  },
  
  castle_quest: {
    speaker: "Castle Captain",
    text: "The castle captain sizes you up. 'We need someone to clear the mountain pass of bandits. Can you handle it?'",
    sprite: "angry",
    background: "castle",
    choices: [
      { text: "I can handle it! (Strength 5+ required)", next: "mountain_bandits", statCheck: { type: "strength", min: 5 } },
      { text: "Maybe I should train first", next: "training_grounds", statCheck: null },
      { text: "That's not my style", next: "study_room", statCheck: null }
    ]
  },
  
  study_room: {
    speaker: "Archmage Li",
    text: "In the castle's study room, Archmage Li welcomes you. 'I sense magical potential. Would you like to learn the arcane arts?'",
    sprite: "happy",
    background: "study_room",
    choices: [
      { text: "Study basic spells", next: "spell_learning", statCheck: null },
      { text: "Learn about magical history", next: "magic_history", statCheck: null },
      { text: "Ask about the world map", next: "world_map_info", statCheck: null }
    ],
    onEnter: function(player) {
      player.stats.magic += 2;
      return "You absorb magical knowledge from ancient tomes! (+2 Magic)";
    }
  },
  
  spell_learning: {
    speaker: "Archmage Li",
    text: "You spend hours studying magical theory and practicing basic spells. The magic comes naturally to you!",
    sprite: "happy",
    background: "study_room",
    choices: [
      { text: "Continue to the world map", next: "world_map", statCheck: null },
      { text: "Ask about magical ruins", next: "magic_ruins_info", statCheck: null }
    ],
    onEnter: function(player) {
      player.stats.magic += 4;
      return "You master several basic spells! (+4 Magic)";
    }
  },
  
  world_map: {
    speaker: "Cartographer",
    text: "The world map reveals many locations of interest. 'Where shall your journey take you next, {player}?'",
    sprite: "neutral",
    background: "world_map",
    choices: [
      { text: "Journey to the mountains", next: "mountain", statCheck: null },
      { text: "Seek the magical ruins", next: "magic_ruins", statCheck: { type: "magic", min: 5 } },
      { text: "Return to the castle", next: "castle", statCheck: null },
      { text: "Wait for nightfall", next: "sky_night", statCheck: null }
    ]
  },
  
  mountain: {
    speaker: "Mountain Guide",
    text: "The air grows thin as you climb higher. A guide warns: 'The path ahead is dangerous, but great treasures await.'",
    sprite: "sad",
    background: "mountain",
    choices: [
      { text: "Face the dangers head-on", next: "mountain_challenge", statCheck: "strength" },
      { text: "Use magic to navigate safely", next: "mountain_magic", statCheck: "magic" },
      { text: "Look for another route", next: "magic_ruins", statCheck: null }
    ]
  },
  
  magic_ruins: {
    speaker: "Ancient Spirit",
    text: "You stand before ancient magical ruins. A spectral voice echoes: 'Only those with pure magical essence may enter.'",
    sprite: "surprised",
    background: "magic_ruins",
    choices: [
      { text: "Channel your magic to enter", next: "ruins_inside", statCheck: { type: "magic", min: 8 } },
      { text: "Search for another entrance", next: "ruins_secret", statCheck: null },
      { text: "Leave and head to battle arena", next: "battle_arena", statCheck: null }
    ]
  },
  
  ruins_inside: {
    speaker: "Ancient Spirit",
    text: "The ruins accept you! Ancient knowledge floods your mind. You discover powerful artifacts and forgotten spells.",
    sprite: "happy",
    background: "magic_ruins",
    choices: [
      { text: "Continue to the battle arena", next: "battle_arena", statCheck: null },
      { text: "Test your new powers", next: "power_test", statCheck: null }
    ],
    onEnter: function(player) {
      player.stats.magic += 5;
      player.stats.strength += 2;
      return "Ancient power courses through you! (+5 Magic, +2 Strength)";
    }
  },
  
  battle_arena: {
    speaker: "Arena Master",
    text: "The crowd roars as you enter the battle arena! 'Fighters from across the land gather here. Are you ready to prove yourself?'",
    sprite: "angry",
    background: "battle_arena",
    choices: [
      { text: "Fight with strength", next: "arena_strength", statCheck: "strength" },
      { text: "Fight with magic", next: "arena_magic", statCheck: "magic" },
      { text: "Use cunning tactics", next: "arena_tactics", statCheck: null },
      { text: "Leave the arena", next: "sky_night", statCheck: null }
    ]
  },
  
  arena_strength: {
    speaker: "Arena Master",
    text: "Your display of raw strength impresses the crowd! You defeat several challengers and earn their respect.",
    sprite: "happy",
    background: "battle_arena",
    choices: [
      { text: "Continue your journey", next: "sky_night", statCheck: null }
    ],
    onEnter: function(player) {
      player.stats.strength += 3;
      return "Your strength grows from the battles! (+3 Strength)";
    }
  },
  
  sky_night: {
    speaker: "Narrator",
    text: "Under the starry night sky, you reflect on your journey. Magic sparkles in the air as you realize how much you've grown.",
    sprite: "happy",
    background: "sky_night",
    choices: [
      { text: "Start New Game+", next: "forest", statCheck: null },
      { text: "View Stats", next: "stats_view", statCheck: null },
      { text: "Credits", next: "credits", statCheck: null }
    ],
    onEnter: function(player) {
      return "You've completed your journey! Total Stats: Magic: " + player.stats.magic + ", Strength: " + player.stats.strength;
    }
  },
  
  credits: {
    speaker: "Narrator",
    text: "Thank you for playing Zhou Visual Novel! Created with magic and code. Your adventure may be over, but many more await...",
    sprite: "happy",
    background: "sky_night",
    choices: [
      { text: "Play Again", next: "forest", statCheck: null },
      { text: "Main Menu", next: "menu", statCheck: null }
    ]
  }
};

// Story Manager
const StoryManager = {
  currentScene: "forest",
  player: null,
  
  initialize(player) {
    this.player = player;
  },
  
  getCurrentScene() {
    return story[this.currentScene];
  },
  
  goToScene(sceneId) {
    if (story[sceneId]) {
      this.currentScene = sceneId;
      const scene = story[sceneId];
      
      // Execute onEnter function if it exists
      if (scene.onEnter) {
        const message = scene.onEnter(this.player);
        if (message) {
          console.log(message); // Could display as toast notification
        }
      }
      
      return scene;
    }
    return null;
  },
  
  checkStatRequirement(choice) {
    if (!choice.statCheck) return true;
    
    if (typeof choice.statCheck === 'string') {
      // Simple stat check
      return this.player.stats[choice.statCheck] > 0;
    }
    
    if (typeof choice.statCheck === 'object') {
      // Advanced stat check with minimum value
      return this.player.stats[choice.statCheck.type] >= choice.statCheck.min;
    }
    
    return true;
  },
  
  formatText(text) {
    if (!this.player) return text;
    return text.replace(/{player}/g, this.player.name);
  }
};

// Export for use in other modules
window.StoryManager = StoryManager;
window.story = story;
