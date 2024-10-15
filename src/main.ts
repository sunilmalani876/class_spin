import { Application } from "pixi.js";
import { initAssets } from "./assets";
import { designConfig } from "./game/designConfig";
import { LoadScreen } from "./game/screens/LoadScreen";
import { navigation } from "./navigation";
import { storage } from "./stroage";
import { SpinWheel } from "./game/screens/spinwheel";

/** The PixiJS app Application instance, shared across the project */
export const app = new Application<HTMLCanvasElement>({
  resolution: Math.max(window.devicePixelRatio, 2),
  // backgroundColor: 0x0d92f4,
});

/** Set up a resize function for the app */
function resize() {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  const minWidth = designConfig.content.width;
  const minHeight = designConfig.content.height;

  // Calculate renderer and canvas sizes based on current dimensions
  const scaleX = windowWidth < minWidth ? minWidth / windowWidth : 1;
  const scaleY = windowHeight < minHeight ? minHeight / windowHeight : 1;
  const scale = scaleX > scaleY ? scaleX : scaleY;
  const width = windowWidth * scale;
  const height = windowHeight * scale;

  // Update canvas style dimensions and scroll window up to avoid issues on mobile resize
  app.renderer.view.style.width = `${windowWidth}px`;
  app.renderer.view.style.height = `${windowHeight}px`;
  window.scrollTo(0, 0);

  // Update renderer and navigation screens dimensions
  app.renderer.resize(width, height);
  navigation.init();
  navigation.resize(width, height);
}

/** Setup app and initialise assets */
async function init() {
  // Add pixi canvas element (app.view) to the document's body
  document.body.appendChild(app.view);

  // Whenever the window resizes, call the 'resize' function
  window.addEventListener("resize", resize);

  // Trigger the first
  resize();

  // Setup assets bundles (see assets.ts) and start up loading everything in background
  await initAssets();

  // Set the default local storage data if needed
  storage.readyStorage();

  // Assign the universal loading screen
  // navigation.setLoadScreen(LoadScreen);

  // await navigation.goToScreen(LoadScreen);

  // Assuming you want to show the spin wheel after the load screen
  const backendResponse = [
    "Prize 1",
    "Prize 2",
    "Prize 3",
    "Prize 4",
    "Prize 5",
    "Prize 6",
  ];
  const targetPrize = "Prize 3"; // This will be the prize where you want the wheel to stop

  // Create and prepare the spin wheel
  const spinWheel = new SpinWheel();
  spinWheel.prepare(backendResponse);

  // Spin to stop at the "Prize 3" slice
  spinWheel.spinToSlice(targetPrize);

  // Navigate to the spin wheel screen
  await navigation.goToScreen(SpinWheel, backendResponse);

  // Spin to stop at the "Prize 3" slice after a delay (simulate backend response)
  setTimeout(() => {
    spinWheel.spinToSlice(targetPrize);
  }, 600);

  // Add ticker to continuously update the wheel
  // app.ticker.add(() => {
  //   spinWheel.update(); // Ensure the update function is called every frame
  // });

  // Show first screen - go straight to game if '?play' param is present in url
  // This is used for debugging
  // if (getUrlParam("play") !== null) {
  //   console.log("play");
  //   // await Assets.loadBundle(TitleScreen.assetBundles);
  //   // await navigation.goToScreen(GameScreen);
  // } else if (getUrlParam("loading") !== null) {
  // await navigation.goToScreen(LoadScreen);
  // } else {
  //   // await navigation.goToScreen(TitleScreen);
  // }
}

await init();
