#!/usr/bin/env node

/**
 * シンプルなNode.jsサーバー起動ツール
 * node server.js または npm start を代わりに実行する
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class SimpleLauncher {
    constructor() {
        this.platform = process.platform;
        this.serverProcess = null;
        this.serverPort = 3000;
    }

    /**
     * サーバーを起動
     */
    async start() {
        console.log('🚀 PME DataHub サーバーを起動しています...');
        console.log(`🖥️  プラットフォーム: ${this.platform}`);
        console.log('');

        try {
            // 既存プロセスを停止
            await this.cleanupExistingProcesses();

            // サーバーを起動
            await this.startServer();

            console.log('');
            console.log('🎉 サーバーが正常に起動しました！');
            console.log(`🌐 アクセスURL: http://localhost:${this.serverPort}`);
            console.log('');
            console.log('🛑 停止するには Ctrl+C を押してください');

            // プロセス終了時のクリーンアップ
            process.on('SIGINT', () => {
                this.cleanup();
                process.exit(0);
            });

            process.on('SIGTERM', () => {
                this.cleanup();
                process.exit(0);
            });

        } catch (error) {
            console.error('❌ サーバー起動エラー:', error.message);
            this.cleanup();
            process.exit(1);
        }
    }

    /**
     * 既存プロセスをクリーンアップ
     */
    async cleanupExistingProcesses() {
        console.log('🧹 既存プロセスをクリーンアップしています...');

        try {
            if (this.platform === 'win32') {
                // Windows
                await this.killWindowsProcess(this.serverPort);
            } else {
                // Linux/macOS
                await this.killUnixProcess(this.serverPort);
            }
        } catch (error) {
            // エラーは無視
        }

        console.log('✅ 既存プロセスのクリーンアップが完了しました');
    }

    /**
     * Windowsプロセスを停止
     */
    async killWindowsProcess(port) {
        return new Promise((resolve) => {
            const { exec } = require('child_process');
            exec(`netstat -ano | findstr :${port}`, (error, stdout) => {
                if (stdout && stdout.includes('LISTENING')) {
                    exec(`for /f "tokens=5" %a in ('netstat -aon ^| find ":${port}" ^| find "LISTENING"') do taskkill /f /pid %a`, () => {
                        resolve();
                    });
                } else {
                    resolve();
                }
            });
        });
    }

    /**
     * Unixプロセスを停止
     */
    async killUnixProcess(port) {
        return new Promise((resolve) => {
            const { exec } = require('child_process');
            exec(`lsof -ti:${port}`, (error, stdout) => {
                if (stdout && stdout.trim()) {
                    exec(`lsof -ti:${port} | xargs kill -9`, () => {
                        resolve();
                    });
                } else {
                    resolve();
                }
            });
        });
    }

    /**
     * サーバーを起動
     */
    async startServer() {
        console.log('🌐 PMEサーバーを起動しています...');

        const serverPath = path.join(__dirname, 'server.js');
        
        if (!fs.existsSync(serverPath)) {
            throw new Error('server.js が見つかりません');
        }

        this.serverProcess = spawn('node', [serverPath], {
            cwd: __dirname,
            stdio: ['pipe', 'pipe', 'pipe'],
            detached: false
        });

        this.serverProcess.stdout.on('data', (data) => {
            const output = data.toString().trim();
            if (output) {
                console.log(`[PME] ${output}`);
            }
        });

        this.serverProcess.stderr.on('data', (data) => {
            const output = data.toString().trim();
            if (output) {
                console.error(`[PME] ${output}`);
            }
        });

        this.serverProcess.on('exit', (code) => {
            console.log(`PMEサーバーが終了しました (コード: ${code})`);
        });

        // 起動を待機
        await this.waitForServer();
        console.log('✅ PMEサーバーが起動しました');
    }

    /**
     * サーバーの起動を待機
     */
    async waitForServer(timeout = 30000) {
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
            const http = require('http');
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
     * クリーンアップ処理
     */
    cleanup() {
        console.log('\n🛑 サーバーを停止しています...');
        
        if (this.serverProcess && !this.serverProcess.killed) {
            console.log('🛑 PMEサーバーを停止しています...');
            this.serverProcess.kill('SIGTERM');
            
            // 強制終了のタイムアウト
            setTimeout(() => {
                if (this.serverProcess && !this.serverProcess.killed) {
                    console.log('💀 PMEサーバーを強制終了しています...');
                    this.serverProcess.kill('SIGKILL');
                }
            }, 5000);
        }

        console.log('✅ サーバーが停止しました');
    }
}

// メイン実行
if (require.main === module) {
    const launcher = new SimpleLauncher();
    launcher.start().catch(console.error);
}
