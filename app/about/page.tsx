import { Header } from '@/components/Header'
import { Target, Trophy, Heart, Sparkles, Users, Play, Music } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 py-20 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="container mx-auto relative px-4 text-center">
          <h1 className="mb-4 text-5xl font-bold md:text-6xl">
            IM 公益声传社团
          </h1>
          <p className="mb-8 text-2xl font-semibold text-primary-100">
            把音乐快乐带给每个家庭
          </p>
          <p className="text-xl text-primary-100">
            MUSIC HAPPY TO LIFE HAPPINESS
          </p>
        </div>
      </section>

      {/* 核心理念 */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="mb-12 text-center text-4xl font-bold text-gray-900">
          我们的理念
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl bg-white p-8 text-center shadow-xl transition-transform hover:-translate-y-1">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary-100">
              <Target className="h-10 w-10 text-primary-600" />
            </div>
            <h3 className="mb-4 text-2xl font-bold text-gray-900">使命</h3>
            <p className="text-lg text-gray-600">
              把音乐快乐带给每个家庭
            </p>
          </div>
          <div className="rounded-2xl bg-white p-8 text-center shadow-xl transition-transform hover:-translate-y-1">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary-100">
              <Trophy className="h-10 w-10 text-primary-600" />
            </div>
            <h3 className="mb-4 text-2xl font-bold text-gray-900">愿景</h3>
            <p className="text-lg text-gray-600">
              MUSIC HAPPY TO LIFE HAPPINESS
            </p>
          </div>
          <div className="rounded-2xl bg-white p-8 text-center shadow-xl transition-transform hover:-translate-y-1">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary-100">
              <Heart className="h-10 w-10 text-primary-600" />
            </div>
            <h3 className="mb-4 text-2xl font-bold text-gray-900">理念</h3>
            <p className="text-lg text-gray-600">
              言传不如身教，身教不如境教
            </p>
          </div>
          <div className="rounded-2xl bg-white p-8 text-center shadow-xl transition-transform hover:-translate-y-1">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary-100">
              <Sparkles className="h-10 w-10 text-primary-600" />
            </div>
            <h3 className="mb-4 text-2xl font-bold text-gray-900">价值观</h3>
            <p className="text-lg text-gray-600">
              向前一步
            </p>
          </div>
        </div>
      </section>

      {/* IM 的含义 */}
      <section className="bg-primary-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-4xl font-bold text-gray-900">
            IM 的含义
          </h2>
          <div className="mx-auto max-w-4xl rounded-2xl bg-white p-12 shadow-xl">
            <div className="space-y-6 text-lg text-gray-700">
              <p>
                <strong className="text-primary-600">IM</strong> 有"我"的含义
              </p>
              <ul className="ml-6 list-disc space-y-3">
                <li>我们每一位会员都是 <strong>IM 的主角</strong></li>
                <li>每一位都是 <strong>IM 的 leader</strong></li>
                <li>IM 未来所有的成就和荣誉 <strong>归属于我们每一位会员</strong></li>
              </ul>
              <p className="mt-8">
                在 IM，每一位会员都是主角，我们一起成长，共同创造美好的音乐世界。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 创始人 */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="mb-12 text-center text-4xl font-bold text-gray-900">
          创始人
        </h2>
        <div className="mx-auto max-w-3xl rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 p-12 text-white shadow-xl">
          <div className="text-center">
            <div className="mb-6 text-6xl">MIYA & IRIS</div>
            <div className="mb-8 space-y-4">
              <p className="text-xl">Idea 的发起人</p>
              <p className="text-xl">第一位 Founder</p>
              <p className="text-xl">会员号 001 & 024</p>
            </div>
            <blockquote className="border-l-4 border-primary-300 pl-6 italic">
              <p className="mb-4 text-2xl">
                "我们的事业是什么？
              </p>
              <p className="mb-4 text-2xl">
                我们的事业将是什么？
              </p>
              <p className="text-2xl">
                我们的事业究竟应该是什么？"
              </p>
              <footer className="mt-6 text-sm text-primary-100">
                —— 彼得·德鲁克
              </footer>
            </blockquote>
            <blockquote className="mt-8 border-l-4 border-primary-300 pl-6 italic">
              <p className="text-2xl">
                "LET'S TOGETHER ENJOY MUSIC HAPPY TO LIFE HAPPINESS"
              </p>
              <footer className="mt-6 text-sm text-primary-100">
                —— MIYA
              </footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* 核心活动 */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-4xl font-bold text-gray-900">
            核心活动
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl bg-white p-8 shadow-xl transition-transform hover:-translate-y-1">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 text-4xl">
                🎸
              </div>
              <h3 className="mb-4 text-2xl font-bold text-gray-900">
                吉他公益课
              </h3>
              <div className="space-y-3 text-gray-600">
                <p>
                  <strong className="text-primary-600">核心：</strong>公益 NO PROFIT
                </p>
                <p>
                  建设公益师资资源，美好的愿景
                </p>
              </div>
            </div>
            <div className="rounded-2xl bg-white p-8 shadow-xl transition-transform hover:-translate-y-1">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 text-4xl">
                👨‍👩‍👧‍👦
              </div>
              <h3 className="mb-4 text-2xl font-bold text-gray-900">
                家庭乐团
              </h3>
              <div className="space-y-3 text-gray-600">
                <p>
                  组建各种形式多元化多样化的家庭乐团 & 音乐会
                </p>
                <p>
                  伟大的使命，美好的愿景
                </p>
              </div>
            </div>
            <div className="rounded-2xl bg-white p-8 shadow-xl transition-transform hover:-translate-y-1">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 text-4xl">
                🎵
              </div>
              <h3 className="mb-4 text-2xl font-bold text-gray-900">
                会员分享
              </h3>
              <div className="space-y-3 text-gray-600">
                <p>
                  分享加入声传公益社团的心路点滴
                </p>
                <p>
                  Enjoy 家庭音乐
                </p>
              </div>
            </div>
            <div className="rounded-2xl bg-white p-8 shadow-xl transition-transform hover:-translate-y-1">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 text-4xl">
                🎪
              </div>
              <h3 className="mb-4 text-2xl font-bold text-gray-900">
                公益路演
              </h3>
              <div className="space-y-3 text-gray-600">
                <p>
                  组织 IM 公益路演，福利机构送温暖
                </p>
                <p>
                  给社会有贡献的特殊单位组织音乐慰问
                </p>
              </div>
            </div>
            <div className="rounded-2xl bg-white p-8 shadow-xl transition-transform hover:-translate-y-1">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 text-4xl">
                🤝
              </div>
              <h3 className="mb-4 text-2xl font-bold text-gray-900">
                社区活动
              </h3>
              <div className="space-y-3 text-gray-600">
                <p>
                  支持社区活动
                </p>
                <p>
                  偏远贫困区走访，找到更需要帮助的群体
                </p>
              </div>
            </div>
            <div className="rounded-2xl bg-white p-8 shadow-xl transition-transform hover:-translate-y-1">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 text-4xl">
                🌍
              </div>
              <h3 className="mb-4 text-2xl font-bold text-gray-900">
                国际交流
              </h3>
              <div className="space-y-3 text-gray-600">
                <p>
                  形式多样化的国际交流
                </p>
                <p>
                  让音乐跨越国界
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 未来愿景 */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="mb-12 text-center text-4xl font-bold text-gray-900">
          未来愿景
        </h2>
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100 p-12 shadow-xl">
            <h3 className="mb-6 text-2xl font-bold text-gray-900">
              IM 是每一位会员的基地
            </h3>
            <p className="mb-4 text-lg text-gray-700">
              家庭陪伴孩子们 & 社团一起共同成长，在 IM 萌发了小种子，激发孵化属于每一位会员"新的 IM"
            </p>
            <p className="text-lg text-gray-700">
              孩子们成为更好的自己，每一个家庭幸福，为社会贡献一份来自感受音乐美好的力量
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl bg-white p-8 shadow-xl transition-transform hover:-translate-y-1">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
                <Music className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="mb-4 text-xl font-bold text-gray-900">
                中西合奏交响乐团
              </h3>
              <p className="text-gray-600">
                鼓励会员们自我学习、自我创造，在这个人工智能的时代
              </p>
            </div>
            <div className="rounded-2xl bg-white p-8 shadow-xl transition-transform hover:-translate-y-1">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
                <Sparkles className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="mb-4 text-xl font-bold text-gray-900">
                HK 注册 & 营地创办
              </h3>
              <p className="text-gray-600">
                在香港申请注册 IM 公益社团，IM 营地创办
              </p>
            </div>
            <div className="rounded-2xl bg-white p-8 shadow-xl transition-transform hover:-translate-y-1">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
                <Users className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="mb-4 text-xl font-bold text-gray-900">
                走向世界
              </h3>
              <p className="text-gray-600">
                IM 走向中国 & 香港，走向世界
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p className="mb-2">© 2024 IM 公益声传社团</p>
          <p className="mb-2">把音乐快乐带给每个家庭</p>
          <p className="text-sm">
            MUSIC HAPPY TO LIFE HAPPINESS
          </p>
        </div>
      </footer>
    </div>
  )
}
