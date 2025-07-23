"use client";

import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import { useState, useEffect } from "react";

const StarRating = ({
    rating,
    size = 16,
    onRate,
    disabled = false,
}) => {
    const [hoverRating, setHoverRating] = useState(0);
    const [currentRating, setCurrentRating] = useState(rating);

    useEffect(() => {
        setCurrentRating(rating);
    }, [rating]);

    const handleStarClick = (selectedRating) => {
        if (disabled) return;
        setCurrentRating(selectedRating);
        if (onRate) {
            onRate(selectedRating);
        }
    };

    const handleMouseEnter = (index) => {
        if (disabled) return;
        setHoverRating(index + 1);
    };

    const handleMouseLeave = () => {
        if (disabled) return;
        setHoverRating(0);
    };

    const displayRating = hoverRating > 0 ? hoverRating : currentRating;

    return (
        <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => {
                const fillPercentage =
                    i < displayRating
                        ? 100
                        : i === Math.floor(displayRating) && displayRating % 1 !== 0
                            ? (displayRating % 1) * 100
                            : 0;

                return (
                    <div
                        key={i}
                        className="relative inline-block"
                        style={disabled ? {} : { cursor: 'pointer' }}
                        onMouseEnter={() => handleMouseEnter(i)}
                        onMouseLeave={handleMouseLeave}
                        onClick={() => handleStarClick(i + 1)}
                    >
                        <Star
                            className={cn(
                                `w-${size / 4} h-${size / 4} text-gray-600 transition-colors`,
                                { "cursor-not-allowed": disabled }
                            )}
                            style={{ width: size, height: size }}
                        />
                        <div
                            className="absolute top-0 left-0 overflow-hidden"
                            style={{ width: `${fillPercentage}%` }}
                        >
                            <Star
                                className="text-yellow-400 fill-yellow-400"
                                style={{ width: size, height: size }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default StarRating;