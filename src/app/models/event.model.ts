export interface CalendarEvent {
  id: string;
  calendarId: string;
  calendarName: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  confirmed: boolean;
  venue: string | null;
}

export interface Calendar {
  id: string;
  name: string;
  visible: boolean;
  eventCount: number;
}

export interface PatternBadge {
  patterns: string[];
  text: string;
  color: string;
}

export interface Band {
  searchTexts: string[];
  color: string;
}

export interface ParsedEvent extends CalendarEvent {
  matchedPatterns: PatternBadge[];
  matchedBand?: Band;
}
