import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="alert"
      [class]="type"
      *ngIf="visible"
      [attr.data-testid]="'alert-' + type"
    >
      <span class="alert-icon">{{ getIcon() }}</span>
      <span class="alert-message">{{ message }}</span>
      <button
        class="alert-close"
        (click)="onClose()"
        *ngIf="dismissible"
        data-testid="alert-close"
      >
        ×
      </button>
    </div>
  `,
  styles: [`
    .alert {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 16px;
      border-radius: 8px;
      margin-bottom: 16px;
      font-size: 14px;
    }

    .alert.success {
      background: #d4edda;
      border: 1px solid #c3e6cb;
      color: #155724;
    }

    .alert.error {
      background: #f8d7da;
      border: 1px solid #f5c6cb;
      color: #721c24;
    }

    .alert.warning {
      background: #fff3cd;
      border: 1px solid #ffeeba;
      color: #856404;
    }

    .alert.info {
      background: #d1ecf1;
      border: 1px solid #bee5eb;
      color: #0c5460;
    }

    .alert-icon {
      font-size: 18px;
    }

    .alert-message {
      flex: 1;
    }

    .alert-close {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      opacity: 0.5;
      padding: 0;
      line-height: 1;
    }

    .alert-close:hover {
      opacity: 1;
    }
  `]
})
export class AlertComponent {
  @Input() type: AlertType = 'info';
  @Input() message = '';
  @Input() visible = true;
  @Input() dismissible = true;
  @Output() close = new EventEmitter<void>();

  getIcon(): string {
    switch (this.type) {
      case 'success': return '✓';
      case 'error': return '✕';
      case 'warning': return '⚠';
      case 'info': return 'ℹ';
      default: return '';
    }
  }

  onClose(): void {
    this.visible = false;
    this.close.emit();
  }
}

