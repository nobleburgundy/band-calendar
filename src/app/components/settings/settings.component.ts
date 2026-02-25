import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { PatternBadge, Band, Calendar } from "../../models/event.model";
import { CalendarListComponent } from "../calendar-list/calendar-list.component";

@Component({
  selector: "app-settings",
  standalone: true,
  imports: [CommonModule, FormsModule, CalendarListComponent],
  template: `
    <div class="settings-overlay" *ngIf="isOpen" (click)="onClose()">
      <div class="settings-panel" (click)="$event.stopPropagation()">
        <div class="settings-header">
          <h2 class="settings-title">Settings</h2>
          <button class="close-btn" (click)="onClose()" title="Close settings">
            ×
          </button>
        </div>

        <div class="settings-content">
          <!-- Font Selection -->
          <section class="settings-section">
            <h3 class="section-title">Display</h3>

            <div class="setting-item">
              <label class="setting-label">Font Family</label>
              <div class="font-options">
                <button
                  class="font-option"
                  [class.active]="fontFamily === 'default'"
                  (click)="onFontChange('default')"
                >
                  Default
                  <span
                    class="font-preview"
                    style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto;"
                    >Aa</span
                  >
                </button>
                <button
                  class="font-option"
                  [class.active]="fontFamily === 'monospace'"
                  (click)="onFontChange('monospace')"
                >
                  Monospace
                  <span
                    class="font-preview"
                    style="font-family: SFMono-Regular, Menlo, Monaco, Consolas;"
                    >Aa</span
                  >
                </button>
                <button
                  class="font-option"
                  [class.active]="fontFamily === 'courier'"
                  (click)="onFontChange('courier')"
                >
                  Courier New
                  <span
                    class="font-preview"
                    style="font-family: 'Courier New', Courier, monospace;"
                    >Aa</span
                  >
                </button>
              </div>
            </div>

            <div class="setting-item">
              <label class="setting-label">Font Size</label>
              <div class="font-size-options">
                <button
                  class="font-size-option"
                  [class.active]="localFontSize === 'xs'"
                  (click)="onFontSizeChange('xs')"
                  title="Extra Small"
                >
                  XS
                </button>
                <button
                  class="font-size-option"
                  [class.active]="localFontSize === 'sm'"
                  (click)="onFontSizeChange('sm')"
                  title="Small"
                >
                  S
                </button>
                <button
                  class="font-size-option"
                  [class.active]="localFontSize === 'base'"
                  (click)="onFontSizeChange('base')"
                  title="Normal"
                >
                  N
                </button>
                <button
                  class="font-size-option"
                  [class.active]="localFontSize === 'lg'"
                  (click)="onFontSizeChange('lg')"
                  title="Large"
                >
                  L
                </button>
              </div>
            </div>
          </section>

          <!-- Search Patterns -->
          <section class="settings-section">
            <h3 class="section-title">Search Patterns</h3>

            <div class="patterns-list">
              <div
                *ngIf="!patterns || patterns.length === 0"
                class="empty-message"
              >
                No patterns active
              </div>

              <div
                *ngFor="let badge of patterns; let i = index"
                class="pattern-item"
              >
                <div class="pattern-badge-display">
                  <span
                    class="badge-text"
                    [style.background-color]="badge.color"
                    [style.color]="getTextColor(badge.color)"
                  >
                    {{ badge.text }}
                  </span>
                  <span class="pattern-code">{{
                    badge.patterns.join(", ")
                  }}</span>
                </div>
                <div class="pattern-actions">
                  <button
                    class="edit-btn"
                    (click)="startEditPattern(i)"
                    title="Edit pattern"
                  >
                    ✎
                  </button>
                  <button
                    class="remove-btn"
                    (click)="onRemovePattern(i)"
                    title="Remove pattern"
                  >
                    ×
                  </button>
                </div>
              </div>

              <!-- Edit Pattern Form -->
              <div *ngIf="editingPatternIndex !== null" class="edit-form">
                <div class="form-group">
                  <label class="form-label">Patterns (comma-separated)</label>
                  <input
                    type="text"
                    class="form-input"
                    placeholder="e.g., (c), [c], Confirmed"
                    [(ngModel)]="newPatternForm.pattern"
                  />
                </div>

                <div class="form-group">
                  <label class="form-label">Badge Text</label>
                  <input
                    type="text"
                    class="form-input"
                    placeholder="e.g., Confirmed or Venue"
                    [(ngModel)]="newPatternForm.text"
                  />
                </div>

                <div class="form-group">
                  <label class="form-label">Color</label>
                  <input
                    type="color"
                    class="form-color-input"
                    [(ngModel)]="newPatternForm.color"
                  />
                </div>

                <div class="form-actions">
                  <button
                    class="btn-submit"
                    (click)="submitEditPattern()"
                    [disabled]="
                      !newPatternForm.pattern ||
                      !newPatternForm.text ||
                      !newPatternForm.color
                    "
                  >
                    Save
                  </button>
                  <button class="btn-cancel" (click)="cancelEditPattern()">
                    Cancel
                  </button>
                </div>
              </div>

              <div class="add-section">
                <button class="add-btn" (click)="showAddForm = !showAddForm">
                  + Add Pattern
                </button>

                <div *ngIf="showAddForm" class="add-form">
                  <div class="form-group">
                    <label class="form-label">Patterns (comma-separated)</label>
                    <input
                      type="text"
                      class="form-input"
                      placeholder="e.g., (c), [c], Confirmed"
                      [(ngModel)]="newPatternForm.pattern"
                    />
                    <small class="form-hint"
                      >Text to match in event titles. Separate multiple patterns
                      with commas.</small
                    >
                  </div>

                  <div class="form-group">
                    <label class="form-label">Badge Text</label>
                    <input
                      type="text"
                      class="form-input"
                      placeholder="e.g., Confirmed or Venue"
                      [(ngModel)]="newPatternForm.text"
                    />
                    <small class="form-hint">Display text for the badge</small>
                  </div>

                  <div class="form-group">
                    <label class="form-label">Color</label>
                    <input
                      type="color"
                      class="form-color-input"
                      [(ngModel)]="newPatternForm.color"
                    />
                    <small class="form-hint">Badge background color</small>
                  </div>

                  <div class="form-actions">
                    <button
                      class="btn-submit"
                      (click)="submitAddPattern()"
                      [disabled]="
                        !newPatternForm.pattern ||
                        !newPatternForm.text ||
                        !newPatternForm.color
                      "
                    >
                      Add
                    </button>
                    <button class="btn-cancel" (click)="resetForm()">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Bands -->
          <section class="settings-section" *ngIf="bands && bands.length > 0">
            <h3 class="section-title">Bands</h3>

            <div class="bands-list">
              <div *ngIf="!bands || bands.length === 0" class="empty-message">
                No bands
              </div>

              <div *ngFor="let band of bands; let i = index" class="band-item">
                <div class="band-preview">
                  <div
                    class="band-color"
                    [style.background-color]="band.color"
                  ></div>
                  <div class="band-texts">
                    <span class="band-text-list">{{
                      band.searchTexts.join(", ")
                    }}</span>
                  </div>
                </div>
                <div class="band-actions">
                  <button
                    class="edit-btn"
                    (click)="startEditBand(i)"
                    title="Edit band"
                  >
                    ✎
                  </button>
                  <button
                    class="remove-btn"
                    (click)="onRemoveBand(i)"
                    title="Remove band"
                  >
                    ×
                  </button>
                </div>
              </div>

              <!-- Edit Band Form -->
              <div *ngIf="editingBandIndex !== null" class="edit-form">
                <div class="form-group">
                  <label class="form-label">Search Text(s)</label>
                  <input
                    type="text"
                    class="form-input"
                    placeholder="e.g., Festival or Rock, Blues, Jazz"
                    [(ngModel)]="newBand.searchText"
                  />
                </div>

                <div class="form-group">
                  <label class="form-label">Band Color</label>
                  <input
                    type="color"
                    class="form-color-input"
                    [(ngModel)]="newBand.color"
                  />
                </div>

                <div class="form-actions">
                  <button
                    class="btn-submit"
                    (click)="submitEditBand()"
                    [disabled]="!newBand.searchText || !newBand.color"
                  >
                    Save
                  </button>
                  <button class="btn-cancel" (click)="cancelEditBand()">
                    Cancel
                  </button>
                </div>
              </div>

              <div class="add-section">
                <button class="add-btn" (click)="showBandForm = !showBandForm">
                  + Add Band
                </button>

                <div *ngIf="showBandForm" class="add-form">
                  <div class="form-group">
                    <label class="form-label">Search Text(s)</label>
                    <input
                      type="text"
                      class="form-input"
                      placeholder="e.g., Festival or Rock, Blues, Jazz"
                      [(ngModel)]="newBand.searchText"
                    />
                    <small class="form-hint"
                      >Comma-separated text to match (case-insensitive)</small
                    >
                  </div>

                  <div class="form-group">
                    <label class="form-label">Band Color</label>
                    <input
                      type="color"
                      class="form-color-input"
                      [(ngModel)]="newBand.color"
                    />
                    <small class="form-hint">Row background color</small>
                  </div>

                  <div class="form-actions">
                    <button
                      class="btn-submit"
                      (click)="submitAddBand()"
                      [disabled]="!newBand.searchText || !newBand.color"
                    >
                      Add
                    </button>
                    <button class="btn-cancel" (click)="resetBandForm()">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Calendars -->
          <section class="settings-section">
            <h3 class="section-title">Calendars</h3>

            <app-calendar-list
              [calendars]="calendars"
              (toggleCalendar)="onToggleCalendar($event)"
              (removeCalendar)="onRemoveCalendar($event)"
              (addCalendar)="onAddCalendar($event)"
            ></app-calendar-list>
          </section>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .settings-overlay {
        position: fixed;
        inset: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: flex-end;
        z-index: 1000;
        animation: fadeIn 0.2s ease;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      .settings-panel {
        background-color: var(--color-surface);
        width: 100%;
        max-width: 380px;
        height: 100vh;
        overflow-y: auto;
        box-shadow: -2px 0 12px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
        animation: slideIn 0.3s ease;
      }

      @keyframes slideIn {
        from {
          transform: translateX(100%);
        }
        to {
          transform: translateX(0);
        }
      }

      .settings-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--spacing-lg);
        border-bottom: 1px solid var(--color-border);
        position: sticky;
        top: 0;
        background-color: var(--color-surface);
      }

      .settings-title {
        font-size: var(--font-size-lg);
        font-weight: var(--font-weight-semibold);
        margin: 0;
      }

      .close-btn {
        background: none;
        border: none;
        font-size: 1.75rem;
        cursor: pointer;
        color: var(--color-text-secondary);
        padding: 0;
        width: 2rem;
        height: 2rem;
        opacity: 0.6;
        transition: opacity 0.2s;
      }

      .close-btn:hover {
        opacity: 1;
        color: var(--color-accent);
      }

      .settings-content {
        flex: 1;
        padding: var(--spacing-lg);
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: var(--spacing-2xl);
      }

      .settings-section {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-lg);
      }

      .section-title {
        font-size: var(--font-size-base);
        font-weight: var(--font-weight-semibold);
        margin: 0 0 var(--spacing-md) 0;
        padding-bottom: var(--spacing-md);
        border-bottom: 1px solid var(--color-border);
      }

      .font-options {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--spacing-md);
      }

      .font-option {
        padding: var(--spacing-md);
        border: 2px solid var(--color-border);
        border-radius: var(--radius-md);
        background-color: var(--color-surface);
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--spacing-sm);
        transition: all 0.2s;
        font-weight: var(--font-weight-medium);
        font-size: var(--font-size-sm);
      }

      .font-option:hover {
        border-color: var(--color-accent);
      }

      .font-option.active {
        border-color: var(--color-accent);
        background-color: var(--color-bg);
      }

      .font-preview {
        font-size: 1.25rem;
        font-weight: 600;
      }

      .font-size-options {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: var(--spacing-sm);
      }

      .font-size-option {
        padding: var(--spacing-sm) var(--spacing-md);
        border: 2px solid var(--color-border);
        border-radius: var(--radius-md);
        background-color: var(--color-surface);
        cursor: pointer;
        transition: all 0.2s;
        font-weight: var(--font-weight-medium);
        font-size: var(--font-size-sm);
        text-align: center;
      }

      .font-size-option:hover {
        border-color: var(--color-accent);
      }

      .font-size-option.active {
        border-color: var(--color-accent);
        background-color: var(--color-bg);
        color: var(--color-accent);
      }

      .patterns-list {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-sm);
      }

      .pattern-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--spacing-md);
        border-bottom: 1px solid var(--color-border);
      }

      .pattern-badge-display {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        flex: 1;
      }

      .badge-text {
        font-weight: var(--font-weight-medium);
        font-size: var(--font-size-sm);
        padding: 0.35rem 0.75rem;
        border-radius: var(--radius-sm);
        display: inline-block;
      }

      .pattern-code {
        font-family: monospace;
        font-size: var(--font-size-xs);
        color: var(--color-text-secondary);
        background-color: var(--color-bg);
        padding: 0.25rem 0.5rem;
        border-radius: var(--radius-sm);
      }

      .pattern-actions,
      .band-actions {
        display: flex;
        gap: var(--spacing-xs);
        align-items: center;
      }

      .edit-btn {
        background: none;
        border: none;
        color: var(--color-text-secondary);
        font-size: 1.1rem;
        cursor: pointer;
        padding: 0.25rem 0.5rem;
        opacity: 0.6;
        transition: opacity 0.2s;
      }

      .edit-btn:hover {
        opacity: 1;
        color: var(--color-accent);
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
        gap: var(--spacing-md);
        animation: slideDown 0.2s ease;
      }

      .edit-form {
        margin: var(--spacing-md) 0;
        padding: var(--spacing-md);
        display: flex;
        flex-direction: column;
        gap: var(--spacing-md);
        background-color: var(--color-bg);
        border-left: 2px solid var(--color-accent);
        border-radius: var(--radius-sm);
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

      .form-group {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-xs);
      }

      .form-label {
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-medium);
        color: var(--color-text-primary);
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

      .form-color-input {
        width: 100%;
        height: 40px;
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        cursor: pointer;
        transition: border-color 0.2s;
      }

      .form-color-input:hover {
        border-color: var(--color-accent);
      }

      .form-color-input:focus {
        outline: none;
        border-color: var(--color-accent);
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

      .btn-cancel {
        background-color: var(--color-border);
        color: var(--color-text-primary);
      }

      .bands-list {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-sm);
      }

      .band-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--spacing-md);
        border-bottom: 1px solid var(--color-border);
      }

      .band-preview {
        display: flex;
        align-items: center;
        gap: var(--spacing-md);
        flex: 1;
      }

      .band-color {
        width: 2.5rem;
        height: 2.5rem;
        border-radius: var(--radius-md);
        border: 1px solid var(--color-border);
      }

      .band-texts {
        flex: 1;
      }

      .band-text-list {
        font-size: var(--font-size-sm);
        color: var(--color-text-secondary);
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      @media (max-width: 640px) {
        .settings-panel {
          max-width: 100%;
        }
        .font-options {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class SettingsComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() patterns: PatternBadge[] | null = [];
  @Input() bands: Band[] | null = [];
  @Input() calendars: Calendar[] | null = [];
  @Input() fontFamily: "default" | "monospace" | "courier" = "monospace";
  @Input() fontSize: "xs" | "sm" | "base" | "lg" = "base";

  @Output() close = new EventEmitter<void>();
  @Output() fontChange = new EventEmitter<
    "default" | "monospace" | "courier"
  >();
  @Output() fontSizeChange = new EventEmitter<"xs" | "sm" | "base" | "lg">();
  @Output() addPattern = new EventEmitter<PatternBadge>();
  @Output() updatePattern = new EventEmitter<{
    index: number;
    badge: PatternBadge;
  }>();
  @Output() removePattern = new EventEmitter<number>();
  @Output() addBand = new EventEmitter<Band>();
  @Output() removeBand = new EventEmitter<number>();
  @Output() toggleCalendar = new EventEmitter<string>();
  @Output() removeCalendar = new EventEmitter<string>();
  @Output() addCalendar = new EventEmitter<{ id: string; name: string }>();

  showAddForm = false;
  showBandForm = false;
  editingPatternIndex: number | null = null;
  editingBandIndex: number | null = null;
  localFontSize: "xs" | "sm" | "base" | "lg" = "base";
  // Form object with singular pattern for comma-separated input
  newPatternForm: { pattern: string; text: string; color: string } = {
    pattern: "",
    text: "",
    color: "#2c3e50",
  };
  newBand: { searchText: string; color: string } = {
    searchText: "",
    color: "#2c3e50",
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["fontSize"]) {
      this.localFontSize = changes["fontSize"].currentValue;
    }
  }

  onClose(): void {
    this.close.emit();
  }

  onFontChange(font: "default" | "monospace" | "courier"): void {
    this.fontFamily = font;
    this.fontChange.emit(font);
  }

  onFontSizeChange(size: "xs" | "sm" | "base" | "lg"): void {
    this.localFontSize = size;
    this.fontSizeChange.emit(size);
  }

  onRemovePattern(index: number): void {
    this.removePattern.emit(index);
  }

  submitAddPattern(): void {
    if (
      this.newPatternForm.pattern.trim() &&
      this.newPatternForm.text.trim() &&
      this.newPatternForm.color
    ) {
      const patterns = this.newPatternForm.pattern
        .split(",")
        .map((p: string) => p.trim())
        .filter((p: string) => p);

      this.addPattern.emit({
        patterns,
        text: this.newPatternForm.text.trim(),
        color: this.newPatternForm.color,
      });
      this.resetForm();
    }
  }

  resetForm(): void {
    this.newPatternForm = {
      pattern: "",
      text: "",
      color: "#2c3e50",
    };
    this.showAddForm = false;
  }

  onToggleCalendar(id: string): void {
    this.toggleCalendar.emit(id);
  }

  onRemoveCalendar(id: string): void {
    this.removeCalendar.emit(id);
  }

  onAddCalendar(data: { id: string; name: string }): void {
    this.addCalendar.emit(data);
  }

  submitAddBand(): void {
    if (this.newBand.searchText && this.newBand.color) {
      const searchTexts = this.newBand.searchText
        .split(",")
        .map((text) => text.trim())
        .filter((text) => text);

      const band: Band = {
        searchTexts,
        color: this.newBand.color,
      };

      this.addBand.emit(band);
      this.resetBandForm();
    }
  }

  onRemoveBand(index: number): void {
    this.removeBand.emit(index);
  }

  resetBandForm(): void {
    this.newBand = {
      searchText: "",
      color: "#2c3e50",
    };
    this.showBandForm = false;
  }

  startEditPattern(index: number): void {
    if (this.patterns && this.patterns[index]) {
      this.editingPatternIndex = index;
      const badge = this.patterns[index];
      this.newPatternForm = {
        pattern: badge.patterns.join(", "),
        text: badge.text,
        color: badge.color,
      };
    }
  }

  cancelEditPattern(): void {
    this.editingPatternIndex = null;
    this.resetForm();
  }

  submitEditPattern(): void {
    if (
      this.editingPatternIndex !== null &&
      this.newPatternForm.pattern.trim() &&
      this.newPatternForm.text.trim() &&
      this.newPatternForm.color
    ) {
      const patterns = this.newPatternForm.pattern
        .split(",")
        .map((p: string) => p.trim())
        .filter((p: string) => p);

      // Update pattern in place - get current badge to check if patterns changed
      const currentBadge = this.patterns?.[this.editingPatternIndex];

      if (
        currentBadge &&
        this.patternsAreEqual(currentBadge.patterns, patterns)
      ) {
        // Only text/color changed - emit update event instead of remove+add
        this.updatePattern.emit({
          index: this.editingPatternIndex,
          badge: {
            patterns,
            text: this.newPatternForm.text.trim(),
            color: this.newPatternForm.color,
          },
        });
      } else {
        // Patterns changed - need to remove old and add new
        this.removePattern.emit(this.editingPatternIndex);
        this.addPattern.emit({
          patterns,
          text: this.newPatternForm.text.trim(),
          color: this.newPatternForm.color,
        });
      }

      this.editingPatternIndex = null;
      this.resetForm();
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

  startEditBand(index: number): void {
    if (this.bands && this.bands[index]) {
      this.editingBandIndex = index;
      const band = this.bands[index];
      this.newBand = {
        searchText: band.searchTexts.join(", "),
        color: band.color,
      };
    }
  }

  cancelEditBand(): void {
    this.editingBandIndex = null;
    this.resetBandForm();
  }

  submitEditBand(): void {
    if (
      this.editingBandIndex !== null &&
      this.newBand.searchText &&
      this.newBand.color
    ) {
      const searchTexts = this.newBand.searchText
        .split(",")
        .map((text) => text.trim())
        .filter((text) => text);

      const band: Band = {
        searchTexts,
        color: this.newBand.color,
      };

      // Remove old band and add updated one
      this.removeBand.emit(this.editingBandIndex);
      this.addBand.emit(band);

      this.editingBandIndex = null;
      this.resetBandForm();
    }
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
