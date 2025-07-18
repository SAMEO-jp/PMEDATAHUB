import { FileText, Briefcase, Users, Plane } from 'lucide-react';
import QuickLinkCard from './QuickLinkCard';
import Card from './Card';
import TaskStatusLabel from './TaskStatusLabel';
import { members, schedule, minutes, tasks, reports } from '../data/mockData';

const DashboardContent = () => {
  return (
    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <QuickLinkCard 
          icon={<FileText className="text-indigo-600" />} 
          title="プロジェクト運営資料" 
          subtitle="各種プロジェクト管理ドキュメント" 
        />
        <QuickLinkCard 
          icon={<Briefcase className="text-indigo-600" />} 
          title="関連プロジェクト" 
          subtitle="連携する他プロジェクト情報" 
        />
        <QuickLinkCard 
          icon={<Users className="text-indigo-600" />} 
          title="参加メンバー" 
          subtitle="メンバーリストと連絡先" 
        />
        <QuickLinkCard 
          icon={<Plane className="text-indigo-600" />} 
          title="工事資料" 
          subtitle="工事関連ドキュメント" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 左側のカラム */}
        <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card title="参加メンバー" seeMore={true} seeMoreText="全メンバー表示" className="lg:col-span-1">
            <ul className="space-y-4">
              {members.map(member => (
                <li key={member.name} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full ${member.color} text-white flex items-center justify-center font-bold mr-4`}>
                    {member.initial}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700">{member.name}</p>
                    <p className="text-sm text-gray-500">{member.role}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Card>

          <Card title="予定表" seeMore={true} seeMoreText="全予定表示" className="lg:col-span-1">
            <ul className="space-y-3">
              {schedule.slice(0, 5).map(item => (
                <li key={item.event} className="flex items-start">
                  <span className="text-sm font-medium text-gray-600 w-24">{item.date}</span>
                  <p className="text-sm text-gray-800">{item.event}</p>
                </li>
              ))}
            </ul>
          </Card>

          <Card title="議事録" seeMore={true} seeMoreText="全議事録表示" className="lg:col-span-1">
            <ul className="space-y-3">
              {minutes.slice(0, 5).map(item => (
                <li key={item.topic} className="flex items-start">
                  <span className="text-sm font-medium text-gray-600 w-24">{item.date}</span>
                  <a href="#" className="text-sm text-indigo-600 hover:underline">{item.topic}</a>
                </li>
              ))}
            </ul>
          </Card>

          <Card title="プロジェクト進捗率" className="lg:col-span-1">
            <div className="text-center">
              <p className="text-6xl font-bold text-indigo-600">35%</p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 mt-4">
              <div className="bg-indigo-600 h-4 rounded-full" style={{ width: '35%' }}></div>
            </div>
            <div className="flex justify-between text-sm text-gray-500 mt-2">
              <span>計画</span>
              <span>設計</span>
              <span>製造</span>
              <span>完了</span>
            </div>
          </Card>

          <Card title="契約状況サマリー" className="lg:col-span-1">
            <div className="flex justify-around text-center h-full items-center">
              <div>
                <p className="text-3xl font-bold text-gray-800">2</p>
                <p className="text-sm text-gray-500">締結済</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-800">1</p>
                <p className="text-sm text-gray-500">審査中</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-800">1</p>
                <p className="text-sm text-gray-500">交渉中</p>
              </div>
            </div>
          </Card>

          <Card title="現場/出張レポート" seeMore={true} seeMoreText="全レポート表示" className="lg:col-span-1">
            <ul className="space-y-3">
              {reports.slice(0, 5).map(item => (
                <li key={item.title} className="flex items-start">
                  <span className="text-sm font-medium text-gray-600 w-24">{item.date}</span>
                  <a href="#" className="text-sm text-indigo-600 hover:underline">{item.title}</a>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* 右側のカラム */}
        <div className="lg:col-span-3">
          <Card title="タスク管理" seeMore={true} seeMoreText="全タスク表示">
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
    </main>
  );
};

export default DashboardContent; 