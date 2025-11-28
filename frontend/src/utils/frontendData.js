/**
 * Frontend Data Layer
 * Normalizes backend responses into a unified structure for UI components.
 * This ensures all components receive consistent data regardless of API variations.
 */

export const normalizeModernizationData = (backendData) => {
  if (!backendData) return null;

  // Default structure with fallbacks
  return {
    // Core Metrics
    confidenceScore: backendData.confidence || backendData.confidenceScore || 0,
    complexity: backendData.dashboardData?.complexity || backendData.complexity || 'Unknown',
    validationScore: backendData.dashboardData?.validationScore || 0,

    // Code Metrics
    linesOfCode: backendData.dashboardData?.linesOfCode || 0,
    dependencies: backendData.dashboardData?.dependencies || 0,

    // Schema Data
    schema: {
      tables: backendData.schema?.tables || [],
      tableCount: backendData.schema?.tables?.length || 0,
      relationships: backendData.schema?.relationships || [] // Assuming relationships might be top-level or derived
    },

    // API Data
    api: {
      endpoints: backendData.apiDesign?.endpoints || [],
      endpointCount: backendData.apiDesign?.endpoints?.length || 0,
      models: backendData.apiDesign?.models || [],
      security: backendData.apiDesign?.security || {},
      architecture: backendData.apiDesign?.architecture || {}
    },

    // Microservices
    microservices: backendData.microservices || [], // Assuming microservices array exists or needs derivation

    // Documentation & Plan
    documentation: {
      summary: backendData.documentation?.summary || '',
      technicalDetails: backendData.documentation?.technicalDetails || '',
      migrationPlan: backendData.documentation?.migrationPlan || '',
      risks: backendData.documentation?.risks || [],
      benefits: backendData.documentation?.benefits || [] // If available
    },

    // AI Agents Info (if available in response)
    agents: backendData.agents || {
      parser: { status: 'completed', score: 100 },
      transformer: { status: 'completed', score: 100 },
      validator: { status: 'completed', score: backendData.confidence ? backendData.confidence * 100 : 0 },
      generator: { status: 'completed', score: 100 }
    },

    // Raw Data (for JSON viewer)
    raw: backendData
  };
};

export const getChartData = (normalizedData) => {
  if (!normalizedData) return null;

  return {
    confidenceVsValidation: [
      { name: 'Confidence', value: normalizedData.confidenceScore * 100, fullMark: 100 },
      { name: 'Validation', value: normalizedData.validationScore, fullMark: 100 }
    ],
    complexityDistribution: [
      { name: 'LOC', value: normalizedData.linesOfCode },
      { name: 'Dependencies', value: normalizedData.dependencies * 10 } // Scaling for visualization
    ],
    schemaStats: [
      { name: 'Tables', value: normalizedData.schema.tableCount },
      { name: 'Endpoints', value: normalizedData.api.endpointCount }
    ]
  };
};
