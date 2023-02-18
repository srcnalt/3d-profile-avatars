import EventBase from "./event-base";

export interface OnAnimPlayed extends Event {
  detail?: {
    name: string
  }
}

export class AnimEvent extends EventBase {
  static subscribe(anims: string[], callback: (event: OnAnimPlayed) => void): void {
    for (let index = 0; index < anims.length; index++) {
      document.addEventListener(anims[index], callback);
    }
  }

  static unsubscribe(anims: string[], callback: (event: OnAnimPlayed) => void): void {
    for (let index = 0; index < anims.length; index++) {
      document.removeEventListener(anims[index], callback);
    }
  }

  static dispatch(name: string): void {
    document.dispatchEvent(new CustomEvent(name, {detail: {name}}));
  }
}
