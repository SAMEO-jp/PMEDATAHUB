"use client"

import { Event } from "../../../types";

interface EventDetailFormProps {
  selectedEvent: Event | null;
  selectedTab: string;
  selectedProjectSubTab: string;
  updateEvent: (event: Event) => void;
  handleDeleteEvent: () => void;
  setSelectedEvent: (event: Event | null) => void;
}

export const EventDetailForm = ({
  selectedEvent,
  selectedTab,
  selectedProjectSubTab,
  updateEvent,
  handleDeleteEvent,
  setSelectedEvent,
}: EventDetailFormProps) => {
  if (!selectedEvent) {
    return null;
  }

  return (
    <div>
      {/* デモ用の簡易コンテンツ */}
      <div className="px-4 py-2 border-b">
        <label className="block text-xs font-medium text-gray-500 mb-1">タイトル</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={selectedEvent.title || ""}
          onChange={(e) => {
            updateEvent({ ...selectedEvent, title: e.target.value });
          }}
        />
      </div>

      <div className="px-4 py-2 border-b">
        <label className="block text-xs font-medium text-gray-500 mb-1">説明</label>
        <textarea
          className="w-full p-2 border rounded h-24"
          value={selectedEvent.description || ""}
          onChange={(e) => {
            updateEvent({ ...selectedEvent, description: e.target.value });
          }}
        ></textarea>
      </div>

      <div className="grid grid-cols-2 border-b">
        {/* 開始時間 */}
        <div className="px-4 py-2">
          <label className="block text-xs font-medium text-gray-500 mb-1">開始時間</label>
          <div className="flex space-x-2">
            {/* 時間セレクト */}
            <select
              className="p-2 border rounded"
              value={String(new Date(selectedEvent.startDateTime).getHours()).padStart(2, "0")}
              onChange={(e) => {
                const newHour = Number(e.target.value);
                const newStart = new Date(selectedEvent.startDateTime);
                newStart.setHours(newHour);
                // 表示位置（top）の再計算（例：1 時間 = 64px）
                const top = newStart.getHours() * 64 + (newStart.getMinutes() / 60) * 64;
                updateEvent({
                  ...selectedEvent,
                  startDateTime: newStart.toISOString(),
                  top,
                });
              }}
            >
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={i.toString().padStart(2, "0")}>
                  {i.toString().padStart(2, "0")}
                </option>
              ))}
            </select>
            {/* 分セレクト */}
            <select
              className="p-2 border rounded"
              value={String(new Date(selectedEvent.startDateTime).getMinutes()).padStart(2, "0")}
              onChange={(e) => {
                const newMinute = Number(e.target.value);
                const newStart = new Date(selectedEvent.startDateTime);
                newStart.setMinutes(newMinute);
                const top = newStart.getHours() * 64 + (newMinute / 60) * 64;
                updateEvent({
                  ...selectedEvent,
                  startDateTime: newStart.toISOString(),
                  top,
                });
              }}
            >
              {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map((m) => (
                <option key={m} value={m.toString().padStart(2, "0")}>
                  {m.toString().padStart(2, "0")}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 終了時間 */}
        <div className="px-4 py-2">
          <label className="block text-xs font-medium text-gray-500 mb-1">終了時間</label>
          <div className="flex space-x-2">
            {/* 時間セレクト */}
            <select
              className="p-2 border rounded"
              value={String(new Date(selectedEvent.endDateTime).getHours()).padStart(2, "0")}
              onChange={(e) => {
                const newHour = Number(e.target.value);
                const newEnd = new Date(selectedEvent.endDateTime);
                newEnd.setHours(newHour);
                // 終了時間の場合、開始時間との時間差から高さを再計算
                const startTime = new Date(selectedEvent.startDateTime);
                const duration = (newEnd.getTime() - startTime.getTime()) / 60000;
                const height = (duration / 60) * 64;
                updateEvent({
                  ...selectedEvent,
                  endDateTime: newEnd.toISOString(),
                  height,
                });
              }}
            >
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={i.toString().padStart(2, "0")}>
                  {i.toString().padStart(2, "0")}
                </option>
              ))}
            </select>
            {/* 分セレクト */}
            <select
              className="p-2 border rounded"
              value={String(new Date(selectedEvent.endDateTime).getMinutes()).padStart(2, "0")}
              onChange={(e) => {
                const newMinute = Number(e.target.value);
                const newEnd = new Date(selectedEvent.endDateTime);
                newEnd.setMinutes(newMinute);
                const startTime = new Date(selectedEvent.startDateTime);
                const duration = (newEnd.getTime() - startTime.getTime()) / 60000;
                const height = (duration / 60) * 64;
                updateEvent({
                  ...selectedEvent,
                  endDateTime: newEnd.toISOString(),
                  height,
                });
              }}
            >
              {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map((m) => (
                <option key={m} value={m.toString().padStart(2, "0")}>
                  {m.toString().padStart(2, "0")}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Only show status field when not in meeting tab */}
      {!(selectedTab === "project" && selectedProjectSubTab === "会議") && (
        <div className="border-b">
          <div className="px-4 py-2">
            <label className="block text-xs font-medium text-gray-500 mb-1">状態</label>
            <div className="relative">
              <select
                className="w-full p-2 border rounded"
                value={selectedEvent.status || "進行中"}
                onChange={(e) => {
                  updateEvent({ ...selectedEvent, status: e.target.value });
                }}
              >
                <option value="進行中">進行中</option>
                <option value="完了">完了</option>
                <option value="中止">中止</option>
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="px-4 py-4 flex justify-center gap-4">
        <button
          onClick={handleDeleteEvent}
          className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium w-48"
        >
          削除
        </button>
        <button
          onClick={() => setSelectedEvent(null)}
          className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-medium w-48"
        >
          閉じる
        </button>
      </div>
    </div>
  );
}; 