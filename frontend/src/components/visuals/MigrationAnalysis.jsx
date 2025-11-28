import React from 'react';
import { motion } from 'framer-motion';
import { migrationMetrics } from '../../data/modernizationData';

/**
 * Migration Analysis Visualization Component
 * Displays detailed migration metrics in a card layout
 */
const MigrationAnalysis = ({ dashboardData, confidence }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-2xl">
          📊
        </div>
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          Migration Analysis
        </h3>
      </div>

      <div className="space-y-4">
        {migrationMetrics.map((item, idx) => {
          let value;
          if (item.key === 'confidence') {
            value = confidence || 0;
          } else {
            value = dashboardData?.[item.key] || 0;
          }

          const displayValue = item.format ? item.format(value) : value;

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{item.icon}</span>
                <span className="text-gray-600 dark:text-gray-400 font-medium">{item.label}</span>
              </div>
              <span className={`font-bold text-lg text-${item.color}-600 dark:text-${item.color}-400`}>
                {displayValue}
              </span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default MigrationAnalysis;
