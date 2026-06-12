import { useEffect, useState } from "react";

export const useScroll = (scrollPosition = 150) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const shouldShow = window.scrollY >= scrollPosition;
            setVisible(shouldShow);
        };
        
        window.addEventListener("scroll", handleScroll, { passive: true });
        
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [scrollPosition]);

    return { visible };
};
