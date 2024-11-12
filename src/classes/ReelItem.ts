import { GameObjects, Scene } from "phaser";
import { SlotConfig } from "./SpaceSlot";

// import { StaticItemType } from '../types/ItemType';
export class ReelItem extends GameObjects.Sprite {
  isBlurred: boolean = false;
  blurEffect: Phaser.FX.Blur | undefined;
  code: number;
  constructor(scene: Scene, x: number, y: number, code: number) {
    const config: SlotConfig = scene.data.get("config") as SlotConfig;
    super(
      scene,
      x,
      config.reel.itemSize * code,
      "items",
      "items_" + code + ".png"
    );
    this.code = code;
    this.blurEffect = this.preFX?.addBlur(0, 2, 2, 0);
  }
  blur() {
    if (!this.isBlurred) {
      this.isBlurred = true;

      if (this.blurEffect !== undefined) {
        this.blurEffect.strength = 1;
      }
    }
  }

  unBlur() {
    this.isBlurred = false;
    if (this.blurEffect !== undefined) {
      this.scene.tweens.add({
        targets: this.blurEffect,
        props: {
          strength: {
            value: 0,
            duration: 500,
          },
        },
        ease: "Cubic", // 'Cubic', 'Elastic', 'Bounce', 'Back'
        // interpolation: null,
      });
    }
  }
}