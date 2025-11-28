import React from 'react';
import { motion } from 'framer-motion';
import { navigationTabs } from '../../data/modernizationData';
import AIAgentStatusPanel from './AIAgentStatusPanel';

/**
 * Sidebar Navigation Component
 * Displays navigation tabs and current file info
 */
const SidebarNavigation = ({ activeTab, setActiveTab, uploadedFile }) => {
  return (
    <div className="w-80 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-r border-gray-200 dark:border-gray-700 overflow-y-auto shadow-2xl z-20 flex flex-col h-full">
      <div className="p-6 flex-1">
        {/* Current File Info */}
        <div className="mb-8 p-5 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl border border-blue-100 dark:border-blue-800 shadow-sm">
          <div className="flex items-center space-x-3 mb-2">
            <span className="text-2xl">📂</span>
            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">
              Current Project
            </h3>
          </div>
          <p className="text-sm font-medium text-blue-600 dark:text-blue-300 break-words pl-9">
            {uploadedFile ? (
              Array.isArray(uploadedFile)
                ? `${uploadedFile.length} files selected`
                : uploadedFile.name
            ) : 'No file loaded'}
          </p>
        </div>

        {/* Navigation Tabs */}
        <nav className="space-y-3">
          {navigationTabs.map((tab, idx) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center space-x-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${
                activeTab === tab.id
                  ? `bg-gradient-to-r ${tab.color} text-white shadow-lg shadow-blue-500/20 ring-1 ring-white/20`
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/80 hover:shadow-md'
              }`}
            >
              <span className={`text-3xl transition-transform duration-300 ${activeTab === tab.id ? 'scale-110' : 'group-hover:scale-110'}`}>
                {tab.icon}
              </span>
              <div className="flex flex-col items-start">
                <span className={`font-bold text-lg ${activeTab === tab.id ? 'text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                  {tab.label}
                </span>
                {activeTab === tab.id && (
                  <span className="text-xs text-white/80 font-medium">Active View</span>
                )}
              </div>

              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="ml-auto w-2 h-2 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                />
              )}
            </motion.button>
          ))}
        </nav>
      </div>

      {/* AI Agent Status Panel - Fixed at bottom */}
      <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
        <AIAgentStatusPanel />
      </div>
    </div>
  );
};

export default SidebarNavigation;
