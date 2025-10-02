
'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import {
  Upload,
  File,
  Video,
  Music,
  Globe,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  Plus,
  FileText
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface UploadPageProps {
  userId: string
}

interface UploadFile {
  id: string
  file: File
  title: string
  description: string
  status: 'pending' | 'uploading' | 'processing' | 'completed' | 'error'
  progress: number
  error?: string
}

interface URLContent {
  id: string
  url: string
  title: string
  description: string
  type: 'youtube' | 'blog'
  status: 'pending' | 'processing' | 'completed' | 'error'
  error?: string
}

interface TextContent {
  id: string
  title: string
  text: string
  status: 'pending' | 'processing' | 'completed' | 'error'
  error?: string
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

export default function UploadPage({ userId }: UploadPageProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadFile[]>([])
  const [urlContents, setUrlContents] = useState<URLContent[]>([])
  const [textContents, setTextContents] = useState<TextContent[]>([])
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [blogUrl, setBlogUrl] = useState('')
  const [textTitle, setTextTitle] = useState('')
  const [textContent, setTextContent] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: UploadFile[] = acceptedFiles.map(file => ({
      id: `file-${Date.now()}-${Math.random()}`,
      file,
      title: file.name.replace(/\.[^/.]+$/, ''),
      description: '',
      status: 'pending',
      progress: 0
    }))
    
    setUploadedFiles(prev => [...prev, ...newFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.m4a', '.aac'],
      'video/*': ['.mp4', '.mov', '.avi', '.mkv'],
      'application/pdf': ['.pdf'],
      'text/*': ['.txt'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    multiple: true
  })

  const updateFileTitle = (fileId: string, title: string) => {
    setUploadedFiles(prev =>
      prev.map(f => f.id === fileId ? { ...f, title } : f)
    )
  }

  const updateFileDescription = (fileId: string, description: string) => {
    setUploadedFiles(prev =>
      prev.map(f => f.id === fileId ? { ...f, description } : f)
    )
  }

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const addYouTubeUrl = () => {
    if (!youtubeUrl.trim()) return

    const newContent: URLContent = {
      id: `youtube-${Date.now()}`,
      url: youtubeUrl,
      title: extractVideoTitle(youtubeUrl),
      description: '',
      type: 'youtube',
      status: 'pending'
    }

    setUrlContents(prev => [...prev, newContent])
    setYoutubeUrl('')
  }

  const addBlogUrl = () => {
    if (!blogUrl.trim()) return

    const newContent: URLContent = {
      id: `blog-${Date.now()}`,
      url: blogUrl,
      title: extractDomainFromUrl(blogUrl),
      description: '',
      type: 'blog',
      status: 'pending'
    }

    setUrlContents(prev => [...prev, newContent])
    setBlogUrl('')
  }

  const addTextContent = () => {
    if (!textTitle.trim() || !textContent.trim()) return

    const newTextContent: TextContent = {
      id: `text-${Date.now()}`,
      title: textTitle,
      text: textContent,
      status: 'pending'
    }

    setTextContents(prev => [...prev, newTextContent])
    setTextTitle('')
    setTextContent('')
  }

  const updateUrlTitle = (contentId: string, title: string) => {
    setUrlContents(prev =>
      prev.map(c => c.id === contentId ? { ...c, title } : c)
    )
  }

  const updateUrlDescription = (contentId: string, description: string) => {
    setUrlContents(prev =>
      prev.map(c => c.id === contentId ? { ...c, description } : c)
    )
  }

  const removeUrlContent = (contentId: string) => {
    setUrlContents(prev => prev.filter(c => c.id !== contentId))
  }

  const removeTextContent = (contentId: string) => {
    setTextContents(prev => prev.filter(c => c.id !== contentId))
  }

  const processAllContent = async () => {
    if (uploadedFiles.length === 0 && urlContents.length === 0 && textContents.length === 0) {
      return
    }

    setIsProcessing(true)

    try {
      // Process files
      for (const fileItem of uploadedFiles) {
        await processFile(fileItem)
      }

      // Process URLs
      for (const urlItem of urlContents) {
        await processUrl(urlItem)
      }

      // Process text content
      for (const textItem of textContents) {
        await processTextContent(textItem)
      }
    } catch (error) {
      console.error('Processing error:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const processFile = async (fileItem: UploadFile) => {
    setUploadedFiles(prev =>
      prev.map(f => f.id === fileItem.id ? { ...f, status: 'uploading', progress: 0 } : f)
    )

    try {
      const formData = new FormData()
      formData.append('file', fileItem.file)
      formData.append('title', fileItem.title)
      formData.append('description', fileItem.description)
      formData.append('userId', userId)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const result = await response.json()

      setUploadedFiles(prev =>
        prev.map(f => f.id === fileItem.id ? { 
          ...f, 
          status: 'processing', 
          progress: 100 
        } : f)
      )

      // Start processing (transcription + analysis)
      await processContent(result.contentId)

      setUploadedFiles(prev =>
        prev.map(f => f.id === fileItem.id ? { 
          ...f, 
          status: 'completed' 
        } : f)
      )

    } catch (error) {
      setUploadedFiles(prev =>
        prev.map(f => f.id === fileItem.id ? { 
          ...f, 
          status: 'error', 
          error: error instanceof Error ? error.message : 'Upload failed'
        } : f)
      )
    }
  }

  const processUrl = async (urlItem: URLContent) => {
    setUrlContents(prev =>
      prev.map(c => c.id === urlItem.id ? { ...c, status: 'processing' } : c)
    )

    try {
      const response = await fetch('/api/process-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: urlItem.url,
          title: urlItem.title,
          description: urlItem.description,
          type: urlItem.type,
          userId,
        }),
      })

      if (!response.ok) {
        throw new Error('URL processing failed')
      }

      const result = await response.json()

      // Start processing (transcription + analysis)
      await processContent(result.contentId)

      setUrlContents(prev =>
        prev.map(c => c.id === urlItem.id ? { 
          ...c, 
          status: 'completed' 
        } : c)
      )

    } catch (error) {
      setUrlContents(prev =>
        prev.map(c => c.id === urlItem.id ? { 
          ...c, 
          status: 'error',
          error: error instanceof Error ? error.message : 'Processing failed'
        } : c)
      )
    }
  }

  const processTextContent = async (textItem: TextContent) => {
    setTextContents(prev =>
      prev.map(c => c.id === textItem.id ? { ...c, status: 'processing' } : c)
    )

    try {
      const response = await fetch('/api/process-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: textItem.title,
          text: textItem.text,
          userId,
        }),
      })

      if (!response.ok) {
        throw new Error('Text processing failed')
      }

      const result = await response.json()

      // Start processing (analysis only, no transcription needed)
      await processContent(result.contentId)

      setTextContents(prev =>
        prev.map(c => c.id === textItem.id ? { 
          ...c, 
          status: 'completed' 
        } : c)
      )

    } catch (error) {
      setTextContents(prev =>
        prev.map(c => c.id === textItem.id ? { 
          ...c, 
          status: 'error',
          error: error instanceof Error ? error.message : 'Processing failed'
        } : c)
      )
    }
  }

  const processContent = async (contentId: string) => {
    try {
      const response = await fetch('/api/process-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contentId }),
      })

      if (!response.ok) {
        throw new Error('Content processing failed')
      }
    } catch (error) {
      console.error('Content processing error:', error)
    }
  }

  const extractVideoTitle = (url: string): string => {
    try {
      const urlObj = new URL(url)
      return `YouTube Video - ${urlObj.pathname}`
    } catch {
      return 'YouTube Video'
    }
  }

  const extractDomainFromUrl = (url: string): string => {
    try {
      const urlObj = new URL(url)
      return `Blog Article - ${urlObj.hostname}`
    } catch {
      return 'Blog Article'
    }
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('video/')) return Video
    if (file.type.startsWith('audio/')) return Music
    return File
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'processing':
      case 'uploading':
        return 'bg-blue-100 text-blue-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'error':
        return 'bg-red-100 text-red-800'
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
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-gray-900">Upload Content</h1>
        <p className="mt-2 text-gray-600">
          Upload audio, video files, or add URLs to extract business insights
        </p>
      </motion.div>

      {/* File Upload */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Upload className="h-5 w-5 mr-2 text-blue-600" />
              File Upload
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              {...getRootProps()}
              className={cn(
                'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
                isDragActive
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
              )}
            >
              <input {...getInputProps()} />
              <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              {isDragActive ? (
                <p className="text-lg text-blue-600">Drop the files here...</p>
              ) : (
                <>
                  <p className="text-lg text-gray-600 mb-2">
                    Drag & drop files here, or click to select
                  </p>
                  <p className="text-sm text-gray-500">
                    Support: MP3, WAV, MP4, MOV, PDF, DOCX, TXT
                  </p>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* YouTube URL */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Video className="h-5 w-5 mr-2 text-red-600" />
              YouTube Video
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2">
              <Input
                type="url"
                placeholder="https://youtube.com/watch?v=..."
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                className="flex-1"
              />
              <Button onClick={addYouTubeUrl} disabled={!youtubeUrl.trim()}>
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Blog URL */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="h-5 w-5 mr-2 text-green-600" />
              Blog Article
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2">
              <Input
                type="url"
                placeholder="https://example.com/article"
                value={blogUrl}
                onChange={(e) => setBlogUrl(e.target.value)}
                className="flex-1"
              />
              <Button onClick={addBlogUrl} disabled={!blogUrl.trim()}>
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Direct Text Input */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2 text-purple-600" />
              Direct Text Input
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="text-title">Title</Label>
              <Input
                id="text-title"
                placeholder="Enter title for your text content..."
                value={textTitle}
                onChange={(e) => setTextTitle(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="text-content">Content</Label>
              <Textarea
                id="text-content"
                placeholder="Paste your text content here... (meeting notes, transcripts, articles, etc.)"
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                rows={6}
                className="mt-1"
              />
            </div>
            <Button 
              onClick={addTextContent} 
              disabled={!textTitle.trim() || !textContent.trim()}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Text Content
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Files to Process</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {uploadedFiles.map((fileItem) => {
                const FileIcon = getFileIcon(fileItem.file)
                
                return (
                  <div key={fileItem.id} className="border rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <FileIcon className="h-8 w-8 text-blue-600 mt-1" />
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <Input
                              value={fileItem.title}
                              onChange={(e) => updateFileTitle(fileItem.id, e.target.value)}
                              className="text-lg font-medium border-none p-0 h-auto"
                              placeholder="Enter title..."
                            />
                            <p className="text-sm text-gray-500">
                              {fileItem.file.name} ({Math.round(fileItem.file.size / 1024)}KB)
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={getStatusColor(fileItem.status)}>
                              {fileItem.status}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(fileItem.id)}
                              disabled={fileItem.status === 'uploading'}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <Textarea
                          placeholder="Add description (optional)"
                          value={fileItem.description}
                          onChange={(e) => updateFileDescription(fileItem.id, e.target.value)}
                          rows={2}
                        />
                        {fileItem.error && (
                          <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{fileItem.error}</AlertDescription>
                          </Alert>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* URL Contents List */}
      {urlContents.length > 0 && (
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>URLs to Process</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {urlContents.map((urlItem) => (
                <div key={urlItem.id} className="border rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-gray-100 rounded">
                      {urlItem.type === 'youtube' ? (
                        <Video className="h-5 w-5 text-red-600" />
                      ) : (
                        <Globe className="h-5 w-5 text-green-600" />
                      )}
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Input
                            value={urlItem.title}
                            onChange={(e) => updateUrlTitle(urlItem.id, e.target.value)}
                            className="text-lg font-medium border-none p-0 h-auto"
                            placeholder="Enter title..."
                          />
                          <p className="text-sm text-gray-500">{urlItem.url}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(urlItem.status)}>
                            {urlItem.status}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeUrlContent(urlItem.id)}
                            disabled={urlItem.status === 'processing'}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <Textarea
                        placeholder="Add description (optional)"
                        value={urlItem.description}
                        onChange={(e) => updateUrlDescription(urlItem.id, e.target.value)}
                        rows={2}
                      />
                      {urlItem.error && (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{urlItem.error}</AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Text Contents List */}
      {textContents.length > 0 && (
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Text Contents to Process</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {textContents.map((textItem) => (
                <div key={textItem.id} className="border rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-gray-100 rounded">
                      <FileText className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium">{textItem.title}</h3>
                          <p className="text-sm text-gray-500">
                            {textItem.text.length} characters
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(textItem.status)}>
                            {textItem.status}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeTextContent(textItem.id)}
                            disabled={textItem.status === 'processing'}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 max-h-32 overflow-y-auto">
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">
                          {textItem.text.substring(0, 300)}
                          {textItem.text.length > 300 && '...'}
                        </p>
                      </div>
                      {textItem.error && (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{textItem.error}</AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Process Button */}
      {(uploadedFiles.length > 0 || urlContents.length > 0 || textContents.length > 0) && (
        <motion.div variants={itemVariants}>
          <Card>
            <CardContent className="p-6">
              <Button
                onClick={processAllContent}
                disabled={isProcessing}
                size="lg"
                className="w-full"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing Content...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Process All Content
                  </>
                )}
              </Button>
              <p className="text-sm text-gray-500 text-center mt-2">
                This will upload files, extract content, and generate AI insights
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  )
}
