import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getSocialMediaReports, getDisasters } from "@/lib/api";
import { SocialMediaReport, Disaster } from "@/lib/mock-data";
import { useRealtimeUpdates } from "@/hooks/use-realtime";
import {
  Radio,
  Search,
  Filter,
  TrendingUp,
  MessageSquare,
  Heart,
  Share,
  CheckCircle,
  AlertTriangle,
  Clock,
  MapPin,
  Hash,
  Loader2,
} from "lucide-react";

export default function SocialMedia() {
  const [reports, setReports] = useState<SocialMediaReport[]>([]);
  const [disasters, setDisasters] = useState<Disaster[]>([]);
  const [filteredReports, setFilteredReports] = useState<SocialMediaReport[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [platformFilter, setPlatformFilter] = useState<string>("all");
  const [sentimentFilter, setSentimentFilter] = useState<string>("all");
  const [verifiedFilter, setVerifiedFilter] = useState<string>("all");
  const [selectedDisaster, setSelectedDisaster] = useState<string>("all");
  const { updates } = useRealtimeUpdates();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterReports();
  }, [
    reports,
    searchTerm,
    platformFilter,
    sentimentFilter,
    verifiedFilter,
    selectedDisaster,
  ]);

  // Simulate new social media reports from real-time updates
  useEffect(() => {
    const socialMediaUpdates = updates.filter(
      (update) => update.type === "social_media",
    );
    if (socialMediaUpdates.length > 0) {
      // In a real app, you'd fetch the actual new reports
      // For demo, we'll just show that updates are happening
    }
  }, [updates]);

  const fetchData = async () => {
    try {
      const [disastersData] = await Promise.all([getDisasters()]);
      setDisasters(disastersData);

      // Fetch social media reports for all disasters
      const allReports: SocialMediaReport[] = [];
      for (const disaster of disastersData) {
        const disasterReports = await getSocialMediaReports(disaster.id);
        allReports.push(...disasterReports);
      }
      setReports(allReports);
    } catch (error) {
      console.error("Failed to fetch social media data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterReports = () => {
    let filtered = [...reports];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (report) =>
          report.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.hashtags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase()),
          ),
      );
    }

    // Platform filter
    if (platformFilter !== "all") {
      filtered = filtered.filter(
        (report) => report.platform === platformFilter,
      );
    }

    // Sentiment filter
    if (sentimentFilter !== "all") {
      filtered = filtered.filter(
        (report) => report.sentiment === sentimentFilter,
      );
    }

    // Verified filter
    if (verifiedFilter !== "all") {
      const isVerified = verifiedFilter === "verified";
      filtered = filtered.filter((report) => report.verified === isVerified);
    }

    // Disaster filter
    if (selectedDisaster !== "all") {
      filtered = filtered.filter(
        (report) => report.disaster_id === selectedDisaster,
      );
    }

    // Sort by creation time (newest first)
    filtered.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );

    setFilteredReports(filtered);
  };

  const getStats = () => {
    return {
      total: reports.length,
      urgent: reports.filter((r) => r.sentiment === "urgent").length,
      verified: reports.filter((r) => r.verified).length,
      help_requests: reports.filter((r) => r.sentiment === "request_help")
        .length,
    };
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Social Media Monitoring
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Real-time monitoring of social media reports and public sentiment
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard
          title="Total Reports"
          value={stats.total}
          icon={MessageSquare}
          color="blue"
        />
        <StatCard
          title="Urgent Reports"
          value={stats.urgent}
          icon={AlertTriangle}
          color="red"
        />
        <StatCard
          title="Verified"
          value={stats.verified}
          icon={CheckCircle}
          color="green"
        />
        <StatCard
          title="Help Requests"
          value={stats.help_requests}
          icon={Heart}
          color="orange"
        />
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search content, users, hashtags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label>Disaster</Label>
              <Select
                value={selectedDisaster}
                onValueChange={setSelectedDisaster}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Disasters</SelectItem>
                  {disasters.map((disaster) => (
                    <SelectItem key={disaster.id} value={disaster.id}>
                      {disaster.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Platform</Label>
              <Select value={platformFilter} onValueChange={setPlatformFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  <SelectItem value="twitter">Twitter</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="bluesky">Bluesky</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Sentiment</Label>
              <Select
                value={sentimentFilter}
                onValueChange={setSentimentFilter}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sentiments</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="request_help">Request Help</SelectItem>
                  <SelectItem value="offer_help">Offer Help</SelectItem>
                  <SelectItem value="informational">Informational</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Verification</Label>
              <Select value={verifiedFilter} onValueChange={setVerifiedFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Reports</SelectItem>
                  <SelectItem value="verified">Verified Only</SelectItem>
                  <SelectItem value="unverified">Unverified Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      <Tabs defaultValue="feed" className="space-y-4">
        <TabsList>
          <TabsTrigger value="feed">Live Feed</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
        </TabsList>

        <TabsContent value="feed" className="space-y-4">
          {filteredReports.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Radio className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No reports found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-center">
                  No social media reports match your current filters.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredReports.map((report) => (
                <SocialMediaCard key={report.id} report={report} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics">
          <AnalyticsView reports={filteredReports} />
        </TabsContent>

        <TabsContent value="trending">
          <TrendingView reports={filteredReports} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: number;
  icon: any;
  color: string;
}) {
  const colorClasses = {
    blue: "text-blue-500",
    red: "text-red-500",
    green: "text-green-500",
    orange: "text-orange-500",
  };

  return (
    <Card>
      <CardContent className="flex items-center justify-between p-6">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
        </div>
        <Icon
          className={`h-8 w-8 ${colorClasses[color as keyof typeof colorClasses]}`}
        />
      </CardContent>
    </Card>
  );
}

function SocialMediaCard({ report }: { report: SocialMediaReport }) {
  const sentimentColors = {
    urgent: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
    request_help:
      "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
    offer_help:
      "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
    informational:
      "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
  };

  const platformColors = {
    twitter: "bg-blue-500",
    facebook: "bg-blue-600",
    instagram: "bg-pink-500",
    bluesky: "bg-indigo-500",
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <Avatar className="h-10 w-10">
            <AvatarFallback
              className={`${platformColors[report.platform]} text-white`}
            >
              {report.user.slice(1, 3).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-gray-900 dark:text-white">
                  {report.user}
                </span>
                <Badge variant="outline" className="text-xs">
                  {report.platform}
                </Badge>
                {report.verified && (
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Badge
                  className={sentimentColors[report.sentiment]}
                  variant="secondary"
                >
                  {report.sentiment.replace("_", " ")}
                </Badge>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  <Clock className="h-3 w-3 inline mr-1" />
                  {new Date(report.created_at).toLocaleTimeString()}
                </span>
              </div>
            </div>

            <p className="text-gray-900 dark:text-white mb-3">
              {report.content}
            </p>

            {report.hashtags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {report.hashtags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center text-xs text-blue-600 dark:text-blue-400"
                  >
                    <Hash className="h-3 w-3 mr-0.5" />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {report.location && (
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-3">
                <MapPin className="h-4 w-4 mr-1" />
                {report.location.name}
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center">
                  <Heart className="h-4 w-4 mr-1" />
                  {report.engagement.likes}
                </span>
                <span className="flex items-center">
                  <Share className="h-4 w-4 mr-1" />
                  {report.engagement.shares}
                </span>
                <span className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  {report.engagement.replies}
                </span>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline">
                  Investigate
                </Button>
                <Button size="sm" variant="outline">
                  Flag
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AnalyticsView({ reports }: { reports: SocialMediaReport[] }) {
  const sentimentCounts = reports.reduce(
    (acc, report) => {
      acc[report.sentiment] = (acc[report.sentiment] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const platformCounts = reports.reduce(
    (acc, report) => {
      acc[report.platform] = (acc[report.platform] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Sentiment Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(sentimentCounts).map(([sentiment, count]) => (
              <div
                key={sentiment}
                className="flex justify-between items-center"
              >
                <span className="capitalize">
                  {sentiment.replace("_", " ")}
                </span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${(count / reports.length) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Platform Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(platformCounts).map(([platform, count]) => (
              <div key={platform} className="flex justify-between items-center">
                <span className="capitalize">{platform}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{
                        width: `${(count / reports.length) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function TrendingView({ reports }: { reports: SocialMediaReport[] }) {
  const hashtagCounts = reports
    .flatMap((report) => report.hashtags)
    .reduce(
      (acc, tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

  const topHashtags = Object.entries(hashtagCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Trending Hashtags
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topHashtags.map(([hashtag, count], index) => (
              <div
                key={hashtag}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <span className="font-bold text-lg text-gray-400">
                    #{index + 1}
                  </span>
                  <span className="font-medium">#{hashtag}</span>
                </div>
                <Badge variant="secondary">{count} posts</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Activity Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Social media activity over the last 24 hours
            </p>
            {/* This would typically show a chart */}
            <div className="h-32 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
              <span className="text-gray-500 dark:text-gray-400">
                Activity Chart Placeholder
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
