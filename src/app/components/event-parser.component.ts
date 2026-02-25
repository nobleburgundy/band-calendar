import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { EventService } from "../services/event.service";
import {
  ParsedEvent,
  Calendar,
  PatternBadge,
  Band,
} from "../models/event.model";
import { PatternListComponent } from "./pattern-list/pattern-list.component";
import { BandListComponent } from "./band-list/band-list.component";
import { EventItemComponent } from "./event-item/event-item.component";
import { SettingsComponent } from "./settings/settings.component";

@Component({
  selector: "app-event-parser",
  standalone: true,
  imports: [
    CommonModule,
    PatternListComponent,
    BandListComponent,
    EventItemComponent,
    SettingsComponent,
  ],
  template: `
    <div
      class="parser-container"
      [class.monospace-font]="fontFamily === 'monospace'"
      [class.courier-font]="fontFamily === 'courier'"
      [class.font-xs]="fontSize === 'xs'"
      [class.font-sm]="fontSize === 'sm'"
      [class.font-lg]="fontSize === 'lg'"
    >
      <header class="parser-header">
        <div class="header-content">
          <h1 class="app-title">Calendar Events</h1>
          <p class="app-subtitle">Filter by pattern and visibility</p>
        </div>
        <div class="header-buttons">
          <button
            class="nav-btn"
            (click)="toggleViewMode()"
            title="Past Events"
            [class.active]="(viewMode$ | async) === 'past'"
          >
            <i class="fas fa-calendar-alt"></i>
          </button>
          <button
            class="settings-btn"
            (click)="openSettings()"
            title="Settings"
          >
            <i class="fas fa-cog"></i>
          </button>
        </div>
      </header>

      <div class="parser-content">
        <!-- Sidebar: Patterns and Bands -->
        <aside class="sidebar">
          <section class="sidebar-section">
            <h2 class="section-title">Patterns</h2>
            <app-pattern-list
              [patterns]="patterns$ | async"
              [visiblePatterns]="visiblePatterns$ | async"
              (togglePattern)="onTogglePattern($event)"
              (removePattern)="onRemovePattern($event)"
            ></app-pattern-list>
          </section>

          <section class="sidebar-section">
            <h2 class="section-title">Bands</h2>
            <app-band-list
              [bands]="bands$ | async"
              [visibleBands]="visibleBands$ | async"
              (toggleBand)="onToggleBand($event)"
              (removeBand)="onRemoveBand($event)"
            ></app-band-list>
          </section>
        </aside>

        <!-- Main Content: Event List -->
        <main class="main-content">
          <div class="events-header">
            <h2 class="events-title">
              {{
                (viewMode$ | async) === "past"
                  ? "Past Events"
                  : "Upcoming Events"
              }}
            </h2>
            <span class="event-count">{{
              (filteredEvents$ | async)?.length || 0
            }}</span>
          </div>

          <div class="events-container">
            <div
              *ngIf="(filteredEvents$ | async)?.length === 0"
              class="empty-state"
            >
              <div class="empty-state-icon">○</div>
              <p>No events match your search patterns</p>
            </div>

            <div
              *ngIf="(filteredEvents$ | async)?.length ?? 0 > 0"
              class="event-list"
            >
              <app-event-item
                *ngFor="let event of filteredEvents$ | async"
                [event]="event"
              ></app-event-item>
            </div>
          </div>
        </main>
      </div>

      <!-- Settings Panel -->
      <app-settings
        [isOpen]="showSettings"
        [patterns]="patterns$ | async"
        [bands]="bands$ | async"
        [calendars]="calendars$ | async"
        [fontFamily]="fontFamily"
        [fontSize]="fontSize"
        (close)="closeSettings()"
        (fontChange)="onFontChange($event)"
        (fontSizeChange)="onFontSizeChange($event)"
        (addPattern)="onAddPattern($event)"
        (updatePattern)="onUpdatePattern($event)"
        (removePattern)="onRemovePattern($event)"
        (addBand)="onAddBand($event)"
        (removeBand)="onRemoveBand($event)"
        (toggleCalendar)="onToggleCalendar($event)"
        (removeCalendar)="onRemoveCalendar($event)"
        (addCalendar)="onAddCalendar($event)"
      ></app-settings>
    </div>
  `,
  styles: [
    `
      .parser-container {
        min-height: 100vh;
        background-color: var(--color-bg);
        display: flex;
        flex-direction: column;
      }

      .parser-header {
        background-color: var(--color-surface);
        border-bottom: 1px solid var(--color-border);
        padding: var(--spacing-xl) var(--spacing-2xl);
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
      }

      .header-content {
        max-width: 1400px;
        margin: 0;
        width: 100%;
      }

      .header-buttons {
        display: flex;
        gap: var(--spacing-md);
        align-items: center;
      }

      .nav-btn,
      .settings-btn {
        background: none;
        border: none;
        cursor: pointer;
        color: var(--color-text-primary);
        padding: var(--spacing-sm);
        margin: calc(var(--spacing-sm) * -1);
        transition: opacity 0.2s ease;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.25rem;
      }

      .nav-btn:hover,
      .settings-btn:hover {
        opacity: 0.7;
      }

      .nav-btn.active {
        opacity: 1;
      }

      .parser-container.monospace-font {
        font-family: "SFMono-Regular", "Menlo", "Monaco", "Consolas", monospace;
      }

      .parser-container.courier-font {
        font-family: "Courier New", Courier, monospace;
      }

      .parser-container.font-xs {
        font-size: 0.75rem;
      }

      .parser-container.font-sm {
        font-size: 0.875rem;
      }

      .parser-container.font-lg {
        font-size: 1.125rem;
      }

      .app-title {
        font-size: 2rem;
        font-weight: var(--font-weight-semibold);
        color: var(--color-text-primary);
        margin-bottom: var(--spacing-sm);
      }

      .app-subtitle {
        font-size: var(--font-size-sm);
        color: var(--color-text-secondary);
        margin-bottom: 0;
      }

      .parser-content {
        flex: 1;
        display: grid;
        grid-template-columns: 280px 1fr;
        gap: var(--spacing-2xl);
        padding: var(--spacing-2xl);
        max-width: 1400px;
        margin: 0 auto;
        width: 100%;
      }

      .sidebar {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-2xl);
      }

      .sidebar-section {
        background-color: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        padding: var(--spacing-lg);
      }

      .section-title {
        font-size: var(--font-size-base);
        font-weight: var(--font-weight-semibold);
        color: var(--color-text-primary);
        margin-bottom: var(--spacing-lg);
        padding-bottom: var(--spacing-md);
        border-bottom: 1px solid var(--color-border);
      }

      .main-content {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-lg);
      }

      .events-header {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        padding-bottom: var(--spacing-md);
        border-bottom: 1px solid var(--color-border);
      }

      .events-title {
        font-size: var(--font-size-lg);
        font-weight: var(--font-weight-semibold);
        color: var(--color-text-primary);
        margin-bottom: 0;
      }

      .event-count {
        font-size: var(--font-size-sm);
        color: var(--color-text-secondary);
        font-weight: var(--font-weight-medium);
      }

      .events-container {
        background-color: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        padding: var(--spacing-sm);
      }

      .event-list {
        display: flex;
        flex-direction: column;
        gap: 0;
      }

      .empty-state {
        text-align: center;
        padding: var(--spacing-2xl);
        color: var(--color-text-secondary);
      }

      .empty-state-icon {
        font-size: 2.5rem;
        margin-bottom: var(--spacing-md);
        opacity: 0.5;
      }

      .empty-state p {
        margin-bottom: 0;
      }

      @media (max-width: 1024px) {
        .parser-content {
          grid-template-columns: 1fr;
          gap: var(--spacing-lg);
          padding: var(--spacing-lg);
        }

        .sidebar {
          gap: var(--spacing-lg);
        }
      }

      @media (max-width: 640px) {
        .parser-header {
          padding: var(--spacing-lg);
        }

        .app-title {
          font-size: 1.5rem;
        }

        .parser-content {
          padding: var(--spacing-md);
          gap: var(--spacing-md);
        }

        .sidebar-section {
          padding: var(--spacing-md);
        }
      }
    `,
  ],
})
export class EventParserComponent implements OnInit {
  calendars$ = this.eventService.getCalendars();
  filteredEvents$ = this.eventService.getFilteredEvents();
  patterns$ = this.eventService.getPatternBadges();
  visiblePatterns$ = this.eventService.getVisiblePatterns();
  viewMode$ = this.eventService.getViewMode();
  bands$ = this.eventService.getBands();
  visibleBands$ = this.eventService.getVisibleBands();

  showSettings = false;
  fontFamily: "default" | "monospace" | "courier" = "monospace";
  fontSize: "xs" | "sm" | "base" | "lg" = "base";

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    // Component initialization
  }

  openSettings(): void {
    this.showSettings = true;
  }

  closeSettings(): void {
    this.showSettings = false;
  }

  onFontChange(fontFamily: "default" | "monospace" | "courier"): void {
    this.fontFamily = fontFamily;
  }

  onFontSizeChange(fontSize: "xs" | "sm" | "base" | "lg"): void {
    this.fontSize = fontSize;
  }

  toggleViewMode(): void {
    const currentMode = this.eventService["viewMode$"].value;
    const newMode = currentMode === "upcoming" ? "past" : "upcoming";
    this.eventService.setViewMode(newMode);
  }

  onToggleCalendar(calendarId: string): void {
    this.eventService.toggleCalendarVisibility(calendarId);
  }

  onRemoveCalendar(calendarId: string): void {
    this.eventService.removeCalendar(calendarId);
  }

  onAddCalendar(data: { id: string; name: string }): void {
    this.eventService.addCalendar(data.id, data.name);
  }

  onTogglePattern(index: number): void {
    this.eventService.togglePatternVisibility(index);
  }

  onAddPattern(badge: PatternBadge): void {
    this.eventService.addPatternBadge(badge);
  }

  onUpdatePattern(event: { index: number; badge: PatternBadge }): void {
    this.eventService.updatePatternBadge(event.index, event.badge);
  }

  onRemovePattern(index: number): void {
    this.eventService.removePatternBadge(index);
  }

  onAddBand(band: Band): void {
    this.eventService.addBand(band);
  }

  onRemoveBand(index: number): void {
    this.eventService.removeBand(index);
  }

  onToggleBand(index: number): void {
    this.eventService.toggleBandVisibility(index);
  }
}
