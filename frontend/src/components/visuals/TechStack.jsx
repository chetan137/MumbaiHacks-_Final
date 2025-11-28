import React from 'react';
import { motion } from 'framer-motion';
import { techStackItems } from '../../data/modernizationData';

/**
 * Technology Stack Visualization Component
 * Displays the modern tech stack with icons and colors.
 * Uses dynamic architecture data if available, otherwise falls back to static items.
 */
const TechStack = ({ architecture }) => {
  // Map architecture object to display items if available
  const displayItems = architecture ? [
    { name: architecture.pattern || 'Microservices', icon: '🏗️', color: 'blue' },
    { name: architecture.framework || 'React/Node.js', icon: '⚛️', color: 'cyan' },
    { name: architecture.database || 'PostgreSQL', icon: '🐘', color: 'indigo' },
    { name: architecture.caching || 'Redis', icon: '⚡', color: 'red' },
    { name: architecture.messaging || 'Kafka', icon: '📨', color: 'orange' }
  ] : techStackItems;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-2xl">
          🛠️
        </div>
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          Modern Tech Stack
        </h3>
      </div>

      <div className="space-y-3">
        {displayItems.map((tech, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ scale: 1.02, x: 5 }}
            className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <span className="text-2xl">{tech.icon}</span>
            <span className="flex-1 font-medium text-gray-700 dark:text-gray-300">{tech.name}</span>
            <div className={`w-3 h-3 bg-${tech.color}-500 rounded-full`}></div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default TechStack;
