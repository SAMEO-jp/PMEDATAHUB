#!/usr/bin/env node

/**
 * HTMLランチャー用WebSocketサーバー
 * HTMLランチャーからNode.jsプロセスを制御するためのサーバー
 */

const WebSocket = require('ws');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const http = require('http');

class LauncherServer {
    constructor() {
        this.serverProcess = null;
        this.serverPort = 3000;
        this.launcherPort = 3001;
        this.serverStarted = false;
        this.processIdFile = path.join(__dirname, 'server.pid');
        this.wss = null;
        this.httpServer = null;
    }

    /**
     * サーバーを起動
     */
    async start() {
        console.log('🚀 HTMLランチャー用WebSocketサーバーを起動しています...');
        
        // HTTPサーバーを作成
        this.httpServer = http.createServer();
        
        // WebSocketサーバーを作成
        this.wss = new WebSocket.Server({ server: this.httpServer });
        
        // WebSocket接続を処理
        this.wss.on('connection', (ws) => {
            console.log('📱 HTMLランチャーが接続されました');
            
            ws.on('message', async (message) => {
                try {
                    const data = JSON.parse(message);
                    await this.handleMessage(ws, data);
                } catch (error) {
                    console.error('メッセージ処理エラー:', error);
                    ws.send(JSON.stringify({
                        type: 'error',
                        message: error.message
                    }));
                }
            });
            
            ws.on('close', () => {
                console.log('📱 HTMLランチャーの接続が切断されました');
                // 接続が切断されたらサーバーを停止
                if (this.serverStarted) {
                    this.stopPMEServer();
                }
            });
            
            // 接続確認メッセージを送信
            ws.send(JSON.stringify({
                type: 'connected',
                message: 'HTMLランチャーサーバーに接続されました'
            }));
        });
        
        // HTTPサーバーを起動
        this.httpServer.listen(this.launcherPort, () => {
            console.log(`✅ HTMLランチャーサーバーが起動しました: http://localhost:${this.launcherPort}`);
            console.log('📱 HTMLランチャーから接続をお待ちしています...');
        });
    }

    /**
     * メッセージを処理
     */
    async handleMessage(ws, data) {
        switch (data.action) {
            case 'start':
                await this.startPMEServer(ws);
                break;
            case 'stop':
                await this.stopPMEServer(ws);
                break;
            case 'status':
                await this.getStatus(ws);
                break;
            default:
                ws.send(JSON.stringify({
                    type: 'error',
                    message: '不明なアクション: ' + data.action
                }));
        }
    }

    /**
     * PMEサーバーを起動
     */
    async startPMEServer(ws) {
        try {
            if (this.serverStarted) {
                ws.send(JSON.stringify({
                    type: 'success',
                    action: 'start',
                    message: 'サーバーは既に起動しています',
                    status: 'running'
                }));
                return;
            }

            ws.send(JSON.stringify({
                type: 'progress',
                message: 'サーバーを起動しています...',
                progress: 20
            }));

            // 既存のサーバープロセスを停止
            await this.stopExistingProcesses();

            ws.send(JSON.stringify({
                type: 'progress',
                message: 'サーバープロセスを起動中...',
                progress: 40
            }));

            // PMEサーバーを起動
            this.serverProcess = spawn('node', ['server.js'], {
                cwd: __dirname,
                stdio: ['pipe', 'pipe', 'pipe'],
                detached: false
            });

            // プロセスIDを保存
            fs.writeFileSync(this.processIdFile, this.serverProcess.pid.toString());

            this.serverProcess.stdout.on('data', (data) => {
                const output = data.toString().trim();
                if (output) {
                    ws.send(JSON.stringify({
                        type: 'server-output',
                        message: output
                    }));
                }
            });

            this.serverProcess.stderr.on('data', (data) => {
                const output = data.toString().trim();
                if (output) {
                    ws.send(JSON.stringify({
                        type: 'server-error',
                        message: output
                    }));
                }
            });

            this.serverProcess.on('exit', (code) => {
                this.serverStarted = false;
                ws.send(JSON.stringify({
                    type: 'server-stopped',
                    code: code
                }));
                this.cleanup();
            });

            ws.send(JSON.stringify({
                type: 'progress',
                message: 'サーバーの起動を待機中...',
                progress: 60
            }));

            // サーバーの起動を待機
            await this.waitForServer(ws);

            this.serverStarted = true;
            
            ws.send(JSON.stringify({
                type: 'success',
                action: 'start',
                message: 'サーバーが正常に起動しました！',
                status: 'running',
                progress: 100,
                url: `http://localhost:${this.serverPort}`
            }));

        } catch (error) {
            ws.send(JSON.stringify({
                type: 'error',
                action: 'start',
                message: error.message,
                progress: 0
            }));
        }
    }

    /**
     * PMEサーバーを停止
     */
    async stopPMEServer(ws) {
        try {
            if (!this.serverStarted) {
                ws.send(JSON.stringify({
                    type: 'success',
                    action: 'stop',
                    message: 'サーバーは既に停止しています',
                    status: 'stopped'
                }));
                return;
            }

            ws.send(JSON.stringify({
                type: 'progress',
                message: 'サーバーを停止しています...',
                progress: 50
            }));

            if (this.serverProcess) {
                this.serverProcess.kill('SIGTERM');
                
                // 強制終了のタイムアウト
                setTimeout(() => {
                    if (this.serverProcess && !this.serverProcess.killed) {
                        this.serverProcess.kill('SIGKILL');
                    }
                }, 5000);
            }

            this.serverStarted = false;
            this.cleanup();

            ws.send(JSON.stringify({
                type: 'success',
                action: 'stop',
                message: 'サーバーが停止しました',
                status: 'stopped',
                progress: 100
            }));

        } catch (error) {
            ws.send(JSON.stringify({
                type: 'error',
                action: 'stop',
                message: error.message
            }));
        }
    }

    /**
     * サーバー状態を取得
     */
    async getStatus(ws) {
        const isHealthy = await this.checkServerHealth();
        ws.send(JSON.stringify({
            type: 'status',
            status: this.serverStarted ? 'running' : 'stopped',
            healthy: isHealthy,
            port: this.serverPort
        }));
    }

    /**
     * サーバーの起動を待機
     */
    async waitForServer(ws, timeout = 30000) {
        const startTime = Date.now();
        
        while (Date.now() - startTime < timeout) {
            try {
                const isRunning = await this.checkServerHealth();
                if (isRunning) {
                    return true;
                }
            } catch (error) {
                // サーバーがまだ起動していない
            }
            
            // 1秒待機
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        throw new Error('サーバーの起動がタイムアウトしました');
    }

    /**
     * サーバーのヘルスチェック
     */
    async checkServerHealth() {
        return new Promise((resolve) => {
            const req = http.get(`http://localhost:${this.serverPort}`, (res) => {
                resolve(res.statusCode === 200);
            });
            
            req.on('error', () => {
                resolve(false);
            });
            
            req.setTimeout(2000, () => {
                req.destroy();
                resolve(false);
            });
        });
    }

    /**
     * 既存のサーバープロセスを停止
     */
    async stopExistingProcesses() {
        try {
            if (fs.existsSync(this.processIdFile)) {
                const pid = parseInt(fs.readFileSync(this.processIdFile, 'utf8'));
                try {
                    process.kill(pid, 'SIGTERM');
                    fs.unlinkSync(this.processIdFile);
                } catch (error) {
                    // プロセスが存在しない場合は無視
                }
            }
        } catch (error) {
            // エラーは無視
        }
    }

    /**
     * クリーンアップ処理
     */
    cleanup() {
        try {
            if (fs.existsSync(this.processIdFile)) {
                fs.unlinkSync(this.processIdFile);
            }
        } catch (error) {
            // クリーンアップエラーは無視
        }
    }

    /**
     * サーバーを停止
     */
    stop() {
        if (this.wss) {
            this.wss.close();
        }
        if (this.httpServer) {
            this.httpServer.close();
        }
        this.stopPMEServer();
    }
}

// メイン実行
const launcherServer = new LauncherServer();

// プロセス終了時のクリーンアップ
process.on('SIGINT', () => {
    console.log('\n🛑 HTMLランチャーサーバーを停止しています...');
    launcherServer.stop();
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 HTMLランチャーサーバーを停止しています...');
    launcherServer.stop();
    process.exit(0);
});

launcherServer.start().catch(console.error);
