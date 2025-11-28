import React from 'react';
import { motion } from 'framer-motion';
import { acceptedFileExtensions, uploadInfoCards } from '../../data/modernizationData';

/**
 * File Upload Zone Component
 * Displays the file upload area with drag-and-drop support
 */
const FileUploadZone = ({ onFileUpload }) => {
  const handleFileChange = (files) => {
    if (files && files.length > 0) {
      onFileUpload(Array.from(files));
    }
  };

  return (
    <div className="max-w-3xl w-full">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-12 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 bg-white dark:bg-gray-800"
        onDrop={(e) => {
          e.preventDefault();
          const files = Array.from(e.dataTransfer.files);
          handleFileChange(files);
        }}
        onDragOver={(e) => e.preventDefault()}
        whileHover={{ scale: 1.02 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 opacity-50"></div>

        <div className="relative z-10">
          <motion.div
            className="w-24 h-24 mx-auto mb-6 text-blue-500 dark:text-blue-400"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </motion.div>

          <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3">
            🚀 Upload Your Legacy Files
          </h3>

          <p className="text-gray-600 dark:text-gray-400 mb-2">
            Drop your COBOL files here or click to browse
          </p>

          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mb-6">
            <span className="text-2xl">💡</span>
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Select both .cpy (copybook) and .dat (data) files for best results
            </span>
          </div>

          <input
            type="file"
            accept={acceptedFileExtensions.join(',')}
            multiple
            onChange={(e) => handleFileChange(e.target.files)}
            className="hidden"
            id="file-upload"
          />

          <div className="space-y-3">
            <label
              htmlFor="file-upload"
              className="inline-flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span>Choose Files</span>
            </label>

            <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              Hold Ctrl/Cmd to select multiple files
            </div>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {acceptedFileExtensions.map((ext) => (
              <span
                key={ext}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs font-mono"
              >
                {ext}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Info Cards Below Upload */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        {uploadInfoCards.map((feature, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 text-center"
          >
            <div className="text-3xl mb-2">{feature.icon}</div>
            <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-1">
              {feature.title}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FileUploadZone;
