import React, { useState, useRef, useEffect } from 'react';
import { Server, Database, Lock, Settings, Activity, Zap, Mail, Box, Users, ShoppingCart, Package, CreditCard, Bell, Layout, ZoomIn, ZoomOut, Maximize2, Grid3x3, List, Network } from 'lucide-react';

const MicroservicesArchitecture = ({ architectureData, apiData }) => {
  const [selectedService, setSelectedService] = useState(null);
  const [viewMode, setViewMode] = useState('diagram');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [canvasPosition, setCanvasPosition] = useState({ x: 0, y: 0 });
  const [hoveredService, setHoveredService] = useState(null);
  const canvasRef = useRef(null);

  // Sample data for demonstration
  const sampleApiData = {
    endpoints: [
      { path: '/api/customers', method: 'GET', description: 'List customers' },
      { path: '/api/customers', method: 'POST', description: 'Create customer' },
      { path: '/api/orders', method: 'GET', description: 'List orders' },
      { path: '/api/orders', method: 'POST', description: 'Create order' },
      { path: '/api/products', method: 'GET', description: 'List products' },
      { path: '/api/products', method: 'PUT', description: 'Update product' },
      { path: '/api/inventory', method: 'GET', description: 'Check inventory' },
      { path: '/api/payments', method: 'POST', description: 'Process payment' },
      { path: '/api/notifications', method: 'POST', description: 'Send notification' },
    ]
  };

  const sampleArchitecture = {
    database: 'PostgreSQL',
    caching: 'Redis',
    messaging: 'RabbitMQ',
    framework: 'Spring Boot'
  };

  const data = apiData || sampleApiData;
  const architecture = architectureData || sampleArchitecture;

  // Icon mapping for services
  const getServiceIcon = (serviceName) => {
    const iconMap = {
      'api-gateway': Layout,
      'auth-service': Lock,
      'config-service': Settings,
      'logging-service': Activity,
      'monitoring-service': Activity,
      'database': Database,
      'cache': Zap,
      'message-queue': Mail,
      'customers': Users,
      'orders': ShoppingCart,
      'products': Package,
      'inventory': Box,
      'payments': CreditCard,
      'notifications': Bell,
    };
    return iconMap[serviceName] || Server;
  };

  // Generate microservices from API data
  const generateMicroservices = () => {
    const endpoints = data?.endpoints || [];
    const serviceGroups = {};

    endpoints.forEach(endpoint => {
      const pathParts = endpoint.path.split('/').filter(p => p);
      const serviceName = pathParts[1] || 'general';

      if (!serviceGroups[serviceName]) {
        serviceGroups[serviceName] = {
          name: serviceName,
          endpoints: [],
          dependencies: new Set(),
          type: 'business',
          status: 'healthy',
          version: '1.0.0'
        };
      }

      serviceGroups[serviceName].endpoints.push(endpoint);
    });

    const infrastructureServices = [
      { name: 'api-gateway', type: 'infrastructure', description: 'Routes requests & handles authentication', status: 'healthy', version: '2.0.0' },
      { name: 'auth-service', type: 'infrastructure', description: 'Manages authentication & authorization', status: 'healthy', version: '1.5.0' },
      { name: 'config-service', type: 'infrastructure', description: 'Centralized configuration management', status: 'healthy', version: '1.2.0' },
      { name: 'logging-service', type: 'infrastructure', description: 'Centralized logging & monitoring', status: 'healthy', version: '1.3.0' },
    ];

    const dataServices = [
      { name: 'database', type: 'data', description: `${architecture.database || 'PostgreSQL'} primary database`, status: 'healthy', version: '14.0' },
      { name: 'cache', type: 'data', description: `${architecture.caching || 'Redis'} cache layer`, status: 'healthy', version: '7.0' },
      { name: 'message-queue', type: 'data', description: `${architecture.messaging || 'RabbitMQ'} message broker`, status: 'healthy', version: '3.11' }
    ];

    return {
      business: Object.values(serviceGroups),
      infrastructure: infrastructureServices,
      data: dataServices
    };
  };

  const services = generateMicroservices();

  // Canvas dragging handlers
  const handleMouseDown = (e) => {
    if (e.target.classList.contains('canvas-area')) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - canvasPosition.x,
        y: e.clientY - canvasPosition.y
      });
    }
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

  // Service colors based on type
  const getServiceColor = (type) => {
    const colors = {
      business: {
        bg: 'bg-blue-500',
        border: 'border-blue-600',
        hover: 'hover:bg-blue-600',
        light: 'bg-blue-50',
        text: 'text-blue-700'
      },
      infrastructure: {
        bg: 'bg-purple-500',
        border: 'border-purple-600',
        hover: 'hover:bg-purple-600',
        light: 'bg-purple-50',
        text: 'text-purple-700'
      },
      data: {
        bg: 'bg-green-500',
        border: 'border-green-600',
        hover: 'hover:bg-green-600',
        light: 'bg-green-50',
        text: 'text-green-700'
      }
    };
    return colors[type] || colors.business;
  };

  // Position calculation for services
  const generateServicePositions = () => {
    const positions = {};
    const centerX = 600;
    const layers = {
      infrastructure: { y: 100, spacing: 260 },
      business: { y: 320, spacing: 260 },
      data: { y: 540, spacing: 340 }
    };

    Object.entries(services).forEach(([type, serviceList]) => {
      const totalWidth = (serviceList.length - 1) * layers[type].spacing;
      const startX = centerX - totalWidth / 2;

      serviceList.forEach((service, index) => {
        positions[service.name] = {
          x: startX + (index * layers[type].spacing),
          y: layers[type].y
        };
      });
    });

    return positions;
  };

  const servicePositions = generateServicePositions();

  // Connection generation
  const generateConnections = () => {
    const connections = [];

    // API Gateway to business services
    services.business.forEach(service => {
      connections.push({
        from: 'api-gateway',
        to: service.name,
        type: 'http',
        label: 'REST API'
      });
    });

    // Business services to database
    services.business.forEach(service => {
      connections.push({
        from: service.name,
        to: 'database',
        type: 'database',
        label: 'SQL'
      });
    });

    // Business services to cache (for GET endpoints)
    services.business.forEach(service => {
      if (service.endpoints?.some(e => e.method === 'GET')) {
        connections.push({
          from: service.name,
          to: 'cache',
          type: 'cache',
          label: 'Cache'
        });
      }
    });

    // Business services to auth
    services.business.forEach(service => {
      connections.push({
        from: service.name,
        to: 'auth-service',
        type: 'auth',
        label: 'Verify'
      });
    });

    // Some services to message queue
    ['orders', 'payments', 'notifications'].forEach(serviceName => {
      if (services.business.find(s => s.name === serviceName)) {
        connections.push({
          from: serviceName,
          to: 'message-queue',
          type: 'event',
          label: 'Events'
        });
      }
    });

    return connections;
  };

  const connections = generateConnections();

  // Service Card Component
  const ServiceCard = ({ service, position, onClick }) => {
    const colors = getServiceColor(service.type);
    const Icon = getServiceIcon(service.name);
    const isHovered = hoveredService === service.name;
    const isSelected = selectedService?.name === service.name;

    return (
      <div
        className={`absolute transition-all duration-300 ${isHovered || isSelected ? 'z-30' : 'z-20'}`}
        style={{
          left: position.x - 110,
          top: position.y - 60,
          transform: `scale(${zoomLevel}) ${isHovered ? 'translateY(-4px)' : ''}`
        }}
        onMouseEnter={() => setHoveredService(service.name)}
        onMouseLeave={() => setHoveredService(null)}
      >
        <div
          className={`w-56 ${colors.bg} ${colors.hover} rounded-xl shadow-lg cursor-pointer border-2 ${colors.border} overflow-hidden transition-all ${
            isSelected ? 'ring-4 ring-yellow-400' : ''
          }`}
          onClick={() => onClick(service)}
        >
          {/* Header */}
          <div className="bg-white/10 backdrop-blur-sm p-3 border-b border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-white/20 p-2 rounded-lg">
                  <Icon size={20} className="text-white" />
                </div>
                <div className="text-white">
                  <h3 className="font-bold text-sm leading-tight capitalize">
                    {service.name.replace(/-/g, ' ')}
                  </h3>
                  <p className="text-xs opacity-80">{service.type}</p>
                </div>
              </div>
              <div className={`w-2 h-2 rounded-full ${service.status === 'healthy' ? 'bg-green-400' : 'bg-red-400'} shadow-lg`}></div>
            </div>
          </div>

          {/* Body */}
          <div className="p-3 text-white">
            {service.description && (
              <p className="text-xs opacity-90 mb-2 line-clamp-2">
                {service.description}
              </p>
            )}

            {service.endpoints && (
              <div className="flex items-center justify-between text-xs">
                <span className="opacity-80">
                  {service.endpoints.length} endpoint{service.endpoints.length !== 1 ? 's' : ''}
                </span>
                <span className="bg-white/20 px-2 py-0.5 rounded">
                  v{service.version}
                </span>
              </div>
            )}

            {!service.endpoints && (
              <div className="flex items-center justify-between text-xs">
                <span className="opacity-80">Infrastructure</span>
                <span className="bg-white/20 px-2 py-0.5 rounded">
                  v{service.version}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Connection Line Component
  const ConnectionLine = ({ connection }) => {
    const fromPos = servicePositions[connection.from];
    const toPos = servicePositions[connection.to];

    if (!fromPos || !toPos) return null;

    const getConnectionStyle = (type) => {
      const styles = {
        http: { color: '#3b82f6', dash: '', width: 2 },
        database: { color: '#10b981', dash: '', width: 2 },
        cache: { color: '#f59e0b', dash: '5,5', width: 2 },
        auth: { color: '#8b5cf6', dash: '3,3', width: 1.5 },
        event: { color: '#ec4899', dash: '', width: 2 }
      };
      return styles[type] || styles.http;
    };

    const style = getConnectionStyle(connection.type);

    // Calculate path for curved line
    const midY = (fromPos.y + toPos.y) / 2;
    const path = `M ${fromPos.x} ${fromPos.y + 60} Q ${fromPos.x} ${midY}, ${(fromPos.x + toPos.x) / 2} ${midY} T ${toPos.x} ${toPos.y - 60}`;

    return (
      <g className="connection-group">
        <path
          d={path}
          stroke={style.color}
          strokeWidth={style.width}
          strokeDasharray={style.dash}
          fill="none"
          markerEnd={`url(#arrow-${connection.type})`}
          opacity="0.6"
        />
      </g>
    );
  };

  // View Controls
  const ViewModeToggle = () => (
    <div className="flex bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      {[
        { mode: 'diagram', icon: Network, label: 'Diagram' },
        { mode: 'details', icon: Grid3x3, label: 'Details' },
        { mode: 'dependencies', icon: List, label: 'Dependencies' }
      ].map(({ mode, icon: Icon, label }) => (
        <button
          key={mode}
          onClick={() => setViewMode(mode)}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all ${
            viewMode === mode
              ? 'bg-blue-500 text-white rounded-lg shadow-sm'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Icon size={16} />
          {label}
        </button>
      ))}
    </div>
  );

  const ZoomControls = () => (
    <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 px-2 py-2">
      <button
        onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.1))}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
        title="Zoom Out"
      >
        <ZoomOut size={18} />
      </button>
      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 min-w-16 text-center">
        {Math.round(zoomLevel * 100)}%
      </span>
      <button
        onClick={() => setZoomLevel(Math.min(2, zoomLevel + 0.1))}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
        title="Zoom In"
      >
        <ZoomIn size={18} />
      </button>
      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>
      <button
        onClick={() => setZoomLevel(1)}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
        title="Reset View"
      >
        <Maximize2 size={18} />
      </button>
    </div>
  );

  // Service Details Panel
  const ServiceDetailsPanel = ({ service }) => {
    const colors = getServiceColor(service.type);
    const Icon = getServiceIcon(service.name);

    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Header */}
        <div className={`${colors.bg} p-4 text-white`}>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-white/20 p-3 rounded-lg">
              <Icon size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold capitalize">
                {service.name.replace(/-/g, ' ')}
              </h3>
              <p className="text-sm opacity-90">{service.type} Service</p>
            </div>
          </div>
          {service.description && (
            <p className="text-sm opacity-90">{service.description}</p>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Status */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Status</p>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${service.status === 'healthy' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                <span className="text-sm font-semibold capitalize">{service.status}</span>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Version</p>
              <p className="text-sm font-semibold">v{service.version}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Port</p>
              <p className="text-sm font-semibold">8080</p>
            </div>
          </div>

          {/* Endpoints */}
          {service.endpoints && service.endpoints.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                <div className="w-1 h-5 bg-blue-500 rounded"></div>
                Endpoints
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {service.endpoints.map((endpoint, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    <div className="flex items-center gap-3 flex-1">
                      <span className={`px-2 py-1 rounded font-bold text-xs text-white ${
                        endpoint.method === 'GET' ? 'bg-green-500' :
                        endpoint.method === 'POST' ? 'bg-blue-500' :
                        endpoint.method === 'PUT' ? 'bg-orange-500' :
                        endpoint.method === 'DELETE' ? 'bg-red-500' : 'bg-gray-500'
                      }`}>
                        {endpoint.method}
                      </span>
                      <code className="text-sm text-gray-700 dark:text-gray-300">{endpoint.path}</code>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                      {endpoint.description}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Technology Stack */}
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
              <div className="w-1 h-5 bg-purple-500 rounded"></div>
              Technology Stack
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Framework</p>
                <p className="text-sm font-semibold">{architecture.framework || 'Spring Boot'}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Runtime</p>
                <p className="text-sm font-semibold">JVM 17+</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Details View
  const DetailsView = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 p-6">
      {Object.values(services).flat().map((service, index) => (
        <div
          key={service.name}
          className="opacity-0 animate-fadeIn"
          style={{ animationDelay: `${index * 0.05}s`, animationFillMode: 'forwards' }}
        >
          <ServiceDetailsPanel service={service} />
        </div>
      ))}
    </div>
  );

  // Dependencies View
  const DependenciesView = () => (
    <div className="p-6 space-y-6">
      {/* Legend */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 border-gray-200 dark:border-gray-700 p-5">
        <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-4 text-lg">Connection Types</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { type: 'http', color: 'bg-blue-500', label: 'HTTP API', dash: false },
            { type: 'database', color: 'bg-green-500', label: 'Database', dash: false },
            { type: 'cache', color: 'bg-yellow-500', label: 'Cache', dash: true },
            { type: 'auth', color: 'bg-purple-500', label: 'Auth', dash: true },
            { type: 'event', color: 'bg-pink-500', label: 'Events', dash: false }
          ].map(({ type, color, label, dash }) => (
            <div key={type} className="flex items-center gap-2">
              <div className={`w-8 h-0.5 ${color} ${dash ? 'opacity-60' : ''}`}></div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Dependencies Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-5 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-bold text-gray-800 dark:text-gray-200 text-lg">Service Dependencies Matrix</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Service</th>
                <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Depends On</th>
                <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Type</th>
                <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Purpose</th>
              </tr>
            </thead>
            <tbody>
              {connections.map((conn, index) => (
                <tr key={index} className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="p-4">
                    <span className="font-semibold text-gray-800 dark:text-gray-200 capitalize">
                      {conn.from.replace(/-/g, ' ')}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-gray-700 dark:text-gray-300 capitalize">
                      {conn.to.replace(/-/g, ' ')}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      conn.type === 'http' ? 'bg-blue-100 text-blue-700' :
                      conn.type === 'database' ? 'bg-green-100 text-green-700' :
                      conn.type === 'cache' ? 'bg-yellow-100 text-yellow-700' :
                      conn.type === 'auth' ? 'bg-purple-100 text-purple-700' :
                      'bg-pink-100 text-pink-700'
                    }`}>
                      {conn.type.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600 dark:text-gray-400 text-sm">
                    {conn.type === 'http' ? 'REST API Communication' :
                     conn.type === 'database' ? 'Data Persistence & Queries' :
                     conn.type === 'cache' ? 'Performance & Caching' :
                     conn.type === 'auth' ? 'Authentication & Security' :
                     'Asynchronous Events'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Selected Service Sidebar
  const SelectedServiceSidebar = () => {
    if (!selectedService) return null;

    return (
      <div className="fixed right-0 top-0 h-full w-96 bg-white dark:bg-gray-800 shadow-2xl z-50 overflow-y-auto border-l-2 border-gray-200 dark:border-gray-700 animate-slideInRight">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center z-10">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">Service Details</h3>
          <button
            onClick={() => setSelectedService(null)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
          >
            ✕
          </button>
        </div>
        <div className="p-4">
          <ServiceDetailsPanel service={selectedService} />
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
      {/* Header */}
      <div className="border-b-2 border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <div className="px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg">
                <Network size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Microservices Architecture
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {Object.values(services).flat().length} Services • {connections.length} Connections
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <ViewModeToggle />
            {viewMode === 'diagram' && <ZoomControls />}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="h-[calc(100vh-80px)] overflow-hidden">
        {viewMode === 'diagram' && (
          <div
            ref={canvasRef}
            className={`h-full w-full canvas-area overflow-hidden relative ${
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
            onMouseDown={handleMouseDown}
            style={{
              transform: `translate(${canvasPosition.x}px, ${canvasPosition.y}px)`,
              transition: isDragging ? 'none' : 'transform 0.3s ease'
            }}
          >
            {/* Grid Background */}
            <div className="absolute inset-0 opacity-30" style={{
              backgroundImage: 'radial-gradient(circle, #d1d5db 1px, transparent 1px)',
              backgroundSize: '30px 30px'
            }}></div>

            {/* Layer Labels */}
            <div className="absolute left-8 top-6 space-y-52 z-10 pointer-events-none">
              <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-md border-2 border-purple-300 dark:border-purple-700">
                <p className="text-sm font-bold text-purple-700 dark:text-purple-400">Infrastructure Layer</p>
              </div>
              <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-md border-2 border-blue-300 dark:border-blue-700">
                <p className="text-sm font-bold text-blue-700 dark:text-blue-400">Business Layer</p>
              </div>
              <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-md border-2 border-green-300 dark:border-green-700">
                <p className="text-sm font-bold text-green-700 dark:text-green-400">Data Layer</p>
              </div>
            </div>

            {/* SVG Connections */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" style={{ overflow: 'visible' }}>
              <defs>
                {['http', 'database', 'cache', 'auth', 'event'].map(type => (
                  <marker
                    key={type}
                    id={`arrow-${type}`}
                    markerWidth="10"
                    markerHeight="10"
                    refX="8"
                    refY="3"
                    orient="auto"
                    markerUnits="strokeWidth"
                  >
                    <path
                      d="M0,0 L0,6 L9,3 z"
                      fill={
                        type === 'http' ? '#3b82f6' :
                        type === 'database' ? '#10b981' :
                        type === 'cache' ? '#f59e0b' :
                        type === 'auth' ? '#8b5cf6' :
                        '#ec4899'
                      }
                    />
                  </marker>
                ))}
              </defs>

              {connections.map((connection, index) => (
                <ConnectionLine key={index} connection={connection} />
              ))}
            </svg>

            {/* Services */}
            {Object.values(services).flat().map((service) => (
              <ServiceCard
                key={service.name}
                service={service}
                position={servicePositions[service.name]}
                onClick={setSelectedService}
              />
            ))}
          </div>
        )}

        {viewMode === 'details' && <DetailsView />}
        {viewMode === 'dependencies' && <DependenciesView />}
      </div>

      {/* Selected Service Sidebar */}
      {selectedService && viewMode === 'diagram' && <SelectedServiceSidebar />}

      {/* Custom Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }

        .animate-slideInRight {
          animation: slideInRight 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default MicroservicesArchitecture;
