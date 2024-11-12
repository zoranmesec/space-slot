import Preload from "./scenes/Preload";
import Boot from "./scenes/Boot";
import Game from "./scenes/Game";

export default {
  type: Phaser.WEBGL,
  parent: "slot-game-phaser3",
  width: 1075,
  height: 604,
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },
  backgroundColor: "#FFFFFF",
  fps: {
    min: 30,
    target: 60,
  },
  scene: [Preload, Boot, Game],
};
