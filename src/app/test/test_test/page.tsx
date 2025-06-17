'use client';

import React, { useState } from 'react';
import { TEST_FILE_ID } from './setting';

export default function TestTestPage() {
  const [metadata, setMetadata] = useState<object | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleGetMetadata = async () => {
    setLoading(true);
    setError('');
    setMetadata(null);
    try {
      const res = await fetch('/api/box/metadata?fileId=' + TEST_FILE_ID);
      if (!res.ok) throw new Error(await res.text());
      setMetadata(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const handleGetDownloadUrl = async () => {
    setLoading(true);
    setError('');
    setDownloadUrl('');
    try {
      const res = await fetch('/api/box/download?fileId=' + TEST_FILE_ID);
      if (!res.ok) throw new Error(await res.text());
      setDownloadUrl(await res.text());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">BOX SDK テストページ</h1>
      <div className="space-x-4 mb-4">
        <button onClick={handleGetMetadata} disabled={loading} className="px-4 py-2 bg-blue-500 text-white rounded">メタデータ取得</button>
        <button onClick={handleGetDownloadUrl} disabled={loading} className="px-4 py-2 bg-green-500 text-white rounded">ダウンロードURL取得</button>
      </div>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {metadata && (
        <pre className="bg-gray-100 p-2 rounded mt-4">{JSON.stringify(metadata, null, 2)}</pre>
      )}
      {downloadUrl && (
        <div className="mt-4">
          <a href={downloadUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">ダウンロードリンク</a>
        </div>
      )}
    </div>
  );
}
