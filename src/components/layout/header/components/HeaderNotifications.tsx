import React, { useRef, useEffect, useState } from 'react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  timestamp: Date;
  isRead: boolean;
}

interface HeaderNotificationsProps {
  isOpen: boolean;
  onToggle: () => void;
  notifications?: Notification[];
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  onClearAll?: () => void;
}

/**
 * ヘッダーの通知機能を表示するコンポーネント
 */
export const HeaderNotifications: React.FC<HeaderNotificationsProps> = ({
  isOpen,
  onToggle,
  notifications = [],
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAll,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  // 未読通知数を計算
  useEffect(() => {
    setUnreadCount(notifications.filter(n => !n.isRead).length);
  }, [notifications]);

  // メニューの外側をクリックしたときに閉じる
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onToggle();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onToggle]);

  const handleMarkAsRead = (id: string) => {
    if (onMarkAsRead) {
      onMarkAsRead(id);
    }
  };

  const handleMarkAllAsRead = () => {
    if (onMarkAllAsRead) {
      onMarkAllAsRead();
    }
  };

  const handleClearAll = () => {
    if (onClearAll) {
      onClearAll();
    }
  };

  const getNotificationIcon = (type: Notification['type']) => {
    const icons = {
      info: 'info',
      warning: 'warning',
      error: 'error',
      success: 'check_circle',
    };
    return icons[type];
  };

  const getNotificationClass = (type: Notification['type']) => {
    const classes = {
      info: 'header-notification-info',
      warning: 'header-notification-warning',
      error: 'header-notification-error',
      success: 'header-notification-success',
    };
    return classes[type];
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return '今';
    if (minutes < 60) return `${minutes}分前`;
    if (hours < 24) return `${hours}時間前`;
    return `${days}日前`;
  };

  return (
    <div className="header-notifications" ref={menuRef}>
      {/* 通知ボタン */}
      <button
        className="header-notifications-button"
        onClick={onToggle}
        aria-label="通知を開く"
        aria-expanded={isOpen}
      >
        <span className="material-symbols-outlined">notifications</span>
        {unreadCount > 0 && (
          <span className="header-notifications-badge">{unreadCount}</span>
        )}
      </button>

      {/* 通知ドロップダウン */}
      {isOpen && (
        <div className="header-notifications-dropdown">
          <div className="header-notifications-header">
            <h3 className="header-notifications-title">通知</h3>
            <div className="header-notifications-actions">
              {onMarkAllAsRead && unreadCount > 0 && (
                <button
                  className="header-notifications-action"
                  onClick={handleMarkAllAsRead}
                >
                  全て既読
                </button>
              )}
              {onClearAll && notifications.length > 0 && (
                <button
                  className="header-notifications-action"
                  onClick={handleClearAll}
                >
                  全て削除
                </button>
              )}
            </div>
          </div>

          <div className="header-notifications-list">
            {notifications.length === 0 ? (
              <div className="header-notifications-empty">
                <span className="material-symbols-outlined">notifications_none</span>
                <p>通知はありません</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`header-notification-item ${getNotificationClass(notification.type)} ${
                    !notification.isRead ? 'header-notification-unread' : ''
                  }`}
                  onClick={() => handleMarkAsRead(notification.id)}
                >
                  <div className="header-notification-icon">
                    <span className="material-symbols-outlined">
                      {getNotificationIcon(notification.type)}
                    </span>
                  </div>
                  <div className="header-notification-content">
                    <h4 className="header-notification-title">{notification.title}</h4>
                    <p className="header-notification-message">{notification.message}</p>
                    <span className="header-notification-time">
                      {formatTimestamp(notification.timestamp)}
                    </span>
                  </div>
                  {!notification.isRead && (
                    <div className="header-notification-unread-indicator" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}; 