const fs = require('fs');
const path = require('path');

// JSONファイルを読み込む関数
function loadJSON(filename) {
    const filePath = path.join(__dirname, filename);
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
}

// HTMLを生成する関数
function generateHTML() {
    // JSONデータを読み込み
    const categories = loadJSON('file_categories.json');
    const details = loadJSON('file_details.json');
    const technologies = loadJSON('file_technologies.json');

    // BOX IDをキーとしてデータをマージ
    const mergedData = {};

    // 詳細データを基本として使用
    details.forEach(detail => {
        const boxId = detail['ファイル BOX ID'];
        mergedData[boxId] = {
            ...detail,
            categories: [],
            technologies: []
        };
    });

    // カテゴリデータを追加
    categories.forEach(cat => {
        const boxId = cat['ファイル BOX ID'];
        if (mergedData[boxId]) {
            mergedData[boxId].categories.push({
                '1次分野': cat['1次分野'],
                '2次分野': cat['2次分野'],
                '3次分野': cat['3次分野']
            });
        }
    });

    // 技術データを追加
    technologies.forEach(tech => {
        const boxId = tech['ファイル BOX ID'];
        if (mergedData[boxId]) {
            mergedData[boxId].technologies.push({
                '1次要素': tech['1次要素'],
                '2次要素': tech['2次要素'],
                '3次要素': tech['3次要素']
            });
        }
    });

    // 重複を除去
    Object.keys(mergedData).forEach(boxId => {
        const item = mergedData[boxId];
        
        // カテゴリの重複除去
        const uniqueCategories = [];
        const catSet = new Set();
        item.categories.forEach(cat => {
            const key = `${cat['1次分野']}_${cat['2次分野']}_${cat['3次分野']}`;
            if (!catSet.has(key)) {
                catSet.add(key);
                uniqueCategories.push(cat);
            }
        });
        item.categories = uniqueCategories;

        // 技術要素の重複除去
        const uniqueTechnologies = [];
        const techSet = new Set();
        item.technologies.forEach(tech => {
            const key = `${tech['1次要素']}_${tech['2次要素']}_${tech['3次要素']}`;
            if (!techSet.has(key)) {
                techSet.add(key);
                uniqueTechnologies.push(tech);
            }
        });
        item.technologies = uniqueTechnologies;
    });

    // フィルタ用のオプションを抽出（階層関係も保存）
    const filterOptions = {
        '1次分野': new Set(),
        '2次分野': new Set(),
        '3次分野': new Set(),
        '1次要素': new Set(),
        '2次要素': new Set(),
        '3次要素': new Set(),
        '完成度': new Set()
    };

    // 階層関係を保存するためのマップ
    const fieldHierarchy = new Map(); // 1次分野 -> Set(2次分野)
    const fieldHierarchy2 = new Map(); // 1次分野_2次分野 -> Set(3次分野)
    const techHierarchy = new Map(); // 1次要素 -> Set(2次要素)
    const techHierarchy2 = new Map(); // 1次要素_2次要素 -> Set(3次要素)

    Object.values(mergedData).forEach(item => {
        item.categories.forEach(cat => {
            const first = cat['1次分野'];
            const second = cat['2次分野'];
            const third = cat['3次分野'];
            
            if (first) {
                filterOptions['1次分野'].add(first);
                if (second) {
                    filterOptions['2次分野'].add(second);
                    if (!fieldHierarchy.has(first)) fieldHierarchy.set(first, new Set());
                    fieldHierarchy.get(first).add(second);
                    
                    if (third) {
                        filterOptions['3次分野'].add(third);
                        const key = `${first}_${second}`;
                        if (!fieldHierarchy2.has(key)) fieldHierarchy2.set(key, new Set());
                        fieldHierarchy2.get(key).add(third);
                    }
                }
            }
        });
        
        item.technologies.forEach(tech => {
            const first = tech['1次要素'];
            const second = tech['2次要素'];
            const third = tech['3次要素'];
            
            if (first) {
                filterOptions['1次要素'].add(first);
                if (second) {
                    filterOptions['2次要素'].add(second);
                    if (!techHierarchy.has(first)) techHierarchy.set(first, new Set());
                    techHierarchy.get(first).add(second);
                    
                    if (third) {
                        filterOptions['3次要素'].add(third);
                        const key = `${first}_${second}`;
                        if (!techHierarchy2.has(key)) techHierarchy2.set(key, new Set());
                        techHierarchy2.get(key).add(third);
                    }
                }
            }
        });
        
        if (item['完成度']) filterOptions['完成度'].add(item['完成度']);
    });

    // Setを配列に変換してソート
    Object.keys(filterOptions).forEach(key => {
        filterOptions[key] = Array.from(filterOptions[key]).sort();
    });

    // 階層関係も配列に変換
    const hierarchyData = {
        field: Object.fromEntries(Array.from(fieldHierarchy.entries()).map(([k, v]) => [k, Array.from(v).sort()])),
        field2: Object.fromEntries(Array.from(fieldHierarchy2.entries()).map(([k, v]) => [k, Array.from(v).sort()])),
        tech: Object.fromEntries(Array.from(techHierarchy.entries()).map(([k, v]) => [k, Array.from(v).sort()])),
        tech2: Object.fromEntries(Array.from(techHierarchy2.entries()).map(([k, v]) => [k, Array.from(v).sort()]))
    };

    // チップ生成関数
    const generateFieldChips = (level, prefix) => {
        return filterOptions[level].map(item => `
            <div class="filter-chip ${prefix}-chip" data-level="${level}" data-value="${item}" onclick="toggleChipFilter('${level}', '${item}')">
                ${item}
            </div>
        `).join('');
    };

    // テーブル行のHTMLを生成
    const generateTableRows = () => {
        return Object.values(mergedData).map(item => `
            <tr class="data-row">
                <td>${item.No || ''}</td>
                <td>
                    <a href="https://nipponsteel.ent.box.com/file/${item['ファイル BOX ID']}" 
                       target="_blank" 
                       class="box-id-link">
                        ${item['ファイル BOX ID']}
                    </a>
                </td>
                <td class="filename">${item['ファイル名'] || ''}</td>
                <td class="completion-level completion-${item['完成度'] || '1'}">
                    ${item['完成度'] ? 'レベル' + item['完成度'] : ''}
                </td>
                <td>${item['整理日'] || ''}</td>
                <td>
                    ${item.categories.map(cat => `
                        <div class="category-item">
                            <div class="level-1">${cat['1次分野'] || ''}</div>
                            ${cat['2次分野'] ? `<div class="level-2">${cat['2次分野']}</div>` : ''}
                            ${cat['3次分野'] ? `<div class="level-3">${cat['3次分野']}</div>` : ''}
                        </div>
                    `).join('')}
                </td>
                <td>
                    ${item.technologies.map(tech => `
                        <div class="tech-item">
                            <div class="level-1">${tech['1次要素'] || ''}</div>
                            ${tech['2次要素'] ? `<div class="level-2">${tech['2次要素']}</div>` : ''}
                            ${tech['3次要素'] ? `<div class="level-3">${tech['3次要素']}</div>` : ''}
                        </div>
                    `).join('')}
                </td>
                <td>
                    ${item['関連資料フォルダ'] ? `
                        <a href="https://nipponsteel.ent.box.com/folder/${item['関連資料フォルダ']}" 
                           target="_blank" 
                           class="folder-link"
                           title="関連フォルダを開く">
                            📁
                        </a>
                    ` : ''}
                </td>
            </tr>
        `).join('');
    };

    // HTML生成
    const html = `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>技術資料管理システム</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
            font-size: 12px;
        }
        
        .container {
            max-width: 1400px;
            margin: 0 auto;
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        h1 {
            color: #333;
            text-align: center;
            margin-bottom: 30px;
            font-size: 24px;
        }
        
        .filters {
            background-color: #f8f9fa;
            padding: 15px;
            padding-top: 45px;
            border-radius: 5px;
            margin-bottom: 20px;
            position: relative;
        }
        
        .filters.hidden .filters-content {
            display: none;
        }
        
        .filters-toggle {
            position: absolute;
            top: 10px;
            right: 15px;
            background: #007bff;
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            z-index: 10;
            font-weight: bold;
        }
        
        .filters-toggle:hover {
            background: #0056b3;
        }
        
        .filter-section {
            margin-bottom: 20px;
            padding: 15px;
            border: 1px solid #dee2e6;
            border-radius: 5px;
            background-color: white;
        }
        
        .filter-section.collapsed .filter-content {
            display: none;
        }
        
        .filter-section-title {
            font-weight: bold;
            color: #495057;
            margin-bottom: 15px;
            padding-bottom: 8px;
            border-bottom: 1px solid #dee2e6;
            font-size: 14px;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            user-select: none;
        }
        
        .filter-section-title:hover {
            background-color: #f8f9fa;
            border-radius: 3px;
        }
        
        .collapse-icon {
            font-size: 12px;
            transition: transform 0.2s;
        }
        
        .filter-section.collapsed .collapse-icon {
            transform: rotate(-90deg);
        }
        
        .filter-level {
            margin-bottom: 12px;
        }
        
        .filter-level-title {
            font-weight: bold;
            margin-bottom: 8px;
            font-size: 12px;
            color: #666;
        }
        
        .filter-chips {
            display: flex;
            gap: 6px;
            flex-wrap: wrap;
            margin-bottom: 10px;
        }
        
        .filter-chip {
            padding: 4px 10px;
            border: 2px solid #dee2e6;
            border-radius: 12px;
            cursor: pointer;
            user-select: none;
            transition: all 0.2s;
            font-size: 10px;
            background-color: white;
            line-height: 1.2;
        }
        
        .filter-chip:hover {
            border-color: #007bff;
            background-color: #e3f2fd;
        }
        
        .filter-chip.active {
            background-color: #007bff;
            color: white;
            border-color: #0056b3;
        }
        
        .filter-chip.disabled {
            opacity: 0.3;
            cursor: not-allowed;
        }
        
        .filter-chip.disabled:hover {
            border-color: #dee2e6;
            background-color: white;
        }
        
        .field-chip {
            border-color: #6f42c1;
        }
        
        .field-chip:hover {
            border-color: #6f42c1;
            background-color: #f3e5f5;
        }
        
        .field-chip.active {
            background-color: #6f42c1;
            border-color: #5a2a87;
        }
        
        .tech-chip {
            border-color: #20c997;
        }
        
        .tech-chip:hover {
            border-color: #20c997;
            background-color: #d1ecf1;
        }
        
        .tech-chip.active {
            background-color: #20c997;
            border-color: #17a2b8;
        }
        
        .completion-chip {
            border-color: #fd7e14;
        }
        
        .completion-chip:hover {
            border-color: #fd7e14;
            background-color: #fff3cd;
        }
        
        .completion-chip.active {
            background-color: #fd7e14;
            border-color: #e55a00;
        }
        
        .clear-filters {
            text-align: center;
            margin-top: 15px;
        }
        
        .clear-filters button {
            background-color: #6c757d;
            color: white;
            border: none;
            padding: 8px 15px;
            border-radius: 3px;
            cursor: pointer;
            font-size: 11px;
        }
        
        .clear-filters button:hover {
            background-color: #5a6268;
        }
        
        .stats {
            text-align: center;
            margin-bottom: 15px;
            font-weight: bold;
            color: #495057;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            font-size: 11px;
        }
        
        th, td {
            border: 1px solid #dee2e6;
            padding: 6px;
            text-align: left;
            vertical-align: top;
        }
        
        th {
            background-color: #e9ecef;
            font-weight: bold;
            position: sticky;
            top: 0;
            z-index: 10;
        }
        
        tr:nth-child(even) {
            background-color: #f8f9fa;
        }
        
        tr:hover {
            background-color: #e3f2fd;
        }
        
        .box-id-link {
            color: #007bff;
            text-decoration: none;
            font-weight: bold;
        }
        
        .box-id-link:hover {
            text-decoration: underline;
        }
        
        .folder-link {
            color: #6f42c1;
            text-decoration: none;
            font-size: 16px;
            display: inline-block;
            text-align: center;
            width: 24px;
            height: 24px;
            line-height: 24px;
        }
        
        .folder-link:hover {
            color: #5a2a87;
            transform: scale(1.1);
        }
        
        .category-item, .tech-item {
            display: block;
            margin-bottom: 3px;
            padding: 2px 4px;
            background-color: rgba(0,123,255,0.1);
            border-radius: 3px;
            font-size: 10px;
        }
        
        .tech-item {
            background-color: rgba(40,167,69,0.1);
        }
        
        .level-1 { font-weight: bold; }
        .level-2 { margin-left: 8px; }
        .level-3 { margin-left: 16px; color: #666; }
        
        .filename {
            max-width: 200px;
            word-break: break-all;
            line-height: 1.3;
        }
        
        .completion-level {
            text-align: center;
            font-weight: bold;
        }
        
        .completion-1 { color: #dc3545; }
        .completion-2 { color: #ffc107; }
        .completion-3 { color: #28a745; }
        
        .filter-level.hidden {
            display: none;
        }
        
        @media (max-width: 768px) {
            body { padding: 10px; font-size: 11px; }
            .container { padding: 10px; }
            table { font-size: 10px; }
            th, td { padding: 4px; }
            .filter-chip { font-size: 9px; padding: 3px 8px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>技術資料管理システム</h1>
        
        <div class="filters">
            <button class="filters-toggle" onclick="toggleFilters()">フィルター表示/非表示</button>
            <div class="filters-content">
            <div class="filter-section">
                <div class="filter-section-title" onclick="toggleFilterSection(this)">
                    <span>設備分野</span>
                    <span class="collapse-icon">▼</span>
                </div>
                <div class="filter-content">
                <div class="filter-level" id="field-level-1">
                    <div class="filter-level-title">1次分野</div>
                    <div class="filter-chips" id="chips-1次分野">
                        ${generateFieldChips('1次分野', 'field')}
                    </div>
                </div>
                
                <div class="filter-level hidden" id="field-level-2">
                    <div class="filter-level-title">2次分野</div>
                    <div class="filter-chips" id="chips-2次分野">
                    </div>
                </div>
                
                <div class="filter-level hidden" id="field-level-3">
                    <div class="filter-level-title">3次分野</div>
                    <div class="filter-chips" id="chips-3次分野">
                    </div>
                </div>
                </div>
            </div>
            
            <div class="filter-section">
                <div class="filter-section-title" onclick="toggleFilterSection(this)">
                    <span>技術要素</span>
                    <span class="collapse-icon">▼</span>
                </div>
                <div class="filter-content">
                
                <div class="filter-level" id="tech-level-1">
                    <div class="filter-level-title">1次技術要素</div>
                    <div class="filter-chips" id="chips-1次要素">
                        ${generateFieldChips('1次要素', 'tech')}
                    </div>
                </div>
                
                <div class="filter-level hidden" id="tech-level-2">
                    <div class="filter-level-title">2次技術要素</div>
                    <div class="filter-chips" id="chips-2次要素">
                    </div>
                </div>
                
                <div class="filter-level hidden" id="tech-level-3">
                    <div class="filter-level-title">3次技術要素</div>
                    <div class="filter-chips" id="chips-3次要素">
                    </div>
                </div>
                </div>
            </div>
            
            <div class="filter-section">
                <div class="filter-section-title" onclick="toggleFilterSection(this)">
                    <span>完成度</span>
                    <span class="collapse-icon">▼</span>
                </div>
                <div class="filter-content">
                <div class="filter-chips">
                    ${filterOptions['完成度'].map(level => `
                        <div class="filter-chip completion-chip" data-level="完成度" data-value="${level}" onclick="toggleChipFilter('完成度', '${level}')">
                            レベル${level}
                        </div>
                    `).join('')}
                </div>
                </div>
            </div>
            
            <div class="clear-filters">
                <button onclick="clearAllFilters()">フィルタをクリア</button>
            </div>
            </div>
        </div>
        
        <div class="stats">
            表示件数: <span id="visible-count">${Object.keys(mergedData).length}</span> / 
            総件数: <span id="total-count">${Object.keys(mergedData).length}</span>
        </div>
        
        <table id="data-table">
            <thead>
                <tr>
                    <th>No.</th>
                    <th>BOX ID</th>
                    <th>ファイル名</th>
                    <th>完成度</th>
                    <th>整理日</th>
                    <th>設備分野</th>
                    <th>技術要素</th>
                    <th>関連フォルダ</th>
                </tr>
            </thead>
            <tbody>
                ${generateTableRows()}
            </tbody>
        </table>
    </div>

    <script>
        // 階層データとフィルタ状態
        const hierarchyData = ${JSON.stringify(hierarchyData, null, 2)};
        const allFilterOptions = ${JSON.stringify(filterOptions, null, 2)};
        
        // 選択されたフィルタの状態
        const selectedFilters = {
            '1次分野': new Set(),
            '2次分野': new Set(),
            '3次分野': new Set(),
            '1次要素': new Set(),
            '2次要素': new Set(),
            '3次要素': new Set(),
            '完成度': new Set()
        };

        // チップフィルタの選択/選択解除
        function toggleChipFilter(level, value) {
            const chip = document.querySelector('[data-level="' + level + '"][data-value="' + value + '"]');
            
            if (selectedFilters[level].has(value)) {
                selectedFilters[level].delete(value);
                chip.classList.remove('active');
            } else {
                selectedFilters[level].add(value);
                chip.classList.add('active');
            }
            
            updateCascadeChips();
            applyFilters();
        }

        // カスケードチップの更新
        function updateCascadeChips() {
            // 設備分野の2次・3次を更新
            updateFieldCascade();
            // 技術要素の2次・3次を更新
            updateTechCascade();
        }

        function updateFieldCascade() {
            const level1Selected = selectedFilters['1次分野'];
            const level2Container = document.getElementById('chips-2次分野');
            const level3Container = document.getElementById('chips-3次分野');
            const level2Section = document.getElementById('field-level-2');
            const level3Section = document.getElementById('field-level-3');

            // 2次分野の更新
            if (level1Selected.size > 0) {
                const available2nd = new Set();
                level1Selected.forEach(first => {
                    if (hierarchyData.field[first]) {
                        hierarchyData.field[first].forEach(second => available2nd.add(second));
                    }
                });

                level2Container.innerHTML = Array.from(available2nd).sort().map(item => 
                    '<div class="filter-chip field-chip" data-level="2次分野" data-value="' + item + '" onclick="toggleChipFilter(\\'2次分野\\', \\'' + item + '\\')">' + item + '</div>'
                ).join('');
                
                level2Section.classList.remove('hidden');

                // 現在選択中の2次分野をアクティブに
                selectedFilters['2次分野'].forEach(value => {
                    const chip = document.querySelector('[data-level="2次分野"][data-value="' + value + '"]');
                    if (chip) chip.classList.add('active');
                });
            } else {
                level2Section.classList.add('hidden');
                level3Section.classList.add('hidden');
                selectedFilters['2次分野'].clear();
                selectedFilters['3次分野'].clear();
                return;
            }

            // 3次分野の更新
            const level2Selected = selectedFilters['2次分野'];
            if (level2Selected.size > 0) {
                const available3rd = new Set();
                level1Selected.forEach(first => {
                    level2Selected.forEach(second => {
                        const key = first + '_' + second;
                        if (hierarchyData.field2[key]) {
                            hierarchyData.field2[key].forEach(third => available3rd.add(third));
                        }
                    });
                });

                level3Container.innerHTML = Array.from(available3rd).sort().map(item => 
                    '<div class="filter-chip field-chip" data-level="3次分野" data-value="' + item + '" onclick="toggleChipFilter(\\'3次分野\\', \\'' + item + '\\')">' + item + '</div>'
                ).join('');
                
                level3Section.classList.remove('hidden');

                // 現在選択中の3次分野をアクティブに
                selectedFilters['3次分野'].forEach(value => {
                    const chip = document.querySelector('[data-level="3次分野"][data-value="' + value + '"]');
                    if (chip) chip.classList.add('active');
                });
            } else {
                level3Section.classList.add('hidden');
                selectedFilters['3次分野'].clear();
            }
        }

        function updateTechCascade() {
            const level1Selected = selectedFilters['1次要素'];
            const level2Container = document.getElementById('chips-2次要素');
            const level3Container = document.getElementById('chips-3次要素');
            const level2Section = document.getElementById('tech-level-2');
            const level3Section = document.getElementById('tech-level-3');

            // 2次技術要素の更新
            if (level1Selected.size > 0) {
                const available2nd = new Set();
                level1Selected.forEach(first => {
                    if (hierarchyData.tech[first]) {
                        hierarchyData.tech[first].forEach(second => available2nd.add(second));
                    }
                });

                level2Container.innerHTML = Array.from(available2nd).sort().map(item => 
                    '<div class="filter-chip tech-chip" data-level="2次要素" data-value="' + item + '" onclick="toggleChipFilter(\\'2次要素\\', \\'' + item + '\\')">' + item + '</div>'
                ).join('');
                
                level2Section.classList.remove('hidden');

                // 現在選択中の2次要素をアクティブに
                selectedFilters['2次要素'].forEach(value => {
                    const chip = document.querySelector('[data-level="2次要素"][data-value="' + value + '"]');
                    if (chip) chip.classList.add('active');
                });
            } else {
                level2Section.classList.add('hidden');
                level3Section.classList.add('hidden');
                selectedFilters['2次要素'].clear();
                selectedFilters['3次要素'].clear();
                return;
            }

            // 3次技術要素の更新
            const level2Selected = selectedFilters['2次要素'];
            if (level2Selected.size > 0) {
                const available3rd = new Set();
                level1Selected.forEach(first => {
                    level2Selected.forEach(second => {
                        const key = first + '_' + second;
                        if (hierarchyData.tech2[key]) {
                            hierarchyData.tech2[key].forEach(third => available3rd.add(third));
                        }
                    });
                });

                level3Container.innerHTML = Array.from(available3rd).sort().map(item => 
                    '<div class="filter-chip tech-chip" data-level="3次要素" data-value="' + item + '" onclick="toggleChipFilter(\\'3次要素\\', \\'' + item + '\\')">' + item + '</div>'
                ).join('');
                
                level3Section.classList.remove('hidden');

                // 現在選択中の3次要素をアクティブに
                selectedFilters['3次要素'].forEach(value => {
                    const chip = document.querySelector('[data-level="3次要素"][data-value="' + value + '"]');
                    if (chip) chip.classList.add('active');
                });
            } else {
                level3Section.classList.add('hidden');
                selectedFilters['3次要素'].clear();
            }
        }

        // フィルタ適用
        function applyFilters() {
            const rows = document.querySelectorAll('.data-row');
            let visibleCount = 0;

            rows.forEach(row => {
                let showRow = true;

                // 各フィルタをチェック
                Object.keys(selectedFilters).forEach(filterKey => {
                    if (selectedFilters[filterKey].size > 0 && showRow) {
                        if (filterKey === '完成度') {
                            // 完成度の場合は特別処理
                            const completionCell = row.children[3]; // 完成度列
                            const completionText = completionCell.textContent.trim();
                            const hasMatch = Array.from(selectedFilters[filterKey]).some(value => {
                                return completionText.includes('レベル' + value);
                            });
                            
                            if (!hasMatch) {
                                showRow = false;
                            }
                        } else {
                            // その他のフィルタは従来通り
                            const cellText = row.textContent.toLowerCase();
                            const hasMatch = Array.from(selectedFilters[filterKey]).some(value => 
                                cellText.includes(value.toLowerCase())
                            );
                            
                            if (!hasMatch) {
                                showRow = false;
                            }
                        }
                    }
                });

                if (showRow) {
                    row.style.display = '';
                    visibleCount++;
                } else {
                    row.style.display = 'none';
                }
            });

            document.getElementById('visible-count').textContent = visibleCount;
            
            // 表示中のデータに基づいて利用可能なオプションを更新
            updateAvailableOptions();
        }

        // 表示中のデータに基づいて利用可能なオプションを更新
        function updateAvailableOptions() {
            const visibleRows = document.querySelectorAll('.data-row[style=""], .data-row:not([style])');
            const currentlyAvailable = {
                '1次分野': new Set(),
                '2次分野': new Set(),
                '3次分野': new Set(),
                '1次要素': new Set(),
                '2次要素': new Set(),
                '3次要素': new Set(),
                '完成度': new Set()
            };

            // 表示中の行からオプションを抽出
            visibleRows.forEach(row => {
                // 完成度の特別処理
                const completionCell = row.children[3]; // 完成度列
                const completionText = completionCell.textContent.trim();
                allFilterOptions['完成度'].forEach(level => {
                    if (completionText.includes('レベル' + level)) {
                        currentlyAvailable['完成度'].add(level);
                    }
                });
                
                // その他のフィルタは従来通り
                const text = row.textContent;
                ['1次分野', '2次分野', '3次分野', '1次要素', '2次要素', '3次要素'].forEach(filterKey => {
                    allFilterOptions[filterKey].forEach(option => {
                        if (text.includes(option)) {
                            currentlyAvailable[filterKey].add(option);
                        }
                    });
                });
            });

            // チップの有効/無効を更新（選択されていないもののみ）
            Object.keys(currentlyAvailable).forEach(filterKey => {
                const chips = document.querySelectorAll('[data-level="' + filterKey + '"]');
                chips.forEach(chip => {
                    const value = chip.dataset.value;
                    const isSelected = selectedFilters[filterKey].has(value);
                    const isAvailable = currentlyAvailable[filterKey].has(value);
                    
                    if (!isSelected) {
                        if (isAvailable) {
                            chip.classList.remove('disabled');
                        } else {
                            chip.classList.add('disabled');
                        }
                    }
                });
            });
        }

        // フィルターセクション折りたたみ機能
        function toggleFilterSection(titleElement) {
            const section = titleElement.parentNode;
            section.classList.toggle('collapsed');
        }

        // フィルター全体表示/非表示機能
        function toggleFilters() {
            const filtersDiv = document.querySelector('.filters');
            filtersDiv.classList.toggle('hidden');
        }

        // フィルタクリア機能
        function clearAllFilters() {
            // 全選択状態をクリア
            Object.keys(selectedFilters).forEach(key => {
                selectedFilters[key].clear();
            });
            
            // 全チップのアクティブ状態をクリア
            document.querySelectorAll('.filter-chip').forEach(chip => {
                chip.classList.remove('active', 'disabled');
            });
            
            // 2次・3次レベルを隠す
            document.getElementById('field-level-2').classList.add('hidden');
            document.getElementById('field-level-3').classList.add('hidden');
            document.getElementById('tech-level-2').classList.add('hidden');
            document.getElementById('tech-level-3').classList.add('hidden');
            
            applyFilters();
        }

        // 初期表示時にフィルタを適用
        applyFilters();
    </script>
</body>
</html>`;

    return html;
}

// HTMLファイルを生成して保存
function main() {
    try {
        console.log('JSONデータを読み込んでいます...');
        const html = generateHTML();
        
        console.log('HTMLファイルを生成しています...');
        fs.writeFileSync('technical-documents-table-enhanced.html', html, 'utf8');
        
        console.log('✅ HTMLファイルが正常に生成されました: technical-documents-table-enhanced.html');
        console.log('');
        console.log('新機能:');
        console.log('1. 表示中のデータに基づく動的フィルタオプション');
        console.log('2. 全階層でのチップスタイル選択');
        console.log('3. 階層的な絞り込み（選択した1次に対応する2次・3次のみ表示）');
        console.log('4. 利用不可能なオプションのグレーアウト表示');
        
    } catch (error) {
        console.error('❌ エラーが発生しました:', error.message);
        process.exit(1);
    }
}

// スクリプトが直接実行された場合にmain関数を実行
if (require.main === module) {
    main();
}

module.exports = { generateHTML, loadJSON };