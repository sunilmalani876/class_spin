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
