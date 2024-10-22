import { Container, Sprite, spritesheetAsset, Texture } from "pixi.js";
import { SpinWheel } from "../spinwheel";
import { PrimaryBtn } from "../../../ui/buttons/primaryBtn";
import { app } from "../../../main";

export class Background extends Container {
  public static readonly SCREEN_ID = "Background"; // Required for navigation
  public static assetBundles = ["images/spin", "images/buttons"];

  private backgroundSprite: Sprite;
  private spinWheel: SpinWheel;
  private secondaryBtn: PrimaryBtn;
  private secondaryBtn1: PrimaryBtn;

  constructor() {
    super();
    const backgroundTexture = Texture.from("Background");
    this.backgroundSprite = new Sprite(backgroundTexture);
    this.backgroundSprite.anchor.set(0.5); // Center the background sprite
    this.backgroundSprite.scale.set(1); // Adjust as needed based on image size
    this.backgroundSprite.position.set(0, 0); // Centered position

    // secondaryBtn left side
    this.secondaryBtn = new PrimaryBtn({ text: "PLAY: 0" });
    this.secondaryBtn.x = app.view.width / 8 - 250;
    this.secondaryBtn.y = app.view.height / 2 - 150;
    this.secondaryBtn.scale.set(0.65, 0.7);

    // secondaryBtn right side
    this.secondaryBtn1 = new PrimaryBtn({ text: "WIN: 0" });

    this.secondaryBtn1.x = app.view.width / 8 + 50;
    this.secondaryBtn1.y = app.view.height / 2 - 150;
    this.secondaryBtn1.scale.set(0.65, 0.7);

    // Create and add the spin wheel
    this.spinWheel = new SpinWheel();

    this.addChild(this.backgroundSprite);
    this.addChild(this.spinWheel);
    this.addChild(this.secondaryBtn);
    this.addChild(this.secondaryBtn1);
  }

  public update(): void {
    if (this.spinWheel.update) {
      this.spinWheel.update();
    }
  }

  public resize(w: number, h: number): void {
    this.spinWheel.resize(w, h);
    // back-ground
    const backgroundScale = Math.max(
      w / this.backgroundSprite.texture.width,
      h / this.backgroundSprite.texture.height
    );
    this.backgroundSprite.scale.set(backgroundScale);
    this.backgroundSprite.position.set(w / 2, h / 2);

    // spin-wheel

    const margin = w * 0.2; // 20%

    // desktop
    this.spinWheel.position.set(margin, h / 2 - 100);

    // secondaryBtn
    this.secondaryBtn.x = app.view.width / 8 - 250;
    this.secondaryBtn.y = app.view.height / 2 - 150;

    // secondaryBtn1
    this.secondaryBtn1.x = app.view.width / 8 + 50;
    this.secondaryBtn1.y = app.view.height / 2 - 150;
  }
}
