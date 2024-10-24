import confetti from "canvas-confetti";
import { Container } from "pixi.js";

export class Confetti extends Container {
  private count = 200; // Total particles count
  private defaults = {
    origin: { y: 0.7 }, // Default origin for the confetti
  };

  constructor() {
    super();
  }

  private fire(particleRatio: number, opts: any) {
    confetti({
      ...this.defaults,
      ...opts,
      particleCount: Math.floor(this.count * particleRatio),
    });
  }

  protected shoot() {
    // Fire the confetti with different configurations
    this.fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });
    this.fire(0.2, {
      spread: 60,
    });
    this.fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });
    this.fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });
    this.fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  }

  public triggerConfetti() {
    this.shoot();
  }

  public resize(w: number, h: number) {
    // Handle any resizing logic if necessary
  }
}
