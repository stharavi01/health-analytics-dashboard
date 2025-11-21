# Health Analytics Dashboard

A comprehensive COVID-19 data visualization dashboard built with React, TypeScript, Redux Toolkit, and TailwindCSS. This project demonstrates modern React development practices, state management, API integration, and advanced UI/UX features.

## 🚀 Features

### Core Functionality

- **Dashboard Overview**: Global COVID-19 statistics with KPI cards and interactive charts
- **Countries Data Table**: Detailed country-wise COVID-19 data with advanced filtering
- **Real-time Data**: Fetches live data from disease.sh API
- **Responsive Design**: Mobile-first approach with adaptive layouts

### Advanced Features

#### 🔍 Advanced Filtering System

- **Multi-dimension filters**:
  - Search by country name (debounced for performance)
  - Filter by continent
  - Filter by severity level (Low < 100k, Medium 100k-1M, High > 1M cases)
- **Range sliders**:
  - Cases range filter
  - Deaths range filter
  - Active cases range filter
- **Filter management**:
  - Active filter chips with one-click removal
  - Clear all filters button
  - Collapsible advanced filters panel

#### 📊 Table Enhancements

- **Sortable columns**: Click headers to sort by any metric (ascending/descending)
- **Visual sort indicators**: Up/down arrows show current sort state
- **Sticky header**: Table header stays visible while scrolling
- **Sticky first column**: Country name column remains visible during horizontal scroll
- **Copy to clipboard**: Quick copy button for each row's data
- **Row highlighting**: Smooth hover effects for better readability

#### 📈 Data Visualization

- **Top countries chart**: Bar chart showing countries with highest cases
- **Animated KPI cards**: Color-coded statistics with trend indicators
- **Country details drawer**: Click any row to see comprehensive statistics including:
  - Main statistics with icons and color coding
  - Per million population metrics
  - Calculated rates (death rate, recovery rate, etc.)

#### 💾 Data Export

- **CSV Export**: Export filtered table data to CSV file
- **Formatted data**: Includes all relevant metrics properly formatted
- **Date-stamped filenames**: Automatic naming with current date

#### 🎨 Theme Support

- **Dark/Light mode toggle**: System-aware theme switching
- **Smooth transitions**: Animated theme changes
- **Persistent preferences**: Theme choice saved across sessions

#### ⚡ Performance Optimizations

- **Debounced search**: 300ms delay prevents excessive filtering
- **Memoized calculations**: useMemo for expensive filter operations
- **Optimized re-renders**: Redux state slicing for component isolation
- **Lazy loading ready**: Architecture supports code splitting

## 🛠️ Tech Stack

### Frontend Framework

- **React 19** - Latest React with modern features
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool

### State Management

- **Redux Toolkit** - Simplified Redux with best practices
- **RTK Query** - Powerful data fetching and caching

### Styling

- **TailwindCSS 4** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library
- **next-themes** - Theme management

### UI Components

- **Custom component library** built with Radix UI:
  - Button, Card, Input, Select
  - Dialog (for drawers/modals)
  - Slider (for range filters)
  - Badge (for filter chips)
  - Skeleton (for loading states)
  - Toaster (for notifications)

### API Integration

- **Axios** - HTTP client with interceptors
- **Custom base query** - RTK Query integration with error handling

### Testing (Ready)

- **Vitest** - Fast unit test runner
- **React Testing Library** - Component testing
- **jsdom** - DOM environment for tests

## 📁 Project Structure

```
src/
├── app/                      # Redux store and hooks
│   ├── hooks/               # Custom React hooks
│   │   └── useDebounce.ts  # Debounce hook for search
│   ├── hooks.ts            # Redux typed hooks
│   └── store.ts            # Redux store configuration
├── components/              # Reusable components
│   ├── layout/             # Layout components
│   │   ├── AppLayout.tsx   # Main app layout
│   │   ├── Header.tsx      # Top navigation
│   │   ├── Sidebar.tsx     # Side navigation
│   │   └── BottomNav.tsx   # Mobile navigation
│   ├── ui/                 # UI primitives
│   │   ├── button.tsx      # Button component
│   │   ├── card.tsx        # Card component
│   │   ├── dialog.tsx      # Dialog/Modal component
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
│   │       └── TopCountriesChart.tsx
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
│           └── RangeFilter.tsx
├── lib/                    # Utility libraries
│   ├── axios.ts           # Axios configuration
│   ├── axiosBaseQuery.ts  # RTK Query axios integration
│   ├── error-handler.ts   # Global error handling
│   ├── export-csv.ts      # CSV export utility
│   ├── toast.ts           # Toast notifications
│   └── utils.ts           # General utilities
└── constants/             # App constants
    └── api.constants.ts   # API endpoints, continents list
```

## 🚦 Getting Started

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
```

## 🎯 Key Features Implementation

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

### 5. CSV Export

```typescript
// One-click export
// Includes all filtered data
// Properly formatted CSV
// Date-stamped filenames
```

### 6. Theme Switching

```typescript
// Dark/Light/System themes
// Smooth transitions
// Persists user preference
```

## 🎨 Design Patterns

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

## 📝 API Integration

The app uses the [disease.sh](https://disease.sh/) COVID-19 API:

- `GET /all` - Global statistics
- `GET /countries` - Country-wise data

Error handling includes:

- Network error recovery
- User-friendly error messages
- Retry mechanisms
- Loading states

## 🧪 Testing

The project includes:

- Unit test setup with Vitest
- React Testing Library configuration
- Component test examples
- Coverage reporting

Run tests:

```bash
npm test              # Run tests once
npm run test:ui       # Interactive test UI
npm run test:coverage # Generate coverage
```

## 🚀 Deployment

### Build for production:

```bash
npm run build
```

The build output will be in the `dist/` directory.

### Deploy to:

- **Vercel**: Connect GitHub repo for auto-deployment
- **Netlify**: Drag & drop `dist/` folder or connect repo
- **GitHub Pages**: Use GitHub Actions workflow

## 📄 License

This project is open source and available under the MIT License.

## 👤 Author

Built as a demonstration of mid-level React development skills, showcasing:

- Modern React patterns and hooks
- Redux state management
- TypeScript proficiency
- API integration
- Responsive design
- Performance optimization
- Clean code architecture

## 🙏 Acknowledgments

- Disease.sh API for COVID-19 data
- Radix UI for accessible components
- TailwindCSS for styling system
- React community for best practices
