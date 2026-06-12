import { useRef, useState, useEffect } from "react";

export const useScrollBar = () => {
    const containerRef = useRef(null);
    const [scrollData, setScrollData] = useState({
        scrollTop: 0,
        scrollHeight: 0,
        clientHeight: 0,
    });

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const handleScroll = () => {
            requestAnimationFrame(() => {
                if (!el) return;
                setScrollData({
                    scrollTop: el.scrollTop,
                    scrollHeight: el.scrollHeight,
                    clientHeight: el.clientHeight,
                });
            });
        };

        handleScroll();
        el.addEventListener("scroll", handleScroll, { passive: true });
        window.addEventListener("resize", handleScroll, { passive: true });

        return () => {
            el.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleScroll);
        };
    }, []);

    return { containerRef, ...scrollData };
};
