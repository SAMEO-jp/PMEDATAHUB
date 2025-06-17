'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@ui/button';
import { Home, Table, ListTree } from 'lucide-react';

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200">
      <nav className="p-4 space-y-2">
        <Link href="/" className="block">
          <Button variant="ghost" className="w-full justify-start">
            <Home className="mr-2 h-4 w-4" />
            ホーム
          </Button>
        </Link>
        <Link href="/app_bom" className="block">
          <Button variant="ghost" className="w-full justify-start">
            <ListTree className="mr-2 h-4 w-4" />
            BOM管理
          </Button>
        </Link>
        <Link href="/app_table" className="block">
          <Button variant="ghost" className="w-full justify-start">
            <Table className="mr-2 h-4 w-4" />
            テーブル管理
          </Button>
        </Link>
      </nav>
    </aside>
  );
} 