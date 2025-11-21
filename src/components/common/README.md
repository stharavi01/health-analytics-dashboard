# Common Components & Hooks

This directory contains reusable components and hooks that can be used throughout the application.

## Components

### DataTable

A generic, type-safe table component with sorting, sticky columns, and keyboard navigation.

```tsx
import { DataTable } from "@/components/common";

<DataTable
  data={countries}
  columns={[
    { key: "name", label: "Name", sortable: true },
    { key: "population", label: "Population", sortable: true, align: "right" },
  ]}
  keyExtractor={(row) => row.id}
  sortBy="population"
  sortOrder="desc"
  onSort={(column) => handleSort(column)}
  onRowClick={(row) => console.log(row)}
/>;
```

### EmptyState

Displays a consistent empty state with optional action button.

```tsx
import { EmptyState } from "@/components/common";
import { FileQuestion } from "lucide-react";

<EmptyState
  icon={FileQuestion}
  title="No data found"
  description="Try adjusting your filters"
  action={<Button onClick={handleReset}>Reset Filters</Button>}
/>;
```

### ErrorState

Shows error messages with optional retry functionality.

```tsx
import { ErrorState } from "@/components/common";

<ErrorState
  title="Failed to load data"
  message="Unable to fetch countries data"
  onRetry={() => refetch()}
  variant="destructive"
/>;
```

### LoadingState

Skeleton loaders for different content types.

```tsx
import { LoadingState, PageLoadingState } from "@/components/common";

// For tables
<LoadingState type="table" rows={10} columns={5} />

// For stats/KPI cards
<LoadingState type="stats" />

// For card grids
<LoadingState type="cards" columns={4} />

// Full page loading
<PageLoadingState />
```

### MobileCard & MobileCardList

Mobile-optimized card components for displaying list data.

```tsx
import { MobileCardList } from "@/components/common";

<MobileCardList
  data={items}
  keyExtractor={(item) => item.id}
  renderCard={(item) => (
    <div>
      <h3>{item.title}</h3>
      <p>{item.description}</p>
    </div>
  )}
  onClick={(item) => navigate(`/item/${item.id}`)}
/>;
```

## Hooks

### useTableSort

Extract sorting logic from components.

```tsx
import { useTableSort } from "@/app/hooks/useTableSort";

const { sortedData, handleSort } = useTableSort(
  data,
  "name",
  "asc",
  (sortBy, sortOrder) => {
    // Update state
  }
);
```

### useTablePagination

Handle pagination logic.

```tsx
import { useTablePagination } from "@/app/hooks/useTablePagination";

const { paginatedData, totalPages, hasNextPage, nextPage, previousPage } =
  useTablePagination(data, currentPage, itemsPerPage, setPage);
```

### useLocalStorage

Persist data to localStorage with TypeScript support.

```tsx
import { useLocalStorage } from "@/app/hooks/useLocalStorage";

const [theme, setTheme, removeTheme] = useLocalStorage("theme", "light");
```

## Features

### Accessibility

- Full keyboard navigation (Tab, Enter, Space)
- ARIA labels and roles
- Focus management
- Screen reader support

### Performance

- React.memo optimization
- Memoized calculations
- Strategic re-render prevention

### Type Safety

- Full TypeScript support
- Generic type parameters
- Proper prop types

## Usage Guidelines

1. **Import from barrel export**: Always import from `@/components/common`
2. **Keep components generic**: Don't add domain-specific logic
3. **Document props**: Use JSDoc comments
4. **Add accessibility**: Include ARIA labels and keyboard support
5. **Optimize performance**: Use React.memo where appropriate
