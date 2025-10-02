
'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Brain,
  Search,
  Filter,
  Calendar,
  TrendingUp,
  AlertTriangle,
  Target,
  Lightbulb,
  BarChart3,
  Users,
  DollarSign,
  Settings
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'

interface ContentItem {
  id: string
  title: string
  contentType: string
  createdAt: Date
}

interface Insight {
  id: string
  category: string
  title: string
  content: string
  priority: string
  confidence?: number | null
  tags: string[]
  sourceQuote?: string | null
  createdAt: Date
  contentItem: ContentItem
}

interface InsightsPageProps {
  insights: Insight[]
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 }
  }
}

export default function InsightsPage({ insights }: InsightsPageProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')

  const filteredAndSortedInsights = useMemo(() => {
    let filtered = insights.filter(insight => {
      const matchesSearch = insight.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          insight.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          insight.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesCategory = categoryFilter === 'all' || insight.category.toLowerCase() === categoryFilter.toLowerCase()
      const matchesPriority = priorityFilter === 'all' || insight.priority.toLowerCase() === priorityFilter.toLowerCase()
      
      return matchesSearch && matchesCategory && matchesPriority
    })

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case 'priority':
          const priorityOrder = { 'CRITICAL': 4, 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 }
          return (priorityOrder[b.priority as keyof typeof priorityOrder] || 0) - 
                 (priorityOrder[a.priority as keyof typeof priorityOrder] || 0)
        case 'confidence':
          return (b.confidence || 0) - (a.confidence || 0)
        default:
          return 0
      }
    })

    return filtered
  }, [insights, searchQuery, categoryFilter, priorityFilter, sortBy])

  const stats = useMemo(() => {
    const total = insights.length
    const critical = insights.filter(i => i.priority === 'CRITICAL').length
    const high = insights.filter(i => i.priority === 'HIGH').length
    const categories = [...new Set(insights.map(i => i.category))].length

    return { total, critical, high, categories }
  }, [insights])

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'business_model':
        return Target
      case 'marketing':
        return TrendingUp
      case 'operations':
        return Settings
      case 'financial':
        return DollarSign
      case 'strategic':
        return Lightbulb
      case 'customer':
        return Users
      default:
        return Brain
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      'business_model': 'bg-blue-100 text-blue-800',
      'marketing': 'bg-purple-100 text-purple-800',
      'operations': 'bg-green-100 text-green-800',
      'financial': 'bg-yellow-100 text-yellow-800',
      'strategic': 'bg-indigo-100 text-indigo-800',
      'customer': 'bg-pink-100 text-pink-800',
      'product': 'bg-teal-100 text-teal-800',
      'competitive': 'bg-red-100 text-red-800',
      'risks': 'bg-orange-100 text-orange-800',
      'opportunities': 'bg-emerald-100 text-emerald-800'
    }
    return colors[category.toLowerCase() as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Business Insights</h1>
            <p className="mt-2 text-gray-600">
              AI-generated insights from your content to help drive business decisions
            </p>
          </div>
          <Link href="/dashboard/upload">
            <Button>
              <Brain className="h-4 w-4 mr-2" />
              Add Content
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Insights</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Critical</p>
                <p className="text-2xl font-bold text-gray-900">{stats.critical}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">High Priority</p>
                <p className="text-2xl font-bold text-gray-900">{stats.high}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Categories</p>
                <p className="text-2xl font-bold text-gray-900">{stats.categories}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants}>
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
                <label className="text-sm font-medium text-gray-700">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search insights..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Category</label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="business_model">Business Model</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="operations">Operations</SelectItem>
                    <SelectItem value="financial">Financial</SelectItem>
                    <SelectItem value="strategic">Strategic</SelectItem>
                    <SelectItem value="customer">Customer</SelectItem>
                    <SelectItem value="product">Product</SelectItem>
                    <SelectItem value="competitive">Competitive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Priority</label>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All priorities" />
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

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Sort By</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="priority">Priority</SelectItem>
                    <SelectItem value="confidence">Confidence</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Insights List */}
      <motion.div variants={itemVariants}>
        {filteredAndSortedInsights.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Brain className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No insights found</h3>
              <p className="text-gray-500 mb-6">
                {insights.length === 0
                  ? "Upload some content to generate AI insights."
                  : "No insights match your current filters."}
              </p>
              <Link href="/dashboard/upload">
                <Button>Upload Content</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredAndSortedInsights.map((insight) => {
              const CategoryIcon = getCategoryIcon(insight.category)
              
              return (
                <motion.div key={insight.id} variants={itemVariants}>
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className={cn(
                          "p-3 rounded-lg",
                          getCategoryColor(insight.category)
                        )}>
                          <CategoryIcon className="h-6 w-6" />
                        </div>
                        
                        <div className="flex-1 space-y-4">
                          {/* Header */}
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-xl font-semibold text-gray-900">
                                {insight.title}
                              </h3>
                              <div className="flex items-center space-x-3 mt-2">
                                <Badge className={getCategoryColor(insight.category)} variant="secondary">
                                  {insight.category.replace('_', ' ')}
                                </Badge>
                                <Badge className={getPriorityColor(insight.priority)} variant="outline">
                                  {insight.priority.toLowerCase()} priority
                                </Badge>
                                {insight.confidence && (
                                  <Badge variant="outline" className="text-xs">
                                    {Math.round(insight.confidence * 100)}% confidence
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="prose prose-sm max-w-none">
                            <p className="text-gray-700 leading-relaxed">
                              {insight.content}
                            </p>
                          </div>

                          {/* Source Quote */}
                          {insight.sourceQuote && (
                            <div className="bg-blue-50 border-l-4 border-blue-200 p-4 rounded-r">
                              <p className="text-sm text-blue-800 italic">
                                "{insight.sourceQuote}"
                              </p>
                            </div>
                          )}

                          {/* Tags */}
                          {insight.tags && insight.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {insight.tags.map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}

                          {/* Footer */}
                          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                {formatDistanceToNow(new Date(insight.createdAt), { addSuffix: true })}
                              </div>
                              <Link href={`/dashboard/content/${insight.contentItem.id}`}>
                                <span className="text-blue-600 hover:text-blue-700">
                                  From: {insight.contentItem.title}
                                </span>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
