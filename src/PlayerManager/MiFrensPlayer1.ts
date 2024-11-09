// Player.js

import { PlayerPosition } from "../Constant/GameConstant";
import { GameModel } from "../Constant/GameModel1";
import FightScene from "../scenes/FightScene";

class MiFrensPlayer {
  gameManager!: FightScene;
  progressBarBase!: Phaser.GameObjects.Sprite;
  progressBarFill!: Phaser.GameObjects.Sprite;
  healthProgressText!: Phaser.GameObjects.Text;
  wagerAmountText!: Phaser.GameObjects.Text;
  player: any;
  currentProgressCount: number = 300;
  totalProgressCount: number = 300;
  wagerAmount: number = 3000;
  screenWidth: number = 0;
  screenHeight: number = 0;
  _selectedIcon: string = "Player/Icon1";
  _selectedIconIndicator: string = "Player/LeftIconIndicator";
  _playerPosition: number = PlayerPosition.LeftPlayer;
  _playeName: string = "Faheem";
  //   _selectedIcon: string = "Icon";
  constructor(gameManager: FightScene) {
    this.gameManager = gameManager;
    this.screenWidth = this.gameManager.screenWidth;
    this.screenHeight = this.gameManager.screenHeight;
  }
  async initializePlayer(_playerPosition: PlayerPosition) {
    return new Promise<void>((resolve, reject) => {
      try {
        console.log("Initialize Player ",_playerPosition)
        this._playerPosition = _playerPosition;
        this.setPlayerHealthProgress();
        this.setPlayerNamePanel();
        resolve()
      } catch (error) {
        reject();
      }
    });
  }
  async createPlayer() {
    return new Promise<void>((resolve, reject) => {
      try {
        console.log("Player Createdd", this._playerPosition);
        let _posDiff = -1;
        if (this._playerPosition === PlayerPosition.RightPlayer) {
          _posDiff = 1;
        }
        this.player = this.gameManager.add.spine(
          this.screenWidth / 2 + 200 * _posDiff,
          this.screenHeight - 25,
          "Sirmifren",
          "Sirmifren-atlas"
        );
        this.player.animationState.setAnimation(0, "idle", true);
        //this.dogePlayer.animationState.setAnimation(0, "idle", true);
        this.player.setOrigin(0.5, 0.5);
        const scaleFactor = (this.screenHeight / 2 / (this.player.height * 0.75));
        // Apply the scale factor to the player
        this.player.setScale(scaleFactor);
        this.player.scaleX=-1*_posDiff
        resolve(this.player);
      } catch (error) {
        reject();
      }
    });
  }

  setPlayerHealthProgress() {
    try {
      let _posDiff = -1;
      //   this._playerPosition = PlayerPosition.RightPlayer;
      if (this._playerPosition === PlayerPosition.RightPlayer) {
        _posDiff = 1;
      }
      this.progressBarBase = this.gameManager.add.sprite(
        this.screenWidth / 2 + 200 * _posDiff,
        35,
        "EmptyBar"
      );
      this.progressBarBase.setOrigin(0.5, 0.5);
      this.progressBarBase.setDisplaySize(325, 11); // Set the size of the background bar
      this.progressBarFill = this.gameManager.add.sprite(
        this.screenWidth / 2 + 200 * _posDiff,
        35,
        "FilledBar"
      );
      this.progressBarFill.setOrigin(0.5, 0.5); // Set the origin to the left side for scaling
      this.progressBarFill.setDisplaySize(325, 11); // Initially set the width to 0 (empty)
      let progresstextwidth =
        this._playerPosition === PlayerPosition.RightPlayer ? 55 : 115;
      this.healthProgressText = this.gameManager.add.text(
        this.screenWidth / 2 + progresstextwidth * _posDiff,
        15,
        `${this.currentProgressCount}/${this.currentProgressCount}`, // The text content
        {
          fontSize: "15px", // Font size
          color: "#ffffff", // Font color (white in this case)
          fontFamily: "Arial", // Font family
          align: "center", // Text alignment
        }
      );
      this.progressBarFill.scaleX = 1 * _posDiff;
      this.progressBarBase.scaleX = 1 * _posDiff;
      this.healthProgressText.setOrigin(0, 0);
    } catch (error) {}
  }

  setPlayerNamePanel() {
    try {
      let _selectedIconIndicator = "PlayerUI/LeftIconIndicator";
      let _selectedIcon = "PlayerUI/Icon1";
      let _selectedBlockChain = "PlayerUI/Blockchain";
      let _wagerBG = "PlayerUI/PlayerBg";
      let _coin = "PlayerUI/coin";

      let _posDiff = -1;
      // this._playerPosition = PlayerPosition.RightPlayer
      if (this._playerPosition === PlayerPosition.RightPlayer) {
        _selectedIconIndicator = "PlayerUI/LeftIconIndicator";
        _selectedIcon = "PlayerUI/Icon2";
        _posDiff = 1;
      }
      let PlayerIcon = this.gameManager.add.sprite(
        this.progressBarBase.x + 165 * _posDiff,
        40,
        _selectedIcon
      );
      let playeNameBg = this.gameManager.add.sprite(
        PlayerIcon.x - 54 * _posDiff,
        PlayerIcon.y - 18,
        "PlayerUI/PlayerNameBg"
      );
      playeNameBg.scaleX = -1 * _posDiff;
      const playerName = this.gameManager.add.text(
        playeNameBg.x,
        playeNameBg.y,
        this._playeName, // The text content
        {
          fontSize: "10px", // Font size
          color: "#ffffff", // Font color (white in this case)
          fontFamily: "Arial", // Font family
          align: "center", // Text alignment
        }
      );
      playerName.setOrigin(0.5, 0.5);
      let wagerBG = this.gameManager.add.sprite(
        PlayerIcon.x - (PlayerIcon.width + 7) * _posDiff,
        PlayerIcon.height,
        _wagerBG
      );
      let coinBg = this.gameManager.add.sprite(
        wagerBG.x - 20,
        wagerBG.y,
        _coin
      );
      this.wagerAmountText = this.gameManager.add.text(
        wagerBG.x - 10,
        wagerBG.y - 8,
        `${this.wagerAmount}`, // The text content
        {
          fontSize: "15px", // Font size
          color: "#ffffff", // Font color (white in this case)
          fontFamily: "Arial", // Font family
          align: "center", // Text alignment
        }
      );
      wagerBG.scaleX = -1 * _posDiff;
      let blockChain = this.gameManager.add.sprite(
        PlayerIcon.x - (PlayerIcon.width / 2.5) * _posDiff,
        PlayerIcon.height + 10,
        _selectedBlockChain
      );
    } catch (error) {
      console.log("SetPlayer Data : ", error);
    }
  }

  setUserData() {
    try {
      //this.wagerAmountText.s
    } catch (error) {}
  }
}

export default MiFrensPlayer;
