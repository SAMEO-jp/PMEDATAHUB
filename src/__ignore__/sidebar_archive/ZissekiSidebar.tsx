"use client"

import React, { useState } from "react";
import { useEventContext } from "../../context/EventContext";
import { TabNavigation } from './components/TabNavigation';
import { getTabConfigs } from './configs/tabConfigs';

interface ZissekiSidebarProps {
  projects: Array<{
    projectCode?: string;
    projectName?: string;
    name?: string;
    isProject?: string;
    projectNumber?: string;
    [key: string]: string | boolean | number | undefined;
  }>;
}

/**
 * 実績入力サイドバーのメインコンポーネント（簡略化版）
 */
"use client"

import React from "react";
import { useEventContext } from "../../context/EventContext";

interface ZissekiSidebarProps {
  projects: Array<{
    projectCode?: string;
    projectName?: string;
    name?: string;
    [key: string]: any;
  }>;
}

/**
 * 実績入力サイドバー（シンプル版）
 * - セレクトイベントのプロパティを表示・編集
 * - 変更内容をイベントに反映
 */
export const ZissekiSidebar = ({ projects }: ZissekiSidebarProps) => {
  const { selectedEvent, updateEvent, setSelectedEvent, deleteEvent } = useEventContext();

  if (!selectedEvent) {
    return (
      <div className="w-80 ml-4">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-bold mb-4">業務詳細</h2>
          <div className="text-center text-gray-500 p-8">
            <p className="text-sm">イベントを選択してください</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 ml-4">
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-bold mb-4">業務詳細</h2>
        
        <div className="space-y-4">
          {/* タイトル */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              タイトル
            </label>
            <input
              type="text"
              value={selectedEvent.title || ""}
              onChange={(e) => {
                updateEvent(selectedEvent.id, {
                  ...selectedEvent,
                  title: e.target.value
                });
              }}
              className="w-full p-2 border rounded text-sm"
              placeholder="タイトルを入力"
            />
          </div>

          {/* 説明 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              説明
            </label>
            <textarea
              value={selectedEvent.description || ""}
              onChange={(e) => {
                updateEvent(selectedEvent.id, {
                  ...selectedEvent,
                  description: e.target.value
                });
              }}
              className="w-full p-2 border rounded text-sm"
              rows={3}
              placeholder="説明を入力"
            />
          </div>

          {/* プロジェクト */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              プロジェクト
            </label>
            <select
              value={selectedEvent.project || ""}
              onChange={(e) => {
                updateEvent(selectedEvent.id, {
                  ...selectedEvent,
                  project: e.target.value
                });
              }}
              className="w-full p-2 border rounded text-sm"
            >
              <option value="">選択してください</option>
              {projects.map((project, index) => (
                <option key={index} value={project.projectCode || project.name || ""}>
                  {project.projectName || project.name || project.projectCode}
                </option>
              ))}
            </select>
          </div>

          {/* 業務コード */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              業務コード
            </label>
            <input
              type="text"
              value={selectedEvent.activityCode || ""}
              onChange={(e) => {
                updateEvent(selectedEvent.id, {
                  ...selectedEvent,
                  activityCode: e.target.value
                });
              }}
              className="w-full p-2 border rounded text-sm"
              placeholder="業務コードを入力"
            />
          </div>

          {/* 削除ボタン */}
          <button
            onClick={() => {
              deleteEvent(selectedEvent.id);
              setSelectedEvent(null);
            }}
            className="w-full px-3 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600"
          >
            削除
          </button>
        </div>
      </div>
    </div>
  );
};
            </h3>
            {level2Tabs.length > 0 ? (
              <TabNavigation
                tabs={level2Tabs}
                activeTabId={activeLevel2}
                onTabChange={handleLevel2Change}
                variant="default"
                size="sm"
              />
            ) : (
              <div className="p-4 bg-gray-50 rounded-lg text-center text-gray-500 text-sm">
                サブカテゴリがありません
              </div>
            )}
          </div>

          {/* レベル3: 詳細タブ - 常時表示 */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">詳細カテゴリ</h3>
            {level3Tabs.length > 0 ? (
              <TabNavigation
                tabs={level3Tabs}
                activeTabId={activeLevel3}
                onTabChange={handleLevel3Change}
                variant="underline"
                size="sm"
              />
            ) : (
              <div className="p-4 bg-gray-50 rounded-lg text-center text-gray-500 text-sm">
                詳細カテゴリがありません
              </div>
            )}
          </div>

          {/* 現在の選択状態表示 */}
          <div className="p-3 bg-blue-50 rounded-lg">
            <h3 className="text-sm font-medium text-blue-700 mb-2">現在の選択状態</h3>
            <div className="text-xs text-blue-600 space-y-1">
              <div>カテゴリ: {activeLevel1 === 'project' ? 'プロジェクト' : '間接業務'}</div>
              <div>サブカテゴリ: {activeLevel2}</div>
              <div>詳細: {activeLevel3 || '未選択'}</div>
            </div>
          </div>

          {/* 選択されたイベント情報 */}
          {eventContext.selectedEvent ? (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="text-md font-semibold mb-2">選択されたイベント</h3>
                <div className="space-y-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      タイトル
                    </label>
                    <input
                      type="text"
                      value={eventContext.selectedEvent.title || ""}
                      onChange={(e) => {
                        if (eventContext.selectedEvent) {
                          eventContext.updateEvent(eventContext.selectedEvent.id, {
                            ...eventContext.selectedEvent,
                            title: e.target.value
                          });
                        }
                      }}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="イベントのタイトル"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      説明
                    </label>
                    <textarea
                      value={eventContext.selectedEvent.description || ""}
                      onChange={(e) => {
                        if (eventContext.selectedEvent) {
                          eventContext.updateEvent(eventContext.selectedEvent.id, {
                            ...eventContext.selectedEvent,
                            description: e.target.value
                          });
                        }
                      }}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      rows={3}
                      placeholder="イベントの説明"
                    />
                  </div>
                  
                  {/* プロジェクト選択（プロジェクトタブの場合のみ） */}
                  {activeLevel1 === 'project' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        プロジェクト
                      </label>
                      <select
                        value={eventContext.selectedEvent.project || ""}
                        onChange={(e) => {
                          if (eventContext.selectedEvent) {
                            eventContext.updateEvent(eventContext.selectedEvent.id, {
                              ...eventContext.selectedEvent,
                              project: e.target.value
                            });
                          }
                        }}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      >
                        <option value="">プロジェクトを選択</option>
                        {projects.map((project, index) => (
                          <option key={index} value={project.projectCode || project.name || ""}>
                            {project.projectName || project.name || project.projectCode}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {/* 削除ボタン */}
              <button
                onClick={() => {
                  if (eventContext.selectedEvent && eventContext.deleteEvent) {
                    eventContext.deleteEvent(eventContext.selectedEvent.id);
                    eventContext.setSelectedEvent(null);
                  }
                }}
                className="w-full px-3 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                イベントを削除
              </button>
            </div>
          ) : (
            <div className="text-center text-gray-500 p-8">
              <div className="space-y-2">
                <p className="text-sm">タイムグリッドでイベントを</p>
                <p className="text-sm">選択または作成してください</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
      