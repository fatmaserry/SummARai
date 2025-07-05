import React, { useState, useEffect, useRef } from "react";

export default function SearchDomainToggle({ value, onChange }) {
    const usersLabelRef = useRef(null);
    const systemLabelRef = useRef(null);
    const toggleRef = useRef(null);
    const [sliderStyle, setSliderStyle] = useState({});

    useEffect(() => {
        function updateSlider() {
            const toggleEl = toggleRef.current;
            const activeLabelRef = value === "USER" ? usersLabelRef : systemLabelRef;

            if (!toggleEl || !activeLabelRef.current) return;

            const toggleRect = toggleEl.getBoundingClientRect();
            const labelRect = activeLabelRef.current.getBoundingClientRect();

            const left = labelRect.left - toggleRect.left;
            const width = labelRect.width;

            setSliderStyle({
                left: `${left}px`,
                width: `${width}px`,
            });
        }

        updateSlider();

        window.addEventListener("resize", updateSlider);
        return () => window.removeEventListener("resize", updateSlider);
    }, [value]);

    const toggleValue = () => {
        onChange(value === "USER" ? "BOOK" : "USER");
    };

    return (
        <button
            ref={toggleRef}
            onClick={toggleValue}
            className="relative inline-flex bg-[#4E3693]/60 rounded-full cursor-pointer select-none text-white font-semibold text-sm p-1"
            aria-label="Toggle search domain"
            type="button"
        >
            {/* Sliding background */}
            <span
                className="absolute top-1 bottom-1 bg-[#765CDE] rounded-full shadow-md transition-all duration-300"
                style={sliderStyle}
            />

            {/* Labels */}
            <span
                ref={usersLabelRef}
                className={`relative z-10 text-center px-4 py-2 transition-opacity duration-300 ${value === "USER" ? "opacity-100" : "opacity-60"
                    }`}
            >
                Users
            </span>
            <span
                ref={systemLabelRef}
                className={`relative z-10 text-center px-4 py-2 transition-opacity duration-300 ${value === "BOOK" ? "opacity-100" : "opacity-60"
                    }`}
            >
                System
            </span>
        </button>
    );
}
