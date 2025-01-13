import { cn } from '../utils/styles';

const Highlight = ({
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

export default Highlight;