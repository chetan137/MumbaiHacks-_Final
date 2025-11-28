import React from 'react';
import { motion } from 'framer-motion';
import { aiWorkflowEmojis } from '../../data/modernizationData';

/**
 * AI Workflow Banner Component
 * Displays the AI multi-agent pipeline banner with animated emojis
 */
const AIWorkflowBanner = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white shadow-xl"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold mb-2">🤖 AI Multi-Agent Pipeline</h3>
          <p className="text-blue-100">Automated legacy system transformation with intelligent agents</p>
        </div>
        <div className="flex space-x-2">
          {aiWorkflowEmojis.map((emoji, idx) => (
            <motion.div
              key={idx}
              className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center text-2xl backdrop-blur"
              whileHover={{ scale: 1.1, rotate: 10 }}
              transition={{ type: "spring" }}
            >
              {emoji}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default AIWorkflowBanner;
