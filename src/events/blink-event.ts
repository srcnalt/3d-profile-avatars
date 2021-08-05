import EventBase from "./event-base";

export interface OnBlinked extends Event {
  detail?: { }
}

export class BlinkEvent extends EventBase {
  static eventName = 'blinked';

  static subscribe(callback: (event: OnBlinked) => void): void {
    document.addEventListener(BlinkEvent.eventName, callback);
  }

  static unsubscribe(callback: (event: OnBlinked) => void): void { 
    document.removeEventListener(BlinkEvent.eventName, callback);
  }

  static dispatch(): void {
    document.dispatchEvent(new CustomEvent(BlinkEvent.eventName));
  }
}
