const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const http = require('http');

class ServerLauncher {
    constructor() {
        this.serverProcess = null;
        this.serverPort = 3000;
        this.serverStarted = false;
        this.healthCheckInterval = null;
        this.processIdFile = path.join(__dirname, 'server.pid');
    }

    /**
     * サーバーを起動する
     */
    async startServer() {
        try {
            console.log('🚀 PME DataHub サーバーを起動しています...');
            
            // 既存のプロセスがあるかチェック
            if (await this.isServerRunning()) {
                console.log('✅ サーバーは既に起動しています');
                return true;
            }

            // サーバープロセスを起動
            this.serverProcess = spawn('node', ['server.js'], {
                cwd: __dirname,
                stdio: ['pipe', 'pipe', 'pipe'],
                detached: false
            });

            // プロセスIDを保存
            fs.writeFileSync(this.processIdFile, this.serverProcess.pid.toString());

            this.serverProcess.stdout.on('data', (data) => {
                console.log(`[サーバー出力] ${data.toString().trim()}`);
            });

            this.serverProcess.stderr.on('data', (data) => {
                console.error(`[サーバーエラー] ${data.toString().trim()}`);
            });

            this.serverProcess.on('exit', (code) => {
                console.log(`サーバープロセスが終了しました (コード: ${code})`);
                this.serverStarted = false;
                this.cleanup();
            });

            this.serverProcess.on('error', (error) => {
                console.error('サーバープロセス起動エラー:', error);
                this.serverStarted = false;
            });

            // サーバーの起動を待機
            await this.waitForServer();
            
            this.serverStarted = true;
            console.log('✅ サーバーが正常に起動しました');
            
            // ヘルスチェックを開始
            this.startHealthCheck();
            
            return true;

        } catch (error) {
            console.error('❌ サーバー起動エラー:', error);
            return false;
        }
    }

    /**
     * サーバーの起動を待機する
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
     * サーバーが既に起動しているかチェック
     */
    async isServerRunning() {
        try {
            // PIDファイルをチェック
            if (fs.existsSync(this.processIdFile)) {
                const pid = parseInt(fs.readFileSync(this.processIdFile, 'utf8'));
                
                // プロセスが存在するかチェック
                try {
                    process.kill(pid, 0); // シグナル0はプロセス存在チェックのみ
                    
                    // プロセスが存在する場合、サーバーが実際に動作しているかチェック
                    const isHealthy = await this.checkServerHealth();
                    if (isHealthy) {
                        this.serverStarted = true;
                        this.serverProcess = { pid: pid };
                        return true;
                    }
                } catch (error) {
                    // プロセスが存在しない場合はPIDファイルを削除
                    fs.unlinkSync(this.processIdFile);
                }
            }
            
            return false;
        } catch (error) {
            return false;
        }
    }

    /**
     * ヘルスチェックを開始
     */
    startHealthCheck() {
        this.healthCheckInterval = setInterval(async () => {
            try {
                const isHealthy = await this.checkServerHealth();
                if (!isHealthy && this.serverStarted) {
                    console.log('⚠️ サーバーが応答しません。再起動を試行します...');
                    await this.restartServer();
                }
            } catch (error) {
                console.error('ヘルスチェックエラー:', error);
            }
        }, 10000); // 10秒ごとにチェック
    }

    /**
     * サーバーを再起動する
     */
    async restartServer() {
        console.log('🔄 サーバーを再起動しています...');
        await this.stopServer();
        await new Promise(resolve => setTimeout(resolve, 2000)); // 2秒待機
        return await this.startServer();
    }

    /**
     * サーバーを停止する
     */
    async stopServer() {
        console.log('🛑 サーバーを停止しています...');
        
        if (this.healthCheckInterval) {
            clearInterval(this.healthCheckInterval);
            this.healthCheckInterval = null;
        }

        if (this.serverProcess) {
            try {
                // プロセスを終了
                if (this.serverProcess.kill) {
                    this.serverProcess.kill('SIGTERM');
                    
                    // 強制終了のタイムアウト
                    setTimeout(() => {
                        if (this.serverProcess && !this.serverProcess.killed) {
                            console.log('強制終了を実行します...');
                            this.serverProcess.kill('SIGKILL');
                        }
                    }, 5000);
                } else {
                    // PIDのみの場合
                    const pid = this.serverProcess.pid;
                    if (pid) {
                        process.kill(pid, 'SIGTERM');
                    }
                }
            } catch (error) {
                console.error('プロセス終了エラー:', error);
            }
            
            this.serverProcess = null;
        }

        // PIDファイルを削除
        this.cleanup();
        
        this.serverStarted = false;
        console.log('✅ サーバーが停止しました');
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
            console.error('クリーンアップエラー:', error);
        }
    }

    /**
     * サーバー状態を取得
     */
    getStatus() {
        return {
            running: this.serverStarted,
            port: this.serverPort,
            pid: this.serverProcess ? this.serverProcess.pid : null
        };
    }
}

// コマンドライン引数に応じて処理を実行
const args = process.argv.slice(2);
const command = args[0];

const launcher = new ServerLauncher();

async function main() {
    switch (command) {
        case 'start':
            const started = await launcher.startServer();
            if (started) {
                console.log('サーバーが起動しました: http://localhost:3000');
                
                // サーバーが起動したらブラウザで開く
                const { exec } = require('child_process');
                const platform = process.platform;
                let command;
                
                if (platform === 'win32') {
                    command = 'start http://localhost:3000';
                } else if (platform === 'darwin') {
                    command = 'open http://localhost:3000';
                } else {
                    command = 'xdg-open http://localhost:3000';
                }
                
                exec(command, (error) => {
                    if (error) {
                        console.log('ブラウザを手動で開いてください: http://localhost:3000');
                    }
                });
            }
            break;
            
        case 'stop':
            await launcher.stopServer();
            break;
            
        case 'restart':
            await launcher.restartServer();
            break;
            
        case 'status':
            const status = launcher.getStatus();
            console.log('サーバー状態:', status);
            break;
            
        default:
            console.log('使用方法:');
            console.log('  node launcher.js start   - サーバーを起動');
            console.log('  node launcher.js stop    - サーバーを停止');
            console.log('  node launcher.js restart - サーバーを再起動');
            console.log('  node launcher.js status  - サーバー状態を表示');
            break;
    }
}

// プロセス終了時のクリーンアップ
process.on('SIGINT', async () => {
    console.log('\n🛑 プロセスを終了しています...');
    await launcher.stopServer();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n🛑 プロセスを終了しています...');
    await launcher.stopServer();
    process.exit(0);
});

main().catch(console.error);
