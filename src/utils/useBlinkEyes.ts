import { useEffect } from "react";
import { AnimEvent } from "../events/anim-event";

let timeout: NodeJS.Timeout;

export default function useBlinkEyes(enabled: boolean | undefined) {
    function setNextBlink(){
        AnimEvent.dispatch('blink');

        const delay = Math.random() * 5000 + 3000;

        clearTimeout(timeout);
        timeout = setTimeout(setNextBlink, delay);
    }

    useEffect(() => {
        if(!enabled) return;

        timeout = setTimeout(setNextBlink, 1000);

        return () =>{
            clearTimeout(timeout);
        }
    }, []);
}
