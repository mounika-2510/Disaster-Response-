import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Activity,
  Radio,
  AlertTriangle,
  MapPin,
  Users,
  Truck,
  Heart,
  MessageSquare,
} from "lucide-react";

interface ActivityItem {
  id: string;
  type: "social_media" | "dispatch" | "resource" | "alert" | "rescue";
  user: string;
  action: string;
  location?: string;
  timestamp: string;
  priority?: "low" | "medium" | "high" | "critical";
  metadata?: any;
}

const activityTypes = {
  social_media: {
    icon: Radio,
    color: "text-purple-500",
    bgColor: "bg-purple-100 dark:bg-purple-900/20",
  },
  dispatch: {
    icon: AlertTriangle,
    color: "text-red-500",
    bgColor: "bg-red-100 dark:bg-red-900/20",
  },
  resource: {
    icon: MapPin,
    color: "text-blue-500",
    bgColor: "bg-blue-100 dark:bg-blue-900/20",
  },
  alert: {
    icon: AlertTriangle,
    color: "text-orange-500",
    bgColor: "bg-orange-100 dark:bg-orange-900/20",
  },
  rescue: {
    icon: Heart,
    color: "text-green-500",
    bgColor: "bg-green-100 dark:bg-green-900/20",
  },
};

const generateActivity = (): ActivityItem => {
  const activities = [
    {
      type: "social_media" as const,
      user: `@citizen${Math.floor(Math.random() * 1000)}`,
      action: "reported flooding on Main Street #emergency",
      location: "Downtown Area",
      priority: "high" as const,
    },
    {
      type: "dispatch" as const,
      user: "Unit-247",
      action: "responding to evacuation request",
      location: "Sector 7-Alpha",
      priority: "critical" as const,
    },
    {
      type: "resource" as const,
      user: "Supply-Coordinator",
      action: "deployed emergency shelter with 200 capacity",
      location: "Community Center",
      priority: "medium" as const,
    },
    {
      type: "rescue" as const,
      user: "Rescue-Team-3",
      action: "successfully evacuated 12 residents",
      location: "Riverside District",
      priority: "high" as const,
    },
    {
      type: "alert" as const,
      user: "Weather-Service",
      action: "issued flash flood warning",
      location: "Metropolitan Area",
      priority: "critical" as const,
    },
  ];

  const template = activities[Math.floor(Math.random() * activities.length)];
  return {
    id: `activity-${Date.now()}-${Math.random()}`,
    ...template,
    timestamp: new Date().toISOString(),
  };
};

export function LiveActivityFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  useEffect(() => {
    // Initialize with some activities
    const initialActivities = Array.from({ length: 8 }, () =>
      generateActivity(),
    );
    setActivities(initialActivities);

    // Add new activities periodically
    const interval = setInterval(() => {
      if (Math.random() > 0.4) {
        // 60% chance of new activity
        setActivities((prev) => {
          const newActivity = generateActivity();
          return [newActivity, ...prev.slice(0, 19)]; // Keep last 20 activities
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "critical":
        return "text-red-600 bg-red-50 dark:bg-red-900/20";
      case "high":
        return "text-orange-600 bg-orange-50 dark:bg-orange-900/20";
      case "medium":
        return "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20";
      case "low":
        return "text-green-600 bg-green-50 dark:bg-green-900/20";
      default:
        return "text-gray-600 bg-gray-50 dark:bg-gray-900/20";
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const seconds = Math.floor(
      (Date.now() - new Date(timestamp).getTime()) / 1000,
    );
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-green-500 animate-pulse" />
          Live Activity Feed
          <Badge variant="outline" className="ml-auto animate-pulse">
            LIVE
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 max-h-96 overflow-y-auto">
        {activities.map((activity) => {
          const typeConfig = activityTypes[activity.type];
          const Icon = typeConfig.icon;

          return (
            <div
              key={activity.id}
              className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors animate-slide-alert"
            >
              <div className={`p-2 rounded-full ${typeConfig.bgColor}`}>
                <Icon className={`h-4 w-4 ${typeConfig.color}`} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{activity.user}</span>
                  {activity.priority && (
                    <Badge
                      variant="secondary"
                      className={`text-xs ${getPriorityColor(activity.priority)}`}
                    >
                      {activity.priority}
                    </Badge>
                  )}
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {activity.action}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    {activity.location && (
                      <>
                        <MapPin className="h-3 w-3" />
                        <span>{activity.location}</span>
                      </>
                    )}
                  </div>
                  <span>{getTimeAgo(activity.timestamp)}</span>
                </div>
              </div>
            </div>
          );
        })}

        {activities.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No recent activity</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
