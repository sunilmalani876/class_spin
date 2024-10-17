# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from "eslint-plugin-react";

export default tseslint.config({
  // Set the react version
  settings: { react: { version: "18.3" } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs["jsx-runtime"].rules,
  },
});
```

<!--
{
  "bundles": [
    {
      "name": "default",
      "assets": [
        {
          "name": ["audio/bubbo-bubbo-bg-music.wav"],
          "srcs": [
            "audio/bubbo-bubbo-bg-music.mp3",
            "audio/bubbo-bubbo-bg-music.ogg"
          ]
        },
        {
          "name": ["images/favicon.png"],
          "srcs": ["images/favicon.png"]
        }
      ]
    }
  ]
}

import gsap from "gsap";
import { Container } from "pixi.js";
import { PrimaryButton } from "../../ui/buttons/PrimaryButton";
import { i18n } from "../../utils/I18n";

/** The screen presented at the start, after loading. */
/** The screen presented at the start, after loading. */
export class TitleScreen extends Container {
  /** A unique identifier for the screen */
  public static SCREEN_ID = "title";
  public static assetBundles = ["images/title-screen"];

  private _playBtn!: PrimaryButton;
  private _bottomAnimContainer = new Container();

  constructor() {
    super();
    // Add buttons like the play button
    this._buildButtons();
    this.addChild(this._bottomAnimContainer);
  }

  /** Called before `show` function, can receive `data` */
  public prepare() {
    gsap.set(this._bottomAnimContainer, { y: 350 });
  }

  /** Called when the screen is being shown. */
  public async show() {
    gsap.killTweensOf(this);
    this.alpha = 0;
    await gsap.to(this, { alpha: 1, duration: 0.2, ease: "linear" });
    const endData = {
      y: 0,
      duration: 0.75,
      ease: "elastic.out(1, 0.5)",
    };
    gsap.to(this._bottomAnimContainer, endData);
  }

  /** Called when the screen is being hidden. */
  public async hide() {
    gsap.killTweensOf(this);
    await gsap.to(this, { alpha: 0, duration: 0.2, ease: "linear" });
  }

  /**
   * Gets called every time the screen resizes.
   * @param w - width of the screen.
   * @param h - height of the screen.
   */
  public resize(w: number, h: number) {
    this._playBtn.x = w * 0.5;
    this._playBtn.y = h * 0.5;
  }

  /** Add the play button to the screen. */
  private _buildButtons() {
    this._playBtn = new PrimaryButton({
      text: i18n.t("titlePlay"),
    });

    this._playBtn.onPress.connect(() => {
      console.log("play");
    });

    this._bottomAnimContainer.addChild(this._playBtn);
  }
}

 -->

<!-- https://www.figma.com/design/wbMq0jSRg61dCSksdnFIJ0/Fortune-wheel-(Community)?node-id=2-840&node-type=frame&t=dg2xFdsYcUHjNSrM-0 -->

<!--

import { Container, Graphics, Sprite, Text, Texture } from "pixi.js";
import { AppScreen } from "../../navigation";
import { app } from "../../main";

interface WheelSlice {
  label: string;
  angle: number;
}

export class SpinWheel extends Container implements AppScreen<string[]> {
  public static readonly SCREEN_ID = "SpinWheel"; // Required for navigation
  public static assetBundles = ["images/spin"];

  private wheel: Graphics;
  private slices: WheelSlice[] = [];
  private totalSlices: number = 6; // Assume 6 slices
  private spinSpeed: number = 0;
  private targetAngle: number = 0;
  private stopping: boolean = false;
  private rotating: boolean = false; // Track spinning state
  private currentSpeed: number = 0; // Track current speed for smooth stopping
  private spinContainer: Container; // Spin ring container
  private graphicsArray: Graphics[]; // Hold graphics for slices

  constructor() {
    super();
    this.spinContainer = new Container();
    this.addChild(this.spinContainer);

    this.wheel = new Graphics();
    this.addChild(this.wheel);

    this.interactive = true; // Enable click interaction
    this.buttonMode = true; // Change cursor to pointer

    // Event listener for starting spin on click
    this.on("pointerdown", this.onClickToSpin, this);
  }

  // Prepare the wheel with backend data or default values
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
    this.drawWheel(responses); // Draw wheel with provided data
  }

  // Draw the wheel with slices and labels
  // private drawWheel(backendResponse: string[]): void {
  //   const radius = 200; // Radius of the wheel
  //   const colors = [0xc4e1f6, 0x00ff00, 0x605678, 0xffff00, 0xff00ff, 0xff9d3d];

  //   this.graphicsArray = []; // Initialize graphics array

  //   for (let i = 0; i < this.totalSlices; i++) {
  //     const sliceAngle = (Math.PI * 2) / this.totalSlices; // Angle for each slice
  //     const angle = i * sliceAngle - Math.PI / 2 - 0.5; // Offset by -90 degrees

  //     // Create the slice graphic
  //     const graphic = new Graphics();
  //     graphic.beginFill(colors[i % colors.length]);
  //     graphic.moveTo(0, 0);
  //     graphic.arc(0, 0, radius, angle, angle + sliceAngle);
  //     graphic.lineTo(0, 0);
  //     graphic.endFill();

  //     // Create the slice label
  //     const text = new Text(backendResponse[i], {
  //       fill: 0xffffff,
  //       fontSize: 24,
  //     });
  //     text.anchor.set(0.5); // Center the text
  //     const textAngle = angle + sliceAngle / 2; // Position at slice center
  //     text.position.set(
  //       Math.cos(textAngle) * (radius * 0.7),
  //       Math.sin(textAngle) * (radius * 0.7)
  //     );

  //     // Add the graphic and label to the wheel
  //     this.graphicsArray.push(graphic);
  //     this.wheel.addChild(graphic);
  //     this.wheel.addChild(text);

  //     // Store slice details for later reference
  //     this.slices.push({ label: backendResponse[i], angle });
  //   }

  //   // Add an anchor on the top of the wheel (custom graphic or sprite)
  //   const anchor = new Graphics();
  //   anchor.beginFill(0xff0000);
  //   anchor.drawCircle(0, -radius - 20, 10); // Positioned above the wheel
  //   anchor.endFill();
  //   this.addChild(anchor);
  // }

  // Handle click to start the spin
  // public onClickToSpin(): void {
  //   if (!this.rotating) {
  //     this.spinSpeed = 35; // Start speed for spin
  //     this.currentSpeed = this.spinSpeed;
  //     this.rotating = true; // Set spinning state
  //     this.stopping = false; // Not stopping yet

  //     // Start the wheel spin
  //     const spinningInterval = setInterval(() => {
  //       if (this.rotating) {
  //         this.spinWheel();
  //       }
  //     }, 16); // 60 FPS

  //     // Stop after 1 second and target a prize
  //     setTimeout(() => {
  //       const targetPrize = "p5"; // Change to backend response
  //       clearInterval(spinningInterval);
  //       this.spinToSlice(targetPrize); // Slow down and stop at target
  //     }, 1000);
  //   }
  // }

  // Control the spinning wheel
  private spinWheel(): void {
    this.wheel.rotation += this.currentSpeed * (Math.PI / 180); // Convert to radians
  }

  // Spin to a specific prize
  public spinToSlice(targetText: string): void {
    const targetSlice = this.slices.find((slice) => {
      console.log(slice);

      return slice.label === targetText;
    });
    if (targetSlice) {
      const randomSpins = Math.floor(Math.random() * 4) + 3; // Between 3-6 spins
      const sliceIndex = this.slices.indexOf(targetSlice);
      const sliceAngle = 360 / this.totalSlices; // Angle per slice in degrees

      // Calculate the current wheel rotation in degrees
      const currentRotation = (this.wheel.rotation * (180 / Math.PI)) % 360;
      const normalizedCurrentRotation = (currentRotation + 360) % 360; // Normalize to 0-360°

      // Calculate the target angle in degrees based on the slice index
      const targetAngleInDegrees = sliceIndex * sliceAngle * 5;

      // Calculate how much more we need to rotate to reach the target slice
      const angleToTarget =
        randomSpins * 360 + targetAngleInDegrees - normalizedCurrentRotation;

      // Set the final target angle and normalize to 0-360°
      this.targetAngle = (normalizedCurrentRotation + angleToTarget) % 360;

      console.log(
        targetAngleInDegrees,
        angleToTarget,
        (normalizedCurrentRotation + angleToTarget) % 360
      );
      this.spinSpeed = 20; // Reset speed for smooth control
      this.currentSpeed = this.spinSpeed;
      this.rotating = true;
      this.stopping = true; // We want to stop at this point
    } else {
      console.error(`No slice found with label: ${targetText}`);
    }
  }
  // Prize 1    2.0707963267948966
  // Prize 2   -1.023598775598299
  // Prize 3    0.023598775598298705
  // Prize 4    1.0707963267948966
  // Prize 5    2.117993877991494
  // Prize 6    3.1651914291880914

  // Update the spinning logic
  public update(): void {
    if (this.rotating) {
      this.wheel.rotation += this.currentSpeed * (Math.PI / 180); // Continue spinning

      if (this.stopping) {
        // Gradually slow down the wheel
        if (this.currentSpeed > 0.5) {
          this.currentSpeed *= 0.98; // Reduce speed
        } else {
          // Snap to target angle when close enough
          const currentRotation = (this.wheel.rotation * (180 / Math.PI)) % 360;
          const normalizedCurrentRotation = (currentRotation + 360) % 360;
          const normalizedTargetAngle = (this.targetAngle + 360) % 360;

          // Calculate the difference between the current and target angles
          const difference = Math.abs(
            normalizedTargetAngle - normalizedCurrentRotation
          );

          // If the difference is small enough, stop the wheel
          if (difference < 0.5) {
            this.wheel.rotation = normalizedTargetAngle * (Math.PI / 180); // Snap to target
            this.rotating = false; // Stop spinning
            this.stopping = false; // Reset stopping flag
            this.currentSpeed = 0; // Stop speed
          }
        }
      }
    }
  }

  // Optional: Show screen animations
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


 -->
