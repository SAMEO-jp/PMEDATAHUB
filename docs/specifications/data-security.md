# データセキュリティ・管理仕様書

## 概要

このドキュメントは、PME DATAHUB システムにおけるデータ管理とセキュリティに関する技術仕様を定義する。データの機密性、完全性、可用性を確保するための包括的な対策を記述する。

## 1. データ分類

### 1.1 データ分類レベル

| 分類 | 説明 | 例 | 保護レベル |
|------|------|----|------------|
| **公開データ** | 一般公開可能な情報 | プロジェクト基本情報 | 標準 |
| **内部データ** | 社内限定の情報 | プロジェクト詳細、進捗情報 | 中程度 |
| **機密データ** | 制限されたアクセス情報 | 個人情報、財務データ | 高レベル |
| **極秘データ** | 厳格なアクセス制御が必要 | セキュリティキー、認証情報 | 最高レベル |

### 1.2 データライフサイクル
```
作成 → 保存 → 使用 → 共有 → アーカイブ → 削除
   ↓     ↓     ↓     ↓      ↓        ↓
  暗号化  アクセス制御  監査ログ  権限管理  バックアップ  完全削除
```

## 2. データベースセキュリティ

### 2.1 SQLite セキュリティ設定

#### 接続設定
```typescript
// lib/prisma/client.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

// セキュリティ強化設定
if (process.env.NODE_ENV === 'production') {
  // クエリログを無効化
  prisma.$on('beforeExit', async () => {
    console.log('Database connection closed');
  });
}

export { prisma };
```

#### データベースファイル保護
```bash
# データベースファイルの権限設定
chmod 600 data/achievements.db
chown www-data:www-data data/achievements.db

# バックアップファイルも同様
chmod 600 data/*.backup
```

### 2.2 SQLインジェクション対策

#### パラメータ化クエリ
```typescript
// ✅ 安全なクエリ例
const userId = 'user123';
const projects = await prisma.project.findMany({
  where: {
    members: {
      some: {
        userId: userId,  // パラメータ化
        status: 'active'
      }
    }
  }
});

// ❌ 危険なクエリ例（使用禁止）
const dangerousQuery = `SELECT * FROM projects WHERE user_id = '${userId}'`;
```

#### Prisma での安全なクエリビルド
```typescript
// 動的クエリビルド
export function buildProjectFilter(userId: string, filters: ProjectFilters) {
  const where: Prisma.ProjectWhereInput = {
    AND: [
      // アクセス権限チェック
      {
        OR: [
          { ownerId: userId },
          { members: { some: { userId, role: { in: ['admin', 'editor'] } } } }
        ]
      }
    ]
  };

  // フィルタ条件の追加
  if (filters.status) {
    where.AND.push({ status: filters.status });
  }

  if (filters.search) {
    where.AND.push({
      OR: [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } }
      ]
    });
  }

  return where;
}
```

## 3. 認証・認可システム

### 3.1 セッション管理

#### セッション設定
```typescript
// lib/auth/session.ts
export interface SessionData {
  userId: string;
  email: string;
  role: UserRole;
  permissions: string[];
  expiresAt: Date;
}

export class SessionManager {
  private static readonly SESSION_DURATION = 24 * 60 * 60 * 1000; // 24時間

  static createSession(user: User): SessionData {
    return {
      userId: user.id,
      email: user.email,
      role: user.role,
      permissions: this.getPermissionsForRole(user.role),
      expiresAt: new Date(Date.now() + this.SESSION_DURATION)
    };
  }

  static validateSession(session: SessionData): boolean {
    return session.expiresAt > new Date();
  }

  private static getPermissionsForRole(role: UserRole): string[] {
    const rolePermissions: Record<UserRole, string[]> = {
      admin: ['*'],
      manager: ['project.create', 'project.edit', 'project.delete', 'user.view'],
      user: ['project.view', 'project.edit.own'],
      viewer: ['project.view']
    };

    return rolePermissions[role] || [];
  }
}
```

#### JWT トークン管理
```typescript
// lib/auth/jwt.ts
import jwt from 'jsonwebtoken';

export class JWTManager {
  private static readonly SECRET_KEY = process.env.JWT_SECRET!;
  private static readonly REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

  static generateAccessToken(payload: SessionData): string {
    return jwt.sign(payload, this.SECRET_KEY, {
      expiresIn: '1h',  // アクセストークンは短時間
      issuer: 'pme-datahub',
      audience: 'pme-users'
    });
  }

  static generateRefreshToken(userId: string): string {
    return jwt.sign({ userId }, this.REFRESH_SECRET, {
      expiresIn: '30d', // リフレッシュトークンは長時間
      issuer: 'pme-datahub',
      audience: 'pme-refresh'
    });
  }

  static verifyAccessToken(token: string): SessionData {
    try {
      return jwt.verify(token, this.SECRET_KEY, {
        issuer: 'pme-datahub',
        audience: 'pme-users'
      }) as SessionData;
    } catch (error) {
      throw new AuthenticationError('Invalid access token');
    }
  }
}
```

### 3.2 ロールベースアクセス制御 (RBAC)

#### 権限定義
```typescript
// types/auth/permissions.ts
export enum Permission {
  // プロジェクト権限
  PROJECT_CREATE = 'project.create',
  PROJECT_READ = 'project.read',
  PROJECT_UPDATE = 'project.update',
  PROJECT_DELETE = 'project.delete',

  // ユーザ権限
  USER_MANAGE = 'user.manage',
  USER_VIEW = 'user.view',

  // システム権限
  SYSTEM_ADMIN = 'system.admin',
  AUDIT_LOG_VIEW = 'audit.view'
}

export enum Role {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  MANAGER = 'manager',
  USER = 'user',
  VIEWER = 'viewer'
}

// ロール別権限マッピング
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [Role.SUPER_ADMIN]: [Permission.SYSTEM_ADMIN],
  [Role.ADMIN]: [
    Permission.PROJECT_CREATE, Permission.PROJECT_READ,
    Permission.PROJECT_UPDATE, Permission.PROJECT_DELETE,
    Permission.USER_MANAGE, Permission.USER_VIEW,
    Permission.AUDIT_LOG_VIEW
  ],
  [Role.MANAGER]: [
    Permission.PROJECT_CREATE, Permission.PROJECT_READ,
    Permission.PROJECT_UPDATE, Permission.USER_VIEW
  ],
  [Role.USER]: [
    Permission.PROJECT_READ, Permission.PROJECT_UPDATE
  ],
  [Role.VIEWER]: [
    Permission.PROJECT_READ
  ]
};
```

#### 認可ミドルウェア
```typescript
// lib/auth/middleware.ts
export function requirePermission(permission: Permission) {
  return (user: User): boolean => {
    const userPermissions = ROLE_PERMISSIONS[user.role] || [];
    return userPermissions.includes(permission) ||
           userPermissions.includes(Permission.SYSTEM_ADMIN);
  };
}

export function requireAnyPermission(...permissions: Permission[]) {
  return (user: User): boolean => {
    const userPermissions = ROLE_PERMISSIONS[user.role] || [];
    return permissions.some(permission =>
      userPermissions.includes(permission) ||
      userPermissions.includes(Permission.SYSTEM_ADMIN)
    );
  };
}

// tRPC ミドルウェアでの使用
export const enforcePermission = (permission: Permission) =>
  middleware(({ ctx, next }) => {
    if (!ctx.user) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    if (!requirePermission(permission)(ctx.user)) {
      throw new TRPCError({ code: 'FORBIDDEN' });
    }

    return next();
  });
```

## 4. データ暗号化

### 4.1 保存データの暗号化

#### 機密フィールドの暗号化
```typescript
// lib/crypto/encryption.ts
import crypto from 'crypto';

export class DataEncryption {
  private static readonly ALGORITHM = 'aes-256-gcm';
  private static readonly KEY = process.env.ENCRYPTION_KEY!;
  private static readonly IV_LENGTH = 16;

  static encrypt(text: string): string {
    const iv = crypto.randomBytes(this.IV_LENGTH);
    const cipher = crypto.createCipher(this.ALGORITHM, this.KEY);

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    // IV + 認証タグ + 暗号化データ を結合
    return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted;
  }

  static decrypt(encryptedText: string): string {
    const parts = encryptedText.split(':');
    if (parts.length !== 3) {
      throw new Error('Invalid encrypted data format');
    }

    const iv = Buffer.from(parts[0], 'hex');
    const authTag = Buffer.from(parts[1], 'hex');
    const encrypted = parts[2];

    const decipher = crypto.createDecipher(this.ALGORITHM, this.KEY);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }
}
```

#### モデルの暗号化適用
```typescript
// lib/models/secure-user.ts
export class SecureUser {
  constructor(private data: any) {}

  // 機密フィールドの自動暗号化/復号化
  get email(): string {
    return DataEncryption.decrypt(this.data.encryptedEmail);
  }

  set email(value: string) {
    this.data.encryptedEmail = DataEncryption.encrypt(value);
  }

  get phoneNumber(): string | undefined {
    return this.data.encryptedPhone
      ? DataEncryption.decrypt(this.data.encryptedPhone)
      : undefined;
  }

  set phoneNumber(value: string | undefined) {
    this.data.encryptedPhone = value
      ? DataEncryption.encrypt(value)
      : null;
  }
}
```

### 4.2 通信データの暗号化

#### HTTPS 設定
```typescript
// next.config.js
module.exports = {
  // HTTPS リダイレクト
  async redirects() {
    return [
      {
        source: '/((?!api/).*)',
        destination: 'https://:host/:path*',
        permanent: true,
        condition: {
          host: { not: 'localhost' }
        }
      }
    ];
  },

  // セキュリティヘッダー
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      }
    ];
  }
};
```

## 5. 監査・ログ管理

### 5.1 監査ログ設計

#### 監査ログテーブル
```sql
CREATE TABLE audit_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  user_id TEXT,
  action TEXT NOT NULL,           -- CREATE, READ, UPDATE, DELETE
  resource_type TEXT NOT NULL,    -- project, user, document, etc.
  resource_id TEXT NOT NULL,
  old_values TEXT,                -- JSON string of old values
  new_values TEXT,                -- JSON string of new values
  ip_address TEXT,
  user_agent TEXT,
  session_id TEXT,
  status TEXT DEFAULT 'success'   -- success, failure, error
);

-- インデックス
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp DESC);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
```

#### 監査ログサービス
```typescript
// lib/audit/audit-logger.ts
export interface AuditEvent {
  userId?: string;
  action: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE';
  resourceType: string;
  resourceId: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  metadata?: Record<string, any>;
}

export class AuditLogger {
  constructor(private prisma: PrismaClient) {}

  async log(event: AuditEvent, context?: AuditContext): Promise<void> {
    try {
      await this.prisma.audit_logs.create({
        data: {
          user_id: event.userId,
          action: event.action,
          resource_type: event.resourceType,
          resource_id: event.resourceId,
          old_values: event.oldValues ? JSON.stringify(event.oldValues) : null,
          new_values: event.newValues ? JSON.stringify(event.newValues) : null,
          ip_address: context?.ipAddress,
          user_agent: context?.userAgent,
          session_id: context?.sessionId,
          status: 'success'
        }
      });
    } catch (error) {
      console.error('Failed to write audit log:', error);
      // 監査ログ書き込み失敗時はアラートを発生させる
      this.alertAuditFailure(error, event);
    }
  }

  private alertAuditFailure(error: Error, event: AuditEvent): void {
    // アラートシステムへの通知
    console.error('AUDIT LOG FAILURE:', {
      error: error.message,
      event,
      timestamp: new Date().toISOString()
    });
  }
}
```

#### 自動監査ミドルウェア
```typescript
// lib/audit/audit-middleware.ts
export function withAudit(auditLogger: AuditLogger) {
  return middleware(async ({ ctx, next, path, input }) => {
    const startTime = Date.now();

    try {
      const result = await next();

      // 成功時の監査ログ
      if (ctx.user && this.isAuditableOperation(path)) {
        await auditLogger.log({
          userId: ctx.user.id,
          action: this.getActionFromPath(path),
          resourceType: this.getResourceTypeFromPath(path),
          resourceId: this.extractResourceId(input),
          metadata: {
            path,
            duration: Date.now() - startTime,
            success: true
          }
        }, {
          ipAddress: ctx.req?.ip,
          userAgent: ctx.req?.headers['user-agent'],
          sessionId: ctx.sessionId
        });
      }

      return result;

    } catch (error) {
      // エラー時の監査ログ
      if (ctx.user) {
        await auditLogger.log({
          userId: ctx.user.id,
          action: this.getActionFromPath(path),
          resourceType: this.getResourceTypeFromPath(path),
          resourceId: this.extractResourceId(input),
          metadata: {
            path,
            duration: Date.now() - startTime,
            success: false,
            error: error.message
          }
        }, {
          ipAddress: ctx.req?.ip,
          userAgent: ctx.req?.headers['user-agent'],
          sessionId: ctx.sessionId
        });
      }

      throw error;
    }
  });
}
```

## 6. データバックアップ・復旧

### 6.1 バックアップ戦略

#### 自動バックアップ設定
```bash
# scripts/backup.sh
#!/bin/bash

BACKUP_DIR="/var/backups/pme-datahub"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/achievements_${TIMESTAMP}.db"

# データベースバックアップ
sqlite3 data/achievements.db ".backup '${BACKUP_FILE}'"

# 圧縮
gzip "${BACKUP_FILE}"

# 古いバックアップの削除（30日以上前）
find "${BACKUP_DIR}" -name "achievements_*.db.gz" -mtime +30 -delete

# バックアップ成功通知
if [ $? -eq 0 ]; then
  echo "Backup completed successfully: ${BACKUP_FILE}.gz"
else
  echo "Backup failed!" >&2
  exit 1
fi
```

#### 定期バックアップ設定 (cron)
```bash
# crontab -e
# 毎日午前2時にバックアップを実行
0 2 * * * /path/to/pme-datahub/scripts/backup.sh

# 毎週日曜午前3時に完全バックアップ
0 3 * * 0 /path/to/pme-datahub/scripts/full-backup.sh
```

### 6.2 バックアップ検証・復旧

#### バックアップ検証スクリプト
```bash
# scripts/verify-backup.sh
#!/bin/bash

BACKUP_FILE="$1"

if [ -z "$BACKUP_FILE" ]; then
  echo "Usage: $0 <backup_file>"
  exit 1
fi

# バックアップファイルの存在確認
if [ ! -f "$BACKUP_FILE" ]; then
  echo "Backup file not found: $BACKUP_FILE"
  exit 1
fi

# 解凍して検証
TEMP_DB=$(mktemp)
gunzip -c "$BACKUP_FILE" > "$TEMP_DB"

# データベース整合性チェック
if sqlite3 "$TEMP_DB" "PRAGMA integrity_check;" | grep -q "ok"; then
  echo "Backup integrity check: PASSED"

  # レコード数確認
  PROJECT_COUNT=$(sqlite3 "$TEMP_DB" "SELECT COUNT(*) FROM projects;")
  USER_COUNT=$(sqlite3 "$TEMP_DB" "SELECT COUNT(*) FROM users;")

  echo "Projects: $PROJECT_COUNT"
  echo "Users: $USER_COUNT"

else
  echo "Backup integrity check: FAILED"
  rm -f "$TEMP_DB"
  exit 1
fi

rm -f "$TEMP_DB"
echo "Backup verification completed successfully"
```

#### 復旧手順
```bash
# scripts/restore.sh
#!/bin/bash

BACKUP_FILE="$1"
TARGET_DB="data/achievements.db"

if [ -z "$BACKUP_FILE" ]; then
  echo "Usage: $0 <backup_file>"
  exit 1
fi

# 現在のデータベースをバックアップ
CURRENT_BACKUP="data/achievements_pre_restore_$(date +%Y%m%d_%H%M%S).db"
cp "$TARGET_DB" "$CURRENT_BACKUP"

echo "Current database backed up to: $CURRENT_BACKUP"

# 復旧実行
gunzip -c "$BACKUP_FILE" > "$TARGET_DB"

# 復旧確認
if sqlite3 "$TARGET_DB" "SELECT COUNT(*) FROM projects;" > /dev/null; then
  echo "Database restoration completed successfully"

  # 統計情報表示
  PROJECT_COUNT=$(sqlite3 "$TARGET_DB" "SELECT COUNT(*) FROM projects;")
  echo "Restored projects: $PROJECT_COUNT"

else
  echo "Database restoration failed!"

  # 復旧前の状態に戻す
  mv "$CURRENT_BACKUP" "$TARGET_DB"
  echo "Rolled back to pre-restore state"

  exit 1
fi
```

## 7. セキュリティ監視・対応

### 7.1 セキュリティイベント監視

#### 不審アクティビティ検知
```typescript
// lib/security/threat-detection.ts
export class ThreatDetector {
  private static readonly FAILED_LOGIN_THRESHOLD = 5;
  private static readonly TIME_WINDOW_MINUTES = 15;

  static async detectBruteForce(ipAddress: string): Promise<boolean> {
    const recentFailures = await prisma.audit_logs.count({
      where: {
        ip_address: ipAddress,
        action: 'LOGIN',
        status: 'failure',
        timestamp: {
          gte: new Date(Date.now() - this.TIME_WINDOW_MINUTES * 60 * 1000)
        }
      }
    });

    return recentFailures >= this.FAILED_LOGIN_THRESHOLD;
  }

  static async detectAnomalousAccess(userId: string): Promise<boolean> {
    // 通常とは異なるアクセスパターン検知
    const userActivity = await this.getUserActivityLast24h(userId);
    const normalPattern = await this.getUserNormalPattern(userId);

    return this.isAnomalousActivity(userActivity, normalPattern);
  }

  private static async getUserActivityLast24h(userId: string) {
    return await prisma.audit_logs.findMany({
      where: {
        user_id: userId,
        timestamp: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
        }
      }
    });
  }
}
```

#### セキュリティアラートシステム
```typescript
// lib/security/alert-system.ts
export class SecurityAlertSystem {
  static async alertSecurityEvent(
    eventType: SecurityEventType,
    details: Record<string, any>
  ): Promise<void> {
    const alert = {
      id: generateId(),
      type: eventType,
      severity: this.getSeverity(eventType),
      details,
      timestamp: new Date(),
      status: 'open'
    };

    // データベースに記録
    await prisma.security_alerts.create({ data: alert });

    // 管理者に通知
    await this.notifyAdministrators(alert);

    // 重大な場合は即時対応
    if (alert.severity === 'critical') {
      await this.triggerImmediateResponse(alert);
    }
  }

  private static getSeverity(eventType: SecurityEventType): AlertSeverity {
    const severityMap: Record<SecurityEventType, AlertSeverity> = {
      'brute_force_attempt': 'high',
      'suspicious_login': 'medium',
      'data_breach_attempt': 'critical',
      'unauthorized_access': 'high',
      'sql_injection_attempt': 'critical'
    };

    return severityMap[eventType] || 'low';
  }

  private static async notifyAdministrators(alert: SecurityAlert): Promise<void> {
    // メール通知
    const admins = await prisma.users.findMany({
      where: { role: 'admin' }
    });

    for (const admin of admins) {
      await sendEmail({
        to: admin.email,
        subject: `セキュリティアラート: ${alert.type}`,
        body: this.formatAlertEmail(alert)
      });
    }
  }
}
```

### 7.2 インシデント対応手順

#### セキュリティインシデント対応フロー
1. **検知**: セキュリティイベントの自動検知または報告
2. **評価**: インシデントの影響範囲と重大度の評価
3. **封じ込め**: 被害拡大防止のための即時対応
4. **除去**: 脅威の除去とシステム復旧
5. **回復**: 通常業務への復帰
6. **教訓**: インシデント分析と対策強化

#### インシデント対応計画書
```markdown
# セキュリティインシデント対応計画

## 1. インシデント分類
- **レベル1**: 軽微なセキュリティイベント
- **レベル2**: 中程度のセキュリティ侵害
- **レベル3**: 重大なセキュリティインシデント

## 2. 対応チーム
- **インシデント対応責任者**: セキュリティ責任者
- **技術対応チーム**: システム管理者、開発者
- **コミュニケーション担当**: 広報担当

## 3. 緊急連絡先
- セキュリティ責任者: security@pme-company.com
- システム管理者: admin@pme-company.com
- 外部セキュリティ専門家: external-security@partner.com

## 4. 対応手順
### レベル1インシデント
1. イベントのログ確認
2. 影響範囲の特定
3. 必要に応じたアクセス制限
4. 報告書の作成

### レベル2インシデント
1. インシデント対応チームの招集
2. 詳細な調査と影響評価
3. システムの一時停止（必要時）
4. データバックアップの確認
5. 復旧手順の実行

### レベル3インシデント
1. 全社的緊急体制の構築
2. 外部専門家の投入
3. 関係当局への報告（必要時）
4. 広報対応
5. 包括的な復旧計画の実行
```

---

## 8. 定期セキュリティ評価

### 8.1 セキュリティ監査項目

#### 四半期セキュリティ監査チェックリスト
- [ ] パスワードポリシーの遵守状況
- [ ] アクセス権限の適切性
- [ ] セキュリティパッチの適用状況
- [ ] 監査ログの完全性
- [ ] バックアップの有効性
- [ ] 暗号化設定の確認
- [ ] ネットワークセキュリティの評価

#### 年次セキュリティ評価
- [ ]  penetration testing の実施
- [ ] サードパーティセキュリティ監査
- [ ] セキュリティ意識向上トレーニング
- [ ] インシデント対応訓練
- [ ] セキュリティポリシーの見直し

### 8.2 コンプライアンス確認

#### GDPR 遵守チェック
- [ ] 個人データ処理の法的根拠
- [ ] データ主体権利の対応
- [ ] プライバシー影響評価
- [ ] データ漏洩時の報告体制

#### 業界標準遵守
- [ ] ISO 27001 準拠状況
- [ ] OWASP Top 10 対策状況
- [ ] 業界固有のセキュリティ基準

---

**作成日**: 2025年10月17日
**最終更新**: 2025年10月17日
**バージョン**: 1.0

**機密レベル**: 高レベル - このドキュメントは社内限定
