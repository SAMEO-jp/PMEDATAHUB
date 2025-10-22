import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.*;

public class CsvToJsonConverter {

    public static void main(String[] args) {
        String inputDir = ".";
        String outputDir = ".";

        // CSVファイルをJSONに変換
        convertCsvToJson(inputDir + "/file_categories.csv", outputDir + "/file_categories.json");
        convertCsvToJson(inputDir + "/file_details.csv", outputDir + "/file_details.json");
        convertCsvToJson(inputDir + "/file_technologies.csv", outputDir + "/file_technologies.json");

        System.out.println("CSVからJSONへの変換が完了しました。");
    }

    public static void convertCsvToJson(String csvFilePath, String jsonFilePath) {
        List<Map<String, String>> records = new ArrayList<>();

        try (BufferedReader br = new BufferedReader(new InputStreamReader(new FileInputStream(csvFilePath), StandardCharsets.UTF_8))) {
            String line;
            String[] headers = null;
            boolean isFirstLine = true;

            while ((line = br.readLine()) != null) {
                // タブ区切りで分割
                String[] values = line.split("\t");

                if (isFirstLine) {
                    // ヘッダー行
                    headers = values;
                    isFirstLine = false;
                } else {
                    // データ行
                    Map<String, String> record = new LinkedHashMap<>();
                    for (int i = 0; i < headers.length && i < values.length; i++) {
                        String value = values[i];

                        // BOX IDの場合、シングルクォートを除去
                        if (headers[i].contains("BOX ID") || headers[i].equals("ファイル BOX ID")) {
                            value = value.replaceAll("'", "");
                        }

                        record.put(headers[i], value);
                    }
                    records.add(record);
                }
            }
        } catch (IOException e) {
            System.err.println("CSVファイルの読み込みエラー: " + csvFilePath);
            e.printStackTrace();
            return;
        }

        // JSONファイルに書き込み
        try (PrintWriter writer = new PrintWriter(new OutputStreamWriter(new FileOutputStream(jsonFilePath), StandardCharsets.UTF_8))) {
            writer.println("[");
            for (int i = 0; i < records.size(); i++) {
                Map<String, String> record = records.get(i);
                writer.println("  {");

                int fieldCount = 0;
                for (Map.Entry<String, String> entry : record.entrySet()) {
                    writer.print("    \"" + escapeJsonString(entry.getKey()) + "\": \"" + escapeJsonString(entry.getValue()) + "\"");
                    fieldCount++;
                    if (fieldCount < record.size()) {
                        writer.println(",");
                    } else {
                        writer.println();
                    }
                }

                writer.print("  }");
                if (i < records.size() - 1) {
                    writer.println(",");
                } else {
                    writer.println();
                }
            }
            writer.println("]");

            System.out.println(jsonFilePath + " に変換完了");
        } catch (IOException e) {
            System.err.println("JSONファイルの書き込みエラー: " + jsonFilePath);
            e.printStackTrace();
        }
    }

    private static String escapeJsonString(String str) {
        if (str == null) return "";
        return str.replace("\\", "\\\\")
                  .replace("\"", "\\\"")
                  .replace("\n", "\\n")
                  .replace("\r", "\\r")
                  .replace("\t", "\\t");
    }
}


