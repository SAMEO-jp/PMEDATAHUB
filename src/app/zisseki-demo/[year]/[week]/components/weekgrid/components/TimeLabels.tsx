// Props型定義 - TimeLabelsコンポーネントで受け取るプロパティ
type TimeLabelsProps = {
  timeSlots: number[];  // 表示する時間スロット配列（時間単位）
}

/**
 * 時間ラベル表示コンポーネント
 * タイムグリッドの左端に時間（○時）を縦に表示し、30分刻みの目盛りも表示する
 */
export const TimeLabels = ({ timeSlots }: TimeLabelsProps) => {
  return (
    <div className="col-span-1 sticky left-0 z-10">
      {/* 各時間スロットに対してラベルを生成 */}
      {timeSlots.map((hour) => (
        <div
          key={hour}
          className="h-16 border-b border-r p-1 text-xs text-right pr-1 bg-gray-50 flex flex-col justify-center w-8"
        >
          {/* 時間表示（例：9時、10時など） */}
          <div>{hour}時</div>
          
          {/* 30分刻みの目盛り表示エリア */}
          <div className="relative h-full">
            {/* 30分の目盛り線 - 各時間スロットの中央（50%位置）に表示 */}
            <div className="absolute w-full border-t border-gray-100" style={{ top: `50%` }}></div>
          </div>
        </div>
      ))}
    </div>
  );
};