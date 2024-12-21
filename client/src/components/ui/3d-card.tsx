import { cn } from "../../utils/styles";
import { createContext, useContext, useRef, useState } from "react";
import {
  motion,
  useSpring,
  useTransform,
} from "framer-motion";

const MouseEnterContext = createContext<{
  mouseX: number;
  mouseY: number;
}>({
  mouseX: 0,
  mouseY: 0,
});

export const CardContainer = ({
  children,
  className,
  containerClassName,
}: {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMouseX(e.clientX - rect.left);
    setMouseY(e.clientY - rect.top);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={cn("relative", containerClassName)}
    >
      <div className={cn("group/card relative", className)}>
        <MouseEnterContext.Provider value={{ mouseX, mouseY }}>
          {children}
        </MouseEnterContext.Provider>
      </div>
    </div>
  );
};

export const CardBody = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const { mouseX, mouseY } = useContext(MouseEnterContext);

  const rotateX = useSpring(useTransform(mouseY, [0, 200], [10, -10]), {
    stiffness: 150,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(mouseX, [0, 200], [-10, 10]), {
    stiffness: 150,
    damping: 20,
  });

  return (
    <motion.div
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const CardItem = ({
  as: Component = "div",
  children,
  className,
  translateZ = 0,
  onClick,
}: {
  as?: any;
  children: React.ReactNode;
  className?: string;
  translateZ?: number;
  onClick?: (e: React.MouseEvent) => void;
}) => {
  return (
    <Component
      onClick={onClick}
      className={className}
      style={{
        transform: `translateZ(${translateZ}px)`,
      }}
    >
      {children}
    </Component>
  );
};