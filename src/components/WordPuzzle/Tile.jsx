import { motion } from 'framer-motion';
import { FEEDBACK_TYPES } from '../../lib/constants';
import { useTheme } from '../../contexts/ThemeContext';

export function Tile({ 
  char, 
  feedback = FEEDBACK_TYPES.DEFAULT, 
  isRevealed = false, 
  delay = 0, 
  isCompleted = false 
}) {
  const { isDark } = useTheme();

  const getFeedbackStyles = () => {
    switch (feedback) {
      case FEEDBACK_TYPES.CORRECT:
        return 'bg-green-600 text-white border-green-600';
      case FEEDBACK_TYPES.PRESENT:
        return 'bg-yellow-600 text-white border-yellow-600';
      case FEEDBACK_TYPES.ABSENT:
        return isDark 
          ? 'bg-gray-600 text-white border-gray-600' 
          : 'bg-gray-400 text-white border-gray-400';
      default:
        return char 
          ? isDark 
            ? 'bg-gray-700 text-white border-gray-600' 
            : 'bg-gray-100 text-gray-900 border-gray-300'
          : isDark 
            ? 'bg-transparent text-transparent border-gray-600' 
            : 'bg-transparent text-transparent border-gray-300';
    }
  };

  const variants = {
    initial: { 
      scale: 1, 
      rotateY: 0,
    },
    filled: { 
      scale: 1.05,
      transition: { duration: 0.1 }
    },
    revealed: {
      rotateY: [0, 90, 0],
      scale: [1, 1.1, 1],
      transition: {
        duration: 0.6,
        delay: delay,
        times: [0, 0.5, 1]
      }
    },
    completed: {
      scale: [1, 1.2, 1],
      transition: {
        duration: 0.5,
        delay: delay,
        repeat: 2,
        repeatType: "reverse"
      }
    }
  };

  return (
    <motion.div
      className={`
        w-12 h-12 md:w-14 md:h-14 border-2 rounded-lg
        flex items-center justify-center font-bold text-lg md:text-xl
        transition-all duration-200 shadow-sm
        ${getFeedbackStyles()}
      `}
      variants={variants}
      initial="initial"
      animate={
        isCompleted ? "completed" :
        isRevealed ? "revealed" : 
        char ? "filled" : "initial"
      }
    >
      {char}
    </motion.div>
  );
}