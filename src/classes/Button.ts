import { GameObjects, Scene } from "phaser";

export type ButtonProps = {
  scene: Scene;
  x: number;
  y: number;
  width: number;
  height: number;
  color: number;
  radius: number;
  text: string;
  textColor: number;
  interactive: boolean;
  handleClick?: () => void;
};

export interface IButton {
  disable(): void;
  enable(): void;
}

export class Button extends GameObjects.Container implements IButton {
  width: number;
  height: number;
  color: number;
  radius: number;
  text: string;
  rect: Phaser.GameObjects.Graphics;
  clickCallback: () => void;
  txtObj: GameObjects.Text;
  constructor(props: ButtonProps) {
    const txt = props.scene.add.text(10, 0, props.text, {
      fontFamily: "Arial",
      fontSize: 40,
      color: Phaser.Display.Color.ValueToColor(props.textColor).rgba,
    });
    //  32px radius on the corners
    const graphics = props.scene.add.graphics({
      fillStyle: { color: props.color },
    });

    const rect = graphics.fillRoundedRect(
      0,
      0,
      props.width,
      props.height,
      props.radius
    );
    rect.setAlpha(0.8);

    super(props.scene, props.x, props.y, [rect, txt]);
    this.scene = props.scene;

    this.width = props.width;
    this.height = props.height;
    this.radius = props.radius;
    this.color = props.color;
    this.text = props.text;
    this.txtObj = txt;
    this.clickCallback = props.handleClick;
    this.scene.add.existing(this);
    if (props.interactive) {
      this.enable();
    }

    this.on("pointerdown", () => {
      this.setScale(0.9);
    });
    this.on("pointerup", () => {
      this.setScale(1);
      if (this.clickCallback !== undefined) {
        this.clickCallback();
      }
    });
  }
  enable(): void {
    this.setInteractive({
      hitArea: new Phaser.Geom.Rectangle(10, 10, this.width, this.height),
      hitAreaCallback: Phaser.Geom.Rectangle.Contains,
      useHandCursor: true,
    });
  }
  disable(): void {
    this.disableInteractive(true);
  }

  updateText(newText: string) {
    this.txtObj.text = newText;
  }
}
