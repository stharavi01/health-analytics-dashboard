# Health Analytics Dashboard

A comprehensive COVID-19 data visualization dashboard built with React, TypeScript, Redux Toolkit, and TailwindCSS. This project demonstrates modern React development practices, state management, API integration, and advanced UI/UX features.

## Features

### Core Functionality

- **Dashboard Overview**: Global COVID-19 statistics with KPI cards and interactive charts
- **Countries Data Table**: Detailed country-wise COVID-19 data with advanced filtering
- **Real-time Data**: Fetches live data from disease.sh API
- **Responsive Design**: Mobile-first approach with adaptive layouts for all screen sizes
- **Interactive Visualizations**: Multiple chart types showing data from different perspectives
- **Country Comparison**: Select and compare multiple countries side-by-side

### Advanced Features

#### Advanced Filtering System

- **Multi-dimension filters**:
  - Search by country name (debounced for performance)
  - Filter by continent
  - Filter by severity level (Low < 100k, Medium 100k-1M, High > 1M cases)
- **Range sliders**:
  - Cases range filter
  - Deaths range filter
  - Active cases range filter
- **Date range filtering**:
  - Predefined date range presets (7 days, 30 days, 90 days, etc.)
  - Custom date range selection
  - Time-based data filtering
- **Auto-refresh functionality**:
  - Toggle auto-refresh on/off
  - Configurable refresh intervals (30s, 1min, 5min, 10min, 30min)
  - Visual indicator when auto-refresh is active
- **Filter management**:
  - Active filter chips with one-click removal
  - Clear all filters button
  - Collapsible advanced filters panel

#### Table Enhancements

- **Sortable columns**: Click headers to sort by any metric (ascending/descending)
- **Visual sort indicators**: Up/down arrows show current sort state
- **Sticky header**: Table header stays visible while scrolling
- **Sticky first column**: Country name column remains visible during horizontal scroll
- **Copy to clipboard**: Quick copy button for each row's data
- **Row highlighting**: Smooth hover effects for better readability
- **Mobile-responsive cards**: Table automatically switches to card layout on small screens with:
  - Compact card design showing key metrics
  - Touch-friendly interactions
  - Optimized spacing and typography
  - Country comparison support on mobile

#### Data Visualization

- **Top countries chart**: Bar chart showing countries with highest cases
- **Country comparison chart**: Interactive bar chart comparing multiple selected countries side-by-side with:
  - Cases, deaths, recovered, and active cases metrics
  - Recovery rate and fatality rate calculations
  - Add/remove countries dynamically with badges
  - Clear all comparison feature
- **Distribution pie chart**: Visualize COVID-19 cases distribution by continent with:
  - Interactive segments with tooltips
  - Color-coded continents
  - Percentage and absolute value display
  - Responsive legend
- **Trend line chart**: Historical data visualization showing global trends over time:
  - Multiple data series (cases, deaths, recovered)
  - Time-series line graphs
  - Interactive tooltips with formatted dates
  - Customizable date ranges
- **Animated KPI cards**: Color-coded statistics with trend indicators
- **Country details drawer**: Click any row to see comprehensive statistics including:
  - Main statistics with icons and color coding
  - Per million population metrics
  - Calculated rates (death rate, recovery rate, etc.)

#### Data Export

- **Multiple format support**: Export data in CSV or JSON formats
- **Flexible export options**: Export countries data or global statistics
- **Format selector**: Dropdown to choose export format before downloading
- **Formatted data**: Includes all relevant metrics properly formatted
- **Date-stamped filenames**: Automatic naming with current date
- **Success notifications**: Toast messages confirm successful exports

#### Theme Support

- **Dark/Light mode toggle**: System-aware theme switching
- **Smooth transitions**: Animated theme changes
- **Persistent preferences**: Theme choice saved across sessions

#### Performance Optimizations

- **Debounced search**: 300ms delay prevents excessive filtering
- **Memoized calculations**: useMemo for expensive filter operations
- **Optimized re-renders**: Redux state slicing for component isolation
- **Lazy loading ready**: Architecture supports code splitting

### Tech Stack

### Frontend Framework

- **React 19** - Latest React with modern features
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool

### State Management

- **Redux Toolkit** - Simplified Redux with best practices
- **RTK Query** - Powerful data fetching and caching

### Data Visualization

- **Recharts** - Composable charting library built on React components
- **Interactive charts**: Line charts, bar charts, and pie charts with tooltips and legends
- **Responsive design**: Charts adapt to different screen sizes

### Styling

- **TailwindCSS 4** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library
- **next-themes** - Theme management

### UI Components

- **Custom component library** built with Radix UI:
  - Button, Card, Input, Select
  - Dialog (for drawers/modals)
  - Sheet (for mobile navigation)
  - Slider (for range filters)
  - Badge (for filter chips)
  - Skeleton (for loading states)
  - Toaster (for notifications)
  - Popover (for dropdowns)
- **Reusable components**:
  - DataTable: Generic table component with sorting and sticky columns
  - MobileCard: Responsive card component for mobile views
  - LoadingState, ErrorState, EmptyState: Common UI states
  - FilterChips: Interactive filter tag display

### API Integration

- **Axios** - HTTP client with interceptors
- **Custom base query** - RTK Query integration with error handling

### Testing (Ready)

- **Vitest** - Fast unit test runner
- **React Testing Library** - Component testing
- **Cypress** - End-to-end testing
- **jsdom** - DOM environment for tests
- **Test coverage** for hooks, utilities, and components

## Project Structure

```
src/
├── app/                      # Redux store and hooks
│   ├── hooks/               # Custom React hooks
│   │   └── useDebounce.ts  # Debounce hook for search
│   ├── hooks.ts            # Redux typed hooks
│   └── store.ts            # Redux store configuration
├── components/              # Reusable components
│   ├── common/             # Common reusable components
│   │   ├── DataTable.tsx   # Generic table with sorting
│   │   ├── MobileCard.tsx  # Responsive card component
│   │   ├── LoadingState.tsx # Loading spinner component
│   │   ├── ErrorState.tsx  # Error display component
│   │   └── EmptyState.tsx  # Empty state component
│   ├── layout/             # Layout components
│   │   ├── AppLayout.tsx   # Main app layout
│   │   ├── Header.tsx      # Top navigation
│   │   ├── Sidebar.tsx     # Side navigation
│   │   └── BottomNav.tsx   # Mobile navigation
│   ├── ui/                 # UI primitives
│   │   ├── button.tsx      # Button component
│   │   ├── card.tsx        # Card component
│   │   ├── dialog.tsx      # Dialog/Modal component
│   │   ├── sheet.tsx       # Sheet component
│   │   ├── slider.tsx      # Range slider component
│   │   ├── badge.tsx       # Badge component
│   │   └── ...
│   ├── ErrorBoundary.tsx   # Error boundary wrapper
│   └── ThemeToggle.tsx     # Dark/light theme toggle
├── features/                # Feature modules
│   ├── dashboard/          # Dashboard feature
│   │   ├── DashboardPage.tsx
│   │   └── components/
│   │       ├── KPICard.tsx
│   │       ├── TopCountriesChart.tsx
│   │       ├── CountryComparisonChart.tsx  # Multi-country comparison
│   │       ├── DistributionPieChart.tsx    # Continent distribution
│   │       ├── TrendLineChart.tsx          # Historical trends
│   │       └── ExportButton.tsx            # Data export
│   ├── countries/          # Countries feature
│   │   ├── CountriesPage.tsx
│   │   ├── api/
│   │   │   └── countriesApi.ts    # RTK Query API
│   │   ├── components/
│   │   │   ├── CountriesTable.tsx
│   │   │   ├── CountryDetailsDrawer.tsx
│   │   │   └── TablePagination.tsx
│   │   └── types/
│   │       └── country.types.ts
│   └── filters/            # Filtering feature
│       ├── filtersSlice.ts # Redux slice for filters
│       └── components/
│           ├── FilterChips.tsx
│           ├── RangeFilter.tsx
│           ├── DateRangeFilter.tsx      # Date range selection
│           ├── AutoRefreshToggle.tsx    # Auto-refresh control
│           └── AdvancedFilters.tsx
├── hooks/                  # Custom hooks
│   ├── useDebounce.ts     # Debounce hook
│   ├── useLocalStorage.ts # Local storage hook
│   ├── useTablePagination.ts # Pagination hook
│   └── useTableSort.ts    # Sorting hook
├── lib/                    # Utility libraries
│   ├── axios.ts           # Axios configuration
│   ├── axiosBaseQuery.ts  # RTK Query axios integration
│   ├── error-handler.ts   # Global error handling
│   ├── export-csv.ts      # CSV export utility
│   ├── export-data.ts     # Generic export utility (CSV/JSON)
│   ├── toast.ts           # Toast notifications
│   └── utils.ts           # General utilities
└── constants/             # App constants
    └── api.constants.ts   # API endpoints, continents, date presets
```

## Getting Started

### Prerequisites

- Node.js 20+ (or Node 18 with warnings)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd health-analytics-dashboard
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run test         # Run tests
npm run test:ui      # Run tests with UI
npm run test:coverage # Generate coverage report
npm run e2e          # Run Cypress e2e tests
npm run e2e:open     # Open Cypress test runner
```

## Key Features Implementation

### 1. Debounced Search

```typescript
// Uses custom useDebounce hook
const debouncedSearch = useDebounce(filters.search, 300);
```

### 2. Advanced Filtering

```typescript
// Multiple filter dimensions combined
- Continent filter
- Severity categorization
- Range sliders for cases/deaths/active
- Date range presets and custom ranges
- All filters work together seamlessly
```

### 3. Sortable Table Headers

```typescript
// Click any header to sort
// Visual indicators show sort direction
// Supports multi-field sorting
```

### 4. Country Details Drawer

```typescript
// Click any table row
// Opens beautiful slide-in drawer
// Shows comprehensive statistics
// Color-coded metrics with icons
```

### 5. Data Export

```typescript
// Export in CSV or JSON format
// Includes all filtered data
// Properly formatted output
// Date-stamped filenames
```

### 6. Theme Switching

```typescript
// Dark/Light/System themes
// Smooth transitions
// Persists user preference
```

### 7. Interactive Charts

```typescript
// Multiple chart types using Recharts
// Country comparison bar chart
// Continent distribution pie chart
// Historical trend line chart
// Responsive and interactive tooltips
```

### 8. Auto-Refresh

```typescript
// Toggle auto-refresh feature
// Configurable intervals
// Real-time data updates
// Visual refresh indicator
```

### 9. Mobile-Responsive Design

```typescript
// Adaptive table/card layout
// Touch-friendly interactions
// Mobile navigation
// Optimized for all screen sizes
```

## Design Patterns

### Component Composition

- Atomic design principles
- Reusable UI primitives
- Feature-based organization

### State Management

- Redux Toolkit for global state
- Local state for UI concerns
- RTK Query for server state

### Performance

- Memoization with useMemo
- Debouncing for user input
- Optimized re-renders
- Code splitting ready

### Type Safety

- Full TypeScript coverage
- Strict type checking
- Interface definitions for all data

## API Integration

The app uses the [disease.sh](https://disease.sh/) COVID-19 API:

- `GET /all` - Global statistics
- `GET /countries` - Country-wise data
- `GET /historical/all?lastdays=30` - Historical global data for trend charts

Error handling includes:

- Network error recovery
- User-friendly error messages
- Retry mechanisms
- Loading states
- Toast notifications for user feedback

## Testing

The project includes comprehensive testing setup:

- **Unit tests** with Vitest
- **Component tests** with React Testing Library
- **E2E tests** with Cypress
- **Coverage reporting**

Test files are located in:

- `src/**/__tests__/` - Component and hook tests
- `src/lib/__tests__/` - Utility function tests
- `cypress/e2e/` - End-to-end tests

Run tests:

```bash
npm test              # Run tests once
npm run test:ui       # Interactive test UI
npm run test:coverage # Generate coverage
npm run e2e           # Run e2e tests
npm run e2e:open      # Open Cypress UI
```

## Deployment

### Build for production:

```bash
npm run build
```

The build output will be in the `dist/` directory.
