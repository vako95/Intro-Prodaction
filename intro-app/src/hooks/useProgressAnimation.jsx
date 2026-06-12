import { useEffect, useState } from "react";

export const useProgressAnimation = (skills, duration = 1500, isVisible) => {
    const [progresses, setProgresses] = useState(skills.map(() => 0));

    useEffect(() => {
        if (!isVisible) return;
        let startTime = null;

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;

            setProgresses((prev) =>
                prev.map((_, i) =>
                    Math.min(Math.floor((elapsed / duration) * skills[i].value), skills[i].value)
                )
            );

            if (progresses.some((p, i) => p < skills[i].value)) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [isVisible]);

    return progresses;
};
