import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ParsedEvent } from "../../models/event.model";

@Component({
  selector: "app-event-item",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="event-item"
      [class.expanded]="isExpanded"
      [style.background-color]="
        event.matchedBand ? event.matchedBand.color : 'transparent'
      "
    >
      <!-- Collapsed View -->
      <button class="event-header" (click)="toggleExpand()">
        <div class="header-content">
          <span class="event-date">{{
            event.startTime | date: "MMM d, y"
          }}</span>
          <span class="event-title">{{ event.title }}</span>
        </div>
        <div *ngIf="event.matchedPatterns.length > 0" class="header-badges">
          <span
            *ngFor="let badge of event.matchedPatterns"
            class="header-badge"
            [style.background-color]="badge.color"
            [style.color]="getTextColor(badge.color)"
            title="{{ badge.patterns.join(', ') }}"
          >
            {{ badge.text }}
          </span>
        </div>
      </button>

      <!-- Expanded View -->
      <div *ngIf="isExpanded" class="event-details">
        <div class="details-section">
          <div class="detail-row">
            <span class="detail-label">Date</span>
            <span class="detail-value">{{
              event.startTime | date: "EEEE, MMMM d, y"
            }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Time</span>
            <span class="detail-value">
              {{ event.startTime | date: "HH:mm" }} –
              {{ event.endTime | date: "HH:mm" }}
            </span>
          </div>
          <div *ngIf="event.venue" class="detail-row">
            <span class="detail-label">Venue</span>
            <span class="detail-value">{{ event.venue }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Status</span>
            <span class="detail-value">{{
              event.confirmed ? "Confirmed" : "Pending"
            }}</span>
          </div>
        </div>

        <div *ngIf="event.description" class="details-section">
          <p class="description">{{ event.description }}</p>
        </div>

        <div *ngIf="event.matchedPatterns.length > 0" class="details-section">
          <div class="patterns-label">Matched Patterns</div>
          <div class="pattern-list">
            <span
              *ngFor="let badge of event.matchedPatterns"
              class="pattern-tag"
              [style.background-color]="badge.color"
              [style.color]="getTextColor(badge.color)"
            >
              {{ badge.text }}
            </span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .event-item {
        border: none;
        border-bottom: 1px solid var(--color-border);
        border-radius: 0;
        background-color: transparent;
        overflow: hidden;
        transition: all 0.2s ease;
      }

      .event-item:last-child {
        border-bottom: none;
      }

      .event-item:hover {
        background-color: var(--color-bg);
      }

      .event-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--spacing-xs);
        width: 100%;
        padding: var(--spacing-xs) var(--spacing-sm);
        background: none;
        border: none;
        cursor: pointer;
        text-align: left;
        font-size: var(--font-size-sm);
        font-family: inherit;
        transition: all 0.2s ease;
      }

      .event-header:hover {
        background-color: var(--color-bg);
      }

      .header-content {
        flex: 1;
        display: flex;
        align-items: center;
        gap: var(--spacing-xs);
        min-width: 0;
      }

      .event-date {
        font-size: 0.75rem;
        color: var(--color-text-secondary);
        font-weight: var(--font-weight-semibold);
        white-space: nowrap;
        min-width: 50px;
      }

      .event-title {
        font-weight: var(--font-weight-medium);
        color: var(--color-text-primary);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 0.9rem;
      }

      .header-badges {
        display: flex;
        flex-wrap: wrap;
        gap: 0.2rem;
        align-items: center;
        justify-content: flex-end;
        flex-shrink: 0;
      }

      .header-badge {
        font-weight: var(--font-weight-medium);
        font-size: 0.65rem;
        padding: 0.15rem 0.4rem;
        border-radius: var(--radius-sm);
        display: inline-block;
        white-space: nowrap;
      }

      .expand-icon {
        color: var(--color-text-secondary);
        font-size: 0.75rem;
        white-space: nowrap;
        transition: transform 0.2s ease;
      }

      .event-item.expanded .expand-icon {
        transform: scaleY(-1);
      }

      .event-details {
        padding: var(--spacing-sm);
        padding-top: var(--spacing-xs);
        border-top: 1px solid var(--color-border);
        animation: slideDown 0.2s ease;
      }

      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateY(-8px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .details-section {
        margin-bottom: var(--spacing-sm);
      }

      .details-section:last-child {
        margin-bottom: 0;
      }

      .detail-row {
        display: grid;
        grid-template-columns: 70px 1fr;
        gap: var(--spacing-xs);
        margin-bottom: var(--spacing-xs);
      }

      .detail-label {
        font-size: 0.7rem;
        color: var(--color-text-secondary);
        font-weight: var(--font-weight-semibold);
        text-transform: uppercase;
        letter-spacing: 0.5px;
        opacity: 0.7;
      }

      .detail-value {
        font-size: 0.85rem;
        color: var(--color-text-primary);
      }

      .description {
        font-size: 0.85rem;
        color: var(--color-text-secondary);
        line-height: 1.5;
        margin: 0;
      }

      .patterns-label {
        font-size: 0.75rem;
        color: var(--color-text-secondary);
        font-weight: var(--font-weight-semibold);
        text-transform: uppercase;
        letter-spacing: 0.5px;
        opacity: 0.7;
        margin-bottom: var(--spacing-sm);
      }

      .pattern-list {
        display: flex;
        gap: var(--spacing-sm);
        flex-wrap: wrap;
      }

      .pattern-tag {
        display: inline-block;
        padding: 0.3rem 0.6rem;
        background-color: var(--color-bg);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-sm);
        font-size: 0.75rem;
        font-weight: var(--font-weight-medium);
        color: var(--color-text-primary);
        font-family: monospace;
      }

      @media (max-width: 768px) {
        .header-content {
          flex-direction: column;
          align-items: flex-start;
          gap: var(--spacing-sm);
        }

        .detail-row {
          grid-template-columns: 1fr;
          gap: var(--spacing-xs);
        }

        .detail-label {
          font-size: 0.7rem;
        }
      }
    `,
  ],
})
export class EventItemComponent {
  @Input() event!: ParsedEvent;
  isExpanded = false;

  toggleExpand(): void {
    this.isExpanded = !this.isExpanded;
  }

  getTextColor(backgroundColor: string): string {
    // Simple contrast calculation to determine if text should be dark or light
    const hex = backgroundColor.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 155 ? "#000000" : "#ffffff";
  }
}
