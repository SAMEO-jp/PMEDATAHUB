// Simple test for the date utility functions
const { getYearAndWeek, getCurrentYearWeekString, formatYearWeek } = require('./src/utils/dateUtils.ts');

console.log('=== Date Utility Tests ===');

// Test current date
const current = getCurrentYearWeekString();
console.log('Current year and week:', current);

// Test specific dates
const testDates = [
  new Date('2025-01-01'), // New Year's Day
  new Date('2025-01-06'), // First Monday of the year
  new Date('2025-08-28'), // Today's date
  new Date('2025-12-31'), // End of year
];

testDates.forEach(date => {
  const { year, week } = getYearAndWeek(date);
  const formatted = formatYearWeek(year, week);
  console.log(`${date.toISOString().split('T')[0]} -> ${formatted}`);
});

console.log('=== Tests Complete ===');