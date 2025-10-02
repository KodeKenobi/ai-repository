
'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  FileText,
  Video,
  Music,
  Globe,
  ArrowLeft,
  Calendar,
  Brain,
  Download,
  Eye,
  Clock,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Target,
  TrendingUp,
  Users,
  DollarSign,
  Settings,
  Lightbulb
} from 'lucide-react'
import { formatDistanceToNow, format } from 'date-fns'
import { cn } from '@/lib/utils'

interface ContentItem {
  id: string
  title: string
  description?: string | null
  contentType: string
  source: string
  sourceUrl?: string | null
  fileName?: string | null
  fileSize?: BigInt | null
  status: string
  createdAt: Date
  processedAt?: Date | null
  transcription?: {
    id: string
    content: string
    language?: string | null
    confidence?: number | null
    wordCount?: number | null
  } | null
  insights: {
    id: string
    category: string
    title: string
    content: string
    priority: string
    confidence?: number | null
    tags: string[]
    sourceQuote?: string | null
    createdAt: Date
  }[]
}

interface ContentDetailPageProps {
  contentItem: ContentItem
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
}

export default function ContentDetailPage({ contentItem }: ContentDetailPageProps) {
  const downloadTranscription = () => {
    if (!contentItem.transcription) return

    const transcriptionText = `Transcription: ${contentItem.title}
Generated: ${format(new Date(), 'PPP')}
Language: ${contentItem.transcription.language || 'Unknown'}
Word Count: ${contentItem.transcription.wordCount || 'N/A'}
Confidence: ${contentItem.transcription.confidence ? Math.round(contentItem.transcription.confidence * 100) + '%' : 'N/A'}

Content:
${contentItem.transcription.content}
`

    const dataBlob = new Blob([transcriptionText], { type: 'text/plain' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${contentItem.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-transcription.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }
  const getContentIcon = (contentType: string, source: string) => {
    switch (contentType.toLowerCase()) {
      case 'video':
        return Video
      case 'audio':
        return Music
      case 'blog_article':
        return Globe
      default:
        return FileText
    }
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'processing':
      case 'transcribing':
      case 'analyzing':
        return 'bg-blue-100 text-blue-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'critical':
        return 'bg-red-100 text-red-800'
      case 'high':
        return 'bg-orange-100 text-orange-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

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

  const ContentIcon = getContentIcon(contentItem.contentType, contentItem.source)

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center space-x-4 mb-6">
          <Link href="/dashboard/content">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Content
            </Button>
          </Link>
        </div>

        <div className="flex items-start space-x-6">
          <div className="p-4 bg-gray-100 rounded-lg">
            <ContentIcon className="h-8 w-8 text-gray-600" />
          </div>
          
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {contentItem.title}
            </h1>
            {contentItem.description && (
              <p className="text-lg text-gray-600 mb-4">
                {contentItem.description}
              </p>
            )}
            
            <div className="flex items-center space-x-4 mb-4">
              <Badge className={getStatusColor(contentItem.status)} variant="secondary">
                {contentItem.status.toLowerCase()}
              </Badge>
              <Badge variant="outline">
                {contentItem.contentType.replace('_', ' ')}
              </Badge>
              <Badge variant="outline">
                {contentItem.source.replace('_', ' ')}
              </Badge>
            </div>

            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Created {formatDistanceToNow(new Date(contentItem.createdAt), { addSuffix: true })}
              </div>
              {contentItem.processedAt && (
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Processed {formatDistanceToNow(new Date(contentItem.processedAt), { addSuffix: true })}
                </div>
              )}
              {contentItem.fileSize && (
                <div>
                  Size: {Math.round(Number(contentItem.fileSize) / 1024 / 1024 * 100) / 100} MB
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {contentItem.sourceUrl && (
              <Button variant="outline" asChild>
                <a href={contentItem.sourceUrl} target="_blank" rel="noopener noreferrer">
                  <Globe className="h-4 w-4 mr-2" />
                  View Source
                </a>
              </Button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Word Count</p>
                <p className="text-2xl font-bold text-gray-900">
                  {contentItem.transcription?.wordCount?.toLocaleString() || 'N/A'}
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
                <p className="text-sm font-medium text-gray-600">AI Insights</p>
                <p className="text-2xl font-bold text-gray-900">
                  {contentItem.insights?.length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Confidence</p>
                <p className="text-2xl font-bold text-gray-900">
                  {contentItem.transcription?.confidence 
                    ? `${Math.round(contentItem.transcription.confidence * 100)}%`
                    : 'N/A'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Transcription */}
      {contentItem.transcription && (
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Transcription
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <div className="bg-gray-50 rounded-lg p-6">
                  <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {contentItem.transcription.content}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  {contentItem.transcription.language && (
                    <span>Language: {contentItem.transcription.language}</span>
                  )}
                  {contentItem.transcription.wordCount && (
                    <span>{contentItem.transcription.wordCount} words</span>
                  )}
                  {contentItem.transcription.confidence && (
                    <span>{Math.round(contentItem.transcription.confidence * 100)}% confidence</span>
                  )}
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={downloadTranscription}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Text
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Business Insights */}
      {contentItem.insights && contentItem.insights.length > 0 && (
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Brain className="h-5 w-5 mr-2" />
                  Business Insights ({contentItem.insights.length})
                </CardTitle>
                <Link href="/dashboard/insights">
                  <Button variant="outline" size="sm">
                    View All Insights
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {contentItem.insights.map((insight) => {
                const CategoryIcon = getCategoryIcon(insight.category)
                
                return (
                  <div key={insight.id} className="border rounded-lg p-6">
                    <div className="flex items-start space-x-4">
                      <div className={cn(
                        "p-3 rounded-lg",
                        getCategoryColor(insight.category)
                      )}>
                        <CategoryIcon className="h-6 w-6" />
                      </div>
                      
                      <div className="flex-1 space-y-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {insight.title}
                            </h3>
                            <div className="flex items-center space-x-2 mt-2">
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

                        <div className="prose prose-sm max-w-none">
                          <p className="text-gray-700 leading-relaxed">
                            {insight.content}
                          </p>
                        </div>

                        {insight.sourceQuote && (
                          <div className="bg-blue-50 border-l-4 border-blue-200 p-4 rounded-r">
                            <p className="text-sm text-blue-800 italic">
                              "{insight.sourceQuote}"
                            </p>
                          </div>
                        )}

                        {insight.tags && insight.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {insight.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          Generated {formatDistanceToNow(new Date(insight.createdAt), { addSuffix: true })}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* No Insights */}
      {(!contentItem.insights || contentItem.insights.length === 0) && contentItem.status === 'COMPLETED' && (
        <motion.div variants={itemVariants}>
          <Card>
            <CardContent className="p-12 text-center">
              <Brain className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No insights generated</h3>
              <p className="text-gray-500">
                This content has been processed but no insights were generated. This might happen if the content doesn't contain business-relevant information.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  )
}
