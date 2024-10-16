/* eslint-disable @typescript-eslint/no-unused-vars */
import { Container, Sprite, Texture, TilingSprite } from "pixi.js";
import { designConfig } from "../designConfig";
import { Cannon } from "../entities/Cannon";

/** The default load screen for the game. */
export class LoadScreen extends Container {
  /** A unique identifier for the screen */
  public static SCREEN_ID = "looader";

  /** An array of bundle IDs for dynamic asset loading. */
  public static assetBundles = ["images/preload"];

  private readonly _background: TilingSprite;
  private readonly _spinner: Sprite;
  private readonly _cannon!: Cannon;
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
  }

  /** Called when the screen is being shown. */
  public async show() {
    console.log("show function in loading screen...");
  }

  /** Called when the screen is being hidden. */
  public async hidden() {
    console.log("hidden function in loading screen...");
  }

  /**
   * Called every frame
   * @param delta - The time elapsed since the last update.
   */
  public update(delta: number) {
    console.log("update function in loading screen...");
  }

  public resize(w: number, h: number) {
    console.log("resize function in loading screen...");
    // Fit background to screen
    this._background.width = w;
    this._background.height = h;
  }
}
