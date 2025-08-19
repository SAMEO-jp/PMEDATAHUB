
import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { getEmployees, getCurrentUser, getWeekDataFromStorage, saveWeekDataToStorage, setWeekDataChanged } from '../imports';
import { formatEventForClient } from '../utils/formatEventForClientUtils';
import { EventItem } from '../types/event';

export const useWeekData = () => {
  const params = useParams();
  const year = Number.parseInt(params.year as string) || new Date().getFullYear();
  const week = Number.parseInt(params.week as string) || new Date().getWeek();

  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<{ employeeNumber: string; name: string }>({
    employeeNumber: "999999",
    name: "仮ログイン",
  });
  const [apiError, setApiError] = useState<string | null>(null);

  const loadWeekData = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    setApiError(null);
    try {
      const empData = await getEmployees();
      setEmployees(empData);

      const user = await getCurrentUser();
      setCurrentUser(user);

      const cachedProjects = localStorage.getItem('currentUser_projects');
      if (cachedProjects) {
        setProjects(JSON.parse(cachedProjects));
      }

      const apiUrl = `/api/achievements/week/${year}/${week}`;
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`API応答エラー: ${response.status}, ${errorText}`);
        }
        const data = await response.json();
        if (!data.success) {
          throw new Error(data.message || "データの取得に失敗しました");
        }
        const formattedEvents = data.data.map((event: EventItem) => ({
          ...formatEventForClient(event),
          top: new Date(event.startDateTime).getHours() * 64 + (new Date(event.startDateTime).getMinutes() / 60) * 64,
        }));
        setEvents(formattedEvents);
        saveWeekDataToStorage(year, week, formattedEvents);
        setWeekDataChanged(year, week, false);
      } catch (apiError) {
        setApiError(String(apiError));
        const cachedData = getWeekDataFromStorage(year, week);
        if (cachedData) {
          setEvents(cachedData);
        } else {
          setEvents([]);
        }
      }
    } catch (error: unknown) {
      alert(`データ取得エラー: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  }, [year, week]);

  useEffect(() => {
    loadWeekData();
  }, [loadWeekData]);

  return {
    loading,
    apiError,
    events,
    setEvents,
    employees,
    projects,
    currentUser,
    loadWeekData,
    year,
    week
  };
};
