/**
 * COVID-19 Data Type Definitions
 * Based on disease.sh API response structure
 */

/**
 * Country-specific COVID-19 data
 */
export interface Country {
  country: string;
  countryInfo: {
    _id: number;
    iso2: string;
    iso3: string;
    lat: number;
    long: number;
    flag: string;
  };
  cases: number;
  todayCases: number;
  deaths: number;
  todayDeaths: number;
  recovered: number;
  todayRecovered: number;
  active: number;
  critical: number;
  casesPerOneMillion: number;
  deathsPerOneMillion: number;
  tests: number;
  testsPerOneMillion: number;
  population: number;
  continent: string;
  oneCasePerPeople: number;
  oneDeathPerPeople: number;
  oneTestPerPeople: number;
  activePerOneMillion: number;
  recoveredPerOneMillion: number;
  criticalPerOneMillion: number;
  updated: number;
}

/**
 * Global COVID-19 statistics
 */
export interface GlobalStats {
  cases: number;
  todayCases: number;
  deaths: number;
  todayDeaths: number;
  recovered: number;
  todayRecovered: number;
  active: number;
  critical: number;
  casesPerOneMillion: number;
  deathsPerOneMillion: number;
  tests: number;
  testsPerOneMillion: number;
  population: number;
  oneCasePerPeople: number;
  oneDeathPerPeople: number;
  oneTestPerPeople: number;
  activePerOneMillion: number;
  recoveredPerOneMillion: number;
  criticalPerOneMillion: number;
  affectedCountries: number;
  updated: number;
}

/**
 * Historical data point
 */
export interface HistoricalDataPoint {
  [date: string]: number;
}

/**
 * Historical data for a country
 */
export interface HistoricalData {
  country: string;
  province?: string[];
  timeline: {
    cases: HistoricalDataPoint;
    deaths: HistoricalDataPoint;
    recovered: HistoricalDataPoint;
  };
}

/**
 * Global historical data
 */
export interface GlobalHistoricalData {
  cases: HistoricalDataPoint;
  deaths: HistoricalDataPoint;
  recovered: HistoricalDataPoint;
}

/**
 * Formatted time series data point for charts
 */
export interface TimeSeriesDataPoint {
  date: string;
  cases: number;
  deaths: number;
  recovered: number;
  active?: number;
}

/**
 * Country comparison data
 */
export interface CountryComparison {
  country: string;
  cases: number;
  deaths: number;
  recovered: number;
  active: number;
  casesPerMillion: number;
  deathsPerMillion: number;
  recoveryRate: number;
  fatalityRate: number;
}
