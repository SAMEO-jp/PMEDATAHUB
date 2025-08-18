"use client"

import React from 'react';
import { UnifiedSidebarState, UnifiedSidebarActions } from './types/unifiedSidebar';
import { HierarchicalTabNavigation } from './components/TabNavigation';
import { createHierarchicalTabConfig } from './configs/tabConfigs';
import { ProjectCodeDisplay } from './components/ProjectCodeDisplay';
import { EquipmentSelector } from './selectors/EquipmentSelector';
import { PurchaseItemSelector } from './tabs/PurchaseItemSelector';
import { PlanningTabContent } from './tabs/PlanningTabContent';
import { DesignTabContent } from './tabs/DesignTabContent';
import { MeetingTabContent } from './tabs/MeetingTabContent';
import { OtherTabContent } from './tabs/OtherTabContent';
import { EventDetailForm } from './forms/EventDetailForm';
import { EmptyState } from './components/EmptyState';
import { TabSelector } from "./selectors/TabSelector";

interface UnifiedSidebarProps {
  state: UnifiedSidebarState;
  actions: UnifiedSidebarActions;
}

export const UnifiedSidebar = ({ state, actions }: UnifiedSidebarProps) => {
  const {
    // 階層状態
    activeTab,
    projectSubTab,
    indirectSubTab,
    detailTab,
    businessType,
    
    // プロジェクト情報
    selectedProjectCode,
    purposeProjectCode,
    projects,
    
    // ユーザー情報
    currentUser,
    
    // 設備情報
    equipmentNumber,
    equipmentName,
    equipmentOptions,
    isLoadingEquipment,
    
    // 購入品情報
    selectedPurchaseItem,
    purchaseItems,
    isLoadingPurchaseItems,
    
    // イベント情報
    eventInfo,
    selectedEvent,
    
    // システム状態
    hasChanges,
    loading,
    error,
    
    // 表示制御フラグ（プロパティベース）
    showProjectCode,
    showSubTabs,
    showDetailTabs,
    showEquipment,
    showPurchaseItems,
    showEventForm,
    showIndirectContent,
    showEventInfo,
    showEmptyState
  } = state;

  // タブ変更ハンドラー
  const handleLevel1Change = (tabId: string) => {
    actions.setActiveTab(tabId as 'project' | 'indirect');
    // レベル1が変更されたら、レベル2をリセット
    if (tabId === 'project') {
      actions.setProjectSubTab('計画');
    } else {
      actions.setIndirectSubTab('純間接');
    }
  };

  const handleLevel2Change = (tabId: string) => {
    if (activeTab === 'project') {
      actions.setProjectSubTab(tabId as UnifiedSidebarState['projectSubTab']);
    } else {
      actions.setIndirectSubTab(tabId as UnifiedSidebarState['indirectSubTab']);
    }
  };

  const handleLevel3Change = (tabId: string) => {
    if (activeTab === 'project') {
      actions.setDetailTab('project', projectSubTab, tabId);
    } else {
      actions.setDetailTab('indirect', indirectSubTab, tabId);
    }
  };

  // 階層設定の作成
  const hierarchicalConfig = createHierarchicalTabConfig(
    activeTab,
    activeTab === 'project' ? projectSubTab : indirectSubTab,
    activeTab === 'project' 
      ? detailTab.project[projectSubTab as keyof typeof detailTab.project]
      : detailTab.indirect[indirectSubTab as keyof typeof detailTab.indirect]
  );

  // レベル3の表示制御
  const showLevel3 = activeTab === 'project' 
    ? ['計画', '設計', '会議', 'その他', '購入品'].includes(projectSubTab)
    : ['純間接', '目的間接', '控除時間'].includes(indirectSubTab);

  return (
    <div className="w-80 ml-4">
      <div className="bg-white rounded-lg shadow flex-1 overflow-y-auto">
        {/* サイドバーヘッダー */}
        <div className="p-3 flex justify-between items-center border-b">
          <h2 className="text-lg font-bold">業務詳細</h2>
          {/* イベントが選択されている場合のみタブセレクターを表示 */}
          {selectedEvent && (
            <TabSelector />
          )}
        </div>

        {/* サイドバーコンテンツ */}
        <div className="space-y-4 p-4">
          {/* 階層タブナビゲーション */}
          <div className="border-b border-gray-200 pb-4">
            <HierarchicalTabNavigation
              config={hierarchicalConfig}
              activeLevel1Id={activeTab}
              activeLevel2Id={activeTab === 'project' ? projectSubTab : indirectSubTab}
              activeLevel3Id={activeTab === 'project' 
                ? detailTab.project[projectSubTab]
                : detailTab.indirect[indirectSubTab]
              }
              onLevel1Change={handleLevel1Change}
              onLevel2Change={handleLevel2Change}
              onLevel3Change={handleLevel3Change}
              showLevel3={showLevel3}
              variant="underline"
              size="sm"
              className="space-y-2"
            />
          </div>

          {/* プロジェクトコード表示 */}
          {showProjectCode && (
            <ProjectCodeDisplay
              selectedTab={activeTab}
              indirectSubTab={indirectSubTab}
              selectedProjectCode={selectedProjectCode}
              purposeProjectCode={purposeProjectCode}
              projects={projects}
              selectedEvent={selectedEvent}
              updateEvent={actions.updateEvent}
              setSelectedProjectCode={actions.setSelectedProjectCode}
              setPurposeProjectCode={actions.setPurposeProjectCode}
            />
          )}

          {/* 設備選択 */}
          {showEquipment && (
            <EquipmentSelector
              equipmentNumber={equipmentNumber}
              equipmentName={equipmentName}
              equipmentOptions={equipmentOptions}
              isLoadingEquipment={isLoadingEquipment}
              setEquipmentNumber={actions.setEquipmentNumber}
              setEquipmentName={actions.setEquipmentName}
            />
          )}

          {/* 購入品選択 */}
          {showPurchaseItems && (
            <PurchaseItemSelector
              selectedTab={activeTab}
              selectedProjectSubTab={projectSubTab}
              selectedEvent={selectedEvent}
              updateEvent={actions.updateEvent}
            />
          )}

          {/* プロジェクトタブコンテンツ */}
          {activeTab === 'project' && (
            <>
              {projectSubTab === '計画' && (
                <PlanningTabContent
                  selectedEvent={selectedEvent}
                  updateEvent={actions.updateEvent}
                />
              )}
              
              {projectSubTab === '設計' && (
                <DesignTabContent
                  selectedEvent={selectedEvent}
                  updateEvent={actions.updateEvent}
                />
              )}
              
              {projectSubTab === '会議' && (
                <MeetingTabContent
                  selectedEvent={selectedEvent}
                  updateEvent={actions.updateEvent}
                />
              )}
              
              {projectSubTab === 'その他' && (
                <OtherTabContent
                  selectedEvent={selectedEvent}
                  updateEvent={actions.updateEvent}
                />
              )}
            </>
          )}

          {/* 間接業務タブコンテンツ */}
          {activeTab === 'indirect' && showIndirectContent && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                                 <h3 className="text-sm font-medium text-gray-700 mb-2">
                   {indirectSubTab} - {detailTab.indirect[indirectSubTab]}
                 </h3>
                <p className="text-xs text-gray-600">
                  間接業務の詳細設定がここに表示されます
                </p>
              </div>
            </div>
          )}

          {/* イベント基本情報（タイトル・内容） */}
          {showEventInfo && selectedEvent && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  タイトル *
                </label>
                <input
                  type="text"
                  value={eventInfo.title || ""}
                  onChange={(e) => actions.updateEventInfo({ title: e.target.value })}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="イベントのタイトルを入力"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  説明
                </label>
                <textarea
                  value={eventInfo.description || ""}
                  onChange={(e) => actions.updateEventInfo({ description: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="イベントの詳細を入力"
                />
              </div>
            </div>
          )}

          {/* イベント詳細フォーム */}
          {showEventForm && selectedEvent && (
            <EventDetailForm
              selectedEvent={selectedEvent}
              selectedTab={activeTab}
              selectedProjectSubTab={projectSubTab}
              updateEvent={actions.updateEvent}
              handleDeleteEvent={actions.deleteEvent}
              setSelectedEvent={actions.setSelectedEvent}
              projects={projects}
            />
          )}

          {/* 空の状態 */}
          {showEmptyState && (
            <EmptyState selectedTab={activeTab} />
          )}

          {/* エラー表示 */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded">
              <div className="text-red-600 text-sm">{error}</div>
            </div>
          )}

          {/* ローディング表示 */}
          {loading && (
            <div className="p-4 text-center">
              <div className="text-gray-500">読み込み中...</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
