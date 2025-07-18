// ==========================================
// 変更記録
// 2025-01-XX MBOMページをPALET_LISTにリダイレクト
// ==========================================

'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function MBOMPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.project_id as string

  useEffect(() => {
    // PALET_LISTページにリダイレクト
    router.push(`/app_project/${projectId}/mbom/palet-list`)
  }, [router, projectId])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">PALET_LISTページにリダイレクト中...</p>
      </div>
    </div>
  )
} 