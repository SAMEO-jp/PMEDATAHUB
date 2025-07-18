import TestPageList from './TestPageList';

export default function TestPortalPage() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">テストポータル</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          各種APIやコンポーネントのテストページをカテゴリ別に整理しています。
          新しいテストページを追加すると、自動的にこの一覧に表示されます。
        </p>
      </div>
      
      <TestPageList />
      
      <div className="text-center text-sm text-muted-foreground">
        <p>新しいテストページを追加する場合は、</p>
        <p>src/app/test/test-pages-config.ts に設定を追加してください。</p>
        <p>「テーブル管理UIテスト」ページも利用できます。</p>
      </div>
    </div>
  );
}
