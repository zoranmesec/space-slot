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
  font: string;
  fontSize: number;
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
    const txt = props.scene.add.text(10, 15, props.text, {
      fontFamily: props.font,
      fontSize: props.fontSize,
      color: Phaser.Display.Color.ValueToColor(props.textColor).rgba,
    });
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
    this.rect = rect;
    if (props.interactive) {
      this.enable();
    }

    this.setListeners();
  }
  setListeners() {
    this.on("pointerdown", () => {
      this.setScale(0.9);
      if (this.clickCallback !== undefined) {
        this.clickCallback();
      }
    });
    this.on("pointerup", () => {
      this.setScale(1);
    });
  }
  enable(): void {
    this.setInteractive({
      hitArea: new Phaser.Geom.Rectangle(
        20,
        20,
        this.width + 10,
        this.height + 10
      ),
      hitAreaCallback: Phaser.Geom.Rectangle.Contains,
      useHandCursor: true,
    });
    this.rect.setAlpha(0.8);
  }
  disable(): void {
    this.rect.setAlpha(0.3);
    this.disableInteractive(true);
  }

  updateText(newText: string) {
    this.txtObj.text = newText;
  }
}
