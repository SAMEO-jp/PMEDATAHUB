const TabNavigation = () => {
  const tabs = [
    "概要", "図面", "3D", "メンバー", "予定表", "議事録", "現場/出張", 
    "タスク管理", "関連Pro", "設計", "製造", "工事", "制御", 
    "Pro資料", "報告書", "会議", "管理"
  ];
  
  return (
    <div className="bg-white border-b border-gray-200">
      <nav className="-mb-px flex space-x-6 px-8" aria-label="Tabs">
        {tabs.map((tab, index) => (
          <a 
            key={tab} 
            href="#" 
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              index === 0 
                ? 'border-indigo-500 text-indigo-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {tab}
          </a>
        ))}
      </nav>
    </div>
  );
};

export default TabNavigation; 