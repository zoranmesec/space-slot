import { GameObjects } from "phaser";
import { Button, ButtonProps, IButton } from "./Button";
import { SlotConfig } from "../../config";

export type BetButtonProps = Omit<ButtonProps, "interactive" | "width"> & {
  maxBet: number;
  initialBet: number;
  betIncrement: number;
};

export class BetButton extends GameObjects.Container implements IButton {
  height: number;
  color: number;
  radius: number;
  text: string;
  rect: Phaser.GameObjects.Graphics;
  bet: number;
  txtObject: GameObjects.Text;
  plus: Button;
  minus: Button;
  clickCallback: () => void;
  constructor(props: BetButtonProps) {
    const graphics = props.scene.add.graphics({
      fillStyle: { color: props.color },
    });

    const rect2 = graphics.fillRoundedRect(
      50,
      0,
      130,
      props.height,
      props.radius
    );

    super(props.scene, props.x, props.y, [rect2]);

    const txt = props.scene.add.text(55, 15, this.getLabel(), {
      fontFamily: props.font,
      fontSize: props.fontSize,
      color: Phaser.Display.Color.ValueToColor(props.textColor).rgba,
    });

    this.minus = new Button({
      scene: props.scene,
      x: 0,
      y: 0,
      color: props.color,
      height: props.height,
      width: 40,
      radius: props.radius,
      text: "-",
      textColor: props.textColor,
      font: props.font,
      fontSize: props.fontSize,
      interactive: true,
      handleClick: () => this.handleMinusClick(),
    });
    this.plus = new Button({
      scene: props.scene,
      x: 190,
      y: 0,
      color: props.color,
      height: props.height,
      width: 40,
      radius: props.radius,
      text: "+",
      textColor: props.textColor,
      font: props.font,
      fontSize: props.fontSize,
      interactive: true,
      handleClick: () => this.handlePlusClick(),
    });
    this.minus.disable();
    this.add([this.minus, this.plus, txt]);

    this.height = props.height;
    this.radius = props.radius;
    this.color = props.color;
    this.text = props.text;
    this.scene.add.existing(this);
    this.txtObject = txt;
    this.clickCallback = props.handleClick;

    rect2.setAlpha(0.8);
    //this does not work
    // this.scene.registry.events.on(
    //   "setdata",
    //   (parent: any, key: string, value: number) => {
    //     console.log("Scene data set:", key, value, parent);
    //   }
    // );
  }

  getLabel(): string {
    const config: SlotConfig = this.scene.data.get("config") as SlotConfig;
    const bet = this.scene.data.get("bet");
    return `${config.game.betTxt} ${bet}${config.game.currency}`;
  }

  handlePlusClick(): void {
    let bet: number = this.scene.data.get("bet");
    const config: SlotConfig = this.scene.data.get("config") as SlotConfig;
    if (bet === config.game.initialBet) {
      this.minus.enable();
    }

    this.scene.data.inc("bet", 10);
    this.txtObject.setText(this.getLabel());

    bet = this.scene.data.get("bet");
    if (bet === config.game.maxBet) {
      this.plus.disable();
      return;
    }

    this.clickCallback();
  }

  handleMinusClick(): void {
    let bet: number = this.scene.data.get("bet");
    const config: SlotConfig = this.scene.data.get("config") as SlotConfig;
    if (bet === config.game.maxBet) {
      this.plus.enable();
    }
    this.scene.data.inc("bet", -10);
    bet = this.scene.data.get("bet");
    this.txtObject.setText(this.getLabel());
    if (bet === config.game.initialBet) {
      this.minus.disable();
      return;
    }
    this.clickCallback();
  }

  enable(): void {
    this.minus.enable();
    this.plus.enable();
  }
  disable(): void {
    //nothing to do here
  }
}
