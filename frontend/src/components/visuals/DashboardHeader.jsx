import React from 'react';
import { motion } from 'framer-motion';
import { getConfidenceColor } from '../../data/modernizationData';

/**
 * Dashboard Header Bar Component
 * Displays the app title, confidence score, and export button
 */
const DashboardHeader = ({ modernizationResults, confidence }) => {
  const handleExport = () => {
    const data = JSON.stringify(modernizationResults, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'modernization-results.json';
    a.click();
  };

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 px-6 py-4 shadow-lg z-10">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <motion.div
            className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-2xl shadow-lg"
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            🚀
          </motion.div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Modernization Dashboard
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Powered by Multi-Agent AI Pipeline
            </p>
          </div>
        </div>

        {modernizationResults && (
          <div className="flex items-center space-x-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className={`px-4 py-2 rounded-xl text-sm font-bold shadow-md ${getConfidenceColor(confidence)}`}
            >
              🎯 {Math.round(confidence * 100)}% Confidence
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExport}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg font-semibold flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Export Results</span>
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardHeader;
