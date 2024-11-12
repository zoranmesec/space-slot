import { Scene } from "phaser";
import { Reel } from "./Reel";
import Config from "../config";

import { SpinButton } from "./SpinButton";
import { BetButton } from "./BetButton";
import { Button } from "./Button";

export type SlotConfig = {
  reel: {
    items: number[];
    itemSize: number;
    reel1SpinDuration: number;
    reel2SpinDuration: number;
    reel3SpinDuration: number;
  };
  game: {
    initialBet: number;
    maxBet: number;
    betIncrement: number;
    betTxt: string;
    currency: string;
    winLines: number[][];
  };
  player: {
    initialMoney: number;
  };
};

export default class SpaceSlot {
  reel1: Reel;
  reel2: Reel;
  reel3: Reel;
  scene: Scene;
  isSpinning1: boolean;
  isSpinning2: boolean;
  isSpinning3: boolean;
  speed1: number;
  speed2: number;
  speed3: number;
  rect: Phaser.GameObjects.Graphics;
  spinButton: SpinButton;
  protected isRunning: boolean = false;
  graphics: Phaser.GameObjects.Graphics;
  txtSpin: Phaser.GameObjects.DynamicBitmapText;
  score: any;
  winLines: Phaser.GameObjects.Graphics[];
  autospin: Button;
  constructor(scene: Scene) {
    this.scene = scene;
    this.addBackground();
    this.reel1 = new Reel(scene, 300, 80);
    this.reel2 = new Reel(scene, 500, 80);
    this.reel3 = new Reel(scene, 700, 80);
    const config: SlotConfig = this.scene.data.get("config") as SlotConfig;
    this.scene.data.set("bet", config.game.initialBet);
    this.scene.data.set("money", config.player.initialMoney);
    this.scene.data.set("autospin", false);
    this.addSpinButton();
    this.addBetButton();
    this.addTitle();
    this.addScore();
    this.addWinningFrames();
    this.addAutoSpinButton();
  }
  addAutoSpinButton() {
    const config: SlotConfig = this.scene.data.get("config") as SlotConfig;
    this.autospin = new Button({
      scene: this.scene,
      x: 700,
      y: 520,
      width: 400,
      height: 50,
      color: 0xefefef,
      radius: 8,
      text: "AUTOSPIN OFF",
      textColor: 0x19153a,
      interactive: true,
      handleClick: () => {
        this.scene.data.toggle("autospin");
        if (this.scene.data.get("autospin")) {
          this.autospin.updateText("AUTOSPIN ON");
        } else {
          this.autospin.updateText("AUTOSPIN OFF");
        }
      },
    });
  }
  addTitle() {
    const txt = this.scene.add.dynamicBitmapText(480, 10, "ice", "SPACE", 40);
    txt.setTint(0x666666, 0x666666, 0x666666, 0x666666);
  }

  addBackground(): void {
    this.graphics = this.scene.add.graphics();

    this.graphics.fillStyle(0xefefef, 1);

    //  32px radius on the corners
    const rect = this.graphics.fillRoundedRect(
      Config.width / 2 - 300,
      50,
      600,
      400,
      32
    );
    rect.setAlpha(0.9);
  }

  run() {
    this.isRunning = true;
  }

  startSpin() {
    this.winLines.forEach((element) => {
      element.setVisible(false);
    });
    const config: SlotConfig = this.scene.data.get("config") as SlotConfig;
    this.scene.data.inc("money", -this.scene.data.get("bet"));

    this.updateScore();
    const timeline = this.scene.add.timeline([
      {
        at: 0,
        run: () => {
          this.isSpinning1 = true;
          this.isSpinning2 = true;
          this.isSpinning3 = true;
          this.speed1 = 50;
          this.speed2 = 50;
          this.speed3 = 50;
        },
      },
      {
        at: config.reel.reel1SpinDuration,
        run: () => {
          this.isSpinning1 = false;
          this.reel1.stopSpin();
        },
      },
      {
        at: config.reel.reel2SpinDuration,
        run: () => {
          this.isSpinning2 = false;
          this.reel2.stopSpin();
        },
      },
      {
        at: config.reel.reel3SpinDuration,
        run: () => {
          this.isSpinning3 = false;
          this.reel3.stopSpin();

          this.processResult();
          if (this.scene.data.get("autospin")) {
            var timer = this.scene.time.addEvent({
              delay: 1000, // ms
              callback: () => this.startSpin(),
              //args: [],
              callbackScope: this,
              loop: false,
            });
          } else {
            this.spinButton.reset();
          }
        },
        stop: true,
      },
    ]);

    timeline.play();
  }

  addSpinButton(): void {
    this.spinButton = new SpinButton({
      scene: this.scene,
      x: 520,
      y: 520,
      handleClick: () => this.startSpin(),
    });
    this.spinButton.enable();
  }

  addBetButton(): void {
    const config: SlotConfig = this.scene.data.get("config") as SlotConfig;
    const btn = new BetButton({
      scene: this.scene,
      x: 100,
      y: 500,
      width: 100,
      height: 50,
      color: 0xefefef,
      radius: 8,
      text: config.game.betTxt,
      textColor: 0x19153a,
      betIncrement: config.game.betIncrement,
      maxBet: config.game.maxBet,
      initialBet: config.game.initialBet,
    });
  }

  addWinningFrames(): void {
    const winLine1 = this.scene.add.graphics();
    winLine1.lineStyle(4, 0x1b173c);
    winLine1.beginPath();
    winLine1.moveTo(280, 140);
    winLine1.lineTo(800, 140);
    winLine1.closePath();
    winLine1.strokePath();
    winLine1.setVisible(false);

    const winLine2 = this.scene.add.graphics();
    winLine2.lineStyle(4, 0x1b173c);
    winLine2.beginPath();
    winLine2.moveTo(280, 260);
    winLine2.lineTo(800, 260);
    winLine2.closePath();
    winLine2.strokePath();
    winLine2.setVisible(false);

    const winLine3 = this.scene.add.graphics();
    winLine3.lineStyle(4, 0x1b173c);
    winLine3.beginPath();
    winLine3.moveTo(280, 370);
    winLine3.lineTo(800, 370);
    winLine3.closePath();
    winLine3.strokePath();
    winLine3.setVisible(false);

    this.winLines = [winLine1, winLine2, winLine3];
  }

  addScore(): void {
    const config: SlotConfig = this.scene.data.get("config") as SlotConfig;
    this.score = new Button({
      scene: this.scene,
      x: 700,
      y: 470,
      width: 400,
      height: 50,
      color: 0xefefef,
      radius: 8,
      text: this.getCurrencyFormat(config.player.initialMoney),
      textColor: 0x19153a,
      interactive: false,
    });
  }

  updateScore() {
    this.score.updateText(this.getCurrencyFormat(this.scene.data.get("money")));
  }

  getCurrencyFormat(value: number) {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "EUR",
    }).format(value);
  }

  isSlotRunning(): boolean {
    return this.isRunning;
  }

  update(): void {
    if (this.isSpinning1) {
      this.reel1.spin(this.speed1);
    }
    if (this.isSpinning2) {
      this.reel2.spin(this.speed2);
    }

    if (this.isSpinning3) {
      this.reel3.spin(this.speed3);
    }
  }

  processResult() {
    const res1 = this.reel1.getResult();
    const res2 = this.reel2.getResult();
    const res3 = this.reel3.getResult();
    const results = [
      [res1[0], res2[0], res3[0]],
      [res1[1], res2[1], res3[1]],
      [res1[2], res2[2], res3[2]],
    ];
    const config: SlotConfig = this.scene.data.get("config") as SlotConfig;
    results.forEach((element, index) => {
      config.game.winLines.forEach((line) => {
        if (
          line[0] === element[0] &&
          line[1] === element[1] &&
          line[2] === element[2]
        ) {
          this.winLines[index].setVisible(true);
          this.scene.data.inc("money", this.scene.data.get("bet") * 100);
          this.updateScore();
        }
      });
    });
  }
}
