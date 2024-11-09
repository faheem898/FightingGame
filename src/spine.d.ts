declare module "spine-phaser" {
    import { Plugin } from 'phaser';
    export class SpinePlugin extends Plugin {
        constructor(scene: Phaser.Scene);
    }
}