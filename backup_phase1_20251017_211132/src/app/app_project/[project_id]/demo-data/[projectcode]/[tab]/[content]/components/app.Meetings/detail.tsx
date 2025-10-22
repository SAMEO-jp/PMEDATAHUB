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

type MeetingsDetailProps = {
  project: Project;
  mockData: any;
}

export function MeetingsDetail({ project, mockData }: MeetingsDetailProps) {
  return (
    <div className="space-y-6">
      {/* 会議詳細 */}
      <Card>
        <CardHeader>
          <CardTitle>会議詳細</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">会議ID</label>
                <Input value="MEETING-001" disabled />
              </div>
              <div>
                <label className="text-sm font-medium">タイトル</label>
                <Input value="週次進捗会議" />
              </div>
              <div>
                <label className="text-sm font-medium">場所</label>
                <Input value="会議室A" />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">日晁E/label>
                <Input type="datetime-local" value="2024-05-15T10:00" />
              </div>
              <div>
                <label className="text-sm font-medium">参加老E/label>
                <Select defaultValue="multiple">
                  <SelectTrigger>
                    <SelectValue placeholder="参加老E��選抁E />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="multiple">褁E��選抁E/SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">スチE�Eタス</label>
                <Select defaultValue="scheduled">
                  <SelectTrigger>
                    <SelectValue placeholder="スチE�Eタスを選抁E />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">予宁E/SelectItem>
                    <SelectItem value="in_progress">進行中</SelectItem>
                    <SelectItem value="completed">完亁E/SelectItem>
                    <SelectItem value="cancelled">キャンセル</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <label className="text-sm font-medium">議顁E/label>
            <TextArea
              placeholder="会議の議題を入力してください"
              className="mt-2"
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* 議事録 */}
      <Card>
        <CardHeader>
          <CardTitle>議事録</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockData.meetingMinutes?.map((minute: any) => (
              <div key={minute.id} className="border-b pb-4 last:border-0">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium">{minute.author}</p>
                    <p className="text-sm text-gray-500">{minute.date}</p>
                  </div>
                </div>
                <p className="text-gray-700">{minute.content}</p>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <TextArea
              placeholder="議事録を�E力してください"
              className="mb-2"
              rows={3}
            />
            <Button>議事録を投稿</Button>
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
