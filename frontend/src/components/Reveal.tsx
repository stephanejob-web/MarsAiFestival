import React, { useEffect, useRef } from "react";

type RevealVariant = "up" | "left" | "right" | "fade";

interface RevealProps {
    children: React.ReactNode;
    delay?: number;
    className?: string;
    variant?: RevealVariant;
}

/**
 * Wraps children in a div that animates into view when it enters the viewport.
 * Uses IntersectionObserver — no dependencies.
 */
const Reveal = ({
    children,
    delay = 0,
    className = "",
    variant = "up",
}: RevealProps): React.JSX.Element => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    if (delay) el.style.transitionDelay = `${delay}ms`;
                    el.dataset.visible = "true";
                    observer.unobserve(el);
                }
            },
            { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [delay]);

    return (
        <div ref={ref} className={`reveal-${variant} ${className}`} data-visible="false">
            {children}
        </div>
    );
};

export default Reveal;
