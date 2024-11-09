import Phaser from "phaser";

export default class Scene1 extends Phaser.Scene {
  gameWidth: number = 0;
  gameHeight: number = 0;
  animIndex: number = 0;
  dogePlayer: any;
  sirMifrenPlayer: any;
  sirMifren: string[] = [
    "air_recovery",
    "combo_punch",
    "dash_forward",
    "getting_hit_high_punch",
  ];
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
  constructor() {
    super("bootGame");
  }

  preload() {
    // Set up width and height
    this.gameWidth = this.sys.game.config.width as number;
    this.gameHeight = this.sys.game.config.height as number;
    // this.fightSceneSpine.forEach((element) => {
    //   const elementKey=element.spineKey;
    //   const elementAddress=`assets/SpineAnimation/${element.json}`;
    //   const atlasAddress=`assets/SpineAnimation/${element.atlas}`;
    //   console.log("Spine1 : ", elementKey);
    //   console.log("Spine2 : ", elementAddress);
    //   console.log("Spine3 : ", atlasAddress);

    //   this.load.spineJson(
    //     element.spineKey,
    //     `assets/SpineAnimation/${element.json}`
    //   );
    //   this.load.spineAtlas(
    //     `${element.spineKey}-atlas`,
    //     `assets/SpineAnimation/${element.atlas}`
    //   );
    // });
    // Load Spine assets for background and characters
    // this.load.spineJson("CityStage", "assets/SpineAnimation/Bg/CityStageBg/City stage.json");
    // this.load.spineAtlas("CityStage-atlas", "assets/SpineAnimation/Bg/CityStageBg/City stage.atlas");

    // this.load.spineJson("Sirmifren", "assets/SpineAnimation/Character/Sirmifren/character1.json");
    // this.load.spineAtlas("Sirmifren-atlas", "assets/SpineAnimation/Character/Sirmifren/character1.atlas.txt");

    // Optionally load any other spritesheets here for sprite animations
  }

  create() {
    // Create background Spine object in the center

    const bg = this.add.spine(
      this.gameWidth / 2,
      this.gameHeight / 2,
      "CityStage",
      "CityStage-atlas"
    );
    bg.animationState.setAnimation(0, "animation", true); // Play the 'animation' for the background (looping)

    // Create Sir Mifren player Spine object at the bottom
    this.sirMifrenPlayer = this.add.spine(
      150,
      this.gameHeight - 50,
      "Sirmifren",
      "Sirmifren-atlas"
    );
    this.sirMifrenPlayer.animationState.setAnimation(0, "combo_punch", true); // Start the 'combo_punch' animation

    // You can also set additional animations for other player states
    // For example, if you want to switch to another animation like "dash_forward", do it like this:
    // this.sirMifrenPlayer.animationState.setAnimation(0, "dash_forward", true);
  }

  update() {
    // You can update logic here if necessary for the animation or player controls
  }
}
