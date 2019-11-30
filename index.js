import {
  GameScene
} from "/GameScene.js";
import {
  start
} from "/start.js";
import {
  gameover
} from "/gameover.js";
import {
  fase2
} from "/fase2.js";

var config = {
  type: Phaser.AUTO,
  physics: {
    default: "arcade",
    arcade: {
      gravity: {
        y: 390
      },
      debug: true
    }
  },

  scale: {
    mode: Phaser.Scale.FIT,
    parent: "game",
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 800,
    height: 600
  },
  // Várias cenas, em sequência
  scene: [start, GameScene, fase2, gameover]
};

var game = new Phaser.Game(config);