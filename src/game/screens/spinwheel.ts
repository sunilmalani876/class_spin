import { Container, Graphics, Text } from "pixi.js";
import { AppScreen } from "../../navigation";

interface WheelSlice {
  label: string;
  angle: number;
}

export class SpinWheel extends Container implements AppScreen<string[]> {
  public static readonly SCREEN_ID = "SpinWheel"; // Required for navigation
  private wheel: Graphics;
  private slices: WheelSlice[] = [];
  private totalSlices: number = 6; // Assuming 6 slices
  private spinSpeed: number = 0;
  private targetAngle: number = 0;
  private stopping: boolean = false;
  private rotating: boolean = false; // Keep track of spinning state
  private currentSpeed: number = 0; // Track current speed for smooth stopping

  constructor() {
    super();
    this.wheel = new Graphics();
    this.addChild(this.wheel);

    this.interactive = true;
    this.buttonMode = true;

    // Click event to start the spin
    this.on("pointerdown", this.onClickToSpin, this);
  }

  public prepare(backendResponse?: string[]): void {
    const responses = backendResponse ?? [
      "Default 1",
      "Default 2",
      "Default 3",
      "Default 4",
      "Default 5",
      "Default 6",
    ];
    this.slices = [];
    this.drawWheel(responses);
  }

  private drawWheel(backendResponse: string[]): void {
    const radius = 200;
    const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff];

    for (let i = 0; i < this.totalSlices; i++) {
      const sliceAngle = (Math.PI * 2) / this.totalSlices;
      const angle = i * sliceAngle;

      this.wheel.beginFill(colors[i % colors.length]);
      this.wheel.moveTo(0, 0);
      this.wheel.arc(0, 0, radius, angle, angle + sliceAngle);
      this.wheel.lineTo(0, 0);
      this.wheel.endFill();

      // Add text labels
      const text = new Text(backendResponse[i], {
        fill: 0xffffff,
        fontSize: 24,
      });
      text.anchor.set(0.5);
      const textAngle = angle + sliceAngle / 2;
      text.position.set(
        Math.cos(textAngle) * (radius * 0.7),
        Math.sin(textAngle) * (radius * 0.7)
      );
      this.wheel.addChild(text);

      // Store slice details
      this.slices.push({ label: backendResponse[i], angle: angle });
    }
  }

  public onClickToSpin(): void {
    if (!this.rotating) {
      this.spinSpeed = 20; // Set initial spin speed
      this.currentSpeed = this.spinSpeed;
      this.rotating = true; // Set rotating state
      this.stopping = false; // Ensure not stopping immediately
    }
  }

  public spinToSlice(targetText: string): void {
    const targetSlice = this.slices.find((slice) => slice.label === targetText);
    if (targetSlice) {
      const randomSpins = Math.floor(Math.random() * 4 + 3); // Random spins between 3 and 6
      this.targetAngle =
        randomSpins * 360 + targetSlice.angle * (180 / Math.PI); // Convert radian to degrees
      this.spinSpeed = 20; // Initial spin speed
      this.currentSpeed = this.spinSpeed; // Set current speed for smooth control
      this.rotating = true; // Start rotating
      this.stopping = true; // Indicate that we want to stop
    } else {
      console.error(`No slice found with label: ${targetText}`);
    }
  }

  public update(): void {
    if (this.rotating) {
      this.wheel.rotation += this.currentSpeed * (Math.PI / 180); // Convert degrees to radians

      if (this.stopping) {
        if (this.currentSpeed > 0.5) {
          this.currentSpeed *= 0.98; // Gradually slow down
        } else {
          const currentRotation = (this.wheel.rotation * (180 / Math.PI)) % 360;
          const difference = (this.targetAngle - currentRotation + 360) % 360;

          if (difference < 1) {
            this.wheel.rotation = this.targetAngle * (Math.PI / 180); // Stop at target angle
            this.rotating = false; // Stop spinning
          }
        }
      }
    }
  }

  public async show(): Promise<void> {
    // Optional: Add animations or transitions when the screen shows
  }

  public async hide(): Promise<void> {
    // Optional: Clean up resources or animations when the screen hides
  }

  public resize(w: number, h: number): void {
    this.position.set(w / 2, h / 2);
  }
}
