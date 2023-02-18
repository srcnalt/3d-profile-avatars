export default abstract class EventBase {
    static subscribe: (payload: any, callback: (event: Event) => void) => void;
    static unsubscribe: (payload: any, callback: (event: Event) => void) => void;
    static dispatch: (name: string, payload?: any) => void;
}
