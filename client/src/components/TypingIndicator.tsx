import { motion } from 'framer-motion';

interface TypingIndicatorProps {
  username: string;
}

export function TypingIndicator({ username }: TypingIndicatorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="text-sm text-gray-400 flex items-center gap-2 mb-2"
    >
      <span>{username} is typing</span>
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-1 h-1 bg-gray-400 rounded-full"
            animate={{
              y: ["0%", "-50%", "0%"],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.1,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}