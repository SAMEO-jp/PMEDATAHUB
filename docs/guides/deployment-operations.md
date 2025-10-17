# デプロイ・運用ガイド

## 概要

このドキュメントは、PME DATAHUB システムのデプロイメント、運用、保守に関する包括的な手順を定義する。本番環境での安定した運用を確保するための標準的なプロセスを記述する。

## 1. 環境構成

### 1.1 環境区分

| 環境 | 目的 | アクセス制限 | データ特性 |
|------|------|--------------|------------|
| **開発環境** | 機能開発・単体テスト | 開発者チーム | テストデータ |
| **ステージング環境** | 統合テスト・UAT | 開発・QAチーム | 本番相当データ |
| **本番環境** | 業務運用 | 全ユーザー | 実業務データ |

### 1.2 インフラストラクチャ要件

#### サーバー要件
```yaml
# 最小要件
CPU: 2コア以上
RAM: 4GB以上
Storage: 50GB SSD以上
Network: 100Mbps以上

# 推奨要件（50ユーザー規模）
CPU: 4コア以上
RAM: 8GB以上
Storage: 100GB SSD以上
Network: 1Gbps以上
```

#### データベース要件
```yaml
# SQLite 設定
max_connections: 100
cache_size: 100MB
temp_store: memory
journal_mode: WAL
synchronous: NORMAL
```

## 2. デプロイスクリプト

### 2.1 自動デプロイスクリプト

#### メイン・デプロイスクリプト
```bash
#!/bin/bash
# scripts/deploy.sh

set -e  # エラー発生時に停止

# 設定
ENVIRONMENT=${1:-production}
VERSION=$(git rev-parse HEAD)
DEPLOY_DIR="/var/www/pme-datahub"
BACKUP_DIR="/var/backups/pme-datahub"

echo "🚀 Starting deployment to $ENVIRONMENT environment"
echo "📦 Version: $VERSION"

# 事前チェック
echo "🔍 Running pre-deployment checks..."
npm run typecheck
npm run lint
npm run test

# データベースバックアップ
echo "💾 Creating database backup..."
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/achievements_pre_deploy_$TIMESTAMP.db"
sqlite3 data/achievements.db ".backup '$BACKUP_FILE'"

# ビルド
echo "🔨 Building application..."
if [ "$ENVIRONMENT" = "production" ]; then
  npm run build:standalone
else
  npm run build
fi

# サービス停止
echo "🛑 Stopping application service..."
sudo systemctl stop pme-datahub || true

# ファイル配置
echo "📁 Deploying files..."
sudo rsync -av --delete \
  --exclude='.git' \
  --exclude='node_modules' \
  --exclude='.env*' \
  ./ "$DEPLOY_DIR/"

# 権限設定
echo "🔒 Setting permissions..."
sudo chown -R www-data:www-data "$DEPLOY_DIR"
sudo chmod -R 755 "$DEPLOY_DIR"
sudo chmod 600 "$DEPLOY_DIR/data/achievements.db"

# データベースマイグレーション
echo "🗃️ Running database migrations..."
cd "$DEPLOY_DIR"
npm run db:migrate

# サービス起動
echo "▶️ Starting application service..."
sudo systemctl start pme-datahub
sudo systemctl enable pme-datahub

# ヘルスチェック
echo "🏥 Running health checks..."
sleep 10
if curl -f http://localhost:3000/api/health; then
  echo "✅ Deployment successful!"

  # デプロイログ記録
  echo "$TIMESTAMP|$VERSION|$ENVIRONMENT|SUCCESS" >> "$DEPLOY_DIR/deploy.log"

else
  echo "❌ Deployment failed! Rolling back..."

  # ロールバック実行
  ./scripts/rollback.sh "$BACKUP_FILE"

  exit 1
fi
```

#### ロールバックスクリプト
```bash
#!/bin/bash
# scripts/rollback.sh

BACKUP_FILE="$1"

if [ -z "$BACKUP_FILE" ]; then
  echo "Usage: $0 <backup_file>"
  exit 1
fi

echo "🔄 Starting rollback..."

# サービス停止
sudo systemctl stop pme-datahub

# データベース復旧
echo "🗃️ Restoring database..."
cp "$BACKUP_FILE" data/achievements.db

# 以前のバージョンに切り戻し
if [ -d "previous_version" ]; then
  echo "📁 Restoring previous version..."
  rsync -av --delete previous_version/ ./
fi

# サービス再開
sudo systemctl start pme-datahub

echo "✅ Rollback completed"
```

### 2.2 Docker デプロイ

#### Dockerfile
```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# 依存関係インストール
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --only=production

# ビルド
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# 実行環境
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# スタンドアロン出力のコピー
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

#### docker-compose.yml
```yaml
version: '3.8'

services:
  pme-datahub:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=file:/app/data/achievements.db
    volumes:
      - ./data:/app/data
      - ./logs:/app/logs
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/ssl/certs:ro
    depends_on:
      - pme-datahub
    restart: unless-stopped
```

## 3. 監視・ログ管理

### 3.1 アプリケーション監視

#### ヘルスチェックエンドポイント
```typescript
// app/api/health/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // データベース接続チェック
    await prisma.$queryRaw`SELECT 1`;

    // メモリ使用量チェック
    const memUsage = process.memoryUsage();
    const isMemoryOk = memUsage.heapUsed / memUsage.heapTotal < 0.9;

    // レスポンスタイムチェック（簡易）
    const startTime = Date.now();

    // 基本的なクエリ実行
    const projectCount = await prisma.project.count();

    const responseTime = Date.now() - startTime;

    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'up',
        memory: isMemoryOk ? 'ok' : 'high',
        response_time: `${responseTime}ms`
      },
      metrics: {
        projects: projectCount,
        uptime: process.uptime(),
        memory: {
          used: Math.round(memUsage.heapUsed / 1024 / 1024),
          total: Math.round(memUsage.heapTotal / 1024 / 1024),
          external: Math.round(memUsage.external / 1024 / 1024)
        }
      }
    };

    return NextResponse.json(health);

  } catch (error) {
    console.error('Health check failed:', error);

    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message
    }, { status: 503 });
  }
}
```

#### システムメトリクス収集
```typescript
// lib/monitoring/metrics.ts
import { collectDefaultMetrics, Registry } from 'prom-client';

export class MetricsCollector {
  private register: Registry;

  constructor() {
    this.register = new Registry();
    collectDefaultMetrics({ register: this.register });

    // カスタムメトリクス
    this.registerGauge('active_users', 'Number of active users');
    this.registerCounter('api_requests_total', 'Total API requests');
    this.registerHistogram('api_request_duration', 'API request duration');
  }

  private registerGauge(name: string, help: string) {
    new promClient.Gauge({
      name,
      help,
      registers: [this.register]
    });
  }

  private registerCounter(name: string, help: string) {
    new promClient.Counter({
      name,
      help,
      registers: [this.register]
    });
  }

  private registerHistogram(name: string, help: string) {
    new promClient.Histogram({
      name,
      help,
      registers: [this.register]
    });
  }

  getMetrics(): Promise<string> {
    return this.register.metrics();
  }

  // メトリクス更新メソッド
  incrementApiRequests(endpoint: string) {
    // APIリクエスト数のカウント
  }

  recordApiDuration(endpoint: string, duration: number) {
    // APIレスポンスタイムの記録
  }

  setActiveUsers(count: number) {
    // アクティブユーザー数の設定
  }
}
```

### 3.2 ログ管理

#### 構造化ログ設定
```typescript
// lib/logging/logger.ts
import winston from 'winston';

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'pme-datahub' },
  transports: [
    // コンソール出力
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),

    // ファイル出力
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),

    new winston.transports.File({
      filename: 'logs/combined.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  ]
});

// リクエストログミドルウェア
export function requestLogger(req: NextRequest, res: NextResponse) {
  const start = Date.now();

  logger.info('Request started', {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.headers.get('user-agent')
  });

  // レスポンス後のログ
  const originalEnd = res.end;
  res.end = function(...args) {
    const duration = Date.now() - start;

    logger.info('Request completed', {
      method: req.method,
      url: req.url,
      statusCode: res.status,
      duration: `${duration}ms`
    });

    originalEnd.apply(this, args);
  };
}
```

#### ログローテーション設定
```bash
# logrotate設定 /etc/logrotate.d/pme-datahub
/var/www/pme-datahub/logs/*.log {
    daily
    missingok
    rotate 7
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
    postrotate
        systemctl reload pme-datahub
    endscript
}
```

## 4. バックアップ・復旧

### 4.1 自動バックアップ設定

#### バックアップスクリプト
```bash
#!/bin/bash
# scripts/backup.sh

BACKUP_ROOT="/var/backups/pme-datahub"
DATE=$(date +%Y%m%d)
TIME=$(date +%H%M%S)
BACKUP_DIR="$BACKUP_ROOT/$DATE"
BACKUP_FILE="$BACKUP_DIR/achievements_$TIME.db"

# バックアップディレクトリ作成
mkdir -p "$BACKUP_DIR"

# データベースバックアップ
echo "Creating database backup..."
sqlite3 /var/www/pme-datahub/data/achievements.db ".backup '$BACKUP_FILE'"

# 設定ファイルバックアップ
cp /var/www/pme-datahub/.env.production "$BACKUP_DIR/.env.production"

# ログファイルバックアップ
cp -r /var/www/pme-datahub/logs "$BACKUP_DIR/"

# 圧縮
echo "Compressing backup..."
tar -czf "$BACKUP_DIR.tar.gz" -C "$BACKUP_ROOT" "$DATE"
rm -rf "$BACKUP_DIR"

# 古いバックアップ削除（30日以上前）
find "$BACKUP_ROOT" -name "*.tar.gz" -mtime +30 -delete

# S3アップロード（オプション）
if [ -n "$AWS_S3_BUCKET" ]; then
  aws s3 cp "$BACKUP_DIR.tar.gz" "s3://$AWS_S3_BUCKET/backups/"
fi

echo "Backup completed: $BACKUP_DIR.tar.gz"
```

#### 定期バックアップスケジュール
```bash
# crontab -e

# 毎朝2:00にデータベースバックアップ
0 2 * * * /var/www/pme-datahub/scripts/backup.sh

# 毎週日曜日3:00にフルバックアップ
0 3 * * 0 /var/www/pme-datahub/scripts/full-backup.sh

# 毎月1日4:00にアーカイブバックアップ
0 4 1 * * /var/www/pme-datahub/scripts/archive-backup.sh
```

### 4.2 障害復旧手順

#### 復旧優先度分類
1. **クリティカル**: システム全体が停止
2. **高**: 主要機能が使用不能
3. **中**: 一部機能が使用不能
4. **低**: 軽微な問題

#### 復旧手順書
```markdown
# システム障害復旧手順

## 1. 障害検知
- 監視システムのアラート
- ユーザーからの報告
- ヘルスチェックの失敗

## 2. 初期評価
### クリティカル障害
1. ステータスページ更新
2. 関係者への緊急連絡
3. 復旧チーム招集

### その他の障害
1. 障害内容の詳細確認
2. 影響範囲の特定
3. 復旧優先度の決定

## 3. 復旧実行
### データベース障害
```bash
# サービス停止
sudo systemctl stop pme-datahub

# バックアップからの復旧
/var/www/pme-datahub/scripts/restore.sh /var/backups/latest.db

# サービス再開
sudo systemctl start pme-datahub
```

### アプリケーション障害
```bash
# ログ確認
tail -f /var/www/pme-datahub/logs/error.log

# プロセス再開
sudo systemctl restart pme-datahub

# 問題が解決しない場合
# 以前のバージョンにロールバック
/var/www/pme-datahub/scripts/rollback.sh
```

## 4. 通信・報告
- **内部**: 復旧状況を関係者に随時報告
- **外部**: ステータスページでユーザーに状況を公開
- **完了報告**: 復旧完了後、詳細な報告書を作成
```

## 5. パフォーマンス最適化

### 5.1 データベース最適化

#### インデックスの定期メンテナンス
```sql
-- インデックス統計更新
ANALYZE;

-- 使用されていないインデックスの特定
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan,
  pg_size_pretty(pg_relation_size(indexrelid))
FROM pg_stat_user_indexes
WHERE idx_scan = 0
ORDER BY pg_relation_size(indexrelid) DESC;

-- インデックス再構築
REINDEX INDEX CONCURRENTLY index_name;
```

#### クエリ最適化
```typescript
// 効率的なクエリ例
export async function getProjectsWithStats(userId: string) {
  // N+1問題を避けるため、一度のクエリで取得
  const projects = await prisma.project.findMany({
    where: {
      OR: [
        { ownerId: userId },
        { members: { some: { userId } } }
      ]
    },
    include: {
      members: {
        select: { userId: true, role: true }
      },
      _count: {
        select: { tasks: true }
      }
    }
  });

  return projects.map(project => ({
    ...project,
    memberCount: project.members.length,
    taskCount: project._count.tasks
  }));
}
```

### 5.2 キャッシュ戦略

#### Redis キャッシュ設定
```typescript
// lib/cache/redis.ts
import { Redis } from 'ioredis';

export class CacheManager {
  private redis: Redis;

  constructor() {
    this.redis = new Redis(process.env.REDIS_URL);
  }

  async get<T>(key: string): Promise<T | null> {
    const data = await this.redis.get(key);
    return data ? JSON.parse(data) : null;
  }

  async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
    const data = JSON.stringify(value);

    if (ttlSeconds) {
      await this.redis.setex(key, ttlSeconds, data);
    } else {
      await this.redis.set(key, data);
    }
  }

  async invalidate(pattern: string): Promise<void> {
    const keys = await this.redis.keys(pattern);
    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
  }
}

// 使用例
export async function getCachedProjects(userId: string) {
  const cacheKey = `projects:user:${userId}`;
  const cache = new CacheManager();

  // キャッシュチェック
  let projects = await cache.get(cacheKey);

  if (!projects) {
    // DBから取得
    projects = await getProjectsWithStats(userId);

    // キャッシュ保存（10分）
    await cache.set(cacheKey, projects, 600);
  }

  return projects;
}
```

## 6. スケーリング戦略

### 6.1 水平スケーリング

#### ロードバランサー設定
```nginx
# nginx.conf
upstream pme_app {
    ip_hash;  # セッション維持のため
    server app1.example.com:3000;
    server app2.example.com:3000;
    server app3.example.com:3000;
}

server {
    listen 80;
    server_name pme-datahub.example.com;

    location / {
        proxy_pass http://pme_app;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # タイムアウト設定
        proxy_connect_timeout 30s;
        proxy_send_timeout 30s;
        proxy_read_timeout 30s;
    }

    # 静的ファイルキャッシュ
    location /_next/static/ {
        proxy_pass http://pme_app;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### セッションストア共有
```typescript
// Redis を使用したセッション共有
export const sessionConfig = {
  store: new RedisStore({
    client: redisClient,
    prefix: 'session:',
    ttl: 86400 // 24時間
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24時間
  }
};
```

### 6.2 データベーススケーリング

#### Read Replica 設定
```typescript
// lib/prisma/replica.ts
export const prismaReplica = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_REPLICA_URL
    }
  }
});

// 読み取り専用クエリにレプリカを使用
export async function getProjectsReadOnly() {
  return await prismaReplica.project.findMany({
    // 読み取り専用操作
  });
}
```

#### シャーディング準備
```typescript
// lib/database/sharding.ts
export class DatabaseSharding {
  private shards: Map<string, PrismaClient> = new Map();

  constructor(shardConfigs: ShardConfig[]) {
    for (const config of shardConfigs) {
      this.shards.set(config.id, new PrismaClient({
        datasources: { db: { url: config.url } }
      }));
    }
  }

  getShard(projectId: string): PrismaClient {
    // プロジェクトIDに基づくシャード選択
    const shardId = this.getShardId(projectId);
    return this.shards.get(shardId)!;
  }

  private getShardId(projectId: string): string {
    // シンプルなハッシュベースシャーディング
    const hash = this.simpleHash(projectId);
    return `shard_${hash % this.shards.size}`;
  }

  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash + str.charCodeAt(i)) & 0xffffffff;
    }
    return Math.abs(hash);
  }
}
```

## 7. 定期メンテナンス

### 7.1 メンテナンスウィンドウ

#### 定期メンテナンススケジュール
- **日次**: ログローテーション、軽微なクリーンアップ
- **週次**: データベース最適化、セキュリティパッチ適用
- **月次**: フルバックアップ、包括的なセキュリティチェック
- **四半期**: 大規模アップデート、パフォーマンスチューニング
- **年次**: アーキテクチャ見直し、技術スタック更新

#### メンテナンス通知システム
```typescript
// lib/maintenance/notifier.ts
export class MaintenanceNotifier {
  static async scheduleMaintenance(
    title: string,
    description: string,
    startTime: Date,
    durationMinutes: number
  ) {
    const maintenance = {
      id: generateId(),
      title,
      description,
      startTime,
      endTime: new Date(startTime.getTime() + durationMinutes * 60 * 1000),
      status: 'scheduled'
    };

    // データベースに記録
    await prisma.maintenance_schedule.create({ data: maintenance });

    // ユーザー通知
    await this.notifyUsers(maintenance);

    // ステータスページ更新
    await this.updateStatusPage(maintenance);

    return maintenance;
  }

  private static async notifyUsers(maintenance: MaintenanceSchedule) {
    // メール通知
    const users = await prisma.users.findMany({
      where: { notification_enabled: true }
    });

    for (const user of users) {
      await sendEmail({
        to: user.email,
        subject: `メンテナンス通知: ${maintenance.title}`,
        body: this.formatMaintenanceEmail(maintenance)
      });
    }
  }
}
```

### 7.2 メトリクス監視・レポート

#### パフォーマンスレポート生成
```typescript
// lib/reporting/performance-report.ts
export class PerformanceReporter {
  static async generateMonthlyReport(year: number, month: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    // 各種メトリクスの集計
    const metrics = await this.collectMetrics(startDate, endDate);

    const report = {
      period: { year, month },
      summary: {
        totalUsers: metrics.uniqueUsers,
        totalRequests: metrics.totalRequests,
        averageResponseTime: metrics.avgResponseTime,
        errorRate: metrics.errorRate,
        uptime: metrics.uptimePercentage
      },
      performance: {
        responseTimeTrend: metrics.responseTimeTrend,
        errorTrend: metrics.errorTrend,
        resourceUsage: metrics.resourceUsage
      },
      incidents: await this.getIncidents(startDate, endDate),
      recommendations: this.generateRecommendations(metrics)
    };

    // レポート保存
    await this.saveReport(report);

    // ステークホルダーへの通知
    await this.distributeReport(report);

    return report;
  }

  private static async collectMetrics(startDate: Date, endDate: Date) {
    // 監視データからメトリクスを集計
    const [requests, errors, performance] = await Promise.all([
      this.getRequestMetrics(startDate, endDate),
      this.getErrorMetrics(startDate, endDate),
      this.getPerformanceMetrics(startDate, endDate)
    ]);

    return {
      uniqueUsers: requests.uniqueUsers,
      totalRequests: requests.total,
      avgResponseTime: performance.averageResponseTime,
      errorRate: (errors.total / requests.total) * 100,
      uptimePercentage: performance.uptimePercentage,
      responseTimeTrend: performance.trend,
      errorTrend: errors.trend,
      resourceUsage: performance.resourceUsage
    };
  }
}
```

---

## 8. セキュリティ運用

### 8.1 定期セキュリティチェック

#### 自動セキュリティスキャン
```bash
#!/bin/bash
# scripts/security-scan.sh

echo "🔒 Starting security scan..."

# 依存関係脆弱性チェック
echo "Checking dependencies..."
npm audit --audit-level moderate

# ファイル権限チェック
echo "Checking file permissions..."
find /var/www/pme-datahub -type f -perm /o+w -ls

# データベースセキュリティチェック
echo "Checking database security..."
sqlite3 data/achievements.db "SELECT sql FROM sqlite_master WHERE type='table';" | grep -i "password\|secret"

# ログ監査
echo "Checking recent suspicious activities..."
grep -i "failed\|error\|unauthorized" /var/log/pme-datahub/*.log | tail -20

echo "Security scan completed"
```

#### 侵入検知システム
```typescript
// lib/security/ids.ts
export class IntrusionDetectionSystem {
  private static readonly ALERT_THRESHOLDS = {
    failedLoginsPerMinute: 10,
    suspiciousRequestsPerMinute: 50,
    largePayloadSize: 10 * 1024 * 1024 // 10MB
  };

  static async monitorTraffic(req: NextRequest): Promise<void> {
    const clientIP = req.ip;
    const now = Date.now();

    // レート制限チェック
    const isRateLimited = await this.checkRateLimit(clientIP, now);
    if (isRateLimited) {
      await SecurityAlertSystem.alertSecurityEvent('rate_limit_exceeded', {
        ip: clientIP,
        path: req.nextUrl.pathname,
        userAgent: req.headers.get('user-agent')
      });
    }

    // ペイロードサイズチェック
    const contentLength = parseInt(req.headers.get('content-length') || '0');
    if (contentLength > this.ALERT_THRESHOLDS.largePayloadSize) {
      await SecurityAlertSystem.alertSecurityEvent('large_payload_detected', {
        ip: clientIP,
        size: contentLength,
        path: req.nextUrl.pathname
      });
    }

    // 不審なパターンチェック
    if (this.isSuspiciousRequest(req)) {
      await SecurityAlertSystem.alertSecurityEvent('suspicious_request', {
        ip: clientIP,
        path: req.nextUrl.pathname,
        method: req.method,
        headers: Object.fromEntries(req.headers)
      });
    }
  }

  private static async checkRateLimit(ip: string, timestamp: number): Promise<boolean> {
    // Redisを使用してレート制限を実装
    const key = `rate_limit:${ip}`;
    const windowStart = timestamp - 60000; // 1分間

    const requestCount = await redis.zcount(key, windowStart, timestamp);

    if (requestCount >= this.ALERT_THRESHOLDS.failedLoginsPerMinute) {
      return true;
    }

    // リクエストを記録
    await redis.zadd(key, timestamp, timestamp);
    await redis.expire(key, 60); // 1分後に expire

    return false;
  }

  private static isSuspiciousRequest(req: NextRequest): boolean {
    const path = req.nextUrl.pathname;
    const userAgent = req.headers.get('user-agent') || '';

    // SQLインジェクションのパターン
    if (/(\b(union|select|insert|delete|update|drop|create)\b.*\b(select|from|where)\b)/i.test(path)) {
      return true;
    }

    // XSS攻撃のパターン
    if (/<script|javascript:|data:text\/html/i.test(path)) {
      return true;
    }

    // ディレクトリトラバーサル
    if (/\.\.[\/\\]/.test(path)) {
      return true;
    }

    // 不審なUser-Agent
    if (!userAgent || userAgent.length < 10) {
      return true;
    }

    return false;
  }
}
```

---

## まとめ

このデプロイ・運用ガイドは、PME DATAHUB システムの安定した運用を確保するための包括的な手順を提供する。以下の原則に基づいて運用を行う：

### 運用の基本原則
1. **自動化**: 可能な限り手動操作を避け、自動化を推進
2. **監視**: システムの状態を継続的に監視し、問題を早期検知
3. **冗長性**: 単一障害点（SPOF）を排除し、高可用性を確保
4. **セキュリティ**: 常にセキュリティを最優先に考慮
5. **ドキュメント化**: 全ての運用手順を文書化し、共有

### 継続的改善
- **定期レビュー**: 運用手順の定期的な見直しと改善
- **フィードバック収集**: 運用チームからの改善提案の積極的取り入れ
- **技術進化**: 新しい技術やツールの継続的な評価と導入

---

**作成日**: 2025年10月17日
**最終更新**: 2025年10月17日
**バージョン**: 1.0

**対象者**: システム管理者、運用チーム、デプロイ担当者
