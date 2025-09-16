const fs = require('fs');
const path = require('path');

function optimizeIntegratedData() {
    const inputPath = path.join(__dirname, 'integrated_data.json');
    const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

    console.log('=== データ最適化分析 ===');
    console.log('元のデータ件数:', data.length);

    // 1. 簡潔版の作成（不要フィールド除去）
    const compactData = data.map(item => ({
        id: item.boxId,
        category: item.category ? {
            primary: item.category["1次分野"],
            secondary: item.category["2次分野"],
            tertiary: item.category["3次分野"]?.replace('\r', '')
        } : null,
        file: item.detail ? {
            name: item.detail["ファイル名"]?.replace('\r', ''),
            completion: item.detail["完成度"],
            date: item.detail["整理日"]
        } : null,
        technologies: item.technologies.map(tech => ({
            primary: tech["1次要素"],
            secondary: tech["2次要素"],
            tertiary: tech["3次要素"]?.replace('\r', '')
        }))
    }));

    // 2. 統計データの作成
    const stats = {
        totalRecords: data.length,
        categories: {},
        technologies: {},
        completionStats: {},
        fileCount: 0
    };

    data.forEach(item => {
        // 分野別統計
        if (item.category) {
            const primary = item.category["1次分野"];
            stats.categories[primary] = (stats.categories[primary] || 0) + 1;
        }

        // 技術要素別統計
        item.technologies.forEach(tech => {
            const primary = tech["1次要素"];
            stats.technologies[primary] = (stats.technologies[primary] || 0) + 1;
        });

        // 完成度別統計
        if (item.detail) {
            const completion = item.detail["完成度"];
            stats.completionStats[completion] = (stats.completionStats[completion] || 0) + 1;
            stats.fileCount++;
        }
    });

    // 3. インデックス版の作成（検索用）
    const indexedData = {
        byCategory: {},
        byTechnology: {},
        byCompletion: {},
        allRecords: compactData
    };

    // 分野別インデックス
    data.forEach((item, index) => {
        if (item.category) {
            const primary = item.category["1次分野"];
            if (!indexedData.byCategory[primary]) {
                indexedData.byCategory[primary] = [];
            }
            indexedData.byCategory[primary].push(index);
        }
    });

    // 技術別インデックス
    data.forEach((item, index) => {
        item.technologies.forEach(tech => {
            const primary = tech["1次要素"];
            if (!indexedData.byTechnology[primary]) {
                indexedData.byTechnology[primary] = [];
            }
            if (!indexedData.byTechnology[primary].includes(index)) {
                indexedData.byTechnology[primary].push(index);
            }
        });
    });

    // 完成度別インデックス
    data.forEach((item, index) => {
        if (item.detail) {
            const completion = item.detail["完成度"];
            if (!indexedData.byCompletion[completion]) {
                indexedData.byCompletion[completion] = [];
            }
            indexedData.byCompletion[completion].push(index);
        }
    });

    // 各バージョンを保存
    const outputDir = path.join(__dirname, 'optimized_data');

    // ディレクトリが存在しない場合は作成
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }

    // 簡潔版
    fs.writeFileSync(
        path.join(outputDir, 'compact_data.json'),
        JSON.stringify(compactData, null, 2)
    );

    // 統計版
    fs.writeFileSync(
        path.join(outputDir, 'stats_data.json'),
        JSON.stringify(stats, null, 2)
    );

    // インデックス版
    fs.writeFileSync(
        path.join(outputDir, 'indexed_data.json'),
        JSON.stringify(indexedData, null, 2)
    );

    // ファイルサイズ比較
    const originalSize = fs.statSync(inputPath).size;
    const compactSize = fs.statSync(path.join(outputDir, 'compact_data.json')).size;
    const statsSize = fs.statSync(path.join(outputDir, 'stats_data.json')).size;
    const indexedSize = fs.statSync(path.join(outputDir, 'indexed_data.json')).size;

    console.log('\n=== 最適化結果 ===');
    console.log('📁 optimized_data/ フォルダに以下のファイルを作成しました：');
    console.log('1. compact_data.json (簡潔版)');
    console.log('2. stats_data.json (統計版)');
    console.log('3. indexed_data.json (インデックス版)');

    console.log('\n📊 ファイルサイズ比較:');
    console.log(`元ファイル: ${(originalSize / 1024).toFixed(2)} KB`);
    console.log(`簡潔版: ${(compactSize / 1024).toFixed(2)} KB (${((compactSize / originalSize) * 100).toFixed(1)}%)`);
    console.log(`統計版: ${(statsSize / 1024).toFixed(2)} KB (${((statsSize / originalSize) * 100).toFixed(1)}%)`);
    console.log(`インデックス版: ${(indexedSize / 1024).toFixed(2)} KB (${((indexedSize / originalSize) * 100).toFixed(1)}%)`);

    console.log('\n📈 主な統計情報:');
    console.log('分野別内訳:', stats.categories);
    console.log('技術要素別内訳:', stats.technologies);
    console.log('完成度別内訳:', stats.completionStats);
    console.log('ファイル総数:', stats.fileCount);

    return { compactData, stats, indexedData };
}

optimizeIntegratedData();


