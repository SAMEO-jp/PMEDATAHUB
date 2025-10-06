#!/usr/bin/env node

/**
 * PME DataHub - 統一自動起動スクリプト
 * HTML、バッチファイル、シェルスクリプトの機能を統合
 * クロスプラットフォーム対応
 */

const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const http = require('http');
const readline = require('readline');

class PMELauncher {
    constructor() {
        this.serverProcess = null;
        this.serverPort = 3000;
        this.serverStarted = false;
        this.healthCheckInterval = null;
        this.processIdFile = path.join(__dirname, 'server.pid');
        this.platform = process.platform;
        this.colors = this.initColors();
        this.rl = null;
    }

    /**
     * カラー出力の初期化
     */
    initColors() {
        const colors = {
            reset: '\x1b[0m',
            bright: '\x1b[1m',
            dim: '\x1b[2m',
            red: '\x1b[31m',
            green: '\x1b[32m',
            yellow: '\x1b[33m',
            blue: '\x1b[34m',
            magenta: '\x1b[35m',
            cyan: '\x1b[36m',
            white: '\x1b[37m'
        };

        // Windows環境でカラーを無効化（必要に応じて）
        if (this.platform === 'win32') {
            try {
                exec('chcp 65001 > nul', () => {});
            } catch (error) {
                // カラーコードを無効化
                Object.keys(colors).forEach(key => {
                    colors[key] = '';
                });
            }
        }

        return colors;
    }

    /**
     * カラー付きコンソール出力
     */
    log(message, color = 'white') {
        const timestamp = new Date().toLocaleTimeString('ja-JP');
        const coloredMessage = `${this.colors[color]}${message}${this.colors.reset}`;
        console.log(`[${timestamp}] ${coloredMessage}`);
    }

    /**
     * メイン実行
     */
    async run() {
        this.log('🚀 PME DataHub 自動起動システム', 'blue');
        this.log('========================================', 'blue');
        this.log(`🖥️  プラットフォーム: ${this.platform}`, 'cyan');
        this.log(`📁 作業ディレクトリ: ${__dirname}`, 'cyan');
        console.log();

        try {
            // 環境チェック
            await this.checkEnvironment();

            // 既存プロセスの停止
            await this.stopExistingProcesses();

            // 依存関係の確認・インストール
            await this.checkDependencies();

            // サーバーの起動
            await this.startServer();

            // ブラウザで開く
            await this.openBrowser();

            // インタラクティブモード
            await this.interactiveMode();

        } catch (error) {
            this.log(`❌ エラー: ${error.message}`, 'red');
            process.exit(1);
        }
    }

    /**
     * 環境チェック
     */
    async checkEnvironment() {
        this.log('🔍 環境をチェックしています...', 'yellow');

        // Node.jsのバージョンチェック
        try {
            const version = process.version;
            this.log(`✅ Node.js ${version} が確認できました`, 'green');
        } catch (error) {
            throw new Error('Node.jsがインストールされていません');
        }

        // 必要なファイルのチェック
        const requiredFiles = ['server.js', 'package.json'];
        for (const file of requiredFiles) {
            const filePath = path.join(__dirname, file);
            if (!fs.existsSync(filePath)) {
                throw new Error(`${file} が見つかりません`);
            }
        }

        this.log('✅ 必要なファイルが確認できました', 'green');
    }

    /**
     * 既存プロセスの停止
     */
    async stopExistingProcesses() {
        this.log('🔍 既存のサーバープロセスをチェックしています...', 'yellow');

        try {
            if (this.platform === 'win32') {
                // Windows環境
                await this.stopWindowsProcesses();
            } else {
                // Linux/macOS環境
                await this.stopUnixProcesses();
            }
        } catch (error) {
            this.log(`⚠️  プロセス停止でエラーが発生しました: ${error.message}`, 'yellow');
        }
    }

    /**
     * Windows環境でのプロセス停止
     */
    async stopWindowsProcesses() {
        return new Promise((resolve) => {
            exec('netstat -ano | findstr :3000', (error, stdout) => {
                if (stdout && stdout.includes('LISTENING')) {
                    this.log('⚠️  ポート3000が使用中です。既存プロセスを停止します...', 'yellow');
                    
                    exec('for /f "tokens=5" %a in (\'netstat -aon ^| find ":3000" ^| find "LISTENING"\') do taskkill /f /pid %a', (error) => {
                        if (!error) {
                            this.log('✅ 既存プロセスを停止しました', 'green');
                        }
                        resolve();
                    });
                } else {
                    resolve();
                }
            });
        });
    }

    /**
     * Linux/macOS環境でのプロセス停止
     */
    async stopUnixProcesses() {
        return new Promise((resolve) => {
            exec('lsof -ti:3000', (error, stdout) => {
                if (stdout && stdout.trim()) {
                    this.log('⚠️  ポート3000が使用中です。既存プロセスを停止します...', 'yellow');
                    
                    exec('lsof -ti:3000 | xargs kill -9', (error) => {
                        if (!error) {
                            this.log('✅ 既存プロセスを停止しました', 'green');
                        }
                        resolve();
                    });
                } else {
                    resolve();
                }
            });
        });
    }

    /**
     * 依存関係の確認・インストール
     */
    async checkDependencies() {
        const nodeModulesPath = path.join(__dirname, 'node_modules');
        
        if (!fs.existsSync(nodeModulesPath)) {
            this.log('📦 依存関係をインストールしています...', 'yellow');
            
            await this.execCommand('npm install');
            this.log('✅ 依存関係のインストールが完了しました', 'green');
        } else {
            this.log('✅ 依存関係が確認できました', 'green');
        }
    }

    /**
     * サーバーの起動
     */
    async startServer() {
        this.log('🚀 サーバーを起動しています...', 'blue');
        this.log(`   ポート: ${this.serverPort}`, 'cyan');
        this.log(`   URL: http://localhost:${this.serverPort}`, 'cyan');
        console.log();

        try {
            // サーバープロセスを起動
            this.serverProcess = spawn('node', ['server.js'], {
                cwd: __dirname,
                stdio: ['pipe', 'pipe', 'pipe'],
                detached: false
            });

            // プロセスIDを保存
            fs.writeFileSync(this.processIdFile, this.serverProcess.pid.toString());

            // サーバーの出力を監視
            this.serverProcess.stdout.on('data', (data) => {
                const output = data.toString().trim();
                if (output) {
                    this.log(`[サーバー] ${output}`, 'dim');
                }
            });

            this.serverProcess.stderr.on('data', (data) => {
                const output = data.toString().trim();
                if (output) {
                    this.log(`[サーバーエラー] ${output}`, 'red');
                }
            });

            this.serverProcess.on('exit', (code) => {
                this.log(`サーバープロセスが終了しました (コード: ${code})`, 'yellow');
                this.serverStarted = false;
                this.cleanup();
            });

            this.serverProcess.on('error', (error) => {
                this.log(`サーバープロセス起動エラー: ${error.message}`, 'red');
                this.serverStarted = false;
            });

            // サーバーの起動を待機
            await this.waitForServer();

            this.serverStarted = true;
            this.log('✅ サーバーが正常に起動しました！', 'green');

            // ヘルスチェックを開始
            this.startHealthCheck();

        } catch (error) {
            throw new Error(`サーバー起動エラー: ${error.message}`);
        }
    }

    /**
     * サーバーの起動を待機
     */
    async waitForServer(timeout = 30000) {
        const startTime = Date.now();
        this.log('⏳ サーバーの起動を待機しています...', 'yellow');

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
     * ヘルスチェックを開始
     */
    startHealthCheck() {
        this.healthCheckInterval = setInterval(async () => {
            try {
                const isHealthy = await this.checkServerHealth();
                if (!isHealthy && this.serverStarted) {
                    this.log('⚠️  サーバーが応答しません。再起動を試行します...', 'yellow');
                    await this.restartServer();
                }
            } catch (error) {
                this.log(`ヘルスチェックエラー: ${error.message}`, 'red');
            }
        }, 10000); // 10秒ごとにチェック
    }

    /**
     * サーバーを再起動
     */
    async restartServer() {
        this.log('🔄 サーバーを再起動しています...', 'yellow');
        await this.stopServer();
        await new Promise(resolve => setTimeout(resolve, 2000)); // 2秒待機
        return await this.startServer();
    }

    /**
     * ブラウザで開く
     */
    async openBrowser() {
        const url = `http://localhost:${this.serverPort}`;
        this.log('🌐 ブラウザでアプリケーションを開いています...', 'blue');

        let command;
        if (this.platform === 'win32') {
            command = `start ${url}`;
        } else if (this.platform === 'darwin') {
            command = `open ${url}`;
        } else {
            command = `xdg-open ${url}`;
        }

        try {
            await this.execCommand(command);
            this.log('✅ ブラウザでアプリケーションを開きました', 'green');
        } catch (error) {
            this.log(`⚠️  ブラウザを手動で開いてください: ${url}`, 'yellow');
        }
    }

    /**
     * インタラクティブモード
     */
    async interactiveMode() {
        console.log();
        this.log('========================================', 'green');
        this.log('   ✅ PME DataHub が起動しました！', 'green');
        this.log('========================================', 'green');
        console.log();
        this.log('📋 操作方法:', 'cyan');
        this.log(`   - アプリケーション: http://localhost:${this.serverPort}`, 'cyan');
        this.log('   - このウィンドウを閉じるとサーバーが停止します', 'cyan');
        this.log('   - 手動で停止する場合は Ctrl+C を押してください', 'cyan');
        console.log();

        // readlineインターフェースを作成
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        // キー入力待機
        this.log('何かキーを押すとサーバーを停止します...', 'yellow');
        
        return new Promise((resolve) => {
            this.rl.question('', () => {
                this.stopServer();
                this.log('✅ サーバーが停止しました', 'green');
                this.log('アプリケーションを終了します...', 'cyan');
                setTimeout(() => {
                    process.exit(0);
                }, 2000);
                resolve();
            });
        });
    }

    /**
     * サーバーを停止
     */
    async stopServer() {
        this.log('🛑 サーバーを停止しています...', 'yellow');

        if (this.healthCheckInterval) {
            clearInterval(this.healthCheckInterval);
            this.healthCheckInterval = null;
        }

        if (this.serverProcess) {
            try {
                this.serverProcess.kill('SIGTERM');

                // 強制終了のタイムアウト
                setTimeout(() => {
                    if (this.serverProcess && !this.serverProcess.killed) {
                        this.log('強制終了を実行します...', 'yellow');
                        this.serverProcess.kill('SIGKILL');
                    }
                }, 5000);
            } catch (error) {
                this.log(`プロセス終了エラー: ${error.message}`, 'red');
            }

            this.serverProcess = null;
        }

        // PIDファイルを削除
        this.cleanup();
        this.serverStarted = false;
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
     * コマンドを実行
     */
    async execCommand(command) {
        return new Promise((resolve, reject) => {
            exec(command, { cwd: __dirname }, (error, stdout, stderr) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(stdout);
            });
        });
    }
}

// プロセス終了時のクリーンアップ
const launcher = new PMELauncher();

process.on('SIGINT', async () => {
    console.log('\n');
    launcher.log('🛑 プロセスを終了しています...', 'yellow');
    await launcher.stopServer();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n');
    launcher.log('🛑 プロセスを終了しています...', 'yellow');
    await launcher.stopServer();
    process.exit(0);
});

// メイン実行
launcher.run().catch(console.error);
