"use client"

import { IndirectSelect } from "./IndirectSelect"

export const IndirectSubTabs = () => {
  // TODO: このコンポーネントはIndirectSelectを呼び出すだけのラッパー
  // IndirectSelectは既にContextを使用しているため、Propsは不要
  return (
    <IndirectSelect />
  )
} 