import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import {
  CalendarEvent,
  Calendar,
  ParsedEvent,
  PatternBadge,
  Band,
} from "../models/event.model";
import musicCalendarData from "../../assets/music-calendar.json";

@Injectable({
  providedIn: "root",
})
export class EventService {
  private allEvents: CalendarEvent[] = [];
  private calendars$ = new BehaviorSubject<Calendar[]>([]);
  private filteredEvents$ = new BehaviorSubject<ParsedEvent[]>([]);
  private patternBadges$ = new BehaviorSubject<PatternBadge[]>([
    { patterns: ["(c)"], text: "Confirmed", color: "#27ae60" },
    { patterns: ["(h)"], text: "Hold", color: "#e67e22" },
  ]);
  private visiblePatterns$ = new BehaviorSubject<number[]>([0, 1]);
  private bands$ = new BehaviorSubject<Band[]>([]);
  private visibleBands$ = new BehaviorSubject<number[]>([]);
  private viewMode$ = new BehaviorSubject<"upcoming" | "past">("upcoming");

  constructor() {
    this.loadMockData();
  }

  private loadMockData(): void {
    // Load music calendar data from JSON file
    this.allEvents = musicCalendarData as CalendarEvent[];
    this.initializeCalendars();
    this.filterEvents();
  }

  private initializeCalendars(): void {
    const calendarMap = new Map<string, { name: string; count: number }>();

    this.allEvents.forEach((event) => {
      if (!calendarMap.has(event.calendarId)) {
        calendarMap.set(event.calendarId, {
          name: event.calendarName,
          count: 0,
        });
      }
      const cal = calendarMap.get(event.calendarId)!;
      cal.count++;
    });

    const calendars: Calendar[] = Array.from(calendarMap.entries()).map(
      ([id, data]) => ({
        id,
        name: data.name,
        visible: true,
        eventCount: data.count,
      }),
    );

    this.calendars$.next(calendars);
  }

  private filterEvents(): void {
    const visibleCalendars = this.calendars$.value
      .filter((cal) => cal.visible)
      .map((cal) => cal.id);

    const patternBadges = this.patternBadges$.value;
    const visiblePatterns = this.visiblePatterns$.value;
    const viewMode = this.viewMode$.value;
    const bands = this.bands$.value;
    const visibleBands = this.visibleBands$.value;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Filter to only visible pattern badges by index
    const visiblePatternBadges = patternBadges.filter((_, index) =>
      visiblePatterns.includes(index),
    );

    // Get visible band indices
    const visibleBandsList =
      visibleBands.length > 0
        ? bands.filter((_, index) => visibleBands.includes(index))
        : bands;

    let filtered = this.allEvents
      .filter((event) => visibleCalendars.includes(event.calendarId))
      .filter((event) => {
        // Filter by date based on view mode
        const eventDate = new Date(event.startTime);
        const eventDateOnly = new Date(
          eventDate.getFullYear(),
          eventDate.getMonth(),
          eventDate.getDate(),
        );

        if (viewMode === "upcoming") {
          return eventDateOnly >= today; // Today and future
        } else {
          return eventDateOnly < today; // Past only
        }
      })
      .filter((event) =>
        // Match events that contain ANY visible pattern badge
        // Each badge can have multiple comma-separated patterns
        // An event matches if ANY of the patterns in ANY visible badge match its title
        visiblePatternBadges.some((badge) =>
          // Within a badge, check if ANY of its patterns match (OR logic)
          badge.patterns.some((pattern) =>
            event.title.toLowerCase().includes(pattern.toLowerCase()),
          ),
        ),
      )
      .map((event) => {
        const matchedBand =
          visibleBandsList.length > 0
            ? visibleBandsList.find((band) =>
                band.searchTexts.some((text) =>
                  event.title.toLowerCase().includes(text.toLowerCase()),
                ),
              )
            : bands.find((band) =>
                band.searchTexts.some((text) =>
                  event.title.toLowerCase().includes(text.toLowerCase()),
                ),
              );

        return {
          ...event,
          // Find which pattern badges match this event
          // A badge matches if ANY of its patterns are found in the event title
          matchedPatterns: visiblePatternBadges.filter((badge) =>
            badge.patterns.some((pattern) =>
              event.title.toLowerCase().includes(pattern.toLowerCase()),
            ),
          ),
          matchedBand,
        };
      });

    // Sort chronologically
    filtered.sort((a, b) => {
      const dateA = new Date(a.startTime).getTime();
      const dateB = new Date(b.startTime).getTime();

      if (viewMode === "upcoming") {
        return dateA - dateB; // Ascending: earliest first
      } else {
        return dateB - dateA; // Descending: most recent first
      }
    });

    this.filteredEvents$.next(filtered);
  }

  getCalendars(): Observable<Calendar[]> {
    return this.calendars$.asObservable();
  }

  getFilteredEvents(): Observable<ParsedEvent[]> {
    return this.filteredEvents$.asObservable();
  }

  getPatternBadges(): Observable<PatternBadge[]> {
    return this.patternBadges$.asObservable();
  }

  getVisiblePatterns(): Observable<number[]> {
    return this.visiblePatterns$.asObservable();
  }

  getBands(): Observable<Band[]> {
    return this.bands$.asObservable();
  }

  getVisibleBands(): Observable<number[]> {
    return this.visibleBands$.asObservable();
  }

  togglePatternVisibility(index: number): void {
    const patterns = this.visiblePatterns$.value;
    const idx = patterns.indexOf(index);
    if (idx > -1) {
      patterns.splice(idx, 1);
    } else {
      patterns.push(index);
    }
    this.visiblePatterns$.next([...patterns]);
    this.filterEvents();
  }

  getViewMode(): Observable<"upcoming" | "past"> {
    return this.viewMode$.asObservable();
  }

  setViewMode(mode: "upcoming" | "past"): void {
    this.viewMode$.next(mode);
    this.filterEvents();
  }

  toggleCalendarVisibility(calendarId: string): void {
    const calendars = this.calendars$.value;
    const calendar = calendars.find((c) => c.id === calendarId);
    if (calendar) {
      calendar.visible = !calendar.visible;
      this.calendars$.next([...calendars]);
      this.filterEvents();
    }
  }

  updatePatternBadges(badges: PatternBadge[]): void {
    this.patternBadges$.next(badges);
    this.filterEvents();
  }

  addPatternBadge(badge: PatternBadge): void {
    const badges = [...this.patternBadges$.value]; // Create a copy first!
    if (
      badge.patterns &&
      badge.patterns.length > 0 &&
      !badges.some((b) => this.patternsAreEqual(b.patterns, badge.patterns))
    ) {
      badges.push(badge);

      // Add new badge index to visible patterns FIRST, before calling updatePatternBadges
      const visiblePatterns = [...this.visiblePatterns$.value]; // Create a copy first!
      const newIndex = badges.length - 1;
      if (!visiblePatterns.includes(newIndex)) {
        visiblePatterns.push(newIndex);
      }

      // NOW update both at the same time before filtering
      this.patternBadges$.next(badges);
      this.visiblePatterns$.next(visiblePatterns);

      // Finally trigger filter with everything updated
      this.filterEvents();
    }
  }

  private patternsAreEqual(patterns1: string[], patterns2: string[]): boolean {
    if (patterns1.length !== patterns2.length) {
      return false;
    }
    const sorted1 = [...patterns1].map((p) => p.toLowerCase()).sort();
    const sorted2 = [...patterns2].map((p) => p.toLowerCase()).sort();
    return JSON.stringify(sorted1) === JSON.stringify(sorted2);
  }

  updatePatternBadge(index: number, badge: PatternBadge): void {
    const badges = [...this.patternBadges$.value];
    if (badges[index]) {
      badges[index] = badge;
      this.updatePatternBadges(badges);
    }
  }

  removePatternBadge(index: number): void {
    const badges = this.patternBadges$.value.filter((_, i) => i !== index);

    // Remove index from visible patterns and adjust remaining indices FIRST
    const visiblePatterns = this.visiblePatterns$.value
      .filter((i) => i !== index)
      .map((i) => (i > index ? i - 1 : i));

    // Update both at the same time to keep state in sync
    this.patternBadges$.next(badges);
    this.visiblePatterns$.next([...visiblePatterns]);
    this.filterEvents();
  }
  addCalendar(id: string, name: string): void {
    const calendars = this.calendars$.value;
    if (!calendars.some((c) => c.id === id)) {
      calendars.push({
        id,
        name,
        visible: true,
        eventCount: 0,
      });
      this.calendars$.next([...calendars]);
    }
  }

  removeCalendar(calendarId: string): void {
    const calendars = this.calendars$.value.filter((c) => c.id !== calendarId);
    this.calendars$.next(calendars);
    this.filterEvents();
  }

  addBand(band: Band): void {
    const bands = this.bands$.value;
    bands.push(band);
    this.bands$.next([...bands]);
    this.filterEvents();
  }

  removeBand(index: number): void {
    const bands = this.bands$.value.filter((_, i) => i !== index);
    this.bands$.next(bands);
    this.filterEvents();
  }

  updateBands(bands: Band[]): void {
    this.bands$.next(bands);
    this.filterEvents();
  }

  toggleBandVisibility(index: number): void {
    const visibleBands = this.visibleBands$.value;
    const bandIndex = visibleBands.indexOf(index);
    if (bandIndex > -1) {
      visibleBands.splice(bandIndex, 1);
    } else {
      visibleBands.push(index);
    }
    this.visibleBands$.next([...visibleBands]);
    this.filterEvents();
  }
}
