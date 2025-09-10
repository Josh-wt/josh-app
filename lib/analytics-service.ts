"use client"

// Google Analytics MCP Tool Integration Service
// This service wraps the Google Analytics MCP functions and provides clean TypeScript interfaces

export interface AnalyticsAccount {
  name: string;
  account: string;
  display_name: string;
  property_summaries: PropertySummary[];
}

export interface PropertySummary {
  property: string;
  display_name: string;
  property_type: string;
  parent: string;
}

export interface PropertyDetails {
  name: string;
  parent: string;
  create_time: string;
  update_time: string;
  display_name: string;
  industry_category: string;
  time_zone: string;
  currency_code: string;
  service_level: string;
  account: string;
  property_type: string;
}

export interface TrafficSource {
  source: string;
  medium: string;
  sessions: number;
  users: number;
  pageviews: number;
  bounceRate: number;
  avgSessionDuration: number;
}

export interface GeographicData {
  country: string;
  city: string;
  sessions: number;
  users: number;
}

export interface DeviceData {
  deviceCategory: string;
  sessions: number;
  users: number;
  bounceRate: number;
}

export interface PageData {
  pagePath: string;
  pageTitle: string;
  pageviews: number;
  uniquePageviews: number;
  avgTimeOnPage: number;
  bounceRate: number;
}

export interface RealTimeData {
  activeUsers: number;
  activeUsersByCountry: Array<{ country: string; activeUsers: number }>;
  activeUsersByDevice: Array<{ deviceCategory: string; activeUsers: number }>;
  activeUsersBySource: Array<{ source: string; activeUsers: number }>;
  topPages: Array<{ pagePath: string; pageTitle: string; activeUsers: number }>;
}

export interface AnalyticsMetrics {
  sessions: number;
  users: number;
  newUsers: number;
  pageviews: number;
  uniquePageviews: number;
  bounceRate: number;
  avgSessionDuration: number;
  pagesPerSession: number;
  conversionRate: number;
  goalCompletions: number;
  revenue: number;
  ecommerceConversionRate: number;
}

export interface AnalyticsData {
  metrics: AnalyticsMetrics;
  trafficSources: TrafficSource[];
  geographicData: GeographicData[];
  deviceData: DeviceData[];
  topPages: PageData[];
  realTimeData: RealTimeData;
  dateRange: {
    startDate: string;
    endDate: string;
  };
}

export interface DateRange {
  start_date: string;
  end_date: string;
  name?: string;
}

export interface AnalyticsReportData {
  dimensionHeaders: Array<{ name: string }>;
  metricHeaders: Array<{ name: string; type: string }>;
  rows: Array<{
    dimensionValues: Array<{ value: string }>;
    metricValues: Array<{ value: string }>;
  }>;
  rowCount: number;
  totals: Array<{
    metricValues: Array<{ value: string }>;
  }>;
}

class AnalyticsService {
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

  private clearCache(): void {
    this.cache.clear();
  }

  // Get account summaries
  async getAccountSummaries(): Promise<AnalyticsAccount[]> {
    const cacheKey = this.getCacheKey('getAccountSummaries', {});
    const cached = this.getCachedData<AnalyticsAccount[]>(cacheKey);
    if (cached) return cached;

    try {
      // This would be called via the MCP tool in a real implementation
      // For now, we'll return mock data based on the actual response we got
      const accounts: AnalyticsAccount[] = [
        {
          name: "accountSummaries/360535044",
          account: "accounts/360535044",
          display_name: "Default Account for Firebase",
          property_summaries: [
            {
              property: "properties/495635139",
              display_name: "everythingenglishai1",
              property_type: "PROPERTY_TYPE_ORDINARY",
              parent: "accounts/360535044"
            }
          ]
        }
      ];

      this.setCachedData(cacheKey, accounts);
      return accounts;
    } catch (error) {
      console.error('Error fetching account summaries:', error);
      throw new Error('Failed to fetch account summaries');
    }
  }

  // Get property details
  async getPropertyDetails(propertyId?: string): Promise<PropertyDetails> {
    const id = propertyId || this.propertyId;
    const cacheKey = this.getCacheKey('getPropertyDetails', { propertyId: id });
    const cached = this.getCachedData<PropertyDetails>(cacheKey);
    if (cached) return cached;

    try {
      // Mock data based on actual response
      const details: PropertyDetails = {
        name: "properties/495635139",
        parent: "accounts/360535044",
        create_time: "2025-07-05T06:54:44.611Z",
        update_time: "2025-07-23T12:15:32.114Z",
        display_name: "everythingenglishai1",
        industry_category: "JOBS_AND_EDUCATION",
        time_zone: "Etc/GMT",
        currency_code: "USD",
        service_level: "GOOGLE_ANALYTICS_STANDARD",
        account: "accounts/360535044",
        property_type: "PROPERTY_TYPE_ORDINARY"
      };

      this.setCachedData(cacheKey, details);
      return details;
    } catch (error) {
      console.error('Error fetching property details:', error);
      throw new Error('Failed to fetch property details');
    }
  }

  // Generate date ranges
  private generateDateRanges(days: number): DateRange[] {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);

    return [{
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
      name: `Last${days}Days`
    }];
  }

  // Get comprehensive analytics data
  async getAnalyticsData(days: number = 30): Promise<AnalyticsData> {
    const cacheKey = this.getCacheKey('getAnalyticsData', { days });
    const cached = this.getCachedData<AnalyticsData>(cacheKey);
    if (cached) return cached;

    try {
      const dateRanges = this.generateDateRanges(days);
      
      // Fetch all data in parallel
      const [metrics, trafficSources, geographicData, deviceData, topPages, realTimeData] = await Promise.all([
        this.getMetrics(dateRanges),
        this.getTrafficSources(dateRanges),
        this.getGeographicData(dateRanges),
        this.getDeviceData(dateRanges),
        this.getTopPages(dateRanges),
        this.getRealTimeData()
      ]);

      const data: AnalyticsData = {
        metrics,
        trafficSources,
        geographicData,
        deviceData,
        topPages,
        realTimeData,
        dateRange: {
          startDate: dateRanges[0].start_date,
          endDate: dateRanges[0].end_date
        }
      };

      this.setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      throw new Error('Failed to fetch analytics data');
    }
  }

  // Get core metrics
  async getMetrics(dateRanges: DateRange[]): Promise<AnalyticsMetrics> {
    try {
      // Mock data - in real implementation, this would call the MCP tool
      const metrics: AnalyticsMetrics = {
        sessions: Math.floor(Math.random() * 10000) + 5000,
        users: Math.floor(Math.random() * 8000) + 4000,
        newUsers: Math.floor(Math.random() * 3000) + 1500,
        pageviews: Math.floor(Math.random() * 50000) + 25000,
        uniquePageviews: Math.floor(Math.random() * 30000) + 15000,
        bounceRate: Math.random() * 0.4 + 0.3, // 30-70%
        avgSessionDuration: Math.random() * 300 + 120, // 2-7 minutes
        pagesPerSession: Math.random() * 3 + 2, // 2-5 pages
        conversionRate: Math.random() * 0.05 + 0.02, // 2-7%
        goalCompletions: Math.floor(Math.random() * 500) + 100,
        revenue: Math.random() * 10000 + 5000, // $5k-$15k
        ecommerceConversionRate: Math.random() * 0.03 + 0.01 // 1-4%
      };

      return metrics;
    } catch (error) {
      console.error('Error fetching metrics:', error);
      throw new Error('Failed to fetch metrics');
    }
  }

  // Get traffic sources
  async getTrafficSources(dateRanges: DateRange[]): Promise<TrafficSource[]> {
    try {
      const sources: TrafficSource[] = [
        {
          source: "google",
          medium: "organic",
          sessions: Math.floor(Math.random() * 3000) + 2000,
          users: Math.floor(Math.random() * 2500) + 1500,
          pageviews: Math.floor(Math.random() * 15000) + 10000,
          bounceRate: Math.random() * 0.3 + 0.2,
          avgSessionDuration: Math.random() * 200 + 150
        },
        {
          source: "facebook",
          medium: "social",
          sessions: Math.floor(Math.random() * 1500) + 800,
          users: Math.floor(Math.random() * 1200) + 600,
          pageviews: Math.floor(Math.random() * 8000) + 4000,
          bounceRate: Math.random() * 0.4 + 0.3,
          avgSessionDuration: Math.random() * 180 + 120
        },
        {
          source: "youtube",
          medium: "social",
          sessions: Math.floor(Math.random() * 1000) + 500,
          users: Math.floor(Math.random() * 800) + 400,
          pageviews: Math.floor(Math.random() * 6000) + 3000,
          bounceRate: Math.random() * 0.5 + 0.2,
          avgSessionDuration: Math.random() * 300 + 200
        },
        {
          source: "direct",
          medium: "(none)",
          sessions: Math.floor(Math.random() * 2000) + 1000,
          users: Math.floor(Math.random() * 1500) + 800,
          pageviews: Math.floor(Math.random() * 10000) + 5000,
          bounceRate: Math.random() * 0.3 + 0.2,
          avgSessionDuration: Math.random() * 250 + 180
        },
        {
          source: "bing",
          medium: "organic",
          sessions: Math.floor(Math.random() * 800) + 300,
          users: Math.floor(Math.random() * 600) + 250,
          pageviews: Math.floor(Math.random() * 4000) + 2000,
          bounceRate: Math.random() * 0.4 + 0.25,
          avgSessionDuration: Math.random() * 220 + 140
        }
      ];

      return sources;
    } catch (error) {
      console.error('Error fetching traffic sources:', error);
      throw new Error('Failed to fetch traffic sources');
    }
  }

  // Get geographic data
  async getGeographicData(dateRanges: DateRange[]): Promise<GeographicData[]> {
    try {
      const countries = [
        { country: "United States", city: "New York", sessions: 2500, users: 2000 },
        { country: "United Kingdom", city: "London", sessions: 1800, users: 1500 },
        { country: "Canada", city: "Toronto", sessions: 1200, users: 1000 },
        { country: "Australia", city: "Sydney", sessions: 900, users: 750 },
        { country: "India", city: "Mumbai", sessions: 800, users: 650 },
        { country: "Germany", city: "Berlin", sessions: 700, users: 580 },
        { country: "France", city: "Paris", sessions: 600, users: 500 },
        { country: "Japan", city: "Tokyo", sessions: 500, users: 420 }
      ];

      return countries.map(country => ({
        ...country,
        sessions: country.sessions + Math.floor(Math.random() * 500) - 250,
        users: country.users + Math.floor(Math.random() * 300) - 150
      }));
    } catch (error) {
      console.error('Error fetching geographic data:', error);
      throw new Error('Failed to fetch geographic data');
    }
  }

  // Get device data
  async getDeviceData(dateRanges: DateRange[]): Promise<DeviceData[]> {
    try {
      const devices: DeviceData[] = [
        {
          deviceCategory: "desktop",
          sessions: Math.floor(Math.random() * 4000) + 3000,
          users: Math.floor(Math.random() * 3200) + 2400,
          bounceRate: Math.random() * 0.3 + 0.2
        },
        {
          deviceCategory: "mobile",
          sessions: Math.floor(Math.random() * 5000) + 4000,
          users: Math.floor(Math.random() * 4000) + 3200,
          bounceRate: Math.random() * 0.4 + 0.3
        },
        {
          deviceCategory: "tablet",
          sessions: Math.floor(Math.random() * 1000) + 500,
          users: Math.floor(Math.random() * 800) + 400,
          bounceRate: Math.random() * 0.35 + 0.25
        }
      ];

      return devices;
    } catch (error) {
      console.error('Error fetching device data:', error);
      throw new Error('Failed to fetch device data');
    }
  }

  // Get top pages
  async getTopPages(dateRanges: DateRange[]): Promise<PageData[]> {
    try {
      const pages: PageData[] = [
        {
          pagePath: "/",
          pageTitle: "EverythingEnglish - AI-Powered English Learning",
          pageviews: Math.floor(Math.random() * 8000) + 5000,
          uniquePageviews: Math.floor(Math.random() * 6000) + 4000,
          avgTimeOnPage: Math.random() * 300 + 180,
          bounceRate: Math.random() * 0.4 + 0.2
        },
        {
          pagePath: "/assessment",
          pageTitle: "English Assessment - Test Your Skills",
          pageviews: Math.floor(Math.random() * 5000) + 3000,
          uniquePageviews: Math.floor(Math.random() * 4000) + 2500,
          avgTimeOnPage: Math.random() * 600 + 300,
          bounceRate: Math.random() * 0.3 + 0.1
        },
        {
          pagePath: "/learning",
          pageTitle: "Learning Center - Study Materials",
          pageviews: Math.floor(Math.random() * 3000) + 2000,
          uniquePageviews: Math.floor(Math.random() * 2500) + 1500,
          avgTimeOnPage: Math.random() * 400 + 200,
          bounceRate: Math.random() * 0.35 + 0.15
        },
        {
          pagePath: "/about",
          pageTitle: "About EverythingEnglish",
          pageviews: Math.floor(Math.random() * 2000) + 1000,
          uniquePageviews: Math.floor(Math.random() * 1500) + 800,
          avgTimeOnPage: Math.random() * 200 + 120,
          bounceRate: Math.random() * 0.5 + 0.2
        },
        {
          pagePath: "/contact",
          pageTitle: "Contact Us - Get in Touch",
          pageviews: Math.floor(Math.random() * 1500) + 800,
          uniquePageviews: Math.floor(Math.random() * 1200) + 600,
          avgTimeOnPage: Math.random() * 180 + 100,
          bounceRate: Math.random() * 0.4 + 0.25
        }
      ];

      return pages;
    } catch (error) {
      console.error('Error fetching top pages:', error);
      throw new Error('Failed to fetch top pages');
    }
  }

  // Get real-time data
  async getRealTimeData(): Promise<RealTimeData> {
    try {
      const realTimeData: RealTimeData = {
        activeUsers: Math.floor(Math.random() * 50) + 20,
        activeUsersByCountry: [
          { country: "United States", activeUsers: Math.floor(Math.random() * 20) + 10 },
          { country: "United Kingdom", activeUsers: Math.floor(Math.random() * 15) + 5 },
          { country: "Canada", activeUsers: Math.floor(Math.random() * 10) + 3 },
          { country: "Australia", activeUsers: Math.floor(Math.random() * 8) + 2 }
        ],
        activeUsersByDevice: [
          { deviceCategory: "desktop", activeUsers: Math.floor(Math.random() * 25) + 10 },
          { deviceCategory: "mobile", activeUsers: Math.floor(Math.random() * 30) + 15 },
          { deviceCategory: "tablet", activeUsers: Math.floor(Math.random() * 8) + 2 }
        ],
        activeUsersBySource: [
          { source: "google", activeUsers: Math.floor(Math.random() * 20) + 8 },
          { source: "direct", activeUsers: Math.floor(Math.random() * 15) + 5 },
          { source: "facebook", activeUsers: Math.floor(Math.random() * 10) + 3 },
          { source: "youtube", activeUsers: Math.floor(Math.random() * 8) + 2 }
        ],
        topPages: [
          { pagePath: "/", pageTitle: "Home", activeUsers: Math.floor(Math.random() * 15) + 5 },
          { pagePath: "/assessment", pageTitle: "Assessment", activeUsers: Math.floor(Math.random() * 12) + 3 },
          { pagePath: "/learning", pageTitle: "Learning", activeUsers: Math.floor(Math.random() * 10) + 2 }
        ]
      };

      return realTimeData;
    } catch (error) {
      console.error('Error fetching real-time data:', error);
      throw new Error('Failed to fetch real-time data');
    }
  }

  // Get custom dimensions and metrics
  async getCustomDimensionsAndMetrics(propertyId?: string): Promise<any> {
    const id = propertyId || this.propertyId;
    const cacheKey = this.getCacheKey('getCustomDimensionsAndMetrics', { propertyId: id });
    const cached = this.getCachedData<any>(cacheKey);
    if (cached) return cached;

    try {
      // Mock data for custom dimensions and metrics
      const customData = {
        customDimensions: [
          { name: "User Type", scope: "USER", description: "Type of user (student, teacher, parent)" },
          { name: "Course Level", scope: "SESSION", description: "Current course level being studied" }
        ],
        customMetrics: [
          { name: "Study Time", type: "TIME", description: "Total time spent studying" },
          { name: "Assessment Score", type: "INTEGER", description: "Latest assessment score" }
        ]
      };

      this.setCachedData(cacheKey, customData);
      return customData;
    } catch (error) {
      console.error('Error fetching custom dimensions and metrics:', error);
      throw new Error('Failed to fetch custom dimensions and metrics');
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

  // Refresh cache
  refreshCache(): void {
    this.clearCache();
  }
}

// Export singleton instance
export const analyticsService = new AnalyticsService();

// Export types and service
export default analyticsService;
