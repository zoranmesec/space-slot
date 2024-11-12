export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: "Boot" });
  }

  create() {
    this.scene.start("Game");
  }
}
