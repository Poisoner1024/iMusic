import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // 简单的健康检查，返回服务器状态
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    return NextResponse.json(
      { error: 'Health check failed', details: errorMessage },
      { status: 500 }
    )
  }
}