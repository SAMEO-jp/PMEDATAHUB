"use client";

import React, { useState } from 'react';
import { LayoutDashboard, Book, Users, Settings, FileText, Briefcase, Plane, Bell, UserCircle, Sparkles, Loader2 } from 'lucide-react';

// --- 型定義 ---
interface Member {
  initial: string;
  name: string;
  role: string;
  color: string;
}

interface Schedule {
  date: string;
  event: string;
}

interface Task {
  name: string;
  status: string;
  deadline: string;
}

interface Drawing {
  id: string;
  name: string;
  revision: string;
  creator: string;
  date: string;
  status: string;
  equipmentNumber: string;
  drawingType: string;
}

interface TabNavigationProps {
  activeTab: string;
  onTabClick: (tab: string) => void;
}

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

interface QuickLinkCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}

interface TaskStatusLabelProps {
  status: string;
  deadline: string;
}

interface ChipProps {
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

// --- ダミーデータ ---
const members: Member[] = [
  { initial: 'S', name: '鈴木 一郎', role: 'マネージャー', color: 'bg-blue-500' },
  { initial: 'S', name: '佐藤 二郎', role: 'エンジニア', color: 'bg-green-500' },
  { initial: 'T', name: '田中 三郎', role: '設計', color: 'bg-yellow-500' },
  { initial: 'T', name: '高橋 四郎', role: '工事', color: 'bg-red-500' },
];

const schedule: Schedule[] = [
  { date: '2025/07/10', event: 'キックオフミーティング' },
  { date: '2025/07/15', event: '基本設計レビュー' },
  { date: '2025/07/22', event: '詳細設計レビュー' },
  { date: '2025/08/01', event: '製造開始' },
  { date: '2025/08/10', event: '工事着工' },
  { date: '2025/08/20', event: '中間報告会' },
];

const tasks: Task[] = [
  { name: '基本設計書作成', status: '依頼済', deadline: '3日' },
  { name: '詳細設計書作成', status: '納期', deadline: '10日' },
  { name: '部品発注', status: '依頼済', deadline: '5日' },
  { name: '工事計画書作成', status: '納期', deadline: '7日' },
  { name: 'テスト計画書作成', status: '納期', deadline: '12日' },
];

const drawings: Drawing[] = [
    { id: 'A-001-C', name: '全体組立図', revision: 'C', creator: '設計部', date: '2025/06/15', status: '承認済', equipmentNumber: 'EBXX0025002', drawingType: '組図' },
    { id: 'B-101-A', name: '基礎構造図', revision: 'A', creator: '設計部', date: '2025/06/20', status: 'レビュー中', equipmentNumber: 'EBXX0025002', drawingType: '詳細図' },
    { id: 'C-205-B', name: '電気配線図', revision: 'B', creator: '電気設計', date: '2025/06/25', status: '承認済', equipmentNumber: 'EBXX0025003', drawingType: '詳細図' },
    { id: 'D-300-D', name: '部品図 - フレーム', revision: 'D', creator: '設計部', date: '2025/07/01', status: '承認済', equipmentNumber: 'EBXX0025002', drawingType: '詳細図' },
    { id: 'D-301-A', name: '部品図 - パネル', revision: 'A', creator: '設計部', date: '2025/07/01', status: '作成中', equipmentNumber: 'EBXX0025003', drawingType: '詳細図' },
    { id: 'E-050-A', name: '制御盤レイアウト図', revision: 'A', creator: '電気設計', date: '2025/07/03', status: 'レビュー中', equipmentNumber: 'EBXX0025002', drawingType: '組図' },
    { id: 'F-110-B', name: '配管系統図', revision: 'B', creator: '設計部', date: '2025/07/05', status: '承認済', equipmentNumber: 'EBXX0025004', drawingType: '組図' },
];

const equipmentNumbers = ['すべて', ...drawings.map(d => d.equipmentNumber).filter((value, index, self) => self.indexOf(value) === index)];
const drawingTypes = ['すべて', '組図', '詳細図'];


// --- コンポーネント ---

const Sidebar = () => (
  <aside className="w-64 bg-gray-800 text-white flex flex-col flex-shrink-0">
    <div className="h-16 flex items-center justify-center text-2xl font-bold">PMEデータHUB</div>
    <nav className="flex-1 px-4 py-6 space-y-2">
      <a href="#" className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md"><LayoutDashboard className="mr-3" size={20} />プロジェクト概要</a>
      <a href="#" className="flex items-center px-4 py-2 bg-gray-900 text-white rounded-md"><Book className="mr-3" size={20} />プロジェクト管理</a>
      <a href="#" className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md"><Users className="mr-3" size={20} />設計管理</a>
      <a href="#" className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md"><FileText className="mr-3" size={20} />関連図書</a>
      <a href="#" className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md"><Settings className="mr-3" size={20} />設定</a>
    </nav>
  </aside>
);

const Header = () => (
  <header className="bg-white shadow-sm h-16 flex items-center justify-between px-8 flex-shrink-0">
    <div className="flex items-center text-sm text-gray-500"><span>電気集塵機VS-ESCS開発 (EBXX0025002)</span></div>
    <div className="flex items-center space-x-4">
      <Bell size={20} className="text-gray-600" />
      <UserCircle size={24} className="text-gray-600" />
      <span className="text-sm font-medium">担当者名</span>
    </div>
  </header>
);

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabClick }) => {
    const tabs = ["概要", "図面", "3D", "メンバー", "予定表", "議事録", "現場/出張", "タスク管理", "関連Pro", "設計", "製造", "工事", "制御", "Pro資料", "報告書", "会議", "管理"];
    return (
        <div className="bg-white border-b border-gray-200 flex-shrink-0">
            <nav className="-mb-px flex space-x-6 px-8 overflow-x-auto" aria-label="Tabs">
                {tabs.map((tab) => (
                    <button key={tab} onClick={() => onTabClick(tab)} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm focus:outline-none ${activeTab === tab ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                        {tab}
                    </button>
                ))}
            </nav>
        </div>
    );
};

const Card: React.FC<CardProps> = ({ title, children, className = '' }) => (
  <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
    {title && <h3 className="font-bold text-gray-800 mb-4">{title}</h3>}
    <div>{children}</div>
  </div>
);

const QuickLinkCard: React.FC<QuickLinkCardProps> = ({ icon, title, subtitle }) => (
    <div className="bg-white rounded-lg shadow-md p-5 flex items-center">
        <div className="p-3 bg-indigo-100 rounded-lg mr-4">{icon}</div>
        <div>
            <h4 className="font-bold text-gray-800">{title}</h4>
            <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
    </div>
);

const TaskStatusLabel: React.FC<TaskStatusLabelProps> = ({ status, deadline }) => {
    const baseClasses = "text-xs font-bold px-2 py-1 rounded-full";
    const statusClass = status === "依頼済" ? "bg-blue-100 text-blue-800" : "bg-red-100 text-red-800";
    return (
        <div className="flex items-center">
            <span className={`${baseClasses} ${statusClass}`}>{status}</span>
            <span className="ml-auto text-sm text-gray-600">納期: {deadline}</span>
        </div>
    );
};

// --- Gemini API連携コンポーネント ---
const AISummaryCard = () => {
    const [summary, setSummary] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const generateSummary = async (): Promise<void> => {
        setIsLoading(true);
        setError('');
        setSummary('');

        const prompt = `
あなたは優秀なプロジェクトマネージャーです。以下のプロジェクトデータに基づいて、現在のプロジェクト状況をマークダウン形式で要約し、潜在的なリスクと次のステップを提案してください。

# プロジェクト概要
- プロジェクト名: 電気集塵機VS-ESCS開発
- プロジェクト番号: EBXX0025002
- 全体進捗率: 35%

# 参加メンバー
${members.map(m => `- ${m.name} (${m.role})`).join('\n')}

# 直近の予定
${schedule.slice(0,5).map(s => `- ${s.date}: ${s.event}`).join('\n')}

# 未完了タスク
${tasks.map(t => `- ${t.name} (ステータス: ${t.status}, 納期: ${t.deadline})`).join('\n')}

# 出力形式
### プロジェクトサマリー
(ここに簡潔なサマリーを記述)

### 潜在的なリスク
(ここに考えられるリスクを箇条書きで記述)

### 次のステップ
(ここに推奨されるアクションを箇条書きで記述)
`;

        try {
            const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
            const payload = { contents: chatHistory };
            const apiKey = ""; // APIキーは環境で設定されるため空
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
            
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.statusText}`);
            }

            const result = await response.json() as any;
            
            if (result.candidates && result.candidates.length > 0 && result.candidates[0].content && result.candidates[0].content.parts && result.candidates[0].content.parts.length > 0) {
                const text = result.candidates[0].content.parts[0].text as string;
                setSummary(text);
            } else {
                throw new Error("AIからの応答が予期した形式ではありません。");
            }
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : 'サマリーの生成中にエラーが発生しました。';
            setError(errorMessage);
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGenerateClick = (): void => {
        void generateSummary();
    };

    return (
        <Card className="mb-6">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-bold text-gray-800">AI プロジェクトアシスタント</h3>
                    <p className="text-sm text-gray-500 mt-1">現在のプロジェクト状況からサマリーを生成します。</p>
                </div>
                <button onClick={handleGenerateClick} disabled={isLoading} className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:bg-indigo-300 transition-colors">
                    {isLoading ? <Loader2 className="animate-spin mr-2" size={20} /> : <Sparkles size={20} className="mr-2" />}
                    {isLoading ? '生成中...' : 'サマリーを生成'}
                </button>
            </div>
            {error && <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">{error}</div>}
            {summary && <div className="mt-4 p-4 bg-gray-50 rounded-md prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: summary.replace(/\n/g, '<br/>') }} />}
        </Card>
    );
};


// --- タブごとのビュー ---

const OverviewContent = () => (
    <>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-9">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-6">
                    <QuickLinkCard icon={<FileText className="text-indigo-600" />} title="プロジェクト運営資料" subtitle="各種プロジェクト管理ドキュメント" />
                    <QuickLinkCard icon={<Briefcase className="text-indigo-600" />} title="関連プロジェクト" subtitle="連携する他プロジェクト情報" />
                    <QuickLinkCard icon={<Users className="text-indigo-600" />} title="参加メンバー" subtitle="メンバーリストと連絡先" />
                    <QuickLinkCard icon={<Plane className="text-indigo-600" />} title="工事資料" subtitle="工事関連ドキュメント" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card title="プロジェクト進捗率">
                        <div className="text-center"><p className="text-6xl font-bold text-indigo-600">35%</p></div>
                        <div className="w-full bg-gray-200 rounded-full h-4 mt-4">
                            <div className="bg-indigo-600 h-4 rounded-full" style={{ width: '35%' }}></div>
                        </div>
                        <div className="flex justify-between text-sm text-gray-500 mt-2"><span>計画</span><span>設計</span><span>製造</span><span>完了</span></div>
                    </Card>
                    <Card title="契約状況サマリー">
                        <div className="flex justify-around text-center h-full items-center">
                            <div><p className="text-3xl font-bold text-gray-800">2</p><p className="text-sm text-gray-500">締結済</p></div>
                            <div><p className="text-3xl font-bold text-gray-800">1</p><p className="text-sm text-gray-500">審査中</p></div>
                            <div><p className="text-3xl font-bold text-gray-800">1</p><p className="text-sm text-gray-500">交渉中</p></div>
                        </div>
                    </Card>
                </div>
            </div>
            <div className="lg:col-span-3">
                <Card title="タスク管理">
                    <ul className="space-y-4">
                        {tasks.map(task => (
                            <li key={task.name} className="flex items-center justify-between pb-2 border-b border-gray-100 last:border-b-0">
                                <p className="text-sm font-medium text-gray-800">{task.name}</p>
                                <TaskStatusLabel status={task.status} deadline={task.deadline} />
                            </li>
                        ))}
                    </ul>
                </Card>
            </div>
        </div>
    </>
);

const DrawingsContent = () => {
    const [selectedEquipment, setSelectedEquipment] = useState<string>('すべて');
    const [selectedType, setSelectedType] = useState<string>('すべて');

    const getStatusBadge = (status: string): string => {
        switch (status) {
            case '承認済': return 'bg-green-100 text-green-800';
            case 'レビュー中': return 'bg-yellow-100 text-yellow-800';
            case '作成中': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const filteredDrawings = drawings
        .filter(d => selectedEquipment === 'すべて' || d.equipmentNumber === selectedEquipment)
        .filter(d => selectedType === 'すべて' || d.drawingType === selectedType);

    const Chip: React.FC<ChipProps> = ({ label, isSelected, onClick }) => (
        <button onClick={onClick} className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${isSelected ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
            {label}
        </button>
    );

    return (
        <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200">
                <div className="mb-4">
                    <label className="text-sm font-semibold text-gray-600 mr-4">装置番号:</label>
                    <div className="inline-flex items-center space-x-2">
                        {equipmentNumbers.map(eq => <Chip key={eq} label={eq} isSelected={selectedEquipment === eq} onClick={() => setSelectedEquipment(eq)} />)}
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <h2 className="text-xl font-bold text-gray-800">図面一覧</h2>
                        {drawingTypes.map(type => <Chip key={type} label={type} isSelected={selectedType === type} onClick={() => setSelectedType(type)} />)}
                    </div>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-600">
                    <thead className="bg-gray-50 text-xs text-gray-700 uppercase">
                        <tr>
                            <th scope="col" className="px-6 py-3">図面番号</th>
                            <th scope="col" className="px-6 py-3">図面名</th>
                            <th scope="col" className="px-6 py-3">改訂</th>
                            <th scope="col" className="px-6 py-3">ステータス</th>
                            <th scope="col" className="px-6 py-3">作成者</th>
                            <th scope="col" className="px-6 py-3">更新日</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredDrawings.map((drawing) => (
                            <tr key={drawing.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">{drawing.id}</td>
                                <td className="px-6 py-4">{drawing.name}</td>
                                <td className="px-6 py-4 text-center">{drawing.revision}</td>
                                <td className="px-6 py-4"><span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(drawing.status)}`}>{drawing.status}</span></td>
                                <td className="px-6 py-4">{drawing.creator}</td>
                                <td className="px-6 py-4">{drawing.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// メインのAppコンポーネント
export default function App() {
  const [activeTab, setActiveTab] = useState<string>('概要');

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <TabNavigation activeTab={activeTab} onTabClick={setActiveTab} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-8">
          {activeTab === '概要' && <div><AISummaryCard /><OverviewContent /></div>}
          {activeTab === '図面' && <DrawingsContent />}
          {/* 他のタブのコンテンツもここに追加できます */}
        </main>
      </div>
    </div>
  );
}
