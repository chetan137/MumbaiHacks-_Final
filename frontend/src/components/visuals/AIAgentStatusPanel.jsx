import React from 'react';
import { motion } from 'framer-motion';
import { aiAgents } from '../../data/modernizationData';

/**
 * AI Agent Status Panel Component
 * Displays the status of all AI agents in the sidebar
 */
const AIAgentStatusPanel = () => {
  return (
    <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
      <h3 className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase mb-3">
        AI Agents Status
      </h3>
      <div className="space-y-2">
        {aiAgents.map((agent, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="flex items-center justify-between text-xs"
          >
            <div className="flex items-center space-x-2">
              <span>{agent.icon}</span>
              <span className="text-gray-700 dark:text-gray-300">{agent.name}</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-600 dark:text-green-400 font-medium">Active</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AIAgentStatusPanel;
