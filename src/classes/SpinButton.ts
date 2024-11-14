import { GameObjects } from "phaser";
import { ButtonProps, IButton } from "./Button";

export type SpinButtonProps = Pick<
  ButtonProps,
  "scene" | "x" | "y" | "handleClick"
>;

export class SpinButton extends GameObjects.Sprite implements IButton {
  width: number;
  height: number;
  color: number;
  radius: number;
  text: string;
  rect: Phaser.GameObjects.Graphics;
  spinButton: GameObjects.Sprite;
  clickCallback: () => void;
  constructor(props: SpinButtonProps) {
    const spinButton = props.scene.add.sprite(props.x, props.y, "spin");
    super(props.scene, 0, 0, "spin");
    this.clickCallback = props.handleClick;
    this.spinButton = spinButton;
    this.enable();
    this.spinButton.on("pointerup", () => {
      this.spinButton.setTint(0x666666, 0x666666, 0x666666, 0x666666);
      this.spinButton.postFX.disable(true);
      this.spinButton.disableInteractive(true);
      this.clickCallback();
    });
  }
  enable() {
    this.spinButton.setInteractive({
      cursor: "pointer",
    });
    this.spinButton.setTint(0xff00ff, 0xff0000, 0x00ff00, 0x0000ff);
    this.spinButton.postFX.addShine(0.5, 0.3, 5);
  }

  disable(): void {
    this.spinButton.setTint(0x666666, 0x666666, 0x666666, 0x666666);
    this.spinButton.postFX.disable(true);
    this.spinButton.disableInteractive(true);
  }
}
