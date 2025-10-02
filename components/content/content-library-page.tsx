"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  Video,
  Music,
  Globe,
  Search,
  Filter,
  Calendar,
  Eye,
  Download,
  Brain,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { cn } from "@/lib/utils";

interface ContentItem {
  id: string;
  title: string;
  description?: string | null;
  contentType: string;
  source: string;
  sourceUrl?: string | null;
  fileName?: string | null;
  status: string;
  createdAt: Date;
  processedAt?: Date | null;
  transcription?: {
    id: string;
    content: string;
    wordCount?: number | null;
  } | null;
  insights: {
    id: string;
    title: string;
    priority: string;
  }[];
}

interface ContentLibraryPageProps {
  contentItems: ContentItem[];
}

export default function ContentLibraryPage({
  contentItems,
}: ContentLibraryPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const filteredAndSortedItems = useMemo(() => {
    let filtered = contentItems.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description?.toLowerCase() || "").includes(
          searchQuery.toLowerCase()
        );
      const matchesStatus =
        statusFilter === "all" ||
        item.status.toLowerCase() === statusFilter.toLowerCase();
      const matchesType =
        typeFilter === "all" ||
        item.contentType.toLowerCase() === typeFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesType;
    });

    // Sort items
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "title":
          return a.title.localeCompare(b.title);
        case "insights":
          return (b.insights?.length || 0) - (a.insights?.length || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [contentItems, searchQuery, statusFilter, typeFilter, sortBy]);

  const getContentIcon = (contentType: string, source: string) => {
    switch (contentType.toLowerCase()) {
      case "video":
        return Video;
      case "audio":
        return Music;
      case "blog_article":
        return Globe;
      default:
        return FileText;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "processing":
      case "transcribing":
      case "analyzing":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "critical":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const stats = useMemo(() => {
    const total = contentItems.length;
    const completed = contentItems.filter(
      (item) => item.status === "COMPLETED"
    ).length;
    const processing = contentItems.filter((item) =>
      ["PENDING", "TRANSCRIBING", "ANALYZING"].includes(item.status)
    ).length;
    const totalInsights = contentItems.reduce(
      (sum, item) => sum + (item.insights?.length || 0),
      0
    );

    return { total, completed, processing, totalInsights };
  }, [contentItems]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Content Library
            </h1>
            <p className="mt-2 text-gray-600">
              Manage and explore your uploaded content and generated insights
            </p>
          </div>
          <Link href="/dashboard/upload">
            <Button>
              <FileText className="h-4 w-4 mr-2" />
              Add Content
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Content
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Processed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.completed}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Processing</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.processing}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Insights</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalInsights}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search content..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Status
                </label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Type
                </label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="audio">Audio</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="blog_article">Blog Article</SelectItem>
                    <SelectItem value="document">Document</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Sort By
                </label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="title">Title A-Z</SelectItem>
                    <SelectItem value="insights">Most Insights</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Grid */}
      <div>
        {filteredAndSortedItems.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No content found
              </h3>
              <p className="text-gray-500 mb-6">
                {contentItems.length === 0
                  ? "You haven't uploaded any content yet."
                  : "No content matches your current filters."}
              </p>
              <Link href="/dashboard/upload">
                <Button>Upload Your First Content</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredAndSortedItems.map((item) => {
              const ContentIcon = getContentIcon(item.contentType, item.source);

              return (
                <div key={item.id}>
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <ContentIcon className="h-6 w-6 text-gray-600" />
                        </div>

                        <div className="flex-1 space-y-3">
                          {/* Header */}
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-gray-900 line-clamp-2">
                                {item.title}
                              </h3>
                              {item.description && (
                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                  {item.description}
                                </p>
                              )}
                            </div>
                            <Badge
                              className={getStatusColor(item.status)}
                              variant="secondary"
                            >
                              {item.status.toLowerCase()}
                            </Badge>
                          </div>

                          {/* Metadata */}
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {formatDistanceToNow(new Date(item.createdAt), {
                                addSuffix: true,
                              })}
                            </div>
                            {item.transcription?.wordCount && (
                              <div>{item.transcription.wordCount} words</div>
                            )}
                          </div>

                          {/* Source Info */}
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs">
                              {item.contentType.replace("_", " ")}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {item.source.replace("_", " ")}
                            </Badge>
                          </div>

                          {/* Insights */}
                          {item.insights && item.insights.length > 0 && (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700">
                                  Insights ({item.insights.length})
                                </span>
                                <Link href={`/dashboard/content/${item.id}`}>
                                  <Button variant="ghost" size="sm">
                                    <Eye className="h-4 w-4 mr-1" />
                                    View
                                  </Button>
                                </Link>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {item.insights.slice(0, 3).map((insight) => (
                                  <Badge
                                    key={insight.id}
                                    className={cn(
                                      getPriorityColor(insight.priority),
                                      "text-xs"
                                    )}
                                    variant="secondary"
                                  >
                                    {insight.priority.toLowerCase()}
                                  </Badge>
                                ))}
                                {item.insights.length > 3 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{item.insights.length - 3} more
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                            <div className="flex items-center space-x-2">
                              {item.sourceUrl && (
                                <Button variant="ghost" size="sm" asChild>
                                  <a
                                    href={item.sourceUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <Globe className="h-4 w-4 mr-1" />
                                    Source
                                  </a>
                                </Button>
                              )}
                            </div>

                            <Link href={`/dashboard/content/${item.id}`}>
                              <Button size="sm">
                                <Eye className="h-4 w-4 mr-1" />
                                View Details
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
