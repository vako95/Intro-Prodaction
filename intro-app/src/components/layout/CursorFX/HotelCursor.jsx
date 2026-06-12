import { memo, useRef, useEffect, useState } from "react";
import "./HotelCursor.css";

const HotelCursor = ({
    speed = 0.128,
    maxStretch = 64,
    stretchFactor = 128,
    children
}) => {
    const cursorRef = useRef(null);
    const mouseRef = useRef({ x: 0, y: 0 });
    const cursorPosRef = useRef({ x: 0, y: 0 });
    const raf = useRef(null);
    const [isEnabled, setIsEnabled] = useState(false);

    // Listen to preferences changes
    useEffect(() => {
        const handlePreferencesChange = (e) => {
            setIsEnabled(e.detail.customCursor);
        };

        window.addEventListener('preferencesChanged', handlePreferencesChange);
        return () => window.removeEventListener('preferencesChanged', handlePreferencesChange);
    }, []);

    // Defer initial state load to avoid blocking first paint
    useEffect(() => {
        queueMicrotask(() => {
            const saved = localStorage.getItem('userPreferences');
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    setIsEnabled(parsed.customCursor || false);
                } catch (e) {
                    setIsEnabled(false);
                }
            }
        });
    }, []);

    useEffect(() => {
        if (!isEnabled) {
            if (cursorRef.current) {
                cursorRef.current.style.opacity = '0';
            }
            return;
        }

        if (cursorRef.current) {
            cursorRef.current.style.opacity = '1';
        }

        const handleMouseMove = (e) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };

        const animate = () => {
            const dx = mouseRef.current.x - cursorPosRef.current.x;
            const dy = mouseRef.current.y - cursorPosRef.current.y;

            cursorPosRef.current.x += dx * speed;
            cursorPosRef.current.y += dy * speed;

            const angle = Math.atan2(dy, dx) * (180 / Math.PI);
            const dist = Math.min(Math.hypot(dx, dy), maxStretch);
            const scaleX = 1 + dist / stretchFactor;

            if (cursorRef.current) {
                cursorRef.current.style.transform = `
                    translate3d(
                        ${cursorPosRef.current.x}px,
                        ${cursorPosRef.current.y}px,
                        0
                    )
                    rotate(${angle}deg)
                    scale(${scaleX}, 1)
                `;
            }
            raf.current = requestAnimationFrame(animate);
        };

        window.addEventListener("mousemove", handleMouseMove, { passive: true });
        raf.current = requestAnimationFrame(animate);
        
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            if (raf.current) {
                cancelAnimationFrame(raf.current);
            }
        };
    }, [isEnabled, speed, maxStretch, stretchFactor]);

    return (
        <>
            <div className="cursor-fx" ref={cursorRef} style={{ opacity: 0, transition: 'opacity 0.3s ease' }} />
            {children}
        </>
    );
};

HotelCursor.displayName = "layout.HotelCursor";
export default memo(HotelCursor);
