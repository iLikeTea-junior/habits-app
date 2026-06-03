import { createElement, useState, useRef, useEffect } from "react"
import "../cloud.css"

export default function Cloud() {
    const [clouds, setClouds] = useState([]);
    const counterRef = useRef(0);

    useEffect(() => {
        let timeout;

        const loop = () => {
            const id = counterRef.current++;
            const scale = (Math.round(Math.random() * 6) * 0.05 + 0.20).toFixed(2);
            const top = Math.random() * 85;

            setClouds(prev => [...prev, { id, scale, top }]);
            timeout = setTimeout(loop, (Math.round(Math.random() * 2) * 0.5 + 1.5) * 1000);
        };

        const handleVisibilityChange = () => {
            if (document.hidden) {
                clearTimeout(timeout);
                setClouds([]);
            } else {
                loop();
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        loop();

        return () => {
            clearTimeout(timeout);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        }
    }, []);

    const handleAnimationEnd = (id) => {
        setClouds(prev => prev.filter(cloud => cloud.id !== id));
    };

    return clouds.map(({ id, scale, top }) => {
        return <div
            key={id}
            className="cloud"
            style={{ transform: `scale(${scale})`, top: `${top}%` }}
            onAnimationEnd={() => handleAnimationEnd(id)}
        />
    })
}