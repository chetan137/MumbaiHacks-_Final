import React from 'react';
import { motion } from 'framer-motion';

/**
 * Reusable Overview Card Component
 * Displays a metric with icon, value, description, and optional trend
 */
const OverviewCard = ({ title, value, description, icon, trend, gradient }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03, y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8 group"
    >
      <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${gradient} opacity-10 rounded-full -mr-20 -mt-20 transition-transform duration-500 group-hover:scale-150`}></div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <motion.div
              className={`p-3 rounded-xl bg-gradient-to-br ${gradient} bg-opacity-10 text-white shadow-lg`}
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <span className="text-4xl filter drop-shadow-md">{icon}</span>
            </motion.div>
            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
              {title}
            </h3>
          </div>
          {trend !== undefined && (
            <span className={`text-sm px-3 py-1.5 rounded-full font-bold flex items-center shadow-sm ${
              trend > 0 ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400 ring-1 ring-green-200 dark:ring-green-800' : 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 ring-1 ring-red-200 dark:ring-red-800'
            }`}>
              {trend > 0 ? '↗' : '↘'} {Math.abs(trend)}%
            </span>
          )}
        </div>
        <div className={`text-5xl font-extrabold bg-gradient-to-r ${gradient} bg-clip-text text-transparent mb-3 tracking-tight`}>
          {value}
        </div>
        <p className="text-base font-medium text-gray-600 dark:text-gray-400 leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  );
};

export default OverviewCard;
