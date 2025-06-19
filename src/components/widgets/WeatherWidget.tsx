import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Cloud,
  CloudRain,
  Sun,
  CloudSnow,
  Wind,
  Eye,
  Droplets,
  Thermometer,
  AlertTriangle,
} from "lucide-react";

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  visibility: number;
  pressure: number;
  alerts: string[];
  riskLevel: "low" | "medium" | "high" | "critical";
}

const mockWeatherData: WeatherData[] = [
  {
    location: "Manhattan, NYC",
    temperature: 72,
    condition: "Heavy Rain",
    humidity: 95,
    windSpeed: 45,
    visibility: 0.2,
    pressure: 28.95,
    alerts: ["Flash Flood Warning", "High Wind Advisory"],
    riskLevel: "critical",
  },
  {
    location: "Los Angeles, CA",
    temperature: 89,
    condition: "Smoky",
    humidity: 15,
    windSpeed: 25,
    visibility: 1.5,
    pressure: 29.85,
    alerts: ["Red Flag Warning", "Air Quality Alert"],
    riskLevel: "high",
  },
  {
    location: "Houston, TX",
    temperature: 84,
    condition: "Partly Cloudy",
    humidity: 78,
    windSpeed: 12,
    visibility: 8.0,
    pressure: 30.15,
    alerts: ["Hurricane Watch"],
    riskLevel: "medium",
  },
];

export function WeatherWidget() {
  const [currentLocationIndex, setCurrentLocationIndex] = useState(0);
  const [weather, setWeather] = useState<WeatherData>(mockWeatherData[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLocationIndex((prev) => {
        const newIndex = (prev + 1) % mockWeatherData.length;
        setWeather(mockWeatherData[newIndex]);
        return newIndex;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "heavy rain":
        return <CloudRain className="h-8 w-8 text-blue-500" />;
      case "smoky":
        return <Cloud className="h-8 w-8 text-gray-500" />;
      case "partly cloudy":
        return <Sun className="h-8 w-8 text-yellow-500" />;
      case "snow":
        return <CloudSnow className="h-8 w-8 text-blue-200" />;
      default:
        return <Sun className="h-8 w-8 text-yellow-500" />;
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400";
      default:
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400";
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            {getWeatherIcon(weather.condition)}
            Weather Conditions
          </span>
          <Badge variant="outline" className="text-xs">
            {currentLocationIndex + 1}/{mockWeatherData.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg">{weather.location}</h3>
            <p className="text-2xl font-bold">{weather.temperature}°F</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {weather.condition}
            </p>
          </div>
          <Badge
            className={getRiskColor(weather.riskLevel)}
            variant="secondary"
          >
            {weather.riskLevel.toUpperCase()} RISK
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Droplets className="h-4 w-4 text-blue-500" />
            <span>Humidity: {weather.humidity}%</span>
          </div>
          <div className="flex items-center gap-2">
            <Wind className="h-4 w-4 text-gray-500" />
            <span>Wind: {weather.windSpeed} mph</span>
          </div>
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-green-500" />
            <span>Visibility: {weather.visibility} mi</span>
          </div>
          <div className="flex items-center gap-2">
            <Thermometer className="h-4 w-4 text-orange-500" />
            <span>Pressure: {weather.pressure}"</span>
          </div>
        </div>

        {weather.alerts.length > 0 && (
          <div className="pt-3 border-t">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium">Active Alerts:</span>
            </div>
            <div className="space-y-1">
              {weather.alerts.map((alert, index) => (
                <Badge
                  key={index}
                  variant="destructive"
                  className="text-xs mr-1"
                >
                  {alert}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Animated progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-1 mt-4">
          <div
            className="bg-blue-600 h-1 rounded-full transition-all duration-[5000ms] ease-linear"
            style={{
              width: `${((currentLocationIndex + 1) / mockWeatherData.length) * 100}%`,
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
