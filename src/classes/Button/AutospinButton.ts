import { GameObjects } from "phaser";
import { Button, ButtonProps, IButton } from "./Button";

export type AutospinButtonProps = Omit<ButtonProps, "height" | "width"> & {
  isOff?: boolean;
};

export class AutospinButton extends GameObjects.Container implements IButton {
  color: number;
  radius: number;
  text: string;
  rect: Phaser.GameObjects.Graphics;
  bet: number;
  txtObject: GameObjects.Text;
  plus: Button;
  minus: Button;
  onOff: GameObjects.Sprite;
  constructor(props: AutospinButtonProps) {
    const txt = props.scene.add.text(10, 15, props.text, {
      fontFamily: props.font,
      fontSize: props.fontSize,
      color: Phaser.Display.Color.ValueToColor(props.textColor).rgba,
    });
    const graphics = props.scene.add.graphics({
      fillStyle: { color: props.color },
    });

    const rect = graphics.fillRoundedRect(0, 0, 200, 50, props.radius);
    rect.setAlpha(0.8);
    const onOff = props.scene.add
      .sprite(140, 25, "on-off", "off")
      .setScale(0.3);
    super(props.scene, props.x, props.y, [rect, txt]);

    this.add([rect, txt, onOff]);
    this.radius = props.radius;
    this.color = props.color;
    this.text = props.text;
    this.onOff = onOff;
    this.onOff.on("pointerdown", this.onToggle, this);
    this.txtObject = txt;
    this.rect = rect;
    if (props.interactive) {
      this.enable();
    }
    if (!props.isOff) {
      this.onToggle();
    }

    this.scene.add.existing(this);

    //this does not work
    // this.scene.registry.events.on(
    //   "setdata",
    //   (parent: any, key: string, value: number) => {
    //     console.log("Scene data set:", key, value, parent);
    //   }
    // );
  }
  onToggle(): void {
    this.scene.data.toggle("autospin");
    if (this.scene.data.get("autospin")) {
      this.onOff.setTexture("on-off", "on");
    } else {
      this.onOff.setTexture("on-off", "off");
    }
  }

  enable(): void {
    this.onOff.setInteractive({ useHandCursor: true });
    this.rect.setAlpha(0.8);
  }
  disable(): void {
    this.rect.setAlpha(0.3);
    this.disableInteractive(true);
  }
}
