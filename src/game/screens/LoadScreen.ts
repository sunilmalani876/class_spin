import { Container, Sprite, Texture, TilingSprite } from "pixi.js";
import { designConfig } from "../designConfig";
import gsap from "gsap";
import { lerp } from "../../utils/maths";
import { randomRange } from "../../utils/rand";
import { Cannon } from "../entities/Cannon";
import { randomType } from "../../systems/boardConfig";

/** The default load screen for the game. */
export class LoadScreen extends Container {
  /** A unique identifier for the screen */
  public static SCREEN_ID = "looader";

  /** An array of bundle IDs for dynamic asset loading. */
  public static assetBundles = ["images/preload"];

  private readonly _background: TilingSprite;
  private readonly _spinner: Sprite;
  private readonly _cannon: Cannon;
  // private readonly _pixiLogo: PixiLogo;

  /** An added container to animate the pixi logo off screen. */
  private _bottomContainer = new Container();

  /** An rotational offset that gets randomised. */
  private _targetOffset = 0;

  private _tick = 0;

  constructor() {
    super();

    // Create the visual aspects of the load screen
    this._background = new TilingSprite(
      Texture.from("background-tile"),
      64,
      64
    );
    this._background.tileScale.set(designConfig.backgroundTileScale);
    this.addChild(this._background);

    this._spinner = Sprite.from("loading-circle");
    this._spinner.anchor.set(0.5);
    this.addChild(this._spinner);

    this._cannon = new Cannon();
    this._cannon.view.scale.set(0.5);
    this._cannon.type = randomType();
    this.addChild(this._cannon.view);
  }

  /** Called when the screen is being shown. */
  public async show() {
    console.log("show function in loading screen...");
    // Kill tweens of the screen container
    gsap.killTweensOf(this);

    // Reset screen data
    this.alpha = 0;
    this._bottomContainer.y = 0;

    // // Tween screen into being visible
    await gsap.to(this, { alpha: 1, duration: 0.2, ease: "linear" });
  }

  /** Called when the screen is being hidden. */
  public async hidden() {
    console.log("hidden function in loading screen...");
    // Kill tweens of the screen container
    gsap.killTweensOf(this);

    // Hide pixi logo off screen
    await gsap.to(this._bottomContainer, {
      y: 100,
      duration: 0.25,
    });

    // Tween screen into being invisible
    await gsap.to(this, {
      alpha: 0,
      delay: 0.1,
      duration: 0.2,
      ease: "linear",
    });
  }

  /**
   * Called every frame
   * @param delta - The time elapsed since the last update.
   */
  public update(delta: number) {
    console.log("update function in loading screen...");
    // Rotate spinner
    this._spinner.rotation -= delta / 60;

    // Lerp the rotations of the cannon to the spinner rotation but with an offset
    this._cannon.rotation = lerp(
      this._cannon.rotation,
      this._spinner.rotation - this._targetOffset,
      0.1
    );

    // When tick is zero, randomise aforementioned offset
    if (this._tick <= 0) {
      this._targetOffset = randomRange(Math.PI * 0.2, Math.PI * 0.5);
      this._tick = 1;
    } else {
      // Decremented every frame using delta time
      this._tick -= delta / 60;
    }
  }

  public resize(w: number, h: number) {
    console.log("resize function in loading screen...");
    // Fit background to screen
    this._background.width = w;
    this._background.height = h;

    // Set visuals to their respective locations
    this._spinner.x = this._cannon.view.x = w * 0.5;
    this._spinner.y = this._cannon.view.y = h * 0.5;

    // this._pixiLogo.view.x = w * 0.5;
    // this._pixiLogo.view.y = h - 55;
  }
}
