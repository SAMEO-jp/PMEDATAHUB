const fs = require('fs');
const path = require('path');

function checkDuplicates() {
    const inputDir = path.join(__dirname, '../../../../public/box/test1');

    const details = JSON.parse(fs.readFileSync(path.join(inputDir, 'file_details.json'), 'utf8'));
    const categories = JSON.parse(fs.readFileSync(path.join(inputDir, 'file_categories.json'), 'utf8'));
    const technologies = JSON.parse(fs.readFileSync(path.join(inputDir, 'file_technologies.json'), 'utf8'));

    console.log('=== BOX ID重複チェック ===');

    function analyzeDuplicates(data, name) {
        const ids = data.map(item => item['ファイル BOX ID']);
        const uniqueIds = [...new Set(ids)];

        console.log(`${name}:`);
        console.log(`  総件数: ${data.length}`);
        console.log(`  ユニークID数: ${uniqueIds.length}`);
        console.log(`  重複ID数: ${data.length - uniqueIds.length}`);

        if (data.length !== uniqueIds.length) {
            // 重複しているIDを見つける
            const duplicateMap = {};
            ids.forEach(id => {
                duplicateMap[id] = (duplicateMap[id] || 0) + 1;
            });

            const duplicates = Object.entries(duplicateMap)
                .filter(([id, count]) => count > 1)
                .sort((a, b) => b[1] - a[1]); // 出現回数でソート

            console.log(`  重複パターン (${duplicates.length}種類):`);
            duplicates.slice(0, 10).forEach(([id, count]) => {
                console.log(`    ID: ${id} (${count}回)`);
            });

            if (duplicates.length > 10) {
                console.log(`    ... 他 ${duplicates.length - 10}件`);
            }
        }
        console.log('');
    }

    analyzeDuplicates(details, 'file_details.json');
    analyzeDuplicates(categories, 'file_categories.json');
    analyzeDuplicates(technologies, 'file_technologies.json');

    // 統合後のユニークID数を確認
    const allIds = [
        ...details.map(item => item['ファイル BOX ID']),
        ...categories.map(item => item['ファイル BOX ID']),
        ...technologies.map(item => item['ファイル BOX ID'])
    ];

    const uniqueAllIds = [...new Set(allIds)];
    console.log(`=== 統合結果 ===`);
    console.log(`全データソースの総ID数: ${allIds.length}`);
    console.log(`統合後のユニークID数: ${uniqueAllIds.length}`);
    console.log(`統合による削減: ${allIds.length - uniqueAllIds.length}件`);
}

checkDuplicates();


