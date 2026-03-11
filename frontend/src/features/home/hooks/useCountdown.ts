import { useState, useEffect } from "react";

interface CountdownValues {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

const DEADLINE = new Date("2026-09-30T23:59:59");

const useCountdown = (): CountdownValues => {
    const [values, setValues] = useState<CountdownValues>({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    useEffect((): (() => void) => {
        const tick = (): void => {
            const diff = DEADLINE.getTime() - Date.now();
            if (diff <= 0) {
                setValues({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                return;
            }
            setValues({
                days: Math.floor(diff / 86400000),
                hours: Math.floor((diff % 86400000) / 3600000),
                minutes: Math.floor((diff % 3600000) / 60000),
                seconds: Math.floor((diff % 60000) / 1000),
            });
        };
        tick();
        const id = setInterval(tick, 1000);
        return (): void => clearInterval(id);
    }, []);

    return values;
};

export default useCountdown;
