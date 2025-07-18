erDiagram
    PALET_MASTER ||--o{ KONPO_PALET : "has"
    PALET_MASTER ||--o{ PALET_LIST : "is template for"

    PALET_LIST ||--o{ PALET_STATUS_HISTORY : "has history"
    PALET_LIST ||--o{ PALET_SCHEDULE : "has schedule"

    PALET_TEMP_LOCATIONS ||--o{ PALET_STATUS_HISTORY : "is used in"

    PALET_MASTER {
        int palet_master_id PK "マスターID"
        string palet_master_display_name "パレット表示名"
        datetime created_at "作成日時"
        datetime updated_at "更新日時"
    }

    KONPO_PALET {
        int konpo_palet_id PK "構成ID"
        int palet_master_id FK "マスターID"
        string buhin_id "部品ID"
        int palet_buhin_quantity "部品数量"
        datetime created_at "作成日時"
        datetime updated_at "更新日時"
    }

    PALET_LIST {
        int palet_list_id PK "現物パレットID"
        int palet_master_id FK "マスターID"
        string palet_list_display_name "パレット名"
        int palet_quantity "パレット数量"
        datetime created_at "作成日時"
        datetime updated_at "更新日時"
    }

    PALET_STATUS_HISTORY {
        int palet_status_history_id PK "履歴ID"
        int palet_list_id FK "現物パレットID"
        int palet_location_id FK "場所ID"
        string palet_status_type "パレットステータス種別"
        datetime palet_status_date "パレットステータス日時（実績）"
        string palet_location_info "パレット場所情報"
        string palet_status_notes "パレットステータス備考"
        datetime created_at "作成日時"
        datetime updated_at "更新日時"
    }

    PALET_SCHEDULE {
        int palet_schedule_id PK "計画ID"
        int palet_list_id FK "現物パレットID"
        string palet_schedule_status_type "パレットスケジュールステータス種別"
        datetime palet_planned_date "パレット計画日時"
        string palet_schedule_notes "パレットスケジュール備考"
        datetime created_at "作成日時"
        datetime updated_at "更新日時"
    }

    PALET_TEMP_LOCATIONS {
        int palet_location_id PK "場所ID"
        string palet_location_name "パレット場所名"
        string palet_location_address "パレット住所"
        string palet_contact_info "パレット連絡先情報"
        datetime created_at "作成日時"
        datetime updated_at "更新日時"        
    }
