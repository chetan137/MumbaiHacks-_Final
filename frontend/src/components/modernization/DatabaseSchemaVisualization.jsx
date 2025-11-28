import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DatabaseSchemaVisualization = ({ schemaData, sqlData }) => {
  const [selectedTable, setSelectedTable] = useState(null);
  const [viewMode, setViewMode] = useState('visual'); // 'visual', 'sql', 'json'
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [canvasPosition, setCanvasPosition] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);

  // Extract tables from SQL or schema data
  const extractTables = () => {
    if (schemaData?.tables) {
      return schemaData.tables;
    }

    if (sqlData) {
      return parseSQLTables(sqlData);
    }

    return [];
  };

  const parseSQLTables = (sql) => {
    const tables = [];
    const createTableRegex = /CREATE\s+TABLE\s+(\w+)\s*\(([\s\S]*?)\);/gi;
    let match;

    while ((match = createTableRegex.exec(sql)) !== null) {
      const tableName = match[1];
      const columnsSection = match[2];
      const columns = parseColumns(columnsSection);

      tables.push({
        name: tableName,
        columns: columns,
        relationships: findRelationships(columnsSection)
      });
    }

    return tables;
  };

  const parseColumns = (columnsSection) => {
    const columns = [];
    const lines = columnsSection.split(',');

    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.toUpperCase().includes('CONSTRAINT') && !trimmed.toUpperCase().includes('FOREIGN KEY')) {
        const parts = trimmed.split(/\s+/);
        if (parts.length >= 2) {
          const column = {
            name: parts[0],
            type: parts[1],
            isPrimary: trimmed.toUpperCase().includes('PRIMARY KEY'),
            isNotNull: trimmed.toUpperCase().includes('NOT NULL'),
            isUnique: trimmed.toUpperCase().includes('UNIQUE'),
            hasDefault: trimmed.toUpperCase().includes('DEFAULT')
          };
          columns.push(column);
        }
      }
    });

    return columns;
  };

  const findRelationships = (columnsSection) => {
    const relationships = [];
    const foreignKeyRegex = /FOREIGN\s+KEY\s*\(([^)]+)\)\s+REFERENCES\s+(\w+)\s*\(([^)]+)\)/gi;
    let match;

    while ((match = foreignKeyRegex.exec(columnsSection)) !== null) {
      relationships.push({
        fromColumn: match[1].trim(),
        toTable: match[2],
        toColumn: match[3].trim()
      });
    }

    return relationships;
  };

  const tables = extractTables();

  // Mouse event handlers for canvas dragging
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - canvasPosition.x,
      y: e.clientY - canvasPosition.y
    });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setCanvasPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart]);

  // Enhanced Table Card
  const TableCard = ({ table, position, isSelected, onClick }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
      transition={{ duration: 0.2 }}
      className={`absolute bg-white dark:bg-gray-800 rounded-xl shadow-xl cursor-pointer min-w-72 backdrop-blur-sm border transition-colors duration-200 ${
        isSelected
          ? 'border-blue-500 ring-4 ring-blue-500/20 z-30'
          : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 z-20'
      }`}
      style={{
        left: position.x,
        top: position.y,
        transform: `scale(${zoomLevel})`
      }}
      onClick={() => onClick(table)}
    >
      {/* Table Header */}
      <div className={`px-5 py-3 rounded-t-xl flex justify-between items-center ${
        isSelected
          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
          : 'bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700'
      }`}>
        <div className="flex items-center space-x-2">
          <span className="text-lg">🗃️</span>
          <h3 className={`font-bold text-lg ${isSelected ? 'text-white' : 'text-gray-800 dark:text-gray-200'}`}>
            {table.name}
          </h3>
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
          isSelected ? 'bg-white/20 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
        }`}>
          {table.columns?.length || 0}
        </span>
      </div>

      {/* Table Columns */}
      <div className="p-4 max-h-80 overflow-y-auto custom-scrollbar">
        {table.columns?.map((column, index) => (
          <div key={index} className="flex items-center py-2 px-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors group">
            {/* Column indicators */}
            <div className="flex space-x-1.5 mr-3 min-w-[12px]">
              {column.isPrimary && (
                <span className="w-2.5 h-2.5 bg-yellow-400 rounded-full shadow-sm ring-2 ring-yellow-200 dark:ring-yellow-900" title="Primary Key"></span>
              )}
              {column.isUnique && (
                <span className="w-2.5 h-2.5 bg-green-400 rounded-full shadow-sm ring-2 ring-green-200 dark:ring-green-900" title="Unique"></span>
              )}
              {column.isNotNull && (
                <span className="w-2.5 h-2.5 bg-red-400 rounded-full shadow-sm ring-2 ring-red-200 dark:ring-red-900" title="Not Null"></span>
              )}
            </div>

            {/* Column details */}
            <div className="flex-1 flex justify-between items-center">
              <span className="font-semibold text-gray-700 dark:text-gray-300 text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {column.name}
              </span>
              <span className="text-xs font-mono text-gray-500 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                {column.type}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Relationships indicator */}
      {table.relationships?.length > 0 && (
        <div className="px-5 py-3 bg-gray-50/50 dark:bg-gray-900/50 rounded-b-xl border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center">
            <span className="w-2 h-2 bg-indigo-400 rounded-full mr-2"></span>
            {table.relationships.length} Relationship{table.relationships.length !== 1 ? 's' : ''}
          </span>
          <span className="text-xs text-indigo-500 font-semibold cursor-pointer hover:underline">View Details →</span>
        </div>
      )}
    </motion.div>
  );

  const generateTablePositions = () => {
    const positions = [];
    const cols = Math.ceil(Math.sqrt(tables.length));
    const spacing = { x: 360, y: 320 }; // Increased spacing for larger cards

    tables.forEach((table, index) => {
      const row = Math.floor(index / cols);
      const col = index % cols;
      positions.push({
        x: col * spacing.x + 80,
        y: row * spacing.y + 80
      });
    });

    return positions;
  };

  const tablePositions = generateTablePositions();

  const ViewModeToggle = () => (
    <div className="flex bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl p-1.5 shadow-lg border border-gray-200 dark:border-gray-700">
      {['visual', 'sql', 'json'].map((mode) => (
        <button
          key={mode}
          onClick={() => setViewMode(mode)}
          className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${
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

  const ZoomControls = () => (
    <div className="flex items-center space-x-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-1.5">
      <button
        onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.1))}
        className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors font-bold text-lg"
      >
        −
      </button>
      <span className="text-sm font-bold text-gray-700 dark:text-gray-300 min-w-[3.5rem] text-center font-mono">
        {Math.round(zoomLevel * 100)}%
      </span>
      <button
        onClick={() => setZoomLevel(Math.min(2, zoomLevel + 0.1))}
        className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors font-bold text-lg"
      >
        +
      </button>
    </div>
  );

  const SQLView = () => (
    <div className="bg-[#1e1e1e] text-[#d4d4d4] p-8 rounded-2xl font-mono text-sm overflow-auto h-[calc(100vh-200px)] shadow-2xl border border-gray-700">
      <div className="flex items-center justify-between mb-4 border-b border-gray-700 pb-4">
        <div className="flex items-center space-x-2">
          <span className="text-yellow-400">●</span>
          <span className="font-bold text-gray-300">schema.sql</span>
        </div>
        <button
          className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded transition-colors"
          onClick={() => navigator.clipboard.writeText(sqlData)}
        >
          Copy Code
        </button>
      </div>
      <pre className="whitespace-pre-wrap leading-relaxed">{sqlData || '-- No SQL data available'}</pre>
    </div>
  );

  const JSONView = () => (
    <div className="bg-[#1e1e1e] text-[#9cdcfe] p-8 rounded-2xl font-mono text-sm overflow-auto h-[calc(100vh-200px)] shadow-2xl border border-gray-700">
      <div className="flex items-center justify-between mb-4 border-b border-gray-700 pb-4">
        <div className="flex items-center space-x-2">
          <span className="text-blue-400">●</span>
          <span className="font-bold text-gray-300">schema.json</span>
        </div>
        <button
          className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded transition-colors"
          onClick={() => navigator.clipboard.writeText(JSON.stringify(schemaData || { tables }, null, 2))}
        >
          Copy JSON
        </button>
      </div>
      <pre className="whitespace-pre-wrap leading-relaxed">
        {JSON.stringify(schemaData || { tables }, null, 2)}
      </pre>
    </div>
  );

  const SelectedTableDetails = () => {
    if (!selectedTable) return null;

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
              <span className="text-2xl bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">🗃️</span>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {selectedTable.name}
                </h3>
                <span className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider">Table Details</span>
              </div>
            </div>
            <button
              onClick={() => setSelectedTable(null)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          <div className="space-y-8">
            <div>
              <h4 className="flex items-center text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                Columns Structure
              </h4>
              <div className="space-y-3">
                {selectedTable.columns?.map((column, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-gray-800 dark:text-gray-200 text-base">
                        {column.name}
                      </span>
                      <span className="text-xs font-mono text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 px-2 py-1 rounded-md border border-purple-100 dark:border-purple-800">
                        {column.type}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {column.isPrimary && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                          🔑 Primary Key
                        </span>
                      )}
                      {column.isNotNull && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                          ⭕ Not Null
                        </span>
                      )}
                      {column.isUnique && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                          ✨ Unique
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {selectedTable.relationships?.length > 0 && (
              <div>
                <h4 className="flex items-center text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                  Relationships
                </h4>
                <div className="space-y-3">
                  {selectedTable.relationships.map((rel, index) => (
                    <div key={index} className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800/30 flex items-center justify-between group">
                      <div className="flex items-center space-x-3 text-sm">
                        <span className="font-bold text-gray-700 dark:text-gray-300">{rel.fromColumn}</span>
                        <span className="text-indigo-400">➜</span>
                        <span className="font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/50 px-2 py-1 rounded">
                          {rel.toTable}.{rel.toColumn}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
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

      {/* Header Controls */}
      <div className="absolute top-6 left-8 right-8 z-40 flex justify-between items-center pointer-events-none">
        <div className="flex items-center space-x-6 pointer-events-auto">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md px-6 py-3 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 flex items-center space-x-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <span className="text-2xl">🗄️</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
                Database Schema
              </h2>
              <div className="flex items-center space-x-2 mt-0.5">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  {tables.length} Tables Active
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4 pointer-events-auto">
          <ViewModeToggle />
          {viewMode === 'visual' && <ZoomControls />}
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-0 h-full">
        <AnimatePresence mode="wait">
          {viewMode === 'visual' && (
            <motion.div
              key="visual"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full relative"
            >
              {/* Canvas */}
              <div
                ref={canvasRef}
                className="h-full cursor-grab active:cursor-grabbing"
                onMouseDown={handleMouseDown}
                style={{
                  transform: `translate(${canvasPosition.x}px, ${canvasPosition.y}px)`
                }}
              >
                {/* Render Tables */}
                {tables.map((table, index) => (
                  <TableCard
                    key={table.name}
                    table={table}
                    position={tablePositions[index]}
                    isSelected={selectedTable?.name === table.name}
                    onClick={setSelectedTable}
                  />
                ))}

                {/* Render Relationships */}
                <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-10">
                  {tables.map((table, tableIndex) =>
                    table.relationships?.map((rel, relIndex) => {
                      const fromPos = tablePositions[tableIndex];
                      const toTableIndex = tables.findIndex(t => t.name === rel.toTable);
                      if (toTableIndex === -1) return null;

                      const toPos = tablePositions[toTableIndex];

                      return (
                        <g key={`${table.name}-${relIndex}`}>
                          <line
                            x1={fromPos.x + 144} // Adjusted for wider card
                            y1={fromPos.y + 40}
                            x2={toPos.x + 144} // Adjusted for wider card
                            y2={toPos.y + 40}
                            stroke="#6366f1"
                            strokeWidth="2"
                            strokeDasharray="6,4"
                            className="drop-shadow-sm"
                            markerEnd="url(#arrowhead)"
                          />
                          <circle cx={fromPos.x + 144} cy={fromPos.y + 40} r="4" fill="#6366f1" />
                        </g>
                      );
                    })
                  )}

                  {/* Arrow marker definition */}
                  <defs>
                    <marker
                      id="arrowhead"
                      markerWidth="12"
                      markerHeight="12"
                      refX="10"
                      refY="6"
                      orient="auto"
                    >
                      <path d="M2,2 L10,6 L2,10 L2,2 Z" fill="#6366f1" />
                    </marker>
                  </defs>
                </svg>
              </div>
            </motion.div>
          )}

          {viewMode === 'sql' && (
            <motion.div
              key="sql"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-8 pt-28 h-full flex justify-center"
            >
              <div className="w-full max-w-5xl">
                <SQLView />
              </div>
            </motion.div>
          )}

          {viewMode === 'json' && (
            <motion.div
              key="json"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-8 pt-28 h-full flex justify-center"
            >
              <div className="w-full max-w-5xl">
                <JSONView />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Selected Table Details */}
      <AnimatePresence>
        {selectedTable && <SelectedTableDetails />}
      </AnimatePresence>

      {/* Empty State */}
      {tables.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm z-50">
          <div className="text-center bg-white dark:bg-gray-800 p-12 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 max-w-md">
            <div className="w-24 h-24 mx-auto mb-6 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
              <span className="text-5xl">📭</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">No Schema Detected</h3>
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-8">
              Upload a SQL file or connect a database to generate an interactive schema visualization.
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

export default DatabaseSchemaVisualization;
