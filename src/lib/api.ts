import {
  mockDisasters,
  mockSocialMediaReports,
  mockResources,
  mockReports,
  mockOfficialUpdates,
  generateRealtimeUpdate,
  Disaster,
  SocialMediaReport,
  Resource,
  Report,
  OfficialUpdate,
} from "./mock-data";
import {
  fetchAllRealTimeDisasters,
  isRealTimeDataAvailable,
  startRealTimeDataRefresh,
} from "./real-time-api";

// Simulated API delays
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Cache simulation
const cache = new Map<string, { data: any; expires: number }>();

const getCached = (key: string) => {
  const cached = cache.get(key);
  if (cached && cached.expires > Date.now()) {
    return cached.data;
  }
  return null;
};

const setCache = (key: string, data: any, ttl = 3600000) => {
  // 1 hour TTL
  cache.set(key, {
    data,
    expires: Date.now() + ttl,
  });
};

// Simulated Gemini API for location extraction
export const extractLocationFromText = async (
  text: string,
): Promise<{ location: string; confidence: number }> => {
  await delay(500); // Simulate API call

  // Simple location extraction simulation
  const locationPatterns = [
    /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*),?\s*([A-Z]{2})/g, // City, State
    /(Manhattan|Brooklyn|Queens|Bronx|Staten Island)/gi,
    /(NYC|New York City)/gi,
    /(Los Angeles|LA|San Francisco|SF|Miami|Chicago|Houston|Dallas)/gi,
  ];

  for (const pattern of locationPatterns) {
    const match = pattern.exec(text);
    if (match) {
      return {
        location: match[0],
        confidence: Math.random() * 0.3 + 0.7, // 70-100% confidence
      };
    }
  }

  return {
    location: "Location not detected",
    confidence: 0,
  };
};

// Simulated geocoding API
export const geocodeLocation = async (
  locationName: string,
): Promise<{ lat: number; lng: number; address: string } | null> => {
  await delay(300);

  const cacheKey = `geocode_${locationName}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  // Mock geocoding results
  const mockGeocodingResults: Record<
    string,
    { lat: number; lng: number; address: string }
  > = {
    "Manhattan, NYC": {
      lat: 40.7128,
      lng: -74.006,
      address: "Manhattan, New York, NY, USA",
    },
    Manhattan: {
      lat: 40.7128,
      lng: -74.006,
      address: "Manhattan, New York, NY, USA",
    },
    Brooklyn: {
      lat: 40.6782,
      lng: -73.9442,
      address: "Brooklyn, New York, NY, USA",
    },
    "Los Angeles": {
      lat: 34.0522,
      lng: -118.2437,
      address: "Los Angeles, California, USA",
    },
    Houston: { lat: 29.7604, lng: -95.3698, address: "Houston, Texas, USA" },
    Miami: { lat: 25.7617, lng: -80.1918, address: "Miami, Florida, USA" },
    Chicago: { lat: 41.8781, lng: -87.6298, address: "Chicago, Illinois, USA" },
  };

  const result = mockGeocodingResults[locationName] || null;
  if (result) {
    setCache(cacheKey, result);
  }

  return result;
};

// Global real-time disasters cache
let realTimeDisasters: Disaster[] = [];
let lastRealTimeUpdate = 0;
const REAL_TIME_CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

// Disaster APIs
export const getDisasters = async (filters?: {
  tag?: string;
  status?: string;
  priority?: string;
  useRealTime?: boolean;
}): Promise<Disaster[]> => {
  await delay(200);

  let disasters: Disaster[] = [];

  // Try to use real-time data if requested and available
  if (filters?.useRealTime !== false) {
    try {
      const now = Date.now();

      // Check if we need to refresh real-time data
      if (
        now - lastRealTimeUpdate > REAL_TIME_CACHE_DURATION ||
        realTimeDisasters.length === 0
      ) {
        console.log("🌍 Fetching latest real-time disaster data...");
        const isAvailable = await isRealTimeDataAvailable();

        if (isAvailable) {
          const realTime = await fetchAllRealTimeDisasters();
          if (realTime.length > 0) {
            realTimeDisasters = realTime;
            lastRealTimeUpdate = now;
            console.log(
              `✅ Real-time data loaded: ${realTime.length} active disasters`,
            );
          }
        }
      }

      // Use real-time data if available, otherwise fall back to mock data
      disasters =
        realTimeDisasters.length > 0
          ? [...realTimeDisasters, ...mockDisasters]
          : [...mockDisasters];
    } catch (error) {
      console.error("Real-time data fetch failed, using mock data:", error);
      disasters = [...mockDisasters];
    }
  } else {
    disasters = [...mockDisasters];
  }

  // Apply filters
  if (filters?.tag) {
    disasters = disasters.filter((d) => d.tags.includes(filters.tag as any));
  }
  if (filters?.status) {
    disasters = disasters.filter((d) => d.status === filters.status);
  }
  if (filters?.priority) {
    disasters = disasters.filter((d) => d.priority === filters.priority);
  }

  return disasters;
};

export const createDisaster = async (
  disaster: Omit<Disaster, "id" | "created_at" | "updated_at" | "audit_trail">,
): Promise<Disaster> => {
  await delay(300);

  const newDisaster: Disaster = {
    ...disaster,
    id: `disaster_${Date.now()}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    audit_trail: [
      {
        action: "created",
        user_id: disaster.owner_id,
        timestamp: new Date().toISOString(),
        details: "Disaster report created",
      },
    ],
  };

  mockDisasters.push(newDisaster);
  return newDisaster;
};

export const updateDisaster = async (
  id: string,
  updates: Partial<Disaster>,
): Promise<Disaster | null> => {
  await delay(250);

  const index = mockDisasters.findIndex((d) => d.id === id);
  if (index === -1) return null;

  const disaster = mockDisasters[index];
  const updatedDisaster = {
    ...disaster,
    ...updates,
    updated_at: new Date().toISOString(),
    audit_trail: [
      ...disaster.audit_trail,
      {
        action: "updated",
        user_id: updates.owner_id || disaster.owner_id,
        timestamp: new Date().toISOString(),
        details: "Disaster information updated",
      },
    ],
  };

  mockDisasters[index] = updatedDisaster;
  return updatedDisaster;
};

export const deleteDisaster = async (id: string): Promise<boolean> => {
  await delay(200);

  const index = mockDisasters.findIndex((d) => d.id === id);
  if (index === -1) return false;

  // Add audit trail entry before deletion
  const disaster = mockDisasters[index];
  const finalAuditEntry = {
    action: "deleted",
    user_id: "system", // or current user
    timestamp: new Date().toISOString(),
    details: `Disaster resolved and removed from active monitoring`,
  };

  // Remove from array
  mockDisasters.splice(index, 1);

  console.log(
    `Disaster ${disaster.title} (${id}) has been resolved and deleted.`,
  );
  return true;
};

// Social Media APIs
export const getSocialMediaReports = async (
  disasterId: string,
): Promise<SocialMediaReport[]> => {
  await delay(400);

  const cacheKey = `social_${disasterId}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const reports = mockSocialMediaReports.filter(
    (r) => r.disaster_id === disasterId,
  );
  setCache(cacheKey, reports, 300000); // 5 minute cache for social media

  return reports;
};

// Resource APIs
export const getResourcesNearLocation = async (
  lat: number,
  lng: number,
  radius: number = 10,
): Promise<Resource[]> => {
  await delay(300);

  // Simulate geospatial query - find resources within radius (km)
  const resources = mockResources.filter((resource) => {
    const distance = calculateDistance(
      lat,
      lng,
      resource.location.lat,
      resource.location.lng,
    );
    return distance <= radius;
  });

  return resources;
};

export const getResourcesByDisaster = async (
  disasterId: string,
): Promise<Resource[]> => {
  await delay(200);
  return mockResources.filter((r) => r.disaster_id === disasterId);
};

// Report APIs
export const createReport = async (
  report: Omit<Report, "id" | "created_at">,
): Promise<Report> => {
  await delay(400);

  const newReport: Report = {
    ...report,
    id: `report_${Date.now()}`,
    created_at: new Date().toISOString(),
  };

  mockReports.push(newReport);
  return newReport;
};

export const deleteReport = async (id: string): Promise<boolean> => {
  await delay(200);

  const index = mockReports.findIndex((r) => r.id === id);
  if (index === -1) return false;

  const report = mockReports[index];
  mockReports.splice(index, 1);

  console.log(`Report ${report.id} has been deleted from the system.`);
  return true;
};

export const updateReportStatus = async (
  id: string,
  status: "verified" | "pending" | "flagged" | "rejected",
  details?: string,
): Promise<Report | null> => {
  await delay(200);

  const index = mockReports.findIndex((r) => r.id === id);
  if (index === -1) return null;

  mockReports[index] = {
    ...mockReports[index],
    verification_status: status,
    updated_at: new Date().toISOString(),
    action_details: details,
  };

  return mockReports[index];
};

export const verifyImage = async (
  imageUrl: string,
): Promise<{
  isAuthentic: boolean;
  confidence: number;
  analysis: string;
  flaggedContent?: string[];
}> => {
  await delay(1000); // Simulate AI processing time

  // Mock image verification results
  const isAuthentic = Math.random() > 0.2; // 80% authentic rate
  const confidence = Math.random() * 0.3 + 0.7; // 70-100% confidence

  const analysis = isAuthentic
    ? "Image appears authentic. No signs of digital manipulation detected. Consistent lighting and shadows."
    : "Potential manipulation detected. Inconsistent metadata or visual artifacts found.";

  const flaggedContent = isAuthentic
    ? undefined
    : ["metadata_inconsistency", "lighting_artifacts"];

  return {
    isAuthentic,
    confidence,
    analysis,
    flaggedContent,
  };
};

// Official Updates APIs
export const getOfficialUpdates = async (
  disasterId: string,
): Promise<OfficialUpdate[]> => {
  await delay(350);

  const cacheKey = `official_${disasterId}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  // Simulate web scraping results
  const updates = mockOfficialUpdates.filter(
    (u) => u.disaster_id === disasterId,
  );
  setCache(cacheKey, updates);

  return updates;
};

// Real-time simulation
export const subscribeToRealtimeUpdates = (
  callback: (update: any) => void,
): (() => void) => {
  const interval = setInterval(() => {
    if (Math.random() > 0.7) {
      // 30% chance of update every interval
      const update = generateRealtimeUpdate();
      callback(update);
    }
  }, 3000); // Check every 3 seconds

  return () => clearInterval(interval);
};

// Utility functions
const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Statistics API
export const getSystemStats = async () => {
  await delay(150);

  return {
    totalDisasters: mockDisasters.length,
    activeDisasters: mockDisasters.filter((d) => d.status === "active").length,
    totalReports: mockReports.length,
    verifiedReports: mockReports.filter(
      (r) => r.verification_status === "verified",
    ).length,
    totalResources: mockResources.length,
    operationalResources: mockResources.filter(
      (r) => r.status === "operational",
    ).length,
    totalAffectedPeople: mockDisasters.reduce(
      (sum, d) => sum + d.affected_people,
      0,
    ),
    criticalAlerts: mockDisasters.filter((d) => d.priority === "critical")
      .length,
    lastUpdate: new Date().toISOString(),
  };
};
