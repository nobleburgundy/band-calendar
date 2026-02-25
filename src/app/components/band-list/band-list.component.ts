import { Component, Input, Output, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Band } from "../../models/event.model";

@Component({
  selector: "app-band-list",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="band-list">
      <div *ngIf="!bands || bands.length === 0" class="empty-message">
        No bands
      </div>

      <div *ngFor="let band of bands; let i = index" class="band-item">
        <div class="band-control">
          <input
            type="checkbox"
            [id]="'band-' + i"
            class="band-checkbox"
            [checked]="isVisible(band, i)"
            (change)="onToggle(band, i)"
          />
          <label [for]="'band-' + i" class="band-label">
            <div class="band-color" [style.background-color]="band.color"></div>
            <span class="band-texts">{{ band.searchTexts.join(", ") }}</span>
          </label>
        </div>
        <button class="remove-btn" (click)="onRemove(i)" title="Remove band">
          ×
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .band-list {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-sm);
      }

      .empty-message {
        font-size: var(--font-size-sm);
        color: var(--color-text-secondary);
        padding: var(--spacing-md);
        text-align: center;
      }

      .band-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--spacing-sm) var(--spacing-md);
        border-radius: var(--radius-md);
        border: 1px solid var(--color-border);
        transition: all 0.2s;
      }

      .band-item:hover {
        background-color: var(--color-bg);
        border-color: var(--color-accent);
      }

      .band-control {
        display: flex;
        align-items: center;
        gap: var(--spacing-md);
        flex: 1;
        cursor: pointer;
      }

      .band-checkbox {
        width: 1.25rem;
        height: 1.25rem;
        cursor: pointer;
        accent-color: var(--color-accent);
      }

      .band-label {
        display: flex;
        align-items: center;
        gap: var(--spacing-md);
        flex: 1;
        cursor: pointer;
      }

      .band-color {
        width: 1.5rem;
        height: 1.5rem;
        border-radius: var(--radius-sm);
        border: 1px solid var(--color-border);
        flex-shrink: 0;
      }

      .band-texts {
        font-size: var(--font-size-sm);
        color: var(--color-text-secondary);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .remove-btn {
        background: none;
        border: none;
        color: var(--color-text-secondary);
        font-size: 1.5rem;
        padding: 0;
        width: 1.5rem;
        height: 1.5rem;
        opacity: 0.6;
        transition: opacity 0.2s;
        cursor: pointer;
        flex-shrink: 0;
      }

      .remove-btn:hover {
        opacity: 1;
        color: var(--color-accent);
      }
    `,
  ],
})
export class BandListComponent {
  @Input() bands: Band[] | null = [];
  @Input() visibleBands: number[] | null = [];

  @Output() toggleBand = new EventEmitter<number>();
  @Output() removeBand = new EventEmitter<number>();

  isVisible(band: Band, index: number): boolean {
    return this.visibleBands?.includes(index) ?? false;
  }

  onToggle(band: Band, index: number): void {
    this.toggleBand.emit(index);
  }

  onRemove(index: number): void {
    this.removeBand.emit(index);
  }
}
