import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// 検討書データの型定義
interface KentoData {
  id: string;
  title: string;
  description: string;
  content: string;
  status: 'approved' | 'review' | 'draft';
  team: string;
  lastUpdated: string;
  createdBy: string;
  version: string;
  tags: string[];
  icon: string;
  color: string;
}

// 個別検討書データ（実際の実装ではデータベースから取得）
const kentoData: Record<string, KentoData> = {
  'm2r3-2024': {
    id: 'm2r3-2024',
    title: '1B31 上部流調ゲート弁 軸強度検討（標準）',
    description: '高炉グループの炉頂設備の上部流調ゲート弁における軸強度について検討した文書です。',
    content: `
# 1B31 上部流調ゲート弁 軸強度検討（標準）

## 1. 概要
本検討書では、高炉グループの炉頂設備である上部流調ゲート弁の軸強度について検討します。

## 2. 検討対象設備
### 2.1 設備概要
- 設備名: 1B31 上部流調ゲート弁
- 設置場所: 高炉炉頂部
- 機能: 炉頂ガス流量調節
- 運転条件: 高温・高圧環境

### 2.2 主要仕様
- 口径: 800mm
- 設計圧力: 0.5MPa
- 設計温度: 300℃
- 材質: ステンレス鋼（SUS316）

## 3. 軸強度検討
### 3.1 荷重条件
- 内圧荷重: 0.5MPa
- 温度荷重: 300℃
- 地震荷重: 水平震度0.3G
- 風荷重: 風速60m/s

### 3.2 応力解析
#### 3.2.1 有限要素解析
- 解析ソフト: ANSYS
- 要素数: 約50,000要素
- 解析タイプ: 静的解析

#### 3.2.2 解析結果
- 最大応力: 180MPa（軸部）
- 許容応力: 200MPa
- 安全率: 1.11

### 3.3 疲労強度検討
#### 3.3.1 疲労荷重
- 運転サイクル: 年間8,760回
- 設計寿命: 20年
- 疲労強度: 120MPa

#### 3.3.2 疲労解析結果
- 累積損傷度: 0.85
- 疲労安全率: 1.18

## 4. 材料選定
### 4.1 軸材質
- 材質: SUS316
- 降伏強度: 205MPa
- 引張強度: 520MPa
- 耐食性: 優

### 4.2 表面処理
- 表面硬化: 窒化処理
- 硬度: HV800以上
- 硬化深さ: 0.3mm以上

## 5. 製造・検査
### 5.1 製造方法
- 鍛造加工
- 機械加工
- 表面硬化処理
- 最終研磨

### 5.2 検査項目
- 寸法検査
- 硬度検査
- 超音波探傷検査
- 磁粉探傷検査
- 浸透探傷検査

## 6. 運転・保守
### 6.1 運転条件
- 運転温度: 250-300℃
- 運転圧力: 0.3-0.5MPa
- 作動頻度: 1-2回/日

### 6.2 保守計画
- 定期点検: 月1回
- 詳細検査: 年1回
- 軸部検査: 3年毎

## 7. 安全性評価
### 7.1 破損モード解析
- 軸破断: 低リスク
- 軸変形: 中リスク
- 軸腐食: 中リスク

### 7.2 安全対策
- 軸径の余裕設計
- 表面硬化処理
- 定期的な検査実施

## 8. 結論
1B31 上部流調ゲート弁の軸強度検討の結果、以下の結論を得ました：

1. 静的強度: 安全率1.11で十分な強度を有する
2. 疲労強度: 安全率1.18で疲労破壊のリスクは低い
3. 材料選定: SUS316は使用環境に適している
4. 製造・検査: 適切な品質管理が可能である

本検討書に基づき、1B31 上部流調ゲート弁の軸強度は十分であり、安全に運転可能であることを確認しました。
    `,
    status: 'approved',
    team: '高炉グループ',
    lastUpdated: '2024-01-25',
    createdBy: '田中太郎',
    version: 'v5.0.0',
    tags: ['軸強度', 'ゲート弁', '炉頂設備', '標準'],
    icon: '🏭',
    color: 'blue'
  },
  'm2r3-2019': {
    id: 'm2r3-2019',
    title: '1B31 上部流調ゲート弁 軸強度検討（標準）',
    description: '2019年実施の上部流調ゲート弁軸強度検討書です。',
    content: `
# 1B31 上部流調ゲート弁 軸強度検討（標準）- 2019年実施

## 1. 概要
2019年7月に実施した上部流調ゲート弁の軸強度検討書です。

## 2. 検討内容
- 軸強度計算
- 材料選定
- 製造方法検討
- 検査方法検討

## 3. 結果
軸強度は十分であり、安全に運転可能であることを確認しました。
    `,
    status: 'approved',
    team: '高炉グループ',
    lastUpdated: '2019-07-13',
    createdBy: '田中太郎',
    version: 'v4.0.0',
    tags: ['軸強度', 'ゲート弁', '炉頂設備', '標準'],
    icon: '🏭',
    color: 'blue'
  },
  'c2r4-2016': {
    id: 'c2r4-2016',
    title: '1B31 上部流調ゲート弁 軸強度検討（標準）',
    description: '2016年実施の上部流調ゲート弁軸強度検討書です。',
    content: `
# 1B31 上部流調ゲート弁 軸強度検討（標準）- 2016年実施

## 1. 概要
2016年12月に実施した上部流調ゲート弁の軸強度検討書です。

## 2. 検討内容
- 軸強度計算
- 材料選定
- 製造方法検討

## 3. 結果
軸強度は十分であり、安全に運転可能であることを確認しました。
    `,
    status: 'approved',
    team: '高炉グループ',
    lastUpdated: '2016-12-01',
    createdBy: '佐藤花子',
    version: 'v3.0.0',
    tags: ['軸強度', 'ゲート弁', '炉頂設備', '標準'],
    icon: '🏭',
    color: 'blue'
  },
  'n1r5-2010': {
    id: 'n1r5-2010',
    title: '1B31 上部流調ゲート弁 軸強度検討（特例）',
    description: '2010年実施の上部流調ゲート弁軸強度検討書です。',
    content: `
# 1B31 上部流調ゲート弁 軸強度検討（特例）- 2010年実施

## 1. 概要
2010年8月に実施した上部流調ゲート弁の軸強度検討書です。

## 2. 検討内容
- 軸強度計算
- 材料選定

## 3. 結果
軸強度は十分であり、安全に運転可能であることを確認しました。
    `,
    status: 'approved',
    team: '高炉グループ',
    lastUpdated: '2010-08-30',
    createdBy: '山田次郎',
    version: 'v2.0.0',
    tags: ['軸強度', 'ゲート弁', '炉頂設備', '特例'],
    icon: '🏭',
    color: 'blue'
  },
  'arch-001': {
    id: 'arch-001',
    title: '建築構造検討書',
    description: '建築物の構造安全性について検討した文書です。',
    content: `
# 建築構造検討書

## 1. 概要
建築物の構造安全性について検討します。

## 2. 検討内容
- 構造計算
- 材料選定
- 施工方法検討

## 3. 結果
構造安全性は十分であることを確認しました。
    `,
    status: 'approved',
    team: '建築グループ',
    lastUpdated: '2024-01-15',
    createdBy: '建築太郎',
    version: 'v1.0.0',
    tags: ['建築', '構造', '安全性'],
    icon: '🏗️',
    color: 'green'
  },
  'sec-001': {
    id: 'sec-001',
    title: 'セキュリティ検討書',
    description: 'システムのセキュリティについて検討した文書です。',
    content: `
# セキュリティ検討書

## 1. 概要
システムのセキュリティについて検討します。

## 2. 検討内容
- 脅威分析
- 対策検討
- 監視体制

## 3. 結果
セキュリティ対策は適切であることを確認しました。
    `,
    status: 'review',
    team: 'ITグループ',
    lastUpdated: '2024-01-10',
    createdBy: 'IT花子',
    version: 'v2.0.0',
    tags: ['セキュリティ', 'IT', 'システム'],
    icon: '🔒',
    color: 'purple'
  }
};

// ページコンポーネントの型定義
interface PageProps {
  params: {
    kento_id: string;
  };
}

export default function IndividualKentoDetailPage({ params }: PageProps) {
  const { kento_id } = params;
  const kento = kentoData[kento_id];

  // 検討書が見つからない場合
  if (!kento) {
    notFound();
  }

  // ステータスの表示用テキスト
  const statusText = {
    approved: '承認済み',
    review: 'レビュー中',
    draft: '作成中'
  };

  // ステータスの色
  const statusColor = {
    approved: 'text-green-600 bg-green-100',
    review: 'text-yellow-600 bg-yellow-100',
    draft: 'text-gray-600 bg-gray-100'
  };

  // カラー設定
  const colorClasses = {
    blue: 'bg-blue-100 border-blue-200 text-blue-600',
    green: 'bg-green-100 border-green-200 text-green-600',
    purple: 'bg-purple-100 border-purple-200 text-purple-600',
    orange: 'bg-orange-100 border-orange-200 text-orange-600',
    indigo: 'bg-indigo-100 border-indigo-200 text-indigo-600',
    red: 'bg-red-100 border-red-200 text-red-600'
  };

  return (
    <div className="kento-detail-page p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* ナビゲーション */}
        <div className="mb-8">
          <Link href="/knowledge/kento/individual" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← 個別検討書一覧に戻る
          </Link>
        </div>

        {/* メインコンテンツとサイドバーのレイアウト */}
        <div className="flex gap-6">
          {/* メインコンテンツ */}
          <div className="flex-1">
            {/* ヘッダー情報 */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
              <div className="flex items-start gap-6 mb-4">
                <div className={`w-20 h-20 rounded-lg flex items-center justify-center flex-shrink-0 border ${colorClasses[kento.color as keyof typeof colorClasses]}`}>
                  <span className="text-lg">{kento.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl font-bold text-gray-900 mb-3">{kento.title}</h1>
                  <p className="text-gray-600 mb-4 leading-relaxed">{kento.description}</p>
                  
                  {/* メタ情報 */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">検討書ID:</span>
                      <span className="ml-2 font-medium">{kento.id}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">ステータス:</span>
                      <span className={`ml-2 px-2 py-1 rounded text-xs ${statusColor[kento.status]}`}>
                        {statusText[kento.status]}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">担当:</span>
                      <span className="ml-2 font-medium">{kento.team}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">最終更新:</span>
                      <span className="ml-2 font-medium">{kento.lastUpdated}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* タグ */}
              <div className="flex flex-wrap gap-2">
                {kento.tags.map((tag, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* 検討書内容 */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">検討書内容</h2>
              <div className="prose max-w-none">
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
                    {kento.content}
                  </pre>
                </div>
              </div>
            </div>
          </div>

          {/* 右側サイドバー */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 sticky top-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">アクション</h3>
              
              {/* アクションボタン */}
              <div className="space-y-3">
                <button className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-3 border border-blue-200">
                  <span className="material-symbols-outlined text-lg">edit</span>
                  編集
                </button>
                
                <button className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-3 rounded-lg text-sm font-medium transition-colors border border-gray-200 flex items-center justify-center gap-3">
                  <span className="material-symbols-outlined text-lg">print</span>
                  印刷
                </button>
                
                <button className="w-full bg-green-50 hover:bg-green-100 text-green-700 px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-3 border border-green-200">
                  <span className="material-symbols-outlined text-lg">check_circle</span>
                  承認
                </button>
                
                <button className="w-full bg-purple-50 hover:bg-purple-100 text-purple-700 px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-3 border border-purple-200">
                  <span className="material-symbols-outlined text-lg">download</span>
                  エクスポート
                </button>
                
                <button className="w-full bg-orange-50 hover:bg-orange-100 text-orange-700 px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-3 border border-orange-200">
                  <span className="material-symbols-outlined text-lg">share</span>
                  共有
                </button>
              </div>

              {/* 検討書情報 */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-semibold mb-3 text-gray-700">検討書情報</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">作成者:</span>
                    <span className="font-medium">{kento.createdBy}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">バージョン:</span>
                    <span className="font-medium">{kento.version}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">作成日:</span>
                    <span className="font-medium">{kento.lastUpdated}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">更新回数:</span>
                    <span className="font-medium">5回</span>
                  </div>
                </div>
              </div>

              {/* 関連検討書 */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-semibold mb-3 text-gray-700">関連検討書</h4>
                <div className="space-y-2">
                  <Link href="/knowledge/kento/individual/m2r3-2019" className="block text-sm text-blue-600 hover:text-blue-800 hover:underline">
                    📄 M2R3 - 2019年実施
                  </Link>
                  <Link href="/knowledge/kento/individual/c2r4-2016" className="block text-sm text-blue-600 hover:text-blue-800 hover:underline">
                    📄 C2R4 - 2016年実施
                  </Link>
                  <Link href="/knowledge/kento/individual/n1r5-2010" className="block text-sm text-blue-600 hover:text-blue-800 hover:underline">
                    📄 N1R5 - 2010年実施
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 