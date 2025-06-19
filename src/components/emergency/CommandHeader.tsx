import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Shield,
  Radio,
  Satellite,
  Clock,
  MapPin,
  Users,
  Zap,
} from "lucide-react";

export function CommandHeader() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [networkStatus, setNetworkStatus] = useState<
    "secure" | "monitoring" | "alert"
  >("secure");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const statusCycle = setInterval(() => {
      const statuses: ("secure" | "monitoring" | "alert")[] = [
        "secure",
        "monitoring",
        "alert",
      ];
      setNetworkStatus(statuses[Math.floor(Math.random() * statuses.length)]);
    }, 8000);

    return () => clearInterval(statusCycle);
  }, []);

  const statusConfig = {
    secure: {
      color: "text-green-400",
      bg: "bg-green-500/20",
      label: "SECURE",
      icon: Shield,
    },
    monitoring: {
      color: "text-yellow-400",
      bg: "bg-yellow-500/20",
      label: "MONITORING",
      icon: Radio,
    },
    alert: {
      color: "text-red-400",
      bg: "bg-red-500/20",
      label: "ALERT",
      icon: Satellite,
    },
  };

  const config = statusConfig[networkStatus];
  const StatusIcon = config.icon;

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left side - System Identity */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-white font-bold text-lg leading-none">
                  DRCP
                </h1>
                <p className="text-slate-400 text-xs leading-none">
                  Disaster Response Command
                </p>
              </div>
            </div>

            {/* Network Status */}
            <div className="flex items-center space-x-2">
              <div
                className={cn(
                  "flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-mono",
                  config.bg,
                )}
              >
                <StatusIcon className={cn("h-3 w-3", config.color)} />
                <span className={config.color}>{config.label}</span>
              </div>
            </div>
          </div>

          {/* Center - Current Operation Status */}
          <div className="hidden md:flex items-center space-x-6 text-slate-300">
            <div className="flex items-center space-x-1 text-xs">
              <Users className="h-3 w-3" />
              <span>23 Active Units</span>
            </div>
            <div className="flex items-center space-x-1 text-xs">
              <MapPin className="h-3 w-3" />
              <span>Multi-Region</span>
            </div>
            <div className="flex items-center space-x-1 text-xs">
              <Zap className="h-3 w-3 text-green-400" />
              <span>All Systems Operational</span>
            </div>
          </div>

          {/* Right side - Time and Classification */}
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-white font-mono text-sm">
                {currentTime.toLocaleTimeString("en-US", {
                  hour12: false,
                  timeZoneName: "short",
                })}
              </div>
              <div className="text-slate-400 text-xs">
                {currentTime.toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </div>
            </div>

            <Badge
              variant="outline"
              className="border-red-500 text-red-400 bg-red-500/10 font-mono text-xs"
            >
              CLASSIFIED
            </Badge>
          </div>
        </div>

        {/* Bottom row - Quick metrics */}
        <div className="mt-3 pt-3 border-t border-slate-700">
          <div className="grid grid-cols-4 gap-4 text-xs">
            <div className="text-center">
              <div className="text-red-400 font-mono font-bold">3</div>
              <div className="text-slate-400">Critical</div>
            </div>
            <div className="text-center">
              <div className="text-orange-400 font-mono font-bold">12</div>
              <div className="text-slate-400">Active</div>
            </div>
            <div className="text-center">
              <div className="text-green-400 font-mono font-bold">156</div>
              <div className="text-slate-400">Resources</div>
            </div>
            <div className="text-center">
              <div className="text-blue-400 font-mono font-bold">23k</div>
              <div className="text-slate-400">People Safe</div>
            </div>
          </div>
        </div>
      </div>

      {/* Animated bottom border */}
      <div className="h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent animate-pulse" />
    </div>
  );
}
