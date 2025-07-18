// 基本イベント型（データベース用）
import { EventHeight, OriginalHeight, CalculatedHeight, DraggableHeight } from './height'

export interface BaseEvent {
  key_id: string;
  user_id: string;
  startDateTime: string;
  endDateTime: string;
  subject: string;
  content?: string;
  type?: string;
  organizer?: string;
  projectNumber?: string;
  position?: string;
  facility?: string;
  status?: string;
  businessCode?: string;
  departmentCode?: string;
  weekCode?: string;
  activityMaincode?: string;
  activitySubcode?: string;
  activityCode?: string;
  equipmenNumber?: string;
  projectType?: string;
  phase?: string;
  projectSubType?: string;
  createdAt?: string;
  updatedAt?: string;
  purchase_id?: string;  // 購入品のID（後でロジックで詳細情報を取得）
}

// プロジェクト型
export interface Project {
  id: string;
  code: string;
  name: string;
  color?: string;  // オプショナルに変更
}

// 表示用イベント型（UI用）
export interface DisplayEvent extends BaseEvent {
  height: EventHeight;  // イベントの基本高さ
  originalHeight: OriginalHeight;  // 新規作成時の元の高さ
  top: number;
  color: string;
  unsaved?: boolean;
}

// ドラッグ操作用イベント型
export interface DraggableEvent extends DisplayEvent {
  dragHandleOffset?: number;
  draggableHeight: DraggableHeight;  // ドラッグ操作時の高さ
}

// リサイズ操作用イベント型
export interface ResizableEvent extends DisplayEvent {
  calculatedHeight: CalculatedHeight;  // リサイズ時に計算される高さ
}

// プロジェクト関連イベント型
export interface ProjectEvent extends BaseEvent {
  projectPhase: string;
  projectSubType: string;
  equipmentNumber: string;
  activityCode: string;
  activityRow: string;
  activityColumn: string;
  activitySubcode: string;
}

// 間接業務イベント型
export interface IndirectEvent extends BaseEvent {
  indirectType: string;
}

// イベントドラッグオーバーレイのプロパティ型
export interface EventDragOverlayProps {
  event: DraggableEvent;
}

// ドラッグ可能なイベントのプロパティ型
export interface DraggableEventProps {
  event: DisplayEvent;
  onClick: (event: DisplayEvent) => void;
  onResizeStart: (event: DisplayEvent, direction: "top" | "bottom", mouseY: number) => void;
  onCopy?: (event: DisplayEvent) => void;
  onDelete?: (event: DisplayEvent) => void;
}

// イベントの種類を判別するための型ガード
export function isProjectEvent(event: BaseEvent): event is ProjectEvent {
  return 'projectPhase' in event && 'projectSubType' in event;
}

export function isIndirectEvent(event: BaseEvent): event is IndirectEvent {
  return 'indirectType' in event;
}

export function isDraggableEvent(event: DisplayEvent): event is DraggableEvent {
  return 'dragHandleOffset' in event;
} 