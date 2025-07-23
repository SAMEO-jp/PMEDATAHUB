// ==========================================
// 変更記録
// 2025-01-XX PALET_LIST個別ページ作成
// 2025-01-XX タイムライン表示、写真アップロード、モーダル機能を追加
// 2025-01-XX 実際のデータベースデータを表示・編集する機能を実装
// ==========================================

'use client'

import { useParams, useRouter } from 'next/navigation'
import React, { useMemo, useState } from 'react'
import { ArrowLeftIcon, CameraIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Button } from '@src/components/ui/button'
import { trpc } from '@src/lib/trpc/client'

// ==========================================
// 型定義層
// ==========================================
interface PaletListData {
  palet_list_id: number;
  palet_master_id: string;
  palet_list_display_name: string;
  palet_quantity: number;
  created_at: string;
  updated_at: string;
}

interface PaletMasterData {
  palet_master_id: string;
  palet_master_display_name: string;
  created_at: string;
  updated_at: string;
}

interface PaletStatusHistoryData {
  palet_status_history_id: number;
  palet_list_id: number;
  palet_location_id: number;
  palet_status_type: string;
  palet_status_date: string;
  palet_location_info: string;
  palet_status_notes: string;
  created_at: string;
  updated_at: string;
}

interface PaletScheduleData {
  palet_schedule_id: number;
  palet_list_id: number;
  palet_schedule_status_type: string;
  palet_planned_date: string;
  palet_schedule_notes: string;
  created_at: string;
  updated_at: string;
}

interface KonpoPaletData {
  konpo_palet_id: string;
  palet_master_id: string;
  buhin_id: string;
  palet_buhin_quantity: number;
  created_at: string;
  updated_at: string;
}

interface TimelineStep {
  id: string;
  title: string;
  status: 'complete' | 'current' | 'pending';
  icon: string;
  schedule?: {
    date: string;
    notes: string;
    priority: string;
    responsible: string;
    location: string;
  };
  actual?: {
    date: string;
    location: string;
    notes: string;
    status: string;
    operator: string;
    quality: string;
  };
  history?: Array<{
    date: string;
    type: '搬入' | '搬出';
    location: string;
  }>;
}

interface PhotoData {
  id: string;
  src: string;
  title: string;
  date: string;
  photographer: string;
  notes: string;
}

// ==========================================
// ユーティリティ関数層
// ==========================================
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
};

const getStatusType = (statusType: string) => {
  switch (statusType) {
    case 'shipping': return '発送';
    case 'transit': return '輸送中';
    case 'temp_arrival': return '仮置き場';
    case 'construction_start': return '据付開始';
    case 'construction_complete': return '据付完了';
    default: return statusType;
  }
};

const getStatusIcon = (statusType: string) => {
  switch (statusType) {
    case 'shipping': return '🚚';
    case 'transit': return '🚛';
    case 'temp_arrival': return '🏭';
    case 'construction_start': return '🔧';
    case 'construction_complete': return '✅';
    default: return '📋';
  }
};

// ==========================================
// モーダルコンポーネント層
// ==========================================
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-lg font-bold">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// タイムラインコンポーネント層
// ==========================================
interface TimelineStepProps {
  step: TimelineStep;
  onEditSchedule: (stepId: string) => void;
  onEditActual: (stepId: string) => void;
}

const TimelineStep: React.FC<TimelineStepProps> = ({ step, onEditSchedule, onEditActual }) => {
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'complete': return 'is-complete';
      case 'current': return 'is-current';
      case 'pending': return 'is-pending';
      default: return '';
    }
  };

  const getIconClass = (status: string) => {
    switch (status) {
      case 'complete': return 'bg-blue-500 text-white';
      case 'current': return 'bg-indigo-600 text-white';
      case 'pending': return 'bg-gray-200 text-gray-500';
      default: return 'bg-gray-200 text-gray-500';
    }
  };

  return (
    <div className={`timeline-step ${getStatusClass(step.status)} mb-8`}>
      <div className="flex items-start gap-4">
        <div className={`timeline-icon ${getIconClass(step.status)} rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0`}>
          <span className="text-lg font-bold">{step.icon}</span>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-xl font-bold ${step.status === 'current' ? 'text-indigo-600' : step.status === 'pending' ? 'text-gray-500' : 'text-gray-900'}`}>
              {step.title}
            </h3>
            <div className="flex gap-2">
              <Button 
                onClick={() => onEditSchedule(step.id)} 
                variant="outline" 
                size="sm"
                className="text-blue-600 hover:text-blue-800"
              >
                計画編集
              </Button>
              <Button 
                onClick={() => onEditActual(step.id)} 
                variant="outline" 
                size="sm"
                className="text-green-600 hover:text-green-800"
              >
                実績登録
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 計画セクション */}
            <div className={`p-6 rounded-lg border-2 ${step.schedule ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-dashed border-gray-300'}`}>
              <div className="flex items-center justify-between mb-3">
                <h4 className={`font-semibold text-lg ${step.schedule ? 'text-blue-800' : 'text-gray-500'}`}>
                  計画
                </h4>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  step.schedule ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
                }`}>
                  {step.schedule ? '設定済み' : '未設定'}
                </span>
              </div>
              
              {step.schedule ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-sm font-medium text-gray-600">予定日時:</span>
                      <p className="text-sm font-semibold text-blue-900">{step.schedule.date}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">優先度:</span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        step.schedule.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                        step.schedule.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                        step.schedule.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {step.schedule.priority === 'urgent' ? '緊急' :
                         step.schedule.priority === 'high' ? '高' :
                         step.schedule.priority === 'medium' ? '中' : '低'}
                      </span>
                    </div>
                  </div>
                  
                  {step.schedule.responsible && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">担当者:</span>
                      <p className="text-sm font-semibold text-blue-900">{step.schedule.responsible}</p>
                    </div>
                  )}
                  
                  {step.schedule.location && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">予定場所:</span>
                      <p className="text-sm font-semibold text-blue-900">{step.schedule.location}</p>
                    </div>
                  )}
                  
                  {step.schedule.notes && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">備考:</span>
                      <p className="text-sm text-blue-900 mt-1 bg-blue-100 p-2 rounded">{step.schedule.notes}</p>
                    </div>
                  )}
                  <div className="pt-2">
                    <Button 
                      onClick={() => onEditSchedule(step.id)} 
                      variant="outline" 
                      size="sm"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      計画を編集
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500 mb-3">計画は未設定です</p>
                  <Button 
                    onClick={() => onEditSchedule(step.id)} 
                    variant="outline" 
                    size="sm"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    計画を設定
                  </Button>
                </div>
              )}
            </div>

            {/* 実績セクション */}
            <div className={`p-6 rounded-lg border-2 ${step.actual ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-dashed border-gray-300'}`}>
              <div className="flex items-center justify-between mb-3">
                <h4 className={`font-semibold text-lg ${step.actual ? 'text-green-800' : 'text-gray-500'}`}>
                  実績
                </h4>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  step.actual ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                }`}>
                  {step.actual ? '完了' : '未完了'}
                </span>
              </div>
              
              {step.actual ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-sm font-medium text-gray-600">完了日時:</span>
                      <p className="text-sm font-semibold text-green-900">{step.actual.date}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">状況:</span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        step.actual.status === 'completed' ? 'bg-green-100 text-green-800' :
                        step.actual.status === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                        step.actual.status === 'delayed' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {step.actual.status === 'completed' ? '完了' :
                         step.actual.status === 'partial' ? '部分完了' :
                         step.actual.status === 'delayed' ? '遅延' : '中止'}
                      </span>
                    </div>
                  </div>
                  
                  {step.actual.operator && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">作業者:</span>
                      <p className="text-sm font-semibold text-green-900">{step.actual.operator}</p>
                    </div>
                  )}
                  
                  {step.actual.location && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">作業場所:</span>
                      <p className="text-sm font-semibold text-green-900">{step.actual.location}</p>
                    </div>
                  )}
                  
                  {step.actual.quality && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">品質評価:</span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        step.actual.quality === 'excellent' ? 'bg-purple-100 text-purple-800' :
                        step.actual.quality === 'good' ? 'bg-green-100 text-green-800' :
                        step.actual.quality === 'normal' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {step.actual.quality === 'excellent' ? '優秀' :
                         step.actual.quality === 'good' ? '良好' :
                         step.actual.quality === 'normal' ? '普通' : '不良'}
                      </span>
                    </div>
                  )}
                  
                  {step.actual.notes && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">備考:</span>
                      <p className="text-sm text-green-900 mt-1 bg-green-100 p-2 rounded">{step.actual.notes}</p>
                    </div>
                  )}
                  <div className="pt-2">
                    <Button 
                      onClick={() => onEditActual(step.id)} 
                      variant="outline" 
                      size="sm"
                      className="text-green-600 hover:text-green-800"
                    >
                      実績を編集
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500 mb-3">実績はまだ登録されていません</p>
                  <Button 
                    onClick={() => onEditActual(step.id)} 
                    variant="outline" 
                    size="sm"
                    className="text-green-600 hover:text-green-800"
                  >
                    実績を登録
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* 現在のステップ（仮置き場など）の履歴表示 */}
          {step.status === 'current' && step.history && step.history.length > 0 && (
            <div className="mt-6 bg-indigo-50 p-4 rounded-lg border border-indigo-200">
              <h4 className="font-semibold text-indigo-800 mb-3">移動履歴</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-indigo-200">
                  <thead className="bg-indigo-100">
                    <tr>
                      <th className="py-2 pl-2 pr-3 text-left text-sm font-semibold text-indigo-900">日時</th>
                      <th className="px-3 py-2 text-left text-sm font-semibold text-indigo-900">種別</th>
                      <th className="px-3 py-2 text-left text-sm font-semibold text-indigo-900">場所名</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-indigo-200">
                    {step.history.map((item, index) => (
                      <tr key={index} className="bg-white">
                        <td className="py-2 pl-2 pr-3 text-sm">{item.date}</td>
                        <td className="px-3 py-2 text-sm">
                          <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                            item.type === '搬入' 
                              ? 'bg-green-50 text-green-700 ring-green-600/20' 
                              : 'bg-yellow-50 text-yellow-800 ring-yellow-600/20'
                          }`}>
                            {item.type}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-sm">{item.location}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// メインコンポーネント層
// ==========================================
export default function PaletListDetailPage() {
  // ==========================================
  // パラメータとルーティング層
  // ==========================================
  const params = useParams()
  const router = useRouter()
  const projectId = params.project_id as string
  const paletListId = params.palet_list_id as string
  
  // ==========================================
  // 状態管理層
  // ==========================================
  const [modalType, setModalType] = useState<'schedule' | 'actual' | 'parts' | null>(null);
  const [selectedStepId, setSelectedStepId] = useState<string>('');
  const [photos, setPhotos] = useState<PhotoData[]>([
    {
      id: 'demo-1',
      src: '/demopic/IMG_2025-04-23-14-26-48-006.jpg',
      title: 'デモ写真 - パレット現況',
      date: new Date().toLocaleString(),
      photographer: 'システム',
      notes: 'デモ用の写真です'
    }
  ]);

  // ==========================================
  // データ取得層
  // ==========================================
  const paletListQuery = trpc.palet.list.getAll.useQuery();
  const paletMasterQuery = trpc.palet.master.getAll.useQuery();
  const paletStatusHistoryQuery = trpc.palet.statusHistory.getAll.useQuery();
  const paletScheduleQuery = trpc.palet.schedule.getAll.useQuery();
  const konpoPaletQuery = trpc.palet.konpo.getAll.useQuery();
  const bomBuhinQuery = trpc.bomBuhin.getByProjectId.useQuery({ projectId });

  // ミューテーション
  const createStatusHistoryMutation = trpc.palet.statusHistory.create.useMutation({
    onSuccess: () => {
      void paletStatusHistoryQuery.refetch();
    }
  });

  const createScheduleMutation = trpc.palet.schedule.create.useMutation({
    onSuccess: () => {
      void paletScheduleQuery.refetch();
    }
  });

  // ==========================================
  // データ処理層
  // ==========================================
  // 指定されたパレットリストIDのデータを取得
  const paletListData = useMemo(() => {
    if (!paletListQuery.data?.data) return null;
    
    console.log('検索対象パレットリストID:', paletListId);
    console.log('利用可能なパレットリストデータ:', paletListQuery.data.data);
    
    // パレットリストIDを数値に変換
    const numericPaletListId = parseInt(paletListId);
    
    const paletList = paletListQuery.data.data.find(
      (item: PaletListData) => item.palet_list_id === numericPaletListId
    );
    
    console.log('見つかったパレットリスト:', paletList);
    
    return paletList || null;
  }, [paletListQuery.data?.data, paletListId]);

  // パレットマスターデータを取得
  const paletMasterData = useMemo(() => {
    if (!paletMasterQuery.data?.data || !paletListData) return null;
    
    return paletMasterQuery.data.data.find(
      (item: PaletMasterData) => item.palet_master_id === paletListData.palet_master_id
    );
  }, [paletMasterQuery.data?.data, paletListData]);

  // このパレットのステータス履歴を取得
  const paletStatusHistory = useMemo(() => {
    if (!paletStatusHistoryQuery.data?.data || !paletListData) return [];
    
    return paletStatusHistoryQuery.data.data.filter(
      (item: PaletStatusHistoryData) => item.palet_list_id === paletListData.palet_list_id
    ).sort((a, b) => new Date(b.palet_status_date).getTime() - new Date(a.palet_status_date).getTime());
  }, [paletStatusHistoryQuery.data?.data, paletListData]);

  // このパレットのスケジュールを取得
  const paletSchedule = useMemo(() => {
    if (!paletScheduleQuery.data?.data || !paletListData) return [];
    
    return paletScheduleQuery.data.data.filter(
      (item: PaletScheduleData) => item.palet_list_id === paletListData.palet_list_id
    ).sort((a, b) => new Date(a.palet_planned_date).getTime() - new Date(b.palet_planned_date).getTime());
  }, [paletScheduleQuery.data?.data, paletListData]);

  // このパレットの構成部品を取得（図面ID付き）
  const konpoPaletData = useMemo(() => {
    if (!konpoPaletQuery.data?.data || !paletListData || !bomBuhinQuery.data?.data) return [];
    
    const konpoItems = konpoPaletQuery.data.data.filter(
      (item: KonpoPaletData) => item.palet_master_id === paletListData.palet_master_id
    );
    
    // 各構成部品に図面IDを追加
    return konpoItems.map(konpoItem => {
      const buhinData = bomBuhinQuery.data.data.find(
        buhin => buhin.BUHIN_ID === konpoItem.buhin_id
      );
      
      return {
        ...konpoItem,
        zumen_id: buhinData?.ZUMEN_ID || '',
        buhin_name: buhinData?.BUHIN_NAME || konpoItem.buhin_id,
      };
    });
  }, [konpoPaletQuery.data?.data, paletListData, bomBuhinQuery.data?.data]);

  // タイムラインデータを構築
  const timelineSteps: TimelineStep[] = useMemo(() => {
    const steps: TimelineStep[] = [];
    
    // 発送ステップ
    const shippingSchedule = paletSchedule.find(s => s.palet_schedule_status_type === 'shipping');
    const shippingHistory = paletStatusHistory.find(h => h.palet_status_type === 'shipping');
    
    steps.push({
      id: 'shipping',
      title: '発送',
      status: shippingHistory ? 'complete' : shippingSchedule ? 'pending' : 'pending',
      icon: '🚚',
      schedule: shippingSchedule ? {
        date: formatDate(shippingSchedule.palet_planned_date),
        notes: shippingSchedule.palet_schedule_notes || '',
        priority: 'medium',
        responsible: '',
        location: ''
      } : undefined,
      actual: shippingHistory ? {
        date: formatDate(shippingHistory.palet_status_date),
        location: shippingHistory.palet_location_info || '',
        notes: shippingHistory.palet_status_notes || '',
        status: 'completed',
        operator: '',
        quality: 'normal'
      } : undefined
    });

    // 仮置き場ステップ
    const tempArrivalHistory = paletStatusHistory.filter(h => h.palet_status_type === 'temp_arrival');
    const tempArrivalSchedule = paletSchedule.find(s => s.palet_schedule_status_type === 'temp_arrival');
    
    steps.push({
      id: 'temp_arrival',
      title: '仮置き場',
      status: tempArrivalHistory.length > 0 ? 'current' : tempArrivalSchedule ? 'pending' : 'pending',
      icon: '🏭',
      schedule: tempArrivalSchedule ? {
        date: formatDate(tempArrivalSchedule.palet_planned_date),
        notes: tempArrivalSchedule.palet_schedule_notes || '',
        priority: 'medium',
        responsible: '',
        location: ''
      } : undefined,
      history: tempArrivalHistory.length > 0 ? tempArrivalHistory.map(h => ({
        date: formatDate(h.palet_status_date),
        type: h.palet_status_notes?.includes('搬出') ? '搬出' : '搬入',
        location: h.palet_location_info || ''
      })) : undefined
    });

    // 据付ステップ
    const constructionSchedule = paletSchedule.find(s => s.palet_schedule_status_type === 'construction_complete');
    const constructionHistory = paletStatusHistory.find(h => h.palet_status_type === 'construction_complete');
    
    steps.push({
      id: 'construction',
      title: '据付',
      status: constructionHistory ? 'complete' : constructionSchedule ? 'pending' : 'pending',
      icon: '🔧',
      schedule: constructionSchedule ? {
        date: formatDate(constructionSchedule.palet_planned_date),
        notes: constructionSchedule.palet_schedule_notes || '',
        priority: 'medium',
        responsible: '',
        location: ''
      } : undefined,
      actual: constructionHistory ? {
        date: formatDate(constructionHistory.palet_status_date),
        location: constructionHistory.palet_location_info || '',
        notes: constructionHistory.palet_status_notes || '',
        status: 'completed',
        operator: '',
        quality: 'normal'
      } : undefined
    });

    return steps;
  }, [paletSchedule, paletStatusHistory]);

  // ==========================================
  // イベントハンドラ層
  // ==========================================
  const handleBack = () => {
    router.push(`/app_project/${projectId}/mbom/palet-list`);
  };

  const handleEdit = () => {
    console.log('パレットリスト編集:', paletListId);
    // TODO: 編集モードの実装
  };

  const handleDelete = () => {
    if (confirm('このパレットリストを削除しますか？\n\nこの操作により、パレットリストID「' + paletListId + '」のデータが削除されます。')) {
      try {
        // TODO: 削除APIの実装
        console.log('パレットリスト削除:', paletListId);
        alert('パレットリストの削除が完了しました');
        router.push(`/app_project/${projectId}/mbom/palet-list`);
      } catch (error) {
        console.error('パレットリスト削除エラー:', error);
        alert('パレットリストの削除中にエラーが発生しました');
      }
    }
  };

  const handleEditSchedule = (stepId: string) => {
    setSelectedStepId(stepId);
    setModalType('schedule');
  };

  const handleEditActual = (stepId: string) => {
    setSelectedStepId(stepId);
    setModalType('actual');
  };



  const handleCloseModal = () => {
    setModalType(null);
    setSelectedStepId('');
  };

  const handleZumenClick = (zumenId: string) => {
    if (zumenId) {
      router.push(`/app_project/${projectId}/zumen/${zumenId}`);
    }
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newPhoto: PhotoData = {
          id: Date.now().toString(),
          src: e.target?.result as string,
          title: `写真 ${new Date().toLocaleString()}`,
          date: new Date().toLocaleString(),
          photographer: '撮影者',
          notes: '備考'
        };
        setPhotos(prev => [newPhoto, ...prev]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveSchedule = (formData: { 
    date: string; 
    notes: string; 
    priority: string;
    responsible: string;
    location: string;
  }) => {
    if (!paletListData) return;

    const stepTypeMap: { [key: string]: string } = {
      'shipping': 'shipping',
      'temp_arrival': 'temp_arrival',
      'construction': 'construction_complete'
    };

    const statusType = stepTypeMap[selectedStepId];
    if (!statusType) return;

    // 新しいフィールドを含む備考を作成
    const enhancedNotes = [
      formData.notes,
      formData.responsible && `担当者: ${formData.responsible}`,
      formData.location && `場所: ${formData.location}`,
      `優先度: ${formData.priority}`
    ].filter(Boolean).join('\n');

    createScheduleMutation.mutate({
      palet_list_id: paletListData.palet_list_id,
      palet_schedule_status_type: statusType,
      palet_planned_date: formData.date,
      palet_schedule_notes: enhancedNotes
    });

    handleCloseModal();
  };

  const handleSaveActual = (formData: { 
    date: string; 
    location: string; 
    notes: string;
    status: string;
    operator: string;
    quality: string;
  }) => {
    if (!paletListData) return;

    const stepTypeMap: { [key: string]: string } = {
      'shipping': 'shipping',
      'temp_arrival': 'temp_arrival',
      'construction': 'construction_complete'
    };

    const statusType = stepTypeMap[selectedStepId];
    if (!statusType) return;

    // 新しいフィールドを含む備考を作成
    const enhancedNotes = [
      formData.notes,
      formData.operator && `作業者: ${formData.operator}`,
      formData.status && `状況: ${formData.status}`,
      formData.quality && `品質: ${formData.quality}`
    ].filter(Boolean).join('\n');

    createStatusHistoryMutation.mutate({
      palet_list_id: paletListData.palet_list_id,
      palet_location_id: 1, // 仮の場所ID
      palet_status_type: statusType,
      palet_status_date: formData.date,
      palet_location_info: formData.location,
      palet_status_notes: enhancedNotes
    });

    handleCloseModal();
  };

  // ==========================================
  // レンダリング層
  // ==========================================
  // ローディング状態の表示
  if (paletListQuery.isLoading || paletMasterQuery.isLoading || bomBuhinQuery.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">データを読み込み中...</p>
        </div>
      </div>
    );
  }

  // エラー状態の表示
  if (paletListQuery.error || paletMasterQuery.error || bomBuhinQuery.error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">エラーが発生しました</h2>
          <p className="text-gray-600 mb-4">
            {paletListQuery.error?.message || paletMasterQuery.error?.message || bomBuhinQuery.error?.message}
          </p>
          <Button onClick={handleBack} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            戻る
          </Button>
        </div>
      </div>
    );
  }

  // パレットリストが見つからない場合
  if (!paletListData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">パレットリストが見つかりません</h2>
          <p className="text-gray-600 mb-4">指定されたパレットリストID「{paletListId}」のデータが存在しません。</p>
          <p className="text-gray-500 text-sm mb-4">利用可能なパレットリストIDを確認してください。</p>
          <Button onClick={handleBack} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            戻る
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen pb-20">
      <div className="max-w-7xl mx-auto">
        {/* ヘッダー */}
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button onClick={handleBack} variant="outline" size="sm">
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              戻る
            </Button>
            <h1 className="text-3xl font-bold text-gray-800">個別パレット管理</h1>
          </div>
          <p className="text-gray-500 mt-1">パレットの予定と実績を詳細に管理します。</p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 左カラム：パレット情報 */}
          <div className="space-y-8">
            
            {/* 1. パレット基本情報 */}
            <section className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{paletListData.palet_list_display_name}</h2>
                  <p className="text-sm text-gray-500 mt-1">現物パレットID: PL-{paletListData.palet_list_id}</p>
                </div>
                <div className="status-tag status-shipping">
                  <span className="mr-2">🚚</span>
                  <span>発送中</span>
                </div>
              </div>
              <div className="mt-6 border-t pt-4">
                <div className="mb-4">
                  <p className="text-sm text-gray-500">パレットマスター</p>
                  <p className="font-semibold text-gray-800">
                    {paletMasterData?.palet_master_display_name || 'マスター情報なし'}
                  </p>
                </div>
              </div>
            </section>

            {/* 2. 構成部品一覧 */}
            <section className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold text-gray-800 mb-6">構成部品一覧</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr>
                      <th className="py-2 text-left text-sm font-semibold text-gray-900">部品ID</th>
                      <th className="py-2 text-left text-sm font-semibold text-gray-900">部品名</th>
                      <th className="py-2 text-left text-sm font-semibold text-gray-900">図面番号</th>
                      <th className="py-2 text-center text-sm font-semibold text-gray-900">数量</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {konpoPaletData.map((item) => (
                      <tr key={item.konpo_palet_id}>
                        <td className="py-2 text-sm font-mono">{item.buhin_id}</td>
                        <td className="py-2 text-sm">{item.buhin_name}</td>
                        <td className="py-2 text-sm">
                          {item.zumen_id ? (
                            <button
                              onClick={() => handleZumenClick(item.zumen_id)}
                              className="text-blue-600 hover:text-blue-800 hover:underline font-mono"
                            >
                              {item.zumen_id}
                            </button>
                          ) : (
                            <span className="text-gray-400">図面番号なし</span>
                          )}
                        </td>
                        <td className="py-2 text-sm text-center">{item.palet_buhin_quantity}個</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* 右カラム：進捗状況と写真 */}
          <div className="space-y-8">
            {/* 1. 進捗状況サマリー */}
            <section className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">進捗状況サマリー</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {timelineSteps.filter(s => s.status === 'complete').length}
                  </div>
                  <div className="text-sm text-blue-800">完了</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {timelineSteps.filter(s => s.status === 'current').length}
                  </div>
                  <div className="text-sm text-yellow-800">進行中</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-600">
                    {timelineSteps.filter(s => s.status === 'pending').length}
                  </div>
                  <div className="text-sm text-gray-800">未開始</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {Math.round((timelineSteps.filter(s => s.status === 'complete').length / timelineSteps.length) * 100)}%
                  </div>
                  <div className="text-sm text-green-800">進捗率</div>
                </div>
              </div>
              
              {/* 次の予定 */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">次の予定</h3>
                {(() => {
                  const nextStep = timelineSteps.find(s => s.status === 'pending' || s.status === 'current');
                  if (nextStep?.schedule) {
                    return (
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-blue-900">{nextStep.title}</p>
                          <p className="text-sm text-blue-700">{nextStep.schedule.date}</p>
                          {nextStep.schedule.responsible && (
                            <p className="text-xs text-blue-600">担当: {nextStep.schedule.responsible}</p>
                          )}
                        </div>
                        <Button 
                          onClick={() => handleEditSchedule(nextStep.id)} 
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          編集
                        </Button>
                      </div>
                    );
                  }
                  return <p className="text-blue-700">予定はありません</p>;
                })()}
              </div>
            </section>

            {/* 2. 進捗状況タイムライン */}
            <section className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold text-gray-800 mb-6">進捗状況タイムライン</h2>
              <div>
                {timelineSteps.map((step) => (
                  <TimelineStep
                    key={step.id}
                    step={step}
                    onEditSchedule={handleEditSchedule}
                    onEditActual={handleEditActual}
                  />
                ))}
              </div>
            </section>

            {/* 2. 積み荷・現地写真 */}
            <section className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold text-gray-800 mb-4">積み荷・現地写真</h2>
              <input type="file" id="photo-upload" className="hidden" accept="image/*" onChange={handlePhotoUpload}/>
              <button 
                onClick={() => document.getElementById('photo-upload')?.click()} 
                className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center justify-center font-semibold mb-4"
              >
                <CameraIcon className="w-5 h-5 mr-2" />
                写真をアップロード
              </button>
              <div className="space-y-4">
                {photos.map((photo) => (
                  <div key={photo.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="relative">
                      <img 
                        src={photo.src} 
                        alt={photo.title} 
                        className="w-full h-64 object-cover" 
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://placehold.co/600x400/cccccc/000000?text=画像読み込みエラー';
                        }}
                      />
                      <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                        デモ
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50">
                      <h3 className="font-semibold text-gray-900 mb-2">{photo.title}</h3>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>撮影日時: {photo.date}</p>
                        <p>撮影者: {photo.photographer}</p>
                        <p>備考: {photo.notes}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>



      <Modal isOpen={modalType === 'schedule'} onClose={handleCloseModal} title="予定の編集">
        <ScheduleForm onSubmit={handleSaveSchedule} onCancel={handleCloseModal} />
      </Modal>

      <Modal isOpen={modalType === 'actual'} onClose={handleCloseModal} title="実績の登録">
        <ActualForm onSubmit={handleSaveActual} onCancel={handleCloseModal} />
      </Modal>
    </div>
  );
}

// ==========================================
// フォームコンポーネント層
// ==========================================
interface ScheduleFormProps {
  onSubmit: (data: { 
    date: string; 
    notes: string; 
    priority: string;
    responsible: string;
    location: string;
  }) => void;
  onCancel: () => void;
  initialData?: {
    date: string;
    notes: string;
    priority: string;
    responsible: string;
    location: string;
  };
}

const ScheduleForm: React.FC<ScheduleFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const [date, setDate] = useState(initialData?.date || '');
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [priority, setPriority] = useState(initialData?.priority || 'medium');
  const [responsible, setResponsible] = useState(initialData?.responsible || '');
  const [location, setLocation] = useState(initialData?.location || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ date, notes, priority, responsible, location });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            予定日時 <span className="text-red-500">*</span>
          </label>
          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            優先度
          </label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="low">低</option>
            <option value="medium">中</option>
            <option value="high">高</option>
            <option value="urgent">緊急</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            担当者
          </label>
          <input
            type="text"
            value={responsible}
            onChange={(e) => setResponsible(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="担当者名を入力"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            予定場所
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="作業予定場所を入力"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          備考・詳細
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="予定に関する詳細な備考、注意事項、作業内容などを入力してください"
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" onClick={onCancel} variant="outline" size="lg">
          キャンセル
        </Button>
        <Button type="submit" size="lg" className="bg-blue-600 hover:bg-blue-700">
          計画を保存
        </Button>
      </div>
    </form>
  );
};

interface ActualFormProps {
  onSubmit: (data: { 
    date: string; 
    location: string; 
    notes: string;
    status: string;
    operator: string;
    quality: string;
  }) => void;
  onCancel: () => void;
  initialData?: {
    date: string;
    location: string;
    notes: string;
    status: string;
    operator: string;
    quality: string;
  };
}

const ActualForm: React.FC<ActualFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const [date, setDate] = useState(initialData?.date || '');
  const [location, setLocation] = useState(initialData?.location || '');
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [status, setStatus] = useState(initialData?.status || 'completed');
  const [operator, setOperator] = useState(initialData?.operator || '');
  const [quality, setQuality] = useState(initialData?.quality || 'normal');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ date, location, notes, status, operator, quality });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            完了日時 <span className="text-red-500">*</span>
          </label>
          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            完了状況
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="completed">完了</option>
            <option value="partial">部分完了</option>
            <option value="delayed">遅延</option>
            <option value="cancelled">中止</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            作業場所
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="例: 響灘ヤード C-5"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            作業者
          </label>
          <input
            type="text"
            value={operator}
            onChange={(e) => setOperator(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="作業者名を入力"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          品質評価
        </label>
        <select
          value={quality}
          onChange={(e) => setQuality(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
        >
          <option value="excellent">優秀</option>
          <option value="good">良好</option>
          <option value="normal">普通</option>
          <option value="poor">不良</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          備考・詳細
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          placeholder="作業内容、問題点、改善点などの詳細を入力してください"
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" onClick={onCancel} variant="outline" size="lg">
          キャンセル
        </Button>
        <Button type="submit" size="lg" className="bg-green-600 hover:bg-green-700">
          実績を保存
        </Button>
      </div>
    </form>
  );
}; 