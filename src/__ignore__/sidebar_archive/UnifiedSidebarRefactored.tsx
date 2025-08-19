"use client"

import React from 'react';
import { Tab } from '../../../../../components/ui/Tab';
import { TabGroup } from '../../../../../components/ui/TabGroup';
import { Select } from '../../../../../components/ui/Select';
import { Input } from '../../../../../components/ui/input';
import { TextArea } from '../../../../../components/ui/TextArea';
import { TimeRangePicker } from '../../../../../components/ui/TimeRangePicker';
import { Button } from '../../../../../components/ui/button';
import { FormField } from '../../../../../components/ui/FormField';
import { 
  Sidebar, 
  SidebarHeader, 
  SidebarContent, 
  SidebarSection, 
  SidebarActions 
} from '../../../../../components/ui/SidebarLayout';
import { BusinessTypeTabGroup } from './components/BusinessTypeTab';
import { UnifiedSidebarState, UnifiedSidebarActions } from './types/unifiedSidebar';

interface UnifiedSidebarRefactoredProps {
  state: UnifiedSidebarState;
  actions: UnifiedSidebarActions;
}

export const UnifiedSidebarRefactored: React.FC<UnifiedSidebarRefactoredProps> = ({
  state,
  actions
}) => {
  const {
    activeTab,
    projectSubTab,
    selectedProjectCode,
    projects,
    equipmentNumber,
    equipmentName,
    equipmentOptions,
    eventInfo,
    selectedEvent,
    loading,
    error,
  } = state;

  // プロジェクトオプション変換
  const projectOptions = projects.map(project => ({
    value: project.projectCode || project.projectNumber || '',
    label: `${project.projectCode || project.projectNumber} - ${project.projectName || project.name}`
  }));

  // 設備オプション変換  
  const equipmentSelectOptions = equipmentOptions.map(eq => ({
    value: eq.id,
    label: `${eq.id} - ${eq.name}`
  }));

  // メインタブ切り替え
  const handleMainTabChange = (tabId: string) => {
    actions.setActiveTab(tabId as 'project' | 'indirect');
  };

  return (
    <Sidebar width="md">
      {/* ヘッダー */}
      <SidebarHeader 
        title="業務詳細"
        actions={
          selectedEvent && (
            <TabGroup value={activeTab} onValueChange={handleMainTabChange}>
              <Tab value="project">プロジェクト</Tab>
              <Tab value="indirect">間接業務</Tab>
            </TabGroup>
          )
        }
      />

      {/* メインコンテンツ */}
      <SidebarContent>
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded mb-4">
            <div className="text-red-600 text-sm">{error}</div>
          </div>
        )}

        {loading && (
          <div className="p-4 text-center">
            <div className="text-gray-500">読み込み中...</div>
          </div>
        )}

        {!loading && !selectedEvent && (
          <div className="text-center text-gray-500 py-8">
            イベントを選択してください
          </div>
        )}

        {!loading && selectedEvent && (
          <div className="space-y-6">
            {/* ナビゲーションタブ */}
            <SidebarSection>
              <TabGroup value={projectSubTab} onValueChange={actions.setProjectSubTab}>
                <Tab value="計画">計画</Tab>
                <Tab value="設計">設計</Tab>
                <Tab value="会議">会議</Tab>
                <Tab value="購入品">購入品</Tab>
                <Tab value="その他">その他</Tab>
              </TabGroup>
            </SidebarSection>

            {/* プロジェクトコード選択 */}
            {(activeTab === "project" || 
              (activeTab === "indirect" && state.indirectSubTab === "目的間接")) && (
              <SidebarSection>
                <Select
                  label={activeTab === "project" ? "プロジェクトコード" : "目的プロジェクトコード"}
                  value={selectedProjectCode}
                  onValueChange={actions.setSelectedProjectCode}
                  options={projectOptions}
                  searchable
                  placeholder="プロジェクトを選択してください"
                />
              </SidebarSection>
            )}

            {/* 設備選択（設計タブのみ） */}
            {activeTab === "project" && projectSubTab === "設計" && (
              <SidebarSection>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="設備番号">
                    <Input
                      value={equipmentNumber}
                      onChange={(e) => actions.setEquipmentNumber(e.target.value)}
                      placeholder="設備番号"
                    />
                  </FormField>
                  <FormField label="設備名称">
                    <Input
                      value={equipmentName}
                      onChange={(e) => actions.setEquipmentName(e.target.value)}
                      placeholder="設備名称"
                    />
                  </FormField>
                </div>
              </SidebarSection>
            )}

            {/* 業務分類コード表示 */}
            <SidebarSection>
              <FormField label="業務分類コード">
                <div className="p-2 bg-gray-100 rounded border text-gray-700 font-mono">
                  {selectedEvent.activityCode || 'P000'}
                </div>
              </FormField>
            </SidebarSection>

            {/* 業務タイプ選択（計画図の場合） */}
            {activeTab === "project" && 
             projectSubTab === "計画" && 
             selectedEvent?.subTabType === "計画図" && (
              <SidebarSection>
                <BusinessTypeTabGroup
                  title="計画図業務"
                  options={[
                    { name: "作図及び作図準備", code: "02" },
                    { name: "作図指示", code: "04" },
                    { name: "検図", code: "07" },
                    { name: "承認作業", code: "08" },
                    { name: "出図前図面検討会", code: "03" },
                    { name: "出図後図面検討会", code: "06" },
                    { name: "その他", code: "09" },
                  ]}
                  selectedValue={selectedEvent.planningSubType || ''}
                  onSelectionChange={(selected) => {
                    // 選択変更のロジックをここに実装

                  }}
                />
              </SidebarSection>
            )}

            {/* イベント基本情報 */}
            <SidebarSection title="基本情報">
              <FormField label="タイトル" required>
                <Input
                  value={eventInfo.title || ""}
                  onChange={(e) => actions.updateEventInfo({ title: e.target.value })}
                  placeholder="イベントのタイトルを入力"
                />
              </FormField>

              <TextArea
                label="説明"
                value={eventInfo.description || ""}
                onChange={(e) => actions.updateEventInfo({ description: e.target.value })}
                placeholder="イベントの詳細を入力"
                rows={3}
                resize={false}
              />
            </SidebarSection>

            {/* 時間設定 */}
            <SidebarSection title="時間設定">
              <TimeRangePicker
                startTime={selectedEvent.startTime}
                endTime={selectedEvent.endTime}
                onStartTimeChange={(time) => {
                  const updatedEvent = { ...selectedEvent, startTime: time };
                  actions.updateEvent(updatedEvent);
                }}
                onEndTimeChange={(time) => {
                  const updatedEvent = { ...selectedEvent, endTime: time };
                  actions.updateEvent(updatedEvent);
                }}
                timeStep={15}
              />
            </SidebarSection>

            {/* 状態選択 */}
            <SidebarSection>
              <Select
                label="状態"
                value="進行中" // デフォルト値
                onValueChange={(value) => {}}
                options={[
                  { value: "未開始", label: "未開始" },
                  { value: "進行中", label: "進行中" },
                  { value: "完了", label: "完了" },
                  { value: "保留", label: "保留" },
                ]}
              />
            </SidebarSection>
          </div>
        )}
      </SidebarContent>

      {/* フッターアクション */}
      {selectedEvent && (
        <SidebarActions>
          <Button 
            variant="destructive" 
            onClick={actions.deleteEvent}
            className="flex-1"
          >
            削除
          </Button>
          <Button 
            variant="secondary"
            onClick={() => actions.setSelectedEvent(null)}
            className="flex-1"
          >
            閉じる
          </Button>
        </SidebarActions>
      )}
    </Sidebar>
  );
};