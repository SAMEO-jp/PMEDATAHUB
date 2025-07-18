import React from 'react';
import { Button } from '@ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@ui/card';
import { Settings, Save, Download } from 'lucide-react';
import { ColumnWidths, TableSettings } from '../columnWidths';
import { saveColumnWidths, exportColumnWidths } from '../utils/columnWidthStorage';

interface TableSettingsModalProps {
  settings: TableSettings;
  onSettingsChange: (newSettings: TableSettings) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const TableSettingsModal: React.FC<TableSettingsModalProps> = ({
  settings,
  onSettingsChange,
  isOpen,
  onClose,
}) => {
  const handleWidthChange = (key: keyof ColumnWidths, value: number) => {
    onSettingsChange({
      ...settings,
      columnWidths: {
        ...settings.columnWidths,
        [key]: value,
      },
    });
  };

  const handleRowHeightChange = (value: number) => {
    onSettingsChange({
      ...settings,
      rowHeight: value,
    });
  };

  const handleSave = () => {
    saveColumnWidths(settings);
  };

  const handleExport = () => {
    const code = exportColumnWidths();
    navigator.clipboard.writeText(code);
    alert('設定がクリップボードにコピーされました');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-[600px] max-h-[80vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            テーブル設定
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-medium">行の高さ</h3>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="30"
                  max="100"
                  value={settings.rowHeight}
                  onChange={(e) => handleRowHeightChange(parseInt(e.target.value))}
                  className="flex-1"
                />
                <span className="w-12 text-right">{settings.rowHeight}px</span>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">列幅</h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(settings.columnWidths).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <label className="text-sm font-medium">
                      {key === 'expandButton' && '展開ボタン'}
                      {key === 'zumenId' && '図面ID'}
                      {key === 'zumenName' && '図面名'}
                      {key === 'partId' && '部品ID'}
                      {key === 'partName' && '部品名'}
                      {key === 'quantity' && '数量'}
                      {key === 'manufacturer' && 'メーカー'}
                      {key === 'tanniId' && '単位ID'}
                      {key === 'listId' && 'リストID'}
                      {key === 'singleWeight' && '単重量'}
                      {key === 'totalWeight' && '総重量'}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min="30"
                        max="500"
                        value={value}
                        onChange={(e) => handleWidthChange(key as keyof ColumnWidths, parseInt(e.target.value))}
                        className="flex-1"
                      />
                      <span className="w-12 text-right">{value}px</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                設定をエクスポート
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                設定を保存
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 