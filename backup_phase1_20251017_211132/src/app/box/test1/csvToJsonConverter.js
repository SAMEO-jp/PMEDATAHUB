const fs = require('fs');
const path = require('path');

function csvToJson(csvFilePath, jsonFilePath) {
    try {
        // CSVファイルを読み込み
        const csvData = fs.readFileSync(csvFilePath, 'utf8');

        // Windowsの改行コードを統一
        const normalizedData = csvData.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

        // 空行を除去して行を分割
        const lines = normalizedData.split('\n').filter(line => line.trim().length > 0);

        console.log(`CSVファイル ${csvFilePath} の総行数: ${lines.length}`);

        if (lines.length === 0) {
            console.error('CSVファイルが空です');
            return;
        }

        // ヘッダー行を処理（タブ区切り）
        const headers = lines[0].split('\t').map(header => header.trim());
        console.log(`ヘッダー数: ${headers.length}`, headers);

        const records = [];

        // データ行を処理
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            const values = line.split('\t');
            console.log(`行 ${i}: 値の数 ${values.length}`);

            const record = {};

            for (let j = 0; j < headers.length && j < values.length; j++) {
                let value = values[j].trim();

                // BOX IDの場合、シングルクォートを除去
                if (headers[j].includes('BOX ID') || headers[j] === 'ファイル BOX ID') {
                    value = value.replace(/'/g, '');
                }

                // 値がnullや空文字の場合はnullに統一
                if (value === 'null' || value === '') {
                    value = null;
                }

                record[headers[j]] = value;
            }

            records.push(record);
        }

        console.log(`変換されたレコード数: ${records.length}`);
        console.log('最初のレコードのサンプル:', records[0]);

        // JSONファイルに書き込み
        fs.writeFileSync(jsonFilePath, JSON.stringify(records, null, 2), 'utf8');
        console.log(`${jsonFilePath} に変換完了 (${records.length} 件のデータ)`);

    } catch (error) {
        console.error(`エラー: ${csvFilePath} の変換に失敗しました`, error);
    }
}

function main() {
    const inputDir = __dirname;

    // 3つのCSVファイルをJSONに変換
    csvToJson(
        path.join(inputDir, 'file_categories.csv'),
        path.join(inputDir, 'file_categories.json')
    );

    csvToJson(
        path.join(inputDir, 'file_details.csv'),
        path.join(inputDir, 'file_details.json')
    );

    csvToJson(
        path.join(inputDir, 'file_technologies.csv'),
        path.join(inputDir, 'file_technologies.json')
    );

    console.log('全てのCSVからJSONへの変換が完了しました。');
}

main();
