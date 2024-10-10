import { useState, useEffect, MutableRefObject } from "react";

const getWidth = (): number => {
    const windowElement = document.querySelector(
        ".main-view-container__scroll-node-child"
    );
    if (!windowElement) {
        setTimeout(() => {
            return getWidth();
        }, 10);
    }

    const [width, setWidth] = useState<number>(windowElement!.scrollWidth);
    useEffect(() => {
        const handleResize = () => {
            setWidth(windowElement!.scrollWidth);
        };

        // Initial check
        handleResize();

        // Listen for resize events
        window.addEventListener("resize", handleResize);

        // Cleanup listener on unmount
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return width;
};

export { getWidth };
