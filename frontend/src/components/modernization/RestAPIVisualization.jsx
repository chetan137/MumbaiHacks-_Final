import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const RestAPIVisualization = ({ apiData }) => {
  const [selectedEndpoint, setSelectedEndpoint] = useState(null);
  const [viewMode, setViewMode] = useState('endpoints'); // 'endpoints', 'models', 'security', 'openapi'
  const [filterMethod, setFilterMethod] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Extract API data
  const endpoints = apiData?.endpoints || [];
  const models = apiData?.models || [];
  const security = apiData?.security || {};
  const architecture = apiData?.architecture || {};

  // Filter endpoints based on method and search
  const filteredEndpoints = endpoints.filter(endpoint => {
    const matchesMethod = filterMethod === 'all' || endpoint.method === filterMethod;
    const matchesSearch = searchTerm === '' ||
      endpoint.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
      endpoint.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesMethod && matchesSearch;
  });

  const getMethodColor = (method) => {
    const colors = {
      GET: 'bg-green-500',
      POST: 'bg-blue-500',
      PUT: 'bg-yellow-500',
      DELETE: 'bg-red-500',
      PATCH: 'bg-purple-500'
    };
    return colors[method] || 'bg-gray-500';
  };

  const getMethodTextColor = (method) => {
    const colors = {
      GET: 'text-green-700',
      POST: 'text-blue-700',
      PUT: 'text-yellow-700',
      DELETE: 'text-red-700',
      PATCH: 'text-purple-700'
    };
    return colors[method] || 'text-gray-700';
  };

  const ViewModeToggle = () => (
    <div className="flex bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl p-1.5 shadow-lg border border-gray-200 dark:border-gray-700">
      {['endpoints', 'models', 'security', 'openapi'].map((mode) => (
        <button
          key={mode}
          onClick={() => setViewMode(mode)}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${
            viewMode === mode
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md transform scale-105'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          {mode.charAt(0).toUpperCase() + mode.slice(1)}
        </button>
      ))}
    </div>
  );

  const FilterControls = () => (
    <div className="flex items-center space-x-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-2 rounded-xl border border-gray-100 dark:border-gray-700">
      <div className="flex items-center space-x-3">
        <label className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-xs">Method</label>
        <select
          value={filterMethod}
          onChange={(e) => setFilterMethod(e.target.value)}
          className="border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all cursor-pointer hover:border-blue-300"
        >
          <option value="all">All Methods</option>
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
          <option value="PATCH">PATCH</option>
        </select>
      </div>

      <div className="h-8 w-px bg-gray-200 dark:bg-gray-700"></div>

      <div className="flex items-center space-x-3 flex-1">
        <label className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-xs">Search</label>
        <div className="relative flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search endpoints..."
            className="w-full border border-gray-200 dark:border-gray-600 rounded-lg pl-10 pr-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
          <svg className="w-4 h-4 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
    </div>
  );

  const EndpointCard = ({ endpoint, onClick }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01, y: -2 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-5 cursor-pointer hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200 group"
      onClick={() => onClick(endpoint)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <span className={`px-4 py-1.5 rounded-lg text-white text-sm font-bold shadow-sm ${getMethodColor(endpoint.method)}`}>
            {endpoint.method}
          </span>
          <code className="text-lg font-mono font-semibold text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {endpoint.path}
          </code>
        </div>
        <div className="flex items-center space-x-2">
          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs rounded-md font-mono">
            v1
          </span>
        </div>
      </div>

      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 leading-relaxed pl-1">
        {endpoint.description || 'No description available'}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-gray-700/50">
        <div className="flex items-center space-x-6 text-xs font-medium text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-2">
            <span className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-1 rounded">
              {endpoint.parameters?.length || 0} Params
            </span>
          </div>
          {endpoint.body && (
            <div className="flex items-center space-x-2">
              <span className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 px-2 py-1 rounded">
                Has Body
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2 text-xs font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/10 px-3 py-1 rounded-full">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span>Active</span>
        </div>
      </div>
    </motion.div>
  );

  const ModelCard = ({ model }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <span className="text-2xl bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg">📦</span>
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">
            {model.name}
          </h3>
        </div>
        <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-bold border border-purple-200 dark:border-purple-800">
          {model.fields?.length || 0} fields
        </span>
      </div>

      <div className="space-y-3">
        {model.fields?.map((field, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
            <div className="flex items-center space-x-3">
              <span className="font-semibold text-gray-700 dark:text-gray-300 text-sm">
                {field.name}
              </span>
              <span className="text-xs font-mono text-gray-500 dark:text-gray-500 bg-white dark:bg-gray-800 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-600">
                {field.type}
              </span>
            </div>
            {field.required && (
              <span className="px-2 py-0.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded text-[10px] font-bold uppercase tracking-wider border border-red-100 dark:border-red-900/30">
                Required
              </span>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );

  const SecurityView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16"></div>
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-6 flex items-center">
          <span className="text-2xl mr-3">🔐</span> Authentication & Authorization
        </h3>
        <div className="space-y-6">
          <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
            <span className="text-gray-600 dark:text-gray-400 font-medium">Authentication</span>
            <span className="font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-lg">
              {security.authentication || 'Not specified'}
            </span>
          </div>
          <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
            <span className="text-gray-600 dark:text-gray-400 font-medium">Authorization</span>
            <span className="font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 px-3 py-1 rounded-lg">
              {security.authorization || 'Not specified'}
            </span>
          </div>
          <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
            <span className="text-gray-600 dark:text-gray-400 font-medium">Rate Limiting</span>
            <span className="font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-3 py-1 rounded-lg">
              {security.rateLimiting || 'Not configured'}
            </span>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full -mr-16 -mt-16"></div>
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-6 flex items-center">
          <span className="text-2xl mr-3">🛡️</span> Security Measures
        </h3>
        <div className="space-y-6">
          <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
            <span className="text-gray-600 dark:text-gray-400 font-medium">Input Validation</span>
            <span className="font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-lg">
              {security.inputValidation || 'Not specified'}
            </span>
          </div>
          <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
            <span className="text-gray-600 dark:text-gray-400 font-medium">SQL Injection</span>
            <span className="font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-lg">
              {security.sqlInjectionPrevention || 'Not specified'}
            </span>
          </div>
          <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
            <span className="text-gray-600 dark:text-gray-400 font-medium">CORS Policy</span>
            <span className="font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-lg">
              {security.cors || 'Configure as needed'}
            </span>
          </div>
        </div>
      </motion.div>

      {architecture && Object.keys(architecture).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8 md:col-span-2 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-6 flex items-center">
            <span className="text-2xl mr-3">🏗️</span> Architecture Details
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Object.entries(architecture).map(([key, value]) => (
              <div key={key} className="text-center p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
                <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </div>
                <div className="font-bold text-gray-800 dark:text-gray-200 text-lg">
                  {value}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );

  const OpenAPIView = () => {
    const openAPISpec = {
      openapi: "3.0.0",
      info: {
        title: "Modernized API",
        version: "1.0.0",
        description: "API generated from legacy COBOL system modernization"
      },
      servers: [
        {
          url: "https://api.modernized-system.com/v1",
          description: "Production server"
        }
      ],
      paths: endpoints.reduce((paths, endpoint) => {
        paths[endpoint.path] = {
          [endpoint.method.toLowerCase()]: {
            summary: endpoint.description,
            parameters: endpoint.parameters?.map(param => ({
              name: param,
              in: "query",
              required: false,
              schema: { type: "string" }
            })) || [],
            responses: {
              "200": {
                description: "Successful response",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        data: { type: "object" },
                        status: { type: "string" }
                      }
                    }
                  }
                }
              }
            }
          }
        };
        return paths;
      }, {}),
      components: {
        schemas: models.reduce((schemas, model) => {
          schemas[model.name] = {
            type: "object",
            properties: model.fields?.reduce((props, field) => {
              props[field.name] = {
                type: field.type === 'integer' ? 'integer' : 'string'
              };
              return props;
            }, {}) || {}
          };
          return schemas;
        }, {})
      }
    };

    return (
      <div className="bg-[#1e1e1e] text-[#9cdcfe] p-8 rounded-2xl font-mono text-sm overflow-auto h-[calc(100vh-200px)] shadow-2xl border border-gray-700">
        <div className="flex items-center justify-between mb-4 border-b border-gray-700 pb-4">
          <div className="flex items-center space-x-2">
            <span className="text-green-400">●</span>
            <span className="font-bold text-gray-300">openapi.json</span>
          </div>
          <button
            className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded transition-colors"
            onClick={() => navigator.clipboard.writeText(JSON.stringify(openAPISpec, null, 2))}
          >
            Copy Spec
          </button>
        </div>
        <pre className="whitespace-pre-wrap leading-relaxed">
          {JSON.stringify(openAPISpec, null, 2)}
        </pre>
      </div>
    );
  };

  const EndpointDetails = () => {
    if (!selectedEndpoint) return null;

    return (
      <motion.div
        initial={{ opacity: 0, x: 400 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 400 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed right-6 top-24 w-96 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 flex flex-col max-h-[calc(100vh-150px)]"
      >
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800/50 rounded-t-2xl">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1.5 rounded-lg text-white text-sm font-bold shadow-sm ${getMethodColor(selectedEndpoint.method)}`}>
                {selectedEndpoint.method}
              </span>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white font-mono">
                {selectedEndpoint.path}
              </h3>
            </div>
            <button
              onClick={() => setSelectedEndpoint(null)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            {selectedEndpoint.description}
          </p>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
          {/* Parameters */}
          {selectedEndpoint.parameters && selectedEndpoint.parameters.length > 0 && (
            <div>
              <h4 className="flex items-center text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                Parameters
              </h4>
              <div className="space-y-2">
                {selectedEndpoint.parameters.map((param, index) => (
                  <div key={index} className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-800/30">
                    <code className="text-sm font-bold text-blue-700 dark:text-blue-300">{param}</code>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Request Body */}
          {selectedEndpoint.body && (
            <div>
              <h4 className="flex items-center text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Request Body
              </h4>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-100 dark:border-green-800/30">
                <code className="text-sm text-green-700 dark:text-green-300 font-mono block whitespace-pre-wrap">
                  {selectedEndpoint.body}
                </code>
              </div>
            </div>
          )}

          {/* Response */}
          <div>
            <h4 className="flex items-center text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
              Response
            </h4>
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-100 dark:border-purple-800/30">
              <code className="text-sm text-purple-700 dark:text-purple-300 font-mono block whitespace-pre-wrap">
                {selectedEndpoint.response || 'JSON response object'}
              </code>
            </div>
          </div>

          {/* Example */}
          <div>
            <h4 className="flex items-center text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              <span className="w-2 h-2 bg-gray-500 rounded-full mr-2"></span>
              Example Request
            </h4>
            <div className="bg-gray-900 text-green-400 p-4 rounded-xl font-mono text-xs shadow-inner">
              <div className="mb-1">curl -X {selectedEndpoint.method} \</div>
              <div className="mb-1">  "https://api.example.com{selectedEndpoint.path}" \</div>
              <div className="mb-1">  -H "Authorization: Bearer &lt;token&gt;" \</div>
              <div className="mb-1">  -H "Content-Type: application/json"</div>
              {selectedEndpoint.body && (
                <div>  -d '{selectedEndpoint.body}'</div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="h-full bg-slate-50 dark:bg-slate-900 relative overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
           style={{
             backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)',
             backgroundSize: '24px 24px'
           }}>
      </div>

      {/* Header */}
      <div className="p-8 border-b border-gray-200 dark:border-gray-700 relative z-10 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <span className="text-2xl">🌐</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                REST API Documentation
              </h2>
              <div className="flex items-center space-x-2 mt-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  {endpoints.length} Endpoints Active
                </span>
              </div>
            </div>
          </div>
          <ViewModeToggle />
        </div>

        {viewMode === 'endpoints' && <FilterControls />}
      </div>

      {/* Content */}
      <div className="p-8 overflow-auto custom-scrollbar relative z-10" style={{ height: 'calc(100% - 180px)' }}>
        <AnimatePresence mode="wait">
          {viewMode === 'endpoints' && (
            <motion.div
              key="endpoints"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4 max-w-5xl mx-auto"
            >
              {filteredEndpoints.map((endpoint, index) => (
                <EndpointCard
                  key={index}
                  endpoint={endpoint}
                  onClick={setSelectedEndpoint}
                />
              ))}
              {filteredEndpoints.length === 0 && (
                <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                  <div className="text-4xl mb-4">🔍</div>
                  <div className="text-gray-500 dark:text-gray-400 font-medium mb-4">No endpoints match your filters</div>
                  <button
                    onClick={() => {
                      setFilterMethod('all');
                      setSearchTerm('');
                    }}
                    className="px-6 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg font-bold hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {viewMode === 'models' && (
            <motion.div
              key="models"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 max-w-7xl mx-auto"
            >
              {models.map((model, index) => (
                <ModelCard key={index} model={model} />
              ))}
              {models.length === 0 && (
                <div className="col-span-full text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                  <div className="text-4xl mb-4">📦</div>
                  <div className="text-gray-500 dark:text-gray-400 font-medium">No data models available</div>
                </div>
              )}
            </motion.div>
          )}

          {viewMode === 'security' && (
            <motion.div
              key="security"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-6xl mx-auto"
            >
              <SecurityView />
            </motion.div>
          )}

          {viewMode === 'openapi' && (
            <motion.div
              key="openapi"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-5xl mx-auto"
            >
              <div className="mb-6 flex items-center space-x-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <span className="text-xl">📜</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                    OpenAPI 3.0 Specification
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Auto-generated OpenAPI specification for the modernized API
                  </p>
                </div>
              </div>
              <OpenAPIView />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Endpoint Details Panel */}
      <AnimatePresence>
        {selectedEndpoint && <EndpointDetails />}
      </AnimatePresence>

      {/* Empty State */}
      {endpoints.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm z-50">
          <div className="text-center bg-white dark:bg-gray-800 p-12 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 max-w-md">
            <div className="w-24 h-24 mx-auto mb-6 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
              <span className="text-5xl">🌐</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">No API Data</h3>
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-8">
              Upload and process a file to see the REST API design.
            </p>
            <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all transform hover:-translate-y-1">
              Upload File
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestAPIVisualization;
