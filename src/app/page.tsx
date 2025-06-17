//本ページは、ホームページで、最初に表示するページです。
//app_bomとapp_tableとapp_projectの三つのアプリに飛べるような最初のページです。

'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@ui/card';
import { Button } from '@ui/button';

export default function HomePage() {
  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          業務システム
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* BOMアプリケーション */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-2xl text-center">BOM管理</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-4">
                BOMの作成、編集、管理を行います。
              </p>
              <Link href="/app_bom">
                <Button className="w-full">
                  BOM管理を開く
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* テーブルアプリケーション */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-2xl text-center">テーブル管理</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-4">
                テーブルの作成、編集、管理を行います。
              </p>
              <Link href="/app_table">
                <Button className="w-full">
                  テーブル管理を開く
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* プロジェクトアプリケーション */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-2xl text-center">プロジェクト管理</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-4">
                プロジェクトの作成、編集、管理を行います。
              </p>
              <Link href="/app_project">
                <Button className="w-full">
                  プロジェクト管理を開く
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}