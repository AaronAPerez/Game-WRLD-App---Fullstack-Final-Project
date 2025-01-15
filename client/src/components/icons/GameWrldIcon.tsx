import { cn } from "@/utils";
import { HTMLAttributes, useState } from 'react';

interface LogoProps extends HTMLAttributes<SVGElement> {
  className?: string;
  variant?: 'default' | 'small';
  isActive?: boolean;
  onClick?: () => void;
}

const GameWrldIcon = ({ 
  className, 
  variant = 'default', 
  isActive = false,
  onClick,
  ...props 
}: LogoProps) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    onClick?.();
    // Reset animation after it completes
    setTimeout(() => setIsClicked(false), 300);
  };

  return (
    <svg 
      width="20" 
      height="20" 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      onClick={handleClick}
      className={cn(
        "transition-all duration-300 ease-out cursor-pointer",
        isClicked && "scale-90",
        isActive && "filter drop-shadow-glow",
        className
      )}
      {...props}
    >
      {/* custom SVG path */}
      <svg 
            className={cn(
              "transition-transform duration-200 hover:scale-105",
              variant === 'default' ? "w-32" : "w-24",
              className
            )}
            viewBox="0 0 290 85" 
            xmlns="http://www.w3.org/2000/svg"
            aria-label="Game WRLD Logo"
            {...props}
          >
            <defs>
              {/* Glow Effect */}
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
              
              {/* Text Gradient */}
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
                >
                  <animate
                    attributeName="stop-color"
                    values="#4F46E5; #06B6D4; #4F46E5"
                    dur="4s"
                    repeatCount="indefinite"
                  />
                </stop>
                <stop 
                  offset="100%" 
                  stopColor="#06B6D4"
                >
                  <animate
                    attributeName="stop-color"
                    values="#06B6D4; #4F46E5; #06B6D4"
                    dur="4s"
                    repeatCount="indefinite"
                  />
                </stop>
              </linearGradient>
      
              {/* Controller Fill Gradient */}
              <linearGradient
                id="controllerFill"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop
                  offset="0%"
                  stopColor="#1F2937"
                  stopOpacity="0.9"
                />
                <stop
                  offset="100%"
                  stopColor="#111827"
                  stopOpacity="0.9"
                />
              </linearGradient>
            </defs>
      
            {/* Controller Shape with Fill and Glow */}
            <path 
              d="M40 30 C40 18 50 10 62 10 L78 10 C90 10 100 18 100 30 L100 50 C100 62 90 70 78 70 L62 70 C50 70 40 62 40 50 Z" 
              fill="url(#controllerFill)"
              stroke="url(#textGradient)" 
              strokeWidth="3"
              filter="drop-shadow(0 0 8px rgba(79, 70, 229, 0.3))"
            />
            
            {/* D-Pad with Glow */}
            <g filter="drop-shadow(0 0 4px rgba(79, 70, 229, 0.5))">
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
            </g>
            
            {/* Buttons with Glow */}
            <g filter="drop-shadow(0 0 4px rgba(6, 182, 212, 0.5))">
              <circle 
                cx="85" 
                cy="40" 
                r="3" 
                fill="#06B6D4"
              >
                <animate
                  attributeName="opacity"
                  values="1;0.7;1"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle 
                cx="90" 
                cy="35" 
                r="3" 
                fill="#06B6D4"
              >
                <animate
                  attributeName="opacity"
                  values="0.7;1;0.7"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </circle>
            </g>
            
            {/* Text with Gradient and Glow */}
            <text 
              x="110" 
              y="48" 
              fontFamily="Arial"
              fontSize="28" 
              fontWeight="bold" 
              fill="url(#textGradient)"
              filter="drop-shadow(0 0 8px rgba(79, 70, 229, 0.3))"
            >
            </text>
          </svg>
     {/* Add animation elements */}
     {isActive && (
        <g className="animate-pulse">
          <circle 
            cx="12" 
            cy="12" 
            r="11" 
            stroke="url(#textGradient)"
            strokeWidth="2"
            fill="none"
          >
            <animate
              attributeName="r"
              values="11;12;11"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
        </g>
      )}
    </svg>
  );
};

export default GameWrldIcon;

