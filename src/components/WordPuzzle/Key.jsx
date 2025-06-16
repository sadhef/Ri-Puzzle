import { motion } from 'framer-motion';
import { Delete, CornerDownLeft } from 'lucide-react';
import { FEEDBACK_TYPES } from '../../lib/constants';
import { useTheme } from '../../contexts/ThemeContext';

export function Key({ value, status, onClick, disabled = false }) {
  const { isDark } = useTheme();

  const getKeyStyles = () => {
    switch (status) {
      case FEEDBACK_TYPES.CORRECT:
        return 'bg-green-600 text-white';
      case FEEDBACK_TYPES.PRESENT:
        return 'bg-yellow-600 text-white';
      case FEEDBACK_TYPES.ABSENT:
        return isDark 
          ? 'bg-gray-600 text-gray-300' 
          : 'bg-gray-400 text-gray-100';
      default:
        return isDark 
          ? 'bg-gray-700 hover:bg-gray-600 text-white' 
          : 'bg-gray-200 hover:bg-gray-300 text-gray-900';
    }
  };

  const getKeySize = () => {
    if (value === 'ENTER' || value === 'DEL') {
      return 'px-3 py-3 md:px-4 md:py-3 text-xs md:text-sm min-w-[60px]';
    }
    return 'w-8 h-10 md:w-10 md:h-12 text-sm md:text-base';
  };

  const renderKeyContent = () => {
    switch (value) {
      case 'DEL':
        return <Delete className="w-4 h-4 md:w-5 md:h-5" />;
      case 'ENTER':
        return <CornerDownLeft className="w-4 h-4 md:w-5 md:h-5" />;
      default:
        return value;
    }
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.1 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      onClick={() => !disabled && onClick(value)}
      disabled={disabled}
      className={`
        ${getKeyStyles()} ${getKeySize()}
        rounded font-semibold flex items-center justify-center
        transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500
        disabled:opacity-50 disabled:cursor-not-allowed
        shadow-sm hover:shadow-md
      `}
    >
      {renderKeyContent()}
    </motion.button>
  );
}