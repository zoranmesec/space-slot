import Preload from "./scenes/Preload";
import Game from "./scenes/Game";

export type SlotConfig = {
  type: number;
  parent: string;
  width: number;
  height: number;
  physics: {
    default: string;
    arcade: {
      debug: boolean;
    };
  };
  backgroundColor: number;
  fps: {
    min: number;
    target: number;
  };
  scene: [typeof Preload, typeof Game];
  display: {
    font: string;
    fontSize: number;
    fontTitle: string;
    fontTitleSize: number;
    textColor: number;
  };
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
    autoTxt: string;
    currency: string;
    winLines: number[][];
    title: string;
  };
  player: {
    initialMoney: number;
  };
};

const config: SlotConfig = {
  type: Phaser.WEBGL,
  parent: "slot-game-phaser3",
  width: 1075,
  height: 604,
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },
  backgroundColor: 0xefefef,
  fps: {
    min: 30,
    target: 60,
  },
  scene: [Preload, Game],
  display: {
    font: "BmCube",
    fontTitle: "SponsorRegular",
    fontSize: 20,
    fontTitleSize: 40,
    textColor: 0x19153a,
  },
  game: {
    betIncrement: 10,
    initialBet: 10,
    maxBet: 100,
    betTxt: "BET",
    autoTxt: "AUTO",
    title: "FINAL  FRONTIER",
    currency: "€",
    winLines: [
      [0, 0, 0],
      [1, 1, 1],
      [2, 2, 2],
      [3, 3, 3],
      [4, 4, 4],
    ],
  },
  player: { initialMoney: 1000 },
  reel: {
    items: [0, 1, 2, 3, 4],
    itemSize: 115,
    reel1SpinDuration: 500,
    reel2SpinDuration: 1000,
    reel3SpinDuration: 1500,
  },
};

export default config;
