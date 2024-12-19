import { HTMLAttributes } from 'react';
import { cn } from '../utils/styles';

interface LogoProps extends HTMLAttributes<SVGElement> {
  className?: string;
}

export default function Logo({ className, ...props }: LogoProps) {
  return (
    <svg 
      className={cn("w-32", className)}
      viewBox="0 0 290 85" 
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Game WRLD Logo"
      {...props}
    >
      <defs>
        <linearGradient 
          id="glow" 
          x1="0%" 
          y1="0%" 
          x2="100%" 
          y2="100%"
        >
          <stop 
            offset="0%" 
            stopColor="#4F46E5" 
            stopOpacity="0.2" 
          />
          <stop 
            offset="100%" 
            stopColor="#fff" 
            stopOpacity="0.2" 
          />
        </linearGradient>
        
        <linearGradient 
          id="textGradient" 
          x1="0%" 
          y1="0%" 
          x2="100%" 
          y2="0%"
        >
          <stop 
            offset="0%" 
            stopColor="#4F46E5" 
          />
          <stop 
            offset="100%" 
            stopColor="#06B6D4" 
          />
        </linearGradient>
      </defs>

      {/* Controller Shape */}
      <path 
        d="M40 30 C40 18 50 10 62 10 L78 10 C90 10 100 18 100 30 L100 50 C100 62 90 70 78 70 L62 70 C50 70 40 62 40 50 Z" 
        fill="none" 
        stroke="url(#textGradient)" 
        strokeWidth="3"
      />
      
      {/* D-Pad */}
      <rect 
        x="50" 
        y="35" 
        width="4" 
        height="12" 
        rx="1" 
        fill="#4F46E5"
      />
      <rect 
        x="46" 
        y="39" 
        width="12" 
        height="4" 
        rx="1" 
        fill="#4F46E5"
      />
      
      {/* Buttons */}
      <circle 
        cx="85" 
        cy="40" 
        r="3" 
        fill="#06B6D4"
      />
      <circle 
        cx="90" 
        cy="35" 
        r="3" 
        fill="#06B6D4"
      />
      
      {/* Text */}
      <text 
        x="110" 
        y="48" 
        fontFamily="Arial"
        fontSize="28" 
        fontWeight="bold" 
        fill="url(#textGradient)"
      >
        GAME WRLD
      </text>
    </svg>
  );
}