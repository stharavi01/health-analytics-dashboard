import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { AppLayout } from "./components/layout/AppLayout";
import { DashboardPage } from "./features/dashboard/DashboardPage";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { CountriesPage } from "./features/countries/CountriesPage";

/**
 * Main App component with routing
 */
function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="countries" element={<CountriesPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </ErrorBoundary>
  );
}

export default App;
