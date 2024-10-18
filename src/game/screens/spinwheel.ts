import { Container, Graphics, Sprite, Text, TextStyle, Texture } from "pixi.js";
import { AppScreen } from "../../navigation";

export class SpinWheel extends Container implements AppScreen<string[]> {
  public static readonly SCREEN_ID = "SpinWheel"; // Required for navigation
  public static assetBundles = ["images/spin"];
  private spinWheel: Sprite;
  public spinContainer: Container;
  public sliceLines: Graphics;
  public numberSpritesContainer: Container;
  private sliceContainer: Container; // New container for holding sprites
  public sliceSprites: Sprite[] = []; // To store the number sprites
  // @ts-ignore
  private anchorPointer: Graphics; // Anchor pointer to indicate direction
  // @ts-ignore
  private spinButton: Text;

  // Properties for spinning logic
  private rotating: boolean = false;
  private stopping: boolean = false;
  private targetAngle: number = 0;
  private spinSpeed: number = 20; // Initial spin speed
  private currentSpeed: number = 0; // Current speed during spin

  constructor() {
    super();
    this.spinContainer = new Container();
    this.sliceLines = new Graphics(); // For drawing the slice lines
    this.numberSpritesContainer = new Container(); // New container for number sprites
    this.sliceContainer = new Container(); // New container for number sprites

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
    this.spinContainer.addChild(this.sliceLines);
    this.spinContainer.addChild(this.sliceContainer);
    this.spinContainer.addChild(this.numberSpritesContainer); // Add the number sprites container

    this.addChild(this.spinContainer);

    // Create the anchor pointer
    this.createAnchorPointer();

    // Create and add the spin button
    this.createSpinButton();
  }

  // Method to set up and center the wheel
  private setupWheel(): void {
    this.spinWheel.anchor.set(0.5); // Center the wheel sprite
    this.spinWheel.scale.set(0.7, 0.7);
    this.spinWheel.x = 0;
    this.spinWheel.y = 0;

    this.drawSlices(); // Draw the slices after the wheel is set up
  }

  // Method to create the anchor pointer
  private createAnchorPointer(): void {
    this.anchorPointer = new Graphics();
    this.anchorPointer.beginFill(0xff0000); // Red color for the pointer
    this.anchorPointer.drawPolygon([
      -10,
      0, // Left corner
      10,
      0, // Right corner
      0,
      -20, // Top point (triangle)
    ]);
    this.anchorPointer.endFill();

    this.anchorPointer.position.set(0, -this.spinWheel.height / 2 - 10); // Position above the wheel
    // this.addChild(this.anchorPointer); // Add the anchor pointer to the stage
  }

  // Method to draw lines for each slice
  private drawSlices(): void {
    const numSlices = 10;
    const sliceAngle = 360 / numSlices;
    const radius = this.spinWheel.width / 2; // Use the radius of the wheel
    const numberSpriteOffset = 0.75;

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
      sprite.scale.set(0.7); // Scale the sprite

      const numberSpriteAngle =
        (i * sliceAngle + sliceAngle / 2) * (Math.PI / 180);

      const NumSpriteX =
        radius * numberSpriteOffset * Math.cos(numberSpriteAngle);
      const NumSpriteY =
        radius * numberSpriteOffset * Math.sin(numberSpriteAngle);

      sprite.position.set(NumSpriteX, NumSpriteY);
      this.sliceContainer.addChild(sprite);
      this.sliceSprites.push(sprite);
    }
  }

  // Method to create the spin button
  private createSpinButton(): void {
    const buttonStyle = new TextStyle({
      fontFamily: "Arial",
      fontSize: 32,
      fill: 0xffffff,
      stroke: 0x000000,
      strokeThickness: 4,
    });

    this.spinButton = new Text("Spin", buttonStyle);
    this.spinButton.anchor.set(0.5); // Center the button
    this.spinButton.position.set(0, this.spinWheel.height / 2 + 50); // Position below the wheel

    this.spinButton.interactive = true;
    // @ts-ignore
    this.spinButton.buttonMode = true;

    // Add a click event listener to the button
    this.spinButton.on("pointerdown", () => {
      this.spinToSlice("num_0"); // Start spinning to a target slice (example: "num_3")
    });

    this.addChild(this.spinButton); // Add the button to the stage
  }

  // Method to start spinning to a target slice
  public spinToSlice(targetText: string): void {
    const targetSlice = this.sliceSprites.find(
      (sprite) => sprite.texture.textureCacheIds[0] === targetText
    );
    if (targetSlice) {
      const randomSpins = Math.floor(Math.random() * 4 + 3); // Random spins between 3 and 6
      const targetIndex = this.sliceSprites.indexOf(targetSlice);
      const targetAngle = (targetIndex / this.sliceSprites.length) * 360 * 9;

      // ALWASY ADJEST targetAngle
      console.log("targetIndex", targetIndex, "targetAngle", targetAngle);

      this.targetAngle = randomSpins * 360 + targetAngle - 18;
      this.spinSpeed = 20; // Initial spin speed
      this.currentSpeed = this.spinSpeed; // Set current speed for smooth control
      this.rotating = true; // Start rotating
      this.stopping = true; // Indicate that we want to stop
    } else {
      console.error(`No slice found with label: ${targetText}`);
    }
  }

  // Method to update the wheel's rotation each frame
  public update(): void {
    if (this.rotating) {
      this.spinContainer.rotation += this.currentSpeed * (Math.PI / 180); // Convert degrees to radians
      if (this.stopping) {
        if (this.currentSpeed > 0.5) {
          this.currentSpeed *= 0.98; // Gradually slow down
        } else {
          const currentRotation =
            (this.spinContainer.rotation * (180 / Math.PI)) % 360;
          const difference = (this.targetAngle - currentRotation + 360) % 360;
          if (difference < 1) {
            this.spinContainer.rotation = this.targetAngle * (Math.PI / 180); // Stop at target angle
            this.rotating = false; // Stop spinning
          }
        }
      }
    }
  }

  // Handle resizing of the screen
  public resize(w: number, h: number): void {
    this.position.set(w / 2, h / 2); // Center the wheel
    this.spinButton.position.set(0, this.spinWheel.height / 2 + 50); // Reposition button on resize
    this.anchorPointer.position.set(0, -this.spinWheel.height / 2 - 10); // Adjust anchor position on resize
  }
}
