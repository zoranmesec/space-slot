export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: "Preload" });
  }

  preload() {
    this.load.setPath("assets");
    this.load.atlas(
      "items",
      "images/items/items.png",
      "images/items/items.json"
    );
    this.load.image("spin", "images/buttons/spin.png");
    this.load.image("background", "images/background/rocket.jpg");
    this.load.bitmapFont(
      "ice",
      "fonts/bitmap/iceicebaby.png",
      "fonts/bitmap/iceicebaby.xml"
    );
  }

  create() {
    this.scene.start("Boot");
  }
}
