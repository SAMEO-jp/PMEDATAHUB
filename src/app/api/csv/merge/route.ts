import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// CSVファイルを読み込む関数
async function readCSVFile(filepath: string): Promise<string[][]> {
  try {
    const content = await fs.readFile(filepath, 'utf-8');
    const lines = content.split('\n').filter(line => line.trim() !== '');
    return lines.map(line => line.split('\t'));
  } catch (error) {
    console.error(`Error reading CSV file ${filepath}:`, error);
    return [];
  }
}

// BOX IDを正規化する関数
function normalizeBoxId(boxId: string): string {
  return boxId.replace(/'/g, '').trim();
}

// CSVデータをオブジェクト配列に変換する関数
function csvToObjects(csvData: string[][]): any[] {
  if (csvData.length < 2) return [];

  const headers = csvData[0];
  const rows = csvData.slice(1);

  return rows.map(row => {
    const obj: any = {};
    headers.forEach((header, index) => {
      obj[header] = row[index] || '';
    });
    return obj;
  });
}

// BOX IDでデータをグループ化する関数
function groupByBoxId(data: any[], boxIdField: string): Map<string, any[]> {
  const grouped = new Map<string, any[]>();

  data.forEach(item => {
    const boxId = normalizeBoxId(item[boxIdField] || '');
    if (!grouped.has(boxId)) {
      grouped.set(boxId, []);
    }
    grouped.get(boxId)!.push(item);
  });

  return grouped;
}

// 3つのCSVファイルを結合する関数
function mergeCSVData(detailsData: any[], categoriesData: any[], technologiesData: any[]): any[] {
  const mergedData: any[] = [];

  // BOX IDでカテゴリと技術要素データをグループ化
  const categoriesByBoxId = groupByBoxId(categoriesData, 'ファイル BOX ID');
  const technologiesByBoxId = groupByBoxId(technologiesData, 'ファイル BOX ID');

  // 詳細データをベースに結合
  detailsData.forEach(detail => {
    const boxId = normalizeBoxId(detail['ファイル BOX ID'] || '');
    const categories = categoriesByBoxId.get(boxId) || [];
    const technologies = technologiesByBoxId.get(boxId) || [];

    if (categories.length === 0 && technologies.length === 0) {
      // 対応するデータがない場合
      const mergedRow = {
        ...detail,
        'カテゴリ_1次分野': '',
        'カテゴリ_2次分野': '',
        'カテゴリ_3次分野': '',
        '技術_1次要素': '',
        '技術_2次要素': '',
        '技術_3次要素': ''
      };
      mergedData.push(mergedRow);
    } else if (categories.length > 0 && technologies.length > 0) {
      // 両方のデータがある場合、全ての組み合わせを作成
      categories.forEach(category => {
        technologies.forEach(technology => {
          const mergedRow = {
            ...detail,
            'カテゴリ_1次分野': category['1次分野'] || '',
            'カテゴリ_2次分野': category['2次分野'] || '',
            'カテゴリ_3次分野': category['3次分野'] || '',
            '技術_1次要素': technology['1次要素'] || '',
            '技術_2次要素': technology['2次要素'] || '',
            '技術_3次要素': technology['3次要素'] || ''
          };
          mergedData.push(mergedRow);
        });
      });
    } else if (categories.length > 0) {
      // カテゴリデータのみがある場合
      categories.forEach(category => {
        const mergedRow = {
          ...detail,
          'カテゴリ_1次分野': category['1次分野'] || '',
          'カテゴリ_2次分野': category['2次分野'] || '',
          'カテゴリ_3次分野': category['3次分野'] || '',
          '技術_1次要素': '',
          '技術_2次要素': '',
          '技術_3次要素': ''
        };
        mergedData.push(mergedRow);
      });
    } else if (technologies.length > 0) {
      // 技術要素データのみがある場合
      technologies.forEach(technology => {
        const mergedRow = {
          ...detail,
          'カテゴリ_1次分野': '',
          'カテゴリ_2次分野': '',
          'カテゴリ_3次分野': '',
          '技術_1次要素': technology['1次要素'] || '',
          '技術_2次要素': technology['2次要素'] || '',
          '技術_3次要素': technology['3次要素'] || ''
        };
        mergedData.push(mergedRow);
      });
    }
  });

  return mergedData;
}

export async function GET(request: NextRequest) {
  try {
    // CSVファイルのパス
    const csvDir = path.join(process.cwd(), 'src', 'app', 'box', 'test1');
    const detailsFile = path.join(csvDir, 'file_details.csv');
    const categoriesFile = path.join(csvDir, 'file_categories.csv');
    const technologiesFile = path.join(csvDir, 'file_technologies.csv');

    // CSVファイルを読み込み
    const [detailsCsv, categoriesCsv, technologiesCsv] = await Promise.all([
      readCSVFile(detailsFile),
      readCSVFile(categoriesFile),
      readCSVFile(technologiesFile)
    ]);

    // CSVデータをオブジェクトに変換
    const detailsData = csvToObjects(detailsCsv);
    const categoriesData = csvToObjects(categoriesCsv);
    const technologiesData = csvToObjects(technologiesCsv);

    // データを結合
    const mergedData = mergeCSVData(detailsData, categoriesData, technologiesData);

    // 統計情報を追加
    const stats = {
      originalDetailsCount: detailsData.length,
      originalCategoriesCount: categoriesData.length,
      originalTechnologiesCount: technologiesData.length,
      mergedCount: mergedData.length,
      uniqueBoxIds: new Set(detailsData.map(d => normalizeBoxId(d['ファイル BOX ID'] || ''))).size
    };

    return NextResponse.json({
      success: true,
      data: mergedData,
      stats: stats,
      message: 'CSVファイルの結合が完了しました'
    });

  } catch (error) {
    console.error('Error processing CSV files:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'CSVファイルの処理中にエラーが発生しました',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}


