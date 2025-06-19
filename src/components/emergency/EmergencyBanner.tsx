import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { AlertTriangle, X, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmergencyAlert {
  id: string;
  message: string;
  priority: "critical" | "high" | "medium";
  timestamp: string;
  location?: string;
}

export function EmergencyBanner() {
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([
    {
      id: "alert-1",
      message:
        "FLASH FLOOD WARNING: Manhattan area - immediate evacuation recommended for zones A-C",
      priority: "critical",
      timestamp: new Date().toISOString(),
      location: "Manhattan, NYC",
    },
  ]);
  const [currentAlertIndex, setCurrentAlertIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (alerts.length > 1) {
      const interval = setInterval(() => {
        setCurrentAlertIndex((prev) => (prev + 1) % alerts.length);
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [alerts.length]);

  // Simulate new emergency alerts
  useEffect(() => {
    const addRandomAlert = () => {
      const randomAlerts = [
        {
          message:
            "EARTHQUAKE DETECTED: 4.2 magnitude - structural assessment in progress",
          priority: "high" as const,
          location: "Los Angeles, CA",
        },
        {
          message:
            "WILDFIRE UPDATE: Containment increased to 45% - evacuation orders lifted for zone B",
          priority: "medium" as const,
          location: "Riverside County, CA",
        },
        {
          message:
            "SEVERE WEATHER: Tornado watch issued - seek immediate shelter",
          priority: "critical" as const,
          location: "Oklahoma City, OK",
        },
      ];

      if (Math.random() > 0.7 && alerts.length < 3) {
        const randomAlert =
          randomAlerts[Math.floor(Math.random() * randomAlerts.length)];
        const newAlert: EmergencyAlert = {
          id: `alert-${Date.now()}`,
          message: randomAlert.message,
          priority: randomAlert.priority,
          timestamp: new Date().toISOString(),
          location: randomAlert.location,
        };
        setAlerts((prev) => [newAlert, ...prev]);
      }
    };

    const interval = setInterval(addRandomAlert, 15000);
    return () => clearInterval(interval);
  }, [alerts.length]);

  if (!isVisible || alerts.length === 0) return null;

  const currentAlert = alerts[currentAlertIndex];
  const priorityConfig = {
    critical: {
      bg: "bg-red-600",
      text: "text-white",
      animation: "animate-pulse-emergency",
      icon: AlertTriangle,
    },
    high: {
      bg: "bg-orange-500",
      text: "text-white",
      animation: "animate-bounce-emergency",
      icon: AlertTriangle,
    },
    medium: {
      bg: "bg-yellow-500",
      text: "text-gray-900",
      animation: "",
      icon: Megaphone,
    },
  };

  const config = priorityConfig[currentAlert.priority];
  const Icon = config.icon;

  return (
    <div
      className={cn("relative overflow-hidden", config.bg, config.animation)}
    >
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="h-full w-full bg-gradient-to-r from-transparent via-white to-transparent animate-pulse" />
      </div>

      <div className="relative flex items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <Icon
            className={cn(
              "h-6 w-6 flex-shrink-0",
              config.text,
              config.animation,
            )}
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <span
                className={cn(
                  "text-xs font-bold uppercase tracking-wider",
                  config.text,
                )}
              >
                {currentAlert.priority} ALERT
              </span>
              {currentAlert.location && (
                <span className={cn("text-xs", config.text, "opacity-80")}>
                  • {currentAlert.location}
                </span>
              )}
            </div>
            <p className={cn("text-sm font-medium truncate", config.text)}>
              {currentAlert.message}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 flex-shrink-0">
          {alerts.length > 1 && (
            <div className={cn("text-xs", config.text, "opacity-80")}>
              {currentAlertIndex + 1} of {alerts.length}
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(false)}
            className={cn("hover:bg-white/20", config.text)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Progress bar for alert rotation */}
      {alerts.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
          <div
            className="h-full bg-white/60 transition-all duration-[8000ms] ease-linear"
            style={{
              width: `${((currentAlertIndex + 1) / alerts.length) * 100}%`,
            }}
          />
        </div>
      )}
    </div>
  );
}
