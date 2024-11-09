import * as Phaser from 'phaser';

declare module 'phaser' {
  interface Scene {
    rexVirtualJoystick: any;
  }
}