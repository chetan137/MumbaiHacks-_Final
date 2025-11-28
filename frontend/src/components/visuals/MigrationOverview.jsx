import React from 'react';
import { motion } from 'framer-motion';
import { keyBenefits, implementationSteps } from '../../data/modernizationData';

/**
 * Migration Overview Component
 * Displays migration summary with benefits and implementation steps
 */
const MigrationOverview = ({ documentation }) => {
  if (!documentation) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8"
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center text-2xl">
          📖
        </div>
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          Migration Overview
        </h3>
      </div>

      <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
        {documentation.summary}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Key Benefits */}
        <div>
          <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-4 flex items-center space-x-2">
            <span className="text-2xl">✨</span>
            <span>Key Benefits</span>
          </h4>
          <ul className="space-y-2">
            {keyBenefits.map((benefit, idx) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-400"
              >
                <span className="text-green-500">✓</span>
                <span>{benefit}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Implementation Steps */}
        <div>
          <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-4 flex items-center space-x-2">
            <span className="text-2xl">🎯</span>
            <span>Implementation Steps</span>
          </h4>
          <ul className="space-y-2">
            {implementationSteps.map((step, idx) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-400"
              >
                <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  {idx + 1}
                </span>
                <span>{step}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default MigrationOverview;
