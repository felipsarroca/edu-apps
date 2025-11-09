import React from 'react';

export const PhysicsGraphIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <rect width="48" height="48" rx="8" fill="#E0F2FE"/>
        <path d="M7 41H41" stroke="#374151" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M7 41V7" stroke="#374151" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M11 35L31 15" stroke="#34D399" strokeWidth="4" strokeLinecap="round"/>
        <path d="M12 19C12 19 19.3333 11 26 11C32.6667 11 36 19 36 19" stroke="#60A5FA" strokeWidth="4" strokeLinecap="round"/>
        <circle cx="11" cy="35" r="4" fill="#FBBF24"/>
        <circle cx="37" cy="22" r="4" fill="#FBBF24"/>
        <circle cx="26" cy="13" r="4" fill="#F472B6"/>
    </svg>
);