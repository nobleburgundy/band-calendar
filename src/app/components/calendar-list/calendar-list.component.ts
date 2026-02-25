import { Component, Input, Output, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Calendar } from "../../models/event.model";

@Component({
  selector: "app-calendar-list",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="calendar-list">
      <div *ngIf="!calendars || calendars.length === 0" class="empty-message">
        No calendars available
      </div>

      <div *ngFor="let calendar of calendars" class="calendar-item">
        <div class="calendar-checkbox">
          <input
            type="checkbox"
            [id]="'calendar-' + calendar.id"
            [checked]="calendar.visible"
            (change)="onToggleCalendar(calendar.id)"
          />
          <label [for]="'calendar-' + calendar.id">
            <span class="calendar-name">{{ calendar.name }}</span>
          </label>
        </div>
        <div class="calendar-meta">
          <span class="event-count">{{ calendar.eventCount }}</span>
          <button
            class="remove-btn"
            (click)="onRemoveCalendar(calendar.id)"
            title="Remove calendar"
          >
            ×
          </button>
        </div>
      </div>

      <div class="add-section">
        <button class="add-btn" (click)="showAddForm = !showAddForm">
          + Add Calendar
        </button>

        <div *ngIf="showAddForm" class="add-form">
          <input
            type="text"
            class="form-input"
            placeholder="Calendar ID"
            [(ngModel)]="newCalendarId"
          />
          <input
            type="text"
            class="form-input"
            placeholder="Calendar Name"
            [(ngModel)]="newCalendarName"
          />
          <div class="form-actions">
            <button
              class="btn-submit"
              (click)="submitAddCalendar()"
              [disabled]="!newCalendarId || !newCalendarName"
            >
              Add
            </button>
            <button class="btn-cancel" (click)="showAddForm = false">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .calendar-list {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-sm);
      }

      .empty-message {
        font-size: var(--font-size-sm);
        color: var(--color-text-secondary);
        text-align: center;
        padding: var(--spacing-lg) var(--spacing-md);
        opacity: 0.7;
      }

      .calendar-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--spacing-md);
        border-bottom: 1px solid var(--color-border);
      }

      .calendar-item:last-of-type {
        border-bottom: none;
      }

      .calendar-checkbox {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        flex: 1;
      }

      .calendar-checkbox input[type="checkbox"] {
        width: 1rem;
        height: 1rem;
        cursor: pointer;
        accent-color: var(--color-accent);
      }

      .calendar-checkbox label {
        cursor: pointer;
        user-select: none;
        margin: 0;
      }

      .calendar-name {
        font-weight: var(--font-weight-medium);
        color: var(--color-text-primary);
        font-size: var(--font-size-sm);
      }

      .calendar-meta {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
      }

      .event-count {
        font-size: 0.75rem;
        color: var(--color-text-secondary);
        font-weight: var(--font-weight-medium);
        min-width: 1.5rem;
        text-align: right;
      }

      .remove-btn {
        background: none;
        border: none;
        color: var(--color-text-secondary);
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        width: 1.5rem;
        height: 1.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0.6;
        transition: opacity 0.2s;
      }

      .remove-btn:hover {
        opacity: 1;
        color: var(--color-accent);
      }

      .add-section {
        padding-top: var(--spacing-md);
        margin-top: var(--spacing-md);
        border-top: 1px solid var(--color-border);
      }

      .add-btn {
        width: 100%;
        padding: var(--spacing-md);
        background: none;
        border: 1px dashed var(--color-border);
        border-radius: var(--radius-md);
        color: var(--color-text-secondary);
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-medium);
        cursor: pointer;
        transition: all 0.2s;
      }

      .add-btn:hover {
        border-color: var(--color-accent);
        color: var(--color-accent);
        background-color: var(--color-bg);
      }

      .add-form {
        margin-top: var(--spacing-md);
        display: flex;
        flex-direction: column;
        gap: var(--spacing-sm);
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

      .form-input {
        width: 100%;
        padding: var(--spacing-sm) var(--spacing-md);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        font-size: var(--font-size-sm);
        color: var(--color-text-primary);
        transition: border-color 0.2s;
      }

      .form-input:focus {
        outline: none;
        border-color: var(--color-accent);
      }

      .form-input::placeholder {
        color: var(--color-text-secondary);
        opacity: 0.6;
      }

      .form-actions {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--spacing-sm);
      }

      .btn-submit,
      .btn-cancel {
        padding: var(--spacing-sm) var(--spacing-md);
        border: none;
        border-radius: var(--radius-md);
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-medium);
        cursor: pointer;
        transition: all 0.2s;
      }

      .btn-submit {
        background-color: var(--color-accent);
        color: white;
      }

      .btn-submit:hover:not(:disabled) {
        background-color: rgba(0, 0, 0, 0.8);
      }

      .btn-submit:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .btn-cancel {
        background-color: var(--color-border);
        color: var(--color-text-primary);
      }

      .btn-cancel:hover {
        background-color: #d0d0d0;
      }
    `,
  ],
})
export class CalendarListComponent {
  @Input() calendars: Calendar[] | null = [];
  @Output() toggleCalendar = new EventEmitter<string>();
  @Output() removeCalendar = new EventEmitter<string>();
  @Output() addCalendar = new EventEmitter<{ id: string; name: string }>();

  showAddForm = false;
  newCalendarId = "";
  newCalendarName = "";

  onToggleCalendar(calendarId: string): void {
    this.toggleCalendar.emit(calendarId);
  }

  onRemoveCalendar(calendarId: string): void {
    this.removeCalendar.emit(calendarId);
  }

  submitAddCalendar(): void {
    if (this.newCalendarId && this.newCalendarName) {
      this.addCalendar.emit({
        id: this.newCalendarId,
        name: this.newCalendarName,
      });
      this.newCalendarId = "";
      this.newCalendarName = "";
      this.showAddForm = false;
    }
  }
}
