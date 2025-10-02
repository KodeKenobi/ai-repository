
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import {
  Search,
  AlertTriangle,
  CheckCircle,
  Play,
  Download,
  Calendar,
  FileText,
  Loader2,
  RefreshCw
} from 'lucide-react'
import { formatDistanceToNow, format } from 'date-fns'

interface ContentItem {
  id: string
  title: string
  contentType: string
  transcription?: {
    content: string
  } | null
}

interface ConsistencyReport {
  id: string
  title: string
  description: string
  contradictions: any[]
  totalContradictions: number
  createdAt: Date
}

interface ConsistencyPageProps {
  reports: ConsistencyReport[]
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

export default function ConsistencyPage({ reports, contentItems, userId }: ConsistencyPageProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)

  const exportReport = (report: ConsistencyReport) => {
    const reportData = {
      title: report.title,
      description: report.description,
      analysisDate: format(new Date(report.createdAt), 'PPP'),
      totalContradictions: report.totalContradictions,
      contradictions: report.contradictions,
      summary: `Consistency Analysis Report generated on ${format(new Date(report.createdAt), 'PPP')}. Found ${report.totalContradictions} contradiction${report.totalContradictions !== 1 ? 's' : ''} across content items.`
    }

    const dataStr = JSON.stringify(reportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `consistency-report-${format(new Date(report.createdAt), 'yyyy-MM-dd')}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const runConsistencyAnalysis = async () => {
    if (contentItems.length < 2) {
      return
    }

    setIsAnalyzing(true)
    setAnalysisProgress(0)

    try {
      const response = await fetch('/api/analyze-consistency', {
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
            <h1 className="text-3xl font-bold text-gray-900">Consistency Analysis</h1>
            <p className="mt-2 text-gray-600">
              Identify contradictions and inconsistencies across your content
            </p>
          </div>
          <Button 
            onClick={runConsistencyAnalysis} 
            disabled={isAnalyzing || contentItems.length < 2}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
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
                  <h3 className="font-medium">Analyzing Content Consistency</h3>
                  <span className="text-sm text-gray-500">{analysisProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${analysisProgress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600">
                  AI is analyzing your content for contradictions and inconsistencies...
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Content Requirements */}
      {contentItems.length < 2 && (
        <motion.div variants={itemVariants}>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              You need at least 2 processed content items to run consistency analysis. 
              <a href="/dashboard/upload" className="text-blue-600 hover:text-blue-700 ml-1">
                Upload more content
              </a> to get started.
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              <Search className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Analyses Run</p>
                <p className="text-2xl font-bold text-gray-900">{reports.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Contradictions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {latestReport?.totalContradictions || 0}
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
                  <Search className="h-5 w-5 mr-2 text-green-600" />
                  Latest Consistency Analysis
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
                  <h4 className="font-medium text-gray-900">Analysis Summary</h4>
                  {latestReport.totalContradictions === 0 ? (
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      No Contradictions
                    </Badge>
                  ) : (
                    <Badge className="bg-orange-100 text-orange-800">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      {latestReport.totalContradictions} Issues Found
                    </Badge>
                  )}
                </div>

                {latestReport.totalContradictions === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-500" />
                    <p className="text-green-700 font-medium">Great news!</p>
                    <p className="text-gray-600">No contradictions found in your content.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {latestReport.contradictions.map((contradiction, index) => (
                      <div key={index} className="bg-white border border-orange-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900 mb-2">
                              {contradiction.issue}
                            </h5>
                            <p className="text-gray-600 mb-3">
                              {contradiction.description}
                            </p>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium text-gray-700">Sources:</span>
                              {contradiction.sources?.map((source: string, idx: number) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {source}
                                </Badge>
                              ))}
                              <Badge 
                                variant="outline" 
                                className={
                                  contradiction.severity === 'high' 
                                    ? 'text-red-600 border-red-200' 
                                    : contradiction.severity === 'medium'
                                    ? 'text-orange-600 border-orange-200'
                                    : 'text-yellow-600 border-yellow-200'
                                }
                              >
                                {contradiction.severity} severity
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
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
                      <Badge variant={report.totalContradictions > 0 ? 'destructive' : 'secondary'}>
                        {report.totalContradictions} issues
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
      {reports.length === 0 && contentItems.length >= 2 && (
        <motion.div variants={itemVariants}>
          <Card>
            <CardContent className="p-12 text-center">
              <Search className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No consistency analysis yet</h3>
              <p className="text-gray-500 mb-6">
                Run your first consistency analysis to identify contradictions in your content.
              </p>
              <Button onClick={runConsistencyAnalysis} disabled={isAnalyzing}>
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
