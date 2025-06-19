export type DisasterType =
  | "flood"
  | "earthquake"
  | "wildfire"
  | "hurricane"
  | "tornado"
  | "landslide"
  | "tsunami"
  | "volcano";
export type Priority = "critical" | "high" | "medium" | "low";
export type DisasterStatus = "active" | "monitoring" | "resolved" | "pending";
export type ResourceType =
  | "shelter"
  | "medical"
  | "food"
  | "water"
  | "transport";
export type VerificationStatus =
  | "verified"
  | "pending"
  | "flagged"
  | "rejected";

export interface Location {
  lat: number;
  lng: number;
  name: string;
  address: string;
}

export interface Disaster {
  id: string;
  title: string;
  description: string;
  location: Location;
  tags: DisasterType[];
  priority: Priority;
  status: DisasterStatus;
  owner_id: string;
  created_at: string;
  updated_at: string;
  affected_people: number;
  estimated_damage: string;
  audit_trail: Array<{
    action: string;
    user_id: string;
    timestamp: string;
    details?: string;
  }>;
}

export interface SocialMediaReport {
  id: string;
  disaster_id: string;
  platform: "twitter" | "facebook" | "instagram" | "bluesky";
  user: string;
  content: string;
  sentiment: "urgent" | "informational" | "offer_help" | "request_help";
  verified: boolean;
  created_at: string;
  location?: Location;
  hashtags: string[];
  engagement: {
    likes: number;
    shares: number;
    replies: number;
  };
}

export interface Resource {
  id: string;
  disaster_id: string;
  name: string;
  type: ResourceType;
  location: Location;
  capacity: number;
  available: number;
  contact: string;
  status: "operational" | "overwhelmed" | "closed";
  created_at: string;
  description: string;
}

export interface Report {
  id: string;
  disaster_id: string;
  user_id: string;
  content: string;
  image_url?: string;
  verification_status: VerificationStatus;
  created_at: string;
  location?: Location;
  priority: Priority;
}

export interface OfficialUpdate {
  id: string;
  disaster_id: string;
  source: string;
  title: string;
  content: string;
  url: string;
  published_at: string;
  severity: Priority;
}

// Mock Data - Latest 2024 Global Disasters
export const mockDisasters: Disaster[] = [
  {
    id: "1",
    title: "Maui Lahaina Wildfire Recovery",
    description:
      "Ongoing recovery efforts in Lahaina following devastating August 2023 wildfires. Infrastructure rebuilding in progress, temporary housing established.",
    location: {
      lat: 20.8783,
      lng: -156.6825,
      name: "Lahaina, Maui, HI",
      address: "Lahaina, Hawaii, USA",
    },
    tags: ["wildfire"],
    priority: "high",
    status: "monitoring",
    owner_id: "FEMA_Pacific",
    created_at: "2024-01-05T08:00:00Z",
    updated_at: "2024-01-15T16:30:00Z",
    affected_people: 12500,
    estimated_damage: "$5.52B",
    audit_trail: [
      {
        action: "created",
        user_id: "FEMA_Pacific",
        timestamp: "2024-01-05T08:00:00Z",
        details: "Long-term recovery monitoring established",
      },
      {
        action: "updated",
        user_id: "recovery_coord",
        timestamp: "2024-01-15T16:30:00Z",
        details: "Housing progress update - 85% temporary housing complete",
      },
    ],
  },
  {
    id: "2",
    title: "Japan Noto Peninsula Earthquake",
    description:
      "7.6 magnitude earthquake struck Ishikawa Prefecture on January 1, 2024. Widespread damage to infrastructure, ongoing aftershocks, tsunami warnings issued.",
    location: {
      lat: 37.5665,
      lng: 136.6316,
      name: "Ishikawa Prefecture, Japan",
      address: "Noto Peninsula, Ishikawa, Japan",
    },
    tags: ["earthquake", "tsunami"],
    priority: "critical",
    status: "active",
    owner_id: "JMA_Emergency",
    created_at: "2024-01-01T07:10:00Z",
    updated_at: "2024-01-15T12:45:00Z",
    affected_people: 97000,
    estimated_damage: "$15.2B+",
    audit_trail: [
      {
        action: "created",
        user_id: "JMA_Emergency",
        timestamp: "2024-01-01T07:10:00Z",
        details: "Major earthquake - immediate response activated",
      },
      {
        action: "escalated",
        user_id: "disaster_coord_jp",
        timestamp: "2024-01-01T08:30:00Z",
        details: "Escalated to critical due to infrastructure collapse",
      },
    ],
  },
  {
    id: "3",
    title: "European Heat Dome Crisis",
    description:
      "Extreme heat wave affecting Southern Europe. Temperatures exceeding 45°C (113°F) in Italy, Spain, and Greece. Power grid strain, health emergencies.",
    location: {
      lat: 41.9028,
      lng: 12.4964,
      name: "Southern Europe",
      address: "Mediterranean Region, Europe",
    },
    tags: ["wildfire"],
    priority: "high",
    status: "active",
    owner_id: "EU_Emergency",
    created_at: "2024-01-12T14:00:00Z",
    updated_at: "2024-01-15T18:20:00Z",
    affected_people: 250000,
    estimated_damage: "$3.8B",
    audit_trail: [
      {
        action: "created",
        user_id: "EU_Emergency",
        timestamp: "2024-01-12T14:00:00Z",
        details: "Heat wave emergency declared across multiple countries",
      },
    ],
  },
  {
    id: "4",
    title: "Bangladesh Cyclone Remal",
    description:
      "Severe cyclonic storm making landfall in Bangladesh and West Bengal. Storm surge up to 4 meters, over 1 million people evacuated to shelters.",
    location: {
      lat: 23.685,
      lng: 90.3563,
      name: "Bangladesh Coast",
      address: "Chittagong Division, Bangladesh",
    },
    tags: ["hurricane"],
    priority: "critical",
    status: "active",
    owner_id: "BMD_Cyclone",
    created_at: "2024-01-14T02:30:00Z",
    updated_at: "2024-01-15T20:15:00Z",
    affected_people: 1200000,
    estimated_damage: "$2.1B+",
    audit_trail: [
      {
        action: "created",
        user_id: "BMD_Cyclone",
        timestamp: "2024-01-14T02:30:00Z",
        details: "Cyclone tracking initiated",
      },
      {
        action: "escalated",
        user_id: "emergency_bd",
        timestamp: "2024-01-14T18:00:00Z",
        details: "Mass evacuation orders issued",
      },
    ],
  },
  {
    id: "5",
    title: "Chilean Forest Fire Emergency",
    description:
      "Multiple forest fires burning across Valparaíso Region. High winds spreading flames rapidly, communities threatened, international aid requested.",
    location: {
      lat: -33.0472,
      lng: -71.6127,
      name: "Valparaíso, Chile",
      address: "Valparaíso Region, Chile",
    },
    tags: ["wildfire"],
    priority: "high",
    status: "active",
    owner_id: "CONAF_Chile",
    created_at: "2024-01-11T16:45:00Z",
    updated_at: "2024-01-15T22:30:00Z",
    affected_people: 45000,
    estimated_damage: "$850M+",
    audit_trail: [
      {
        action: "created",
        user_id: "CONAF_Chile",
        timestamp: "2024-01-11T16:45:00Z",
        details: "Multiple fire outbreak detected",
      },
      {
        action: "updated",
        user_id: "fire_chief_cl",
        timestamp: "2024-01-15T22:30:00Z",
        details: "International firefighting aircraft deployed",
      },
    ],
  },
  {
    id: "6",
    title: "Australian Flash Flood Crisis",
    description:
      "Severe flash flooding across Queensland following Tropical Cyclone. Record rainfall causing widespread evacuations, roads cut off.",
    location: {
      lat: -27.4705,
      lng: 153.026,
      name: "Brisbane, QLD",
      address: "Queensland, Australia",
    },
    tags: ["flood", "hurricane"],
    priority: "critical",
    status: "active",
    owner_id: "BOM_Australia",
    created_at: "2024-01-13T22:15:00Z",
    updated_at: "2024-01-15T14:45:00Z",
    affected_people: 180000,
    estimated_damage: "$1.2B+",
    audit_trail: [
      {
        action: "created",
        user_id: "BOM_Australia",
        timestamp: "2024-01-13T22:15:00Z",
        details: "Flash flood emergency declared",
      },
    ],
  },
  {
    id: "7",
    title: "Turkey Earthquake Aftershocks",
    description:
      "Continued seismic activity following February 2023 earthquakes. 6.4 magnitude aftershock causing additional damage to already weakened structures.",
    location: {
      lat: 37.0662,
      lng: 37.3833,
      name: "Hatay Province, Turkey",
      address: "Hatay, Turkey",
    },
    tags: ["earthquake"],
    priority: "medium",
    status: "monitoring",
    owner_id: "AFAD_Turkey",
    created_at: "2024-01-09T11:20:00Z",
    updated_at: "2024-01-15T09:10:00Z",
    affected_people: 85000,
    estimated_damage: "$450M",
    audit_trail: [
      {
        action: "created",
        user_id: "AFAD_Turkey",
        timestamp: "2024-01-09T11:20:00Z",
        details: "Significant aftershock monitoring initiated",
      },
    ],
  },
  {
    id: "8",
    title: "Philippines Volcano Alert",
    description:
      "Mount Mayon showing increased volcanic activity. Alert level raised, evacuation of danger zone recommended for 6km radius.",
    location: {
      lat: 13.2572,
      lng: 123.6856,
      name: "Albay Province, Philippines",
      address: "Bicol Region, Philippines",
    },
    tags: ["volcano"],
    priority: "high",
    status: "monitoring",
    owner_id: "PHIVOLCS",
    created_at: "2024-01-08T05:30:00Z",
    updated_at: "2024-01-15T17:25:00Z",
    affected_people: 54000,
    estimated_damage: "TBD",
    audit_trail: [
      {
        action: "created",
        user_id: "PHIVOLCS",
        timestamp: "2024-01-08T05:30:00Z",
        details: "Volcanic activity monitoring increased",
      },
    ],
  },
];

export const mockSocialMediaReports: SocialMediaReport[] = [
  {
    id: "sm1",
    disaster_id: "2",
    platform: "twitter",
    user: "@JapanWeatherJP",
    content:
      "🚨 Major 7.6 earthquake hit Noto Peninsula. Tsunami warnings active. Stay away from coastal areas! #NoToEarthquake #TsunamiAlert #Japan",
    sentiment: "urgent",
    verified: true,
    created_at: "2024-01-01T07:15:00Z",
    hashtags: ["NoToEarthquake", "TsunamiAlert", "Japan"],
    engagement: { likes: 15234, shares: 8945, replies: 3421 },
  },
  {
    id: "sm2",
    disaster_id: "4",
    platform: "twitter",
    user: "@CycloneTracker",
    content:
      "Cyclone Remal approaching Bangladesh coast. Massive evacuation underway. 1M+ people moved to safety. #CycloneRemal #Bangladesh #Emergency",
    sentiment: "informational",
    verified: true,
    created_at: "2024-01-14T16:30:00Z",
    hashtags: ["CycloneRemal", "Bangladesh", "Emergency"],
    engagement: { likes: 9876, shares: 5432, replies: 2156 },
  },
  {
    id: "sm3",
    disaster_id: "5",
    platform: "instagram",
    user: "@ChileFireDept",
    content:
      "Forest fires spreading rapidly in Valparaíso. International aircraft arriving to help. Please follow evacuation orders. #ChileFires #Valparaiso",
    sentiment: "urgent",
    verified: true,
    created_at: "2024-01-12T09:45:00Z",
    hashtags: ["ChileFires", "Valparaiso"],
    engagement: { likes: 7234, shares: 3456, replies: 1234 },
  },
  {
    id: "sm4",
    disaster_id: "6",
    platform: "twitter",
    user: "@QLDEmergency",
    content:
      "Flash flooding across Brisbane. Roads cut off. If it's flooded, forget it! Emergency services responding. #QLDFloods #BrisbaneFloods",
    sentiment: "urgent",
    verified: true,
    created_at: "2024-01-14T03:20:00Z",
    hashtags: ["QLDFloods", "BrisbaneFloods"],
    engagement: { likes: 12456, shares: 6789, replies: 2890 },
  },
];

export const mockResources: Resource[] = [
  {
    id: "r1",
    disaster_id: "2",
    name: "Kanazawa Emergency Shelter",
    type: "shelter",
    location: {
      lat: 36.5944,
      lng: 136.6256,
      name: "Kanazawa City",
      address: "Kanazawa, Ishikawa, Japan",
    },
    capacity: 800,
    available: 243,
    contact: "+81-76-220-2111",
    status: "operational",
    created_at: "2024-01-01T08:00:00Z",
    description:
      "Large capacity emergency shelter with medical facilities and hot meals for earthquake evacuees.",
  },
  {
    id: "r2",
    disaster_id: "4",
    name: "Chittagong Relief Distribution",
    type: "food",
    location: {
      lat: 22.3569,
      lng: 91.7832,
      name: "Chittagong, Bangladesh",
      address: "Chittagong Division, Bangladesh",
    },
    capacity: 2000,
    available: 1456,
    contact: "+880-31-123456",
    status: "operational",
    created_at: "2024-01-14T06:00:00Z",
    description:
      "Food distribution center providing emergency rations and clean water for cyclone evacuees.",
  },
  {
    id: "r3",
    disaster_id: "6",
    name: "Brisbane Emergency Medical Hub",
    type: "medical",
    location: {
      lat: -27.4698,
      lng: 153.0251,
      name: "Brisbane CBD",
      address: "Brisbane, Queensland, Australia",
    },
    capacity: 150,
    available: 34,
    contact: "+61-7-3234-5678",
    status: "overwhelmed",
    created_at: "2024-01-13T23:30:00Z",
    description:
      "Emergency medical facility treating flood-related injuries and providing emergency healthcare.",
  },
  {
    id: "r4",
    disaster_id: "5",
    name: "Valparaíso Firefighting Base",
    type: "transport",
    location: {
      lat: -33.0458,
      lng: -71.6197,
      name: "Valparaíso Airport",
      address: "Valparaíso Region, Chile",
    },
    capacity: 50,
    available: 18,
    contact: "+56-32-234567",
    status: "operational",
    created_at: "2024-01-11T20:00:00Z",
    description:
      "Firefighting aircraft coordination center with international support aircraft.",
  },
];

export const mockReports: Report[] = [
  {
    id: "rep1",
    disaster_id: "2",
    user_id: "earthquake_witness",
    content:
      "Severe building collapse in Wajima. People trapped under debris. Emergency crews needed immediately. Ground still shaking with aftershocks.",
    image_url: "https://example.com/noto-earthquake-damage.jpg",
    verification_status: "verified",
    created_at: "2024-01-01T07:45:00Z",
    location: {
      lat: 37.3994,
      lng: 136.8965,
      name: "Wajima City",
      address: "Wajima, Ishikawa, Japan",
    },
    priority: "critical",
  },
  {
    id: "rep2",
    disaster_id: "4",
    user_id: "cyclone_survivor",
    content:
      "Storm surge reached 3 meters height in our area. Many homes flooded. Need boats for rescue operations. Winds still very strong.",
    verification_status: "pending",
    created_at: "2024-01-14T18:20:00Z",
    location: {
      lat: 22.4569,
      lng: 91.7832,
      name: "Cox's Bazar",
      address: "Cox's Bazar, Bangladesh",
    },
    priority: "high",
  },
  {
    id: "rep3",
    disaster_id: "6",
    user_id: "brisbane_resident",
    content:
      "Flash flooding on main highway. Cars abandoned. Water level rising rapidly. Need helicopter evacuation for stranded motorists.",
    image_url: "https://example.com/brisbane-flood.jpg",
    verification_status: "verified",
    created_at: "2024-01-14T01:10:00Z",
    location: {
      lat: -27.4705,
      lng: 153.026,
      name: "M1 Highway Brisbane",
      address: "Pacific Motorway, Brisbane, QLD",
    },
    priority: "critical",
  },
];

export const mockOfficialUpdates: OfficialUpdate[] = [
  {
    id: "ou1",
    disaster_id: "2",
    source: "Japan Meteorological Agency",
    title: "Magnitude 7.6 Earthquake - Tsunami Warning Extended",
    content:
      "Major earthquake occurred at 16:10 JST. Tsunami warnings remain in effect for western coast of Honshu. Citizens advised to evacuate to higher ground immediately.",
    url: "https://www.jma.go.jp/en/earthquake-warning/noto-2024",
    published_at: "2024-01-01T07:20:00Z",
    severity: "critical",
  },
  {
    id: "ou2",
    disaster_id: "4",
    source: "Bangladesh Meteorological Department",
    title: "Cyclone Remal Makes Landfall - Emergency Response Activated",
    content:
      "Severe cyclonic storm Remal has made landfall. Maximum wind speeds 120 km/h. All coastal districts under evacuation orders. Relief operations commenced.",
    url: "https://www.bmd.gov.bd/cyclone-remal-emergency-2024",
    published_at: "2024-01-14T19:00:00Z",
    severity: "critical",
  },
  {
    id: "ou3",
    disaster_id: "5",
    source: "CONAF Chile",
    title: "Forest Fire Emergency - International Aid Arrives",
    content:
      "Multiple forest fires burning across Valparaíso Region. International firefighting aircraft from Argentina and USA now operational. Evacuation orders extended.",
    url: "https://www.conaf.cl/emergency/valparaiso-fires-2024",
    published_at: "2024-01-12T14:30:00Z",
    severity: "high",
  },
];

// Real-time simulation data
export const generateRealtimeUpdate = () => {
  const updateTypes = [
    "social_media",
    "resource_status",
    "official_update",
    "new_report",
  ];
  const type = updateTypes[Math.floor(Math.random() * updateTypes.length)];

  const baseUpdate = {
    id: `update_${Date.now()}`,
    timestamp: new Date().toISOString(),
    type,
  };

  switch (type) {
    case "social_media":
      return {
        ...baseUpdate,
        data: {
          platform: "twitter",
          user: `@emergency_${Math.floor(Math.random() * 1000)}`,
          content: "New emergency report detected...",
          disaster_id:
            mockDisasters[Math.floor(Math.random() * mockDisasters.length)].id,
        },
      };
    case "resource_status":
      return {
        ...baseUpdate,
        data: {
          resource_id:
            mockResources[Math.floor(Math.random() * mockResources.length)].id,
          status_change: "capacity_updated",
          new_available: Math.floor(Math.random() * 100),
        },
      };
    case "official_update":
      return {
        ...baseUpdate,
        data: {
          source: "Emergency Services",
          title: "Situation Update",
          disaster_id:
            mockDisasters[Math.floor(Math.random() * mockDisasters.length)].id,
        },
      };
    case "new_report":
      return {
        ...baseUpdate,
        data: {
          user_id: `responder_${Math.floor(Math.random() * 100)}`,
          priority: ["low", "medium", "high", "critical"][
            Math.floor(Math.random() * 4)
          ],
          disaster_id:
            mockDisasters[Math.floor(Math.random() * mockDisasters.length)].id,
        },
      };
    default:
      return baseUpdate;
  }
};
