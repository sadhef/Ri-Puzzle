import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export function Loading({ message = "Loading...", size = "md" }) {
  const sizes = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16"
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center p-8"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className={`${sizes[size]} text-blue-500 mb-4`}
      >
        <Loader2 className="w-full h-full" />
      </motion.div>
      
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-gray-300 text-center"
      >
        {message}
      </motion.p>
    </motion.div>
  );
}