# Git Commit Strategy

## Recommended Commit Sequence

To maintain a clean Git history, here's the recommended sequence for committing these features:

### 1. Core Infrastructure

```bash
git add src/app/hooks/useDebounce.ts
git commit -m "feat: add useDebounce custom hook for performance optimization

- Implements 300ms debounce delay
- Generic TypeScript implementation
- Prevents excessive filter operations during typing
- Includes cleanup on unmount"
```

### 2. UI Components

```bash
git add src/components/ui/slider.tsx src/components/ui/badge.tsx
git commit -m "feat: add Slider and Badge UI components

- Add Radix UI Slider for range filters
- Add Badge component for filter chips
- Both components fully typed and styled with TailwindCSS"
```

### 3. Filter Components

```bash
git add src/features/filters/components/
git commit -m "feat: add advanced filtering components

- FilterChips: Display active filters with removal
- RangeFilter: Range slider with live value preview
- Both integrate with Redux state management"
```

### 4. Extended Filter State

```bash
git add src/features/filters/filtersSlice.ts
git commit -m "feat: extend filters slice with advanced filtering options

- Add severity filter (Low/Medium/High)
- Add range filters (cases, deaths, active)
- Add sortBy options (todayCases, todayDeaths)
- Include new action creators and selectors"
```

### 5. Countries Page Update

```bash
git add src/features/countries/CountriesPage.tsx
git commit -m "feat: implement advanced filtering UI in Countries page

- Integrate debounced search
- Add collapsible advanced filters panel
- Implement range sliders for cases/deaths/active
- Add severity filter dropdown
- Display active filter chips with clear all option
- Add Export CSV button
- Optimize with useMemo for filter calculations"
```

### 6. Sortable Table

```bash
git add src/features/countries/components/CountriesTable.tsx
git commit -m "feat: add sortable table headers with visual indicators

- Make 7 columns sortable (country, cases, todayCases, etc.)
- Add up/down arrow icons showing sort state
- Add hover effects on headers
- Integrate with Redux sort state
- Add row click handler for details drawer"
```

### 7. Country Details Drawer

```bash
git add src/features/countries/components/CountryDetailsDrawer.tsx
git commit -m "feat: add country details drawer component

- Display comprehensive country statistics
- Color-coded metrics with icons
- Show per-million population data
- Calculate and display rates (death, recovery, etc.)
- Responsive grid layout
- Built with Radix UI Dialog for accessibility"
```

### 8. CSV Export Utility

```bash
git add src/lib/export-csv.ts
git commit -m "feat: add CSV export functionality

- Client-side CSV generation from filtered data
- Includes 14 columns of comprehensive data
- Proper CSV formatting and escaping
- Auto-generated date-stamped filenames
- Toast notifications for user feedback"
```

### 9. Theme Toggle

```bash
git add src/components/ThemeToggle.tsx src/components/layout/Header.tsx src/App.tsx
git commit -m "feat: implement dark/light theme toggle

- Add ThemeToggle component with sun/moon icons
- Integrate next-themes for theme management
- Add toggle button to header
- Wrap app with ThemeProvider
- Support light/dark/system modes
- Persist theme preference to localStorage"
```

### 10. Dependencies

```bash
git add package.json package-lock.json
git commit -m "chore: add dependencies for new features

- Add @radix-ui/react-dialog for drawer component
- Add @radix-ui/react-slider for range filters
- Update package-lock.json"
```

### 11. Documentation

```bash
git add README.md FEATURES.md
git commit -m "docs: update documentation with new features

- Comprehensive README with all features documented
- Add FEATURES.md with detailed implementation notes
- Include usage examples and testing instructions
- Add tech stack and architecture documentation"
```

---

## Alternative: Squash Strategy

If you prefer fewer commits, you can squash related features:

### Option A: By Feature Type

```bash
# Commit 1: All filtering features
git add src/features/filters/ src/app/hooks/useDebounce.ts
git commit -m "feat: implement advanced filtering system with debounced search"

# Commit 2: All table enhancements
git add src/features/countries/components/CountriesTable.tsx
git commit -m "feat: add sortable headers and country details drawer"

# Commit 3: All UI enhancements
git add src/components/
git commit -m "feat: add theme toggle and UI components"

# Commit 4: Utilities and docs
git add src/lib/export-csv.ts README.md FEATURES.md package.json
git commit -m "feat: add CSV export, update docs and dependencies"
```

### Option B: Single Feature Commit

```bash
git add .
git commit -m "feat: implement 6 advanced features for mid-level showcase

Features added:
- Advanced filtering with range sliders and severity levels
- Debounced search (300ms) for performance
- Sortable table headers with visual indicators
- Country details drawer with comprehensive stats
- CSV export functionality
- Dark/light theme toggle

Technical improvements:
- Custom useDebounce hook
- Redux state extensions
- New UI components (Slider, Badge, Dialog)
- Memoized calculations for performance
- Full TypeScript coverage
- Comprehensive documentation"
```

---

## Best Practices Applied

✅ **Conventional Commits**: Using `feat:`, `chore:`, `docs:` prefixes  
✅ **Descriptive Messages**: Clear explanation of what and why  
✅ **Atomic Commits**: Each commit represents a logical unit of work  
✅ **Present Tense**: "Add feature" not "Added feature"  
✅ **Imperative Mood**: "Fix bug" not "Fixes bug"  
✅ **Body Details**: Multi-line messages with bullet points where needed

---

## Verify Git History

After committing, verify clean history:

```bash
# View commit log
git log --oneline

# View detailed log
git log --pretty=format:"%h - %an, %ar : %s"

# View file changes
git log --stat

# View specific commit
git show <commit-hash>
```

---

## Branch Strategy

Current branch: `feat/dashboard`

### Recommended workflow:

```bash
# 1. Commit all features to feat/dashboard
git add .
git commit -m "feat: implement advanced dashboard features"

# 2. Push feature branch
git push origin feat/dashboard

# 3. Create pull request (on GitHub)
# Title: "Add Advanced Features to Health Analytics Dashboard"
# Description: Link to FEATURES.md and highlight key additions

# 4. After review, merge to main
git checkout main
git merge feat/dashboard
git push origin main

# 5. Tag release
git tag -a v1.0.0 -m "Release v1.0.0: Advanced Dashboard Features"
git push origin v1.0.0
```

---

## GitHub PR Description Template

```markdown
## 🎯 Summary

This PR adds 6 major features to showcase mid-level React development skills.

## ✨ Features Added

- [ ] Advanced filtering system with range sliders
- [ ] Debounced search (300ms)
- [ ] Sortable table headers with visual indicators
- [ ] Country details drawer
- [ ] CSV export functionality
- [ ] Dark/light theme toggle

## 🔧 Technical Details

- 8 new files created
- 7 files modified
- ~1,500+ lines of code added
- 2 new dependencies
- Full TypeScript coverage
- Redux state management extended

## 📸 Screenshots

(Add screenshots of each feature)

## ✅ Testing

- [x] All features tested manually
- [x] No console errors
- [x] Responsive design verified
- [x] TypeScript compilation successful
- [ ] Unit tests (pending)

## 📚 Documentation

- Updated README.md with comprehensive guide
- Added FEATURES.md with implementation details
- Included usage examples and testing instructions

## 🔗 Related Issues

Closes #XX (if applicable)
```

---

## Commit Message Tips

### Good Examples:

✅ `feat: add debounced search with 300ms delay`  
✅ `feat: implement sortable table headers`  
✅ `fix: prevent drawer opening when clicking copy button`  
✅ `refactor: extract filter logic to useMemo hook`  
✅ `docs: add comprehensive feature documentation`

### Bad Examples:

❌ `update files`  
❌ `fix stuff`  
❌ `WIP`  
❌ `changes`  
❌ `asdf`

---

## Final Checklist Before Committing

- [ ] Code compiles without errors
- [ ] No console warnings
- [ ] All new files added to git
- [ ] Dependencies updated in package.json
- [ ] Documentation updated
- [ ] Features manually tested
- [ ] Commit messages are descriptive
- [ ] Branch is up to date with main
- [ ] .gitignore includes unnecessary files
