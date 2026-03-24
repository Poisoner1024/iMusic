'use client'

import { useState } from 'react'
import { ArrowLeft, Upload, X, Check, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { addVideo } from '@/lib/videoStore'
import { Video } from '@/types'

export default function UploadPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    performer: '',
    instrument: 'piano',
    category: 'piano',
    tags: '',
  })

  const instruments = [
    { id: 'piano', name: '钢琴', icon: '🎹' },
    { id: 'guitar', name: '吉他', icon: '🎸' },
    { id: 'violin', name: '大提琴', icon: '🎻' },
    { id: 'drum', name: '架子鼓', icon: '🥁' },
    { id: 'guzheng', name: '二胡', icon: '🪕' },
    { id: 'vocal', name: '声乐', icon: '🎤' },
    { id: 'other', name: '其他', icon: '🎵' },
  ]

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('video/')) {
      setSelectedFile(file)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  const handleSubmit = async () => {
    if (!selectedFile || !formData.title || !formData.performer) {
      alert('请填写所有必填项')
      return
    }

    setIsUploading(true)
    try {
      // 模拟文件上传（实际项目中应该上传到云存储）
      await new Promise((resolve) => setTimeout(resolve, 2000))
      
      // 直接创建视频对象并保存到 localStorage
      const newVideo: Video = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        thumbnail: 'https://images.unsplash.com/photo-1514117445516-2ecfc9c4ec90?w=800&h=450&fit=crop',
        videoUrl: '#',
        performer: formData.performer,
        instrument: instruments.find(i => i.id === formData.instrument)?.name || '其他',
        duration: '0:00',
        uploadedAt: new Date().toISOString().split('T')[0],
        views: 0,
        likes: 0,
        category: formData.category,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [],
      }
      
      // 保存视频数据
      addVideo(newVideo)
      
      setStep(3)
    } catch (error) {
      console.error('Upload error:', error)
      alert('上传失败，请重试')
    } finally {
      setIsUploading(false)
    }
  }

  const handleReset = () => {
    setStep(1)
    setSelectedFile(null)
    setIsUploading(false)
    setFormData({
      title: '',
      description: '',
      performer: '',
      instrument: 'piano',
      category: 'piano',
      tags: '',
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            返回首页
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">发布视频</h1>
        </div>

        <div className="mx-auto max-w-4xl">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-4">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      step >= s
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {step > s ? <Check className="h-5 w-5" /> : s}
                  </div>
                  {s < 3 && (
                    <div
                      className={`h-1 w-16 ${
                        step > s ? 'bg-primary-600' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-center gap-20 text-sm text-gray-600">
              <span>上传视频</span>
              <span>填写信息</span>
              <span>完成发布</span>
            </div>
          </div>

          {/* Step 1: Upload */}
          {step === 1 && (
            <div className="rounded-xl bg-white p-8 shadow-lg">
              <h2 className="mb-6 text-xl font-semibold text-gray-900">
                上传视频文件
              </h2>

              <input
                id="fileInput"
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              {!selectedFile ? (
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() => document.getElementById('fileInput')?.click()}
                  className="mb-8 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-12 transition-colors hover:border-primary-500 hover:bg-primary-50"
                >
                  <Upload className="mb-4 h-16 w-16 text-gray-400" />
                  <p className="mb-2 text-lg font-medium text-gray-700">
                    拖拽视频文件到这里，或点击上传
                  </p>
                  <p className="text-sm text-gray-500">
                    支持 MP4, WebM, Ogg 格式，最大 500MB
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      document.getElementById('fileInput')?.click()
                    }}
                    className="mt-6 rounded-lg bg-primary-600 px-6 py-3 font-medium text-white transition-colors hover:bg-primary-700"
                  >
                    选择文件
                  </button>
                </div>
              ) : (
                <div className="mb-8 rounded-lg bg-primary-50 p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-600 text-white">
                      <Upload className="h-8 w-8" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        {selectedFile.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatFileSize(selectedFile.size)}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedFile(null)}
                      className="rounded-full p-2 text-gray-500 hover:bg-gray-200"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  onClick={() => setStep(2)}
                  disabled={!selectedFile}
                  className={`rounded-lg px-8 py-3 font-medium text-white transition-colors ${
                    selectedFile
                      ? 'bg-primary-600 hover:bg-primary-700'
                      : 'cursor-not-allowed bg-gray-400'
                  }`}
                >
                  下一步
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Info */}
          {step === 2 && (
            <div className="rounded-xl bg-white p-8 shadow-lg">
              <h2 className="mb-6 text-xl font-semibold text-gray-900">
                填写视频信息
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    视频标题 *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="请输入视频标题"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    视频描述
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="描述一下你的演奏经历或感受..."
                    rows={4}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      演奏者姓名 *
                    </label>
                    <input
                      type="text"
                      value={formData.performer}
                      onChange={(e) =>
                        setFormData({ ...formData, performer: e.target.value })
                      }
                      placeholder="你的名字"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      乐器类型 *
                    </label>
                    <select
                      value={formData.instrument}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          instrument: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                    >
                      {instruments.map((inst) => (
                        <option key={inst.id} value={inst.id}>
                          {inst.icon} {inst.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    标签
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) =>
                      setFormData({ ...formData, tags: e.target.value })
                    }
                    placeholder="用逗号分隔，如: 钢琴, 古典, 家庭"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="rounded-lg border border-gray-300 px-8 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  上一步
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isUploading || !formData.title || !formData.performer}
                  className={`rounded-lg px-8 py-3 font-medium text-white transition-colors ${
                    isUploading || !formData.title || !formData.performer
                      ? 'cursor-not-allowed bg-gray-400'
                      : 'bg-primary-600 hover:bg-primary-700'
                  }`}
                >
                  {isUploading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      上传中...
                    </span>
                  ) : (
                    '发布视频'
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Complete */}
          {step === 3 && (
            <div className="rounded-xl bg-white p-8 shadow-lg">
              <div className="mb-8 text-center">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                  <Check className="h-10 w-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  视频上传成功！
                </h2>
                <p className="mt-2 text-gray-600">
                  你的视频正在处理中，将在几分钟后上线
                </p>
              </div>

              <div className="mb-8 rounded-lg bg-gray-50 p-6">
                <h3 className="mb-4 font-medium text-gray-900">视频信息</h3>
                <dl className="space-y-2">
                  <div className="flex">
                    <dt className="w-24 text-sm text-gray-600">标题:</dt>
                    <dd className="flex-1 text-sm font-medium text-gray-900">
                      {formData.title}
                    </dd>
                  </div>
                  <div className="flex">
                    <dt className="w-24 text-sm text-gray-600">演奏者:</dt>
                    <dd className="flex-1 text-sm font-medium text-gray-900">
                      {formData.performer}
                    </dd>
                  </div>
                  <div className="flex">
                    <dt className="w-24 text-sm text-gray-600">乐器:</dt>
                    <dd className="flex-1 text-sm font-medium text-gray-900">
                      {instruments.find((i) => i.id === formData.instrument)?.name}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="flex justify-center gap-4">
                <Link
                  href="/"
                  className="rounded-lg border border-gray-300 px-8 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  返回首页
                </Link>
                <button
                  onClick={handleReset}
                  className="rounded-lg bg-primary-600 px-8 py-3 font-medium text-white transition-colors hover:bg-primary-700"
                >
                  再传一个
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
