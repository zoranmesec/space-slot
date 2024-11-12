import { GameObjects, Scene } from "phaser";
import { ReelItem } from "./ReelItem";
import { SlotConfig } from "./SpaceSlot";
export class Reel extends GameObjects.Container {
  reelItems: ReelItem[];
  constructor(scene: Scene, x: number, y: number, nrItems: number = 3) {
    super(scene, x, y, []);
    const config: SlotConfig = this.scene.data.get("config") as SlotConfig;
    const items1 = new ReelItem(
      scene,
      0,
      0,
      Phaser.Utils.Array.GetRandom(config.reel.items)
    );
    const items2 = new ReelItem(
      scene,
      0,
      config.reel.itemSize,
      Phaser.Utils.Array.GetRandom(config.reel.items)
    );
    const items3 = new ReelItem(
      scene,
      0,
      config.reel.itemSize * 2,
      Phaser.Utils.Array.GetRandom(config.reel.items)
    );
    Phaser.Actions.GridAlign([items1, items2, items3], {
      cellWidth: 115,
      position: Phaser.Display.Align.TOP_LEFT,
      width: 1,
      height: -1,
      cellHeight: config.reel.itemSize,
    });
    this.add([items1, items2, items3]);
    scene.add.existing(this);
    this.reelItems = [items1, items2, items3];
  }

  preload() {}

  create() {}

  spin(speed: number) {
    this.reelItems.forEach((item) => {
      item.blur();
      item.y += speed;
      if (item.y > 420) {
        item.y = 150;
      }
    });
  }
  stopSpin() {
    this.reelItems.forEach((item) => {
      item.unBlur();
    });
    this.reelItems = Phaser.Utils.Array.Shuffle(this.reelItems);
    Phaser.Actions.GridAlign(this.reelItems, {
      cellWidth: 115,
      position: Phaser.Display.Align.TOP_LEFT,
      width: 1,
      height: -1,
      cellHeight: 115,
    });
  }

  getResult() {
    return this.reelItems.map((x) => x.code);
  }
}
