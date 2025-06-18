"use client";

import React from "react";
import { useParams } from "next/navigation";
import { Button } from "@ui/button";
import { ChevronLeft, ChevronRight, Save } from "lucide-react";
import { getWeekNumber, getWeekDates } from "@/src/app/week-shiwake/[year]/[week]/utils/dateUtils";

interface WeekShiwakeHeaderProps {
  year: string;
  week: string;
  onSave: () => void;
}

export function WeekShiwakeHeader({ year: yearStr, week: weekStr, onSave }: WeekShiwakeHeaderProps) {
  const year = Number(yearStr) || new Date().getFullYear();
  const week = Number(weekStr) || getWeekNumber(new Date());

  const handlePrevWeek = () => {
    const { startDate } = getWeekDates(year, week);
    const prevWeekDate = new Date(startDate);
    prevWeekDate.setDate(prevWeekDate.getDate() - 7);
    const prevYear = prevWeekDate.getFullYear();
    const prevWeek = getWeekNumber(prevWeekDate);

    window.dispatchEvent(
      new CustomEvent("week-change", {
        detail: { newYear: prevYear, newWeek: prevWeek },
      })
    );
  };

  const handleNextWeek = () => {
    const { startDate } = getWeekDates(year, week);
    const nextWeekDate = new Date(startDate);
    nextWeekDate.setDate(nextWeekDate.getDate() + 7);
    const nextYear = nextWeekDate.getFullYear();
    const nextWeek = getWeekNumber(nextWeekDate);

    window.dispatchEvent(
      new CustomEvent("week-change", {
        detail: { newYear: nextYear, newWeek: nextWeek },
      })
    );
  };

  const handleSave = () => {
    console.log('保存ボタンがクリックされました');
    onSave();
    console.log('onSaveが呼び出されました');
    window.dispatchEvent(new CustomEvent("week-save"));
    console.log('week-saveイベントが発火されました');
  };

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePrevWeek}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium">
          {year}年第{week}週
        </span>
        <Button
          variant="outline"
          size="icon"
          onClick={handleNextWeek}
          className="h-8 w-8"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={handleSave}
        className="flex items-center space-x-2"
      >
        <Save className="h-4 w-4" />
        <span>保存</span>
      </Button>
    </div>
  );
} 