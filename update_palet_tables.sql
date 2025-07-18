-- パレットテーブルの構造を新しい仕様に合わせて更新

-- 1. 既存テーブルのバックアップ
ALTER TABLE PALET_MASTER RENAME TO PALET_MASTER_OLD;
ALTER TABLE KONPO_PALET RENAME TO KONPO_PALET_OLD;
ALTER TABLE PALET_LIST RENAME TO PALET_LIST_OLD;

-- 2. 新しいテーブル構造でテーブルを作成
CREATE TABLE PALET_MASTER (
    palet_master_id TEXT PRIMARY KEY,
    palet_master_display_name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME
);

CREATE TABLE KONPO_PALET (
    konpo_palet_id INTEGER PRIMARY KEY,
    palet_master_id TEXT NOT NULL,
    buhin_id TEXT NOT NULL,
    palet_buhin_quantity INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME,
    FOREIGN KEY (palet_master_id) REFERENCES PALET_MASTER(palet_master_id)
);

CREATE TABLE PALET_LIST (
    palet_list_id INTEGER PRIMARY KEY,
    palet_master_id TEXT NOT NULL,
    palet_list_display_name TEXT,
    palet_quantity INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME,
    FOREIGN KEY (palet_master_id) REFERENCES PALET_MASTER(palet_master_id)
); 