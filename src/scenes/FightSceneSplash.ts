import { fightSceneTexture } from "../Constant/GameConstant";

export default class FightSceneSplash extends Phaser.Scene {
  gameWidth: number = 0;
  gameHeight: number = 0;
  progressBarFill: any;
  progressBarBase: any;
  fightSceneSpine = [
    {
      spineKey: "CityStage",
      json: "Bg/CityStageBg/City stage.json",
      atlas: "Bg/CityStageBg/City stage.atlas",
    },
    {
      spineKey: "Sirmifren",
      json: "Character/Sirmifren/character1.json",
      atlas: "Character/Sirmifren/character1.atlas.txt",
    },
  ];

  SplashTexture: string[] = [
    "SplashBg.png",
    "PlayNow.png",
    "SplashFiller.png",
    "SplashBarBase.png",
  ];
  fightSceneTexture: string[] = [
    "hand.png",
    "legs.png",
    "shield.png",
    "fire.png",
    "TimeBg.png",
    "PlayerIcon.png",
    "FilledBar.png",
    "EmptyBar.png",
    "PlayerMovement.png",
    "up.png",
    "down.png",
    "left.png",
    "right.png",
    "JoyStickBg.png",
    "JoyStickController.png",
  ];

  constructor() {
    super("SplashScene");
  }

  preload() {
    // Set up width and height
    this.gameWidth = this.sys.game.config.width as number;
    this.gameHeight = this.sys.game.config.height as number;
    this.SplashTexture.forEach((element) => {
      const imageKey = element.split(".")[0];
      const imageAddress = `assets/GameUI/${element}`;
      console.log("Image Key : ", imageKey, imageAddress);
      this.load.image(imageKey, imageAddress);
    });
    this.fightSceneSpine.forEach((element) => {
      this.load.spineJson(
        element.spineKey,
        `assets/SpineAnimation/${element.json}`
      );
      this.load.spineAtlas(
        `${element.spineKey}-atlas`,
        `assets/SpineAnimation/${element.atlas}`
      );
    });
    fightSceneTexture.forEach((element) => {
        const imageKey = element.split(".")[0];
        const imageAddress = `assets/GameUI/${element}`;
        console.log("Image Key : ", imageKey, imageAddress);
        this.load.image(imageKey, imageAddress);
      });
    //this.setProgressBar();
  }
  create() {
    let SplashBG = this.add.sprite(
      this.gameWidth / 2,
      this.gameHeight / 2,
      "SplashBg"
    );
    SplashBG.setOrigin(0.5, 0.5); // Ensure the origin is at the center of the sprite
    SplashBG.setDisplaySize(this.gameWidth, this.gameHeight); // Resize the sprite to match the screen size

    this.setPlayNowBtn();
  }
  setProgressBar() {
    try {
      this.progressBarBase = this.add.sprite(
        this.gameWidth / 2,
        this.gameHeight - 50,
        "SplashBarBase"
      );
      this.progressBarBase.setOrigin(0.5, 0.5);
      this.progressBarBase.setDisplaySize(604, 10); // Set the size of the background bar
      this.progressBarFill = this.add.sprite(
        this.gameWidth / 2 - 200,
        this.gameHeight - 50,
        "SplashFiller"
      );
      this.progressBarFill.setOrigin(0, 0.5); // Set the origin to the left side for scaling
      this.progressBarFill.setDisplaySize(0, 10); // Initially set the width to 0 (empty)

      // Track progress of loading assets
      this.load.on("progress", (percentage: number) => {
        console.log("On Progress : ", percentage);
        // Update the width of the progress bar fill based on the loading progress
        this.progressBarFill.setDisplaySize(604 * percentage, 10); // Scale the width based on the percentage
      });

      // When loading is complete, show the PlayNow button
      this.load.on("complete", () => {
        console.log("On Complete : ");
        //this.setPlayNowBtn();
      });
    } catch (error) {}
  }
  setPlayNowBtn() {
    try {
      let playNow = this.add.sprite(
        this.gameWidth / 2,
        this.gameHeight - 50,
        "PlayNow"
      );
      playNow.setInteractive();
      // Add an event listener for when the sprite is clicked (pointerdown or pointerup)
      playNow.on("pointerdown", () => {
        // When clicked, start the fight scene
        //console.log("play Now Clicked")
        this.scene.start("FightScene");
      });
    } catch (error) {}
  }
}
