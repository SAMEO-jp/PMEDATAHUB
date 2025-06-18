'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CommonHeader } from './CommonHeader';
import { WeekShiwakeHeader } from './WeekShiwake/WeekShiwakeHeader';

export function Header() {
  const pathname = usePathname();

  // 週次仕訳画面のパスかどうかを判定
  const isWeekShiwakePage = pathname?.startsWith('/week-shiwake/');
  
  // パスから年と週を取得
  const getYearAndWeek = () => {
    if (!isWeekShiwakePage) return { year: '', week: '' };
    const [, year, week] = pathname.split('/');
    return { year, week };
  };

  const { year, week } = getYearAndWeek();

  const handleSave = () => {
    window.dispatchEvent(new CustomEvent("week-save"));
  };

  return (
    <CommonHeader>
      {isWeekShiwakePage ? (
        <WeekShiwakeHeader
          year={year}
          week={week}
          onSave={handleSave}
        />
      ) : (
        <Link href="/" className="text-xl font-bold text-gray-800">
          業務システム
        </Link>
      )}
    </CommonHeader>
  );
} 