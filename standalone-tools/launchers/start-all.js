#!/usr/bin/env node

/**
 * 統合起動スクリプト
 * HTMLランチャー、WebSocketサーバー、PMEサーバーを統合して起動
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

class IntegratedLauncher {
    constructor() {
        this.platform = process.platform;
        this.processes = [];
        this.ports = {
            pme: 3000,
            websocket: 3001,
            helper: 3002
        };
    }

    /**
     * 統合システムを起動
     */
    async start() {
        console.log('🚀 PME DataHub 統合システムを起動しています...');
        console.log(`🖥️  プラットフォーム: ${this.platform}`);
        console.log('📋 起動予定サービス:');
        console.log(`   - PMEサーバー: http://localhost:${this.ports.pme}`);
        console.log(`   - WebSocketサーバー: ws://localhost:${this.ports.websocket}`);
        console.log(`   - ヘルパーサーバー: http://localhost:${this.ports.helper}`);
        console.log('');

        try {
            // ステップ1: 既存プロセスを停止
            await this.cleanupExistingProcesses();

            // ステップ2: ヘルパーサーバーを起動
            await this.startHelperServer();

            // ステップ3: WebSocketサーバーを起動
            await this.startWebSocketServer();

            // ステップ4: PMEサーバーを起動
            await this.startPMEServer();

            // ステップ5: HTMLランチャーを開く
            await this.openHTMLLauncher();

            console.log('');
            console.log('🎉 統合システムが正常に起動しました！');
            console.log('📱 HTMLランチャーがブラウザで開かれました');
            console.log('');
            console.log('📋 アクセス方法:');
            console.log(`   - メインアプリケーション: http://localhost:${this.ports.pme}`);
            console.log(`   - HTMLランチャー: file://${path.join(__dirname, 'launcher.html')}`);
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

            // プロセス監視
            this.monitorProcesses();

        } catch (error) {
            console.error('❌ 統合システム起動エラー:', error);
            this.cleanup();
            process.exit(1);
        }
    }

    /**
     * 既存プロセスをクリーンアップ
     */
    async cleanupExistingProcesses() {
        console.log('🧹 既存プロセスをクリーンアップしています...');

        const ports = Object.values(this.ports);
        
        for (const port of ports) {
            try {
                if (this.platform === 'win32') {
                    // Windows
                    await this.killWindowsProcess(port);
                } else {
                    // Linux/macOS
                    await this.killUnixProcess(port);
                }
            } catch (error) {
                // エラーは無視
            }
        }

        console.log('✅ 既存プロセスのクリーンアップが完了しました');
    }

    /**
     * Windowsプロセスを停止
     */
    async killWindowsProcess(port) {
        return new Promise((resolve) => {
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
     * ヘルパーサーバーを起動
     */
    async startHelperServer() {
        console.log('🔧 ヘルパーサーバーを起動しています...');

        const helperPath = path.join(__dirname, 'launcher-helper.js');
        
        if (!fs.existsSync(helperPath)) {
            console.log('⚠️  launcher-helper.js が見つかりません。スキップします。');
            return;
        }

        const process = spawn('node', [helperPath], {
            cwd: __dirname,
            stdio: ['pipe', 'pipe', 'pipe'],
            detached: false
        });

        this.processes.push({
            name: 'Helper Server',
            process: process,
            port: this.ports.helper
        });

        process.stdout.on('data', (data) => {
            console.log(`[Helper] ${data.toString().trim()}`);
        });

        process.stderr.on('data', (data) => {
            console.error(`[Helper] ${data.toString().trim()}`);
        });

        process.on('exit', (code) => {
            console.log(`ヘルパーサーバーが終了しました (コード: ${code})`);
        });

        // 起動を待機
        await this.waitForPort(this.ports.helper);
        console.log('✅ ヘルパーサーバーが起動しました');
    }

    /**
     * WebSocketサーバーを起動
     */
    async startWebSocketServer() {
        console.log('📡 WebSocketサーバーを起動しています...');

        const wsPath = path.join(__dirname, 'launcher-server.js');
        
        if (!fs.existsSync(wsPath)) {
            console.log('⚠️  launcher-server.js が見つかりません。スキップします。');
            return;
        }

        const process = spawn('node', [wsPath], {
            cwd: __dirname,
            stdio: ['pipe', 'pipe', 'pipe'],
            detached: false
        });

        this.processes.push({
            name: 'WebSocket Server',
            process: process,
            port: this.ports.websocket
        });

        process.stdout.on('data', (data) => {
            console.log(`[WebSocket] ${data.toString().trim()}`);
        });

        process.stderr.on('data', (data) => {
            console.error(`[WebSocket] ${data.toString().trim()}`);
        });

        process.on('exit', (code) => {
            console.log(`WebSocketサーバーが終了しました (コード: ${code})`);
        });

        // 起動を待機
        await this.waitForPort(this.ports.websocket);
        console.log('✅ WebSocketサーバーが起動しました');
    }

    /**
     * PMEサーバーを起動
     */
    async startPMEServer() {
        console.log('🌐 PMEサーバーを起動しています...');

        const serverPath = path.join(__dirname, 'server.js');
        
        if (!fs.existsSync(serverPath)) {
            throw new Error('server.js が見つかりません');
        }

        const process = spawn('node', [serverPath], {
            cwd: __dirname,
            stdio: ['pipe', 'pipe', 'pipe'],
            detached: false
        });

        this.processes.push({
            name: 'PME Server',
            process: process,
            port: this.ports.pme
        });

        process.stdout.on('data', (data) => {
            console.log(`[PME] ${data.toString().trim()}`);
        });

        process.stderr.on('data', (data) => {
            console.error(`[PME] ${data.toString().trim()}`);
        });

        process.on('exit', (code) => {
            console.log(`PMEサーバーが終了しました (コード: ${code})`);
        });

        // 起動を待機
        await this.waitForPort(this.ports.pme);
        console.log('✅ PMEサーバーが起動しました');
    }

    /**
     * HTMLランチャーを開く
     */
    async openHTMLLauncher() {
        console.log('📱 HTMLランチャーを開いています...');

        const launcherPath = path.join(__dirname, 'launcher.html');
        
        if (!fs.existsSync(launcherPath)) {
            console.log('⚠️  launcher.html が見つかりません。');
            return;
        }

        const url = `file://${launcherPath}`;
        
        try {
            if (this.platform === 'win32') {
                exec(`start ${url}`);
            } else if (this.platform === 'darwin') {
                exec(`open ${url}`);
            } else {
                exec(`xdg-open ${url}`);
            }
            console.log('✅ HTMLランチャーを開きました');
        } catch (error) {
            console.log(`⚠️  HTMLランチャーを手動で開いてください: ${url}`);
        }
    }

    /**
     * ポートの起動を待機
     */
    async waitForPort(port, timeout = 30000) {
        const startTime = Date.now();
        
        while (Date.now() - startTime < timeout) {
            try {
                const isListening = await this.checkPort(port);
                if (isListening) {
                    return true;
                }
            } catch (error) {
                // ポートがまだ開いていない
            }
            
            // 1秒待機
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        throw new Error(`ポート ${port} の起動がタイムアウトしました`);
    }

    /**
     * ポートが開いているかチェック
     */
    async checkPort(port) {
        return new Promise((resolve) => {
            const command = this.platform === 'win32' 
                ? `netstat -ano | findstr :${port}`
                : `lsof -ti:${port}`;
                
            exec(command, (error, stdout) => {
                resolve(stdout && stdout.trim() !== '');
            });
        });
    }

    /**
     * プロセスを監視
     */
    monitorProcesses() {
        setInterval(() => {
            this.processes.forEach(({ name, process, port }) => {
                if (process && process.exitCode !== null) {
                    console.log(`⚠️  ${name} (ポート ${port}) が異常終了しました`);
                }
            });
        }, 5000);
    }

    /**
     * クリーンアップ処理
     */
    cleanup() {
        console.log('\n🛑 統合システムを停止しています...');
        
        this.processes.forEach(({ name, process }) => {
            if (process && !process.killed) {
                console.log(`🛑 ${name} を停止しています...`);
                process.kill('SIGTERM');
            }
        });

        // 強制終了のタイムアウト
        setTimeout(() => {
            this.processes.forEach(({ name, process }) => {
                if (process && !process.killed) {
                    console.log(`💀 ${name} を強制終了しています...`);
                    process.kill('SIGKILL');
                }
            });
        }, 5000);

        console.log('✅ 統合システムが停止しました');
    }
}

// メイン実行
const launcher = new IntegratedLauncher();
launcher.start().catch(console.error);
