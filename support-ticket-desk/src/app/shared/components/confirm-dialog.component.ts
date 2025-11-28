import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dialog-overlay" *ngIf="visible" data-testid="confirm-dialog">
      <div class="dialog-content">
        <h3 class="dialog-title" data-testid="confirm-dialog-title">{{ title }}</h3>
        <p class="dialog-message" data-testid="confirm-dialog-message">{{ message }}</p>
        
        <div class="dialog-actions">
          <button
            class="button secondary"
            (click)="onCancel()"
            data-testid="confirm-dialog-cancel"
          >
            Cancel
          </button>
          <button
            class="button danger"
            (click)="onConfirm()"
            data-testid="confirm-dialog-confirm"
          >
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dialog-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .dialog-content {
      background: #fff;
      border-radius: 12px;
      padding: 24px;
      max-width: 420px;
      width: 90%;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }

    .dialog-title {
      margin: 0 0 12px 0;
      font-size: 18px;
      color: #1a1a2e;
    }

    .dialog-message {
      margin: 0 0 24px 0;
      color: #666;
      font-size: 14px;
      line-height: 1.5;
    }

    .dialog-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    }

    .button {
      padding: 10px 20px;
      border-radius: 6px;
      font-weight: 500;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s ease;
      border: none;
    }

    .button.secondary {
      background: #f0f0f0;
      color: #333;
    }

    .button.secondary:hover {
      background: #e0e0e0;
    }

    .button.danger {
      background: #e74c3c;
      color: #fff;
    }

    .button.danger:hover {
      background: #c0392b;
    }
  `]
})
export class ConfirmDialogComponent {
  @Input() visible = false;
  @Input() title = 'Confirm Action';
  @Input() message = 'Are you sure you want to proceed?';
  @Input() confirmText = 'Confirm';
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm(): void {
    this.confirm.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }
}

