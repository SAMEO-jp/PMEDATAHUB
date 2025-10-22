// ================================
// 層／用途: プレビュー表示部品
// 役割/目的: 図面プレビュー画像の表示
// 補足メモ: page.tsxから分割、propsで画像URLを受け取る
// ================================

import React from 'react'

type Props = {
  img: string | null
}

export const PreviewPanel: React.FC<Props> = ({ img }) => (
  <div className='flex-grow border rounded-lg bg-slate-50 flex items-center justify-center p-4'>
    {img ? (
      <img src={img} alt='図面プレビュー' className='max-w-full max-h-full object-contain rounded' />
    ) : (
      <p className='text-slate-400 text-center'>部品表の行をクリックしてプレビューを表示します</p>
    )}
  </div>
)
// ================================ 