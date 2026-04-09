'use client'

import { useState } from 'react'
import { ArrowLeft, Upload, X, Check, Loader2, Music, Film, Info, Users, Globe } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
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
      // 1. 获取COS上传凭证
      const uploadResponse = await fetch('/api/videos/upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: selectedFile.name,
          fileType: selectedFile.type,
          contentLength: selectedFile.size,
        }),
      })

      if (!uploadResponse.ok) {
        throw new Error('获取上传凭证失败')
      }

      const { uploadUrl, videoKey, videoId } = await uploadResponse.json()

      // 2. 上传视频文件到COS
      const uploadResult = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': selectedFile.type,
        },
        body: selectedFile,
      })

      if (!uploadResult.ok) {
        throw new Error('视频上传失败')
      }

      // 3. 创建视频记录（状态为processing）
      const saveResponse = await fetch('/api/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          performer: formData.performer,
          category: formData.category,
          tags: formData.tags,
          videoKey,
          videoId,
        }),
      })

      if (!saveResponse.ok) {
        throw new Error('保存视频信息失败')
      }

      setStep(3)
    } catch (error) {
      console.error('Upload error:', error)
      alert(`上传失败: ${error instanceof Error ? error.message : '未知错误'}`)
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
      category: 'piano',
      tags: '',
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/80 via-blue-50/60 to-cyan-50/80">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/20 bg-white/90 backdrop-blur-xl shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="rounded-full bg-gradient-to-r from-purple-600 to-blue-600 p-3 shadow-lg">
                <Music className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-700 to-blue-600 bg-clip-text text-transparent">
                IM 公益声传
              </span>
            </Link>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-700 to-blue-600 bg-clip-text text-transparent">发布视频</h1>
            <Link
              href="/"
              className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all border border-purple-200/50"
            >
              <ArrowLeft className="h-5 w-5" />
              返回首页
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-3xl">
          {/* Progress Steps */}
          <div className="mb-12">
            <div className="flex items-center justify-center">
              {[1, 2, 3].map((s, idx) => (
                <div key={s} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-16 w-16 items-center justify-center rounded-2xl font-bold text-lg transition-all ${
                        step > s
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                          : step === s
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25'
                          : 'bg-gradient-to-r from-gray-200 to-gray-300 text-gray-500'
                      }`}
                    >
                      {step > s ? <Check className="h-8 w-8" /> : s}
                    </div>
                    <span className={`mt-3 text-lg font-semibold ${
                      step >= s ? 'text-gray-900' : 'text-gray-400'
                    }`}>
                      {s === 1 ? '上传视频' : s === 2 ? '填写信息' : '完成发布'}
                    </span>
                  </div>
                  {s < 3 && (
                    <div className="w-32 mx-4">
                      <div className={`h-2 rounded-full transition-all ${
                        step > s ? 'bg-gradient-to-r from-green-400 to-emerald-400' : 'bg-gradient-to-r from-gray-200 to-gray-300'
                      }`} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step 1: Upload */}
          {step === 1 && (
            <div className="rounded-3xl bg-white p-8 md:p-12 shadow-xl border border-gray-100">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-rose-100 to-purple-100 mb-4">
                  <Film className="h-8 w-8 text-rose-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">上传视频文件</h2>
                <p className="text-gray-500 mt-2">分享你的音乐，传递快乐</p>
              </div>

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
                  className="mb-8 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 transition-all hover:border-rose-400 hover:bg-rose-50/50"
                >
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-rose-100 to-purple-100 flex items-center justify-center mb-4">
                    <Upload className="h-10 w-10 text-rose-600" />
                  </div>
                  <p className="mb-2 text-lg font-semibold text-gray-900">
                    拖拽视频文件到这里，或点击上传
                  </p>
                  <p className="text-sm text-gray-500">
                    支持 MP4, WebM, Ogg 格式，最大 500MB
                  </p>
                </div>
              ) : (
                <div className="mb-8 rounded-2xl bg-gradient-to-r from-rose-50 to-purple-50 p-6 border border-rose-100">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-r from-rose-600 to-purple-600 text-white shadow-lg">
                      <Film className="h-7 w-7" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">
                        {selectedFile.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatFileSize(selectedFile.size)}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedFile(null)}
                      className="rounded-full p-2 text-gray-500 hover:bg-white hover:shadow-md transition-all"
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
                  className={`rounded-full px-8 py-3 font-semibold text-white transition-all ${
                    selectedFile
                      ? 'bg-gradient-to-r from-rose-600 to-purple-600 shadow-lg shadow-rose-500/25 hover:shadow-xl hover:shadow-rose-500/30 hover:-translate-y-0.5'
                      : 'cursor-not-allowed bg-gray-300'
                  }`}
                >
                  下一步
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Info */}
          {step === 2 && (
            <div className="rounded-3xl bg-white p-8 md:p-12 shadow-xl border border-gray-100">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-rose-100 to-purple-100 mb-4">
                  <Info className="h-8 w-8 text-rose-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">填写视频信息</h2>
                <p className="text-gray-500 mt-2">让更多人了解你的音乐故事</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    视频标题 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="给你的视频起个吸引人的标题"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 focus:border-rose-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 transition-all"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    视频描述
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="描述一下你的演奏经历或感受..."
                    rows={4}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 focus:border-rose-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 transition-all resize-none"
                  />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      演奏者姓名 <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.performer}
                      onChange={(e) =>
                        setFormData({ ...formData, performer: e.target.value })
                      }
                      placeholder="你的名字"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 focus:border-rose-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 transition-all"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      乐器类型 <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          category: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 focus:border-rose-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 transition-all"
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
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    标签
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) =>
                      setFormData({ ...formData, tags: e.target.value })
                    }
                    placeholder="用逗号分隔，如: 钢琴, 古典, 家庭"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 focus:border-rose-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 transition-all"
                  />
                </div>
              </div>

              <div className="mt-10 flex justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="rounded-full border-2 border-gray-200 px-8 py-3 font-semibold text-gray-700 transition-all hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                >
                  上一步
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isUploading || !formData.title || !formData.performer}
                  className={`rounded-full px-8 py-3 font-semibold text-white transition-all ${
                    isUploading || !formData.title || !formData.performer
                      ? 'cursor-not-allowed bg-gray-300'
                      : 'bg-gradient-to-r from-rose-600 to-purple-600 shadow-lg shadow-rose-500/25 hover:shadow-xl hover:shadow-rose-500/30 hover:-translate-y-0.5'
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
            <div className="rounded-3xl bg-white p-8 md:p-12 shadow-xl border border-gray-100 text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 mb-6">
                <Check className="h-12 w-12 text-green-600" />
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                视频上传成功！
              </h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                感谢你的分享！你的视频正在处理中，将在几分钟后上线。
                让我们一起用音乐传递快乐。
              </p>

              <div className="rounded-2xl bg-gradient-to-r from-rose-50 to-purple-50 p-6 mb-8 text-left border border-rose-100">
                <h3 className="font-semibold text-gray-900 mb-4">视频信息</h3>
                <dl className="space-y-3">
                  <div className="flex">
                    <dt className="w-20 text-sm text-gray-500">标题:</dt>
                    <dd className="flex-1 text-sm font-semibold text-gray-900">
                      {formData.title}
                    </dd>
                  </div>
                  <div className="flex">
                    <dt className="w-20 text-sm text-gray-500">演奏者:</dt>
                    <dd className="flex-1 text-sm font-semibold text-gray-900">
                      {formData.performer}
                    </dd>
                  </div>
                  <div className="flex">
                    <dt className="w-20 text-sm text-gray-500">乐器:</dt>
                    <dd className="flex-1 text-sm font-semibold text-gray-900">
                      {instruments.find((i) => i.id === formData.category)?.name}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  href="/"
                  className="rounded-full border-2 border-gray-200 px-8 py-3 font-semibold text-gray-700 transition-all hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                >
                  返回首页
                </Link>
                <button
                  onClick={handleReset}
                  className="rounded-full bg-gradient-to-r from-rose-600 to-purple-600 px-8 py-3 font-semibold text-white shadow-lg shadow-rose-500/25 hover:shadow-xl hover:shadow-rose-500/30 hover:-translate-y-0.5 transition-all"
                >
                  再传一个
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-2">© 2024 IM 公益声传社团. 让每个家庭享受音乐的美好</p>
          <p className="text-gray-400 text-sm">
            用爱传递音乐，用心分享美好
          </p>
        </div>
      </footer>
    </div>
  )
}
