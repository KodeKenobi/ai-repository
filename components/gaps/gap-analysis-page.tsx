
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import {
  AlertTriangle,
  TrendingUp,
  Play,
  Download,
  Calendar,
  FileText,
  Loader2,
  Target,
  CheckCircle,
  Lightbulb
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'

interface ContentItem {
  id: string
  title: string
  contentType: string
  transcription?: {
    content: string
  } | null
  insights: {
    category: string
  }[]
}

interface GapAnalysisReport {
  id: string
  title: string
  description: string
  gaps: any[]
  totalGaps: number
  priorityGaps: number
  recommendations: any[]
  createdAt: Date
}

interface GapAnalysisPageProps {
  reports: GapAnalysisReport[]
  contentItems: ContentItem[]
  userId: string
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

export default function GapAnalysisPage({ reports, contentItems, userId }: GapAnalysisPageProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)

  const exportReport = (report: GapAnalysisReport) => {
    const reportData = {
      title: report.title,
      description: report.description,
      analysisDate: formatDistanceToNow(new Date(report.createdAt), { addSuffix: true }),
      totalGaps: report.totalGaps,
      priorityGaps: report.priorityGaps,
      gaps: report.gaps,
      recommendations: report.recommendations,
      summary: `Gap Analysis Report generated on ${formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}. Found ${report.totalGaps} information gap${report.totalGaps !== 1 ? 's' : ''} with ${report.priorityGaps} high-priority items.`
    }

    const dataStr = JSON.stringify(reportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `gap-analysis-report-${formatDistanceToNow(new Date(report.createdAt)).replace(/\s+/g, '-')}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const runGapAnalysis = async () => {
    if (contentItems.length === 0) {
      return
    }

    setIsAnalyzing(true)
    setAnalysisProgress(0)

    try {
      const response = await fetch('/api/analyze-gaps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      })

      if (!response.ok) {
        throw new Error('Analysis failed')
      }

      // Simulate progress for streaming
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk.split('\n')

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6)
              try {
                const parsed = JSON.parse(data)
                if (parsed.status === 'processing') {
                  setAnalysisProgress(prev => Math.min(prev + 10, 90))
                } else if (parsed.status === 'completed') {
                  setAnalysisProgress(100)
                  // Refresh the page to show new results
                  setTimeout(() => {
                    window.location.reload()
                  }, 1000)
                  return
                }
              } catch (e) {
                // Skip invalid JSON
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Analysis error:', error)
    } finally {
      setIsAnalyzing(false)
      setAnalysisProgress(0)
    }
  }

  const latestReport = reports[0]

  const getImpactColor = (impact: string) => {
    switch (impact?.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
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
            <h1 className="text-3xl font-bold text-gray-900">Gap Analysis</h1>
            <p className="mt-2 text-gray-600">
              Identify missing information and strategic gaps in your business content
            </p>
          </div>
          <Button 
            onClick={runGapAnalysis} 
            disabled={isAnalyzing || contentItems.length === 0}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <AlertTriangle className="h-4 w-4 mr-2" />
                Run Analysis
              </>
            )}
          </Button>
        </div>
      </motion.div>

      {/* Analysis Progress */}
      {isAnalyzing && (
        <motion.div variants={itemVariants}>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Analyzing Content Gaps</h3>
                  <span className="text-sm text-gray-500">{analysisProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${analysisProgress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600">
                  AI is analyzing your content to identify missing business information...
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Content Requirements */}
      {contentItems.length === 0 && (
        <motion.div variants={itemVariants}>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              You need at least 1 processed content item to run gap analysis. 
              <a href="/dashboard/upload" className="text-blue-600 hover:text-blue-700 ml-1">
                Upload some content
              </a> to get started.
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Content Items</p>
                <p className="text-2xl font-bold text-gray-900">{contentItems.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Gaps</p>
                <p className="text-2xl font-bold text-gray-900">
                  {latestReport?.totalGaps || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Priority Gaps</p>
                <p className="text-2xl font-bold text-gray-900">
                  {latestReport?.priorityGaps || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Lightbulb className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Recommendations</p>
                <p className="text-2xl font-bold text-gray-900">
                  {latestReport?.recommendations?.length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Latest Report */}
      {latestReport && (
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-orange-600" />
                  Latest Gap Analysis
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">
                    {formatDistanceToNow(new Date(latestReport.createdAt), { addSuffix: true })}
                  </Badge>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => exportReport(latestReport)}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">{latestReport.title}</h3>
                <p className="text-gray-600">{latestReport.description}</p>
              </div>

              {/* Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-900">Gap Analysis Summary</h4>
                  {latestReport.totalGaps === 0 ? (
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      No Critical Gaps
                    </Badge>
                  ) : (
                    <Badge className="bg-orange-100 text-orange-800">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      {latestReport.totalGaps} Gaps Found
                    </Badge>
                  )}
                </div>

                {latestReport.totalGaps === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-500" />
                    <p className="text-green-700 font-medium">Comprehensive Coverage!</p>
                    <p className="text-gray-600">Your content appears to cover all essential business areas.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Information Gaps */}
                    <div>
                      <h5 className="font-medium text-gray-900 mb-3">Identified Information Gaps</h5>
                      <div className="space-y-3">
                        {latestReport.gaps.map((gap, index) => (
                          <div key={index} className="bg-white border rounded-lg p-4">
                            <div className="flex items-start space-x-3">
                              <AlertTriangle className={cn(
                                "h-5 w-5 mt-0.5",
                                gap.impact === 'high' ? 'text-red-500' :
                                gap.impact === 'medium' ? 'text-yellow-500' : 'text-green-500'
                              )} />
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <h6 className="font-medium text-gray-900">{gap.area}</h6>
                                  <div className="flex space-x-2">
                                    <Badge variant="outline" className="text-xs">
                                      {gap.category}
                                    </Badge>
                                    <Badge 
                                      variant="outline" 
                                      className={cn('text-xs', getImpactColor(gap.impact))}
                                    >
                                      {gap.impact} impact
                                    </Badge>
                                  </div>
                                </div>
                                <p className="text-gray-600 text-sm">
                                  {gap.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recommendations */}
                    {latestReport.recommendations && latestReport.recommendations.length > 0 && (
                      <div>
                        <h5 className="font-medium text-gray-900 mb-3">Recommended Actions</h5>
                        <div className="space-y-3">
                          {latestReport.recommendations.map((recommendation, index) => (
                            <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                              <div className="flex items-start space-x-3">
                                <Lightbulb className="h-5 w-5 text-blue-500 mt-0.5" />
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-2">
                                    <h6 className="font-medium text-blue-900">{recommendation.title}</h6>
                                    <div className="flex space-x-2">
                                      <Badge className={getPriorityColor(recommendation.priority)} variant="secondary">
                                        {recommendation.priority} priority
                                      </Badge>
                                      <Badge variant="outline" className="text-xs">
                                        {recommendation.effort} effort
                                      </Badge>
                                    </div>
                                  </div>
                                  <p className="text-blue-800 text-sm">
                                    {recommendation.description}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Report History */}
      {reports.length > 1 && (
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Analysis History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {reports.slice(1).map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{report.title}</h4>
                      <p className="text-sm text-gray-600">
                        {formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant={report.totalGaps > 0 ? 'destructive' : 'secondary'}>
                        {report.totalGaps} gaps
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {report.recommendations?.length || 0} recommendations
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* No Reports */}
      {reports.length === 0 && contentItems.length > 0 && (
        <motion.div variants={itemVariants}>
          <Card>
            <CardContent className="p-12 text-center">
              <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No gap analysis yet</h3>
              <p className="text-gray-500 mb-6">
                Run your first gap analysis to identify missing information in your business content.
              </p>
              <Button onClick={runGapAnalysis} disabled={isAnalyzing}>
                <Play className="h-4 w-4 mr-2" />
                Run First Analysis
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  )
}
