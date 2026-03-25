import { useEffect, useRef, useState } from "react";

/**
 * Animates a number from 0 to `target` when the returned ref enters the viewport.
 * Returns [currentValue, ref].
 */
const useCountUp = (target: number, duration = 1400): [number, React.RefObject<HTMLElement>] => {
    const [value, setValue] = useState(0);
    const ref = useRef<HTMLElement>(null);
    const hasRun = useRef(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasRun.current) {
                    hasRun.current = true;
                    const start = performance.now();
                    const tick = (now: number): void => {
                        const elapsed = now - start;
                        const progress = Math.min(elapsed / duration, 1);
                        // ease-out-cubic
                        const eased = 1 - Math.pow(1 - progress, 3);
                        setValue(Math.round(eased * target));
                        if (progress < 1) requestAnimationFrame(tick);
                    };
                    requestAnimationFrame(tick);
                    observer.unobserve(el);
                }
            },
            { threshold: 0.5 },
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [target, duration]);

    return [value, ref as React.RefObject<HTMLElement>];
};

export default useCountUp;
