import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useSystemStats, useRealtimeUpdates } from "@/hooks/use-realtime";
import { getDisasters, getSocialMediaReports } from "@/lib/api";
import { Disaster, SocialMediaReport } from "@/lib/mock-data";
import { WeatherWidget } from "@/components/widgets/WeatherWidget";
import { LiveActivityFeed } from "@/components/widgets/LiveActivityFeed";
import { RealTimeIndicator } from "@/components/widgets/RealTimeIndicator";
import {
  AlertTriangle,
  Users,
  MapPin,
  Activity,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Radio,
  FileText,
  Zap,
  Globe,
  Eye,
} from "lucide-react";

export default function Dashboard() {
  const { stats, loading: statsLoading } = useSystemStats();
  const { updates, isConnected } = useRealtimeUpdates();
  const [disasters, setDisasters] = useState<Disaster[]>([]);
  const [recentReports, setRecentReports] = useState<SocialMediaReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (useRealTime = true) => {
    try {
      console.log("🔄 Fetching dashboard data...");
      const [disastersData, reportsData] = await Promise.all([
        getDisasters({ status: "active", useRealTime }),
        getSocialMediaReports("1"), // Get reports for first disaster as example
      ]);
      setDisasters(disastersData);
      setRecentReports(reportsData.slice(0, 5));
      console.log(
        `✅ Dashboard loaded with ${disastersData.length} disasters (Real-time: ${useRealTime})`,
      );
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRealTimeRefresh = () => {
    setLoading(true);
    fetchData(true);
  };

  const criticalDisasters = disasters.filter((d) => d.priority === "critical");
  const activeDisasters = disasters.filter((d) => d.status === "active");

  if (loading || statsLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200/30 pb-6 mb-6">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/5 via-orange-500/5 to-red-600/5 rounded-lg -m-4"></div>
          <div className="relative">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-red-600 via-orange-500 to-red-600 bg-clip-text text-transparent">
              Emergency Response Command Center
            </h1>
            <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">
              Real-time monitoring and coordination of global disaster response
              activities
            </p>
            <div className="mt-4 flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-gray-600 dark:text-gray-400">
                  System Operational
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                <span className="text-gray-600 dark:text-gray-400">
                  Global Coverage Active
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></div>
                <span className="text-gray-600 dark:text-gray-400">
                  {stats?.activeDisasters || 0} Active Incidents
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active Disasters"
          value={stats?.activeDisasters || 0}
          icon={AlertTriangle}
          color="red"
          change="+2"
          changeLabel="from yesterday"
        />
        <StatCard
          title="People Affected"
          value={stats?.totalAffectedPeople?.toLocaleString() || "0"}
          icon={Users}
          color="orange"
          change="+1.2k"
          changeLabel="last 24h"
        />
        <StatCard
          title="Resources Deployed"
          value={stats?.operationalResources || 0}
          icon={MapPin}
          color="blue"
          change="+5"
          changeLabel="new this week"
        />
        <StatCard
          title="Verified Reports"
          value={stats?.verifiedReports || 0}
          icon={CheckCircle}
          color="green"
          change="+12"
          changeLabel="pending review"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Critical Alerts */}
        <div className="lg:col-span-2">
          <Card className="glass-card border-0 shadow-emergency overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-orange-500/5"></div>
            <CardHeader className="flex flex-row items-center justify-between relative">
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-red-500/10 backdrop-blur-sm animate-bounce-emergency">
                  <AlertTriangle className="h-6 w-6 text-red-500" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                  Critical Situations
                </span>
              </CardTitle>
              <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0 shadow-lg animate-pulse-emergency px-4 py-2">
                {criticalDisasters.length} ACTIVE ALERTS
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4 relative">
              {criticalDisasters.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No critical situations at this time
                </p>
              ) : (
                criticalDisasters.map((disaster) => (
                  <DisasterCard key={disaster.id} disaster={disaster} />
                ))
              )}
              <div className="pt-4 border-t">
                <Link to="/disasters">
                  <Button variant="outline" className="w-full">
                    View All Disasters
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Real-time Data Status */}
        <div>
          <RealTimeIndicator
            onRefresh={handleRealTimeRefresh}
            lastUpdate={new Date().toISOString()}
            disasterCount={disasters.length}
            isLoading={loading}
          />
        </div>

        {/* Weather Conditions */}
        <div>
          <WeatherWidget />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Activity Feed */}
        <div>
          <LiveActivityFeed />
        </div>

        {/* Recent Social Media Reports */}
        <Card className="glass-card border-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5"></div>
          <CardHeader className="relative">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-purple-500/10 backdrop-blur-sm animate-float">
                <Radio className="h-6 w-6 text-purple-500" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Social Media Intelligence
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 relative">
            {recentReports.map((report) => (
              <SocialMediaItem key={report.id} report={report} />
            ))}
            <div className="pt-4 border-t">
              <Link to="/social-media">
                <Button variant="outline" className="w-full">
                  View Social Media Feed
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* System Performance & Network Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-green-500" />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-1">
                  <Globe className="h-3 w-3" />
                  Emergency Network
                </span>
                <span className="text-green-600 font-medium">Online</span>
              </div>
              <Progress value={100} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Response Time</span>
                <span className="text-green-600">142ms</span>
              </div>
              <Progress value={92} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Data Accuracy</span>
                <span className="text-green-600">98.3%</span>
              </div>
              <Progress value={98} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>API Health</span>
                <span className="text-green-600">All Systems Go</span>
              </div>
              <Progress value={100} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Resource Load</span>
                <span className="text-yellow-600">67%</span>
              </div>
              <Progress value={67} className="h-2" />
            </div>
            <div className="pt-2 border-t">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Last updated</span>
                <span>{new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  color,
  change,
  changeLabel,
}: {
  title: string;
  value: string | number;
  icon: any;
  color: string;
  change: string;
  changeLabel: string;
}) {
  const colorClasses = {
    red: "text-red-500",
    orange: "text-orange-500",
    blue: "text-blue-500",
    green: "text-green-500",
  };

  const gradientClasses = {
    red: "from-red-500/10 to-red-600/5",
    orange: "from-orange-500/10 to-orange-600/5",
    blue: "from-blue-500/10 to-blue-600/5",
    green: "from-green-500/10 to-green-600/5",
  };

  return (
    <Card className="glass-card border-0 hover:shadow-glass transition-all duration-500 hover:scale-105 overflow-hidden group">
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradientClasses[color as keyof typeof gradientClasses]} opacity-50 group-hover:opacity-70 transition-opacity`}
      ></div>
      <CardContent className="p-6 relative">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
              {title}
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2 group-hover:scale-110 transition-transform">
              {value}
            </p>
            <div className="flex items-center gap-1">
              <span
                className={`text-sm font-semibold ${color === "red" ? "text-red-600" : "text-green-600"}`}
              >
                {change}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {changeLabel}
              </span>
            </div>
          </div>
          <div
            className={`p-3 rounded-full bg-white/20 backdrop-blur-sm group-hover:bg-white/30 transition-colors animate-float`}
          >
            <Icon
              className={`h-8 w-8 ${colorClasses[color as keyof typeof colorClasses]} drop-shadow-lg`}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function DisasterCard({ disaster }: { disaster: Disaster }) {
  const priorityStyles = {
    critical: {
      bg: "bg-gradient-to-r from-red-500 to-red-600",
      border: "border-red-500/30",
      glow: "shadow-red-500/20",
      pulse: "animate-pulse-emergency",
    },
    high: {
      bg: "bg-gradient-to-r from-orange-500 to-orange-600",
      border: "border-orange-500/30",
      glow: "shadow-orange-500/20",
      pulse: "",
    },
    medium: {
      bg: "bg-gradient-to-r from-yellow-500 to-yellow-600",
      border: "border-yellow-500/30",
      glow: "shadow-yellow-500/20",
      pulse: "",
    },
    low: {
      bg: "bg-gradient-to-r from-green-500 to-green-600",
      border: "border-green-500/30",
      glow: "shadow-green-500/20",
      pulse: "",
    },
  };

  const style = priorityStyles[disaster.priority];

  return (
    <div
      className={`glass-card hover:shadow-emergency transition-all duration-500 hover:scale-[1.02] p-5 border-l-4 ${style.border} ${style.glow} ${style.pulse} group`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <h4 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-red-600 transition-colors">
              {disaster.title}
            </h4>
            <Badge
              className={`${style.bg} text-white border-0 shadow-lg ${style.pulse}`}
              variant="secondary"
            >
              {disaster.priority.toUpperCase()}
            </Badge>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
            {disaster.description.substring(0, 120)}...
          </p>

          <div className="grid grid-cols-1 gap-2 text-xs">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <MapPin className="h-4 w-4 text-blue-500" />
              <span className="font-medium">{disaster.location.name}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Users className="h-4 w-4 text-orange-500" />
              <span>
                {disaster.affected_people.toLocaleString()} people affected
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Clock className="h-4 w-4 text-green-500" />
              <span>
                {new Date(disaster.created_at).toLocaleDateString()} •{" "}
                {disaster.estimated_damage}
              </span>
            </div>
          </div>
        </div>

        <div className="ml-4 flex flex-col gap-2">
          <Link to={`/disasters`}>
            <Button
              size="sm"
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <Eye className="h-4 w-4 mr-1" />
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function UpdateItem({ update }: { update: any }) {
  const getUpdateIcon = (type: string) => {
    switch (type) {
      case "social_media":
        return <Radio className="h-4 w-4 text-purple-500" />;
      case "resource_status":
        return <MapPin className="h-4 w-4 text-blue-500" />;
      case "official_update":
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case "new_report":
        return <FileText className="h-4 w-4 text-green-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getUpdateMessage = (update: any) => {
    switch (update.type) {
      case "social_media":
        return `New ${update.data.platform} report detected`;
      case "resource_status":
        return "Resource capacity updated";
      case "official_update":
        return `Official update from ${update.data.source}`;
      case "new_report":
        return `New ${update.data.priority} priority report`;
      default:
        return "System update";
    }
  };

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
      {getUpdateIcon(update.type)}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          {getUpdateMessage(update)}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {new Date(update.timestamp).toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}

function SocialMediaItem({ report }: { report: SocialMediaReport }) {
  const sentimentStyles = {
    urgent: {
      color: "text-red-600",
      bg: "bg-red-500/10",
      border: "border-red-500/20",
    },
    informational: {
      color: "text-blue-600",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    offer_help: {
      color: "text-green-600",
      bg: "bg-green-500/10",
      border: "border-green-500/20",
    },
    request_help: {
      color: "text-orange-600",
      bg: "bg-orange-500/10",
      border: "border-orange-500/20",
    },
  };

  const style = sentimentStyles[report.sentiment];

  return (
    <div
      className={`p-4 glass-card border-l-4 ${style.border} ${style.bg} hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-sm text-gray-900 dark:text-white">
            {report.user}
          </span>
          <Badge
            variant="outline"
            className="text-xs bg-white/50 backdrop-blur-sm"
          >
            {report.platform}
          </Badge>
          {report.verified && (
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-green-500 animate-pulse" />
              <span className="text-xs text-green-600 font-medium">
                Verified
              </span>
            </div>
          )}
        </div>
        <Badge
          className={`text-xs ${style.color} ${style.bg} border-0 font-bold uppercase tracking-wide`}
        >
          {report.sentiment.replace("_", " ")}
        </Badge>
      </div>

      <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
        {report.content}
      </p>

      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500 font-medium">
          {new Date(report.created_at).toLocaleTimeString()}
        </span>
        <div className="flex gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1 hover:text-red-500 transition-colors">
            <span>❤️</span>
            <span className="font-medium">{report.engagement.likes}</span>
          </div>
          <div className="flex items-center gap-1 hover:text-blue-500 transition-colors">
            <span>🔄</span>
            <span className="font-medium">{report.engagement.shares}</span>
          </div>
          <div className="flex items-center gap-1 hover:text-green-500 transition-colors">
            <span>💬</span>
            <span className="font-medium">{report.engagement.replies}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
