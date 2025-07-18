'use client';

import React, { useState, useEffect } from 'react';
import { Download, ZoomIn, ZoomOut, RotateCw, AlertCircle } from 'lucide-react';
import { Button } from '@ui/button';

// ==========================================
// 型定義層
// ==========================================

interface ZumenViewerProps {
  zumenId: string;
  zumenName?: string;
  zumenData?: {
    Zumen_ID: string;
    Zumen_Name: string;
    Zumen_Kind: string;
  };
}

// ==========================================
// メインコンポーネント層
// ==========================================

export function ZumenViewer({ zumenId, zumenName, zumenData }: ZumenViewerProps) {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isCtrlPressed, setIsCtrlPressed] = useState(false);

  // 画像読み込み
  useEffect(() => {
    const loadImage = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 画像URLを設定
        const url = `/api/zumen/${zumenId}/image`;
        setImageUrl(url);
        
        // 画像の存在確認
        const response = await fetch(url, { method: 'HEAD' });
        if (!response.ok) {
          throw new Error('画像が見つかりません');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : '画像の読み込みに失敗しました');
      } finally {
        setLoading(false);
      }
    };

    void loadImage();
  }, [zumenId]);

  // キーボードイベントハンドラー
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Control') {
        setIsCtrlPressed(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Control') {
        setIsCtrlPressed(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // ズーム機能
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.25));

  // 回転機能
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);

  // ドラッグ機能
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      e.preventDefault();
      
      if (isCtrlPressed) {
        // Ctrl+ドラッグでズーム
        const deltaY = e.clientY - dragStart.y - position.y;
        const zoomDelta = -deltaY * 0.005; // 感度調整
        const newZoom = Math.max(0.25, Math.min(3, zoom + zoomDelta));
        
        // マウス位置を中心にズーム
        const rect = e.currentTarget.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        // ズーム前の相対位置
        const relativeX = (mouseX - position.x) / zoom;
        const relativeY = (mouseY - position.y) / zoom;
        
        // 新しい位置を計算
        const newX = mouseX - relativeX * newZoom;
        const newY = mouseY - relativeY * newZoom;
        
        setZoom(newZoom);
        setPosition({ x: newX, y: newY });
        
        // ドラッグ開始位置を更新
        setDragStart({
          x: e.clientX - newX,
          y: e.clientY - newY
        });
      } else {
        // 通常のドラッグ（移動）
        setPosition({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y
        });
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleResetPosition = () => {
    setPosition({ x: 0, y: 0 });
  };

  // ズームリセット時に位置もリセット
  const handleResetZoom = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  // ダウンロード機能
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `${zumenName || zumenId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent mx-auto mb-2"></div>
          <p className="text-gray-600 text-sm">画像を読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-medium mb-2">画像の読み込みに失敗しました</p>
          <p className="text-gray-500 text-sm mb-4">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            variant="outline" 
            size="sm"
          >
            再試行
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
      {/* ツールバー */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-4">
          {/* 図面情報 */}
          {zumenData && (
            <div className="flex items-center space-x-2">
              <span className={`inline-flex px-2 py-1 rounded-full text-xs font-bold shadow-sm ${
                zumenData.Zumen_Kind === '組立図'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                  : 'bg-blue-100 text-blue-800 border border-blue-200'
              }`}>
                {zumenData.Zumen_Kind}
              </span>
              <span className="text-lg font-bold text-gray-900">{zumenData.Zumen_Name}</span>
            </div>
          )}
          

        </div>
        
        <div className="flex items-center gap-2">
          {/* ズームコントロール */}
          <div className="flex items-center gap-1">
            <Button
              onClick={handleZoomOut}
              variant="outline"
              size="sm"
              disabled={zoom <= 0.25}
              className="h-8 w-8 p-0"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm text-gray-600 min-w-[3rem] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <Button
              onClick={handleZoomIn}
              variant="outline"
              size="sm"
              disabled={zoom >= 3}
              className="h-8 w-8 p-0"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              onClick={handleResetZoom}
              variant="outline"
              size="sm"
              className="h-8 px-2 text-xs"
            >
              ズームリセット
            </Button>
            <Button
              onClick={handleResetPosition}
              variant="outline"
              size="sm"
              className="h-8 px-2 text-xs"
            >
              位置リセット
            </Button>
          </div>
          
          {/* 回転ボタン */}
          <Button
            onClick={handleRotate}
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
          >
            <RotateCw className="h-4 w-4" />
          </Button>
          
          {/* ダウンロードボタン */}
          <Button
            onClick={handleDownload}
            variant="outline"
            size="sm"
            className="h-8 px-3"
          >
            <Download className="h-4 w-4 mr-1" />
            保存
          </Button>
        </div>
      </div>

      {/* 画像表示エリア */}
      <div 
        className="relative overflow-hidden bg-gray-100 cursor-grab active:cursor-grabbing select-none" 
        style={{ height: 'calc(100vh - 170px)' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div className="flex items-center justify-center min-h-full p-4">
          <div
            className="relative"
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${zoom}) rotate(${rotation}deg)`,
              transformOrigin: 'center center',
              transition: isDragging ? 'none' : 'transform 0.1s ease-out',
              cursor: isDragging ? 'grabbing' : 'grab',
              userSelect: 'none'
            }}
          >
            <img
              src={imageUrl}
              alt={`図面 ${zumenName || zumenId}`}
              className="max-w-full max-h-full object-contain shadow-lg rounded"
              onError={() => setError('画像の表示に失敗しました')}
            />
          </div>
        </div>
      </div>

      {/* 画像情報 */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">図面ID:</span>
            <span className="ml-2 text-gray-600">{zumenId}</span>
          </div>
          {zumenName && (
            <div>
              <span className="font-medium text-gray-700">図面名:</span>
              <span className="ml-2 text-gray-600">{zumenName}</span>
            </div>
          )}
          <div>
            <span className="font-medium text-gray-700">表示倍率:</span>
            <span className="ml-2 text-gray-600">{Math.round(zoom * 100)}%</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">位置:</span>
            <span className="ml-2 text-gray-600">X: {Math.round(position.x)}px, Y: {Math.round(position.y)}px</span>
          </div>
        </div>
      </div>
    </div>
  );
}