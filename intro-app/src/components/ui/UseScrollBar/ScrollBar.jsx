import React, { useState, useRef, useEffect } from "react";
import { IoCaretUp } from "react-icons/io5";
import { FaCaretDown } from "react-icons/fa";

import "./ScrollBar.css";

const ScrollBar = ({ containerRef, scrollTop, scrollHeight, clientHeight }) => {
    const trackRef = useRef(null);
    const [thumbHeight, setThumbHeight] = useState(0);
    const [thumbTop, setThumbTop] = useState(0);
    const [dragging, setDragging] = useState(false);
    const startY = useRef(0);
    const startScroll = useRef(0);

    useEffect(() => {
        if (!containerRef.current || !trackRef.current) return;

        requestAnimationFrame(() => {
            if (!containerRef.current || !trackRef.current) return;
            
            const trackHeight = trackRef.current.clientHeight;
            const ratio = clientHeight / scrollHeight;
            const newThumbHeight = Math.max(trackHeight * ratio, 30);
            setThumbHeight(newThumbHeight);

            const maxScroll = scrollHeight - clientHeight;
            const maxThumbTop = trackHeight - newThumbHeight;
            setThumbTop((scrollTop / maxScroll) * maxThumbTop || 0);
        });
    }, [scrollTop, scrollHeight, clientHeight, containerRef]);

    const handleMouseDown = (e) => {
        setDragging(true);
        startY.current = e.clientY;
        startScroll.current = scrollTop;
    };


    const handleMouseMove = (e) => {
        if (!dragging || !containerRef.current || !trackRef.current) return;
        const el = containerRef.current;
        const trackHeight = trackRef.current.clientHeight;
        const deltaY = e.clientY - startY.current;
        const scrollRatio = (scrollHeight - clientHeight) / (trackHeight - thumbHeight);
        el.scrollTop = startScroll.current + deltaY * scrollRatio;
    };

    const handleMouseUp = () => setDragging(false);
    useEffect(() => {
        if (dragging) {
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
        } else {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        }
        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [dragging]);


    const scrollByStep = (direction) => {
        if (!containerRef.current) return;
        containerRef.current.scrollBy({ top: direction * 40, behavior: "smooth" });
    };

    return (
        <div className="scrollbar">
            <div className="scrollbar__arrow">
                <button className="scrollbar__arrow-up" onClick={() => scrollByStep(-1)}>
                    <IoCaretUp />
                </button>
            </div>


            <div ref={trackRef} className="scrollbar__track">
                <div
                    className="scrollbar__thumb"
                    style={{ height: thumbHeight, top: thumbTop }}
                    onMouseDown={handleMouseDown}
                />
            </div>
            <div className="scrollbar__arrow">

                <button className="scrollbar__arrow-down" onClick={() => scrollByStep(1)}>
                    <FaCaretDown />
                </button>
            </div>

        </div>
    );
};

export default ScrollBar;
