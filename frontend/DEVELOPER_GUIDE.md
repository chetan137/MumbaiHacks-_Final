# Developer Guide - Visual Components

## Quick Start

### Importing Components

```javascript
// Import individual components
import { OverviewCard, MigrationAnalysis, TechStack } from '../visuals';

// Or import specific component
import OverviewCard from '../visuals/OverviewCard';
```

### Importing Data

```javascript
import {
  sampleModernizationData,
  dashboardMetrics,
  techStackItems,
  aiAgents,
  navigationTabs
} from '../data/modernizationData';
```

## Component Usage Examples

### 1. OverviewCard

```javascript
<OverviewCard
  title="Confidence Score"
  value="85%"
  description="AI validation confidence level"
  icon="🎯"
  trend={15}
  gradient="from-green-500 to-emerald-500"
/>
```

**Props:**
- `title` (string): Card title
- `value` (string|number): Main value to display
- `description` (string): Description text
- `icon` (string): Emoji or icon
- `trend` (number, optional): Trend percentage (positive or negative)
- `gradient` (string): Tailwind gradient classes

### 2. MigrationAnalysis

```javascript
<MigrationAnalysis
  dashboardData={dashboardData}
  confidence={confidence}
/>
```

**Props:**
- `dashboardData` (object): Contains linesOfCode, dependencies, validationScore
- `confidence` (number): Confidence score (0-1)

### 3. TechStack

```javascript
<TechStack />
```

**Props:** None (uses data from modernizationData.js)

### 4. MigrationOverview

```javascript
<MigrationOverview documentation={documentation} />
```

**Props:**
- `documentation` (object): Contains summary, technicalDetails, migrationPlan, risks

### 5. AIWorkflowBanner

```javascript
<AIWorkflowBanner />
```

**Props:** None (uses data from modernizationData.js)

### 6. AIAgentStatusPanel

```javascript
<AIAgentStatusPanel />
```

**Props:** None (uses data from modernizationData.js)

### 7. DashboardHeader

```javascript
<DashboardHeader
  modernizationResults={modernizationResults}
  confidence={confidence}
/>
```

**Props:**
- `modernizationResults` (object): Full modernization results
- `confidence` (number): Confidence score (0-1)

### 8. SidebarNavigation

```javascript
<SidebarNavigation
  activeTab={activeTab}
  setActiveTab={setActiveTab}
  uploadedFile={uploadedFile}
/>
```

**Props:**
- `activeTab` (string): Current active tab ID
- `setActiveTab` (function): Function to change active tab
- `uploadedFile` (File|Array): Uploaded file(s)

### 9. FileUploadZone

```javascript
<FileUploadZone onFileUpload={handleFileUpload} />
```

**Props:**
- `onFileUpload` (function): Callback when files are uploaded

### 10. ProcessingStatus

```javascript
<ProcessingStatus
  isProcessing={isProcessing}
  processingStatus={processingStatus}
  error={error}
  onDismissError={() => setError(null)}
/>
```

**Props:**
- `isProcessing` (boolean): Whether processing is active
- `processingStatus` (object, optional): Processing status with progress and logs
- `error` (string, optional): Error message
- `onDismissError` (function): Callback to dismiss error

## Data Structure Reference

### sampleModernizationData

```javascript
{
  schema: {
    tables: [...]
  },
  apiDesign: {
    endpoints: [...],
    models: [...],
    security: {...},
    architecture: {...}
  },
  dashboardData: {
    complexity: "medium",
    confidence: 0.85,
    linesOfCode: 1250,
    dependencies: 5,
    validationScore: 88
  },
  documentation: {
    summary: "...",
    technicalDetails: "...",
    migrationPlan: "...",
    risks: [...]
  },
  confidence: 0.85
}
```

### dashboardMetrics

```javascript
[
  {
    title: "Confidence Score",
    key: "confidence",
    icon: "🎯",
    gradient: "from-green-500 to-emerald-500",
    description: "AI validation confidence level",
    format: (value) => `${Math.round(value * 100)}%`,
    trend: (value) => value > 0.7 ? 15 : -5
  },
  // ... more metrics
]
```

## Customization

### Adding New Metrics

1. Add metric configuration to `modernizationData.js`:

```javascript
export const dashboardMetrics = [
  // ... existing metrics
  {
    title: "New Metric",
    key: "newMetricKey",
    icon: "🆕",
    gradient: "from-blue-500 to-purple-500",
    description: "Description of new metric"
  }
];
```

2. Use in component:

```javascript
{dashboardMetrics.map((metric, idx) => (
  <OverviewCard key={idx} {...metric} value={data[metric.key]} />
))}
```

### Adding New Tech Stack Items

Edit `modernizationData.js`:

```javascript
export const techStackItems = [
  // ... existing items
  { name: 'New Technology', icon: '🆕', color: 'blue' }
];
```

### Customizing Colors

All color mappings are in `modernizationData.js`:

```javascript
export const getConfidenceColor = (confidence) => {
  if (confidence >= 0.8) return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
  if (confidence >= 0.6) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400';
  return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400';
};
```

## Best Practices

1. **Always use centralized data** - Don't hardcode values in components
2. **Keep components pure** - Components should only handle presentation
3. **Use consistent naming** - Follow existing naming conventions
4. **Maintain responsiveness** - Test on different screen sizes
5. **Preserve dark mode** - Ensure all new styles work in dark mode
6. **Add prop validation** - Consider adding PropTypes or TypeScript
7. **Document changes** - Update this guide when adding new components

## Troubleshooting

### Component not rendering?
- Check if data is being passed correctly
- Verify imports are correct
- Check browser console for errors

### Styling issues?
- Ensure Tailwind classes are correct
- Check dark mode classes are included
- Verify gradient syntax

### Data not updating?
- Check if state is being updated correctly
- Verify data structure matches expected format
- Check if component is re-rendering

## Support

For questions or issues:
1. Check this guide first
2. Review component source code
3. Check REFACTORING_SUMMARY.md for architecture overview
4. Review modernizationData.js for data structure
