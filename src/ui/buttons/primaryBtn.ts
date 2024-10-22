import { Container, Sprite, Texture, Text, TextStyle } from "pixi.js";

interface PrimaryButtonOptions {
  text?: string; // Optional text to display
  width?: number; // Optional width for scaling
  onClick?: () => void; // Optional click handler
  scale?: number;
  x?: number;
  y?: number;
}

export class PrimaryBtn extends Container {
  public buttonSprite: Sprite;
  private buttonText: Text;

  constructor(options: PrimaryButtonOptions) {
    super();

    // Create the button sprite
    this.buttonSprite = new Sprite(Texture.from("secondary_button_2"));
    this.buttonSprite.anchor.set(0.5); // Center the sprite
    this.buttonSprite.scale = this.scale;
    this.addChild(this.buttonSprite);

    // Optional text inside the button
    const textStyle = new TextStyle({
      fontFamily: "Arial",
      fontSize: 34,
      fontWeight: "bold",
      fill: ["#FFDE5B", "#FFB515"], // Gradient fill for text
      fillGradientType: 1, // Set gradient type (vertical gradient)
      fillGradientStops: [0.2, 0.8],
    });

    this.buttonText = new Text(options.text || "", textStyle);
    this.buttonText.anchor.set(0.5); // Center the text within the button

    this.addChild(this.buttonText);

    // If width is provided, scale the button
    if (options.width) {
      this.buttonSprite.width = options.width;
    }

    // Center the text within the button sprite
    this.centerText();

    // Add click interaction
    this.interactive = true;
    // @ts-ignore
    this.buttonMode = true;
    this.on("pointerdown", () => {
      if (options.onClick) {
        options.onClick();
      }
    });
  }

  // Method to scale the button and adjust the text position
  public resize(w: number, h: number) {
    this.buttonSprite.width = w;
    this.buttonSprite.height = h;
    this.centerText();
  }

  // Private method to center the text within the sprite
  private centerText() {
    this.buttonText.position.set(
      this.buttonSprite.width / 50,
      this.buttonSprite.height / 50 - 10
    );
  }

  // Optional method to update button text dynamically
  public setText(newText: string) {
    this.buttonText.text = newText;
    this.centerText(); // Recenter the text after updating
  }
}
