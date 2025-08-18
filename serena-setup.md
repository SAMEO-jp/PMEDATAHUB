# セレナ（Serena）MCPサーバー設定ガイド

## 概要
セレナは強力なコーディングエージェントツールキットで、LLMを完全な機能を持つエージェントに変えることができます。MCP（Model Context Protocol）サーバーとして動作し、Claude Code、Claude Desktop、Cursor、その他のIDEと統合できます。

## セットアップ手順

### 1. 前提条件
- [uv](https://docs.astral.sh/uv/getting-started/installation/) のインストールが必要です
- Python 3.8以上

### 2. セレナの実行方法

#### 方法1: uvxを使用（推奨）
最新版を直接実行できます：
```bash
uvx --from git+https://github.com/oraios/serena serena start-mcp-server
```

#### 方法2: ローカルインストール
```bash
# セレナディレクトリに移動
cd serena-main

# 設定ファイルを編集（オプション）
uv run serena config edit

# サーバーを起動
uv run serena start-mcp-server
```

### 3. Claude Codeでの設定（推奨）

Claude Codeはブラウザベースで、Claude Desktopとは異なります。以下の手順で設定：

#### プロジェクトディレクトリでコマンド実行：
```bash
# ローカルインストールを使用する場合
claude mcp add serena -- uv run --directory "C:\Users\DY0330.ENG\Desktop\project_giji\20250605bom\serena-main" serena start-mcp-server --context ide-assistant --project "C:\Users\DY0330.ENG\Desktop\project_giji\20250605bom"

# uvxを使用する場合
claude mcp add serena -- uvx --from git+https://github.com/oraios/serena serena start-mcp-server --context ide-assistant --project "C:\Users\DY0330.ENG\Desktop\project_giji\20250605bom"
```

#### 設定後の使用方法：
1. Claude Codeでプロジェクトを開く
2. セレナのツールが利用可能になる
3. 「Activate the project 20250605bom」と指示してプロジェクトをアクティベート

### 4. Claude Desktopでの設定

1. Claude Desktopを開く
2. File / Settings / Developer / MCP Servers / Edit Config
3. `claude_desktop_config.json`に以下を追加：

#### uvxを使用する場合：
```json
{
    "mcpServers": {
        "serena": {
            "command": "uvx",
            "args": ["--from", "git+https://github.com/oraios/serena", "serena", "start-mcp-server", "--context", "ide-assistant", "--project", "/path/to/your/project"]
        }
    }
}
```

#### ローカルインストールを使用する場合：
```json
{
    "mcpServers": {
        "serena": {
            "command": "uv",
            "args": ["run", "--directory", "/absolute/path/to/serena-main", "serena", "start-mcp-server", "--context", "ide-assistant", "--project", "/path/to/your/project"]
        }
    }
}
```

### 5. Cursorでの設定

Cursorでは、設定ファイルにMCPサーバーを追加できます：

```json
{
    "mcpServers": {
        "serena": {
            "command": "uvx",
            "args": ["--from", "git+https://github.com/oraios/serena", "serena", "start-mcp-server", "--context", "ide-assistant"]
        }
    }
}
```

### 6. プロジェクトのアクティベーション

セレナを使用する際は、プロジェクトをアクティベートする必要があります：

- "Activate the project /path/to/my_project"
- "Activate the project my_project"

### 7. プロジェクトのインデックス作成（推奨）

大きなプロジェクトでは、パフォーマンス向上のためにインデックスを作成することを推奨します：

```bash
uvx --from git+https://github.com/oraios/serena serena project index
```

## サポートされている言語

- Python
- TypeScript/JavaScript
- PHP
- Go
- Rust
- C#
- Java
- Elixir
- Clojure
- C/C++

## トラブルシューティング

1. **プロセスが残る場合**: ダッシュボードを使用してプロセスを管理
2. **設定エラー**: `serena config edit`で設定を確認
3. **言語サーバーの問題**: 必要な言語サーバーがインストールされているか確認

## 参考リンク
- [セレナ公式リポジトリ](https://github.com/oraios/serena)
- [MCP公式ドキュメント](https://modelcontextprotocol.io/) 