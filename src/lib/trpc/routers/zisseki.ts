/**
 * @file 実績データ（Zisseki）に関連するAPIエンドポイント（プロシージャ）を定義するルーターファイルです。
 */

import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { getAllRecords, createRecord, updateDataById, executeQuery } from '@src/lib/db/crud/db_CRUD';
import { createTRPCRouter, publicProcedure } from '../trpc';
import type { TimeGridEvent, WorkTimeData } from '@src/app/zisseki-demo/[year]/[week]/types';

// 入力バリデーションスキーマ
const WeekParamsSchema = z.object({
  year: z.number().min(2020).max(2030),
  week: z.number().min(1, '週番号は1以上である必要があります').max(53, '週番号は53以下である必要があります'),
  userId: z.string().min(1, 'ユーザーIDは必須です'),
});

const MonthParamsSchema = z.object({
  year: z.number().min(2020).max(2030),
  month: z.number().min(1, '月は1以上である必要があります').max(12, '月は12以下である必要があります'),
  userId: z.string().min(1, 'ユーザーIDは必須です'),
});

const WorkTimeParamsSchema = z.object({
  year: z.number().min(2020).max(2030),
  week: z.number().min(1, '週番号は1以上である必要があります').max(53, '週番号は53以下である必要があります'),
  userId: z.string().min(1, 'ユーザーIDは必須です'),
});

const EventSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'タイトルは必須です'),
  description: z.string().optional(),
  project: z.string().optional(),
  startDateTime: z.string().datetime('開始日時は有効な日時形式である必要があります'),
  endDateTime: z.string().datetime('終了日時は有効な日時形式である必要があります'),
  activityCode: z.string().optional(),
  top: z.number().optional(),
  height: z.number().optional(),
  color: z.string().optional(),
  unsaved: z.boolean().optional(),
  category: z.string().optional(),
  employeeNumber: z.string().optional(),
  // 追加のプロパティ
  equipmentNumber: z.string().optional(),
  equipmentName: z.string().optional(),
  equipment_id: z.string().optional(),
  equipment_Name: z.string().optional(),
  itemName: z.string().optional(),
  purposeProject: z.string().optional(),
  departmentCode: z.string().optional(),
  planningSubType: z.string().optional(),
  estimateSubType: z.string().optional(),
  designSubType: z.string().optional(),
  meetingType: z.string().optional(),
  travelType: z.string().optional(),
  stakeholderType: z.string().optional(),
  documentType: z.string().optional(),
  documentMaterial: z.string().optional(),
  subTabType: z.string().optional(),
  activityColumn: z.string().optional(),
  indirectType: z.string().optional(),
  indirectDetailType: z.string().optional(),
  selectedTab: z.string().optional(),
  selectedProjectSubTab: z.string().optional(),
  selectedIndirectSubTab: z.string().optional(),
  selectedIndirectDetailTab: z.string().optional(),
  selectedOtherSubTab: z.string().optional(),
  status: z.string().optional(),
});

const WeekDataSchema = z.object({
  events: z.array(EventSchema),
  workTimes: z.array(z.object({
    date: z.string(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
  })),
});

// eventsテーブルの型定義（全カラム対応）
interface EventRecord {
  id: string;
  title: string;
  description: string | null;
  project: string | null;
  startDateTime: string;
  endDateTime: string;
  top: number | null;
  height: number | null;
  color: string | null;
  unsaved: number | null;
  category: string | null;
  employeeNumber: string | null;
  activityCode: string | null;
  purposeProject: string | null;
  departmentCode: string | null;
  equipmentNumber: string | null;
  equipmentName: string | null;
  equipment_id: string | null;
  equipment_Name: string | null;
  itemName: string | null;
  planningSubType: string | null;
  estimateSubType: string | null;
  designSubType: string | null;
  meetingType: string | null;
  travelType: string | null;
  stakeholderType: string | null;
  documentType: string | null;
  documentMaterial: string | null;
  subTabType: string | null;
  activityColumn: string | null;
  indirectType: string | null;
  indirectDetailType: string | null;
  selectedTab: string | null;
  selectedProjectSubTab: string | null;
  selectedIndirectSubTab: string | null;
  selectedIndirectDetailTab: string | null;
  selectedOtherSubTab: string | null;
  status: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * 実績データ関連のプロシージャをまとめたルーター。
 * 週単位でのデータ取得・保存を管理します。
 */
export const zissekiRouter = createTRPCRouter({
  /**
   * 指定された年・週の実績データを取得するプロシージャ。
   */
  getWeekData: publicProcedure
    .input(WeekParamsSchema)
    .query(async ({ input }) => {
      try {
        // サーバーサイドログ出力
        console.log(`🔍 [API] getWeekData: year=${input.year}, week=${input.week}, userId=${input.userId}`);

        // eventsテーブルから該当週のデータを取得
        const startOfWeek = new Date(input.year, 0, 1 + (input.week - 1) * 7);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        const query = `
          SELECT
            id,
            title,
            description,
            project,
            startDateTime,
            endDateTime,
            top,
            height,
            color,
            unsaved,
            category,
            employeeNumber,
            activityCode,
            purposeProject,
            departmentCode,
            equipmentNumber,
            equipmentName,
            equipment_id,
            equipment_Name,
            itemName,
            planningSubType,
            estimateSubType,
            designSubType,
            meetingType,
            travelType,
            stakeholderType,
            documentType,
            documentMaterial,
            subTabType,
            activityColumn,
            indirectType,
            indirectDetailType,
            selectedTab,
            selectedProjectSubTab,
            selectedIndirectSubTab,
            selectedIndirectDetailTab,
            selectedOtherSubTab,
            status,
            createdAt,
            updatedAt
          FROM events
          WHERE startDateTime >= ?
            AND startDateTime <= ?
            AND (employeeNumber = ? OR employeeNumber IS NULL OR employeeNumber = '')
          ORDER BY startDateTime ASC
        `;

        const result = await getAllRecords<EventRecord>(
          'events',
          query,
          [startOfWeek.toISOString(), endOfWeek.toISOString(), input.userId]
        );

        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: result.error?.message || 'データの取得に失敗しました',
          });
        }

        // 取得したデータをTimeGridEvent形式に変換（createdAtとupdatedAtを含む）
        const events: (TimeGridEvent & { createdAt: string; updatedAt: string })[] = (result.data || []).map((event: EventRecord) => ({
          id: event.id,
          title: event.title,
          description: event.description || '',
          project: event.project || '',
          startDateTime: event.startDateTime,
          endDateTime: event.endDateTime,
          activityCode: event.activityCode || '',
          top: event.top || 0,
          height: event.height || 64,
          color: event.color || '#3788d8',
          unsaved: Boolean(event.unsaved),
          category: event.category || '',
          employeeNumber: event.employeeNumber || '',
          // 追加のプロパティ
          equipmentNumber: event.equipmentNumber || '',
          equipmentName: event.equipmentName || '',
          equipment_id: event.equipment_id || '',
          equipment_Name: event.equipment_Name || '',
          itemName: event.itemName || '',
          purposeProject: event.purposeProject || '',
          departmentCode: event.departmentCode || '',
          planningSubType: event.planningSubType || '',
          estimateSubType: event.estimateSubType || '',
          designSubType: event.designSubType || '',
          meetingType: event.meetingType || '',
          travelType: event.travelType || '',
          stakeholderType: event.stakeholderType || '',
          documentType: event.documentType || '',
          documentMaterial: event.documentMaterial || '',
          subTabType: event.subTabType || '',
          activityColumn: event.activityColumn || '',
          indirectType: event.indirectType || '',
          indirectDetailType: event.indirectDetailType || '',
          selectedTab: event.selectedTab || '',
          selectedProjectSubTab: event.selectedProjectSubTab || '',
          selectedIndirectSubTab: event.selectedIndirectSubTab || '',
          selectedIndirectDetailTab: event.selectedIndirectDetailTab || '',
          selectedOtherSubTab: event.selectedOtherSubTab || '',
          status: event.status || '',
          createdAt: event.createdAt,
          updatedAt: event.updatedAt,
        }));

        // ワークタイムは一旦空配列を返す（後で実装）
        const workTimes: WorkTimeData[] = [];

        // レスポンスログ出力
        console.log(`✅ [API] getWeekData success: ${events.length} events found`);

        return {
          success: true,
          data: {
            events,
            workTimes,
            metadata: {
              year: input.year,
              week: input.week,
              lastModified: new Date().toISOString(),
              totalEvents: events.length,
            },
          },
        };
      } catch (error) {
        console.error('tRPC zisseki.getWeekData error:', error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'データの取得に失敗しました',
        });
      }
    }),

  /**
   * 指定された年・週の実績データを保存するプロシージャ。
   */
  saveWeekData: publicProcedure
    .input(z.object({
      year: z.number(),
      week: z.number(),
      userId: z.string().min(1, 'ユーザーIDは必須です'),
      data: WeekDataSchema,
    }))
    .mutation(async ({ input }) => {
      try {
        const { year, week, userId, data } = input;

        // サーバーサイドログ出力
        console.log(`🔍 [API] saveWeekData: year=${year}, week=${week}, userId=${userId}, events=${data.events.length}`);

        // 既存データを削除（週単位で該当ユーザーのデータのみ削除）
        const startOfWeek = new Date(year, 0, 1 + (week - 1) * 7);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        // 既存データを削除
        const deleteQuery = `
          DELETE FROM events
          WHERE startDateTime >= ?
            AND startDateTime <= ?
            AND (employeeNumber = ? OR employeeNumber IS NULL OR employeeNumber = '')
        `;

        // 削除処理を実行
        const deleteResult = await executeQuery(deleteQuery, [
          startOfWeek.toISOString(),
          endOfWeek.toISOString(),
          userId
        ]);

        if (!deleteResult.success) {
          console.warn('既存データの削除に失敗しました:', deleteResult.error);
        } else {
          console.log('既存データの削除が完了しました');
        }

        // 新しいイベントデータをUPSERT（存在する場合は更新、存在しない場合は挿入）
        const insertPromises = data.events.map(async (event) => {
          const eventData = {
            id: event.id,
            title: event.title,
            description: event.description || '',
            project: event.project || '',
            startDateTime: event.startDateTime,
            endDateTime: event.endDateTime,
            top: event.top || 0,
            height: event.height || 64,
            color: event.color || '#3788d8',
            unsaved: event.unsaved ? 1 : 0,
            category: event.category || '',
            employeeNumber: userId, // 必ずログイン中のユーザーIDを設定
            activityCode: event.activityCode || '',
            purposeProject: event.purposeProject || '',
            departmentCode: event.departmentCode || '',
            equipmentNumber: event.equipmentNumber || '',
            equipmentName: event.equipmentName || '',
            equipment_id: event.equipment_id || '',
            equipment_Name: event.equipment_Name || '',
            itemName: event.itemName || '',
            planningSubType: event.planningSubType || '',
            estimateSubType: event.estimateSubType || '',
            designSubType: event.designSubType || '',
            meetingType: event.meetingType || '',
            travelType: event.travelType || '',
            stakeholderType: event.stakeholderType || '',
            documentType: event.documentType || '',
            documentMaterial: event.documentMaterial || '',
            subTabType: event.subTabType || '',
            activityColumn: event.activityColumn || '',
            indirectType: event.indirectType || '',
            indirectDetailType: event.indirectDetailType || '',
            selectedTab: event.selectedTab || '',
            selectedProjectSubTab: event.selectedProjectSubTab || '',
            selectedIndirectSubTab: event.selectedIndirectSubTab || '',
            selectedIndirectDetailTab: event.selectedIndirectDetailTab || '',
            selectedOtherSubTab: event.selectedOtherSubTab || '',
            status: event.status || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          // UPSERTクエリを使用（SQLiteのREPLACE INTO）
          const upsertQuery = `
            REPLACE INTO events (
              id, title, description, project, startDateTime, endDateTime,
              top, height, color, unsaved, category, employeeNumber,
              activityCode, purposeProject, departmentCode, equipmentNumber,
              equipmentName, equipment_id, equipment_Name, itemName,
              planningSubType, estimateSubType, designSubType, meetingType,
              travelType, stakeholderType, documentType, documentMaterial,
              subTabType, activityColumn, indirectType, indirectDetailType,
              selectedTab, selectedProjectSubTab, selectedIndirectSubTab,
              selectedIndirectDetailTab, selectedOtherSubTab, status,
              createdAt, updatedAt
            ) VALUES (
              ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
              ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
            )
          `;

          const values = [
            eventData.id, eventData.title, eventData.description, eventData.project,
            eventData.startDateTime, eventData.endDateTime, eventData.top, eventData.height,
            eventData.color, eventData.unsaved, eventData.category, eventData.employeeNumber,
            eventData.activityCode, eventData.purposeProject, eventData.departmentCode,
            eventData.equipmentNumber, eventData.equipmentName, eventData.equipment_id,
            eventData.equipment_Name, eventData.itemName, eventData.planningSubType,
            eventData.estimateSubType, eventData.designSubType, eventData.meetingType,
            eventData.travelType, eventData.stakeholderType, eventData.documentType,
            eventData.documentMaterial, eventData.subTabType, eventData.activityColumn,
            eventData.indirectType, eventData.indirectDetailType, eventData.selectedTab,
            eventData.selectedProjectSubTab, eventData.selectedIndirectSubTab,
            eventData.selectedIndirectDetailTab, eventData.selectedOtherSubTab,
            eventData.status, eventData.createdAt, eventData.updatedAt
          ];

          const result = await executeQuery(upsertQuery, values);
          
          if (!result.success) {
            throw new Error(typeof result.error === 'string' ? result.error : 'イベントの保存に失敗しました');
          }

          return eventData;
        });

        const insertedEvents = await Promise.all(insertPromises);

        // レスポンスログ出力
        console.log(`✅ [API] saveWeekData success: ${insertedEvents.length} events saved`);

        return {
          success: true,
          data: {
            savedEvents: insertedEvents.length,
            metadata: {
              year,
              week,
              savedAt: new Date().toISOString(),
            },
          },
        };
      } catch (error) {
        console.error('tRPC zisseki.saveWeekData error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'データの保存に失敗しました',
        });
      }
    }),

  /**
   * 個別イベントを更新するプロシージャ。
   */
  updateEvent: publicProcedure
    .input(z.object({
      eventId: z.string(),
      userId: z.string().min(1, 'ユーザーIDは必須です'),
      event: EventSchema.partial(),
    }))
    .mutation(async ({ input }) => {
      try {
        const { eventId, userId, event } = input;

        // サーバーサイドログ出力
        console.log(`🔍 [API] updateEvent: eventId=${eventId}, userId=${userId}, title=${event.title || 'N/A'}`);

        // まずイベントの所有者を確認
        const checkOwnerQuery = `
          SELECT id, employeeNumber FROM events
          WHERE id = ? AND (employeeNumber = ? OR employeeNumber IS NULL OR employeeNumber = '')
        `;
        const ownerCheck = await getAllRecords('events', checkOwnerQuery, [eventId, userId]);

        if (!ownerCheck.success || !ownerCheck.data || ownerCheck.data.length === 0) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'このイベントを更新する権限がありません',
          });
        }

        // eventsテーブルのカラム名に合わせて変換
        const updateData = {
          title: event.title,
          description: event.description,
          project: event.project,
          category: event.category,
          startDateTime: event.startDateTime,
          endDateTime: event.endDateTime,
          top: event.top,
          height: event.height,
          color: event.color,
          unsaved: event.unsaved ? 1 : 0,
          employeeNumber: event.employeeNumber,
          activityCode: event.activityCode,
          purposeProject: event.purposeProject,
          departmentCode: event.departmentCode,
          equipmentNumber: event.equipmentNumber,
          equipmentName: event.equipmentName,
          equipment_id: event.equipment_id,
          equipment_Name: event.equipment_Name,
          itemName: event.itemName,
          planningSubType: event.planningSubType,
          estimateSubType: event.estimateSubType,
          designSubType: event.designSubType,
          meetingType: event.meetingType,
          travelType: event.travelType,
          stakeholderType: event.stakeholderType,
          documentType: event.documentType,
          documentMaterial: event.documentMaterial,
          subTabType: event.subTabType,
          activityColumn: event.activityColumn,
          indirectType: event.indirectType,
          indirectDetailType: event.indirectDetailType,
          selectedTab: event.selectedTab,
          selectedProjectSubTab: event.selectedProjectSubTab,
          selectedIndirectSubTab: event.selectedIndirectSubTab,
          selectedIndirectDetailTab: event.selectedIndirectDetailTab,
          selectedOtherSubTab: event.selectedOtherSubTab,
          status: event.status,
          updatedAt: new Date().toISOString(),
        };

        const result = await updateDataById('events', eventId, updateData);

        if (!result.success) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: result.error || 'イベントが見つかりません',
          });
        }

        // レスポンスログ出力
        console.log(`✅ [API] updateEvent success: eventId=${eventId}`);

        return {
          success: true,
          data: result.data,
        };
      } catch (error) {
        console.error('tRPC zisseki.updateEvent error:', error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'イベントの更新に失敗しました',
        });
      }
    }),

  /**
   * 個別イベントを削除するプロシージャ。
   */
  deleteEvent: publicProcedure
    .input(z.object({
      eventId: z.string(),
      userId: z.string().min(1, 'ユーザーIDは必須です'),
    }))
    .mutation(async ({ input }) => {
      try {
        const { eventId, userId } = input;

        // サーバーサイドログ出力
        console.log(`🔍 [API] deleteEvent: eventId=${eventId}, userId=${userId}`);

        // まずイベントの所有者を確認
        const checkOwnerQuery = `
          SELECT id, employeeNumber FROM events
          WHERE id = ? AND (employeeNumber = ? OR employeeNumber IS NULL OR employeeNumber = '')
        `;
        const ownerCheck = await getAllRecords('events', checkOwnerQuery, [eventId, userId]);

        if (!ownerCheck.success || !ownerCheck.data || ownerCheck.data.length === 0) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'このイベントを削除する権限がありません',
          });
        }

        // 実際にレコードを削除（deleted_atカラムが存在しないため）
        const result = await getAllRecords('events', 'DELETE FROM events WHERE id = ?', [eventId]);

        if (!result.success) {
          const errorMessage = typeof result.error === 'string' 
            ? result.error 
            : result.error?.message || 'イベントが見つかりません';
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: errorMessage,
          });
        }

        // レスポンスログ出力
        console.log(`✅ [API] deleteEvent success: eventId=${eventId}`);

        return {
          success: true,
          data: null,
        };
      } catch (error) {
        console.error('tRPC zisseki.deleteEvent error:', error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'イベントの削除に失敗しました',
        });
      }
    }),

  /**
   * ワークタイムデータを取得するプロシージャ（現在は空配列を返す）。
   */
  getWorkTimes: publicProcedure
    .input(WorkTimeParamsSchema)
    .query(({ input }) => {
      try {
        // サーバーサイドログ出力
        console.log(`🔍 [API] getWorkTimes: year=${input.year}, week=${input.week}, userId=${input.userId}`);

        // 現在は空配列を返す（後で実装）
        const workTimes: WorkTimeData[] = [];

        // レスポンスログ出力
        console.log(`✅ [API] getWorkTimes success: ${workTimes.length} worktimes found`);

        return {
          success: true,
          data: workTimes,
        };
      } catch (error) {
        console.error('tRPC zisseki.getWorkTimes error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'ワークタイムデータの取得に失敗しました',
        });
      }
    }),

  /**
   * 指定された年・月の実績データを取得するプロシージャ。
   */
  getMonthData: publicProcedure
    .input(MonthParamsSchema)
    .query(async ({ input }) => {
      try {
        // サーバーサイドログ出力
        console.log(`🔍 [API] getMonthData: year=${input.year}, month=${input.month}, userId=${input.userId}`);

        // eventsテーブルから該当月のデータを取得
        const startOfMonth = new Date(input.year, input.month - 1, 1);
        const endOfMonth = new Date(input.year, input.month, 0, 23, 59, 59, 999);

        const query = `
          SELECT
            id,
            title,
            description,
            project,
            startDateTime,
            endDateTime,
            top,
            height,
            color,
            unsaved,
            category,
            employeeNumber,
            activityCode,
            purposeProject,
            departmentCode,
            equipmentNumber,
            equipmentName,
            equipment_id,
            equipment_Name,
            itemName,
            planningSubType,
            estimateSubType,
            designSubType,
            meetingType,
            travelType,
            stakeholderType,
            documentType,
            documentMaterial,
            subTabType,
            activityColumn,
            indirectType,
            indirectDetailType,
            selectedTab,
            selectedProjectSubTab,
            selectedIndirectSubTab,
            selectedIndirectDetailTab,
            selectedOtherSubTab,
            status,
            createdAt,
            updatedAt
          FROM events
          WHERE startDateTime >= ?
            AND startDateTime <= ?
            AND (employeeNumber = ? OR employeeNumber IS NULL OR employeeNumber = '')
          ORDER BY startDateTime ASC
        `;

        const result = await getAllRecords<EventRecord>(
          'events',
          query,
          [startOfMonth.toISOString(), endOfMonth.toISOString(), input.userId]
        );

        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: result.error?.message || 'データの取得に失敗しました',
          });
        }

        // 取得したデータをTimeGridEvent形式に変換（createdAtとupdatedAtを含む）
        const events: (TimeGridEvent & { createdAt: string; updatedAt: string })[] = (result.data || []).map((event: EventRecord) => ({
          id: event.id,
          title: event.title,
          description: event.description || '',
          project: event.project || '',
          startDateTime: event.startDateTime,
          endDateTime: event.endDateTime,
          activityCode: event.activityCode || '',
          top: event.top || 0,
          height: event.height || 64,
          color: event.color || '#3788d8',
          unsaved: Boolean(event.unsaved),
          category: event.category || '',
          employeeNumber: event.employeeNumber || '',
          // 追加のプロパティ
          equipmentNumber: event.equipmentNumber || '',
          equipmentName: event.equipmentName || '',
          equipment_id: event.equipment_id || '',
          equipment_Name: event.equipment_Name || '',
          itemName: event.itemName || '',
          purposeProject: event.purposeProject || '',
          departmentCode: event.departmentCode || '',
          planningSubType: event.planningSubType || '',
          estimateSubType: event.estimateSubType || '',
          designSubType: event.designSubType || '',
          meetingType: event.meetingType || '',
          travelType: event.travelType || '',
          stakeholderType: event.stakeholderType || '',
          documentType: event.documentType || '',
          documentMaterial: event.documentMaterial || '',
          subTabType: event.subTabType || '',
          activityColumn: event.activityColumn || '',
          indirectType: event.indirectType || '',
          indirectDetailType: event.indirectDetailType || '',
          selectedTab: event.selectedTab || '',
          selectedProjectSubTab: event.selectedProjectSubTab || '',
          selectedIndirectSubTab: event.selectedIndirectSubTab || '',
          selectedIndirectDetailTab: event.selectedIndirectDetailTab || '',
          selectedOtherSubTab: event.selectedOtherSubTab || '',
          status: event.status || '',
          createdAt: event.createdAt,
          updatedAt: event.updatedAt,
        }));

        // レスポンスログ出力
        console.log(`✅ [API] getMonthData success: ${events.length} events found`);

        return {
          success: true,
          data: {
            events,
            metadata: {
              year: input.year,
              month: input.month,
              lastModified: new Date().toISOString(),
              totalEvents: events.length,
            },
          },
        };
      } catch (error) {
        console.error('tRPC zisseki.getMonthData error:', error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'データの取得に失敗しました',
        });
      }
    }),
});
