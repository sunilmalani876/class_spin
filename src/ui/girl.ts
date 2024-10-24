// import { Spine } from "@pixi/spine-pixi";
import { Container } from "pixi.js";

export class Girl extends Container {
  // private spine: Spine;
  private container: Container;

  constructor() {
    super();

    this.container = new Container();

    //   this.spine = Spine.from({
    //     skeleton: "preload/bg_girl.json",
    //     atlas: "preload/bg_girl.atlas",
    //   });

    //   this.spine.scale.set(0.3);
    //   this.spine.x = -30;
    //   this.spine.y = 130;
    //   //@ts-ignore
    //   this.container.addChild(this.spine);
    //   this.playIdle();
    // }

    // public playIdle() {
    //   this.spine.state.setAnimation(0, "IDLE_new", true);
  }
}
