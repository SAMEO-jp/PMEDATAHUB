-- CreateTable
CREATE TABLE "社員在籍履歴" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "社員番号" INTEGER NOT NULL,
    "入社年" INTEGER NOT NULL,
    "退社年" INTEGER,
    "データ更新日" DATETIME NOT NULL,
    "データ追加日" DATETIME NOT NULL,
    "表示非表示" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "履歴付き役職情報" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "社員情報id" INTEGER NOT NULL,
    "役職" TEXT NOT NULL,
    "追加日" DATETIME NOT NULL,
    "追加理由" TEXT,
    CONSTRAINT "履歴付き役職情報_社員情報id_fkey" FOREIGN KEY ("社員情報id") REFERENCES "社員情報" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "社員情報" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "社員番号" INTEGER,
    "所属部署" INTEGER,
    "個人情報" INTEGER,
    "会社付与情報" INTEGER,
    CONSTRAINT "社員情報_会社付与情報_fkey" FOREIGN KEY ("会社付与情報") REFERENCES "会社付与情報" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "所属部署情報履歴" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "社員情報id" INTEGER NOT NULL,
    "部署情報" INTEGER,
    "追加日" DATETIME NOT NULL,
    "削除日" DATETIME,
    CONSTRAINT "所属部署情報履歴_社員情報id_fkey" FOREIGN KEY ("社員情報id") REFERENCES "社員情報" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "所属部署情報履歴_部署情報_fkey" FOREIGN KEY ("部署情報") REFERENCES "部署情報" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "部署情報" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "親子id" INTEGER,
    "名称" TEXT NOT NULL,
    "フル名称" TEXT,
    "追加日" DATETIME NOT NULL,
    "削除日" DATETIME
);

-- CreateTable
CREATE TABLE "履歴付き個人情報" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "社員情報id" INTEGER NOT NULL,
    "名字" TEXT NOT NULL,
    "名前" TEXT NOT NULL,
    "住所" TEXT,
    "電話番号" TEXT,
    "緊急連絡先" TEXT,
    "出身情報" TEXT,
    "アレルギー" TEXT,
    "追加日" DATETIME NOT NULL,
    "削除日" DATETIME,
    CONSTRAINT "履歴付き個人情報_社員情報id_fkey" FOREIGN KEY ("社員情報id") REFERENCES "社員情報" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "会社付与情報" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "社員コード" TEXT,
    "メールアドレス" TEXT,
    "内線番号" TEXT,
    "勤務地" TEXT,
    "コストセンター" TEXT,
    "追加日" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "削除日" DATETIME
);
