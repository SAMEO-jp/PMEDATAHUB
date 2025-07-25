import { useState, useEffect } from 'react';

// デモ用のダミーデータ
const createDemoEvents = (year: number, week: number) => {
  const startDate = new Date(year, 0, 1);
  const weekStart = new Date(startDate.getTime() + (week - 1) * 7 * 24 * 60 * 60 * 1000);
  
  return [
    {
      id: "demo-1",
      keyID: "demo-1",
      title: "プロジェクト会議",
      description: "週次プロジェクト進捗確認",
      startDateTime: new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + 1, 9, 0).toISOString(),
      endDateTime: new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + 1, 10, 30).toISOString(),
      project: "PRJ001",
      category: "会議",
      color: "#3788d8",
      employeeNumber: "999999",
      top: 9 * 64,
      height: 96,
      unsaved: false
    },
    {
      id: "demo-2",
      keyID: "demo-2",
      title: "設計作業",
      description: "詳細設計書作成",
      startDateTime: new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + 2, 13, 0).toISOString(),
      endDateTime: new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + 2, 17, 0).toISOString(),
      project: "PRJ002",
      category: "設計",
      color: "#43a047",
      employeeNumber: "999999",
      top: 13 * 64,
      height: 256,
      unsaved: false
    },
    {
      id: "demo-3",
      keyID: "demo-3",
      title: "研修",
      description: "新技術研修",
      startDateTime: new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + 3, 10, 0).toISOString(),
      endDateTime: new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + 3, 12, 0).toISOString(),
      project: "研修",
      category: "研修",
      color: "#8e24aa",
      employeeNumber: "999999",
      top: 10 * 64,
      height: 128,
      unsaved: false
    }
  ];
};

const createDemoWorkTimes = (year: number, week: number) => {
  const workTimes = [];
  const startDate = new Date(year, 0, 1);
  const weekStart = new Date(startDate.getTime() + (week - 1) * 7 * 24 * 60 * 60 * 1000);
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart.getTime() + i * 24 * 60 * 60 * 1000);
    const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    
    workTimes.push({
      date: dateString,
      startTime: "09:00",
      endTime: "18:00"
    });
  }
  
  return workTimes;
};

const createDemoEmployees = () => [
  {
    employeeNumber: "999999",
    name: "デモユーザー",
    department: "開発部",
    position: "エンジニア",
    isActive: true
  },
  {
    employeeNumber: "888888",
    name: "田中太郎",
    department: "設計部",
    position: "主任",
    isActive: true
  },
  {
    employeeNumber: "777777",
    name: "佐藤花子",
    department: "営業部",
    position: "マネージャー",
    isActive: true
  }
];

const createDemoProjects = () => [
  {
    id: "PRJ001",
    name: "プロジェクトA",
    number: "PRJ001",
    category: "開発",
    color: "#3788d8"
  },
  {
    id: "PRJ002",
    name: "プロジェクトB",
    number: "PRJ002",
    category: "設計",
    color: "#43a047"
  },
  {
    id: "PRJ003",
    name: "プロジェクトC",
    number: "PRJ003",
    category: "保守",
    color: "#8e24aa"
  }
];

export const useDemoData = (year: number, week: number) => {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<any[]>([]);
  const [workTimes, setWorkTimes] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>({
    employeeNumber: "999999",
    name: "デモユーザー",
    department: "開発部",
    position: "エンジニア"
  });

  useEffect(() => {
    // デモデータの初期化（実際のAPI呼び出しは行わない）
    const initializeDemoData = () => {
      setLoading(true);
      
      // ダミーデータの作成
      const demoEvents = createDemoEvents(year, week);
      const demoWorkTimes = createDemoWorkTimes(year, week);
      const demoEmployees = createDemoEmployees();
      const demoProjects = createDemoProjects();
      
      // 状態の更新
      setEvents(demoEvents);
      setWorkTimes(demoWorkTimes);
      setEmployees(demoEmployees);
      setProjects(demoProjects);
      
      setLoading(false);
    };

    initializeDemoData();
  }, [year, week]);

  return {
    loading,
    events,
    workTimes,
    employees,
    projects,
    currentUser
  };
}; 