import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="pagination" [attr.data-testid]="testId">
      <div class="pagination-info">
        Showing {{ startItem }} - {{ endItem }} of {{ total }} items
      </div>

      <div class="pagination-controls">
        <button
          class="page-button"
          [disabled]="currentPage === 1"
          (click)="onPageChange(1)"
          data-testid="pagination-first"
        >
          First
        </button>
        <button
          class="page-button"
          [disabled]="currentPage === 1"
          (click)="onPageChange(currentPage - 1)"
          data-testid="pagination-prev"
        >
          Previous
        </button>

        <div class="page-numbers">
          <button
            *ngFor="let page of visiblePages"
            class="page-number"
            [class.active]="page === currentPage"
            (click)="onPageChange(page)"
            [attr.data-testid]="'pagination-page-' + page"
          >
            {{ page }}
          </button>
        </div>

        <button
          class="page-button"
          [disabled]="currentPage === totalPages"
          (click)="onPageChange(currentPage + 1)"
          data-testid="pagination-next"
        >
          Next
        </button>
        <button
          class="page-button"
          [disabled]="currentPage === totalPages"
          (click)="onPageChange(totalPages)"
          data-testid="pagination-last"
        >
          Last
        </button>
      </div>
    </div>
  `,
  styles: [`
    .pagination {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 0;
      border-top: 1px solid #eee;
      margin-top: 16px;
    }

    .pagination-info {
      color: #666;
      font-size: 14px;
    }

    .pagination-controls {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .page-button {
      padding: 8px 12px;
      border: 1px solid #ddd;
      background: #fff;
      border-radius: 6px;
      cursor: pointer;
      font-size: 13px;
      color: #333;
      transition: all 0.2s ease;
    }

    .page-button:hover:not(:disabled) {
      background: #f5f5f5;
      border-color: #0f3460;
      color: #0f3460;
    }

    .page-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .page-numbers {
      display: flex;
      gap: 4px;
    }

    .page-number {
      width: 36px;
      height: 36px;
      border: 1px solid #ddd;
      background: #fff;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      color: #333;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .page-number:hover:not(.active) {
      background: #f5f5f5;
      border-color: #0f3460;
    }

    .page-number.active {
      background: #0f3460;
      border-color: #0f3460;
      color: #fff;
    }
  `]
})
export class PaginationComponent {
  @Input() currentPage = 1;
  @Input() total = 0;
  @Input() pageSize = 10;
  @Input() testId = 'pagination';
  @Output() pageChange = new EventEmitter<number>();

  get totalPages(): number {
    return Math.ceil(this.total / this.pageSize);
  }

  get startItem(): number {
    return this.total === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
  }

  get endItem(): number {
    return Math.min(this.currentPage * this.pageSize, this.total);
  }

  get visiblePages(): number[] {
    const pages: number[] = [];
    const total = this.totalPages;
    const current = this.currentPage;

    let start = Math.max(1, current - 2);
    let end = Math.min(total, current + 2);

    if (end - start < 4) {
      if (start === 1) {
        end = Math.min(total, start + 4);
      } else if (end === total) {
        start = Math.max(1, end - 4);
      }
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.pageChange.emit(page);
    }
  }
}


