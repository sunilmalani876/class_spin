import gsap from "gsap";
import {
  Container,
  FederatedPointerEvent,
  Graphics,
  Rectangle,
  TilingSprite,
} from "pixi.js";
import { PrimaryButton } from "../../ui/buttons/PrimaryButton";
import { i18n } from "../../utils/I18n";
import { AppScreen, navigation } from "../../navigation";
import { storage } from "../../stroage";
import { boardConfig, randomType } from "../../systems/boardConfig";
import { Title } from "../../ui/Title";
import { Cannon } from "../entities/Cannon";

/** The screen presented at the start, after loading. */
/** The screen presented at the start, after loading. */
// export class TitleScreen extends Container {
//   /** A unique identifier for the screen */
//   public static SCREEN_ID = "title";
//   public static assetBundles = ["images/title-screen"];

//   private _playBtn!: PrimaryButton;
//   private _bottomAnimContainer = new Container();

//   constructor() {
//     super();
//     // Add buttons like the play button
//     this._buildButtons();
//     this.addChild(this._bottomAnimContainer);
//   }

//   /** Called before `show` function, can receive `data` */
//   public prepare() {
//     gsap.set(this._bottomAnimContainer, { y: 350 });
//   }

//   /** Called when the screen is being shown. */
//   public async show() {
//     gsap.killTweensOf(this);
//     this.alpha = 0;
//     await gsap.to(this, { alpha: 1, duration: 0.2, ease: "linear" });
//     const endData = {
//       y: 0,
//       duration: 0.75,
//       ease: "elastic.out(1, 0.5)",
//     };
//     gsap.to(this._bottomAnimContainer, endData);
//   }

//   /** Called when the screen is being hidden. */
//   public async hide() {
//     gsap.killTweensOf(this);
//     await gsap.to(this, { alpha: 0, duration: 0.2, ease: "linear" });
//   }

//   /**
//    * Gets called every time the screen resizes.
//    * @param w - width of the screen.
//    * @param h - height of the screen.
//    */
//   public resize(w: number, h: number) {
//     this._playBtn.x = w * 0.5;
//     this._playBtn.y = h * 0.5;
//   }

//   /** Add the play button to the screen. */
//   private _buildButtons() {
//     this._playBtn = new PrimaryButton({
//       text: i18n.t("titlePlay"),
//     });

//     this._playBtn.onPress.connect(() => {
//       console.log("play");
//       //   navigation.goToScreen(GameScreen);
//     });

//     this._bottomAnimContainer.addChild(this._playBtn);
//   }
// }

export class TitleScreen extends Container implements AppScreen {
  /** A unique identifier for the screen */
  public static SCREEN_ID = "title";
  /** An array of bundle IDs for dynamic asset loading. */
  public static assetBundles = ["images/title-screen"];

  /** A container to assign user interaction to */
  private readonly _hitContainer = new Container();
  /** The hit area to be used by the cannon */
  //   private readonly _hitArea: Rectangle;
  //   /** A background visual element */
  //   private readonly _background: TilingSprite;

  private _title!: Title;
  //   private _pixiLogo!: PixiLogo;
  private _cannon!: Cannon;
  private _footer!: Graphics;
  private _forkBtn!: PrimaryButton;
  private _playBtn!: PrimaryButton;
  //   private _audioBtn!: AudioButton;
  /** An animated background decor instance */
  //   private _portholeOne!: Porthole;
  /** An animated background decor instance */
  //   private _portholeTwo!: Porthole;
  /** The angle of the cannon aim relative to the mouse position */
  private _aimAngle!: number;
  /** A container to group visual elements for easier animation */
  private _topAnimContainer = new Container();
  /** A container to group visual elements for easier animation */
  private _midAnimContainer = new Container();
  /** A container to group visual elements for easier animation */
  private _bottomAnimContainer = new Container();

  constructor() {
    super();

    // // Create the background
    // this._background = new TilingSprite(Texture.from('background-tile'), 64, 64);
    // this._background.tileScale.set(designConfig.backgroundTileScale);
    // this._background.interactive = true;
    // this.addChild(this._background);

    // Create the hit area
    // this._hitArea = new Rectangle();

    // Prepare the container for interaction
    // this._hitContainer.interactive = true;
    // this._hitContainer.hitArea = this._hitArea;
    // this.addChild(this._hitContainer);

    // Add visual details like footer, cannon, portholes
    // this._buildDetails();

    // Add buttons like the play button and audio button
    this._buildButtons();

    // Add all parent containers to screen
    this.addChild(
      this._topAnimContainer,
      this._midAnimContainer,
      this._bottomAnimContainer
    );
  }

  /** Called before `show` function, can receive `data` */
  public prepare() {
    // Reset the animations of the portholes
    // this._portholeOne.stop();
    // this._portholeTwo.stop();

    // Reset the positions of the group containers
    gsap.set(this._topAnimContainer, { y: -350 });
    gsap.set(this._midAnimContainer, { x: 200 });
    gsap.set(this._bottomAnimContainer, { y: 350 });
  }

  /** Called when the screen is being shown. */
  public async show() {
    // Add container event listeners to handle the cannon movement
    this._hitContainer.on("pointermove", this._calculateAngle.bind(this));
    this._hitContainer.on("pointertap", this._calculateAngle.bind(this));

    // Kill tweens of the screen container
    gsap.killTweensOf(this);

    // Reset screen data
    this.alpha = 0;

    // Starts the animations for the background porthole details
    // this._portholeOne.start();
    // this._portholeTwo.start();

    // Force the audio button to change icon based on audio mute state
    // this._audioBtn.forceSwitch(storage.getStorageItem("muted"));

    // Tween screen into being visible
    await gsap.to(this, { alpha: 1, duration: 0.2, ease: "linear" });

    // The data to be used in the upcoming tweens
    const endData = {
      x: 0,
      y: 0,
      duration: 0.75,
      ease: "elastic.out(1, 0.5)",
    };

    // Tween the containers back to their original position
    gsap.to(this._topAnimContainer, endData);
    gsap.to(this._midAnimContainer, endData);
    gsap.to(this._bottomAnimContainer, endData);
  }

  /** Called when the screen is being hidden. */
  public async hide() {
    // Remove all listeners on the hit container so they don't get triggered outside of the title screen
    this._hitContainer.removeAllListeners();

    // Kill tweens of the screen container
    gsap.killTweensOf(this);

    // Tween screen into being invisible
    await gsap.to(this, { alpha: 0, duration: 0.2, ease: "linear" });

    // Stop portholes to prevent them from animating when not on screen
    // this._portholeOne.stop();
    // this._portholeTwo.stop();
  }

  /**
   * Gets called every time the screen resizes.
   * @param w - width of the screen.
   * @param h - height of the screen.
   */
  public resize(w: number, h: number) {
    // Fit background to screen
    // this._background.width = w;
    // this._background.height = h;

    // Set visuals to their respective locations

    this._playBtn.x = w * 0.5;
    this._playBtn.y = h / 2 - this._playBtn.height / 2 + 10;
  }

  /**
   * Calculate the angle between the cannon and the user's pointer position.
   * @param e - The event data sent from the event listener.
   */
  private _calculateAngle(e: FederatedPointerEvent) {
    // Get global cannon position and calculate the angle in radians using the global mouse position
    const globalPos = this._cannon.view.getGlobalPosition();
    const angleRadians = Math.atan2(
      e.global.y - globalPos.y,
      e.global.x - globalPos.x
    );

    // Checks if the cannon has rotated enough to warrant an audio response
    // this prevents audio spam on minor movement
    if (Math.abs(this._aimAngle - angleRadians) > Math.PI * 0.0002) {
      // Attempt to play audio, the throttle will prevent audio spam
      // Can only play audio every N milliseconds
      //   throttle("cannon-audio", 150, () => {
      //     sfx.play("audio/cannon-move.wav", {
      //       volume: 0.2,
      //     });
      //   });
    }

    // Assign cannon rotation based on calculated angle, plus rotational offset
    this._aimAngle = angleRadians;
    this._cannon.rotation = angleRadians + Math.PI * 0.5;
  }

  /** Add visual details to title screen. */
  private _buildDetails() {
    // Add the title card
    // this._title = new Title();
    // this._topAnimContainer.addChild(this._title.view);

    // Get random type of bubble
    const type = randomType();

    // Use the type to assign a colour
    // this._footer = new Graphics()
    //     .beginFill(boardConfig.bubbleTypeToColor[type])
    //     .drawEllipse(0, 0, 300, 125);
    // this._bottomAnimContainer.addChild(this._footer);

    // this._cannon = new Cannon();
    // this._cannon.view.scale.set(0.75);
    // this._cannon.type = type;
    // this._bottomAnimContainer.addChild(this._cannon.view);

    // this._pixiLogo = new PixiLogo();
    // this._pixiLogo.view.scale.set(0.35);
    // this._bottomAnimContainer.addChild(this._pixiLogo.view);

    // this._portholeOne = new Porthole();
    // this._topAnimContainer.addChild(this._portholeOne.view);

    // this._portholeTwo = new Porthole();
    // this._midAnimContainer.addChild(this._portholeTwo.view);
  }

  /** Add buttons to screen. */
  private _buildButtons() {
    this._forkBtn = new PrimaryButton({
      text: i18n.t("forkGithub"),
      textStyle: {
        fill: 0xe91e63,
        fontFamily: "Opensans Semibold",
        fontWeight: "bold",
        align: "center",
        fontSize: 16,
      },
      buttonOptions: {
        defaultView: "pixi-btn-up",
        pressedView: "pixi-btn-down",
        textOffset: {
          default: {
            y: -13,
          },
          pressed: {
            y: -8,
          },
        },
      },
    });

    // this._forkBtn.onPress.connect(() => {
    //     window.open(designConfig.forkMeURL, '_blank')?.focus();
    // });

    // this._bottomAnimContainer.addChild(this._forkBtn);

    // this._audioBtn = new AudioButton();
    // this._topAnimContainer.addChild(this._audioBtn);

    this._playBtn = new PrimaryButton({
      text: i18n.t("titlePlay"),
    });

    this._playBtn.onPress.connect(() => {
      // Go to game screen when user presses play button
      // navigation.goToScreen(GameScreen);
      console.log("play");
    });

    this._bottomAnimContainer.addChild(this._playBtn);
  }
}
