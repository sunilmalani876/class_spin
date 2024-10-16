import { ButtonOptions, FancyButton } from "@pixi/ui";
import { Text, TextStyle } from "pixi.js";

export interface PrimaryButtonOptions {
  /** The text displayed on the button. */
  text: string;
  /** Style properties for the text displayed on the button. */
  textStyle?: Partial<TextStyle>;
  /** Options for the underlying button component. */
  buttonOptions?: ButtonOptions;
}

const DEFAULT_SCALE = 0.6;

export class PrimaryButton extends FancyButton {
  constructor(options: PrimaryButtonOptions) {
    // Create text object to act as label
    const text = new Text(options?.text ?? "", {
      // Predefine text styles that can be overwritten
      fill: 0x49c8ff,
      fontFamily: "Bungee Regular",
      fontWeight: "bold",
      align: "center",
      fontSize: 40,
      // Allow custom text style to overwrite predefined options
      ...options?.textStyle,
    });

    super({
      // assign the default view
      defaultView: "play-btn-up",
      // Assign the pressed view
      pressedView: "play-btn-down",
      // Assign button text
      text,

      textOffset: {
        default: {
          y: -30,
        },
        pressed: {
          y: -15,
        },
      },

      // Anchor to the center-bottom
      anchorX: 0.5,
      anchorY: 1,

      // set initial scale to default scale
      scale: DEFAULT_SCALE,

      // Allow custom button options to overwrite predefined options
      ...options.buttonOptions,
    });
  }
}
