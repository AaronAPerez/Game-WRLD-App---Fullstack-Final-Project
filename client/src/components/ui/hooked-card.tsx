import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useSpring } from 'framer-motion';
import { cn } from '../../utils/styles';

// Types
interface Position {
  x: number;
  y: number;
}

interface MouseTrackingResult {
  position: Position;
  isHovering: boolean;
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
  rotationIntensity?: number;
  hoverScale?: number;
  perspective?: number;
}

interface CardElementProps {
  children: React.ReactNode;
  depth?: number;
  className?: string;
  onClick?: () => void;
}

// Custom hook for mouse tracking
const useMouseTracking = (ref: React.RefObject<HTMLElement>): MouseTrackingResult => {
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    
    // Calculate normalized position (-1 to 1)
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);

    setPosition({ x, y });
  }, [ref]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => {
      setIsHovering(false);
      setPosition({ x: 0, y: 0 });
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [ref, handleMouseMove]);

  return { position, isHovering };
};

// Main HookedCard component
export const HookedCard = ({
  children,
  className,
  rotationIntensity = 10,
  hoverScale = 1.05,
  perspective = 1000
}: CardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { position, isHovering } = useMouseTracking(cardRef);

  // Create smooth rotations using springs
  const rotateX = useSpring(position.y * rotationIntensity, {
    stiffness: 150,
    damping: 20
  });

  const rotateY = useSpring(position.x * rotationIntensity, {
    stiffness: 150,
    damping: 20
  });

  const scale = useSpring(isHovering ? hoverScale : 1, {
    stiffness: 150,
    damping: 20
  });

  return (
    <motion.div
      ref={cardRef}
      style={{
        rotateX: isHovering ? rotateX : 0,
        rotateY: isHovering ? rotateY : 0,
        scale,
        transformStyle: 'preserve-3d',
        perspective,
      }}
      className={cn(
        'transition-transform duration-200',
        'will-change-transform',
        className
      )}
    >
      {children}
    </motion.div>
  );
};

// CardElement component for 3D-transformed children
export const CardElement = ({
  children,
  depth = 0,
  className,
  onClick
}: CardElementProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'transform-gpu backface-visible',
        className
      )}
      style={{
        transform: `translateZ(${depth}px)`,
        transformStyle: 'preserve-3d'
      }}
    >
      {children}
    </div>
  );
};

// Example usage component
export const Card3D = () => {
  return (
    <HookedCard className="bg-stone-900 rounded-xl p-6 border border-stone-800">
      {/* Title with highest elevation */}
      <CardElement depth={60} className="mb-4">
        <h2 className="text-2xl font-bold text-white">
          Interactive 3D Card
        </h2>
      </CardElement>

      {/* Image with medium elevation */}
      <CardElement depth={40} className="mb-4">
        <img
          src="/api/placeholder/400/200"
          alt="Card image"
          className="w-full h-48 object-cover rounded-lg"
        />
      </CardElement>

      {/* Description with lower elevation */}
      <CardElement depth={20} className="mb-4">
        <p className="text-gray-400">
          This card demonstrates the 3D hover effect using the HookedCard component.
          Move your mouse over the card to see the effect in action.
        </p>
      </CardElement>

      {/* Button with distinct elevation */}
      <CardElement depth={30}>
        <button className="w-full px-4 py-2 bg-indigo-500/20 text-indigo-400 rounded-lg hover:bg-indigo-500/30 transition-colors">
          Interactive Button
        </button>
      </CardElement>
    </HookedCard>
  );
};