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
      {/* 譁・嶌隧ｳ邏ｰ */}
      <Card>
        <CardHeader>
          <CardTitle>譁・嶌隧ｳ邏ｰ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">譁・嶌ID</label>
                <Input value="DOC-001" disabled />
              </div>
              <div>
                <label className="text-sm font-medium">繧ｿ繧､繝医Ν</label>
                <Input value="繝励Ο繧ｸ繧ｧ繧ｯ繝郁ｨ育判譖ｸ" />
              </div>
              <div>
                <label className="text-sm font-medium">繧ｫ繝・ざ繝ｪ</label>
                <Select defaultValue="plan">
                  <SelectTrigger>
                    <SelectValue placeholder="繧ｫ繝・ざ繝ｪ繧帝∈謚・ />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="plan">險育判譖ｸ</SelectItem>
                    <SelectItem value="report">蝣ｱ蜻頑嶌</SelectItem>
                    <SelectItem value="contract">螂醍ｴ・嶌</SelectItem>
                    <SelectItem value="other">縺昴・莉・/SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">繝舌・繧ｸ繝ｧ繝ｳ</label>
                <Input value="1.0" />
              </div>
              <div>
                <label className="text-sm font-medium">譖ｴ譁ｰ譌･</label>
                <Input type="date" value="2024-05-15" />
              </div>
              <div>
                <label className="text-sm font-medium">繧ｹ繝・・繧ｿ繧ｹ</label>
                <Select defaultValue="review">
                  <SelectTrigger>
                    <SelectValue placeholder="繧ｹ繝・・繧ｿ繧ｹ繧帝∈謚・ />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">荳区嶌縺・/SelectItem>
                    <SelectItem value="review">繝ｬ繝薙Η繝ｼ荳ｭ</SelectItem>
                    <SelectItem value="approved">謇ｿ隱肴ｸ医∩</SelectItem>
                    <SelectItem value="rejected">蜊ｴ荳・/SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <label className="text-sm font-medium">隱ｬ譏・/label>
            <TextArea
              placeholder="譁・嶌縺ｮ隱ｬ譏弱ｒ蜈･蜉帙＠縺ｦ縺上□縺輔＞"
              className="mt-2"
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* 繝ｬ繝薙Η繝ｼ螻･豁ｴ */}
      <Card>
        <CardHeader>
          <CardTitle>繝ｬ繝薙Η繝ｼ螻･豁ｴ</CardTitle>
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
                    review.status === "謇ｿ隱・ ? "default" :
                    review.status === "繧ｳ繝｡繝ｳ繝・ ? "secondary" :
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
              placeholder="繝ｬ繝薙Η繝ｼ繧ｳ繝｡繝ｳ繝医ｒ蜈･蜉帙＠縺ｦ縺上□縺輔＞"
              className="mb-2"
              rows={3}
            />
            <div className="flex gap-2">
              <Button variant="outline">繧ｳ繝｡繝ｳ繝・/Button>
              <Button>謇ｿ隱・/Button>
              <Button variant="destructive">蜊ｴ荳・/Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 繧｢繧ｯ繧ｷ繝ｧ繝ｳ */}
      <div className="flex justify-end gap-4">
        <Button variant="outline">繧ｭ繝｣繝ｳ繧ｻ繝ｫ</Button>
        <Button>菫晏ｭ・/Button>
      </div>
    </div>
  )
} 
