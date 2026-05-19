export function parseTimeToMinutes(value: string): number | null {
  const match = value.match(/^(\d{2}):(\d{2})$/);
  if (!match) return null;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;
  return hour * 60 + minute;
}

export function formatHourToTime(hour: number): string {
  return `${String(hour).padStart(2, "0")}:00`;
}

export function getSlotFallbackEndTime(hour: number, durationMin: number): string {
  const slotDurationHour = durationMin > 0 ? durationMin / 60 : 1;
  const fallbackEndHour = Math.min(hour + Math.max(1, Math.ceil(slotDurationHour)), 23);
  return formatHourToTime(fallbackEndHour);
}
