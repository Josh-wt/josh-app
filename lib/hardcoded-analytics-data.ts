// Hardcoded Analytics Data
// This file contains realistic analytics data that will be used instead of API calls
// Data is based on the mock data structure from MCP tools

export interface HardcodedRealtimeData {
  activeUsers: number;
  activeUsersByCountry: Array<{ country: string; activeUsers: number }>;
  activeUsersByDevice: Array<{ deviceCategory: string; activeUsers: number }>;
  activeUsersBySource: Array<{ source: string; activeUsers: number }>;
  topPages: Array<{ pagePath: string; pageTitle: string; activeUsers: number }>;
}

export interface HardcodedStandardMetrics {
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

export interface HardcodedGeographicMetrics {
  country: string;
  sessions: number;
  totalUsers: number;
  newUsers: number;
  screenPageViews: number;
  bounceRate: number;
  averageSessionDuration: number;
}

export interface HardcodedDeviceMetrics {
  deviceCategory: string;
  sessions: number;
  totalUsers: number;
  screenPageViews: number;
  bounceRate: number;
  averageSessionDuration: number;
}

// Real-time data (updated every 30 seconds)
export const hardcodedRealtimeData: HardcodedRealtimeData = {
  activeUsers: 23,
  activeUsersByCountry: [
    { country: 'United States', activeUsers: 15 },
    { country: 'Canada', activeUsers: 8 },
    { country: 'United Kingdom', activeUsers: 3 },
    { country: 'Australia', activeUsers: 2 },
    { country: 'Germany', activeUsers: 1 }
  ],
  activeUsersByDevice: [
    { deviceCategory: 'desktop', activeUsers: 12 },
    { deviceCategory: 'mobile', activeUsers: 8 },
    { deviceCategory: 'tablet', activeUsers: 3 }
  ],
  activeUsersBySource: [
    { source: 'google', activeUsers: 10 },
    { source: 'direct', activeUsers: 7 },
    { source: 'facebook', activeUsers: 4 },
    { source: 'twitter', activeUsers: 2 }
  ],
  topPages: [
    { pagePath: '/', pageTitle: 'Home - Everything English AI', activeUsers: 8 },
    { pagePath: '/courses', pageTitle: 'English Courses', activeUsers: 5 },
    { pagePath: '/about', pageTitle: 'About Us', activeUsers: 4 },
    { pagePath: '/contact', pageTitle: 'Contact', activeUsers: 3 },
    { pagePath: '/blog', pageTitle: 'Blog', activeUsers: 2 }
  ]
};

// Standard metrics for last 7 days
export const hardcodedStandardMetrics: HardcodedStandardMetrics = {
  sessions: 2000,
  totalUsers: 1600,
  newUsers: 440,
  screenPageViews: 3000,
  bounceRate: 0.45,
  averageSessionDuration: 180, // 3 minutes
  pagesPerSession: 1.5,
  conversionRate: 0.08, // 8%
  goalCompletions: 160,
  revenue: 1250.00,
  ecommerceConversionRate: 0.12 // 12%
};

// Geographic data for last 7 days
export const hardcodedGeographicMetrics: HardcodedGeographicMetrics[] = [
  {
    country: 'United States',
    sessions: 1250,
    totalUsers: 980,
    newUsers: 320,
    screenPageViews: 2100,
    bounceRate: 0.45,
    averageSessionDuration: 180
  },
  {
    country: 'Canada',
    sessions: 450,
    totalUsers: 380,
    newUsers: 120,
    screenPageViews: 750,
    bounceRate: 0.38,
    averageSessionDuration: 220
  },
  {
    country: 'United Kingdom',
    sessions: 180,
    totalUsers: 150,
    newUsers: 45,
    screenPageViews: 280,
    bounceRate: 0.42,
    averageSessionDuration: 195
  },
  {
    country: 'Australia',
    sessions: 95,
    totalUsers: 80,
    newUsers: 25,
    screenPageViews: 140,
    bounceRate: 0.35,
    averageSessionDuration: 240
  },
  {
    country: 'Germany',
    sessions: 75,
    totalUsers: 65,
    newUsers: 20,
    screenPageViews: 110,
    bounceRate: 0.48,
    averageSessionDuration: 165
  },
  {
    country: 'France',
    sessions: 60,
    totalUsers: 55,
    newUsers: 15,
    screenPageViews: 90,
    bounceRate: 0.40,
    averageSessionDuration: 200
  },
  {
    country: 'Japan',
    sessions: 45,
    totalUsers: 40,
    newUsers: 12,
    screenPageViews: 70,
    bounceRate: 0.52,
    averageSessionDuration: 155
  },
  {
    country: 'Brazil',
    sessions: 35,
    totalUsers: 30,
    newUsers: 8,
    screenPageViews: 55,
    bounceRate: 0.43,
    averageSessionDuration: 175
  }
];

// Device data for last 7 days
export const hardcodedDeviceMetrics: HardcodedDeviceMetrics[] = [
  {
    deviceCategory: 'desktop',
    sessions: 1200,
    totalUsers: 950,
    screenPageViews: 1800,
    bounceRate: 0.42,
    averageSessionDuration: 195
  },
  {
    deviceCategory: 'mobile',
    sessions: 800,
    totalUsers: 650,
    screenPageViews: 1200,
    bounceRate: 0.48,
    averageSessionDuration: 165
  },
  {
    deviceCategory: 'tablet',
    sessions: 200,
    totalUsers: 180,
    screenPageViews: 300,
    bounceRate: 0.50,
    averageSessionDuration: 150
  }
];

// Utility functions for formatting
export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

export const formatPercentage = (decimal: number): string => {
  return (decimal * 100).toFixed(1) + '%';
};

export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

// Function to get fresh real-time data (simulates live updates)
export const getFreshRealtimeData = (): HardcodedRealtimeData => {
  // Simulate some variation in real-time data
  const baseData = { ...hardcodedRealtimeData };
  
  // Add some random variation to active users (±20%)
  const variation = (Math.random() - 0.5) * 0.4; // -20% to +20%
  baseData.activeUsers = Math.max(1, Math.round(baseData.activeUsers * (1 + variation)));
  
  // Update country data proportionally
  baseData.activeUsersByCountry = baseData.activeUsersByCountry.map(country => ({
    ...country,
    activeUsers: Math.max(0, Math.round(country.activeUsers * (1 + variation * 0.5)))
  }));
  
  // Update device data proportionally
  baseData.activeUsersByDevice = baseData.activeUsersByDevice.map(device => ({
    ...device,
    activeUsers: Math.max(0, Math.round(device.activeUsers * (1 + variation * 0.3)))
  }));
  
  return baseData;
};

