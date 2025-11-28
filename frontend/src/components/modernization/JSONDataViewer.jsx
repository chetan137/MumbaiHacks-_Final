import React, { useState, useEffect, useMemo } from 'react';
import { Search, Copy, Check, ChevronRight, ChevronDown, Maximize2, Minimize2, Download, Filter } from 'lucide-react';

const JSONDataViewer = ({ data, title = "JSON Data Viewer" }) => {
  const [viewMode, setViewMode] = useState('tree');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedPaths, setExpandedPaths] = useState(new Set());
  const [highlightPaths, setHighlightPaths] = useState(new Set());
  const [selectedPath, setSelectedPath] = useState(null);
  const [copiedPath, setCopiedPath] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [filterType, setFilterType] = useState('all');

  // Sample data for demo
  const sampleData = {
    user: {
      id: 12345,
      name: "John Doe",
      email: "john.doe@example.com",
      active: true,
      roles: ["admin", "editor", "viewer"],
      metadata: {
        created: "2024-01-15T10:30:00Z",
        lastLogin: "2024-11-27T08:15:00Z",
        preferences: {
          theme: "dark",
          notifications: true,
          language: "en"
        }
      }
    },
    settings: {
      apiKey: "sk_test_1234567890abcdef",
      maxRequests: 1000,
      timeout: 30,
      features: {
        analytics: true,
        reporting: false,
        export: true
      }
    },
    items: [
      { id: 1, name: "Item One", price: 29.99, inStock: true },
      { id: 2, name: "Item Two", price: 49.99, inStock: false },
      { id: 3, name: "Item Three", price: 19.99, inStock: true }
    ]
  };

  const jsonData = useMemo(() => {
    try {
      return typeof data === 'string' ? JSON.parse(data) : (data || sampleData);
    } catch (e) {
      return sampleData;
    }
  }, [data]);

  // Search functionality
  const searchInObject = (obj, term, currentPath = '') => {
    const results = new Set();
    const lowerTerm = term.toLowerCase();

    const search = (value, path) => {
      const pathStr = path || 'root';

      if (value === null || value === undefined) {
        if ('null'.includes(lowerTerm) || 'undefined'.includes(lowerTerm)) {
          results.add(pathStr);
        }
        return;
      }

      const valueStr = String(value).toLowerCase();
      const pathParts = path.split('.');
      const key = pathParts[pathParts.length - 1] || '';

      if (valueStr.includes(lowerTerm) || key.toLowerCase().includes(lowerTerm)) {
        results.add(pathStr);
      }

      if (typeof value === 'object') {
        if (Array.isArray(value)) {
          value.forEach((item, index) => {
            search(item, path ? `${path}[${index}]` : `[${index}]`);
          });
        } else {
          Object.entries(value).forEach(([key, val]) => {
            const newPath = path ? `${path}.${key}` : key;
            search(val, newPath);
          });
        }
      }
    };

    search(obj, currentPath);
    return results;
  };

  useEffect(() => {
    if (searchTerm.trim()) {
      const results = searchInObject(jsonData, searchTerm);
      setHighlightPaths(results);

      const pathsToExpand = new Set();
      results.forEach(path => {
        const parts = path.replace(/\[\d+\]/g, '').split('.').filter(Boolean);
        for (let i = 0; i < parts.length; i++) {
          const parentPath = parts.slice(0, i + 1).join('.');
          if (parentPath) pathsToExpand.add(parentPath);
        }
      });
      setExpandedPaths(prev => new Set([...prev, ...pathsToExpand]));
    } else {
      setHighlightPaths(new Set());
    }
  }, [searchTerm, jsonData]);

  const toggleExpand = (path) => {
    setExpandedPaths(prev => {
      const newSet = new Set(prev);
      if (newSet.has(path)) {
        newSet.delete(path);
      } else {
        newSet.add(path);
      }
      return newSet;
    });
  };

  const expandAll = () => {
    const allPaths = new Set();
    const findAllPaths = (obj, currentPath = '') => {
      if (typeof obj === 'object' && obj !== null) {
        Object.entries(obj).forEach(([key, value]) => {
          const path = currentPath ? `${currentPath}.${key}` : key;
          allPaths.add(path);
          if (typeof value === 'object' && value !== null) {
            findAllPaths(value, path);
          }
        });
      }
    };
    findAllPaths(jsonData);
    setExpandedPaths(allPaths);
  };

  const collapseAll = () => {
    setExpandedPaths(new Set());
  };

  const copyToClipboard = async (text, path = '') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedPath(path);
      setTimeout(() => setCopiedPath(''), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const getValueAtPath = (obj, path) => {
    if (!path) return obj;
    return path.split('.').reduce((current, key) => {
      if (current === null || current === undefined) return undefined;
      return current[key];
    }, obj);
  };

  const getValueType = (value) => {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (Array.isArray(value)) return 'array';
    return typeof value;
  };

  const getTypeColor = (type) => {
    const colors = {
      string: 'text-emerald-600 dark:text-emerald-400',
      number: 'text-blue-600 dark:text-blue-400',
      boolean: 'text-purple-600 dark:text-purple-400',
      null: 'text-gray-500 dark:text-gray-400',
      undefined: 'text-gray-500 dark:text-gray-400',
      array: 'text-orange-600 dark:text-orange-400',
      object: 'text-pink-600 dark:text-pink-400'
    };
    return colors[type] || 'text-gray-600 dark:text-gray-400';
  };

  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const TreeNode = ({ objKey, value, path = '', level = 0 }) => {
    const fullPath = path ? `${path}.${objKey}` : objKey;
    const isExpanded = expandedPaths.has(fullPath);
    const isHighlighted = highlightPaths.has(fullPath);
    const isSelected = selectedPath === fullPath;
    const isObject = typeof value === 'object' && value !== null && !Array.isArray(value);
    const isArray = Array.isArray(value);
    const hasChildren = isObject || isArray;
    const type = getValueType(value);
    const isCopied = copiedPath === fullPath;

    const shouldShowNode = () => {
      if (filterType === 'all') return true;
      return type === filterType;
    };

    if (!shouldShowNode()) return null;

    const renderValue = () => {
      if (isObject) {
        const count = Object.keys(value).length;
        return (
          <span className="text-gray-600 dark:text-gray-400 text-xs">
            {isExpanded ? '{' : `{ ${count} ${count === 1 ? 'property' : 'properties'} }`}
          </span>
        );
      }
      if (isArray) {
        return (
          <span className="text-gray-600 dark:text-gray-400 text-xs">
            {isExpanded ? '[' : `[ ${value.length} ${value.length === 1 ? 'item' : 'items'} ]`}
          </span>
        );
      }

      const displayValue = type === 'string' ? `"${value}"` : String(value);
      return (
        <span className={`${getTypeColor(type)} font-medium`}>
          {displayValue.length > 100 ? displayValue.slice(0, 100) + '...' : displayValue}
        </span>
      );
    };

    return (
      <div className={`transition-colors ${isHighlighted ? 'bg-yellow-100 dark:bg-yellow-900/30' : ''}`}>
        <div
          className={`flex items-center py-1.5 px-2 hover:bg-gray-100 dark:hover:bg-gray-700/50 cursor-pointer group relative ${
            isSelected ? 'bg-blue-100 dark:bg-blue-900/30 border-l-2 border-blue-500' : ''
          }`}
          style={{ paddingLeft: `${level * 24 + 8}px` }}
          onClick={() => {
            if (hasChildren) toggleExpand(fullPath);
            setSelectedPath(fullPath);
          }}
        >
          {hasChildren ? (
            <button className="mr-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          ) : (
            <span className="mr-2 w-4"></span>
          )}

          <span className="font-semibold text-gray-700 dark:text-gray-300 mr-2 text-sm">
            {objKey}:
          </span>

          <div className="flex-1 flex items-center gap-2 min-w-0">
            {renderValue()}
            <span className={`text-xs px-1.5 py-0.5 rounded ${getTypeColor(type)} bg-opacity-10`}>
              {type}
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              const valueStr = typeof value === 'string' ? value : JSON.stringify(value, null, 2);
              copyToClipboard(valueStr, fullPath);
            }}
            className="ml-2 p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity rounded hover:bg-gray-200 dark:hover:bg-gray-600"
            title="Copy value"
          >
            {isCopied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
          </button>
        </div>

        {hasChildren && isExpanded && (
          <div className="border-l-2 border-gray-200 dark:border-gray-700 ml-4">
            {isObject && Object.entries(value).map(([key, val]) => (
              <TreeNode
                key={key}
                objKey={key}
                value={val}
                path={fullPath}
                level={level + 1}
              />
            ))}
            {isArray && value.map((val, index) => (
              <TreeNode
                key={index}
                objKey={`[${index}]`}
                value={val}
                path={fullPath}
                level={level + 1}
              />
            ))}
            {isObject && <div className="text-gray-400 text-xs px-2" style={{ paddingLeft: `${(level + 1) * 24 + 8}px` }}>{'}'}</div>}
            {isArray && <div className="text-gray-400 text-xs px-2" style={{ paddingLeft: `${(level + 1) * 24 + 8}px` }}>{']'}</div>}
          </div>
        )}
      </div>
    );
  };

  const FormattedView = () => (
    <div className="bg-gray-900 text-gray-100 p-6 rounded-xl font-mono text-sm overflow-auto shadow-inner" style={{ maxHeight: '70vh' }}>
      <pre className="whitespace-pre-wrap">
        {JSON.stringify(jsonData, null, 2)}
      </pre>
    </div>
  );

  const RawView = () => (
    <div className="bg-gray-900 text-gray-100 p-6 rounded-xl font-mono text-sm overflow-auto shadow-inner" style={{ maxHeight: '70vh' }}>
      <pre className="whitespace-pre-wrap break-all">
        {JSON.stringify(jsonData)}
      </pre>
    </div>
  );

  const TreeView = () => (
    <div className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-lg">
      <div className="p-4 border-b-2 border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-750">
        <div className="flex justify-between items-center flex-wrap gap-3">
          <div className="flex space-x-2">
            <button
              onClick={expandAll}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow-md"
            >
              Expand All
            </button>
            <button
              onClick={collapseAll}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow-md"
            >
              Collapse All
            </button>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="string">Strings</option>
              <option value="number">Numbers</option>
              <option value="boolean">Booleans</option>
              <option value="array">Arrays</option>
              <option value="object">Objects</option>
              <option value="null">Null</option>
            </select>

            <div className="text-sm font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-700 px-3 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600">
              {Object.keys(jsonData).length} root {Object.keys(jsonData).length === 1 ? 'property' : 'properties'}
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-auto" style={{ maxHeight: '60vh' }}>
        {Object.entries(jsonData).map(([key, value]) => (
          <TreeNode key={key} objKey={key} value={value} />
        ))}
      </div>
    </div>
  );

  const SelectedValueDetails = () => {
    if (!selectedPath) return null;

    const value = getValueAtPath(jsonData, selectedPath);
    const type = getValueType(value);

    return (
      <div className="mt-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-5 shadow-lg">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h4 className="font-bold text-gray-800 dark:text-gray-200 text-lg mb-2">
              Selected Path
            </h4>
            <code className="text-sm bg-white dark:bg-gray-800 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 block break-all">
              {selectedPath}
            </code>
            <div className="mt-2">
              <span className={`text-sm font-semibold px-2 py-1 rounded ${getTypeColor(type)} bg-white dark:bg-gray-800`}>
                Type: {type}
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              const valueStr = typeof value === 'string' ? value : JSON.stringify(value, null, 2);
              copyToClipboard(valueStr, selectedPath);
            }}
            className="ml-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow-md flex items-center gap-2"
          >
            {copiedPath === selectedPath ? <Check size={16} /> : <Copy size={16} />}
            {copiedPath === selectedPath ? 'Copied!' : 'Copy Value'}
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg p-4 font-mono text-sm overflow-auto max-h-64 shadow-inner">
          <pre className="whitespace-pre-wrap break-all">
            {typeof value === 'string' ? value : JSON.stringify(value, null, 2)}
          </pre>
        </div>
      </div>
    );
  };

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50' : 'h-screen'} bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden`}>
      {/* Header */}
      <div className="p-6 border-b-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center space-x-4">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {title}
            </h2>
            <span className="px-4 py-1.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full text-sm font-semibold shadow-md">
              {Object.keys(jsonData).length} {Object.keys(jsonData).length === 1 ? 'property' : 'properties'}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1 shadow-inner">
              {['tree', 'formatted', 'raw'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                    viewMode === mode
                      ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-md'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100'
                  }`}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
            <button
              onClick={downloadJSON}
              className="p-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all shadow-md hover:shadow-lg"
              title="Download JSON"
            >
              <Download size={20} />
            </button>
            <button
              onClick={() => copyToClipboard(JSON.stringify(jsonData, null, 2), 'all')}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all shadow-md hover:shadow-lg text-sm font-semibold flex items-center gap-2"
            >
              {copiedPath === 'all' ? <Check size={18} /> : <Copy size={18} />}
              {copiedPath === 'all' ? 'Copied!' : 'Copy All'}
            </button>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2.5 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all shadow-md hover:shadow-lg"
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            >
              {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center space-x-4">
          <div className="flex-1 max-w-2xl relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search keys, values, paths..."
              className="w-full pl-11 pr-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
            />
          </div>
          {searchTerm && (
            <div className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-lg text-sm font-semibold border-2 border-blue-300 dark:border-blue-700">
              {highlightPaths.size} {highlightPaths.size !== 1 ? 'results' : 'result'}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 overflow-auto" style={{ height: 'calc(100% - 180px)' }}>
        {viewMode === 'formatted' && <FormattedView />}
        {viewMode === 'raw' && <RawView />}
        {viewMode === 'tree' && (
          <>
            <TreeView />
            <SelectedValueDetails />
          </>
        )}
      </div>
    </div>
  );
};

export default JSONDataViewer;
