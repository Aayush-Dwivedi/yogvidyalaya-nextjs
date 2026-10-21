/**
 * Helpers for time formatting, schedule calculation, and duration synchronization
 */

/**
 * Parses any time string ("09:00 AM", "9:00 AM", "09:00", "17:30", "5:30 PM")
 * into minutes from midnight (0 to 1439).
 */
export function parseTimeToMinutes(timeStr: string): number | null {
  if (!timeStr) return null;
  const cleaned = timeStr.trim().toUpperCase();

  // Handle standard 12-hour format: "9:00 AM", "09:30 PM"
  const match12 = cleaned.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/);
  if (match12) {
    let hours = parseInt(match12[1], 10);
    const minutes = parseInt(match12[2], 10);
    const period = match12[3];

    if (period === 'PM' && hours < 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    return hours * 60 + minutes;
  }

  // Handle standard 24-hour format: "09:00", "17:30", "9:30"
  const match24 = cleaned.match(/^(\d{1,2}):(\d{2})$/);
  if (match24) {
    const hours = parseInt(match24[1], 10);
    const minutes = parseInt(match24[2], 10);
    if (hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60) {
      return hours * 60 + minutes;
    }
  }

  return null;
}

/**
 * Converts minutes from midnight into 12-hour formatted string: "09:00 AM"
 */
export function minutesToTime12(totalMinutes: number): string {
  const normalized = ((totalMinutes % 1440) + 1440) % 1440;
  let hours = Math.floor(normalized / 60);
  const minutes = normalized % 60;
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;
}

/**
 * Converts minutes from midnight or 12-hour string into 24-hour formatted string: "09:00"
 */
export function time12ToTime24(time12: string): string {
  const mins = parseTimeToMinutes(time12);
  if (mins === null) return '09:00';
  const hours = Math.floor(mins / 60);
  const minutes = mins % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

/**
 * Converts 24-hour string "09:00" to 12-hour string "09:00 AM"
 */
export function time24ToTime12(time24: string): string {
  const mins = parseTimeToMinutes(time24);
  if (mins === null) return time24;
  return minutesToTime12(mins);
}

/**
 * Calculates human-readable duration between start and end time.
 * e.g. "09:00 AM" and "11:30 AM" -> "2.5 Hours"
 */
export function calculateTimeDuration(startTimeStr: string, endTimeStr: string): string {
  const startMins = parseTimeToMinutes(startTimeStr);
  const endMins = parseTimeToMinutes(endTimeStr);
  if (startMins === null || endMins === null) return '';

  let diff = endMins - startMins;
  if (diff <= 0) diff += 1440; // overnight/next day wrap

  const hours = Math.floor(diff / 60);
  const mins = diff % 60;

  if (hours === 0 && mins > 0) {
    return `${mins} Mins`;
  }
  if (mins === 0) {
    return `${hours} ${hours === 1 ? 'Hour' : 'Hours'}`;
  }
  if (mins === 30) {
    return `${hours + 0.5} Hours`;
  }
  if (mins === 15) {
    return `${hours + 0.25} Hours`;
  }
  if (mins === 45) {
    return `${hours + 0.75} Hours`;
  }
  return `${hours} hr ${mins} min`;
}

/**
 * Given a start time and duration in minutes, returns the calculated end time in 12-hour format
 */
export function addMinutesToTime(startTimeStr: string, durationMinutes: number): string {
  const startMins = parseTimeToMinutes(startTimeStr) ?? 9 * 60;
  return minutesToTime12(startMins + durationMinutes);
}
