import { useState, useEffect } from "react";

interface CountdownValues {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    expired: boolean;
}

const FALLBACK = new Date("2026-09-30T23:59:59");

const useCountdown = (targetDate?: Date | string | null): CountdownValues => {
    const target = targetDate ? new Date(targetDate) : FALLBACK;

    const calc = (): CountdownValues => {
        const diff = target.getTime() - Date.now();
        if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
        return {
            days: Math.floor(diff / 86400000),
            hours: Math.floor((diff % 86400000) / 3600000),
            minutes: Math.floor((diff % 3600000) / 60000),
            seconds: Math.floor((diff % 60000) / 1000),
            expired: false,
        };
    };

    const [values, setValues] = useState<CountdownValues>(calc);

    useEffect((): (() => void) => {
        setValues(calc());
        const id = setInterval(() => setValues(calc()), 1000);
        return (): void => clearInterval(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [target.getTime()]);

    return values;
};

export default useCountdown;
