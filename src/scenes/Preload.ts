import Config from "../config";

export default class PreloadScene extends Phaser.Scene {
  progressBar: Phaser.GameObjects.Graphics;
  progressBox: Phaser.GameObjects.Graphics;
  loadingText: Phaser.GameObjects.Text;
  constructor() {
    super({ key: "Preload" });
  }

  preload(): void {
    this.load.setPath("assets");
    this.load.atlas(
      "items",
      "images/items/items.png",
      "images/items/items.json"
    );
    this.load.atlas(
      "on-off",
      "images/buttons/on-off.png",
      "images/buttons/on-off.json"
    );
    this.load.image("spin", "images/buttons/spin.png");
    this.load.image("background", "images/background/rocket.jpg");

    this.progressBar = this.add.graphics();
    this.progressBox = this.add.graphics();
    this.progressBox.fillStyle(Config.backgroundColor, 0.8);
    this.progressBox.fillRect(
      Config.width / 2 - 460,
      Config.height / 2 - 90,
      900,
      50
    );

    this.loadingText = this.add.text(
      Config.width / 2,
      Config.height / 2 - 5,
      "0%",
      {
        fontFamily: Config.display.font,
        fontSize: Config.display.fontTitleSize,
        color: Phaser.Display.Color.ValueToColor(Config.display.textColor).rgba,
      }
    );
    this.loadingText.setOrigin(0.5, 0.5);
    this.load.on("progress", (value: number) => {
      this.progressBar.clear();
      this.progressBar.fillStyle(Config.display.textColor, 1);
      this.progressBar.fillRect(
        Config.width / 2 - 450,
        Config.height / 2 - 80,
        880 * value,
        30
      );
      this.loadingText.setText(Phaser.Math.RoundTo(value * 100, 0) + "%");
    });
    this.load.on("complete", this.onComplete, this);
  }

  create(): void {
    this.scene.start("Game");
  }

  onComplete(): void {
    this.progressBar.destroy();
    this.progressBox.destroy();
    this.loadingText.destroy();
  }
}
