import { useState, useEffect } from "react";
import { PurchaseItem, SearchResultItem, RecentItem } from "../../../types";
import { INITIAL_RECENT_ITEMS, MOCK_SEARCH_RESULTS } from "../../../constants";

// APIレスポンスの型定義
interface ApiResponse<T> {
  success: boolean;
  data: T[];
}

export const usePurchaseData = (
  selectedProjectCode: string,
  equipmentNumber: string
) => {
  const [purchaseItems, setPurchaseItems] = useState<PurchaseItem[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [recentItems, setRecentItems] = useState<RecentItem[]>(INITIAL_RECENT_ITEMS);
  const [isLoadingPurchaseItems, setIsLoadingPurchaseItems] = useState<boolean>(false);

  // 製番が選択されたときに購入品リストを取得
  useEffect(() => {
    if (!selectedProjectCode || !equipmentNumber) {
      setPurchaseItems([]);
      return;
    }

    const fetchPurchaseItems = async () => {
      setIsLoadingPurchaseItems(true);
      try {
        // プロジェクト個別＋all
        const [res1, res2] = await Promise.all([
          fetch(`/api/project-purchase-items?projectCode=${selectedProjectCode}&equipmentNumber=${equipmentNumber}`),
          fetch(`/api/project-purchase-items?projectCode=all&equipmentNumber=${equipmentNumber}`)
        ]);
        const data1: ApiResponse<PurchaseItem> = await res1.json();
        const data2: ApiResponse<PurchaseItem> = await res2.json();
        const allData = [...(data1.success ? data1.data : []), ...(data2.success ? data2.data : [])];
        setPurchaseItems(allData);
      } catch (error) {
        console.error("購入品リストの取得中にエラーが発生しました:", error);
      } finally {
        setIsLoadingPurchaseItems(false);
      }
    };

    void fetchPurchaseItems();
  }, [selectedProjectCode, equipmentNumber]);

  // 検索機能
  const searchItems = (searchTerm: string) => {
    if (!searchTerm || searchTerm.length < 2) {
      setSearchResults([]);
      return;
    }

    // 選択されたプロジェクトと製番に基づいて購入品をフィルタリング
    if (selectedProjectCode && equipmentNumber && purchaseItems.length > 0) {
      // 実際の購入品データからフィルタリング
      const filteredItems = purchaseItems
        .filter(
          (item) =>
            item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.itemDescription && item.itemDescription.toLowerCase().includes(searchTerm.toLowerCase())),
        )
        .map((item) => ({
          id: item.keyID,
          name: item.itemName,
          description: item.itemDescription,
        }));

      setSearchResults(filteredItems);
    } else {
      // プロジェクトや製番が選択されていない場合はモックデータを使用
      const mockResults = MOCK_SEARCH_RESULTS.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase())),
      );

      setSearchResults(mockResults);
    }
  };

  return {
    purchaseItems,
    searchResults,
    recentItems,
    isLoadingPurchaseItems,
    searchItems,
    setSearchResults,
  };
}; 