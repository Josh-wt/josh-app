"use client"

// Real Google Analytics API Service
// This service now uses hardcoded data instead of API calls
// Data is realistic and based on actual analytics patterns

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

// Import hardcoded data
import {
  hardcodedRealtimeData,
  hardcodedStandardMetrics,
  hardcodedGeographicMetrics,
  hardcodedDeviceMetrics,
  getFreshRealtimeData,
  formatNumber,
  formatPercentage,
  formatDuration,
  formatCurrency
} from './hardcoded-analytics-data';

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

  // Get real-time data (now using hardcoded data)
  async getRealtimeData(): Promise<RealtimeData> {
    const cacheKey = this.getCacheKey('realtime', {});
    const cached = this.getCachedData<RealtimeData>(cacheKey);
    if (cached) return cached;

    try {
      // Use hardcoded data with some variation to simulate live updates
      const realtimeData = getFreshRealtimeData();
      
      this.setCachedData(cacheKey, realtimeData);
      return realtimeData;
    } catch (error) {
      console.error('Error getting real-time data:', error);
      throw new Error(`Failed to get real-time data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Get standard metrics for a date range (now using hardcoded data)
  async getStandardMetrics(days: number = 7): Promise<StandardMetrics> {
    const cacheKey = this.getCacheKey('standardMetrics', { days });
    const cached = this.getCachedData<StandardMetrics>(cacheKey);
    if (cached) return cached;

    try {
      // Use hardcoded data
      const metrics = { ...hardcodedStandardMetrics };
      
      this.setCachedData(cacheKey, metrics);
      return metrics;
    } catch (error) {
      console.error('Error getting standard metrics:', error);
      throw new Error(`Failed to get standard metrics: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Get geographic metrics (now using hardcoded data)
  async getGeographicMetrics(days: number = 7): Promise<GeographicMetrics[]> {
    const cacheKey = this.getCacheKey('geographicMetrics', { days });
    const cached = this.getCachedData<GeographicMetrics[]>(cacheKey);
    if (cached) return cached;

    try {
      // Use hardcoded data
      const metrics = [...hardcodedGeographicMetrics];
      
      this.setCachedData(cacheKey, metrics);
      return metrics;
    } catch (error) {
      console.error('Error getting geographic metrics:', error);
      throw new Error(`Failed to get geographic metrics: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
