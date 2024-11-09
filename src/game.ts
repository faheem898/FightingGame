import Phaser from "phaser";
import { SpinePlugin } from "@esotericsoftware/spine-phaser";
import VirtualJoystickPlugin from "phaser3-rex-plugins/plugins/virtualjoystick-plugin.js";
import Scene1 from "./scenes/Scene1";
import Scene2 from "./scenes/Scene2";
import FightSceneSplash from "./scenes/FightSceneSplash";
import FightScene from "./scenes/FightScene";
const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: 0x000000,
  scene: [FightSceneSplash, FightScene, Scene1, Scene2],
  pixelArt: true,
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  plugins: {
    scene: [
      { key: "spine.SpinePlugin", 
        plugin: SpinePlugin, 
        mapping: "spine" },
    ],
    global: [
      {
        key: 'rexVirtualJoystick',
        plugin: VirtualJoystickPlugin,
        start: true
      }
    ]
  },
  physics: {
    default: 'arcade', // make sure 'arcade' is set as the default physics system
    arcade: {
      //gravity: { y: 0 }, // disable gravity if needed
      debug: false // optional, enable for physics debugging
    }
  }
};

const game = new Phaser.Game(config);
