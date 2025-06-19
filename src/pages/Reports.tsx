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
import { Progress } from "@/components/ui/progress";
import {
  createReport,
  verifyImage,
  deleteReport,
  updateReportStatus,
} from "@/lib/api";
import { Report, Priority, mockReports, mockDisasters } from "@/lib/mock-data";
import {
  FileText,
  Upload,
  CheckCircle,
  AlertTriangle,
  Clock,
  Eye,
  Camera,
  MapPin,
  User,
  Search,
  Filter,
  Loader2,
  Shield,
  XCircle,
  AlertCircle,
  Trash2,
  Edit,
} from "lucide-react";

export default function Reports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isVerifying, setIsVerifying] = useState<string | null>(null);

  useEffect(() => {
    // Initialize with mock reports
    setReports([...mockReports]);
  }, []);

  useEffect(() => {
    filterReports();
  }, [reports, searchTerm, statusFilter, priorityFilter]);

  const filterReports = () => {
    let filtered = [...reports];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (report) =>
          report.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.user_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (report.location?.name &&
            report.location.name
              .toLowerCase()
              .includes(searchTerm.toLowerCase())),
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (report) => report.verification_status === statusFilter,
      );
    }

    // Priority filter
    if (priorityFilter !== "all") {
      filtered = filtered.filter(
        (report) => report.priority === priorityFilter,
      );
    }

    // Sort by creation time (newest first)
    filtered.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );

    setFilteredReports(filtered);
  };

  const handleCreateReport = async (newReport: any) => {
    try {
      const created = await createReport(newReport);
      setReports([created, ...reports]);
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error("Failed to create report:", error);
    }
  };

  const handleVerifyImage = async (reportId: string, imageUrl: string) => {
    setIsVerifying(reportId);
    try {
      const result = await verifyImage(imageUrl);

      // Update report with verification result
      setReports((prev) =>
        prev.map((report) =>
          report.id === reportId
            ? {
                ...report,
                verification_status: result.isAuthentic
                  ? "verified"
                  : "flagged",
                verification_details: result,
              }
            : report,
        ),
      );
    } catch (error) {
      console.error("Failed to verify image:", error);
    } finally {
      setIsVerifying(null);
    }
  };

  const handleReviewDetails = (report: Report) => {
    // Show detailed view of the report
    alert(
      `Review Details for Report #${report.id}\n\nContent: ${report.content}\n\nUser: ${report.user_id}\n\nStatus: ${report.verification_status}\n\nPriority: ${report.priority}\n\nDate: ${new Date(report.created_at).toLocaleString()}\n\n${report.location ? `Location: ${report.location.name}` : "No location specified"}`,
    );
  };

  const handleTakeAction = async (report: Report) => {
    const actions = [
      { label: "Escalate to Emergency Services", status: "verified" as const },
      { label: "Dispatch Response Team", status: "verified" as const },
      { label: "Update Status to Verified", status: "verified" as const },
      { label: "Flag for Investigation", status: "flagged" as const },
      { label: "Mark as Resolved", status: "verified" as const },
      { label: "Request Additional Information", status: "pending" as const },
      { label: "Reject Report", status: "rejected" as const },
      { label: "Delete Report", status: null },
    ];

    const actionsList = actions
      .map((action, index) => `${index + 1}. ${action.label}`)
      .join("\n");
    const selectedAction = prompt(
      `Take Action on Report #${report.id}\n\nSelect action:\n${actionsList}\n\nEnter choice (1-${actions.length}):`,
    );

    if (
      selectedAction &&
      selectedAction >= "1" &&
      selectedAction <= actions.length.toString()
    ) {
      const actionIndex = parseInt(selectedAction) - 1;
      const action = actions[actionIndex];

      if (action.label === "Delete Report") {
        if (
          window.confirm(
            `Are you sure you want to delete Report #${report.id}?\n\nThis action cannot be undone.`,
          )
        ) {
          try {
            const success = await deleteReport(report.id);
            if (success) {
              setReports((prev) => prev.filter((r) => r.id !== report.id));
              alert(`✅ Report #${report.id} has been deleted successfully.`);
            }
          } catch (error) {
            alert("❌ Failed to delete report. Please try again.");
          }
        }
      } else if (action.status) {
        try {
          const updated = await updateReportStatus(
            report.id,
            action.status,
            action.label,
          );
          if (updated) {
            setReports((prev) =>
              prev.map((r) => (r.id === report.id ? { ...r, ...updated } : r)),
            );
            alert(
              `✅ Action taken: ${action.label}\n\nReport #${report.id} status updated to: ${action.status}`,
            );
          }
        } catch (error) {
          alert("❌ Failed to update report status. Please try again.");
        }
      }
    }
  };

  const handleDeleteReport = async (report: Report) => {
    if (
      window.confirm(
        `Are you sure you want to delete Report #${report.id}?\n\nThis will permanently remove the report from the system.\n\nClick OK to delete or Cancel to abort.`,
      )
    ) {
      try {
        const success = await deleteReport(report.id);
        if (success) {
          setReports(reports.filter((r) => r.id !== report.id));
          alert(`✅ Report #${report.id} has been successfully deleted.`);
        } else {
          alert("❌ Failed to delete report. Please try again.");
        }
      } catch (error) {
        console.error("Failed to delete report:", error);
        alert("❌ Error occurred while deleting report. Please try again.");
      }
    }
  };

  const getStats = () => {
    return {
      total: reports.length,
      verified: reports.filter((r) => r.verification_status === "verified")
        .length,
      pending: reports.filter((r) => r.verification_status === "pending")
        .length,
      flagged: reports.filter((r) => r.verification_status === "flagged")
        .length,
    };
  };

  const stats = getStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Report Verification System
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            AI-powered image verification and citizen report validation
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Upload className="h-4 w-4 mr-2" />
              Submit Report
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Submit New Report</DialogTitle>
            </DialogHeader>
            <CreateReportForm onSubmit={handleCreateReport} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard
          title="Total Reports"
          value={stats.total}
          icon={FileText}
          color="blue"
          subtitle="submitted"
        />
        <StatCard
          title="AI Verified"
          value={stats.verified}
          icon={CheckCircle}
          color="green"
          subtitle="authentic content"
        />
        <StatCard
          title="Pending Review"
          value={stats.pending}
          icon={Clock}
          color="orange"
          subtitle="awaiting verification"
        />
        <StatCard
          title="Flagged Content"
          value={stats.flagged}
          icon={AlertTriangle}
          color="red"
          subtitle="requires investigation"
        />
      </div>

      {/* AI Verification Demo */}
      <Card className="border-2 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-blue-500" />
            Google Gemini AI Verification Engine
            <Badge
              variant="outline"
              className="ml-auto bg-blue-50 text-blue-700"
            >
              ACTIVE
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-3">
                <Camera className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="font-semibold mb-2">Image Analysis</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Analyzes metadata, lighting, shadows, and visual consistency
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mb-3">
                <Eye className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="font-semibold mb-2">Content Verification</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Detects manipulated content and verifies disaster context
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-3">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="font-semibold mb-2">Confidence Scoring</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Provides reliability score from 0-100% with detailed analysis
              </p>
            </div>
          </div>

          <div className="mt-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Real-time Detection Capabilities:
            </h4>
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3 text-green-500" />
                Digital manipulation detection
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3 text-green-500" />
                Metadata inconsistency analysis
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3 text-green-500" />
                Lighting and shadow verification
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3 text-green-500" />
                Context appropriateness check
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3 text-green-500" />
                Disaster authenticity scoring
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3 text-green-500" />
                Real-time processing alerts
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="search">Search Reports</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search by content, user, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label>Verification Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="flagged">Flagged</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
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
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.map((report) => (
          <ReportCard
            key={report.id}
            report={report}
            onVerifyImage={handleVerifyImage}
            onDelete={handleDeleteReport}
            isVerifying={isVerifying === report.id}
          />
        ))}
      </div>

      {filteredReports.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No reports found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-center">
              No reports match your current filters. Try adjusting your search
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
  icon: Icon,
  color,
  subtitle,
}: {
  title: string;
  value: number;
  icon: any;
  color: string;
  subtitle: string;
}) {
  const colorClasses = {
    blue: "text-blue-500",
    green: "text-green-500",
    orange: "text-orange-500",
    red: "text-red-500",
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
          <p className="text-xs text-gray-500">{subtitle}</p>
        </div>
        <Icon
          className={`h-8 w-8 ${colorClasses[color as keyof typeof colorClasses]}`}
        />
      </CardContent>
    </Card>
  );
}

function ReportCard({
  report,
  onVerifyImage,
  onDelete,
  isVerifying,
}: {
  report: Report & { verification_details?: any };
  onVerifyImage: (reportId: string, imageUrl: string) => void;
  onDelete: (report: Report) => void;
  isVerifying: boolean;
}) {
  const statusColors = {
    verified:
      "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
    pending:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
    flagged: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
    rejected:
      "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
  };

  const priorityColors = {
    critical: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
    high: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
    medium:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
    low: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "flagged":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">
                Report #{report.id}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                by {report.user_id}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              className={statusColors[report.verification_status]}
              variant="secondary"
            >
              {getStatusIcon(report.verification_status)}
              {report.verification_status}
            </Badge>
            <Badge
              className={priorityColors[report.priority]}
              variant="secondary"
            >
              {report.priority}
            </Badge>
          </div>
        </div>

        <p className="text-gray-700 dark:text-gray-300 mb-4">
          {report.content}
        </p>

        {report.location && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
            <MapPin className="h-4 w-4" />
            <span>{report.location.name}</span>
          </div>
        )}

        {report.image_url && (
          <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium flex items-center gap-2">
                <Camera className="h-4 w-4" />
                Uploaded Image
              </span>
              {report.verification_status === "pending" && (
                <Button
                  size="sm"
                  onClick={() => onVerifyImage(report.id, report.image_url!)}
                  disabled={isVerifying}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isVerifying ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Shield className="h-4 w-4 mr-2" />
                  )}
                  Verify with AI
                </Button>
              )}
            </div>

            <div className="text-xs text-gray-500 break-all mb-2">
              {report.image_url}
            </div>

            {report.verification_details && (
              <div className="mt-3 p-3 bg-white dark:bg-gray-900/50 rounded border">
                <h5 className="font-medium text-sm mb-2 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  AI Verification Results
                </h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Authenticity:</span>
                    <Badge
                      variant={
                        report.verification_details.isAuthentic
                          ? "default"
                          : "destructive"
                      }
                    >
                      {report.verification_details.isAuthentic
                        ? "Authentic"
                        : "Suspicious"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Confidence:</span>
                    <span className="font-medium">
                      {Math.round(report.verification_details.confidence * 100)}
                      %
                    </span>
                  </div>
                  <div className="mt-2">
                    <span className="font-medium">Analysis:</span>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      {report.verification_details.analysis}
                    </p>
                  </div>
                  {report.verification_details.flaggedContent && (
                    <div className="mt-2">
                      <span className="font-medium text-red-600">
                        Flagged Issues:
                      </span>
                      <ul className="list-disc list-inside text-red-600 text-xs mt-1">
                        {report.verification_details.flaggedContent.map(
                          (issue: string, index: number) => (
                            <li key={index}>{issue.replace("_", " ")}</li>
                          ),
                        )}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Quick Action Buttons */}
                <div className="mt-3 pt-2 border-t">
                  <p className="text-xs text-gray-500 mb-2">Quick Actions:</p>
                  <div className="flex gap-1 flex-wrap">
                    {report.verification_status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs h-7 text-green-600 hover:bg-green-50"
                          onClick={async () => {
                            const updated = await updateReportStatus(
                              report.id,
                              "verified",
                              "Quick verified",
                            );
                            if (updated) {
                              setReports((prev) =>
                                prev.map((r) =>
                                  r.id === report.id ? { ...r, ...updated } : r,
                                ),
                              );
                            }
                          }}
                        >
                          ✓ Verify
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs h-7 text-red-600 hover:bg-red-50"
                          onClick={async () => {
                            const updated = await updateReportStatus(
                              report.id,
                              "flagged",
                              "Quick flagged",
                            );
                            if (updated) {
                              setReports((prev) =>
                                prev.map((r) =>
                                  r.id === report.id ? { ...r, ...updated } : r,
                                ),
                              );
                            }
                          }}
                        >
                          ⚠ Flag
                        </Button>
                      </>
                    )}
                    {report.verification_status === "verified" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs h-7 text-orange-600 hover:bg-orange-50"
                        onClick={async () => {
                          const updated = await updateReportStatus(
                            report.id,
                            "pending",
                            "Needs review",
                          );
                          if (updated) {
                            setReports((prev) =>
                              prev.map((r) =>
                                r.id === report.id ? { ...r, ...updated } : r,
                              ),
                            );
                          }
                        }}
                      >
                        ↻ Recheck
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {new Date(report.created_at).toLocaleString()}
          </span>
          <div className="flex gap-2 flex-wrap">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleReviewDetails(report)}
            >
              <Eye className="h-4 w-4 mr-1" />
              Review Details
            </Button>
            <Button
              size="sm"
              onClick={() => handleTakeAction(report)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Take Action
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDelete(report)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CreateReportForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    disaster_id: "",
    content: "",
    image_url: "",
    priority: "medium" as Priority,
    location_name: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const reportData = {
      disaster_id: formData.disaster_id,
      user_id: "citizen_reporter", // Mock user
      content: formData.content,
      image_url: formData.image_url || undefined,
      verification_status: "pending" as const,
      priority: formData.priority,
      location: formData.location_name
        ? {
            lat: 0,
            lng: 0,
            name: formData.location_name,
            address: formData.location_name,
          }
        : undefined,
    };

    onSubmit(reportData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Related Disaster</Label>
        <Select
          value={formData.disaster_id}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, disaster_id: value }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select disaster..." />
          </SelectTrigger>
          <SelectContent>
            {mockDisasters.map((disaster) => (
              <SelectItem key={disaster.id} value={disaster.id}>
                {disaster.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="content">Report Description</Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, content: e.target.value }))
          }
          placeholder="Describe what you observed in detail..."
          rows={4}
          required
        />
      </div>

      <div>
        <Label htmlFor="image">Image URL (optional)</Label>
        <Input
          id="image"
          value={formData.image_url}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, image_url: e.target.value }))
          }
          placeholder="https://example.com/image.jpg"
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
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={formData.location_name}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                location_name: e.target.value,
              }))
            }
            placeholder="e.g., Downtown Area"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit" className="bg-green-600 hover:bg-green-700">
          Submit Report
        </Button>
      </div>
    </form>
  );
}
