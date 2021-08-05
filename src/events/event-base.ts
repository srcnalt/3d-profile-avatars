export default abstract class EventBase {
    static eventName: string;
    static subscribe: (callback: (event: Event) => void) => void;
    static unsubscribe: (callback: (event: Event) => void) => void;
    static dispatch: (payload?: any) => void;
}