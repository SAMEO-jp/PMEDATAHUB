import { useState, useEffect } from "react";
import { EquipmentOption } from "../../../types";

// APIレスポンスの型定義
interface ApiResponse<T> {
  success: boolean;
  data: T[];
}

interface PurchaseItem {
  equipmentNumber: string;
  itemName: string;
}

interface EquipmentItem {
  equipment_id: string;
  equipment_Name: string;
}

export const useEquipmentData = (
  selectedProjectCode: string,
  selectedProjectSubTab: string,
  initialEquipmentNumber: string
) => {
  const [equipmentNumbers, setEquipmentNumbers] = useState<string[]>([]);
  const [equipmentOptions, setEquipmentOptions] = useState<EquipmentOption[]>([]);
  const [equipmentNumber, setEquipmentNumber] = useState<string>("");
  const [equipmentName, setEquipmentName] = useState<string>("");
  const [isLoadingEquipment, setIsLoadingEquipment] = useState<boolean>(false);

  // プロジェクトが選択されたときに製番リストを取得
  useEffect(() => {
    if (!selectedProjectCode) {
      setEquipmentNumbers([]);
      setEquipmentOptions([]);
      setEquipmentNumber("");
      setEquipmentName("");
      return;
    }

    const fetchEquipmentNumbers = async () => {
      setIsLoadingEquipment(true);
      try {
        if (selectedProjectSubTab === "購入品") {
          // 購入品リストから設備番号・名称を取得（プロジェクト個別＋all）
          const [res1, res2] = await Promise.all([
            fetch(`/api/project-purchase-items?projectCode=${selectedProjectCode}`),
            fetch(`/api/project-purchase-items?projectCode=all`)
          ]);
          const data1: ApiResponse<PurchaseItem> = await res1.json();
          const data2: ApiResponse<PurchaseItem> = await res2.json();
          const allData = [...(data1.success ? data1.data : []), ...(data2.success ? data2.data : [])];
          // ユニークなequipmentNumber/itemNameペア
          const filtered = allData.filter((item: PurchaseItem) => item.equipmentNumber && item.itemName);
          const uniquePairs = Array.from(new Map(filtered.map((item: PurchaseItem) => [item.equipmentNumber, item.itemName])).entries());
          // all/未選択を先頭に
          uniquePairs.sort(([a], [b]) => (a === '0' ? -1 : b === '0' ? 1 : 0));
          setEquipmentNumbers(uniquePairs.map(([num]) => num as string));
          setEquipmentOptions(uniquePairs.map(([num, name]) => ({ id: String(num), name: String(name) })));
          if (uniquePairs.length > 0 && !equipmentNumber) {
            setEquipmentNumber(uniquePairs[0][0] as string);
            setEquipmentName(uniquePairs[0][1] as string);
          }
        } else {
          // project_equipmentテーブルからequipment_id/equipment_Nameを取得（プロジェクト個別＋all）
          const [res1, res2] = await Promise.all([
            fetch(`/api/project-equipment-list?projectId=${selectedProjectCode}`),
            fetch(`/api/project-equipment-list?projectId=all`)
          ]);
          const data1: ApiResponse<EquipmentItem> = await res1.json();
          const data2: ApiResponse<EquipmentItem> = await res2.json();
          const allData = [...(data1.success ? data1.data : []), ...(data2.success ? data2.data : [])];
          // ユニークなequipment_id/equipment_Nameペア
          const filtered = allData.filter((item: EquipmentItem) => item.equipment_id && item.equipment_Name);
          const uniquePairs = Array.from(new Map(filtered.map((item: EquipmentItem) => [item.equipment_id, item.equipment_Name])).entries());
          // all/未選択を先頭に
          uniquePairs.sort(([a], [b]) => (a === '0' ? -1 : b === '0' ? 1 : 0));
          setEquipmentNumbers(uniquePairs.map(([id]) => id as string));
          setEquipmentOptions(uniquePairs.map(([id, name]) => ({ id: String(id), name: String(name) })));
          if (uniquePairs.length > 0 && !equipmentNumber) {
            setEquipmentNumber(uniquePairs[0][0] as string);
            setEquipmentName(uniquePairs[0][1] as string);
          }
        }
      } catch (error) {
        console.error("設備リストの取得中にエラーが発生しました:", error);
        setEquipmentNumbers([]);
        setEquipmentOptions([]);
      } finally {
        setIsLoadingEquipment(false);
      }
    };
    void fetchEquipmentNumbers();
  }, [selectedProjectCode, selectedProjectSubTab]);

  return {
    equipmentNumbers,
    equipmentOptions,
    equipmentNumber,
    equipmentName,
    isLoadingEquipment,
    setEquipmentNumber,
    setEquipmentName,
  };
}; 