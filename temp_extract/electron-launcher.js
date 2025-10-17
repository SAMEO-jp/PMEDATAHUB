const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

class PMELauncher {
    constructor() {
        this.mainWindow = null;
        this.serverProcess = null;
        this.serverStarted = false;
        this.serverPort = 3000;
        this.serverPidFile = path.join(__dirname, 'server.pid');
    }

    async createWindow() {
        // メインウィンドウを作成
        this.mainWindow = new BrowserWindow({
            width: 800,
            height: 600,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false
            },
            icon: path.join(__dirname, 'icon.png'), // アイコンファイルがあれば
            title: 'PME DataHub Launcher',
            show: false // 最初は非表示
        });

        // ローカルHTMLファイルを読み込み
        await this.mainWindow.loadFile('launcher.html');

        // ウィンドウが準備できたら表示
        this.mainWindow.once('ready-to-show', () => {
            this.mainWindow.show();
        });

        // ウィンドウが閉じられたときの処理
        this.mainWindow.on('closed', () => {
            this.mainWindow = null;
        });

        // ウィンドウが閉じられようとしたときの処理
        this.mainWindow.on('close', (event) => {
            if (this.serverStarted) {
                const choice = dialog.showMessageBoxSync(this.mainWindow, {
                    type: 'question',
                    buttons: ['はい', 'いいえ'],
                    defaultId: 0,
                    message: 'サーバーを停止しますか？',
                    detail: 'サーバーを停止すると、アプリケーションにアクセスできなくなります。'
                });

                if (choice === 0) {
                    this.stopServer();
                } else {
                    event.preventDefault();
                }
            }
        });

        // アプリケーションが閉じられようとしたときの処理
        app.on('before-quit', () => {
            this.stopServer();
        });
    }

    async startServer() {
        try {
            console.log('🚀 PME DataHub サーバーを起動しています...');

            // 既存のサーバープロセスがあるかチェック
            if (await this.isServerRunning()) {
                console.log('✅ サーバーは既に起動しています');
                this.serverStarted = true;
                return true;
            }

            // サーバープロセスを起動
            this.serverProcess = spawn('node', ['server.js'], {
                cwd: __dirname,
                stdio: ['pipe', 'pipe', 'pipe'],
                detached: false
            });

            // プロセスIDを保存
            fs.writeFileSync(this.serverPidFile, this.serverProcess.pid.toString());

            // サーバープロセスの出力を監視
            this.serverProcess.stdout.on('data', (data) => {
                console.log(`[サーバー出力] ${data.toString().trim()}`);
                this.sendToRenderer('server-output', data.toString().trim());
            });

            this.serverProcess.stderr.on('data', (data) => {
                console.error(`[サーバーエラー] ${data.toString().trim()}`);
                this.sendToRenderer('server-error', data.toString().trim());
            });

            this.serverProcess.on('exit', (code) => {
                console.log(`サーバープロセスが終了しました (コード: ${code})`);
                this.serverStarted = false;
                this.sendToRenderer('server-stopped', { code });
                this.cleanup();
            });

            this.serverProcess.on('error', (error) => {
                console.error('サーバープロセス起動エラー:', error);
                this.serverStarted = false;
                this.sendToRenderer('server-error', error.message);
            });

            // サーバーの起動を待機
            await this.waitForServer();

            this.serverStarted = true;
            console.log('✅ サーバーが正常に起動しました');
            this.sendToRenderer('server-started', { port: this.serverPort });

            return true;

        } catch (error) {
            console.error('❌ サーバー起動エラー:', error);
            this.sendToRenderer('server-error', error.message);
            return false;
        }
    }

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

    async checkServerHealth() {
        const http = require('http');
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

    async isServerRunning() {
        try {
            if (fs.existsSync(this.serverPidFile)) {
                const pid = parseInt(fs.readFileSync(this.serverPidFile, 'utf8'));
                
                try {
                    process.kill(pid, 0); // プロセス存在チェック
                    const isHealthy = await this.checkServerHealth();
                    if (isHealthy) {
                        this.serverStarted = true;
                        return true;
                    }
                } catch (error) {
                    fs.unlinkSync(this.serverPidFile);
                }
            }
            return false;
        } catch (error) {
            return false;
        }
    }

    stopServer() {
        console.log('🛑 サーバーを停止しています...');

        if (this.serverProcess) {
            try {
                this.serverProcess.kill('SIGTERM');

                // 強制終了のタイムアウト
                setTimeout(() => {
                    if (this.serverProcess && !this.serverProcess.killed) {
                        console.log('強制終了を実行します...');
                        this.serverProcess.kill('SIGKILL');
                    }
                }, 5000);
            } catch (error) {
                console.error('プロセス終了エラー:', error);
            }

            this.serverProcess = null;
        }

        this.cleanup();
        this.serverStarted = false;
        this.sendToRenderer('server-stopped', { manual: true });
        console.log('✅ サーバーが停止しました');
    }

    cleanup() {
        try {
            if (fs.existsSync(this.serverPidFile)) {
                fs.unlinkSync(this.serverPidFile);
            }
        } catch (error) {
            console.error('クリーンアップエラー:', error);
        }
    }

    sendToRenderer(channel, data) {
        if (this.mainWindow && !this.mainWindow.isDestroyed()) {
            this.mainWindow.webContents.send(channel, data);
        }
    }

    openApplication() {
        const { shell } = require('electron');
        shell.openExternal(`http://localhost:${this.serverPort}`);
    }
}

// アプリケーションの初期化
const launcher = new PMELauncher();

// Electronアプリのイベントハンドラー
app.whenReady().then(async () => {
    await launcher.createWindow();

    // 自動的にサーバーを起動
    setTimeout(async () => {
        const started = await launcher.startServer();
        if (started) {
            // サーバーが起動したら自動的にアプリケーションを開く
            setTimeout(() => {
                launcher.openApplication();
            }, 2000);
        }
    }, 1000);

    app.on('activate', async () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            await launcher.createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        launcher.stopServer();
        app.quit();
    }
});

// IPC通信の設定
ipcMain.handle('start-server', async () => {
    return await launcher.startServer();
});

ipcMain.handle('stop-server', async () => {
    launcher.stopServer();
    return true;
});

ipcMain.handle('open-application', async () => {
    launcher.openApplication();
    return true;
});

ipcMain.handle('get-server-status', async () => {
    return {
        running: launcher.serverStarted,
        port: launcher.serverPort
    };
});

// プロセス終了時のクリーンアップ
process.on('SIGINT', () => {
    launcher.stopServer();
    app.quit();
});

process.on('SIGTERM', () => {
    launcher.stopServer();
    app.quit();
});
