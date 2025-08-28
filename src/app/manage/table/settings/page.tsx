'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Settings,
  Database,
  Shield,
  Download,
  Upload,
  Clock,
  Bell,
  Users,
  Key,
  FileText,
  Save,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  HardDrive,
  Activity,
  Lock
} from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('backup');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // バックアップ設定
  const [backupSettings, setBackupSettings] = useState({
    autoBackupEnabled: true,
    backupFrequency: 'daily',
    retentionDays: 30,
    backupLocation: '/backup/database',
    compressionEnabled: true,
    encryptionEnabled: false
  });

  // ログ設定
  const [logSettings, setLogSettings] = useState({
    logLevel: 'info',
    maxLogFiles: 10,
    maxLogSize: '100MB',
    enableQueryLogging: true,
    enableErrorLogging: true,
    enableAccessLogging: false,
    archiveOldLogs: true
  });

  // 権限設定
  const [permissionSettings, setPermissionSettings] = useState({
    allowSelectQueries: true,
    allowInsertQueries: false,
    allowUpdateQueries: false,
    allowDeleteQueries: false,
    allowSchemaChanges: false,
    requireAuthentication: true,
    sessionTimeout: 60,
    maxConnectionsPerUser: 5
  });

  // パフォーマンス設定
  const [performanceSettings, setPerformanceSettings] = useState({
    queryTimeout: 30,
    maxRowsPerQuery: 10000,
    enableQueryCache: true,
    cacheSize: '256MB',
    enableConnectionPooling: true,
    maxConnections: 100,
    idleConnectionTimeout: 300
  });

  const tabs = [
    { id: 'backup', label: 'バックアップ', icon: Download },
    { id: 'logs', label: 'ログ管理', icon: FileText },
    { id: 'permissions', label: '権限管理', icon: Shield },
    { id: 'performance', label: 'パフォーマンス', icon: Activity },
  ];

  const handleSaveSettings = async (section: string) => {
    setIsLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      // 実際の実装では、tRPCの設定保存APIを呼び出し
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccessMessage(`${section}設定が保存されました`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage('設定の保存に失敗しました');
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackupNow = async () => {
    setIsLoading(true);
    try {
      // バックアップ実行API呼び出し
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSuccessMessage('手動バックアップが完了しました');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage('バックアップに失敗しました');
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const renderBackupTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">自動バックアップ設定</h3>
          <button
            onClick={handleBackupNow}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            今すぐバックアップ
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="autoBackup"
              checked={backupSettings.autoBackupEnabled}
              onChange={(e) => setBackupSettings(prev => ({...prev, autoBackupEnabled: e.target.checked}))}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <label htmlFor="autoBackup" className="text-sm font-medium text-gray-700">
              自動バックアップを有効にする
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                バックアップ頻度
              </label>
              <select
                value={backupSettings.backupFrequency}
                onChange={(e) => setBackupSettings(prev => ({...prev, backupFrequency: e.target.value}))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="hourly">毎時</option>
                <option value="daily">毎日</option>
                <option value="weekly">毎週</option>
                <option value="monthly">毎月</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                保存期間（日）
              </label>
              <input
                type="number"
                value={backupSettings.retentionDays}
                onChange={(e) => setBackupSettings(prev => ({...prev, retentionDays: parseInt(e.target.value)}))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
                max="365"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              バックアップ保存先
            </label>
            <input
              type="text"
              value={backupSettings.backupLocation}
              onChange={(e) => setBackupSettings(prev => ({...prev, backupLocation: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="/backup/database"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="compression"
                checked={backupSettings.compressionEnabled}
                onChange={(e) => setBackupSettings(prev => ({...prev, compressionEnabled: e.target.checked}))}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="compression" className="text-sm text-gray-700">
                圧縮を有効にする
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="encryption"
                checked={backupSettings.encryptionEnabled}
                onChange={(e) => setBackupSettings(prev => ({...prev, encryptionEnabled: e.target.checked}))}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="encryption" className="text-sm text-gray-700">
                暗号化を有効にする
              </label>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t">
          <button
            onClick={() => handleSaveSettings('バックアップ')}
            disabled={isLoading}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            設定を保存
          </button>
        </div>
      </div>

      {/* バックアップ履歴 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">最近のバックアップ</h3>
        <div className="space-y-3">
          {[
            { date: '2025-01-15 02:00', size: '45.2MB', status: '成功', type: '自動' },
            { date: '2025-01-14 02:00', size: '44.8MB', status: '成功', type: '自動' },
            { date: '2025-01-13 14:30', size: '44.5MB', status: '成功', type: '手動' },
            { date: '2025-01-13 02:00', size: '44.3MB', status: '成功', type: '自動' },
          ].map((backup, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <div className="text-sm font-medium">{backup.date}</div>
                  <div className="text-xs text-gray-500">{backup.type}バックアップ</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">{backup.size}</div>
                <div className="text-xs text-green-600">{backup.status}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderLogsTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-6">ログ設定</h3>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ログレベル
              </label>
              <select
                value={logSettings.logLevel}
                onChange={(e) => setLogSettings(prev => ({...prev, logLevel: e.target.value}))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="debug">DEBUG</option>
                <option value="info">INFO</option>
                <option value="warn">WARN</option>
                <option value="error">ERROR</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                最大ログファイル数
              </label>
              <input
                type="number"
                value={logSettings.maxLogFiles}
                onChange={(e) => setLogSettings(prev => ({...prev, maxLogFiles: parseInt(e.target.value)}))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
                max="100"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ログファイル最大サイズ
            </label>
            <select
              value={logSettings.maxLogSize}
              onChange={(e) => setLogSettings(prev => ({...prev, maxLogSize: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="10MB">10MB</option>
              <option value="50MB">50MB</option>
              <option value="100MB">100MB</option>
              <option value="500MB">500MB</option>
            </select>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-gray-900">ログ種別</h4>
            
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="queryLogging"
                checked={logSettings.enableQueryLogging}
                onChange={(e) => setLogSettings(prev => ({...prev, enableQueryLogging: e.target.checked}))}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="queryLogging" className="text-sm text-gray-700">
                クエリログ
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="errorLogging"
                checked={logSettings.enableErrorLogging}
                onChange={(e) => setLogSettings(prev => ({...prev, enableErrorLogging: e.target.checked}))}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="errorLogging" className="text-sm text-gray-700">
                エラーログ
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="accessLogging"
                checked={logSettings.enableAccessLogging}
                onChange={(e) => setLogSettings(prev => ({...prev, enableAccessLogging: e.target.checked}))}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="accessLogging" className="text-sm text-gray-700">
                アクセスログ
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="archiveOldLogs"
                checked={logSettings.archiveOldLogs}
                onChange={(e) => setLogSettings(prev => ({...prev, archiveOldLogs: e.target.checked}))}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="archiveOldLogs" className="text-sm text-gray-700">
                古いログを自動アーカイブ
              </label>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t">
          <button
            onClick={() => handleSaveSettings('ログ')}
            disabled={isLoading}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            設定を保存
          </button>
        </div>
      </div>
    </div>
  );

  const renderPermissionsTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-6">権限設定</h3>

        <div className="space-y-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">SQL実行権限</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="allowSelect"
                  checked={permissionSettings.allowSelectQueries}
                  onChange={(e) => setPermissionSettings(prev => ({...prev, allowSelectQueries: e.target.checked}))}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="allowSelect" className="text-sm text-gray-700">
                  SELECT文の実行
                </label>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="allowInsert"
                  checked={permissionSettings.allowInsertQueries}
                  onChange={(e) => setPermissionSettings(prev => ({...prev, allowInsertQueries: e.target.checked}))}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="allowInsert" className="text-sm text-gray-700">
                  INSERT文の実行
                </label>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="allowUpdate"
                  checked={permissionSettings.allowUpdateQueries}
                  onChange={(e) => setPermissionSettings(prev => ({...prev, allowUpdateQueries: e.target.checked}))}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="allowUpdate" className="text-sm text-gray-700">
                  UPDATE文の実行
                </label>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="allowDelete"
                  checked={permissionSettings.allowDeleteQueries}
                  onChange={(e) => setPermissionSettings(prev => ({...prev, allowDeleteQueries: e.target.checked}))}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="allowDelete" className="text-sm text-gray-700">
                  DELETE文の実行
                </label>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="allowSchema"
                  checked={permissionSettings.allowSchemaChanges}
                  onChange={(e) => setPermissionSettings(prev => ({...prev, allowSchemaChanges: e.target.checked}))}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="allowSchema" className="text-sm text-gray-700">
                  スキーマ変更
                </label>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-3">セキュリティ設定</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="requireAuth"
                  checked={permissionSettings.requireAuthentication}
                  onChange={(e) => setPermissionSettings(prev => ({...prev, requireAuthentication: e.target.checked}))}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="requireAuth" className="text-sm text-gray-700">
                  認証を必須にする
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    セッションタイムアウト（分）
                  </label>
                  <input
                    type="number"
                    value={permissionSettings.sessionTimeout}
                    onChange={(e) => setPermissionSettings(prev => ({...prev, sessionTimeout: parseInt(e.target.value)}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                    max="1440"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ユーザー当たり最大接続数
                  </label>
                  <input
                    type="number"
                    value={permissionSettings.maxConnectionsPerUser}
                    onChange={(e) => setPermissionSettings(prev => ({...prev, maxConnectionsPerUser: parseInt(e.target.value)}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                    max="50"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t">
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleSaveSettings('権限')}
              disabled={isLoading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              設定を保存
            </button>
            <div className="flex items-center gap-2 text-sm text-orange-600">
              <AlertCircle className="w-4 h-4" />
              <span>権限設定の変更は即座に適用されます</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPerformanceTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-6">パフォーマンス設定</h3>

        <div className="space-y-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">クエリ設定</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  クエリタイムアウト（秒）
                </label>
                <input
                  type="number"
                  value={performanceSettings.queryTimeout}
                  onChange={(e) => setPerformanceSettings(prev => ({...prev, queryTimeout: parseInt(e.target.value)}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                  max="3600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  クエリ当たり最大行数
                </label>
                <input
                  type="number"
                  value={performanceSettings.maxRowsPerQuery}
                  onChange={(e) => setPerformanceSettings(prev => ({...prev, maxRowsPerQuery: parseInt(e.target.value)}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                  max="100000"
                />
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-3">キャッシュ設定</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="enableCache"
                  checked={performanceSettings.enableQueryCache}
                  onChange={(e) => setPerformanceSettings(prev => ({...prev, enableQueryCache: e.target.checked}))}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="enableCache" className="text-sm text-gray-700">
                  クエリキャッシュを有効にする
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  キャッシュサイズ
                </label>
                <select
                  value={performanceSettings.cacheSize}
                  onChange={(e) => setPerformanceSettings(prev => ({...prev, cacheSize: e.target.value}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={!performanceSettings.enableQueryCache}
                >
                  <option value="64MB">64MB</option>
                  <option value="128MB">128MB</option>
                  <option value="256MB">256MB</option>
                  <option value="512MB">512MB</option>
                  <option value="1GB">1GB</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-3">接続設定</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="enablePooling"
                  checked={performanceSettings.enableConnectionPooling}
                  onChange={(e) => setPerformanceSettings(prev => ({...prev, enableConnectionPooling: e.target.checked}))}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="enablePooling" className="text-sm text-gray-700">
                  接続プールを有効にする
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    最大接続数
                  </label>
                  <input
                    type="number"
                    value={performanceSettings.maxConnections}
                    onChange={(e) => setPerformanceSettings(prev => ({...prev, maxConnections: parseInt(e.target.value)}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                    max="1000"
                    disabled={!performanceSettings.enableConnectionPooling}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    アイドル接続タイムアウト（秒）
                  </label>
                  <input
                    type="number"
                    value={performanceSettings.idleConnectionTimeout}
                    onChange={(e) => setPerformanceSettings(prev => ({...prev, idleConnectionTimeout: parseInt(e.target.value)}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="60"
                    max="3600"
                    disabled={!performanceSettings.enableConnectionPooling}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t">
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleSaveSettings('パフォーマンス')}
              disabled={isLoading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              設定を保存
            </button>
            <div className="flex items-center gap-2 text-sm text-blue-600">
              <Activity className="w-4 h-4" />
              <span>パフォーマンス設定の変更には再起動が必要な場合があります</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* ヘッダー */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Link href="/manage/table">
            <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
              <ArrowLeft className="w-4 h-4" />
              戻る
            </button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">管理設定</h1>
            <p className="text-gray-600">データベース管理システムの設定</p>
          </div>
        </div>
      </div>

      {/* メッセージ表示 */}
      {successMessage && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
            <p className="text-sm text-green-800">{successMessage}</p>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
            <p className="text-sm text-red-800">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* タブナビゲーション */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* タブコンテンツ */}
      <div>
        {activeTab === 'backup' && renderBackupTab()}
        {activeTab === 'logs' && renderLogsTab()}
        {activeTab === 'permissions' && renderPermissionsTab()}
        {activeTab === 'performance' && renderPerformanceTab()}
      </div>
    </div>
  );
}