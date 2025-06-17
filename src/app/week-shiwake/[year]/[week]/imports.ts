// React関連
import { useState, useEffect, useRef, useCallback } from "react"

// Next.js関連
import { useParams, useRouter } from "next/navigation"

// DnD関連
import { 
  DndContext, closestCenter, KeyboardSensor,
  PointerSensor, useSensor, useSensors,
  DragOverlay 
} from "@dnd-kit/core"
import { restrictToWindowEdges } from "@dnd-kit/modifiers"

// データベース関連
import { 
  getEmployees, 
  saveWeekAchievements, 
  deleteAchievement, 
} from "./lib/client-db"
import { 
  setWeekDataChanged, 
  hasWeekDataChanged, 
  saveWeekDataToStorage,
  clearWeekData, 
  getWeekDataFromStorage 
} from "./lib/client-storage"
import { 
  getKintaiByWeek, 
  updateKintaiByWeek 
} from "./lib/client-kintai"

// コンポーネント関連
import WeekSidebar from "./components/sidebar/WeekSidebar"
import { TimeGrid } from "./components/TimeGrid"
import { EventDragOverlay } from "./components/EventDragOverlay"

// ユーティリティ関連
import { 
  getWeekNumber, 
  getWeekDates, 
  getWeekDaysArray,
  formatDateTimeForStorage, 
  parseDateTime, 
  FIFTEEN_MIN_HEIGHT,
  minuteSlots
} from "./utils/dateUtils"
import { createNewEvent } from "./utils/eventUtils"
import { useResizeEvent } from "./hooks/useResizeEvent"
import { EventItem } from "./types/event"
import { customDropAnimation } from "./utils/animationUtils"
import { EVENT_CATEGORY_COLORS, DEFAULT_WORK_TIMES } from "./utils/constants"

// エクスポート
export {
  // React
  useState,
  useEffect,
  useRef,
  useCallback,

  // Next.js
  useParams,
  useRouter,

  // DnD
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  restrictToWindowEdges,

  // データベース
  getEmployees,
  saveWeekAchievements,
  deleteAchievement,
  setWeekDataChanged,
  hasWeekDataChanged,
  saveWeekDataToStorage,
  clearWeekData,
  getWeekDataFromStorage,
  getKintaiByWeek,
  updateKintaiByWeek,

  // コンポーネント
  WeekSidebar,
  TimeGrid,
  EventDragOverlay,

  // ユーティリティ
  getWeekNumber,
  getWeekDates,
  getWeekDaysArray,
  formatDateTimeForStorage,
  parseDateTime,
  FIFTEEN_MIN_HEIGHT,
  minuteSlots,
  createNewEvent,
  useResizeEvent,
  type EventItem,
  customDropAnimation,
  EVENT_CATEGORY_COLORS,
  DEFAULT_WORK_TIMES
} 