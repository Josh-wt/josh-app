"use client"

// Real Google Analytics API Service
// This service provides methods to fetch real-time data from Google Analytics
// using the available MCP tools directly

export interface RealtimeData {
  activeUsers: number;
  activeUsersByCountry: Array<{ country: string; activeUsers: number }>;
  activeUsersByDevice: Array<{ deviceCategory: string; activeUsers: number }>;
  activeUsersBySource: Array<{ source: string; activeUsers: number }>;
  topPages: Array<{ pagePath: string; pageTitle: string; activeUsers: number }>;
}

export interface StandardMetrics {
  sessions: number;
  totalUsers: number;
  newUsers: number;
  screenPageViews: number;
  bounceRate: number;
  averageSessionDuration: number;
  pagesPerSession: number;
  conversionRate: number;
  goalCompletions: number;
  revenue: number;
  ecommerceConversionRate: number;
}

export interface GeographicMetrics {
  country: string;
  sessions: number;
  totalUsers: number;
  newUsers: number;
  screenPageViews: number;
  bounceRate: number;
  averageSessionDuration: number;
}

export interface DeviceMetrics {
  deviceCategory: string;
  sessions: number;
  totalUsers: number;
  screenPageViews: number;
  bounceRate: number;
  averageSessionDuration: number;
}

class RealGoogleAnalyticsAPI {
  private propertyId: string = "495635139"; // everythingenglishai1 property ID
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private cacheTimeout: number = 5 * 60 * 1000; // 5 minutes

  private getCacheKey(method: string, params: any): string {
    return `${method}_${JSON.stringify(params)}`;
  }

  private getCachedData<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    return null;
  }

  private setCachedData<T>(key: string, data: T): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  private generateDateRanges(days: number): Array<{ startDate: string; endDate: string }> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);

    return [{
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    }];
  }

  // Get real-time data
  async getRealtimeData(): Promise<RealtimeData> {
    const cacheKey = this.getCacheKey('realtime', {});
    const cached = this.getCachedData<RealtimeData>(cacheKey);
    if (cached) return cached;

    try {
      // Call the API route for real-time data
      const response = await fetch(`/api/analytics/realtime?propertyId=${this.propertyId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      const activeUsers = data.result.rows?.reduce((sum: number, row: any) => sum + parseInt(row.metric_values[0].value), 0) || 0;

      const activeUsersByCountry: Array<{ country: string; activeUsers: number }> = [];
      const activeUsersByDevice: Array<{ deviceCategory: string; activeUsers: number }> = [];

      data.result.rows?.forEach((row: any) => {
        const country = row.dimension_values[0]?.value || '(not set)';
        const deviceCategory = row.dimension_values[1]?.value || '(not set)';
        const users = parseInt(row.metric_values[0].value);

        // Aggregate by country
        const countryEntry = activeUsersByCountry.find(c => c.country === country);
        if (countryEntry) {
          countryEntry.activeUsers += users;
        } else {
          activeUsersByCountry.push({ country, activeUsers: users });
        }

        // Aggregate by device
        const deviceEntry = activeUsersByDevice.find(d => d.deviceCategory === deviceCategory);
        if (deviceEntry) {
          deviceEntry.activeUsers += users;
        } else {
          activeUsersByDevice.push({ deviceCategory, activeUsers: users });
        }
      });

      // Sort for display
      activeUsersByCountry.sort((a, b) => b.activeUsers - a.activeUsers);
      activeUsersByDevice.sort((a, b) => b.activeUsers - a.activeUsers);

      const realtimeData: RealtimeData = {
        activeUsers,
        activeUsersByCountry: activeUsersByCountry.slice(0, 5),
        activeUsersByDevice: activeUsersByDevice.slice(0, 3),
        activeUsersBySource: [], // Not available in realtime API
        topPages: [] // Not available in realtime API
      };

      this.setCachedData(cacheKey, realtimeData);
      return realtimeData;
    } catch (error) {
      console.error('Error fetching real-time data:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        propertyId: this.propertyId
      });
      throw new Error(`Failed to fetch real-time data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Get standard metrics for a date range
  async getStandardMetrics(days: number = 7): Promise<StandardMetrics> {
    const cacheKey = this.getCacheKey('standardMetrics', { days });
    const cached = this.getCachedData<StandardMetrics>(cacheKey);
    if (cached) return cached;

    try {
      // Call the API route for standard metrics
      const response = await fetch(`/api/analytics/standard?propertyId=${this.propertyId}&days=${days}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      const row = data.result.rows?.[0]?.metric_values;
      if (!row) throw new Error("No data found for standard metrics.");

      const sessions = parseInt(row[0].value);
      const totalUsers = parseInt(row[1].value);
      const newUsers = parseInt(row[2].value);
      const screenPageViews = parseInt(row[3].value);
      const bounceRate = parseFloat(row[4].value);
      const averageSessionDuration = parseFloat(row[5].value);
      const pagesPerSession = sessions > 0 ? screenPageViews / sessions : 0;

      const metrics: StandardMetrics = {
        sessions,
        totalUsers,
        newUsers,
        screenPageViews,
        bounceRate,
        averageSessionDuration,
        pagesPerSession,
        conversionRate: 0, // Placeholder
        goalCompletions: 0, // Placeholder
        revenue: 0, // Placeholder
        ecommerceConversionRate: 0 // Placeholder
      };

      this.setCachedData(cacheKey, metrics);
      return metrics;
    } catch (error) {
      console.error('Error fetching standard metrics:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        propertyId: this.propertyId,
        days
      });
      throw new Error(`Failed to fetch standard metrics: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Get geographic metrics
  async getGeographicMetrics(days: number = 7): Promise<GeographicMetrics[]> {
    const cacheKey = this.getCacheKey('geographicMetrics', { days });
    const cached = this.getCachedData<GeographicMetrics[]>(cacheKey);
    if (cached) return cached;

    try {
      // Call the API route for geographic metrics
      const response = await fetch(`/api/analytics/geographic?propertyId=${this.propertyId}&days=${days}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      const metrics: GeographicMetrics[] = data.result.rows?.map((row: any) => ({
        country: row.dimension_values[0]?.value || '(not set)',
        sessions: parseInt(row.metric_values[0].value),
        totalUsers: parseInt(row.metric_values[1].value),
        newUsers: parseInt(row.metric_values[2].value),
        screenPageViews: parseInt(row.metric_values[3].value),
        bounceRate: parseFloat(row.metric_values[4].value),
        averageSessionDuration: parseFloat(row.metric_values[5].value)
      })) || [];

      this.setCachedData(cacheKey, metrics);
      return metrics;
    } catch (error) {
      console.error('Error fetching geographic metrics:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        propertyId: this.propertyId,
        days
      });
      throw new Error(`Failed to fetch geographic metrics: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Get device metrics
  async getDeviceMetrics(days: number = 7): Promise<DeviceMetrics[]> {
    const cacheKey = this.getCacheKey('deviceMetrics', { days });
    const cached = this.getCachedData<DeviceMetrics[]>(cacheKey);
    if (cached) return cached;

    try {
      // Call the API route for device metrics
      const response = await fetch(`/api/analytics/device?propertyId=${this.propertyId}&days=${days}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      const metrics: DeviceMetrics[] = data.result.rows?.map((row: any) => ({
        deviceCategory: row.dimension_values[0]?.value || '(not set)',
        sessions: parseInt(row.metric_values[0].value),
        totalUsers: parseInt(row.metric_values[1].value),
        screenPageViews: parseInt(row.metric_values[2].value),
        bounceRate: parseFloat(row.metric_values[3].value),
        averageSessionDuration: parseFloat(row.metric_values[4].value)
      })) || [];

      this.setCachedData(cacheKey, metrics);
      return metrics;
    } catch (error) {
      console.error('Error fetching device metrics:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        propertyId: this.propertyId,
        days
      });
      throw new Error(`Failed to fetch device metrics: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Utility methods
  formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  formatPercentage(decimal: number): string {
    return (decimal * 100).toFixed(1) + '%';
  }

  formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  formatCurrency(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  refreshCache(): void {
    this.cache.clear();
  }
}

export const realGoogleAnalyticsAPI = new RealGoogleAnalyticsAPI();
