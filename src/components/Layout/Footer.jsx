import { Heart, Github, Twitter, Coffee } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { motion } from 'framer-motion';

export function Footer() {
  const { isDark } = useTheme();

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`border-t px-4 py-8 mt-16 transition-colors duration-300 ${
        isDark 
          ? 'bg-gray-900/50 border-gray-700/50' 
          : 'bg-gray-50/50 border-gray-200/50'
      }`}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <span className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Word Puzzle
              </span>
            </div>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Challenge your mind with beautiful word puzzles powered by AI
            </p>
          </div>

          {/* Links Section */}
          <div className="text-center">
            <h4 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Quick Links
            </h4>
            <div className="space-y-2">
              <div>
                <button className={`text-sm hover:underline transition-colors ${
                  isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}>
                  How to Play
                </button>
              </div>
              <div>
                <button className={`text-sm hover:underline transition-colors ${
                  isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}>
                  Privacy Policy
                </button>
              </div>
              <div>
                <button className={`text-sm hover:underline transition-colors ${
                  isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}>
                  Terms of Service
                </button>
              </div>
            </div>
          </div>

          {/* Social & Support */}
          <div className="text-center md:text-right">
            <h4 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Connect
            </h4>
            <div className="flex items-center justify-center md:justify-end space-x-4 mb-4">
              <motion.a 
                whileHover={{ scale: 1.1, y: -2 }}
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`p-2 rounded-lg transition-colors ${
                  isDark 
                    ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Github className="w-5 h-5" />
              </motion.a>
              <motion.a 
                whileHover={{ scale: 1.1, y: -2 }}
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`p-2 rounded-lg transition-colors ${
                  isDark 
                    ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Twitter className="w-5 h-5" />
              </motion.a>
              <motion.a 
                whileHover={{ scale: 1.1, y: -2 }}
                href="https://buymeacoffee.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`p-2 rounded-lg transition-colors ${
                  isDark 
                    ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Coffee className="w-5 h-5" />
              </motion.a>
            </div>
            <div className="flex items-center justify-center md:justify-end space-x-2">
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Made with
              </span>
              <Heart className="w-4 h-4 text-red-500" />
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                by
              </span>
              <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Sadhef
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={`mt-8 pt-6 border-t text-center ${
          isDark ? 'border-gray-700/50' : 'border-gray-200/50'
        }`}>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            © 2025 Ri-Puzzle
          </p>
        </div>
      </div>
    </motion.footer>
  );
}