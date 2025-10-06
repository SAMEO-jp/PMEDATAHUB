#!/usr/bin/env node

/**
 * HTMLランチャーヘルパー
 * HTMLランチャーからの指示を受信してローカルスクリプトを実行
 */

const http = require('http');
const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');

class LauncherHelper {
    constructor() {
        this.port = 3002;
        this.server = null;
        this.pmeServerProcess = null;
        this.launcherServerProcess = null;
        this.platform = process.platform;
    }

    /**
     * ヘルパーサーバーを起動
     */
    start() {
        console.log('🚀 HTMLランチャーヘルパーを起動しています...');
        console.log(`🖥️  プラットフォーム: ${this.platform}`);
        console.log(`📡 ポート: ${this.port}`);

        this.server = http.createServer((req, res) => {
            this.handleRequest(req, res);
        });

        this.server.listen(this.port, () => {
            console.log(`✅ ヘルパーサーバーが起動しました: http://localhost:${this.port}`);
            console.log('📱 HTMLランチャーからの指示をお待ちしています...');
        });

        // プロセス終了時のクリーンアップ
        process.on('SIGINT', () => {
            this.cleanup();
            process.exit(0);
        });

        process.on('SIGTERM', () => {
            this.cleanup();
            process.exit(0);
        });
    }

    /**
     * HTTPリクエストを処理
     */
    handleRequest(req, res) {
        // CORSヘッダーを設定
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        if (req.method === 'OPTIONS') {
            res.writeHead(200);
            res.end();
            return;
        }

        if (req.method === 'POST' && req.url === '/start-system') {
            this.startSystem(req, res);
        } else if (req.method === 'POST' && req.url === '/stop-system') {
            this.stopSystem(req, res);
        } else if (req.method === 'GET' && req.url === '/status') {
            this.getStatus(req, res);
        } else {
            res.writeHead(404);
            res.end('Not Found');
        }
    }

    /**
     * システムを起動
     */
    async startSystem(req, res) {
        try {
            console.log('🚀 システム起動リクエストを受信しました');

            // ステップ1: WebSocketサーバーを起動
            console.log('📡 WebSocketサーバーを起動しています...');
            await this.startLauncherServer();

            // ステップ2: PMEサーバーを起動
            console.log('🌐 PMEサーバーを起動しています...');
            await this.startPMEServer();

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: true,
                message: 'システムが正常に起動しました',
                pmeUrl: 'http://localhost:3000',
                launcherUrl: 'ws://localhost:3001'
            }));

        } catch (error) {
            console.error('システム起動エラー:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: false,
                error: error.message
            }));
        }
    }

    /**
     * システムを停止
     */
    async stopSystem(req, res) {
        try {
            console.log('🛑 システム停止リクエストを受信しました');

            await this.stopPMEServer();
            await this.stopLauncherServer();

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: true,
                message: 'システムが正常に停止しました'
            }));

        } catch (error) {
            console.error('システム停止エラー:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: false,
                error: error.message
            }));
        }
    }

    /**
     * システム状態を取得
     */
    async getStatus(req, res) {
        try {
            const status = {
                launcherServer: this.launcherServerProcess ? 'running' : 'stopped',
                pmeServer: this.pmeServerProcess ? 'running' : 'stopped',
                platform: this.platform
            };

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(status));

        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                error: error.message
            }));
        }
    }

    /**
     * WebSocketサーバーを起動
     */
    async startLauncherServer() {
        if (this.launcherServerProcess) {
            console.log('📡 WebSocketサーバーは既に起動しています');
            return;
        }

        return new Promise((resolve, reject) => {
            const launcherServerPath = path.join(__dirname, 'launcher-server.js');
            
            if (!fs.existsSync(launcherServerPath)) {
                reject(new Error('launcher-server.js が見つかりません'));
                return;
            }

            this.launcherServerProcess = spawn('node', [launcherServerPath], {
                cwd: __dirname,
                stdio: ['pipe', 'pipe', 'pipe'],
                detached: false
            });

            this.launcherServerProcess.stdout.on('data', (data) => {
                console.log(`[WebSocket] ${data.toString().trim()}`);
            });

            this.launcherServerProcess.stderr.on('data', (data) => {
                console.error(`[WebSocket] ${data.toString().trim()}`);
            });

            this.launcherServerProcess.on('exit', (code) => {
                console.log(`WebSocketサーバーが終了しました (コード: ${code})`);
                this.launcherServerProcess = null;
            });

            // 起動を待機
            setTimeout(() => {
                resolve();
            }, 3000);
        });
    }

    /**
     * PMEサーバーを起動
     */
    async startPMEServer() {
        if (this.pmeServerProcess) {
            console.log('🌐 PMEサーバーは既に起動しています');
            return;
        }

        return new Promise((resolve, reject) => {
            const serverPath = path.join(__dirname, 'server.js');
            
            if (!fs.existsSync(serverPath)) {
                reject(new Error('server.js が見つかりません'));
                return;
            }

            this.pmeServerProcess = spawn('node', [serverPath], {
                cwd: __dirname,
                stdio: ['pipe', 'pipe', 'pipe'],
                detached: false
            });

            this.pmeServerProcess.stdout.on('data', (data) => {
                console.log(`[PME] ${data.toString().trim()}`);
            });

            this.pmeServerProcess.stderr.on('data', (data) => {
                console.error(`[PME] ${data.toString().trim()}`);
            });

            this.pmeServerProcess.on('exit', (code) => {
                console.log(`PMEサーバーが終了しました (コード: ${code})`);
                this.pmeServerProcess = null;
            });

            // 起動を待機
            setTimeout(() => {
                resolve();
            }, 5000);
        });
    }

    /**
     * PMEサーバーを停止
     */
    async stopPMEServer() {
        if (this.pmeServerProcess) {
            this.pmeServerProcess.kill('SIGTERM');
            this.pmeServerProcess = null;
            console.log('🌐 PMEサーバーを停止しました');
        }
    }

    /**
     * WebSocketサーバーを停止
     */
    async stopLauncherServer() {
        if (this.launcherServerProcess) {
            this.launcherServerProcess.kill('SIGTERM');
            this.launcherServerProcess = null;
            console.log('📡 WebSocketサーバーを停止しました');
        }
    }

    /**
     * クリーンアップ処理
     */
    cleanup() {
        console.log('🧹 クリーンアップを実行しています...');
        this.stopPMEServer();
        this.stopLauncherServer();
        
        if (this.server) {
            this.server.close();
        }
    }
}

// メイン実行
const helper = new LauncherHelper();
helper.start().catch(console.error);
