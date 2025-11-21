import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { AppLayout } from "./components/layout/AppLayout";
import { DashboardPage } from "./features/dashboard/DashboardPage";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { CountriesPage } from "./features/countries/CountriesPage";
import { ThemeProvider } from "next-themes";

/**
 * Main App component with routing
 */
function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
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
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
