import { Component, Input, Output, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { PatternBadge } from "../../models/event.model";

@Component({
  selector: "app-pattern-list",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="pattern-list">
      <div *ngIf="!patterns || patterns.length === 0" class="empty-message">
        No patterns available
      </div>

      <div *ngFor="let pattern of patterns; let i = index" class="pattern-item">
        <div class="pattern-checkbox">
          <input
            type="checkbox"
            [id]="'pattern-' + i"
            [checked]="isPatternVisible(i)"
            (change)="onTogglePattern(i)"
          />
          <label [for]="'pattern-' + i">
            <span
              class="pattern-badge-preview"
              [style.background-color]="pattern.color"
              [style.color]="getTextColor(pattern.color)"
            >
              {{ pattern.text }}
            </span>
          </label>
        </div>
        <div class="pattern-meta">
          <span class="pattern-code">{{ pattern.patterns.join(", ") }}</span>
          <button
            class="remove-btn"
            (click)="onRemovePattern(i)"
            title="Remove pattern"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .pattern-list {
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

      .pattern-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--spacing-md);
        border-bottom: 1px solid var(--color-border);
      }

      .pattern-item:last-of-type {
        border-bottom: none;
      }

      .pattern-checkbox {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        flex: 1;
      }

      .pattern-checkbox input[type="checkbox"] {
        width: 1rem;
        height: 1rem;
        cursor: pointer;
        accent-color: var(--color-accent);
      }

      .pattern-checkbox label {
        cursor: pointer;
        user-select: none;
        margin: 0;
      }

      .pattern-badge-preview {
        font-weight: var(--font-weight-medium);
        font-size: 0.75rem;
        padding: 0.25rem 0.6rem;
        border-radius: var(--radius-sm);
        display: inline-block;
        white-space: nowrap;
      }

      .pattern-meta {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
      }

      .pattern-code {
        font-size: 0.75rem;
        color: var(--color-text-secondary);
        font-weight: var(--font-weight-medium);
        font-family: monospace;
        min-width: 2rem;
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
    `,
  ],
})
export class PatternListComponent {
  @Input() patterns: PatternBadge[] | null = [];
  @Input() visiblePatterns: number[] | null = [];
  @Output() togglePattern = new EventEmitter<number>();
  @Output() removePattern = new EventEmitter<number>();

  isPatternVisible(index: number): boolean {
    return this.visiblePatterns?.includes(index) || false;
  }

  onTogglePattern(index: number): void {
    this.togglePattern.emit(index);
  }

  onRemovePattern(index: number): void {
    this.removePattern.emit(index);
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
