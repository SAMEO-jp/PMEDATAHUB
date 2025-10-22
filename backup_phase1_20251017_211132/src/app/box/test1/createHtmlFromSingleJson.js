const fs = require('fs');
const path = require('path');

function createHtmlFromSingleJson() {
    // 統合JSONファイルを読み込み
    const inputPath = path.join(__dirname, 'integrated_data.json');
    const combinedData = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

    console.log('統合JSONファイルから読み込みました');
    console.log('データ件数:', combinedData.length);

    // HTMLファイルを生成
    const htmlContent = `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>統合データテーブル (単一JSON)</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f5f5f5;
        }

        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 20px;
        }

        h1 {
            color: #2563eb;
            margin-bottom: 20px;
            text-align: center;
        }

        .table-container {
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            overflow-x: auto;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 14px;
        }

        th, td {
            padding: 12px 15px;
            text-align: left;
            border-bottom: 1px solid #e5e7eb;
        }

        th {
            background-color: #f9fafb;
            font-weight: 600;
            color: #374151;
            position: sticky;
            top: 0;
            z-index: 10;
        }

        tr:hover {
            background-color: #f9fafb;
        }

        .box-id {
            font-weight: 600;
            color: #2563eb;
        }

        .tech-item {
            margin-bottom: 4px;
            padding: 4px 8px;
            background: #f3f4f6;
            border-radius: 4px;
            font-size: 12px;
        }

        .tech-primary {
            font-weight: 600;
            color: #059669;
        }

        .tech-secondary {
            color: #7c3aed;
            margin-left: 12px;
        }

        .tech-tertiary {
            color: #dc2626;
            margin-left: 24px;
        }

        .summary {
            margin-top: 20px;
            padding: 15px;
            background: #f9fafb;
            border-radius: 6px;
            text-align: center;
            color: #6b7280;
        }

        .loading {
            text-align: center;
            padding: 50px;
            font-size: 18px;
            color: #6b7280;
        }

        @media (max-width: 768px) {
            .container {
                padding: 10px;
            }

            th, td {
                padding: 8px 10px;
                font-size: 12px;
            }

            .tech-secondary {
                margin-left: 8px;
            }

            .tech-tertiary {
                margin-left: 16px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>統合データテーブル (単一JSON)</h1>

        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>BOX ID</th>
                        <th>1次分野</th>
                        <th>2次分野</th>
                        <th>3次分野</th>
                        <th>ファイル名</th>
                        <th>完成度</th>
                        <th>整理日</th>
                        <th>技術要素</th>
                    </tr>
                </thead>
                <tbody>
                    ${combinedData.map(item => `
                        <tr>
                            <td class="box-id">${item.boxId}</td>
                            <td>${item.category?.["1次分野"] || '-'}</td>
                            <td>${item.category?.["2次分野"] || '-'}</td>
                            <td>${item.category?.["3次分野"]?.replace('\\r', '') || '-'}</td>
                            <td>${item.detail?.["ファイル名"]?.replace('\\r', '') || '-'}</td>
                            <td>${item.detail?.["完成度"] || '-'}</td>
                            <td>${item.detail?.["整理日"] || '-'}</td>
                            <td>
                                ${item.technologies.length > 0 ?
                                    item.technologies.map(tech => `
                                        <div class="tech-item">
                                            <div class="tech-primary">${tech["1次要素"]}</div>
                                            <div class="tech-secondary">└ ${tech["2次要素"]}</div>
                                            <div class="tech-tertiary">└ ${tech["3次要素"]?.replace('\\r', '')}</div>
                                        </div>
                                    `).join('')
                                    : '-'
                                }
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>

        <div class="summary">
            <strong>単一JSON統合データ:</strong> ${combinedData.length} 件
        </div>
    </div>
</body>
</html>`;

    // HTMLファイルを保存
    const htmlPath = path.join(__dirname, 'single_json_table.html');
    fs.writeFileSync(htmlPath, htmlContent, 'utf8');

    console.log('単一JSON版HTMLファイルが作成されました:', htmlPath);
    console.log('ファイルサイズ:', (fs.statSync(htmlPath).size / 1024).toFixed(2), 'KB');
}

createHtmlFromSingleJson();


