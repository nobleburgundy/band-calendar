import { Component, Input, Output, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-search-patterns",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="patterns-list">
      <div *ngIf="!patterns || patterns.length === 0" class="empty-message">
        No patterns active
      </div>

      <div *ngFor="let pattern of patterns" class="pattern-item">
        <span class="pattern-text">{{ pattern }}</span>
        <button
          class="remove-btn"
          (click)="onRemovePattern(pattern)"
          title="Remove pattern"
        >
          ×
        </button>
      </div>

      <div class="add-section">
        <button class="add-btn" (click)="showAddForm = !showAddForm">
          + Add Pattern
        </button>

        <div *ngIf="showAddForm" class="add-form">
          <input
            type="text"
            class="form-input"
            placeholder="e.g., (C) White Squirrel"
            [(ngModel)]="newPattern"
            (keyup.enter)="submitAddPattern()"
          />
          <small class="form-hint">Match text in event titles</small>
          <div class="form-actions">
            <button
              class="btn-submit"
              (click)="submitAddPattern()"
              [disabled]="!newPattern"
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
      .patterns-list {
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
        animation: slideIn 0.2s ease;
      }

      .pattern-item:last-of-type {
        border-bottom: none;
      }

      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateY(-8px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .pattern-text {
        font-weight: var(--font-weight-medium);
        color: var(--color-text-primary);
        font-size: var(--font-size-sm);
        font-family: monospace;
        background-color: var(--color-bg);
        padding: 0.25rem 0.5rem;
        border-radius: var(--radius-sm);
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

      .form-hint {
        font-size: 0.75rem;
        color: var(--color-text-secondary);
        opacity: 0.7;
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
export class SearchPatternsComponent {
  @Input() patterns: string[] | null = [];
  @Output() addPattern = new EventEmitter<string>();
  @Output() removePattern = new EventEmitter<string>();

  showAddForm = false;
  newPattern = "";

  onRemovePattern(pattern: string): void {
    this.removePattern.emit(pattern);
  }

  submitAddPattern(): void {
    if (this.newPattern.trim()) {
      this.addPattern.emit(this.newPattern.trim());
      this.newPattern = "";
      this.showAddForm = false;
    }
  }
}
