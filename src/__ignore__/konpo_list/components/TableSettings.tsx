import React from 'react';
import { Button } from '@ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@ui/card';
import { Settings, Save, Download } from 'lucide-react';
import type { ColumnWidths, TableSettings as TableSettingsType } from '../columnWidths';
import { saveColumnWidths, exportColumnWidths } from '../utils/columnWidthStorage';

interface TableSettingsProps {
  settings: TableSettingsType;
  onSettingsChange: (newSettings: TableSettingsType) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TableSettings: React.FC<TableSettingsProps> = ({
  settings,
  onSettingsChange,
  open,
  onOpenChange,
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

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-[600px] max-h-[80vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            テーブル設定
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
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
                      {key === 'expandColumn' && '展開列'}
                      {key === 'konpoListIdColumn' && 'コンポリストID'}
                      {key === 'weightColumn' && '重量'}
                      {key === 'hassouInColumn' && '発送元'}
                      {key === 'hassouToColumn' && '発送先'}
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