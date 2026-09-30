import React, { useState, useEffect } from 'react';
import '../Seeker/Dashboard.css'; // Make sure this path is correct based on your folder structure
// Or you can create a separate Timer.css

export default function Timer({ isActive, totalHours = 8 }) {
    
    const [time, setTime] = useState({ hrs: 0, mins: 0, secs: 0 });

    useEffect(() => {
        let interval;
        if (isActive) {
            // When active, start with this time (or fetch from backend)
            setTime({ hrs: 2, mins: 25, secs: 16 });
            
            interval = setInterval(() => {
                setTime(prev => {
                    let { hrs, mins, secs } = prev;
                    secs += 1;
                    if (secs >= 60) { secs = 0; mins += 1; }
                    if (mins >= 60) { mins = 0; hrs += 1; }
                    return { hrs, mins, secs };
                });
            }, 1000);
        } else {
            // When inactive (waiting/share location), reset to 0
            setTime({ hrs: 0, mins: 0, secs: 0 });
        }
        return () => clearInterval(interval);
    }, [isActive]);

    // UI Size Configuration
    const radius = 60; // Increased radius for bigger circles
    const strokeWidth = 8;
    const size = (radius * 2) + (strokeWidth * 2);
    const center = size / 2;
    const circumference = 2 * Math.PI * radius;

    const calculateOffset = (value, max) => {
        return circumference - (value / max) * circumference;
    };

    const hrsOffset = calculateOffset(time.hrs, totalHours);
    const minsOffset = calculateOffset(time.mins, 60);
    const secsOffset = calculateOffset(time.secs, 60);

    return (
        <div className={`timer-container ${!isActive ? 'timer-inactive-mode' : 'timer-active-mode'}`}>
            {/* Hours Circle */}
            <div className="timer-circle-wrapper">
                <svg width={size} height={size} className="timer-svg-big">
                    <circle 
                        className="timer-track-big" 
                        cx={center} cy={center} r={radius} strokeWidth={strokeWidth}
                    />
                    <circle 
                        className="timer-fill-big" 
                        cx={center} cy={center} r={radius} strokeWidth={strokeWidth}
                        style={{ 
                            strokeDasharray: circumference, 
                            strokeDashoffset: isActive ? hrsOffset : circumference,
                            transition: 'background-color 0.3s, transform 0.2s',
                            boxShadow: '0 0 20px rgba(0, 209, 178, 0.7)',
                            stroke: isActive ? '#2bff00' : '#3A3A3C' // Green if active, Dark Grey if inactive
                        }} 
                    />
                </svg>
                <div className="timer-text-content">
                    <div className="timer-number-big">{String(time.hrs).padStart(2, '0')}</div>
                    <div className="timer-label-big">Hrs</div>
                </div>
            </div>

            {/* Minutes Circle */}
            <div className="timer-circle-wrapper">
                <svg width={size} height={size} className="timer-svg-big">
                    <circle 
                        className="timer-track-big" 
                        cx={center} cy={center} r={radius} strokeWidth={strokeWidth}
                    />
                    <circle 
                        className="timer-fill-big" 
                        cx={center} cy={center} r={radius} strokeWidth={strokeWidth}
                        style={{ 
                            strokeDasharray: circumference, 
                            strokeDashoffset: isActive ? minsOffset : circumference,
                            stroke: isActive ? '#2bff00' : '#3A3A3C'
                        }} 
                    />
                </svg>
                <div className="timer-text-content">
                    <div className="timer-number-big">{String(time.mins).padStart(2, '0')}</div>
                    <div className="timer-label-big">Mins</div>
                </div>
            </div>

            {/* Seconds Circle */}
            <div className="timer-circle-wrapper">
                <svg width={size} height={size} className="timer-svg-big">
                    <circle 
                        className="timer-track-big" 
                        cx={center} cy={center} r={radius} strokeWidth={strokeWidth}
                    />
                    <circle 
                        className="timer-fill-big" 
                        cx={center} cy={center} r={radius} strokeWidth={strokeWidth}
                        style={{ 
                            strokeDasharray: circumference, 
                            strokeDashoffset: isActive ? secsOffset : circumference,
                            stroke: isActive ? '#2bff00' : '#3A3A3C'
                        }} 
                    />
                </svg>
                <div className="timer-text-content">
                    <div className="timer-number-big">{String(time.secs).padStart(2, '0')}</div>
                    <div className="timer-label-big">Sec</div>
                </div>
            </div>
        </div>
    );
}