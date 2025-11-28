import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DatabaseSchemaVisualization from './DatabaseSchemaVisualization';
import RestAPIVisualization from './RestAPIVisualization';
import JSONDataViewer from './JSONDataViewer';
import MicroservicesArchitecture from './MicroservicesArchitecture';

// Import new visual components
import OverviewCard from '../visuals/OverviewCard';
import MigrationAnalysis from '../visuals/MigrationAnalysis';
import TechStack from '../visuals/TechStack';
import MigrationOverview from '../visuals/MigrationOverview';
import AIWorkflowBanner from '../visuals/AIWorkflowBanner';
import DashboardHeader from '../visuals/DashboardHeader';
import SidebarNavigation from '../visuals/SidebarNavigation';
import FileUploadZone from '../visuals/FileUploadZone';
import ProcessingStatus from '../visuals/ProcessingStatus';
import GraphsSection from '../visuals/GraphsSection';

// Import data utilities
import { dashboardMetrics } from '../../data/modernizationData';
import { normalizeModernizationData, getChartData } from '../../utils/frontendData';

const ModernizationDashboard = ({
  modernizationResults,
  onFileUpload,
  onProcessFile,
  isProcessing = false,
  processingStatus = null
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [error, setError] = useState(null);
  const [showBestVisualization, setShowBestVisualization] = useState(false);

  // Normalize data using the unified data layer
  const normalizedData = useMemo(() =>
    normalizeModernizationData(modernizationResults),
    [modernizationResults]
  );

  const chartData = useMemo(() =>
    getChartData(normalizedData),
    [normalizedData]
  );

  // Helper function to parse SQL schema into table structure
  function parseSchemaFromSQL(sqlString) {
    if (!sqlString) return [];

    const tables = [];
    const tableRegex = /CREATE TABLE (\w+)\s*\(([\s\S]*?)\);/gi;
    let match;

    while ((match = tableRegex.exec(sqlString)) !== null) {
      const tableName = match[1];
      const columnsStr = match[2];
      const columns = [];

      const columnLines = columnsStr.split(',').map(line => line.trim());
      columnLines.forEach(line => {
        const columnMatch = line.match(/(\w+)\s+([\w\(\)]+)(\s+PRIMARY KEY)?(\s+NOT NULL)?/i);
        if (columnMatch) {
          columns.push({
            name: columnMatch[1],
            type: columnMatch[2],
            isPrimary: !!columnMatch[3],
            isNotNull: !!columnMatch[4]
          });
        }
      });

      tables.push({
        name: tableName,
        columns,
        relationships: []
      });
    }

    return tables;
  }

  // Helper function to parse API endpoints from REST API code
  function parseAPIEndpoints(apiCode) {
    if (!apiCode) return [];

    const endpoints = [];
    const routeRegex = /app\.(get|post|put|delete)\s*\(\s*['"]([^'"]+)['"]/gi;
    let match;

    while ((match = routeRegex.exec(apiCode)) !== null) {
      endpoints.push({
        method: match[1].toUpperCase(),
        path: match[2],
        description: `${match[1].toUpperCase()} endpoint for ${match[2]}`,
        parameters: [],
        response: "JSON response"
      });
    }

    // If no endpoints found, return default ones if we have code but no matches
    if (endpoints.length === 0 && apiCode.length > 0) {
      return [
        { method: "GET", path: "/api/data", description: "Get all records", parameters: [], response: "Array of records" },
        { method: "GET", path: "/api/data/:id", description: "Get record by ID", parameters: ["id"], response: "Single record" },
        { method: "POST", path: "/api/data", description: "Create new record", parameters: [], response: "Created record" }
      ];
    }

    return endpoints;
  }

  const handleFileUpload = async (files) => {
    const fileArray = Array.isArray(files) ? files : [files];
    setUploadedFile(fileArray.length === 1 ? fileArray[0] : fileArray);
    setError(null);

    try {
      const formData = new FormData();

      // Append files with the exact field names expected by the backend
      fileArray.forEach(file => {
        const name = file.name.toLowerCase();
        if (name.endsWith('.cpy')) {
          formData.append('copybook', file);
        } else if (name.endsWith('.dat')) {
          formData.append('datafile', file);
        } else {
          // Fallback: use generic field name
          formData.append('file', file);
        }
      });

      console.log('📤 Uploading files to backend...');
      if (onFileUpload) {
        onFileUpload(fileArray.length === 1 ? fileArray[0] : fileArray);
      }

      const response = await fetch('http://localhost:5000/api/v1/modernize-demo', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Backend response received:', result);

      // Check if the response is successful
      if (!result.success) {
        throw new Error(result.error || 'Modernization failed');
      }

      // Transform backend response to frontend format
      const transformedData = {
        schema: {
          tables: parseSchemaFromSQL(result.modernizationAssets?.dbSchema)
        },
        apiDesign: {
          endpoints: parseAPIEndpoints(result.modernizationAssets?.restApi),
          models: result.modernizationAssets?.microservices || [],
          security: {
            authentication: "JWT",
            authorization: "RBAC",
            rateLimiting: "100 requests per minute"
          },
          architecture: {
            pattern: "Microservices",
            framework: "Node.js/Express",
            database: "PostgreSQL"
          }
        },
        dashboardData: {
          complexity: "medium",
          confidence: 0.85,
          linesOfCode: result.parsedSchema?.fields?.length * 10 || 100,
          dependencies: result.parsedSchema?.fields?.length || 5,
          validationScore: 88
        },
        documentation: {
          summary: result.modernizationAssets?.insightEngine?.summary || "Legacy system modernization completed successfully.",
          technicalDetails: `Transformed ${result.parsedSchema?.recordName || 'COBOL'} structure into modern architecture.`,
          migrationPlan: `Estimated effort: ${result.modernizationAssets?.insightEngine?.manualEffort?.timeline || '3-4 months'} manual vs ${result.modernizationAssets?.insightEngine?.automatedTool?.time || '2-3 weeks'} automated.`,
          risks: ["Data migration complexity", "Integration challenges", "Performance optimization"]
        },
        confidence: 0.85,
        rawData: result.modernizationAssets?.jsonData,
        microserviceDiagram: result.modernizationAssets?.microserviceDiagram,
        insightEngine: result.modernizationAssets?.insightEngine,
        sql: result.modernizationAssets?.dbSchema // Pass raw SQL for display
      };

      console.log('🔄 Transformed data:', transformedData);
      onProcessFile(transformedData);

    } catch (error) {
      setError(`Upload failed: ${error.message}`);
      console.error('❌ Upload failed:', error);
    }
  };

  const OverviewTab = () => (
    <div className="space-y-8">
      {/* AI Workflow Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <AIWorkflowBanner />
      </motion.div>

      {/* Best Visualization Toggle Area */}
      <AnimatePresence>
        {showBestVisualization && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
            className="overflow-hidden"
          >
            <GraphsSection chartData={chartData} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Summary Cards */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {dashboardMetrics.map((metric, idx) => {
            let value;
            // Use normalized data for metrics
            if (metric.key === 'confidence') {
              value = normalizedData?.confidenceScore;
            } else if (metric.key === 'tablesCount') {
              value = normalizedData?.schema?.tableCount;
            } else if (metric.key === 'endpointsCount') {
              value = normalizedData?.api?.endpointCount;
            } else if (metric.key === 'complexity') {
              value = normalizedData?.complexity;
            }

            const displayValue = metric.format ? metric.format(value) : value;
            const trend = metric.trend ? metric.trend(value) : undefined;

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + idx * 0.1, duration: 0.4 }}
              >
                <OverviewCard
                  title={metric.title}
                  value={displayValue}
                  description={metric.description}
                  icon={metric.icon}
                  trend={trend}
                  gradient={metric.gradient}
                />
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Detailed Analysis Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Migration Analysis Component */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7, duration: 0.4 }}
        >
          <MigrationAnalysis
            dashboardData={{
              linesOfCode: normalizedData?.linesOfCode,
              dependencies: normalizedData?.dependencies,
              validationScore: normalizedData?.validationScore
            }}
            confidence={normalizedData?.confidenceScore}
          />
        </motion.div>

        {/* Tech Stack Component */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7, duration: 0.4 }}
        >
          <TechStack architecture={normalizedData?.api?.architecture} />
        </motion.div>
      </motion.div>

      {/* Migration Overview Component */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.5 }}
      >
        <MigrationOverview documentation={normalizedData?.documentation} />
      </motion.div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 dark:from-gray-950 dark:via-slate-900 dark:to-gray-900 overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02] pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }}></div>
      </div>

      {/* Dashboard Header Component */}
      <div className="relative z-20 border-b border-gray-200/50 dark:border-gray-800/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-sm">
        <DashboardHeader
          modernizationResults={modernizationResults}
          confidence={normalizedData?.confidenceScore || 0}
        />

        {/* Visualization Toggle - Injected into header area */}
        {modernizationResults && (
          <div className="absolute top-6 right-52 z-30">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowBestVisualization(!showBestVisualization)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg transition-all duration-300 flex items-center gap-2 border-2 ${
                showBestVisualization
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-400 shadow-purple-500/50'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700'
              }`}
            >
              <span className="text-lg">{showBestVisualization ? '✨' : '👁️'}</span>
              <span>{showBestVisualization ? 'Best View Active' : 'Enable Best View'}</span>
            </motion.button>
          </div>
        )}
      </div>

      {/* Processing Status Component */}
      <div className="px-6 pt-4 relative z-10">
        <AnimatePresence>
          {(isProcessing || error) && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ProcessingStatus
                isProcessing={isProcessing}
                processingStatus={processingStatus}
                error={error}
                onDismissError={() => setError(null)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Content */}
      {!modernizationResults ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center h-[calc(100vh-120px)] p-6"
        >
          {/* File Upload Zone Component */}
          <FileUploadZone onFileUpload={handleFileUpload} />
        </motion.div>
      ) : (
        <div className="flex h-[calc(100vh-90px)] pt-2">
          {/* Sidebar Navigation Component */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="relative z-10"
          >
            <SidebarNavigation
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              uploadedFile={uploadedFile}
            />
          </motion.div>

          {/* Main Content Area */}
          <div className="flex-1 overflow-hidden relative">
            {/* Subtle gradient overlay on content edges */}
            <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-slate-50/50 to-transparent dark:from-gray-950/50 pointer-events-none z-10"></div>
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-slate-50/50 to-transparent dark:from-gray-950/50 pointer-events-none z-10"></div>

            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="h-full overflow-auto px-8 py-6 pb-24"
                  style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: 'rgba(156, 163, 175, 0.5) transparent'
                  }}
                >
                  <div className="max-w-[1600px] mx-auto">
                    <OverviewTab />
                  </div>
                </motion.div>
              )}

              {activeTab === 'schema' && (
                <motion.div
                  key="schema"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="h-full overflow-hidden bg-gradient-to-br from-white/50 to-blue-50/30 dark:from-gray-900/50 dark:to-blue-900/10"
                >
                  <DatabaseSchemaVisualization
                    schemaData={normalizedData?.schema}
                    sqlData={modernizationResults?.sql}
                  />
                </motion.div>
              )}

              {activeTab === 'api' && (
                <motion.div
                  key="api"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="h-full overflow-hidden bg-gradient-to-br from-white/50 to-green-50/30 dark:from-gray-900/50 dark:to-green-900/10"
                >
                  <RestAPIVisualization apiData={normalizedData?.api} />
                </motion.div>
              )}

              {activeTab === 'architecture' && (
                <motion.div
                  key="architecture"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="h-full overflow-hidden bg-gradient-to-br from-white/50 to-purple-50/30 dark:from-gray-900/50 dark:to-purple-900/10"
                >
                  <MicroservicesArchitecture
                    architectureData={normalizedData?.api?.architecture}
                    apiData={normalizedData?.api}
                  />
                </motion.div>
              )}

              {activeTab === 'json' && (
                <motion.div
                  key="json"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="h-full overflow-hidden bg-gradient-to-br from-white/50 to-gray-50/30 dark:from-gray-900/50 dark:to-gray-800/10"
                >
                  <JSONDataViewer data={normalizedData?.raw} />
                </motion.div>
              )}

              {activeTab === 'documentation' && (
                <motion.div
                  key="documentation"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="h-full overflow-auto px-8 py-6 pb-24 bg-gradient-to-br from-white/50 to-amber-50/30 dark:from-gray-900/50 dark:to-amber-900/10"
                  style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: 'rgba(156, 163, 175, 0.5) transparent'
                  }}
                >
                  <div className="max-w-5xl mx-auto">
                    <MigrationOverview documentation={normalizedData?.documentation} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Custom Scrollbar Styles */}
      <style>{`
        /* Webkit browsers (Chrome, Safari, Edge) */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: transparent;
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.4);
          border-radius: 4px;
          transition: background 0.2s;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(107, 114, 128, 0.6);
        }

        .dark ::-webkit-scrollbar-thumb {
          background: rgba(75, 85, 99, 0.5);
        }

        .dark ::-webkit-scrollbar-thumb:hover {
          background: rgba(107, 114, 128, 0.7);
        }

        /* Smooth scrolling */
        * {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
};

export default ModernizationDashboard;
