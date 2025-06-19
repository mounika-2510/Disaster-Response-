import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { isRealTimeDataAvailable } from "@/lib/real-time-api";
import {
  Satellite,
  Wifi,
  WifiOff,
  RefreshCw,
  Globe,
  Database,
  Clock,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

interface RealTimeIndicatorProps {
  onRefresh?: () => void;
  lastUpdate?: string;
  disasterCount?: number;
  isLoading?: boolean;
}

export function RealTimeIndicator({
  onRefresh,
  lastUpdate,
  disasterCount = 0,
  isLoading = false,
}: RealTimeIndicatorProps) {
  const [isRealTimeAvailable, setIsRealTimeAvailable] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    checkRealTimeStatus();
  }, []);

  const checkRealTimeStatus = async () => {
    setIsChecking(true);
    try {
      const available = await isRealTimeDataAvailable();
      setIsRealTimeAvailable(available);
    } catch (error) {
      setIsRealTimeAvailable(false);
    } finally {
      setIsChecking(false);
    }
  };

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    }
    checkRealTimeStatus();
  };

  return (
    <Card className="glass-card border-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-blue-500/5"></div>
      <CardContent className="p-4 relative">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-blue-500/10 backdrop-blur-sm animate-float">
              <Satellite className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Live Data Feed
              </h3>
              <p className="text-xs text-gray-500">
                Global disaster monitoring
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading || isChecking}
            className="bg-white/50 backdrop-blur-sm hover:bg-white/70"
          >
            <RefreshCw
              className={`h-4 w-4 mr-1 ${isLoading || isChecking ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>

        <div className="space-y-3">
          {/* Connection Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isRealTimeAvailable ? (
                <Wifi className="h-4 w-4 text-green-500" />
              ) : (
                <WifiOff className="h-4 w-4 text-red-500" />
              )}
              <span className="text-sm font-medium">
                {isChecking
                  ? "Checking..."
                  : isRealTimeAvailable
                    ? "Connected"
                    : "Offline"}
              </span>
            </div>
            <Badge
              variant={isRealTimeAvailable ? "default" : "destructive"}
              className={`text-xs ${isRealTimeAvailable ? "bg-green-500" : "bg-red-500"}`}
            >
              {isRealTimeAvailable ? "LIVE" : "DEMO"}
            </Badge>
          </div>

          {/* Data Sources */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1">
              <Globe className="h-3 w-3 text-blue-500" />
              <span className="text-gray-600 dark:text-gray-400">USGS</span>
              {isRealTimeAvailable && (
                <CheckCircle className="h-3 w-3 text-green-500" />
              )}
            </div>
            <div className="flex items-center gap-1">
              <Globe className="h-3 w-3 text-orange-500" />
              <span className="text-gray-600 dark:text-gray-400">NOAA</span>
              {isRealTimeAvailable && (
                <CheckCircle className="h-3 w-3 text-green-500" />
              )}
            </div>
            <div className="flex items-center gap-1">
              <Globe className="h-3 w-3 text-green-500" />
              <span className="text-gray-600 dark:text-gray-400">NASA</span>
              {isRealTimeAvailable && (
                <CheckCircle className="h-3 w-3 text-green-500" />
              )}
            </div>
            <div className="flex items-center gap-1">
              <Database className="h-3 w-3 text-purple-500" />
              <span className="text-gray-600 dark:text-gray-400">Local</span>
              <CheckCircle className="h-3 w-3 text-green-500" />
            </div>
          </div>

          {/* Stats */}
          <div className="pt-2 border-t border-gray-200/50">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1">
                <AlertTriangle className="h-3 w-3 text-red-500" />
                <span className="text-gray-600 dark:text-gray-400">
                  {disasterCount} Active Events
                </span>
              </div>
              {lastUpdate && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-gray-400" />
                  <span className="text-gray-500">
                    {new Date(lastUpdate).toLocaleTimeString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Real-time indicator */}
          {isRealTimeAvailable && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-xs font-medium text-green-700 dark:text-green-400">
                  Real-time data from USGS, NOAA & NASA
                </span>
              </div>
            </div>
          )}

          {!isRealTimeAvailable && !isChecking && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                <span className="text-xs font-medium text-yellow-700 dark:text-yellow-400">
                  Using demonstration data
                </span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
