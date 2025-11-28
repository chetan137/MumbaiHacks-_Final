import React from 'react';
import { motion } from 'framer-motion';
import { aiAgents } from '../../data/modernizationData';

/**
 * Processing Status Component
 * Displays processing status, errors, and agent progress
 */
const ProcessingStatus = ({ isProcessing, processingStatus, error, onDismissError }) => {
  if (!isProcessing && !processingStatus && !error) return null;

  // Error State
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-6 mb-6"
      >
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <span className="text-4xl">⚠️</span>
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-red-800 dark:text-red-200 text-lg mb-2">
              Processing Error
            </h4>
            <p className="text-red-700 dark:text-red-300 mb-3">
              {error}
            </p>
            <button
              onClick={onDismissError}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Dismiss
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  // Processing State
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-6 mb-6"
    >
      <div className="flex items-center space-x-4">
        <motion.div
          className="flex-shrink-0 w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        ></motion.div>
        <div className="flex-1">
          <h4 className="font-bold text-blue-800 dark:text-blue-200 text-lg mb-1">
            🚀 AI Agent Processing Your Files
          </h4>
          <p className="text-blue-700 dark:text-blue-300 font-medium">
            {processingStatus?.logs?.slice(-1)[0] || 'Multi-agent pipeline analyzing and modernizing your legacy code...'}
          </p>
          {processingStatus?.progress !== undefined && (
            <div className="mt-3">
              <div className="flex justify-between text-sm text-blue-600 dark:text-blue-400 mb-1">
                <span>Progress</span>
                <span className="font-bold">{processingStatus.progress}%</span>
              </div>
              <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-3 overflow-hidden">
                <motion.div
                  className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${processingStatus.progress}%` }}
                  transition={{ duration: 0.5 }}
                ></motion.div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Agent Status Indicators */}
      <div className="mt-4 grid grid-cols-4 gap-3">
        {aiAgents.map((agent, idx) => (
          <div
            key={agent.name}
            className={`text-center py-2 px-3 rounded-lg ${
              idx === 0 ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
              idx === 1 ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' :
              idx === 2 ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400' :
              'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
            }`}
          >
            <div className="text-xs font-bold">{agent.name}</div>
            <div className="text-lg">{agent.icon}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default ProcessingStatus;
