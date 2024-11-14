import { GameObjects, Scene } from "phaser";
import { SlotConfig } from "../../config";

export class ReelItem extends GameObjects.Sprite {
  isBlurred: boolean = false;
  blurEffect: Phaser.FX.Blur | undefined;
  code: number;
  constructor(scene: Scene, code: number) {
    const config: SlotConfig = scene.data.get("config") as SlotConfig;
    super(
      scene,
      0,
      config.reel.itemSize * code,
      "items",
      "items_" + code + ".png"
    );
    this.code = code;
    this.blurEffect = this.preFX?.addBlur(0, 2, 2, 0);
  }
  blur(): void {
    if (!this.isBlurred) {
      this.isBlurred = true;

      if (this.blurEffect !== undefined) {
        this.blurEffect.strength = 1;
      }
    }
  }

  unBlur(): void {
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
        ease: "Cubic",
      });
    }
  }

  changeCode(newCode: number) {
    this.setFrame("items_" + newCode + ".png");
    this.code = newCode;
  }
}
