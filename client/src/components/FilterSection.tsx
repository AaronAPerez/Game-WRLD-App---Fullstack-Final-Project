import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";


interface FilterSectionProps {
  icon: React.ReactNode;
  title: string;
  value: number[];
  onChange: (value: number[]) => void;
  options: { id: number; name: string; }[];
}

const FilterSection = ({ icon, title, value, onChange, options }: FilterSectionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = (id: number) => {
    const newValue = value.includes(id)
      ? value.filter((v) => v !== id)
      : [...value, id];
    onChange(newValue);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 bg-gray-800 text-white
          rounded-lg border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
      >
        <div className="flex items-center gap-2">
          {icon}
          <span>{title}</span>
          {value.length > 0 && (
            <span className="bg-purple-600 text-xs px-2 py-0.5 rounded-full">
              {value.length}
            </span>
          )}
        </div>
        <ChevronDown
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-2 py-2 bg-gray-800 rounded-lg border border-gray-700
              shadow-lg max-h-60 overflow-y-auto custom-scrollbar"
          >
            {options.map((option) => (
              <label
                key={option.id}
                className="flex items-center px-4 py-2 hover:bg-gray-700 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={value.includes(option.id)}
                  onChange={() => handleToggle(option.id)}
                  className="rounded border-gray-600 text-purple-600 focus:ring-purple-500 bg-gray-700"
                />
                <span className="ml-2 text-white">{option.name}</span>
              </label>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FilterSection