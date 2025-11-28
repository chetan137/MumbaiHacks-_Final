import React from 'react';
import { motion } from 'framer-motion';

const BarChart = ({ data, color }) => (
  <div className="flex items-end space-x-4 h-48 w-full bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4 relative">
    {data.map((item, idx) => (
      <div key={idx} className="flex-1 flex flex-col justify-end items-center h-full group">
        <div className="relative w-full flex justify-center h-full items-end">
             <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${Math.min(item.value, 100)}%` }}
                transition={{ duration: 1, delay: idx * 0.1, type: "spring" }}
                className={`w-full max-w-[40px] rounded-t-lg bg-gradient-to-t ${color} opacity-80 group-hover:opacity-100 transition-opacity`}
            >
                <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded pointer-events-none whitespace-nowrap z-10">
                    {item.value}
                </div>
            </motion.div>
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400 mt-2 font-medium truncate w-full text-center">{item.name}</span>
      </div>
    ))}
  </div>
);

const CircularProgress = ({ value, label, color }) => {
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r="40"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-gray-200 dark:text-gray-700"
          />
          <motion.circle
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            cx="64"
            cy="64"
            r="40"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeLinecap="round"
            className={`text-${color}-500`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <span className="text-2xl font-bold text-gray-800 dark:text-white">{Math.round(value)}%</span>
        </div>
      </div>
      <span className="mt-2 font-medium text-gray-600 dark:text-gray-300">{label}</span>
    </div>
  );
};

const GraphsSection = ({ chartData }) => {
  if (!chartData) return null;

  return (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
    >
      {/* Confidence & Validation */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-6 flex items-center">
            <span className="mr-2">🎯</span> Quality Metrics
        </h3>
        <div className="flex justify-around">
            <CircularProgress value={chartData.confidenceVsValidation[0].value} label="Confidence" color="green" />
            <CircularProgress value={chartData.confidenceVsValidation[1].value} label="Validation" color="blue" />
        </div>
      </div>

      {/* System Stats */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-6 flex items-center">
            <span className="mr-2">📊</span> System Stats
        </h3>
        <BarChart
            data={chartData.schemaStats}
            color="from-purple-500 to-indigo-500"
        />
      </div>

      {/* Complexity & Scale */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-6 flex items-center">
            <span className="mr-2">⚡</span> Code Scale
        </h3>
        <div className="space-y-4">
            {chartData.complexityDistribution.map((item, idx) => (
                <div key={idx}>
                    <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-400">{item.name}</span>
                        <span className="font-bold text-gray-800 dark:text-gray-200">{item.value}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: '70%' }} // Relative visualization since LOC can be huge
                            transition={{ duration: 1, delay: idx * 0.2 }}
                            className="bg-gradient-to-r from-orange-500 to-red-500 h-2.5 rounded-full"
                        />
                    </div>
                </div>
            ))}
             <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-blue-700 dark:text-blue-300">
                <p>System complexity is rated as <strong>Medium</strong> based on analysis.</p>
            </div>
        </div>
      </div>
    </motion.div>
  );
};

export default GraphsSection;
