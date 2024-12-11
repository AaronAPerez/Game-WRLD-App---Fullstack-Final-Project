import { useCallback } from 'react';
import type { Platform } from '../types/rawg';
import { 
  Monitor,
  Smartphone,
  Globe, 
  Apple, 
  Terminal,
  type LucideIcon
} from 'lucide-react';
import { cn } from '../utils/styles';

// Platform-specific icons using SVG for better visual quality
const ConsoleIcons = {
  PlayStation: ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 50 50" fill="currentColor">
      <path d="M46.32 32.58c-1.02.67-3.92 1.94-3.92 1.94l-15.97 5v-2.86l12.23-4.3c1.4-.67 1.65-.97.33-1.33-1-.3-3.3-.33-4.63 0l-7.93 2.66v-3.2c0 .33 2.64-.97 5.94-2.3 3.3-1.33 5.94-1.66 8.58-1.33 2.97.67 2.64 1.33 1.65 2zm-16.97 4.62v7.89l-11.22-3.62c-1.98-.67-3.3-2.32-3.3-3.97 0-1.65.99-2 2.97-1.33l11.55 3.2v-3.2l-.66-.33s-8.25-3.97-11.88-4.96c-2.97-.97-5.61.33-5.61 2.97 0 2.64 1.98 5.63 5.61 6.96l12.87 4.3v3.97l-17.82-5.63C3.3 37.21 0 34.24 0 29.94c0-2.65 1.32-4.3 3.63-4.3.99 0 1.65.33 1.65.33l17.16 6.29v-8.25l6.91 3.2z"/>
      <path d="M47.64 18.7c-2.97-.97-6.6-.67-10.23.66-7.59 2.65-9.9 7.26-9.9 7.26l.33-13.88c2.97-.97 5.94-1.66 8.58-2.32 3.63-.67 7.26-.67 10.23.33 3.3.97 3.63 2.98 3.63 3.97-.33 1.33-1.32 2.98-2.64 3.97z"/>
    </svg>
  ),
  
  Xbox: ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 88 88" fill="currentColor">
      <path d="M44 0C19.7 0 0 19.7 0 44s19.7 44 44 44 44-19.7 44-44S68.3 0 44 0zm20.2 31.6c4.4-5.3 7.2-5.8 8.6-5.9 0 .2.1.5.1.7 0 7.6-4 14.7-10.5 18.7-9.5 5.9-17.8 16.8-17.8 16.8s-8.3-10.9-17.8-16.8C20.2 41.1 16.2 34 16.2 26.4c0-.2 0-.5.1-.7 1.4.2 4.2.6 8.6 5.9 6.6 8 12.2 13.2 16 16.6-.2-.2-.3-.3-.5-.5-3.3-3.3-10.3-10.3-15-19.1-3.1-5.8-1.8-8.6-1.1-9.5.2.1.5.2.7.4 1.3.9 4.9 3.4 14.3 17.3C45.5 46 49.2 50.6 44 56.2c-5.2-5.6-1.5-10.2 4.7-19.4 9.4-13.9 13-16.4 14.3-17.3.2-.2.5-.3.7-.4.7.9 2 3.7-1.1 9.5-4.7 8.8-11.7 15.8-15 19.1l-.5.5c3.8-3.4 9.4-8.6 16-16.6z"/>
    </svg>
  ),
  
  Nintendo: ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 200 70" fill="currentColor">
      <path d="M37.5.1h125c20.7 0 37.5 16.8 37.5 37.5v25c0 20.7-16.8 37.5-37.5 37.5h-125C16.8 100.1 0 83.3 0 62.6v-25C0 16.9 16.8.1 37.5.1zm3.8 18.7c-13 0-23.5 10.5-23.5 23.5v15.6c0 13 10.5 23.5 23.5 23.5H159c13 0 23.5-10.5 23.5-23.5V42.3c0-13-10.5-23.5-23.5-23.5H41.3z"/>
    </svg>
  )
};

interface PlatformIconsProps {
  platforms: Platform[];
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const PlatformIcons = ({ 
  platforms, 
  className,
  size = 'md' 
}: PlatformIconsProps) => {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const getPlatformDetails = useCallback((platformName: string): { 
    Icon: LucideIcon | React.FC<{ className?: string }>, 
    color: string 
  } => {
    const name = platformName.toLowerCase();
    
    if (name.includes('playstation')) {
      return { Icon: ConsoleIcons.PlayStation, color: '#006FCD' };
    }
    if (name.includes('xbox')) {
      return { Icon: ConsoleIcons.Xbox, color: '#107C10' };
    }
    if (name.includes('nintendo') || name.includes('switch')) {
      return { Icon: ConsoleIcons.Nintendo, color: '#E60012' };
    }
    if (name.includes('pc') || name.includes('windows')) {
      return { Icon: Monitor, color: 'text-slate-100' };
    }
    if (name.includes('ios') || name.includes('ipad')) {
      return { Icon: Apple, color: 'text-slate-100' };
    }
    if (name.includes('android')) {
      return { Icon: Smartphone, color: 'text-green-500' };
    }
    if (name.includes('linux')) {
      return { Icon: Terminal, color: 'text-orange-500' };
    }
    if (name.includes('mac')) {
      return { Icon: Apple, color: 'text-slate-100' };
    }
    
    return { Icon: Globe, color: 'text-blue-400' };
  }, []);

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {platforms?.map((platform) => {
        const { Icon, color } = getPlatformDetails(platform.name);
        return (
          <span 
            key={platform.id} 
            title={platform.name}
            className={cn(
              "transition-colors duration-200",
              "hover:opacity-100",
              "opacity-75",
              typeof color === 'string' && !color.startsWith('text-') && `text-[${color}]`,
              color.startsWith('text-') && color
            )}
          >
            <Icon className={sizeClasses[size]} />
          </span>
        );
      })}
    </div>
  );
};