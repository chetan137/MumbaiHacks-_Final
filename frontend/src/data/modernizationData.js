/**
 * Centralized Data File for Modernization App
 * All static and dynamic data for the frontend UI
 */

// Sample Modernization Results Data
export const sampleModernizationData = {
  schema: {
    tables: [
      {
        name: "customers",
        columns: [
          { name: "id", type: "INT", isPrimary: true, isNotNull: true },
          { name: "customer_id", type: "VARCHAR(20)", isUnique: true, isNotNull: true },
          { name: "customer_name", type: "VARCHAR(100)", isNotNull: true },
          { name: "customer_address", type: "TEXT" },
          { name: "created_at", type: "TIMESTAMP", hasDefault: true },
          { name: "updated_at", type: "TIMESTAMP", hasDefault: true }
        ],
        relationships: []
      },
      {
        name: "customer_reports",
        columns: [
          { name: "id", type: "INT", isPrimary: true, isNotNull: true },
          { name: "customer_id", type: "VARCHAR(20)", isNotNull: true },
          { name: "report_date", type: "DATE", isNotNull: true },
          { name: "report_data", type: "JSON" }
        ],
        relationships: [
          { fromColumn: "customer_id", toTable: "customers", toColumn: "customer_id" }
        ]
      }
    ]
  },
  apiDesign: {
    endpoints: [
      {
        path: "/api/customers",
        method: "GET",
        description: "Get all customers with pagination",
        parameters: ["page", "limit", "search"],
        response: "List of customer objects"
      },
      {
        path: "/api/customers/{id}",
        method: "GET",
        description: "Get customer by ID",
        parameters: ["id"],
        response: "Customer object"
      },
      {
        path: "/api/customers",
        method: "POST",
        description: "Create new customer",
        body: "Customer data object",
        response: "Created customer object"
      },
      {
        path: "/api/customers/{id}",
        method: "PUT",
        description: "Update customer",
        parameters: ["id"],
        body: "Updated customer data",
        response: "Updated customer object"
      },
      {
        path: "/api/customers/{id}",
        method: "DELETE",
        description: "Delete customer",
        parameters: ["id"],
        response: "Success confirmation"
      },
      {
        path: "/api/customers/{id}/reports",
        method: "GET",
        description: "Get customer reports",
        parameters: ["id", "date_from", "date_to"],
        response: "List of report objects"
      }
    ],
    models: [
      {
        name: "Customer",
        fields: [
          { name: "id", type: "integer", required: true },
          { name: "customerId", type: "string", required: true },
          { name: "customerName", type: "string", required: true },
          { name: "customerAddress", type: "string", required: false },
          { name: "createdAt", type: "datetime", required: true },
          { name: "updatedAt", type: "datetime", required: true }
        ]
      },
      {
        name: "CustomerReport",
        fields: [
          { name: "id", type: "integer", required: true },
          { name: "customerId", type: "string", required: true },
          { name: "reportDate", type: "date", required: true },
          { name: "reportData", type: "object", required: true }
        ]
      }
    ],
    security: {
      authentication: "JWT",
      authorization: "RBAC",
      rateLimiting: "100 requests per minute",
      inputValidation: "Joi schema validation",
      sqlInjectionPrevention: "Parameterized queries"
    },
    architecture: {
      pattern: "Microservices",
      framework: "Spring Boot",
      database: "MySQL",
      caching: "Redis",
      messaging: "Apache Kafka"
    }
  },
  dashboardData: {
    complexity: "medium",
    confidence: 0.85,
    linesOfCode: 1250,
    dependencies: 5,
    validationScore: 88
  },
  documentation: {
    summary: "This legacy COBOL program processes customer records in batch mode, reading from flat files and generating reports. The modernization approach converts it to a REST API-based microservice architecture with proper database normalization.",
    technicalDetails: "The original system used fixed-length record formats with COBOL data structures. The modernized version uses relational database tables with proper normalization, RESTful APIs for data access, and microservices for scalability.",
    migrationPlan: "Phase 1: Database setup and data migration (2-3 weeks). Phase 2: API development and testing (4-6 weeks). Phase 3: Integration and deployment (2-3 weeks).",
    risks: [
      "Data loss during migration",
      "Performance impact during transition",
      "Learning curve for development team",
      "Integration challenges with existing systems"
    ]
  },
  confidence: 0.85
};

// Dashboard Metrics Configuration
export const dashboardMetrics = [
  {
    title: "Confidence Score",
    key: "confidence",
    icon: "🎯",
    gradient: "from-green-500 to-emerald-500",
    description: "AI validation confidence level",
    format: (value) => `${Math.round(value * 100)}%`,
    trend: (value) => value > 0.7 ? 15 : -5
  },
  {
    title: "Database Tables",
    key: "tablesCount",
    icon: "🗄️",
    gradient: "from-purple-500 to-pink-500",
    description: "Generated modern DB schema"
  },
  {
    title: "API Endpoints",
    key: "endpointsCount",
    icon: "🔌",
    gradient: "from-blue-500 to-cyan-500",
    description: "REST API endpoints created"
  },
  {
    title: "Complexity",
    key: "complexity",
    icon: "⚡",
    gradient: "from-orange-500 to-red-500",
    description: "Code complexity assessment",
    format: (value) => value || 'Medium'
  }
];

// Migration Analysis Metrics
export const migrationMetrics = [
  { label: 'Lines of Code', key: 'linesOfCode', icon: '📝', color: 'blue' },
  { label: 'Dependencies', key: 'dependencies', icon: '🔗', color: 'purple' },
  { label: 'Validation Score', key: 'validationScore', icon: '✅', color: 'green', format: (val) => `${val}%` },
  { label: 'Confidence Level', key: 'confidence', icon: '🎯', color: 'orange', format: (val) => `${Math.round(val * 100)}%` }
];

// Technology Stack Items
export const techStackItems = [
  { name: 'Spring Boot Framework', icon: '🍃', color: 'green' },
  { name: 'MySQL Database', icon: '🐬', color: 'blue' },
  { name: 'Microservices Architecture', icon: '🏗️', color: 'purple' },
  { name: 'REST APIs', icon: '🔌', color: 'orange' },
  { name: 'Redis Caching', icon: '⚡', color: 'red' },
  { name: 'Apache Kafka', icon: '📨', color: 'indigo' }
];

// Key Benefits List
export const keyBenefits = [
  'Modern REST API architecture',
  'Scalable microservices design',
  'Improved maintainability',
  'Better performance and reliability',
  'Cloud-ready infrastructure',
  'Enhanced security measures'
];

// Implementation Steps
export const implementationSteps = [
  'Database schema migration',
  'API endpoint development',
  'Security implementation',
  'Testing and validation',
  'Performance optimization',
  'Deployment and monitoring'
];

// AI Agents Configuration
export const aiAgents = [
  { name: 'Parser', status: 'active', icon: '🔍', color: 'green' },
  { name: 'Transformer', status: 'active', icon: '🔄', color: 'blue' },
  { name: 'Validator', status: 'active', icon: '✅', color: 'purple' },
  { name: 'Generator', status: 'active', icon: '⚙️', color: 'orange' }
];

// AI Workflow Emojis
export const aiWorkflowEmojis = ['🔍', '🔄', '✅', '🔧', '💬', '🌐'];

// Feature Highlights
export const featureHighlights = [
  {
    icon: '🗄️',
    title: 'Database Schema',
    description: 'Auto-generated modern database structures',
    color: '#3b82f6',
    delay: 0
  },
  {
    icon: '🔗',
    title: 'REST API Design',
    description: 'Complete API architecture with endpoints',
    color: '#8b5cf6',
    delay: 0.1
  },
  {
    icon: '🏗️',
    title: 'Microservices',
    description: 'Scalable microservices architecture',
    color: '#06b6d4',
    delay: 0.2
  },
  {
    icon: '📊',
    title: 'Analytics',
    description: 'Detailed insights and metrics',
    color: '#10b981',
    delay: 0.3
  }
];

// Navigation Tabs Configuration
export const navigationTabs = [
  { id: 'overview', label: 'Overview', icon: '📊', color: 'from-blue-500 to-cyan-500' },
  { id: 'schema', label: 'Database Schema', icon: '🗄️', color: 'from-purple-500 to-pink-500' },
  { id: 'api', label: 'REST APIs', icon: '🔌', color: 'from-green-500 to-emerald-500' },
  { id: 'architecture', label: 'Microservices', icon: '🏗️', color: 'from-orange-500 to-red-500' },
  { id: 'json', label: 'JSON Data', icon: '📄', color: 'from-indigo-500 to-purple-500' },
  { id: 'documentation', label: 'Documentation', icon: '📖', color: 'from-yellow-500 to-orange-500' }
];

// File Upload Configuration
export const acceptedFileExtensions = ['.cpy', '.dat', '.csv', '.json', '.txt', '.cobol', '.cbl'];

// Info Cards for Upload Section
export const uploadInfoCards = [
  {
    icon: '🤖',
    title: 'AI-Powered',
    description: 'Multi-agent system analyzes your code'
  },
  {
    icon: '⚡',
    title: 'Fast Processing',
    description: 'Get results in minutes, not weeks'
  },
  {
    icon: '🎯',
    title: 'High Accuracy',
    description: 'Validated transformations with confidence scores'
  }
];

// Confidence Score Color Mapping
export const getConfidenceColor = (confidence) => {
  if (confidence >= 0.8) return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
  if (confidence >= 0.6) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400';
  return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400';
};

// Complexity Color Mapping
export const getComplexityColor = (complexity) => {
  const complexityLower = complexity?.toLowerCase();
  if (complexityLower === 'low') return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
  if (complexityLower === 'medium') return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400';
  return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400';
};

export default {
  sampleModernizationData,
  dashboardMetrics,
  migrationMetrics,
  techStackItems,
  keyBenefits,
  implementationSteps,
  aiAgents,
  aiWorkflowEmojis,
  featureHighlights,
  navigationTabs,
  acceptedFileExtensions,
  uploadInfoCards,
  getConfidenceColor,
  getComplexityColor
};
