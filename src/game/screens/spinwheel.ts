// import {
//   Container,
//   Graphics,
//   Sprite,
//   spritesheetAsset,
//   Text,
//   Texture,
// } from "pixi.js";
// import { AppScreen } from "../../navigation";
// import { app } from "../../main";

// interface WheelSlice {
//   label: string;
//   angle: number;
// }

// export class SpinWheel extends Container implements AppScreen<string[]> {
//   public static readonly SCREEN_ID = "SpinWheel"; // Required for navigation

//   public static assetBundles = ["images/spin"];

//   private wheel: Graphics;
//   private slices: WheelSlice[] = [];
//   private totalSlices: number = 6; // Assuming 6 slices
//   private spinSpeed: number = 0;
//   private targetAngle: number = 0;
//   private stopping: boolean = false;
//   private rotating: boolean = false; // Keep track of spinning state
//   private currentSpeed: number = 0; // Track current speed for smooth stopping

//   private spinContainer: Container;
//   private graphicsArray: Graphics[];

//   constructor() {
//     super();
//     // spin ring container
//     this.spinContainer = new Container();
//     this.addChild(this.spinContainer);

//     this.wheel = new Graphics();
//     this.addChild(this.wheel);

//     this.interactive = true;
//     // @ts-ignore
//     this.buttonMode = true;

//     // Click event to start the spin
//     this.on("pointerdown", this.onClickToSpin, this);
//   }

//   public prepare(backendResponse?: string[]): void {
//     const responses = backendResponse ?? [
//       "Default 1",
//       "Default 2",
//       "Default 3",
//       "Default 4",
//       "Default 5",
//       "Default 6",
//     ];
//     this.slices = [];
//     this.drawWheel(responses);
//   }

//   private drawWheel(backendResponse: string[]): void {
//     const radius = 200;
//     const sliceScale = 0.15;
//     const sliceScaleFactor = 0.75; // Scaling factor for the sprites
//     const textureNames = [
//       "position_3",
//       "position_4",
//       "position_5",
//       "position_6",
//       "position_1",
//       "position_2",
//     ];

//     // 1,2,3,4,5,6
//     const colors = [0xc4e1f6, 0x00ff00, 0x605678, 0xffff00, 0xff00ff, 0xff9d3d];
//     // const rect = new Graphics();
//     // Create an array to hold the graphics
//     this.graphicsArray = [];
//     for (let i = 0; i < this.totalSlices; i++) {
//       const sliceAngle = (Math.PI * 2) / this.totalSlices; // Calculate the angle for each slice
//       const angle = i * sliceAngle; // Calculate the angle

//       // Create and scale the texture sprite for the slice
//       const texture1 = Texture.from("bubble-yellow");

//       const sliceSprite1 = new Sprite(texture1);
//       sliceSprite1.scale.set(0.3);
//       sliceSprite1.anchor.set(0.5); // Center the sprite

//       // Graphics SLICE
//       const graphic = new Graphics();
//       graphic.beginFill(colors[i % colors.length]);
//       graphic.moveTo(0, 0);
//       graphic.arc(0, 0, radius, angle, angle + sliceAngle);
//       graphic.lineTo(0, 0);
//       graphic.endFill();
//       // console.log(graphic);

//       // Position the slice sprite at the midpoint of the slice
//       sliceSprite1.position.set(
//         Math.cos(angle + sliceAngle / 2) * (radius * 0.2),
//         Math.sin(angle + sliceAngle / 2) * (radius * 0.2)
//       );
//       // sliceSprite1.position.set(0 + sliceAngle, 0 + sliceAngle);
//       // Add the sprite to the graphic after the fill
//       graphic.addChild(sliceSprite1);

//       // Add the graphic to the array and the wheel
//       this.graphicsArray.push(graphic);
//       this.wheel.addChild(graphic);

//       // Add text labels
//       const text = new Text(backendResponse[i], {
//         fill: 0xffffff,
//         fontSize: 24,
//       });
//       text.anchor.set(0.5);
//       const textAngle = angle + sliceAngle / 2;
//       text.position.set(
//         Math.cos(textAngle) * (radius * 0.7),
//         Math.sin(textAngle) * (radius * 0.7)
//       );
//       this.wheel.addChild(text);

//       // Store slice details
//       this.slices.push({ label: backendResponse[i], angle: angle });
//     }

//     // for (let i = 0; i < this.totalSlices; i++) {
//     //   const sliceAngle = (Math.PI * 2) / this.totalSlices; // Calculate the angle for each slice
//     //   console.log(i * sliceAngle);
//     //   const angle = i * sliceAngle; // Calculate the angle

//     //   // Graphics SLICE
//     //   this.wheel.beginFill(colors[i % colors.length]);
//     //   this.wheel.moveTo(0, 0);
//     //   this.wheel.arc(0, 0, radius, angle, angle + sliceAngle);
//     //   this.wheel.lineTo(0, 0);
//     //   this.wheel.endFill();

//     //   // Add text labels
//     //   const text = new Text(backendResponse[i], {
//     //     fill: 0xffffff,
//     //     fontSize: 24,
//     //   });
//     //   text.anchor.set(0.5);
//     //   const textAngle = angle + sliceAngle / 2;
//     //   text.position.set(
//     //     Math.cos(textAngle) * (radius * 0.7),
//     //     Math.sin(textAngle) * (radius * 0.7)
//     //   );
//     //   this.wheel.addChild(text);

//     //   // Create sprite and position it on top of the slice
//     //   const texture = Texture.from(textureNames[i % textureNames.length]);
//     //   const sliceSprite = new Sprite(texture);
//     //   sliceSprite.anchor.set(0.5);
//     //   sliceSprite.scale.set(sliceScale);

//     //   // Center the sprite at the midpoint of the slice
//     //   sliceSprite.position.set(
//     //     Math.cos(angle + sliceAngle / 2) * (radius * 0.4), // Adjust based on radius to move closer to edge

//     //     Math.sin(angle + sliceAngle / 2) * (radius * 0.4)
//     //   );

//     //   this.wheel.addChild(sliceSprite);

//     //   // Store slice details
//     //   this.slices.push({ label: backendResponse[i], angle: angle });
//     // }
//   }

//   public onClickToSpin(): void {
//     if (!this.rotating) {
//       this.spinSpeed = 35; // Initial high speed for the spin
//       this.currentSpeed = this.spinSpeed;
//       this.rotating = true; // Set rotating state to true
//       this.stopping = false; // We're not stopping yet

//       // Start spinning
//       const spinningInterval = setInterval(() => {
//         if (this.rotating) {
//           this.spinWheel();
//         }
//       }, 16); // Runs every frame (approx. 60 FPS)

//       // After 1000ms, slow down and stop
//       setTimeout(() => {
//         const targetPrize = "Prize 4"; // Replace with backend response
//         clearInterval(spinningInterval); // Stop constant spinning
//         this.spinToSlice(targetPrize); // Initiate the stopping process
//       }, 1000);
//     }
//   }

//   private spinWheel(): void {
//     // @ts-ignore
//     this.wheelSprite.rotation += this.currentSpeed * 0.05; // Control wheel rotation
//   }

//   public spinToSlice(targetText: string): void {
//     const targetSlice = this.slices.find((slice) => slice.label === targetText);
//     if (targetSlice) {
//       console.log(targetSlice);
//       const randomSpins = Math.floor(Math.random() * 4 + 3); // Random spins between 3 and 6
//       const sliceIndex = this.slices.indexOf(targetSlice);

//       const sliceAngle = (Math.PI * 2) / this.totalSlices; // Calculate angle per slice
//       const targetAngleInDegrees = sliceIndex * (360 / this.totalSlices); // Angle in degrees based on slice index

//       // Total target angle including random spins
//       this.targetAngle = randomSpins * 360 + targetAngleInDegrees; // Target angle in degrees
//       this.spinSpeed = 20; // Initial spin speed
//       this.currentSpeed = this.spinSpeed; // Set current speed for smooth control
//       this.rotating = true; // Start rotating
//       this.stopping = true; // Indicate that we want to stop
//       // console.log(sliceIndex, sliceAngle, targetAngleInDegrees);
//     } else {
//       console.error(`No slice found with label: ${targetText}`);
//     }
//   }

//   public update(): void {
//     if (this.rotating) {
//       // Rotate the wheel
//       this.wheel.rotation += this.currentSpeed * (Math.PI / 180); // Convert degrees to radians

//       if (this.stopping) {
//         // Gradually reduce the speed
//         if (this.currentSpeed > 0.5) {
//           this.currentSpeed *= 0.98; // Slow down the speed gradually
//         } else {
//           // Calculate the current rotation in degrees
//           const currentRotation = (this.wheel.rotation * (180 / Math.PI)) % 360;
//           // Ensure positive rotation value
//           const normalizedCurrentRotation = (currentRotation + 360) % 360;
//           const normalizedTargetAngle = (this.targetAngle + 360) % 360;

//           // Check if the wheel is close to the target angle
//           const difference = Math.abs(
//             normalizedTargetAngle - normalizedCurrentRotation
//           );

//           if (difference < 0.5) {
//             // Reduce the threshold for more precision
//             this.wheel.rotation = normalizedTargetAngle * (Math.PI / 180); // Snap to target
//             this.rotating = false; // Stop spinning
//             this.currentSpeed = 0; // Reset speed
//             this.stopping = false; // Reset stopping flag
//           }
//         }
//       }
//     }
//   }

//   public async show(): Promise<void> {
//     // Optional: Add animations or transitions when the screen shows
//   }

//   public async hide(): Promise<void> {
//     // Optional: Clean up resources or animations when the screen hides
//   }

//   public resize(w: number, h: number): void {
//     this.position.set(w / 2, h / 2);
//   }
// }

// --------------------
// // public update(): void {
// //   if (this.rotating) {
// //     // Rotate the wheel
// //     this.wheel.rotation += this.currentSpeed * (Math.PI / 180); // Convert degrees to radians

// //     if (this.stopping) {
// //       // Gradually reduce the speed
// //       if (this.currentSpeed > 0.5) {
// //         this.currentSpeed *= 0.98; // Slow down the speed gradually
// //       } else {
// //         // Calculate the current rotation in degrees
// //         const currentRotation = (this.wheel.rotation * (180 / Math.PI)) % 360;
// //         // Ensure positive rotation value
// //         const normalizedCurrentRotation = (currentRotation + 360) % 360;
// //         const normalizedTargetAngle = (this.targetAngle + 360) % 360;

// //         // Check if the wheel is close to the target angle
// //         const difference = Math.abs(
// //           normalizedTargetAngle - normalizedCurrentRotation
// //         );

// //         if (difference < 0.5) {
// //           // Reduce the threshold for more precision
// //           this.wheel.rotation = normalizedTargetAngle * (Math.PI / 180); // Snap to target
// //           this.rotating = false; // Stop spinning
// //           this.currentSpeed = 0; // Reset speed
// //           this.stopping = false; // Reset stopping flag
// //         }
// //       }
// //     }
// //   }
// // }

// // public spinToSlice(targetText: string): void {
// //   const targetSlice = this.slices.find((slice) => slice.label === targetText);
// //   if (targetSlice) {
// //     const randomSpins = Math.floor(Math.random() * 4 + 3); // Random spins between 3 and 6
// //     this.targetAngle =
// //       randomSpins * 360 + targetSlice.angle * (180 / Math.PI); // Convert radian to degrees
// //     this.spinSpeed = 20; // Initial spin speed
// //     this.currentSpeed = this.spinSpeed; // Set current speed for smooth control
// //     this.rotating = true; // Start rotating
// //     this.stopping = true; // Indicate that we want to stop
// //   } else {
// //     console.error(`No slice found with label: ${targetText}`);
// //   }
// // }

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
  private drawWheel(backendResponse: string[]): void {
    const radius = 200; // Radius of the wheel
    const colors = [0xc4e1f6, 0x00ff00, 0x605678, 0xffff00, 0xff00ff, 0xff9d3d];

    this.graphicsArray = []; // Initialize graphics array

    for (let i = 0; i < this.totalSlices; i++) {
      const sliceAngle = (Math.PI * 2) / this.totalSlices; // Angle for each slice
      const angle = i * sliceAngle - Math.PI / 2 - 0.5; // Offset by -90 degrees

      // Create the slice graphic
      const graphic = new Graphics();
      graphic.beginFill(colors[i % colors.length]);
      graphic.moveTo(0, 0);
      graphic.arc(0, 0, radius, angle, angle + sliceAngle);
      graphic.lineTo(0, 0);
      graphic.endFill();

      // Create the slice label
      const text = new Text(backendResponse[i], {
        fill: 0xffffff,
        fontSize: 24,
      });
      text.anchor.set(0.5); // Center the text
      const textAngle = angle + sliceAngle / 2; // Position at slice center
      text.position.set(
        Math.cos(textAngle) * (radius * 0.7),
        Math.sin(textAngle) * (radius * 0.7)
      );

      // Add the graphic and label to the wheel
      this.graphicsArray.push(graphic);
      this.wheel.addChild(graphic);
      this.wheel.addChild(text);

      // Store slice details for later reference
      this.slices.push({ label: backendResponse[i], angle });
    }

    // Add an anchor on the top of the wheel (custom graphic or sprite)
    const anchor = new Graphics();
    anchor.beginFill(0xff0000);
    anchor.drawCircle(0, -radius - 20, 10); // Positioned above the wheel
    anchor.endFill();
    this.addChild(anchor);
  }

  // Handle click to start the spin
  public onClickToSpin(): void {
    if (!this.rotating) {
      this.spinSpeed = 35; // Start speed for spin
      this.currentSpeed = this.spinSpeed;
      this.rotating = true; // Set spinning state
      this.stopping = false; // Not stopping yet

      // Start the wheel spin
      const spinningInterval = setInterval(() => {
        if (this.rotating) {
          this.spinWheel();
        }
      }, 16); // 60 FPS

      // Stop after 1 second and target a prize
      setTimeout(() => {
        const targetPrize = "Prize 5"; // Change to backend response
        clearInterval(spinningInterval);
        this.spinToSlice(targetPrize); // Slow down and stop at target
      }, 1000);
    }
  }

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
