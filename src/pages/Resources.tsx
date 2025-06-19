import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { getResourcesByDisaster, getResourcesNearLocation } from "@/lib/api";
import { Resource, mockDisasters } from "@/lib/mock-data";
import {
  MapPin,
  Building2,
  Ambulance,
  Utensils,
  Droplets,
  Truck,
  Search,
  Filter,
  Users,
  Phone,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Navigation,
  Loader2,
} from "lucide-react";

export default function Resources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedDisaster, setSelectedDisaster] = useState<string>("all");
  const [locationSearch, setLocationSearch] = useState({
    lat: "",
    lng: "",
    radius: "10",
  });

  useEffect(() => {
    fetchResources();
  }, []);

  useEffect(() => {
    filterResources();
  }, [resources, searchTerm, typeFilter, statusFilter, selectedDisaster]);

  const fetchResources = async () => {
    try {
      // Fetch resources for all disasters
      const allResources: Resource[] = [];
      for (const disaster of mockDisasters) {
        const disasterResources = await getResourcesByDisaster(disaster.id);
        allResources.push(...disasterResources);
      }
      setResources(allResources);
    } catch (error) {
      console.error("Failed to fetch resources:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterResources = () => {
    let filtered = [...resources];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (resource) =>
          resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          resource.location.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          resource.description.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter((resource) => resource.type === typeFilter);
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (resource) => resource.status === statusFilter,
      );
    }

    // Disaster filter
    if (selectedDisaster !== "all") {
      filtered = filtered.filter(
        (resource) => resource.disaster_id === selectedDisaster,
      );
    }

    setFilteredResources(filtered);
  };

  const handleLocationSearch = async () => {
    if (!locationSearch.lat || !locationSearch.lng) return;

    setLoading(true);
    try {
      const nearbyResources = await getResourcesNearLocation(
        parseFloat(locationSearch.lat),
        parseFloat(locationSearch.lng),
        parseFloat(locationSearch.radius),
      );
      setFilteredResources(nearbyResources);
    } catch (error) {
      console.error("Failed to search by location:", error);
    } finally {
      setLoading(false);
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "shelter":
        return Building2;
      case "medical":
        return Ambulance;
      case "food":
        return Utensils;
      case "water":
        return Droplets;
      case "transport":
        return Truck;
      default:
        return MapPin;
    }
  };

  const getResourceStats = () => {
    const stats = {
      total: resources.length,
      operational: resources.filter((r) => r.status === "operational").length,
      overwhelmed: resources.filter((r) => r.status === "overwhelmed").length,
      closed: resources.filter((r) => r.status === "closed").length,
      totalCapacity: resources.reduce((sum, r) => sum + r.capacity, 0),
      totalAvailable: resources.reduce((sum, r) => sum + r.available, 0),
    };
    return stats;
  };

  const stats = getResourceStats();

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
          Resource Mapping & Management
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Real-time resource tracking with geospatial search capabilities
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <ResourceStatCard
          title="Total Resources"
          total={stats.total}
          available={stats.operational}
          icon={MapPin}
          color="blue"
        />
        <ResourceStatCard
          title="Shelters"
          total={resources.filter((r) => r.type === "shelter").length}
          available={
            resources.filter(
              (r) => r.type === "shelter" && r.status === "operational",
            ).length
          }
          icon={Building2}
          color="blue"
        />
        <ResourceStatCard
          title="Medical"
          total={resources.filter((r) => r.type === "medical").length}
          available={
            resources.filter(
              (r) => r.type === "medical" && r.status === "operational",
            ).length
          }
          icon={Ambulance}
          color="red"
        />
        <ResourceStatCard
          title="Food Centers"
          total={resources.filter((r) => r.type === "food").length}
          available={
            resources.filter(
              (r) => r.type === "food" && r.status === "operational",
            ).length
          }
          icon={Utensils}
          color="green"
        />
        <ResourceStatCard
          title="Water Supply"
          total={resources.filter((r) => r.type === "water").length}
          available={
            resources.filter(
              (r) => r.type === "water" && r.status === "operational",
            ).length
          }
          icon={Droplets}
          color="cyan"
        />
        <ResourceStatCard
          title="Transport"
          total={resources.filter((r) => r.type === "transport").length}
          available={
            resources.filter(
              (r) => r.type === "transport" && r.status === "operational",
            ).length
          }
          icon={Truck}
          color="purple"
        />
      </div>

      {/* Filters & Geospatial Search */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="search">Search Resources</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search by name, location, description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label>Type</Label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="shelter">Shelter</SelectItem>
                    <SelectItem value="medical">Medical</SelectItem>
                    <SelectItem value="food">Food</SelectItem>
                    <SelectItem value="water">Water</SelectItem>
                    <SelectItem value="transport">Transport</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="operational">Operational</SelectItem>
                    <SelectItem value="overwhelmed">Overwhelmed</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
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
                    {mockDisasters.map((disaster) => (
                      <SelectItem key={disaster.id} value={disaster.id}>
                        {disaster.title.substring(0, 20)}...
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Navigation className="h-5 w-5" />
              Geospatial Search
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label htmlFor="lat">Latitude</Label>
                <Input
                  id="lat"
                  placeholder="40.7128"
                  value={locationSearch.lat}
                  onChange={(e) =>
                    setLocationSearch((prev) => ({
                      ...prev,
                      lat: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="lng">Longitude</Label>
                <Input
                  id="lng"
                  placeholder="-74.0060"
                  value={locationSearch.lng}
                  onChange={(e) =>
                    setLocationSearch((prev) => ({
                      ...prev,
                      lng: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="radius">Radius (km)</Label>
                <Input
                  id="radius"
                  placeholder="10"
                  value={locationSearch.radius}
                  onChange={(e) =>
                    setLocationSearch((prev) => ({
                      ...prev,
                      radius: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <Button
              onClick={handleLocationSearch}
              className="w-full"
              disabled={!locationSearch.lat || !locationSearch.lng}
            >
              <MapPin className="h-4 w-4 mr-2" />
              Search by Location (ST_DWithin)
            </Button>

            <div className="text-xs text-gray-500 space-y-1">
              <p>• Uses Supabase geospatial queries</p>
              <p>• ST_DWithin for radius-based search</p>
              <p>• Real-time resource availability</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource) => (
          <ResourceCard key={resource.id} resource={resource} />
        ))}
      </div>

      {filteredResources.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MapPin className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No resources found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-center">
              No resources match your current search criteria. Try adjusting
              your filters or search location.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function ResourceStatCard({
  title,
  total,
  available,
  icon: Icon,
  color,
}: {
  title: string;
  total: number;
  available: number;
  icon: any;
  color: string;
}) {
  const colorClasses = {
    blue: "text-blue-500 bg-blue-50 dark:bg-blue-900/20",
    red: "text-red-500 bg-red-50 dark:bg-red-900/20",
    green: "text-green-500 bg-green-50 dark:bg-green-900/20",
    cyan: "text-cyan-500 bg-cyan-50 dark:bg-cyan-900/20",
    purple: "text-purple-500 bg-purple-50 dark:bg-purple-900/20",
    orange: "text-orange-500 bg-orange-50 dark:bg-orange-900/20",
  };

  const utilizationPercentage = total > 0 ? (available / total) * 100 : 0;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div
            className={`p-2 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {available}/{total}
            </p>
            <p className="text-xs text-gray-500">operational</p>
          </div>
        </div>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
          {title}
        </p>
        <Progress value={utilizationPercentage} className="h-2" />
      </CardContent>
    </Card>
  );
}

function ResourceCard({ resource }: { resource: Resource }) {
  const Icon = getResourceIcon(resource.type);

  const statusConfig = {
    operational: {
      color: "text-green-600",
      bg: "bg-green-100 dark:bg-green-900/20",
      icon: CheckCircle,
    },
    overwhelmed: {
      color: "text-yellow-600",
      bg: "bg-yellow-100 dark:bg-yellow-900/20",
      icon: AlertTriangle,
    },
    closed: {
      color: "text-red-600",
      bg: "bg-red-100 dark:bg-red-900/20",
      icon: XCircle,
    },
  };

  const config = statusConfig[resource.status];
  const StatusIcon = config.icon;
  const utilizationPercentage =
    resource.capacity > 0
      ? ((resource.capacity - resource.available) / resource.capacity) * 100
      : 0;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg ${getResourceTypeColor(resource.type)}`}
            >
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">
                {resource.name}
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                {resource.type} facility
              </p>
            </div>
          </div>
          <Badge className={`${config.bg} ${config.color}`} variant="secondary">
            <StatusIcon className="h-3 w-3 mr-1" />
            {resource.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {resource.description}
        </p>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span>{resource.location.name}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-gray-500" />
            <span>{resource.contact}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-gray-500" />
            <span>
              Added {new Date(resource.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Capacity Utilization</span>
            <span>
              {resource.capacity - resource.available}/{resource.capacity} (
              {Math.round(utilizationPercentage)}%)
            </span>
          </div>
          <Progress value={utilizationPercentage} className="h-2" />
          <div className="flex justify-between text-xs text-gray-500">
            <span>{resource.available} available</span>
            <span>{resource.capacity} total capacity</span>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button size="sm" variant="outline" className="flex-1">
            View Details
          </Button>
          <Button size="sm" className="flex-1">
            Contact
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function getResourceIcon(type: string) {
  switch (type) {
    case "shelter":
      return Building2;
    case "medical":
      return Ambulance;
    case "food":
      return Utensils;
    case "water":
      return Droplets;
    case "transport":
      return Truck;
    default:
      return MapPin;
  }
}

function getResourceTypeColor(type: string) {
  switch (type) {
    case "shelter":
      return "text-blue-500 bg-blue-50 dark:bg-blue-900/20";
    case "medical":
      return "text-red-500 bg-red-50 dark:bg-red-900/20";
    case "food":
      return "text-green-500 bg-green-50 dark:bg-green-900/20";
    case "water":
      return "text-cyan-500 bg-cyan-50 dark:bg-cyan-900/20";
    case "transport":
      return "text-purple-500 bg-purple-50 dark:bg-purple-900/20";
    default:
      return "text-gray-500 bg-gray-50 dark:bg-gray-900/20";
  }
}
