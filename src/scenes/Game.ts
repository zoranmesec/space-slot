import SpaceSlot from "../classes/SpaceSlot";
import config, { SlotConfig } from "../config";

export default class GameScene extends Phaser.Scene {
  slot: SpaceSlot;
  constructor() {
    super({ key: "Game" });
  }

  create(): void {
    const img = this.add.image(0, 0, "background");
    img.setOrigin(0, 0);
    const cfg: SlotConfig = config;

    this.data.set("config", cfg);
    try {
      this.slot = new SpaceSlot(this);
      this.slot.run();
    } catch (error) {
      //TODO: display error message
      console.log(error);
    }
  }

  override update(): void {
    if (this.slot.isSlotRunning()) {
      this.slot.update();
    }
  }
}
