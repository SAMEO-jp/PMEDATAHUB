const fs = require('fs');
const path = require('path');

// CSVをJSONに変換する関数
function csvToJson(csvFilePath) {
    try {
        // CSVファイルを読み込み
        const csvData = fs.readFileSync(csvFilePath, 'utf8');
        const lines = csvData.trim().split('\n');
        
        const jsonData = [];
        
        lines.forEach((line, index) => {
            // CSVの各行をパース（カンマ区切り、ただし引用符内のカンマは無視）
            const fields = [];
            let current = '';
            let inQuotes = false;
            
            for (let i = 0; i < line.length; i++) {
                const char = line[i];
                if (char === '"') {
                    inQuotes = !inQuotes;
                } else if (char === ',' && !inQuotes) {
                    fields.push(current);
                    current = '';
                } else {
                    current += char;
                }
            }
            fields.push(current); // 最後のフィールドを追加
            
            // "見つかりませんでした"や"not_found"のデータはスキップ
            if (fields[1] === '見つかりませんでした' || fields[8] === 'not_found' || fields[0] === '') {
                return;
            }
            
            // JSONオブジェクトを作成
            const item = {
                "No": jsonData.length + 1,
                "ファイル BOX ID": fields[0] || "",
                "完成度": "3", // デフォルトで完成度3を設定
                "資料作成日": fields[3] ? fields[3].split('T')[0].replace(/-/g, '/') : null,
                "整理日": new Date().toLocaleDateString('ja-JP', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                }).replace(/\//g, '/'),
                "関連資料フォルダ": fields[6] || null,
                "ファイル名": fields[1] || ""
            };
            
            jsonData.push(item);
        });
        
        return jsonData;
    } catch (error) {
        console.error('CSV変換エラー:', error.message);
        return [];
    }
}

// 既存のfile_details.jsonを読み込む関数
function loadExistingData(jsonFilePath) {
    try {
        const data = fs.readFileSync(jsonFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('既存JSONファイル読み込みエラー:', error.message);
        return [];
    }
}

// データを更新する関数
function updateData(existingData, newData) {
    const existingBoxIds = new Set(existingData.map(item => item['ファイル BOX ID']));
    const updatedData = [...existingData];
    let addedCount = 0;
    let updatedCount = 0;
    
    newData.forEach(newItem => {
        const boxId = newItem['ファイル BOX ID'];
        const existingIndex = existingData.findIndex(item => item['ファイル BOX ID'] === boxId);
        
        if (existingIndex !== -1) {
            // 既存データを更新（ファイル名が"見つかりませんでした"の場合のみ）
            if (existingData[existingIndex]['ファイル名'] === '見つかりませんでした') {
                updatedData[existingIndex] = {
                    ...existingData[existingIndex],
                    ...newItem,
                    "No": existingData[existingIndex]["No"] // Noは既存のものを保持
                };
                updatedCount++;
            }
        } else {
            // 新規データを追加
            updatedData.push({
                ...newItem,
                "No": (Math.max(...existingData.map(item => parseInt(item.No) || 0)) + addedCount + 1).toString()
            });
            addedCount++;
        }
    });
    
    console.log(`更新完了: ${updatedCount}件更新, ${addedCount}件追加`);
    return updatedData;
}

// メイン関数
function main() {
    const csvFilePath = path.join(__dirname, 'file_search_results_20250910_134147.csv');
    const existingJsonPath = path.join(__dirname, 'file_details.json');
    const outputJsonPath = path.join(__dirname, 'file_details_updated.json');
    
    console.log('CSVファイルからJSONに変換中...');
    const newData = csvToJson(csvFilePath);
    console.log(`CSV変換完了: ${newData.length}件の有効なデータを取得`);
    
    console.log('既存のfile_details.jsonを読み込み中...');
    const existingData = loadExistingData(existingJsonPath);
    console.log(`既存データ読み込み完了: ${existingData.length}件`);
    
    console.log('データを更新中...');
    const updatedData = updateData(existingData, newData);
    
    console.log('更新されたJSONを保存中...');
    fs.writeFileSync(outputJsonPath, JSON.stringify(updatedData, null, 2), 'utf8');
    console.log(`✅ 更新完了: ${outputJsonPath} に保存されました`);
    console.log(`総件数: ${updatedData.length}件`);
}

// スクリプトが直接実行された場合にmain関数を実行
if (require.main === module) {
    main();
}

module.exports = { csvToJson, loadExistingData, updateData };