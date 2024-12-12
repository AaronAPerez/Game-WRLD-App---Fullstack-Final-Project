import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, LucideIcon } from 'lucide-react';
import { cn } from '../utils/styles';

interface SelectItem {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  items: SelectItem[];
  icon?: LucideIcon;
  className?: string;
}

export const Select = ({ value, onValueChange, items, icon: Icon, className }: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedItem = items.find(item => item.value === value);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg",
          "text-sm font-medium",
          className
        )}
      >
        {Icon && <Icon className="w-4 h-4" />}
        <span>{selectedItem?.label}</span>
        <ChevronDown className={cn(
          "w-4 h-4 transition-transform",
          isOpen && "transform rotate-180"
        )} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute z-10 w-full mt-1 bg-stone-800 rounded-lg shadow-lg border border-stone-700 py-1"
            >
              {items.map((item) => (
                <button
                  key={item.value}
                  onClick={() => {
                    onValueChange(item.value);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full px-3 py-2 text-left text-sm",
                    "hover:bg-stone-700 transition-colors",
                    item.value === value && "text-indigo-400"
                  )}
                >
                  {item.label}
                </button>
              ))}
            </motion.div>
            <div 
              className="fixed inset-0 z-0" 
              onClick={() => setIsOpen(false)} 
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
};