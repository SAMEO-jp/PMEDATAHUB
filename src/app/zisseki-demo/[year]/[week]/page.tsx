"use client"

import { useParams } from "next/navigation"
import { TimeGrid } from "./components/weekgrid"
import { ZissekiSidebar } from "./components/sidebar/ZissekiSidebar"
import { useDemoData } from "./hooks/useDemoData"
import { useDemoUI } from "./hooks/useDemoUI"

// getWeek関数の定義
function getWeek(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

export default function ZissekiDemoPage() {
  const params = useParams();
  const year = Number.parseInt(params.year as string) || new Date().getFullYear();
  const week = Number.parseInt(params.week as string) || getWeek(new Date());

  // デモデータフック
  const {
    events,
    workTimes,
    employees,
    projects,
    currentUser,
    loading
  } = useDemoData(year, week);

  // デモUIフック
  const {
    selectedTab,
    selectedProjectSubTab,
    indirectSubTab,
    selectedEvent,
    hasChanges,
    setSelectedTab,
    setSelectedProjectSubTab,
    setIndirectSubTab,
    setSelectedEvent,
    setHasChanges
  } = useDemoUI();

  // デモイベントハンドラー
  const handleEventClick = (event: any) => {
    setSelectedEvent(event);
  };

  const handleTimeSlotClick = (day: Date, hour: number, minute: number) => {
    // デモ用のイベント作成（実際のデータ処理は行わない）
    const newEvent = {
      id: `demo-${Date.now()}`,
      keyID: `demo-${Date.now()}`,
      title: "デモイベント",
      description: "これはデモ用のイベントです",
      startDateTime: new Date(day.getFullYear(), day.getMonth(), day.getDate(), hour, minute).toISOString(),
      endDateTime: new Date(day.getFullYear(), day.getMonth(), day.getDate(), hour + 1, minute).toISOString(),
      project: "DEMO001",
      category: "会議",
      color: "#3788d8",
      employeeNumber: "999999",
      top: hour * 64 + (minute / 60) * 64,
      height: 64,
      unsaved: true
    };
    
    // デモ用のイベント追加（実際の状態更新は行わない）
    console.log("デモイベント作成:", newEvent);
    setHasChanges(true);
  };

  const handleWorkTimeChange = (date: string, startTime: string, endTime: string) => {
    // デモ用の勤務時間変更（実際のデータ処理は行わない）
    console.log("デモ勤務時間変更:", { date, startTime, endTime });
  };

  const handleDeleteEvent = () => {
    // デモ用のイベント削除（実際のデータ処理は行わない）
    console.log("デモイベント削除");
    setSelectedEvent(null);
    setHasChanges(false);
  };

  const updateEvent = (updatedEvent: any) => {
    // デモ用のイベント更新（実際のデータ処理は行わない）
    console.log("デモイベント更新:", updatedEvent);
    setSelectedEvent(updatedEvent);
    setHasChanges(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex">
        <TimeGrid
          year={year}
          week={week}
          events={events}
          workTimes={workTimes}
          onEventClick={handleEventClick}
          onTimeSlotClick={handleTimeSlotClick}
          onWorkTimeChange={handleWorkTimeChange}
        />
        
        <ZissekiSidebar
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          selectedProjectSubTab={selectedProjectSubTab}
          setSelectedProjectSubTab={setSelectedProjectSubTab}
          selectedEvent={selectedEvent}
          hasChanges={hasChanges}
          handleDeleteEvent={handleDeleteEvent}
          updateEvent={updateEvent}
          employees={employees}
          projects={projects}
          setSelectedEvent={setSelectedEvent}
          currentUser={currentUser}
          indirectSubTab={indirectSubTab}
          setIndirectSubTab={setIndirectSubTab}
        />
      </div>
    </div>
  );
} 