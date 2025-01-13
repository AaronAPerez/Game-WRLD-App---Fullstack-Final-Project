import { cn } from '../utils/styles';

const HeroHighlight = ({ 
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

export default HeroHighlight;
