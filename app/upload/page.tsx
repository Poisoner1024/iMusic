'use client'

import { useState } from 'react'
import { ArrowLeft, Upload, X, Check } from 'lucide-react'
import Link from 'next/link'

export default function UploadPage() {
  const [step, setStep] = useState(1)
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
    { id: 'violin', name: '小提琴', icon: '🎻' },
    { id: 'drum', name: '架子鼓', icon: '🥁' },
    { id: 'guzheng', name: '古筝', icon: '🪕' },
    { id: 'vocal', name: '声乐', icon: '🎤' },
    { id: 'other', name: '其他', icon: '🎵' },
  ]

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

              <div className="mb-8 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-12 transition-colors hover:border-primary-500 hover:bg-primary-50">
                <Upload className="mb-4 h-16 w-16 text-gray-400" />
                <p className="mb-2 text-lg font-medium text-gray-700">
                  拖拽视频文件到这里，或点击上传
                </p>
                <p className="text-sm text-gray-500">
                  支持 MP4, WebM, Ogg 格式，最大 500MB
                </p>
                <button className="mt-6 rounded-lg bg-primary-600 px-6 py-3 font-medium text-white transition-colors hover:bg-primary-700">
                  选择文件
                </button>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setStep(2)}
                  className="rounded-lg bg-primary-600 px-8 py-3 font-medium text-white transition-colors hover:bg-primary-700"
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
                  onClick={() => setStep(3)}
                  className="rounded-lg bg-primary-600 px-8 py-3 font-medium text-white transition-colors hover:bg-primary-700"
                >
                  下一步
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
                <button className="rounded-lg bg-primary-600 px-8 py-3 font-medium text-white transition-colors hover:bg-primary-700">
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
