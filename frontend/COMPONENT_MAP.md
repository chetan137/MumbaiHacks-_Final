# Component Architecture Map

## Visual Component Hierarchy

```
ModernizationApp
│
├── Header Section (Landing Page)
│   ├── Logo & Title
│   ├── Load Sample Data Button
│   └── Current File Display
│
├── Feature Highlights Section
│   └── Feature Cards (from featureHighlights data)
│       ├── Database Schema
│       ├── REST API Design
│       ├── Microservices
│       └── Analytics
│
└── ModernizationDashboard (Main Dashboard)
    │
    ├── DashboardHeader
    │   ├── App Logo & Title
    │   ├── Confidence Score Badge
    │   └── Export Results Button
    │
    ├── ProcessingStatus (conditional)
    │   ├── Processing Indicator
    │   ├── Progress Bar
    │   ├── Agent Status Grid
    │   └── Error Display
    │
    ├── FileUploadZone (when no results)
    │   ├── Drag & Drop Area
    │   ├── File Type Indicators
    │   └── Info Cards
    │
    └── Results View (when results available)
        │
        ├── SidebarNavigation
        │   ├── Current File Info
        │   ├── Navigation Tabs
        │   │   ├── Overview
        │   │   ├── Database Schema
        │   │   ├── REST APIs
        │   │   ├── Microservices
        │   │   ├── JSON Data
        │   │   └── Documentation
        │   └── AIAgentStatusPanel
        │       ├── Parser Status
        │       ├── Transformer Status
        │       ├── Validator Status
        │       └── Generator Status
        │
        └── Main Content Area
            │
            ├── Overview Tab
            │   ├── AIWorkflowBanner
            │   ├── Overview Cards Grid
            │   │   └── OverviewCard (x4)
            │   │       ├── Confidence Score
            │   │       ├── Database Tables
            │   │       ├── API Endpoints
            │   │       └── Complexity
            │   ├── Analysis Grid
            │   │   ├── MigrationAnalysis
            │   │   └── TechStack
            │   └── MigrationOverview
            │
            ├── Database Schema Tab
            │   └── DatabaseSchemaVisualization
            │
            ├── REST APIs Tab
            │   └── RestAPIVisualization
            │
            ├── Microservices Tab
            │   └── MicroservicesArchitecture
            │
            ├── JSON Data Tab
            │   └── JSONDataViewer
            │
            └── Documentation Tab
                └── Documentation Content
```

## Data Flow

```
modernizationData.js (Centralized Data)
│
├── sampleModernizationData
│   ├── schema → DatabaseSchemaVisualization
│   ├── apiDesign → RestAPIVisualization
│   ├── dashboardData → OverviewCard, MigrationAnalysis
│   └── documentation → MigrationOverview
│
├── dashboardMetrics → OverviewCard (dynamic generation)
├── migrationMetrics → MigrationAnalysis
├── techStackItems → TechStack
├── keyBenefits → MigrationOverview
├── implementationSteps → MigrationOverview
├── aiAgents → AIAgentStatusPanel, ProcessingStatus
├── navigationTabs → SidebarNavigation
├── featureHighlights → ModernizationApp (Feature Section)
└── uploadInfoCards → FileUploadZone
```

## Component Dependencies

### Core Dependencies
```
All Components
└── framer-motion (animations)
└── React (hooks: useState, useEffect)
```

### Component-Specific Dependencies
```
DashboardHeader
└── getConfidenceColor (from modernizationData)

SidebarNavigation
└── navigationTabs (from modernizationData)
└── AIAgentStatusPanel

OverviewCard
└── (no external dependencies)

MigrationAnalysis
└── migrationMetrics (from modernizationData)

TechStack
└── techStackItems (from modernizationData)

MigrationOverview
└── keyBenefits (from modernizationData)
└── implementationSteps (from modernizationData)

AIWorkflowBanner
└── aiWorkflowEmojis (from modernizationData)

AIAgentStatusPanel
└── aiAgents (from modernizationData)

FileUploadZone
└── acceptedFileExtensions (from modernizationData)
└── uploadInfoCards (from modernizationData)

ProcessingStatus
└── aiAgents (from modernizationData)
```

## State Management

### ModernizationApp State
```javascript
{
  modernizationResults: null | Object,  // Full results data
  isProcessing: boolean,                // Processing flag
  processingStatus: null | Object,      // Progress info
  currentFile: null | File | File[]     // Uploaded files
}
```

### ModernizationDashboard State
```javascript
{
  activeTab: string,           // Current tab ID
  uploadedFile: null | File | File[],  // Uploaded files
  jobId: null | string,        // Processing job ID
  pollingInterval: null | number,      // Polling interval ID
  error: null | string         // Error message
}
```

## Props Flow

```
ModernizationApp
│
└── modernizationResults ──────┐
    isProcessing ──────────────┤
    processingStatus ──────────┤
    onFileUpload ──────────────┤
    onProcessFile ─────────────┤
                               │
                               ▼
                    ModernizationDashboard
                               │
                ┌──────────────┼──────────────┐
                │              │              │
                ▼              ▼              ▼
        DashboardHeader  SidebarNav   ProcessingStatus
        │                │              │
        ├─ results       ├─ activeTab  ├─ isProcessing
        └─ confidence    ├─ setActive  ├─ status
                         └─ file       └─ error
```

## File Organization

```
frontend/src/
│
├── data/
│   └── modernizationData.js          # Single source of truth
│
├── components/
│   ├── ModernizationApp.jsx          # Main entry point
│   │
│   ├── modernization/
│   │   ├── ModernizationDashboard.jsx    # Main dashboard
│   │   ├── DatabaseSchemaVisualization.jsx
│   │   ├── RestAPIVisualization.jsx
│   │   ├── JSONDataViewer.jsx
│   │   └── MicroservicesArchitecture.jsx
│   │
│   └── visuals/                      # Reusable components
│       ├── index.js                  # Barrel export
│       ├── OverviewCard.jsx
│       ├── MigrationAnalysis.jsx
│       ├── TechStack.jsx
│       ├── MigrationOverview.jsx
│       ├── AIWorkflowBanner.jsx
│       ├── AIAgentStatusPanel.jsx
│       ├── DashboardHeader.jsx
│       ├── SidebarNavigation.jsx
│       ├── FileUploadZone.jsx
│       └── ProcessingStatus.jsx
│
└── docs/
    ├── REFACTORING_SUMMARY.md
    ├── DEVELOPER_GUIDE.md
    └── COMPONENT_MAP.md (this file)
```

## Component Reusability Matrix

| Component | Reusable | Configurable | Standalone |
|-----------|----------|--------------|------------|
| OverviewCard | ✅ | ✅ | ✅ |
| MigrationAnalysis | ✅ | ✅ | ⚠️ |
| TechStack | ✅ | ⚠️ | ✅ |
| MigrationOverview | ✅ | ✅ | ⚠️ |
| AIWorkflowBanner | ✅ | ⚠️ | ✅ |
| AIAgentStatusPanel | ✅ | ⚠️ | ✅ |
| DashboardHeader | ✅ | ✅ | ⚠️ |
| SidebarNavigation | ✅ | ✅ | ⚠️ |
| FileUploadZone | ✅ | ✅ | ✅ |
| ProcessingStatus | ✅ | ✅ | ✅ |

**Legend:**
- ✅ Yes
- ⚠️ Partially (requires some context/data)
- ❌ No

## Styling Approach

### Tailwind CSS Classes
- Used for responsive layouts
- Grid and flexbox utilities
- Spacing and padding
- Dark mode support

### Inline Styles
- Used for dynamic values (colors, gradients)
- Animation properties
- Component-specific styling

### Framer Motion
- Page transitions
- Component animations
- Hover effects
- Loading states

## Performance Considerations

### Optimizations Applied
1. **Component Memoization**: Consider using React.memo for pure components
2. **Data Centralization**: Single import reduces bundle size
3. **Lazy Loading**: Can be applied to tab content
4. **Code Splitting**: Separate visual components bundle

### Future Optimizations
1. Implement React.lazy for route-based code splitting
2. Add useMemo for expensive calculations
3. Implement virtual scrolling for large lists
4. Optimize image/icon loading

## Testing Strategy

### Unit Tests
- Test each visual component in isolation
- Mock data from modernizationData.js
- Test prop variations
- Test error states

### Integration Tests
- Test component interactions
- Test data flow
- Test state updates
- Test navigation

### E2E Tests
- Test complete user flows
- Test file upload
- Test data visualization
- Test export functionality
