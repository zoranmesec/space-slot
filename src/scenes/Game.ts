import SpaceSlot, { SlotConfig } from "../classes/SpaceSlot";

export default class GameScene extends Phaser.Scene {
  slot: SpaceSlot;
  constructor() {
    super({ key: "Game" });
  }

  create(): void {
    //  A simple background for our game
    const img = this.add.image(0, 0, "background");
    img.setOrigin(0, 0);
    var config: SlotConfig = {
      game: {
        betIncrement: 10,
        initialBet: 10,
        maxBet: 100,
        betTxt: "BET",
        currency: "€",
        winLines: [
          [0, 0, 0],
          [1, 1, 1],
          [2, 2, 2],
          [3, 3, 3],
          [4, 4, 4],
        ],
      },
      player: { initialMoney: 10000 },
      reel: {
        items: [0, 1, 2, 3, 4],
        itemSize: 115,
        reel1SpinDuration: 500,
        reel2SpinDuration: 1000,
        reel3SpinDuration: 1500,
      },
    };

    this.data.set("config", config);
    this.slot = new SpaceSlot(this);
    this.slot.run();
  }

  override update(): void {
    if (this.slot.isSlotRunning) {
      this.slot.update();
    }
  }
}
