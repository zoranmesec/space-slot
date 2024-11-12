import { GameObjects, Scene } from "phaser";
import { Button, ButtonProps, IButton } from "./Button";
import { SlotConfig } from "./SpaceSlot";

export type BetButtonProps = Omit<ButtonProps, "interactive"> & {
  maxBet: number;
  initialBet: number;
  betIncrement: number;
};

export class BetButton extends GameObjects.Container implements IButton {
  width: number;
  height: number;
  color: number;
  radius: number;
  text: string;
  rect: Phaser.GameObjects.Graphics;
  bet: number;
  txtObject: GameObjects.Text;
  plus: Button;
  minus: Button;
  constructor(props: BetButtonProps) {
    //  32px radius on the corners
    const graphics = props.scene.add.graphics({
      fillStyle: { color: props.color },
    });

    const rect2 = graphics.fillRoundedRect(
      50,
      0,
      120,
      props.height,
      props.radius
    );

    super(props.scene, props.x, props.y, [rect2]);

    const txt = props.scene.add.text(55, 5, this.getLabel(), {
      fontFamily: "Arial",
      fontSize: 20,
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
      interactive: true,
      handleClick: () => this.handleMinusClick(),
    });
    this.plus = new Button({
      scene: props.scene,
      x: 180,
      y: 0,
      color: props.color,
      height: props.height,
      width: 40,
      radius: props.radius,
      text: "+",
      textColor: props.textColor,
      interactive: true,
      handleClick: () => this.handlePlusClick(),
    });
    this.minus.disable();
    this.add([this.minus, this.plus, txt]);

    this.width = props.width;
    this.height = props.height;
    this.radius = props.radius;
    this.color = props.color;
    this.text = props.text;
    this.scene.add.existing(this);
    this.txtObject = txt;

    rect2.setAlpha(0.8);
    //this does not work
    // this.scene.registry.events.on(
    //   "setdata",
    //   (parent: any, key: string, value: number) => {
    //     console.log("Scene data set:", key, value, parent);
    //   }
    // );
  }

  getLabel() {
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
  }

  enable(): void {}
  disable(): void {}
}
