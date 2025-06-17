'use client';

import React, { useState } from 'react';
import { getBoxFileMetadata, getBoxFileDownloadUrl, refreshAccessToken } from './test';
import { TEST_FILE_ID } from './setting';
import type { BoxFileMetadata } from './test';

export default function TestPage() {
  const [metadata, setMetadata] = useState<BoxFileMetadata | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleGetMetadata = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getBoxFileMetadata(TEST_FILE_ID);
      setMetadata(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGetDownloadUrl = async () => {
    try {
      setLoading(true);
      setError('');
      const url = await getBoxFileDownloadUrl(TEST_FILE_ID);
      setDownloadUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshToken = async () => {
    try {
      setLoading(true);
      setError('');
      await refreshAccessToken();
      setError('Token refreshed successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">BOX API Test Page</h1>
      
      <div className="space-y-4">
        <div className="flex space-x-4">
          <button
            onClick={handleGetMetadata}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            Get File Metadata
          </button>
          
          <button
            onClick={handleGetDownloadUrl}
            disabled={loading}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
          >
            Get Download URL
          </button>
          
          <button
            onClick={handleRefreshToken}
            disabled={loading}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:bg-gray-400"
          >
            Refresh Token
          </button>
        </div>

        {loading && <div className="text-gray-600">Loading...</div>}
        
        {error && (
          <div className="p-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {metadata && (
          <div className="p-4 bg-gray-100 rounded">
            <h2 className="font-bold mb-2">File Metadata:</h2>
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(metadata, null, 2)}
            </pre>
          </div>
        )}

        {downloadUrl && (
          <div className="p-4 bg-gray-100 rounded">
            <h2 className="font-bold mb-2">Download URL:</h2>
            <a
              href={downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {downloadUrl}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
