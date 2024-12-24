import { cn } from "../../../utils/styles";

export const HeroHighlight = ({ 
  children,
  className 
}: { 
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn(
      "w-full overflow-hidden relative flex items-center justify-center",
      className
    )}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent animate-gradient" />
      {children}
    </div>
  );
};

export const Highlight = ({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <span className={cn(
      "relative inline-block px-2",
      "before:absolute before:inset-0 before:bg-indigo-500/20",
      "before:transform before:skew-x-12 before:-z-10 before:rounded",
      className
    )}>
      {children}
    </span>
  );
};