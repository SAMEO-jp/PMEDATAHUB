'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@src/components/ui/card';
import { Badge } from '@src/components/ui/badge';
import { getTestPagesByCategory, type TestPageConfig } from './test-pages-config';

interface TestPageListProps {
  showCategory?: boolean;
}

export default function TestPageList({ showCategory = true }: TestPageListProps) {
  const groupedPages = getTestPagesByCategory();

  return (
    <div className="space-y-8">
      {Object.entries(groupedPages).map(([category, pages]) => (
        <div key={category} className="space-y-4">
          {showCategory && (
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-semibold">{category}</h2>
              <Badge variant="secondary">{pages.length}件</Badge>
            </div>
          )}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pages.map((page) => (
              <TestPageCard key={page.path} page={page} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

interface TestPageCardProps {
  page: TestPageConfig;
}

function TestPageCard({ page }: TestPageCardProps) {
  return (
    <Link href={page.path} className="block">
      <Card className="h-full hover:bg-muted/50 transition-colors duration-200 hover:shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg leading-tight">{page.title}</CardTitle>
            {page.category && (
              <Badge variant="outline" className="text-xs">
                {page.category}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <CardDescription className="text-sm leading-relaxed">
            {page.description}
          </CardDescription>
          <div className="mt-3 text-xs text-muted-foreground">
            {page.path}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
} 