'use client';

import React, { useState } from 'react';

export default function AddPhotosToAlbum() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleAddPhotosToAlbum = async () => {
    setLoading(true);
    setResult('');

    try {
      // 既存の写真をアルバムに追加
      const photoIds = [21, 22, 23, 24, 25]; // 最初の5枚の写真
      const albumId = 8; // パレット写真アルバム

      const response = await fetch('/api/photos/add-to-album', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          photoIds,
          albumId,
        }),
      });

      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult('Error: ' + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">既存写真をアルバムに追加</h1>
      
      <div className="mb-4">
        <p className="text-gray-600">
          既存の写真（ID: 21-25）をパレット写真アルバム（ID: 8）に追加します。
        </p>
      </div>

      <button
        onClick={handleAddPhotosToAlbum}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? '処理中...' : '写真をアルバムに追加'}
      </button>

      {result && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">結果</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {result}
          </pre>
        </div>
      )}
    </div>
  );
} 