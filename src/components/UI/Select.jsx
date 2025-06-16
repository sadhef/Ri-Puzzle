import { ChevronDown } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export function Select({ 
  label, 
  options, 
  value, 
  onChange, 
  placeholder = 'Select an option...', 
  error,
  className = '' 
}) {
  const { isDark } = useTheme();

  return (
    <div className="w-full">
      {label && (
        <label className={`block text-sm font-medium mb-2 ${
          isDark ? 'text-gray-300' : 'text-gray-700'
        }`}>
          {label}
        </label>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`
            w-full px-4 py-2 rounded-lg appearance-none cursor-pointer transition-colors
            ${isDark 
              ? 'bg-gray-700 border-gray-600 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
            }
            border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            ${error ? 'border-red-500' : ''}
            ${className}
          `}
        >
          <option value="" disabled className={isDark ? 'text-gray-400' : 'text-gray-500'}>
            {placeholder}
          </option>
          {options.map((option) => (
            <option 
              key={option.value} 
              value={option.value} 
              className={isDark ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}
            >
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none ${
          isDark ? 'text-gray-400' : 'text-gray-500'
        }`} />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}