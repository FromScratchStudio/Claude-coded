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
  const startMin = Math.max(0, Math.min(23 * 60 + 59, hour * 60));
  const endMin = Math.min(23 * 60 + 59, startMin + Math.max(1, durationMin));
  const hh = Math.floor(endMin / 60);
  const mm = endMin % 60;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}
