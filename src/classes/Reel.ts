import { GameObjects, Scene } from "phaser";
import { ReelItem } from "./ReelItem";
import { SlotConfig } from "../config";
export class Reel extends GameObjects.Container {
  reelItems: ReelItem[];
  constructor(scene: Scene, x: number, y: number) {
    const config: SlotConfig = scene.data.get("config") as SlotConfig;
    const items1 = new ReelItem(
      scene,
      Phaser.Utils.Array.GetRandom(config.reel.items)
    );
    const items2 = new ReelItem(
      scene,
      Phaser.Utils.Array.GetRandom(config.reel.items)
    );
    const items3 = new ReelItem(
      scene,
      Phaser.Utils.Array.GetRandom(config.reel.items)
    );
    super(scene, x, y, [items1, items2, items3]);

    Phaser.Actions.GridAlign([items1, items2, items3], {
      cellWidth: config.reel.itemSize,
      position: Phaser.Display.Align.TOP_LEFT,
      width: 1,
      height: -1,
      cellHeight: config.reel.itemSize,
    });
    scene.add.existing(this);
    this.reelItems = [items1, items2, items3];
  }

  spin(speed: number): void {
    this.reelItems.forEach((item) => {
      item.blur();
      item.y += speed;
      if (item.y > 420) {
        item.y = 150;
      }
    });
  }
  stopSpin(): void {
    const config: SlotConfig = this.scene.data.get("config") as SlotConfig;
    this.reelItems.forEach((item) => {
      item.changeCode(Phaser.Utils.Array.GetRandom(config.reel.items));
      item.unBlur();
    });
    Phaser.Actions.GridAlign(this.reelItems, {
      cellWidth: config.reel.itemSize,
      position: Phaser.Display.Align.TOP_LEFT,
      width: 1,
      height: -1,
      cellHeight: config.reel.itemSize,
    });
  }

  getResult(): number[] {
    return this.reelItems.map((x) => x.code);
  }
}
