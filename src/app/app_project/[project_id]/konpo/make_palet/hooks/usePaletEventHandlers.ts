import type { Part, PaletteItem } from '../types/index'
import type { PaletRegistrationData, PaletRegistrationResponse } from '../types/index'

interface UsePaletEventHandlersProps {
  palette: PaletteItem[]
  setPalette: React.Dispatch<React.SetStateAction<PaletteItem[]>>
  createdAt: Date | null
  setCreatedAt: React.Dispatch<React.SetStateAction<Date | null>>
  setUpdatedAt: React.Dispatch<React.SetStateAction<Date | null>>
  setDraggingId: React.Dispatch<React.SetStateAction<string | null>>
  parts: Part[]
  registerPalet: (registrationData: PaletRegistrationData) => Promise<PaletRegistrationResponse | null>
  refetchPaletData?: () => void
}

export const usePaletEventHandlers = ({
  palette,
  setPalette,
  createdAt,
  setCreatedAt,
  setUpdatedAt,
  setDraggingId,
  parts,
  registerPalet,
  refetchPaletData
}: UsePaletEventHandlersProps) => {
  
  // ==========================================
  // パレット登録ハンドラ（新しいテーブル構造対応）
  // ==========================================
  const handleRegister = async (displayName?: string, paletteQuantity?: number) => {
    if (palette.length === 0) {
      alert('パレットに部品が追加されていません')
      return
    }

    try {
      console.log('パレット登録開始:', palette.length, '件')
      console.log('パレット個数:', paletteQuantity)
      console.log('パレット個数の型:', typeof paletteQuantity)
      console.log('パレット個数が1以外か:', paletteQuantity !== 1 && paletteQuantity !== undefined)
      
      // パレットの総数量を計算
      const totalQuantity = palette.reduce((sum, item) => sum + item.selectedQty, 0)
      
      // 新しいAPI構造に合わせて登録データを作成
      const registrationData: PaletRegistrationData = {
        palet_display_name: displayName || `パレット_${Date.now()}`,
        bom_buhin_id: palette[0].partNumber, // 最初の部品のIDを使用
        bom_part_ko: totalQuantity,
        ZUMEN_ID: palette[0].zumenId, // 最初の部品の図面IDを使用
        palet_quantity: paletteQuantity || 1 // パレット個数を追加
      }
      
      console.log('送信する登録データ:', registrationData)
      console.log('登録データのpalet_quantity:', registrationData.palet_quantity)
      console.log('登録データのpalet_quantityの型:', typeof registrationData.palet_quantity)
      
      const response = await registerPalet(registrationData)

      if (!response) {
        throw new Error('パレットの登録に失敗しました')
      }
      
      console.log('登録成功:', response.paletId)

      // 登録成功時の処理
      alert('パレットの登録が完了しました')
      setPalette([]) // パレットをクリア
      setCreatedAt(null)
      setUpdatedAt(null)
      
      // パレットデータを再取得
      if (refetchPaletData) {
        refetchPaletData()
      }
    } catch (error) {
      console.error('パレット登録エラー:', error)
      alert('パレットの登録に失敗しました')
    }
  }

  // ==========================================
  // パレット操作ハンドラ
  // ==========================================
  const handleDrop = (part: Part) => {
    setPalette(prev => {
      const exists = prev.find(p => p.id === part.id)
      if (exists) {
        return prev.map(p =>
          p.id === part.id ? { ...p, selectedQty: p.selectedQty + 1 } : p
        )
      } else {
        if (!createdAt) setCreatedAt(new Date())
        setUpdatedAt(new Date())
        return [
          ...prev,
          { ...part, selectedQty: part.qty },
        ]
      }
    })
    setUpdatedAt(new Date())
  }

  const handleRemove = (id: string) => {
    setPalette(prev => prev.filter(p => p.id !== id))
    setUpdatedAt(new Date())
  }

  const handleQtyChange = (id: string, delta: number) => {
    setPalette(prev =>
      prev.map(p =>
        p.id === id
          ? { ...p, selectedQty: Math.max(1, p.selectedQty + delta) }
          : p
      )
    )
    setUpdatedAt(new Date())
  }

  // 直接入力用の数量変更ハンドラー
  const handleQtyInputChange = (id: string, newQty: number) => {
    setPalette(prev =>
      prev.map(p =>
        p.id === id
          ? { ...p, selectedQty: Math.max(1, newQty) }
          : p
      )
    )
    setUpdatedAt(new Date())
  }

  // ==========================================
  // ドラッグ&ドロップハンドラ
  // ==========================================
  const onDragStart = (id: string) => {
    setDraggingId(id)
    console.log('ドラッグ開始:', id)
  }

  const onDragEnd = () => {
    console.log('ドラッグ終了')
    setDraggingId(null)
  }

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    
    // まずJSONデータから部品情報を取得
    let part: Part | null = null
    
    try {
      const jsonData = e.dataTransfer.getData('application/json')
      if (jsonData) {
        part = JSON.parse(jsonData) as Part
        console.log('JSONから部品を取得:', part.name)
      }
    } catch (error) {
      console.error('JSONデータの解析に失敗:', error)
    }
    
    // JSONデータがない場合は、従来の方法でIDから検索
    if (!part) {
      const draggingId = e.dataTransfer.getData('text/plain')
      console.log('IDから部品を検索:', draggingId)
      
      if (draggingId) {
        part = parts.find(p => p.id === draggingId) || null
        if (part) {
          console.log('IDから部品を取得:', part.name)
        } else {
          console.log('部品が見つかりません:', draggingId)
        }
      } else {
        console.log('ドラッグデータが取得できません')
      }
    }
    
    // 部品が見つかった場合はドロップ処理
    if (part) {
      console.log('部品をドロップ:', {
        name: part.name,
        id: part.id,
        partNumber: part.partNumber,
        zumenId: part.zumenId
      })
      handleDrop(part)
    } else {
      console.error('ドロップする部品が見つかりません')
    }
    
    setDraggingId(null)
  }

  return {
    handleRegister,
    handleDrop,
    handleRemove,
    handleQtyChange,
    handleQtyInputChange,
    onDragStart,
    onDragEnd,
    onDrop
  }
} 