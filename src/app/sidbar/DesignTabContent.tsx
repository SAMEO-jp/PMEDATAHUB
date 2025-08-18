"use client"

// Reactの必要な機能をインポート
import { useState, useEffect } from "react"

// コンポーネントのプロパティ（props）の型定義
// これにより、TypeScriptが型チェックを行い、バグを防ぐことができます
type DesignTabContentProps = {
  /**
   * 現在選択されているイベントの情報
   * 
   * このプロパティの役割：
   * 1. 現在編集中のイベントの全情報を保持
   * 2. 既存の選択状態を復元（以前に選択した設計業務タイプを表示）
   * 3. 業務分類コード生成に必要なサブタブ情報を提供
   * 4. 親コンポーネントとのデータ同期を保つ
   * 5. イベントデータの整合性を維持
   */
  selectedEvent: {
    designSubType?: string  // 既に選択されている設計業務タイプ
    subTabType?: string     // サブタブの種類（計画図、詳細図、組立図、改正図）
    [key: string]: any      // その他のイベント情報（スケジュール、タスク情報など）
  } | null
  updateEvent: (updatedEvent: any) => void
  selectedEquipment: string
}

/**
 * 設計タブの内容を表示するコンポーネント
 * 
 * このコンポーネントは以下の機能を提供します：
 * - 設計業務タイプの選択（チップ形式のボタン）
 * - 選択された業務タイプに基づくコード生成
 * - イベントデータの更新
 */
export const DesignTabContent = ({ selectedEvent, updateEvent, selectedEquipment }: DesignTabContentProps) => {
  // 現在選択されている設計業務タイプを管理する状態（state）
  // useStateはReactのフックで、コンポーネント内で状態を管理するために使用
  const [designSubType, setDesignSubType] = useState<string>("")

  // useEffectは、コンポーネントがマウントされた時や依存関係が変更された時に実行される
  // ここでは、selectedEventが変更されたときに、designSubTypeの状態を更新している
  useEffect(() => {
    // selectedEventが存在する場合のみ処理を実行
    if (selectedEvent) {
      // selectedEventからdesignSubTypeを取得し、存在しない場合は空文字を設定
      setDesignSubType(selectedEvent.designSubType || "")
    }
  }, [selectedEvent]) // selectedEventが変更されたときにのみ実行

  return (
    <>
      {/* 設備情報欄は削除済み */}

      {/* 設計業務マトリックスは親コンポーネントのサブタブに移動済み */}

      {/* 業務タイプ選択セクション（チップ形式のボタン群） */}
      <div className="border-b">
        <div className="px-4 py-2">
          {/* ラベル：設計業務タイプの説明 */}
          <label className="block text-xs font-medium text-gray-500 mb-1">設計業務タイプ</label>
          
          {/* 業務タイプのボタン群を横並びで表示 */}
          <div className="flex flex-wrap gap-2">
            {/* 設計業務タイプの定義配列
                各オブジェクトには、表示名（name）とコード（code）が含まれている */}
            {[
              { name: "検討書作成及びサイン", code: "01" },
              { name: "作図及び作図準備", code: "02" },
              { name: "作図前図面検討会", code: "03" },
              { name: "作図指示", code: "04" },
              { name: "作図（外注あり）", code: "05" },
              { name: "作図後図面検討会", code: "06" },
              { name: "検図", code: "07" },
              { name: "承認作業", code: "08" },
              { name: "出図確認", code: "09" },
              { name: "修正対応", code: "10" },
              { name: "その他", code: "11" },
            ].map((subType) => (
              // map関数で配列の各要素をボタンコンポーネントに変換
              // keyプロパティは、Reactが各要素を識別するために必要
              <button
                key={subType.name}
                // 条件付きクラス名：選択されているかどうかでスタイルを変更
                className={`px-3 py-1.5 rounded-full text-xs ${
                  // 現在選択されている業務タイプと一致する場合
                  designSubType === subType.name
                    ? "bg-blue-100 text-blue-800 font-bold border-2 border-blue-300" // 選択済みスタイル
                    : "bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200" // 未選択スタイル
                }`}
                // ボタンクリック時の処理
                onClick={() => {
                  // 選択された業務タイプを状態に保存
                  setDesignSubType(subType.name)
                  
                  // サブタブタイプに基づいて3桁目の文字を決定
                  // これにより、4桁の業務分類コードを生成する
                  let thirdChar = "0"; // デフォルト値
                  
                  // selectedEventが存在し、subTabTypeプロパティがある場合の処理
                  if (selectedEvent?.subTabType === "計画図") thirdChar = "P";
                  else if (selectedEvent?.subTabType === "詳細図") thirdChar = "S";
                  else if (selectedEvent?.subTabType === "組立図") thirdChar = "K";
                  else if (selectedEvent?.subTabType === "改正図") thirdChar = "R";
                  
                  // 4桁の業務分類コードを生成
                  // 形式：D（設計）+ サブタブ文字 + 業務タイプコード
                  const newCode = `D${thirdChar}${subType.code}`;
                  
                  // 親コンポーネントに更新されたイベントデータを渡す
                  // これにより、親コンポーネントの状態も更新される
                  updateEvent({
                    ...selectedEvent, // 既存のプロパティを展開
                    designSubType: subType.name, // 選択された業務タイプ名
                    designTypeCode: subType.code, // 業務タイプのコード
                    activityCode: newCode, // 生成された4桁コード
                    businessCode: newCode // 業務コードにも同じ値を設定
                  })
                }}
              >
                {/* ボタンに表示する業務タイプ名 */}
                {subType.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 業務分類コード表示はWeekSidebarコンポーネントに移動済み */}
    </>
  )
}
