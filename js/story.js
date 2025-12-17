// Story Data
const story = {
  forest: {
    speaker: "Narrator",
    text: "Welcome to the enchanted forest, {player}! The air is filled with magical energy.",
    sprite: "happy",
    background: "forest",
    choices: [
      { text: "Go to the castle", next: "castle", statCheck: null },
      { text: "Explore deeper", next: "forest_deep", statCheck: null }
    ]
  },
  
  forest_deep: {
    speaker: "Ancient Tree",
    text: "You find an ancient magical tree glowing with energy.",
    sprite: "neutral",
    background: "forest",
    choices: [
      { text: "Touch the tree", next: "tree_blessing", statCheck: null },
      { text: "Go to castle", next: "castle", statCheck: null }
    ]
  },
  
  tree_blessing: {
    speaker: "Ancient Tree",
    text: "The tree blesses you with magical power!",
    sprite: "happy",
    background: "forest",
    choices: [
      { text: "Continue to castle", next: "castle", statCheck: null }
    ]
  },
  
  castle: {
    speaker: "Guard",
    text: "You arrive at Castle Zhou. The guard eyes you suspiciously.",
    sprite: "neutral",
    background: "castle",
    choices: [
      { text: "Request entry to study", next: "study_room", statCheck: null },
      { text: "Look at world map", next: "world_map", statCheck: null }
    ]
  },
  
  study_room: {
    speaker: "Archmage",
    text: "You enter the study room filled with ancient tomes.",
    sprite: "happy",
    background: "study_room",
    choices: [
      { text: "Study magic", next: "magic_learn", statCheck: null },
      { text: "Go to world map", next: "world_map", statCheck: null }
    ]
  },
  
  world_map: {
    speaker: "Cartographer",
    text: "You examine the world map. Many locations are marked.",
    sprite: "neutral",
    background: "world_map",
    choices: [
      { text: "Go to mountains", next: "mountain", statCheck: null },
      { text: "Find magical ruins", next: "magic_ruins", statCheck: null },
      { text: "Visit battle arena", next: "battle_arena", statCheck: null }
    ]
  },
  
  mountain: {
    speaker: "Guide",
    text: "The mountain air is thin and cold.",
    sprite: "sad",
    background: "mountain",
    choices: [
      { text: "Continue climbing", next: "mountain_top", statCheck: null },
      { text: "Return to map", next: "world_map", statCheck: null }
    ]
  },
  
  magic_ruins: {
    speaker: "Ancient Spirit",
    text: "Ancient magical ruins glow with mysterious energy.",
    sprite: "surprised",
    background: "magic_ruins",
    choices: [
      { text: "Explore ruins", next: "ruins_explore", statCheck: null },
      { text: "Go to arena", next: "battle_arena", statCheck: null }
    ]
  },
  
  battle_arena: {
    speaker: "Arena Master",
    text: "The crowd cheers as you enter the battle arena!",
    sprite: "angry",
    background: "battle_arena",
    choices: [
      { text: "Fight!", next: "arena_fight", statCheck: null },
      { text: "Watch night sky", next: "sky_night", statCheck: null }
    ]
  },
  
  sky_night: {
    speaker: "Narrator",
    text: "The night sky is filled with magical stars. Your journey continues...",
    sprite: "happy",
    background: "sky_night",
    choices: [
      { text: "Play Again", next: "forest", statCheck: null }
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
      return story[sceneId];
    }
    return null;
  },
  
  checkStatRequirement(choice) {
    return true; // Simplified for now
  },
  
  formatText(text) {
    if (!this.player) return text;
    return text.replace(/{player}/g, this.player.name);
  }
};

// Export for use in other modules
window.StoryManager = StoryManager;
window.story = story;
