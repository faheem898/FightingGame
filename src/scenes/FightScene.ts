import Phaser from "phaser";
import VirtualJoyStick from "phaser3-rex-plugins/plugins/virtualjoystick.js";
import VirtualJoyStickPlugin from "phaser3-rex-plugins/plugins/virtualjoystick-plugin";
import MiFrensPlayer from "../PlayerManager/MiFrensPlayer1";
import { PlayerPosition } from "../Constant/GameConstant";
export default class FightScene extends Phaser.Scene {
  gameWidth: number = 0;
  gameHeight: number = 0;
  screenWidth: number = 0;
  screenHeight: number = 0;
  animIndex: number = 0;
  dogePlayer: any;
  sirMifrenPlayer: any;
  progressBarBase: any;
  progressBarFill: any;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  updownPanel: any;
  private joystick!: VirtualJoyStick;
  private miFrensPlayer!: MiFrensPlayer;
  private dogePlayer1!: MiFrensPlayer;
  private speed: number = 200;
  private isAnimating: boolean = false;
  private punchHitboxPlayer: Phaser.GameObjects.Rectangle | undefined;
  private punchHitboxEnemy: Phaser.GameObjects.Rectangle | undefined;

  private playerAction: {
    [key in "hand" | "legs" | "shield" | "fire"]: () => void;
  };

  constructor() {
    super("FightScene");
    this.playerAction = {
      hand: this.performHandAction,
      legs: this.performLegsAction,
      shield: this.performShieldAction,
      fire: this.performFireAction,
    };
  }

  preload() {
    // Set up width and height
    this.gameWidth = this.sys.game.config.width as number;
    this.gameHeight = this.sys.game.config.height as number;
    this.screenWidth = this.sys.game.config.width as number;
    this.screenHeight = this.sys.game.config.height as number;
  }

  async create() {
    // Create background Spine object in the center
    const bg = this.add.spine(
      this.gameWidth / 2,
      this.gameHeight / 2,
      "CityStage",
      "CityStage-atlas"
    );
    bg.animationState.setAnimation(0, "animation", true);
    const scale = this.gameWidth / 1600;
    const scaleY = this.gameHeight / 600;
    bg.setScale(scale, scaleY);

    //Handle Sir Creation
    await this.createSelfPlayer();
    await this.createOpponentPlayer();
    this.setControlButton();
    this.setTimer();
    this.setJoyStickMovement();
    if (this.input?.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
    }
    // this.setCollision();
  }
  async createSelfPlayer() {
    return new Promise<void>(async (resolve, reject) => {
      try {
        this.miFrensPlayer = new MiFrensPlayer(this);
        await this.miFrensPlayer.initializePlayer(PlayerPosition.LeftPlayer);
        this.sirMifrenPlayer = await this.miFrensPlayer.createPlayer();
        console.log("Player : ", this.sirMifrenPlayer);
        resolve();
      } catch (error) {
        reject();
      }
    });
  }
  async createOpponentPlayer() {
    return new Promise<void>(async (resolve, reject) => {
      try {
        this.dogePlayer1 = new MiFrensPlayer(this);
        await this.dogePlayer1.initializePlayer(PlayerPosition.RightPlayer);
        let player = await this.dogePlayer1.createPlayer();
        resolve();
      } catch (error) {
        reject();
      }
    });
  }
  setCollision() {
    // Set up bounding boxes or hitboxes for each player
    // this.sirMifrenPlayer.setSize(50, 100).setOffset(25, 0); // Adjust based on your character's dimensions
    // this.dogePlayer.setSize(50, 100).setOffset(25, 0);
    // Enable physics on the Spine object
    this.physics.world.enable(this.sirMifrenPlayer);

    // Set the player to collide with world bounds
    this.sirMifrenPlayer.setCollideWorldBounds(true);
    // Optional: Enable world bounds to prevent players from moving off the screen
    // this.sirMifrenPlayer.setCollideWorldBounds(true);
    // this.dogePlayer.setCollideWorldBounds(true);

    this.punchHitboxPlayer = this.add.rectangle(0, 0, 50, 30, 0xff0000, 0.5);
    this.punchHitboxPlayer.setOrigin(0.5, 0.5);
    this.punchHitboxPlayer.setVisible(false); // Hidden by default
    this.physics.world.enable(this.punchHitboxPlayer);

    this.punchHitboxEnemy = this.add.rectangle(0, 0, 50, 30, 0xff0000, 0.5);
    this.punchHitboxEnemy.setOrigin(0.5, 0.5);
    this.punchHitboxEnemy.setVisible(false); // Hidden by default
    this.physics.world.enable(this.punchHitboxEnemy);

    // Detect overlap between players and their hitboxes
    this.physics.add.overlap(
      this.punchHitboxPlayer,
      this.dogePlayer,
      this.handleAttackHit,
      undefined,
      this
    );
    this.physics.add.overlap(
      this.punchHitboxEnemy,
      this.sirMifrenPlayer,
      this.handleAttackHit,
      undefined,
      this
    );
  }
  handleAttackHit(hitbox: any, enemy: any) {
    if (enemy === this.sirMifrenPlayer) {
      // Handle the case where the enemy player was hit
      console.log("SirMifrenPlayer hit by enemy!");
      this.sirMifrenPlayer.play("hit_reaction", true); // Trigger a hit reaction animation for the player
      // Handle damage (subtract health)
      this.sirMifrenPlayer.takeDamage(10); // Example damage function
    } else if (enemy === this.dogePlayer) {
      // Handle the case where the enemy player was hit
      console.log("EnemyPlayer hit by SirMifrenPlayer!");
      this.dogePlayer.play("hit_reaction", true); // Trigger a hit reaction animation for the enemy
      // Handle damage (subtract health)
      this.dogePlayer.takeDamage(10); // Example damage function
    }
  }

  setJoyStickMovement() {
    const joyStickPlugin = this.plugins.get(
      "rexVirtualJoystick"
    ) as VirtualJoyStickPlugin;
    let self = this;
    if (joyStickPlugin) {
      this.joystick = joyStickPlugin
        .add(this, {
          x: 100,
          y: this.screenHeight - 100,
          radius: 45,
          base: this.add.sprite(100, this.screenHeight - 100, "JoyStickBg"),
          thumb: this.add.sprite(
            100,
            this.screenHeight - 100,
            "JoyStickController"
          ),
          dir: "8dir", // 'up&down'|0|'left&right'|1|'4dir'|2|'8dir'|3
          // fixed: true,
          forceMin: 10,
          // enable: true
        })
        .on("update", (event: any) => {
          self.dumpJoyStickState();
        });
      this.setMovementButton();
      console.log("JoyStick : ", this.joystick);
    }
  }
  setMovementButton() {
    this.add.sprite(100, this.screenHeight - 145, "up");
    this.add.sprite(100, this.screenHeight - 65, "down");
    this.add.sprite(60, this.screenHeight - 105, "left");
    this.add.sprite(140, this.screenHeight - 105, "right");
    console.log("Set Up down Panel : ", this.joystick.base);
  }
  private dumpJoyStickState() {
    const cursorKeys = this.joystick.createCursorKeys();
    if (cursorKeys.up.isDown && cursorKeys.right.isDown) {
      this.cursors.up.isDown = true;
      this.cursors.right.isDown = true;
      this.cursors.down.isDown = false;
      this.cursors.left.isDown = false;
    } else if (cursorKeys.right.isDown && cursorKeys.down.isDown) {
      this.cursors.up.isDown = false;
      this.cursors.right.isDown = true;
      this.cursors.down.isDown = true;
      this.cursors.left.isDown = false;
    } else if (cursorKeys.down.isDown && cursorKeys.left.isDown) {
      this.cursors.up.isDown = false;
      this.cursors.right.isDown = false;
      this.cursors.down.isDown = true;
      this.cursors.left.isDown = true;
    } else if (cursorKeys.left.isDown && cursorKeys.up.isDown) {
      this.cursors.up.isDown = true;
      this.cursors.right.isDown = false;
      this.cursors.down.isDown = false;
      this.cursors.left.isDown = true;
    } else if (cursorKeys.up.isDown) {
      this.cursors.up.isDown = true;
      this.cursors.right.isDown = false;
      this.cursors.down.isDown = false;
      this.cursors.left.isDown = false;
    } else if (cursorKeys.right.isDown) {
      this.cursors.up.isDown = false;
      this.cursors.right.isDown = true;
      this.cursors.down.isDown = false;
      this.cursors.left.isDown = false;
    } else if (cursorKeys.down.isDown) {
      this.cursors.up.isDown = false;
      this.cursors.right.isDown = false;
      this.cursors.down.isDown = true;
      this.cursors.left.isDown = false;
    } else if (cursorKeys.left.isDown) {
      this.cursors.up.isDown = false;
      this.cursors.right.isDown = false;
      this.cursors.down.isDown = false;
      this.cursors.left.isDown = true;
    } else {
      this.cursors.up.isDown = false;
      this.cursors.right.isDown = false;
      this.cursors.down.isDown = false;
      this.cursors.left.isDown = false;
    }

    // var joystickValues = "Key down: ";
    // for (let name in cursorKeys) {
    //   if (cursorKeys[name].isDown) {
    //     joystickValues += name + ' '
    //   }
    // }

    // joystickValues +=
    //   '\nForce: ' +
    //   Math.floor(this.joystick.force * 100) / 100 +
    //   '\nAngle: ' +
    //   Math.floor(this.joystick.angle * 100) / 100

    // joystickValues += '\nTimestamp:\n'
    // for (let name in cursorKeys) {
    //   const key = cursorKeys[name]
    //   joystickValues += name + ': duration=' + key.duration / 1000 + '\n'
    // }
    //this.text.setText(joystickValues)
  }

  setControlButton() {
    this.createControl("hand", this.screenWidth - 100, this.screenHeight - 75);
    this.createControl("legs", this.screenWidth - 190, this.screenHeight - 60);
    this.createControl(
      "shield",
      this.screenWidth - 160,
      this.screenHeight - 130
    );
    this.createControl("fire", this.screenWidth - 85, this.screenHeight - 160);
    console.log("Create Control Called");
    // Optionally: create a background for the fight scene or player character
    // this.add.sprite(screenWidth / 2, screenHeight / 2, "background");

    // Player actions (these can be tied to animations or abilities)
    this.playerAction = {
      hand: () => this.performHandAction(),
      legs: () => this.performLegsAction(),
      shield: () => this.performShieldAction(),
      fire: () => this.performFireAction(),
    };
  }

  private createControl(texture: string, x: number, y: number) {
    const controlButton = this.add
      .sprite(x, y, texture)
      .setInteractive()
      .setOrigin(0.5, 0.5)
      .setScale(1); // Adjust scale if needed

    // Set up event for control button click (pointerdown)
    controlButton.on("pointerdown", () => {
      this.handleControlClick(texture); // Call the action handler on click
    });
  }

  // Handle the action when a control is clicked
  private handleControlClick(controlType: string) {
    if (this.playerAction[controlType as keyof typeof this.playerAction]) {
      this.playerAction[controlType as keyof typeof this.playerAction](); // Trigger the corresponding action
    }
  }

  // Action functions (can be expanded to trigger animations, effects, etc.)
  performHandAction() {
    console.log("Hand action triggered: Punch!");
    // Trigger punch animation or logic here
    let cursor = this.cursors;
    if (cursor.down.isDown) {
      this.playAnimationIfNotAnimating("low_punch", false);
    } else if (cursor.left.isDown) {
      this.playAnimationIfNotAnimating("combo_punch", false);
    } else if (cursor.up.isDown) {
      this.playAnimationIfNotAnimating("high_punch", false);
    } else {
      this.playAnimationIfNotAnimating("mid_punch", false);
    }
  }

  performLegsAction() {
    console.log("Legs action triggered: Kick!");
    // Trigger kick animation or logic here
    let cursor = this.cursors;
    if (cursor.down.isDown) {
      this.playAnimationIfNotAnimating("low_kick", false);
    } else if (cursor.left.isDown) {
      this.playAnimationIfNotAnimating("high_kick", false);
    } else if (cursor.up.isDown) {
      this.playAnimationIfNotAnimating("jump_kick", false);
    } else {
      this.playAnimationIfNotAnimating("mid_kick", false);
    }
  }

  performShieldAction() {
    console.log("Shield action triggered: Block!");
    // Trigger shield raise animation or logic here
    this.playAnimationIfNotAnimating("mid_block", false);
  }

  performFireAction() {
    console.log("Fire action triggered: Fire attack!");
    // Trigger fire animation or logic here
    this.playAnimationIfNotAnimating("weapon_attack", false);
  }
  update() {
    if (this.sirMifrenPlayer) {
      // Define movement speed
      const speed = 200;

      // Check for left/right arrow key input
      if (this.cursors.left.isDown) {
        this.sirMifrenPlayer.x -= (speed * this.game.loop.delta) / 1000; // Move left
      } else if (this.cursors.right.isDown) {
        this.sirMifrenPlayer.x += (speed * this.game.loop.delta) / 1000; // Move right
        this.playAnimationIfNotAnimating("walk_forward", false);
      }

      // Check for up/down arrow key input
      if (this.cursors.up.isDown) {
        this.playAnimationIfNotAnimating("jump_neutral", false);
      }
      // else if (this.cursors.down.isDown) {
      //   this.sirMifrenPlayer.y += speed * this.game.loop.delta / 1000;  // Move down
      // }

      // Optional: Clamp the player position to the screen boundaries
      this.sirMifrenPlayer.x = Phaser.Math.Clamp(
        this.sirMifrenPlayer.x,
        100,
        this.screenWidth - 100
      );
      this.sirMifrenPlayer.y = Phaser.Math.Clamp(
        this.sirMifrenPlayer.y,
        0,
        this.screenHeight
      );
    }
  }
  playAnimationIfNotAnimating(animationName: string, loop: boolean) {
    const track = this.sirMifrenPlayer.animationState.tracks[0];

    // If there is an active track, return its animation name
    if (track && track.animation) {
      //console.log("Current Animation : ", track.animation.name, track);
      // return track.animation.name;
    }
    if (!this.isAnimating) {
      this.isAnimating = true;
      this.sirMifrenPlayer.animationState.setAnimation(0, animationName, loop);

      // Listen for animation complete event to reset the flag
      this.sirMifrenPlayer.animationState.addListener({
        complete: (trackEntry: { animation: { name: string } }) => {
          if (trackEntry.animation.name === animationName) {
            this.sirMifrenPlayer.animationState.setAnimation(
              0,
              "idle_tension",
              true
            );
            // Animation has finished, allow new animations
            this.isAnimating = false;
          }
        },
      });
    }
  }

  setTimer() {
    try {
      let timeBg = this.add.sprite(this.screenWidth / 2, 30, "TimeBg");
      timeBg.setScale(1.2);
      const label = this.add.text(
        this.screenWidth / 2 - 25,
        timeBg.y - 10,
        "03:00", // The text content
        {
          fontSize: "20px", // Font size
          color: "#ffffff", // Font color (white in this case)
          fontFamily: "Arial", // Font family
          align: "center", // Text alignment
        }
      );
      let countdown = 180;
      this.time.addEvent({
        delay: 1000, // 1000 ms = 1 second
        callback: () => {
          countdown--; // Decrement the countdown by 1 second
          label.setText(this.formatTime(countdown)); // Update the label text with the new time in MM:SS format

          if (countdown <= 0) {
            label.setText("00:00"); // When the countdown reaches 0, show "Time's Up!"
            // You can stop the timer or trigger another event here if needed
          }
        },
        loop: true, // Keep looping this event every second
      });
    } catch (error) {}
  }
  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60); // Get the number of minutes
    const remainingSeconds = seconds % 60; // Get the remaining seconds

    // Format the minutes and seconds with leading zeros if needed
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(remainingSeconds).padStart(2, "0");

    // Return the formatted time as "MM:SS"
    return `${formattedMinutes}:${formattedSeconds}`;
  }
}
