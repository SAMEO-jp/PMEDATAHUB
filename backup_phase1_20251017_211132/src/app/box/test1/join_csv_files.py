#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
CSVファイル結合スクリプト
3つのCSVファイルをファイルBOX IDで結合します。
"""

import csv
import os
from typing import Dict, List, Any
from collections import defaultdict


def normalize_box_id(box_id: str) -> str:
    """BOX IDを正規化（クォート除去）"""
    return box_id.strip("'").strip()


def load_csv_data(filepath: str) -> List[Dict[str, Any]]:
    """CSVファイルを読み込んで辞書のリストとして返す"""
    data = []
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            # タブ区切りを検出して適切な区切り文字を決定
            sample = f.read(1024)
            f.seek(0)
            delimiter = '\t' if '\t' in sample else ','

            reader = csv.DictReader(f, delimiter=delimiter)
            for row in reader:
                # BOX IDを正規化
                if 'ファイル BOX ID' in row:
                    row['ファイル BOX ID'] = normalize_box_id(row['ファイル BOX ID'])
                elif 'ファイルBOXID' in row:  # 念のため別の表記に対応
                    row['ファイル BOX ID'] = normalize_box_id(row['ファイルBOXID'])
                data.append(row)

        print(f"{filepath}: {len(data)}行読み込みました")
        return data

    except FileNotFoundError:
        print(f"エラー: ファイル {filepath} が見つかりません")
        return []
    except Exception as e:
        print(f"エラー: {filepath} の読み込みに失敗しました - {e}")
        return []


def create_lookup_tables(data_list: List[Dict[str, Any]], key_field: str) -> Dict[str, List[Dict[str, Any]]]:
    """データをキーごとにグループ化してルックアップテーブルを作成"""
    lookup = defaultdict(list)
    for item in data_list:
        key = item.get(key_field, '')
        if key:
            lookup[key].append(item)
    return lookup


def merge_data(details_data: List[Dict[str, Any]],
              categories_lookup: Dict[str, List[Dict[str, Any]]],
              technologies_lookup: Dict[str, List[Dict[str, Any]]]) -> List[Dict[str, Any]]:
    """3つのデータソースを結合"""
    merged_data = []

    for detail in details_data:
        box_id = detail.get('ファイル BOX ID', '')

        # カテゴリ情報を取得（複数ある場合は全て組み合わせる）
        categories = categories_lookup.get(box_id, [])

        # 技術要素情報を取得（複数ある場合は全て組み合わせる）
        technologies = technologies_lookup.get(box_id, [])

        if not categories and not technologies:
            # 対応するデータがない場合
            merged_row = detail.copy()
            merged_data.append(merged_row)
        elif categories and technologies:
            # 両方のデータがある場合、全ての組み合わせを作成
            for category in categories:
                for technology in technologies:
                    merged_row = detail.copy()
                    # カテゴリ情報を追加
                    merged_row.update({
                        'カテゴリ_1次分野': category.get('1次分野', ''),
                        'カテゴリ_2次分野': category.get('2次分野', ''),
                        'カテゴリ_3次分野': category.get('3次分野', '')
                    })
                    # 技術要素情報を追加
                    merged_row.update({
                        '技術_1次要素': technology.get('1次要素', ''),
                        '技術_2次要素': technology.get('2次要素', ''),
                        '技術_3次要素': technology.get('3次要素', '')
                    })
                    merged_data.append(merged_row)
        elif categories:
            # カテゴリ情報のみがある場合
            for category in categories:
                merged_row = detail.copy()
                merged_row.update({
                    'カテゴリ_1次分野': category.get('1次分野', ''),
                    'カテゴリ_2次分野': category.get('2次分野', ''),
                    'カテゴリ_3次分野': category.get('3次分野', ''),
                    '技術_1次要素': '',
                    '技術_2次要素': '',
                    '技術_3次要素': ''
                })
                merged_data.append(merged_row)
        elif technologies:
            # 技術要素情報のみがある場合
            for technology in technologies:
                merged_row = detail.copy()
                merged_row.update({
                    'カテゴリ_1次分野': '',
                    'カテゴリ_2次分野': '',
                    'カテゴリ_3次分野': '',
                    '技術_1次要素': technology.get('1次要素', ''),
                    '技術_2次要素': technology.get('2次要素', ''),
                    '技術_3次要素': technology.get('3次要素', '')
                })
                merged_data.append(merged_row)

    return merged_data


def save_merged_data(merged_data: List[Dict[str, Any]], output_path: str):
    """結合データをCSVファイルとして保存"""
    if not merged_data:
        print("保存するデータがありません")
        return

    # 出力する列の順序を定義
    fieldnames = [
        'No', 'ファイル BOX ID', '完成度', '資料作成日', '整理日', '関連資料フォルダ', 'ファイル名',
        'カテゴリ_1次分野', 'カテゴリ_2次分野', 'カテゴリ_3次分野',
        '技術_1次要素', '技術_2次要素', '技術_3次要素'
    ]

    try:
        with open(output_path, 'w', encoding='utf-8', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames, delimiter='\t')
            writer.writeheader()
            writer.writerows(merged_data)

        print(f"結合データを {output_path} に保存しました（{len(merged_data)}行）")

    except Exception as e:
        print(f"エラー: ファイル保存に失敗しました - {e}")


def print_summary(details_data: List[Dict[str, Any]],
                 categories_data: List[Dict[str, Any]],
                 technologies_data: List[Dict[str, Any]],
                 merged_data: List[Dict[str, Any]]):
    """処理結果のサマリーを表示"""
    print("\n=== 処理サマリー ===")
    print(f"file_details.csv: {len(details_data)}行")
    print(f"file_categories.csv: {len(categories_data)}行")
    print(f"file_technologies.csv: {len(technologies_data)}行")
    print(f"結合結果: {len(merged_data)}行")

    # BOX IDごとのデータ数を確認
    box_ids = set()
    for item in details_data:
        box_ids.add(item.get('ファイル BOX ID', ''))

    print(f"ユニークなBOX ID数: {len(box_ids)}")


def main():
    """メイン処理"""
    # ファイルパス
    base_dir = os.path.dirname(os.path.abspath(__file__))
    details_file = os.path.join(base_dir, 'file_details.csv')
    categories_file = os.path.join(base_dir, 'file_categories.csv')
    technologies_file = os.path.join(base_dir, 'file_technologies.csv')
    output_file = os.path.join(base_dir, 'merged_file_data.csv')

    print("CSVファイル結合処理を開始します...")

    # CSVファイルを読み込み
    details_data = load_csv_data(details_file)
    categories_data = load_csv_data(categories_file)
    technologies_data = load_csv_data(technologies_file)

    if not details_data:
        print("エラー: 詳細データファイルが読み込めませんでした")
        return

    # ルックアップテーブルを作成
    categories_lookup = create_lookup_tables(categories_data, 'ファイル BOX ID')
    technologies_lookup = create_lookup_tables(technologies_data, 'ファイル BOX ID')

    # データを結合
    merged_data = merge_data(details_data, categories_lookup, technologies_lookup)

    # 結合データを保存
    save_merged_data(merged_data, output_file)

    # サマリーを表示
    print_summary(details_data, categories_data, technologies_data, merged_data)

    print("処理が完了しました！")


if __name__ == "__main__":
    main()


