import { Container, Graphics, Sprite, Texture, Text, TextStyle } from "pixi.js";
import gsap from "gsap";
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
  private anchorPointer: Graphics; // Anchor pointer to indicate direction

  private numSlices = 10; // Number of slices
  private targetRotation = 0; // The final rotation angle
  private isSpinning = false; // Track if the wheel is currently spinning

  private spinButton: Text; // Text object to act as a button

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
    this.addChild(this.anchorPointer); // Add the anchor pointer to the stage
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

  // Spin the wheel and stop at a specific index using GSAP
  public spinAndStopAtIndex(index: number): void {
    if (this.isSpinning) return; // Prevent multiple spins at once
    this.isSpinning = true;

    const sliceAngle = 360 / this.numSlices;
    const targetAngle = sliceAngle * index;

    // Calculate how many full rotations (360 degrees) to add for a smooth spin
    const fullRotations = 5 * 360; // 5 full rotations before stopping

    console.log(
      "sliceAngle, targetAngle, fullRotations",
      sliceAngle,
      targetAngle,
      fullRotations
    );

    // The final rotation angle (full rotations + target angle)
    this.targetRotation = fullRotations + targetAngle;

    // Use GSAP to animate the spin
    gsap.to(this.spinContainer, {
      duration: 5, // Total duration of the spin
      rotation: (this.targetRotation * Math.PI) / 180, // Convert to radians for Pixi.js
      ease: "power2.out", // Easing function for a smooth stop
      onComplete: () => {
        this.isSpinning = false; // Mark the spinning as done
        console.log(
          "Wheel stopped at index:",
          this.targetRotation / (360 / this.numSlices)
        );
      },
    });
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
    this.spinButton.buttonMode = true;

    // Add a click event listener to the button
    this.spinButton.on("pointerdown", () => {
      const randomIndex = Math.floor(Math.random() * this.numSlices);
      this.spinAndStopAtIndex(0); // Spin to a random index
    });

    this.addChild(this.spinButton); // Add the button to the stage
  }

  public async show(): Promise<void> {
    // Add animations if necessary
  }

  public async hide(): Promise<void> {
    // Clean up animations or resources
  }

  // Handle resizing of the screen
  public resize(w: number, h: number): void {
    this.position.set(w / 2, h / 2); // Center the wheel
    this.spinButton.position.set(0, this.spinWheel.height / 2 + 50); // Reposition button on resize
    this.anchorPointer.position.set(0, -this.spinWheel.height / 2 - 10); // Adjust anchor position on resize
  }
}
