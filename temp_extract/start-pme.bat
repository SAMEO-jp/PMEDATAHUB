@echo off
chcp 65001 > nul
title PME DataHub - 自動起動

echo.
echo ========================================
echo    🚀 PME DataHub 自動起動システム
echo ========================================
echo.

:: 現在のディレクトリを取得
set "CURRENT_DIR=%~dp0"
cd /d "%CURRENT_DIR%"

:: Node.jsがインストールされているかチェック
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ エラー: Node.jsがインストールされていません
    echo    Node.jsをインストールしてください: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js が確認できました
node --version

:: 必要なファイルが存在するかチェック
if not exist "server.js" (
    echo ❌ エラー: server.js が見つかりません
    pause
    exit /b 1
)

if not exist "package.json" (
    echo ❌ エラー: package.json が見つかりません
    pause
    exit /b 1
)

echo ✅ 必要なファイルが確認できました

:: 依存関係をインストール（初回のみ）
if not exist "node_modules" (
    echo 📦 依存関係をインストールしています...
    npm install
    if errorlevel 1 (
        echo ❌ 依存関係のインストールに失敗しました
        pause
        exit /b 1
    )
    echo ✅ 依存関係のインストールが完了しました
)

:: サーバーを起動
echo.
echo 🚀 サーバーを起動しています...
echo    ポート: 3000
echo    URL: http://localhost:3000
echo.

:: バックグラウンドでサーバーを起動
start /b "" node server.js

:: サーバーの起動を待機
echo ⏳ サーバーの起動を待機しています...
timeout /t 3 /nobreak > nul

:: サーバーが起動したかチェック
:check_server
curl -s http://localhost:3000 >nul 2>&1
if errorlevel 1 (
    echo サーバーの起動を待機中...
    timeout /t 2 /nobreak > nul
    goto check_server
)

echo ✅ サーバーが正常に起動しました！

:: ブラウザでアプリケーションを開く
echo 🌐 ブラウザでアプリケーションを開いています...
start http://localhost:3000

echo.
echo ========================================
echo    ✅ PME DataHub が起動しました！
echo ========================================
echo.
echo 📋 操作方法:
echo    - アプリケーション: http://localhost:3000
echo    - このウィンドウを閉じるとサーバーが停止します
echo    - 手動で停止する場合は Ctrl+C を押してください
echo.

:: ユーザーが何かキーを押すまで待機
echo 何かキーを押すとサーバーを停止します...
pause >nul

echo.
echo 🛑 サーバーを停止しています...

:: ポート3000を使用しているプロセスを停止
for /f "tokens=5" %%a in ('netstat -aon ^| find ":3000" ^| find "LISTENING"') do (
    taskkill /f /pid %%a >nul 2>&1
)

echo ✅ サーバーが停止しました
echo.
echo アプリケーションを終了します...
timeout /t 2 /nobreak > nul
exit /b 0
