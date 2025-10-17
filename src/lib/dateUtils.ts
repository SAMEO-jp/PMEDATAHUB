export function getWeekNumber(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
}

export function getWeekDates(year: number, week: number): { startDate: Date; endDate: Date } {
  const firstDayOfYear = new Date(year, 0, 1)
  const firstWeekday = firstDayOfYear.getDay()
  const daysToAdd = (week - 1) * 7 - firstWeekday + 1

  const startDate = new Date(year, 0, 1 + daysToAdd)
  const endDate = new Date(startDate)
  endDate.setDate(endDate.getDate() + 6)

  return { startDate, endDate }
}

export function getWeekDaysArray(startDate: Date, endDate: Date): Date[] {
  const days: Date[] = []
  const currentDate = new Date(startDate)

  while (currentDate <= endDate) {
    days.push(new Date(currentDate))
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return days
} 