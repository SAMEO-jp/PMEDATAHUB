const fs = require('fs');
const path = require('path');

function createSingleIntegratedJson() {
    const inputDir = path.join(__dirname, '../../../../public/box/test1');

    // JSONファイルを読み込み
    const categories = JSON.parse(fs.readFileSync(path.join(inputDir, 'file_categories.json'), 'utf8'));
    const details = JSON.parse(fs.readFileSync(path.join(inputDir, 'file_details.json'), 'utf8'));
    const technologies = JSON.parse(fs.readFileSync(path.join(inputDir, 'file_technologies.json'), 'utf8'));

    // BOX IDでデータを統合
    const combinedMap = new Map();

    // カテゴリーデータを統合
    categories.forEach(cat => {
        const boxId = cat["ファイル BOX ID"];
        if (!combinedMap.has(boxId)) {
            combinedMap.set(boxId, {
                boxId,
                category: cat,
                detail: null,
                technologies: []
            });
        } else {
            combinedMap.get(boxId).category = cat;
        }
    });

    // 詳細データを統合
    details.forEach(detail => {
        const boxId = detail["ファイル BOX ID"];
        if (!combinedMap.has(boxId)) {
            combinedMap.set(boxId, {
                boxId,
                category: null,
                detail,
                technologies: []
            });
        } else {
            combinedMap.get(boxId).detail = detail;
        }
    });

    // 技術データを統合
    technologies.forEach(tech => {
        const boxId = tech["ファイル BOX ID"];
        if (!combinedMap.has(boxId)) {
            combinedMap.set(boxId, {
                boxId,
                category: null,
                detail: null,
                technologies: [tech]
            });
        } else {
            combinedMap.get(boxId).technologies.push(tech);
        }
    });

    const combinedData = Array.from(combinedMap.values());

    // 統合JSONファイルを保存
    const outputPath = path.join(__dirname, 'integrated_data.json');
    fs.writeFileSync(outputPath, JSON.stringify(combinedData, null, 2), 'utf8');

    console.log('統合JSONファイルが作成されました:', outputPath);
    console.log('データ件数:', combinedData.length);

    // サンプルデータを表示
    console.log('\n=== サンプルデータ ===');
    console.log(JSON.stringify(combinedData[0], null, 2));

    return combinedData;
}

createSingleIntegratedJson();


