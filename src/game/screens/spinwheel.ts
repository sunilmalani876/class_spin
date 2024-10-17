import {
  Container,
  Graphics,
  Sprite,
  spritesheetAsset,
  Texture,
} from "pixi.js";
import { AppScreen } from "../../navigation";

interface WheelSlice {
  label: string;
  angle: number;
}

export class SpinWheel extends Container implements AppScreen<string[]> {
  public static readonly SCREEN_ID = "SpinWheel"; // Required for navigation
  public static assetBundles = ["images/spin"];
  // public static assetBundles1 = ["images/number"];
  private spinWheel: Sprite;
  public spinContainer: Container;
  private sliceLines: Graphics;
  private sliceSprites: Sprite[] = []; // To store the number sprites

  private sliceDegMap = {
    slice_0: 18,
    slice_1: 54,
    slice_2: 90,
    slice_3: 126,
    slice_4: 162,
    slice_5: 198,
    slice_6: 234,
    slice_7: 270,
    slice_8: 306,
    slice_9: 342,
  };

  constructor() {
    super();
    this.spinContainer = new Container();
    this.sliceLines = new Graphics(); // For drawing the slice lines

    // Load the wheel texture
    this.spinWheel = new Sprite(Texture.from("spinBack"));
    if (!this.spinWheel.texture.valid) {
      this.spinWheel.texture.on("update", () => {
        this.setupWheel();
      });
    } else {
      this.setupWheel();
    }

    this.spinContainer.addChild(this.spinWheel);
    this.addChild(this.spinContainer);
    this.addChild(this.sliceLines); // Add the graphics for slice lines to the container
  }

  // Method to set up and center the wheel
  private setupWheel(): void {
    this.spinWheel.anchor.set(0.5); // Center the wheel sprite
    this.spinWheel.scale.set(0.7, 0.7);
    this.spinWheel.x = 0;
    this.spinWheel.y = 0;

    this.drawSlices(); // Draw the slices after the wheel is set up
  }

  // Method to draw lines for each slice
  private drawSlices(): void {
    const numSlices = 10;
    const sliceAngle = 360 / numSlices;
    const radius = this.spinWheel.width / 2; // Use the radius of the wheel
    const numberSpriteOffset = 0.75;
    // console.log(radius)

    // ANCHOR PART FOR WHEEL
    const anchorTexture = Texture.from("Anchor");
    const anchorSprite = new Sprite(anchorTexture);
    anchorSprite.anchor.set(0.5); // Center the anchorSprite
    anchorSprite.scale.set(0.7); // Center the anchorSprite
    anchorSprite.rotation = 0;
    this.sliceLines.addChild(anchorSprite);

    // SPIN-STAND PART FOR WHEEL
    // for spinStand_2 image y=24 && spinStand y=34
    // also you can use sliceLines container || spinContainer container adjest for accourding to spin animation
    const spinStandTexture = Texture.from("spinStand_2");
    const spinStandSprite = new Sprite(spinStandTexture);
    spinStandSprite.anchor.set(0.5); // Center the spinStandSprite
    spinStandSprite.scale.set(0.75);
    spinStandSprite.y = 24;
    this.sliceLines.addChild(spinStandSprite);

    // Start with a clean Graphics object
    this.sliceLines.clear();
    this.sliceLines.lineStyle(1, 0xffffff, 1); // Set line color (white) and thickness

    for (let i = 0; i < numSlices; i++) {
      const angle = i * sliceAngle * (Math.PI / 180); // Convert degrees to radians

      // Calculate the end point of the line based on the radius and angle
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);

      // Draw the line from the center to the edge of the wheel
      this.sliceLines.moveTo(0, 0); // Start from the center of the wheel
      this.sliceLines.lineTo(x, y); // Draw the line to the calculated point

      const texture = Texture.from(`num_${i}`);

      const sprite = new Sprite(texture);
      sprite.anchor.set(0.5); // Center the sprite
      sprite.scale.set(0.7); // Center the sprite

      const numberSpriteAngle =
        (i * sliceAngle + sliceAngle / 2) * (Math.PI / 180);

      const NumSpriteX =
        radius * numberSpriteOffset * Math.cos(numberSpriteAngle);
      const NumSpriteY =
        radius * numberSpriteOffset * Math.sin(numberSpriteAngle);

      sprite.position.set(NumSpriteX, NumSpriteY);

      this.sliceLines.addChild(sprite);
    }
  }

  public async show(): Promise<void> {
    // Add animations if necessary
  }

  // Optional: Clean up resources when hiding the screen
  public async hide(): Promise<void> {
    // Clean up animations or resources
  }

  // Handle resizing of the screen
  public resize(w: number, h: number): void {
    this.position.set(w / 2, h / 2); // Center the wheel
  }
}
