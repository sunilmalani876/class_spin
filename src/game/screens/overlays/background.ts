import { Container, Sprite, Texture } from "pixi.js";
import { app } from "../../../main";
import { PrimaryBtn } from "../../../ui/buttons/primaryBtn";
import { SpinWheel } from "../spinwheel";

export class Background extends Container {
  public static readonly SCREEN_ID = "Background"; // Required for navigation
  public static assetBundles = ["images/spin", "images/buttons"];

  private backgroundSprite: Sprite;
  private spinWheel: SpinWheel;
  private secondaryBtn: PrimaryBtn;
  private secondaryBtn1: PrimaryBtn;
  private playBtn: PrimaryBtn;

  constructor() {
    super();

    this.spinWheel = new SpinWheel();

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

    this.playBtn = new PrimaryBtn({ text: "SPIN" });
    this.playBtn.x = app.view.width / 2;
    this.playBtn.y = app.view.height / 2;
    this.playBtn.scale.set(0.65, 0.7);
    this.playBtn.cursor = "pointer";
    this.playBtn.interactive = true;
    // @ts-ignore
    this.playBtn.buttonMode = true;

    this.playBtn.on("pointerdown", () => {
      console.log("click");
      if (!this.spinWheel.rotating) {
        this.spinWheel.startSpin();
      }
    });

    // Create and add the spin wheel

    this.addChild(this.backgroundSprite);
    this.addChild(this.spinWheel);
    this.addChild(this.playBtn);
    // this.addChild(this.secondaryBtn);
    // this.addChild(this.secondaryBtn1);
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

    this.spinWheel.position.set(w / 2, h / 2 - 100);

    // secondaryBtn
    this.playBtn.x = w / 2;
    this.playBtn.y = h - 150;

    // secondaryBtn
    this.secondaryBtn.x = app.view.width / 8 - 250;
    this.secondaryBtn.y = app.view.height / 2 - 150;

    // secondaryBtn1
    this.secondaryBtn1.x = app.view.width / 8 + 50;
    this.secondaryBtn1.y = app.view.height / 2 - 150;
  }
}
