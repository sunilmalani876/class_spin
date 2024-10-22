import { Container, Graphics, Sprite, Text, TextStyle, Texture } from "pixi.js";
import { AppScreen } from "../../navigation";

export class SpinWheel extends Container implements AppScreen<string[]> {
  public static readonly SCREEN_ID = "SpinWheel";
  public static assetBundles = ["images/spin"];
  private spinWheel: Sprite;
  private anchorSprite: Sprite;
  private anchorStand: Sprite;
  private backgroundSprite: Sprite;

  // private primaryBtn2: PrimaryBtn;
  public buttonContainer: Container;

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
    this.buttonContainer = new Container(); // New container for number sprites
    this.sliceContainer = new Container(); // New container for number sprites

    const backgraundTexture = Texture.from("Background");
    this.backgroundSprite = new Sprite(backgraundTexture);
    this.backgroundSprite.anchor.set(0.5); // Center the background sprite
    this.backgroundSprite.scale.set(1); // Adjust as needed based on image size
    this.backgroundSprite.position.set(0, 0); // Centered position

    const anchoTexture = Texture.from("anchor");
    this.anchorSprite = new Sprite(anchoTexture);
    this.anchorSprite.anchor.set(0.5); // Center the anchorSprite
    this.anchorSprite.scale.set(0.5);
    this.anchorSprite.rotation = 33;

    const spinStand = Texture.from("spinStand_2");
    this.anchorStand = new Sprite(spinStand);
    this.anchorStand.anchor.set(0.5); // Center the anchorStand
    this.anchorStand.scale.set(0.75);
    this.anchorStand.y = 24;

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
    this.spinContainer.addChild(this.numberSpritesContainer);

    this.addChild(this.spinContainer);
    this.addChild(this.anchorStand);
    this.addChild(this.anchorSprite);

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

  // Method to draw lines for each slice
  private drawSlices(): void {
    const numSlices = 10;
    const sliceAngle = 360 / numSlices;
    const radius = this.spinWheel.width / 2; // Use the radius of the wheel
    const numberSpriteOffset = 0.75;

    // Start with a clean Graphics object
    this.sliceLines.clear();
    this.sliceLines.lineStyle(1, 0xffffff, 0); // Set line color (white) and thickness

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

  public spinToSlice(targetText: string): void {
    const targetSlice = this.sliceSprites.find(
      (sprite) => sprite.texture.textureCacheIds[0] === targetText
    );

    if (targetSlice) {
      const randomSpins = Math.floor(Math.random() * 4 + 3); // Random spins between 3 and 6
      const targetIndex = this.sliceSprites.indexOf(targetSlice);
      const targetAngle = (targetIndex / this.sliceSprites.length) * 360 * 9;

      // Adjust the targetAngle by adding random spins and a small offset (-18)

      // Log the target index and angle for debugging
      console.log("targetIndex", targetIndex, "targetAngle", this.targetAngle);

      this.targetAngle = randomSpins * 360 + targetAngle - 18;
      this.spinSpeed = 20; // Initial spin speed
      this.currentSpeed = this.spinSpeed; // Set current speed for smooth control
      this.rotating = true; // Start rotating
      this.stopping = true; // Indicate that we want to stop
    } else {
      console.error(`No slice found with index: ${targetText}`);
    }
  }

  private createSpinButton(): void {
    const buttonStyle = new TextStyle({
      fontFamily: "Arial",
      fontSize: 32,
      fontStyle: "italic",
      fontWeight: "bold",
      fill: 0xffffff,
      stroke: 0x000000,
      strokeThickness: 4,
    });

    this.spinButton = new Text("Spin", buttonStyle);
    this.spinButton.cursor = "pointer";
    this.spinButton.anchor.set(0.5); // Center the button
    this.spinButton.position.set(0, this.spinWheel.height / 2 + 50); // Position below the wheel

    this.spinButton.interactive = true;
    // @ts-ignore
    this.spinButton.buttonMode = true;

    // Add a click event listener to the button
    this.spinButton.on("pointerdown", () => {
      if (!this.rotating) {
        // Prevent starting a new spin while rotating
        this.startSpin();
      }
    });

    this.addChild(this.spinButton); // Add the button to the stage
  }

  // Method to handle spin start logic
  private startSpin(): void {
    this.spinSpeed = 20; // Reset spin speed before starting a new spin
    this.currentSpeed = this.spinSpeed;
    this.rotating = true; // Start spinning
    this.spinButton.interactive = false; // Disable the button during spin

    // Simulate backend response after the spin starts
    this.simulateBackendResponse();
  }

  // Simulate backend response for now (in real case, this will be an API call)
  private simulateBackendResponse(): void {
    setTimeout(() => {
      const resultIndex = Math.floor(Math.random() * this.sliceSprites.length); // Simulate result from backend
      this.spinToSlice(`num_${resultIndex}`);
    }, 3000); // Simulate a 3-second delay before getting the result
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
            this.resetSpin(); // Reset spin state after it stops
          }
        }
      }
    }
  }

  // Reset the state after the wheel stops
  private resetSpin(): void {
    this.stopping = false;
    this.rotating = false;
    this.currentSpeed = 0;
    this.targetAngle = 0;
    this.spinButton.interactive = true; // Re-enable the spin button
  }

  // public resize(w: number, h: number): void {
  //   const backgroundScale = Math.max(
  //     w / this.backgroundSprite.texture.width,
  //     h / this.backgroundSprite.texture.height
  //   );
  //   // this.backgroundSprite.scale.set(backgroundScale);

  //   this.position.set(w / 2, h / 2);

  //   this.spinButton.position.set(0, this.spinWheel.height / 2 + 50);
  // }

  public resize(w: number, h: number): void {
    // Reference design width and height (adjust based on your design)

    const baseWidth = 1920;
    const baseHeight = 1080;

    // Calculate the scaling factor for the current window size
    const scaleRatio = Math.min(w / baseWidth, h / baseHeight);

    // Apply the scaling factor to the spin container and its elements
    this.scale.set(scaleRatio);

    // Adjust the position of the spin wheel to keep it centered
    this.position.set(w / 2, h / 2);

    // Reposition and rescale the spin button relative to the scaled wheel
    this.position.set(
      0,
      (this.spinWheel.height * scaleRatio) / 2 + 50 * scaleRatio
    );
  }
}
