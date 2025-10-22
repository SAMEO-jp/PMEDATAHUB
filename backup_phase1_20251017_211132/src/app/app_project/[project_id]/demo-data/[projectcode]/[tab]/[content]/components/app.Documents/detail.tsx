"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TextArea } from "@/components/ui/TextArea"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Project } from "@/lib/project/types"

type DocumentsDetailProps = {
  project: Project;
  mockData: any;
}

export function DocumentsDetail({ project, mockData }: DocumentsDetailProps) {
  return (
    <div className="space-y-6">
      {/* 斁E��詳細 */}
      <Card>
        <CardHeader>
          <CardTitle>斁E��詳細</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">斁E��ID</label>
                <Input value="DOC-001" disabled />
              </div>
              <div>
                <label className="text-sm font-medium">タイトル</label>
                <Input value="プロジェクト計画書" />
              </div>
              <div>
                <label className="text-sm font-medium">カチE��リ</label>
                <Select defaultValue="plan">
                  <SelectTrigger>
                    <SelectValue placeholder="カチE��リを選抁E />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="plan">計画書</SelectItem>
                    <SelectItem value="report">報告書</SelectItem>
                    <SelectItem value="contract">契紁E��</SelectItem>
                    <SelectItem value="other">そ�E仁E/SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">バ�Eジョン</label>
                <Input value="1.0" />
              </div>
              <div>
                <label className="text-sm font-medium">更新日</label>
                <Input type="date" value="2024-05-15" />
              </div>
              <div>
                <label className="text-sm font-medium">スチE�Eタス</label>
                <Select defaultValue="review">
                  <SelectTrigger>
                    <SelectValue placeholder="スチE�Eタスを選抁E />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">下書ぁE/SelectItem>
                    <SelectItem value="review">レビュー中</SelectItem>
                    <SelectItem value="approved">承認済み</SelectItem>
                    <SelectItem value="rejected">却丁E/SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <label className="text-sm font-medium">説昁E/label>
            <TextArea
              placeholder="斁E��の説明を入力してください"
              className="mt-2"
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* レビュー履歴 */}
      <Card>
        <CardHeader>
          <CardTitle>レビュー履歴</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockData.documentReviews?.map((review: any) => (
              <div key={review.id} className="border-b pb-4 last:border-0">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium">{review.reviewer}</p>
                    <p className="text-sm text-gray-500">{review.date}</p>
                  </div>
                  <Badge variant={
                    review.status === "承誁E ? "default" :
                    review.status === "コメンチE ? "secondary" :
                    "destructive"
                  }>
                    {review.status}
                  </Badge>
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <TextArea
              placeholder="レビューコメントを入力してください"
              className="mb-2"
              rows={3}
            />
            <div className="flex gap-2">
              <Button variant="outline">コメンチE/Button>
              <Button>承誁E/Button>
              <Button variant="destructive">却丁E/Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* アクション */}
      <div className="flex justify-end gap-4">
        <Button variant="outline">キャンセル</Button>
        <Button>保孁E/Button>
      </div>
    </div>
  )
} 
