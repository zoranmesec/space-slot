import { Scene } from "phaser";
import { Reel } from "./Reel/Reel";
import Config, { SlotConfig } from "../config";

import { SpinButton } from "./Button/SpinButton";
import { BetButton } from "./Button/BetButton";
import { Button } from "./Button/Button";
import { AutospinButton } from "./Button/AutospinButton";

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
  graphicsReelBackground: Phaser.GameObjects.Graphics;
  txtSpin: Phaser.GameObjects.DynamicBitmapText;
  winLines: Phaser.GameObjects.Graphics[];
  autospin: AutospinButton;
  graphicsMenuBackground: Phaser.GameObjects.Graphics;
  betButton: BetButton;
  score: Button;

  constructor(scene: Scene) {
    this.scene = scene;
    this.setDefaultData();
    this.addBackground();
    this.addTitle();
    this.addReels();
    this.addBetButton();
    this.addAutoSpinButton();
    this.addSpinButton();
    this.addScore();
    this.addWinningFrames();
  }
  setDefaultData(): void {
    const config: SlotConfig = this.scene.data.get("config") as SlotConfig;
    this.scene.data.set("bet", config.game.initialBet);
    this.scene.data.set("money", config.player.initialMoney);
    this.scene.data.set("autospin", false);
  }
  addReels(): void {
    this.reel1 = new Reel(this.scene, 300, 80);
    this.reel2 = new Reel(this.scene, 500, 80);
    this.reel3 = new Reel(this.scene, 700, 80);
  }
  addAutoSpinButton(): void {
    const config: SlotConfig = this.scene.data.get("config") as SlotConfig;
    this.autospin = new AutospinButton({
      scene: this.scene,
      x: 260,
      y: 490,
      color: config.backgroundColor,
      radius: 8,
      text: config.game.autoTxt,
      textColor: config.display.textColor,
      font: config.display.font,
      fontSize: config.display.fontSize,
      interactive: true,
      handleClick: () => {
        this.scene.data.toggle("autospin");
      },
      isOff: true,
    });
  }
  addTitle(): void {
    const config: SlotConfig = this.scene.data.get("config") as SlotConfig;

    this.scene.add.text(240, -10, config.game.title, {
      fontFamily: config.display.fontTitle,
      fontSize: config.display.fontTitleSize,
      color: Phaser.Display.Color.ValueToColor(config.backgroundColor).rgba,
    });
  }

  addBackground(): void {
    const config: SlotConfig = this.scene.data.get("config") as SlotConfig;
    this.graphicsReelBackground = this.scene.add.graphics();

    this.graphicsReelBackground.fillStyle(config.backgroundColor, 1);

    const rect = this.graphicsReelBackground.fillRoundedRect(
      Config.width / 2 - 300,
      50,
      600,
      400,
      32
    );
    rect.setAlpha(0.8);
    this.graphicsMenuBackground = this.scene.add.graphics();
    this.graphicsMenuBackground.fillStyle(config.display.textColor, 1);

    const rect2 = this.graphicsMenuBackground.fillRoundedRect(
      0,
      470,
      Config.width,
      90,
      32
    );
    rect2.setAlpha(0.2);
  }

  addSpinButton(): void {
    this.spinButton = new SpinButton({
      scene: this.scene,
      x: Config.width / 2,
      y: 520,
      handleClick: () => this.startSpin(),
    });
    this.spinButton.enable();
  }

  addBetButton(): void {
    const config: SlotConfig = this.scene.data.get("config") as SlotConfig;
    this.betButton = new BetButton({
      scene: this.scene,
      x: 20,
      y: 490,
      height: 50,
      color: config.backgroundColor,
      radius: 8,
      text: config.game.betTxt,
      textColor: config.display.textColor,
      font: config.display.font,
      fontSize: config.display.fontSize,
      betIncrement: config.game.betIncrement,
      maxBet: config.game.maxBet,
      initialBet: config.game.initialBet,
      handleClick: () => {
        const bet: number = this.scene.data.get("bet");
        const money: number = this.scene.data.get("money");
        if (money - bet < 0) {
          this.spinButton.disable();
        } else if (!this.scene.data.get("autospin")) {
          this.spinButton.enable();
        }
      },
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
      x: 620,
      y: 490,
      width: 420,
      height: 50,
      color: config.backgroundColor,
      radius: 8,
      text: this.getCurrencyFormat(config.player.initialMoney),
      textColor: config.display.textColor,
      font: config.display.font,
      fontSize: config.display.fontSize,
      interactive: false,
    });
  }

  run(): void {
    this.isRunning = true;
  }

  startSpin(): void {
    this.winLines.forEach((element) => {
      element.setVisible(false);
    });
    const config: SlotConfig = this.scene.data.get("config") as SlotConfig;

    const money = this.scene.data.get("money");
    if (money <= 0) {
      this.spinButton.disable();
      this.autospin.onToggle();
      return;
    }

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
            const bet: number = this.scene.data.get("bet");
            const money: number = this.scene.data.get("money");
            if (money - bet < 0) {
              this.autospin.onToggle();
              this.spinButton.disable();
            } else {
              this.scene.time.addEvent({
                delay: 1000, // ms
                callback: () => this.startSpin(),
                //args: [],
                callbackScope: this,
                loop: false,
              });
            }
          }
        },
        stop: true,
      },
    ]);

    timeline.play();
  }

  updateScore(): void {
    this.score.updateText(this.getCurrencyFormat(this.scene.data.get("money")));
  }

  getCurrencyFormat(value: number): string {
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

  processResult(): void {
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
          this.scene.data.inc(
            "money",
            this.scene.data.get("bet") * 10 * (index + 1)
          );
          this.updateScore();
        }
      });
    });

    const money: number = this.scene.data.get("money");
    const bet: number = this.scene.data.get("bet");
    if (money <= 0 || money - bet < 0) {
      this.spinButton.disable();
    } else if (!this.scene.data.get("autospin")) {
      this.spinButton.enable();
    }
  }
}
