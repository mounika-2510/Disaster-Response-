import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getDisasters,
  createDisaster,
  extractLocationFromText,
  geocodeLocation,
  deleteDisaster,
} from "@/lib/api";
import { Disaster, DisasterType, Priority } from "@/lib/mock-data";
import {
  AlertTriangle,
  Plus,
  MapPin,
  Users,
  Clock,
  Filter,
  Search,
  Loader2,
  CheckCircle,
  AlertCircle,
  Eye,
  Trash2,
  Edit,
} from "lucide-react";

export default function Disasters() {
  const [disasters, setDisasters] = useState<Disaster[]>([]);
  const [filteredDisasters, setFilteredDisasters] = useState<Disaster[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  useEffect(() => {
    fetchDisasters();
  }, []);

  useEffect(() => {
    filterDisasters();
  }, [disasters, searchTerm, statusFilter, priorityFilter, typeFilter]);

  const fetchDisasters = async () => {
    try {
      const data = await getDisasters();
      setDisasters(data);
    } catch (error) {
      console.error("Failed to fetch disasters:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterDisasters = () => {
    let filtered = [...disasters];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (disaster) =>
          disaster.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          disaster.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          disaster.location.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()),
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (disaster) => disaster.status === statusFilter,
      );
    }

    // Priority filter
    if (priorityFilter !== "all") {
      filtered = filtered.filter(
        (disaster) => disaster.priority === priorityFilter,
      );
    }

    // Type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter((disaster) =>
        disaster.tags.includes(typeFilter as DisasterType),
      );
    }

    setFilteredDisasters(filtered);
  };

  const handleCreateDisaster = async (newDisaster: any) => {
    try {
      const created = await createDisaster(newDisaster);
      setDisasters([created, ...disasters]);
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error("Failed to create disaster:", error);
    }
  };

  const handleDeleteDisaster = async (disaster: Disaster) => {
    const confirmMessage = `Are you sure you want to delete "${disaster.title}"?\n\nThis action cannot be undone. The disaster will be marked as resolved and removed from active monitoring.\n\nClick OK to proceed or Cancel to abort.`;

    if (window.confirm(confirmMessage)) {
      try {
        const success = await deleteDisaster(disaster.id);
        if (success) {
          setDisasters(disasters.filter((d) => d.id !== disaster.id));
          alert(
            `✅ Disaster "${disaster.title}" has been successfully resolved and deleted.`,
          );
        } else {
          alert("❌ Failed to delete disaster. Please try again.");
        }
      } catch (error) {
        console.error("Failed to delete disaster:", error);
        alert("❌ Error occurred while deleting disaster. Please try again.");
      }
    }
  };

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
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Disaster Management
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Monitor and manage disaster situations across all regions
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700">
              <Plus className="h-4 w-4 mr-2" />
              New Disaster Report
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Disaster Report</DialogTitle>
            </DialogHeader>
            <CreateDisasterForm onSubmit={handleCreateDisaster} />
          </DialogContent>
        </Dialog>
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
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search disasters..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label>Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="monitoring">Monitoring</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Priority</Label>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Type</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="flood">Flood</SelectItem>
                  <SelectItem value="wildfire">Wildfire</SelectItem>
                  <SelectItem value="earthquake">Earthquake</SelectItem>
                  <SelectItem value="hurricane">Hurricane</SelectItem>
                  <SelectItem value="tornado">Tornado</SelectItem>
                  <SelectItem value="landslide">Landslide</SelectItem>
                  <SelectItem value="tsunami">Tsunami</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard
          title="Total Disasters"
          value={disasters.length}
          color="blue"
          icon={AlertTriangle}
        />
        <StatCard
          title="Active"
          value={disasters.filter((d) => d.status === "active").length}
          color="red"
          icon={AlertCircle}
        />
        <StatCard
          title="Critical"
          value={disasters.filter((d) => d.priority === "critical").length}
          color="orange"
          icon={AlertTriangle}
        />
        <StatCard
          title="Resolved"
          value={disasters.filter((d) => d.status === "resolved").length}
          color="green"
          icon={CheckCircle}
        />
      </div>

      {/* Disasters List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredDisasters.map((disaster) => (
          <DisasterCard
            key={disaster.id}
            disaster={disaster}
            onDelete={handleDeleteDisaster}
          />
        ))}
      </div>

      {filteredDisasters.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertTriangle className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No disasters found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-center">
              No disasters match your current filters. Try adjusting your search
              criteria.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function StatCard({
  title,
  value,
  color,
  icon: Icon,
}: {
  title: string;
  value: number;
  color: string;
  icon: any;
}) {
  const colorClasses = {
    blue: "text-blue-500",
    red: "text-red-500",
    orange: "text-orange-500",
    green: "text-green-500",
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

function DisasterCard({
  disaster,
  onDelete,
}: {
  disaster: Disaster;
  onDelete: (disaster: Disaster) => void;
}) {
  const priorityColors = {
    critical:
      "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/30",
    high: "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800/30",
    medium:
      "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800/30",
    low: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/30",
  };

  const statusColors = {
    active: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
    monitoring:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
    resolved:
      "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
    pending: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
  };

  return (
    <Card
      className={`hover:shadow-lg transition-shadow border-l-4 ${priorityColors[disaster.priority].split(" ").find((cls) => cls.startsWith("border-"))}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold mb-2">
              {disaster.title}
            </CardTitle>
            <div className="flex flex-wrap gap-2">
              <Badge
                className={priorityColors[disaster.priority]}
                variant="secondary"
              >
                {disaster.priority} priority
              </Badge>
              <Badge
                className={statusColors[disaster.status]}
                variant="secondary"
              >
                {disaster.status}
              </Badge>
              {disaster.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
            <Button size="sm" variant="outline">
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            {disaster.status === "resolved" ? (
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onDelete(disaster)}
                className="bg-green-600 hover:bg-green-700"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete (Solved)
              </Button>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onDelete(disaster)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Resolve & Delete
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
          {disaster.description}
        </p>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <MapPin className="h-4 w-4" />
            <span>{disaster.location.name}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Users className="h-4 w-4" />
            <span>
              {disaster.affected_people.toLocaleString()} people affected
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Clock className="h-4 w-4" />
            <span>
              Created {new Date(disaster.created_at).toLocaleDateString()} by{" "}
              {disaster.owner_id}
            </span>
          </div>

          {disaster.estimated_damage && (
            <div className="text-sm">
              <span className="font-medium text-gray-900 dark:text-white">
                Estimated damage: {disaster.estimated_damage}
              </span>
            </div>
          )}
        </div>

        {disaster.audit_trail.length > 1 && (
          <div className="mt-4 pt-3 border-t">
            <p className="text-xs text-gray-500">
              Last updated: {new Date(disaster.updated_at).toLocaleString()}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function CreateDisasterForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    locationText: "",
    tags: [] as DisasterType[],
    priority: "medium" as Priority,
    affected_people: 0,
    estimated_damage: "",
  });
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedLocation, setExtractedLocation] = useState<string>("");

  const handleLocationExtraction = async () => {
    if (!formData.description) return;

    setIsExtracting(true);
    try {
      const result = await extractLocationFromText(formData.description);
      if (result.confidence > 0.5) {
        setExtractedLocation(result.location);
        setFormData((prev) => ({ ...prev, locationText: result.location }));
      }
    } catch (error) {
      console.error("Failed to extract location:", error);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let locationData = null;

      if (formData.locationText) {
        locationData = await geocodeLocation(formData.locationText);
      }

      const disasterData = {
        title: formData.title,
        description: formData.description,
        location: locationData || {
          lat: 0,
          lng: 0,
          name: formData.locationText || "Unknown Location",
          address: formData.locationText || "Unknown Address",
        },
        tags: formData.tags,
        priority: formData.priority,
        status: "active" as const,
        owner_id: "netrunnerX", // Mock user
        affected_people: formData.affected_people,
        estimated_damage: formData.estimated_damage,
      };

      onSubmit(disasterData);
    } catch (error) {
      console.error("Failed to create disaster:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Disaster Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, title: e.target.value }))
          }
          placeholder="e.g., NYC Flood Emergency"
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
          placeholder="Describe the disaster situation in detail..."
          rows={4}
          required
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleLocationExtraction}
          disabled={isExtracting || !formData.description}
          className="mt-2"
        >
          {isExtracting ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <MapPin className="h-4 w-4 mr-2" />
          )}
          Extract Location
        </Button>
        {extractedLocation && (
          <p className="text-sm text-green-600 mt-1">
            Extracted location: {extractedLocation}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={formData.locationText}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, locationText: e.target.value }))
          }
          placeholder="e.g., Manhattan, NYC"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Priority</Label>
          <Select
            value={formData.priority}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, priority: value as Priority }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="affected">Affected People</Label>
          <Input
            id="affected"
            type="number"
            value={formData.affected_people}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                affected_people: parseInt(e.target.value) || 0,
              }))
            }
            placeholder="0"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="damage">Estimated Damage</Label>
        <Input
          id="damage"
          value={formData.estimated_damage}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              estimated_damage: e.target.value,
            }))
          }
          placeholder="e.g., $10M+"
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit" className="bg-red-600 hover:bg-red-700">
          Create Disaster Report
        </Button>
      </div>
    </form>
  );
}
