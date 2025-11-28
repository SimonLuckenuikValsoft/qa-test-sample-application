import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TicketService } from '../core/services/ticket.service';
import { CustomerService } from '../core/services/customer.service';
import { CommentService } from '../core/services/comment.service';
import { AuthService } from '../core/services/auth.service';
import { Ticket, Customer, Comment } from '../core/models';
import { LoadingSpinnerComponent } from '../shared/components/loading-spinner.component';
import { ConfirmDialogComponent } from '../shared/components/confirm-dialog.component';
import { AlertComponent } from '../shared/components/alert.component';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-ticket-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    LoadingSpinnerComponent,
    ConfirmDialogComponent,
    AlertComponent
  ],
  template: `
    <div class="ticket-detail-page" data-testid="ticket-detail-page">
      <app-loading-spinner *ngIf="loading" message="Loading ticket..."></app-loading-spinner>

      <div *ngIf="!loading && !ticket" class="not-found" data-testid="ticket-not-found">
        <h2>Ticket Not Found</h2>
        <p>The ticket you're looking for doesn't exist or you don't have permission to view it.</p>
        <a routerLink="/tickets" class="btn-secondary">← Back to Tickets</a>
      </div>

      <div *ngIf="!loading && ticket" class="ticket-content">
        <header class="page-header">
          <div class="header-left">
            <a routerLink="/tickets" class="back-link">← Back to Tickets</a>
            <div class="title-row">
              <h1 data-testid="ticket-detail-title">{{ ticket.title }}</h1>
              <span class="ticket-id" data-testid="ticket-detail-id">{{ ticket.id }}</span>
            </div>
          </div>
          <div class="header-actions">
            <a
              [routerLink]="['/tickets', ticket.id, 'edit']"
              class="btn-secondary"
              data-testid="edit-ticket-button"
            >
              Edit Ticket
            </a>
            <button
              *ngIf="authService.isAdmin"
              class="btn-danger"
              (click)="showDeleteConfirm = true"
              data-testid="delete-ticket-button"
            >
              Delete Ticket
            </button>
          </div>
        </header>

        <app-alert
          *ngIf="successMessage"
          type="success"
          [message]="successMessage"
          (close)="successMessage = ''"
        ></app-alert>

        <app-alert
          *ngIf="errorMessage"
          type="error"
          [message]="errorMessage"
          (close)="errorMessage = ''"
        ></app-alert>

        <div class="detail-grid">
          <section class="main-section">
            <div class="card">
              <h2>Description</h2>
              <p class="description" data-testid="ticket-detail-description">
                {{ ticket.description }}
              </p>

              <div class="tags-section" *ngIf="ticket.tags.length > 0">
                <h3>Tags</h3>
                <div class="tags" data-testid="ticket-detail-tags">
                  <span class="tag" *ngFor="let tag of ticket.tags">{{ tag }}</span>
                </div>
              </div>
            </div>

            <div class="card">
              <h2>Comments ({{ comments.length }})</h2>

              <div class="comments-list" data-testid="comments-list">
                <div
                  *ngFor="let comment of comments"
                  class="comment"
                  [attr.data-testid]="'comment-' + comment.id"
                >
                  <div class="comment-header">
                    <span class="comment-author">{{ comment.authorUsername }}</span>
                    <span class="comment-date">{{ formatDate(comment.createdAt) }}</span>
                  </div>
                  <p class="comment-message">{{ comment.message }}</p>
                </div>

                <div *ngIf="comments.length === 0" class="no-comments">
                  No comments yet.
                </div>
              </div>

              <div class="add-comment" data-testid="add-comment-form">
                <h3>Add Comment</h3>
                <textarea
                  [(ngModel)]="newComment"
                  placeholder="Write your comment..."
                  rows="3"
                  data-testid="comment-input"
                  [class.error]="commentError"
                ></textarea>
                <span class="error-text" *ngIf="commentError">{{ commentError }}</span>
                <button
                  class="btn-primary"
                  (click)="addComment()"
                  [disabled]="addingComment"
                  data-testid="submit-comment"
                >
                  {{ addingComment ? 'Adding...' : 'Add Comment' }}
                </button>
              </div>
            </div>
          </section>

          <aside class="sidebar">
            <div class="card">
              <h2>Details</h2>

              <div class="detail-item">
                <span class="label">Status</span>
                <span class="status-badge" [class]="getStatusClass(ticket.status)" data-testid="ticket-status">
                  {{ ticket.status }}
                </span>
              </div>

              <div class="detail-item">
                <span class="label">Priority</span>
                <span class="priority-badge" [class]="getPriorityClass(ticket.priority)" data-testid="ticket-priority">
                  {{ ticket.priority }}
                </span>
              </div>

              <div class="detail-item">
                <span class="label">Assigned To</span>
                <span class="value" data-testid="ticket-assigned">{{ ticket.assignedToUsername }}</span>
              </div>

              <div class="detail-item">
                <span class="label">Created</span>
                <span class="value" data-testid="ticket-created">{{ formatDate(ticket.createdAt) }}</span>
              </div>

              <div class="detail-item">
                <span class="label">Updated</span>
                <span class="value" data-testid="ticket-updated">{{ formatDate(ticket.updatedAt) }}</span>
              </div>
            </div>

            <div class="card" *ngIf="customer">
              <h2>Customer</h2>

              <div class="detail-item">
                <span class="label">Name</span>
                <a
                  [routerLink]="['/customers', customer.id]"
                  class="link-value"
                  data-testid="customer-link"
                >
                  {{ customer.name }}
                </a>
              </div>

              <div class="detail-item">
                <span class="label">Company</span>
                <span class="value" data-testid="customer-company">{{ customer.company }}</span>
              </div>

              <div class="detail-item">
                <span class="label">Email</span>
                <span class="value" data-testid="customer-email">{{ customer.email }}</span>
              </div>

              <div class="detail-item">
                <span class="label">SLA Level</span>
                <span class="sla-badge" [class]="customer.slaLevel.toLowerCase()" data-testid="customer-sla">
                  {{ customer.slaLevel }}
                </span>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <app-confirm-dialog
        [visible]="showDeleteConfirm"
        title="Delete Ticket"
        [message]="'Are you sure you want to delete ticket ' + ticket?.id + '? This action cannot be undone.'"
        confirmText="Delete"
        (confirm)="deleteTicket()"
        (cancel)="showDeleteConfirm = false"
      ></app-confirm-dialog>
    </div>
  `,
  styles: [`
    .ticket-detail-page {
      animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .not-found {
      text-align: center;
      padding: 60px 20px;
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    }

    .not-found h2 {
      color: #1a1a2e;
      margin: 0 0 12px 0;
    }

    .not-found p {
      color: #666;
      margin: 0 0 24px 0;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 24px;
    }

    .back-link {
      color: #666;
      text-decoration: none;
      font-size: 14px;
      display: inline-block;
      margin-bottom: 8px;
    }

    .back-link:hover {
      color: #0f3460;
    }

    .title-row {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .title-row h1 {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 28px;
      color: #1a1a2e;
      margin: 0;
    }

    .ticket-id {
      font-family: 'Monaco', 'Consolas', monospace;
      font-size: 14px;
      color: #666;
      background: #f0f0f0;
      padding: 4px 12px;
      border-radius: 20px;
    }

    .header-actions {
      display: flex;
      gap: 12px;
    }

    .btn-primary {
      background: linear-gradient(135deg, #0f3460 0%, #16213e 100%);
      color: #fff;
      border: none;
      padding: 10px 20px;
      border-radius: 6px;
      font-weight: 500;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(15, 52, 96, 0.3);
    }

    .btn-primary:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .btn-secondary {
      background: #f0f0f0;
      color: #333;
      border: none;
      padding: 10px 20px;
      border-radius: 6px;
      font-weight: 500;
      font-size: 14px;
      cursor: pointer;
      text-decoration: none;
      display: inline-block;
      transition: all 0.2s ease;
    }

    .btn-secondary:hover {
      background: #e0e0e0;
    }

    .btn-danger {
      background: #e74c3c;
      color: #fff;
      border: none;
      padding: 10px 20px;
      border-radius: 6px;
      font-weight: 500;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-danger:hover {
      background: #c0392b;
    }

    .detail-grid {
      display: grid;
      grid-template-columns: 1fr 340px;
      gap: 24px;
    }

    .card {
      background: #fff;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
      margin-bottom: 20px;
    }

    .card h2 {
      font-size: 16px;
      color: #1a1a2e;
      margin: 0 0 16px 0;
      padding-bottom: 12px;
      border-bottom: 1px solid #eee;
    }

    .card h3 {
      font-size: 14px;
      color: #333;
      margin: 16px 0 8px 0;
    }

    .description {
      color: #333;
      line-height: 1.7;
      margin: 0;
      white-space: pre-wrap;
    }

    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .tag {
      background: #e8f4f8;
      color: #0f3460;
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 13px;
    }

    .detail-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 0;
      border-bottom: 1px solid #f0f0f0;
    }

    .detail-item:last-child {
      border-bottom: none;
    }

    .label {
      color: #666;
      font-size: 13px;
    }

    .value {
      color: #333;
      font-size: 14px;
      font-weight: 500;
    }

    .link-value {
      color: #0f3460;
      font-size: 14px;
      font-weight: 500;
      text-decoration: none;
    }

    .link-value:hover {
      text-decoration: underline;
    }

    .status-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
    }

    .status-badge.open { background: #fff3cd; color: #856404; }
    .status-badge.in-progress { background: #cce5ff; color: #004085; }
    .status-badge.resolved { background: #d4edda; color: #155724; }
    .status-badge.closed { background: #e2e3e5; color: #383d41; }

    .priority-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
    }

    .priority-badge.low { background: #e2e3e5; color: #383d41; }
    .priority-badge.medium { background: #fff3cd; color: #856404; }
    .priority-badge.high { background: #f8d7da; color: #721c24; }
    .priority-badge.critical { background: #721c24; color: #fff; }

    .sla-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
    }

    .sla-badge.gold { background: #ffd700; color: #333; }
    .sla-badge.silver { background: #c0c0c0; color: #333; }
    .sla-badge.bronze { background: #cd7f32; color: #fff; }

    .comments-list {
      margin-bottom: 24px;
    }

    .comment {
      background: #f8f9fa;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 12px;
    }

    .comment-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
    }

    .comment-author {
      font-weight: 600;
      color: #1a1a2e;
      font-size: 14px;
      text-transform: capitalize;
    }

    .comment-date {
      color: #666;
      font-size: 12px;
    }

    .comment-message {
      color: #333;
      margin: 0;
      line-height: 1.5;
      font-size: 14px;
    }

    .no-comments {
      color: #666;
      font-size: 14px;
      text-align: center;
      padding: 20px;
    }

    .add-comment textarea {
      width: 100%;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 14px;
      resize: vertical;
      margin-bottom: 12px;
      font-family: inherit;
    }

    .add-comment textarea:focus {
      outline: none;
      border-color: #0f3460;
    }

    .add-comment textarea.error {
      border-color: #e74c3c;
    }

    .error-text {
      color: #e74c3c;
      font-size: 13px;
      display: block;
      margin-bottom: 12px;
    }

    @media (max-width: 900px) {
      .detail-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class TicketDetailComponent implements OnInit {
  ticket: Ticket | null = null;
  customer: Customer | null = null;
  comments: Comment[] = [];
  loading = true;
  showDeleteConfirm = false;

  newComment = '';
  commentError = '';
  addingComment = false;

  successMessage = '';
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ticketService: TicketService,
    private customerService: CustomerService,
    private commentService: CommentService,
    public authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadTicket(id);
    }
  }

  loadTicket(id: string): void {
    this.loading = true;

    this.ticketService.getTicketById(id).subscribe({
      next: (ticket) => {
        this.ticket = ticket;
        if (ticket) {
          forkJoin({
            customer: this.customerService.getCustomerById(ticket.customerId),
            comments: this.commentService.getCommentsByTicketId(ticket.id)
          }).subscribe({
            next: (data) => {
              this.customer = data.customer;
              this.comments = data.comments;
              this.loading = false;
              this.cdr.detectChanges();
            },
            error: () => {
              this.loading = false;
              this.cdr.detectChanges();
            }
          });
        } else {
          this.loading = false;
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.error('Failed to load ticket:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  addComment(): void {
    this.commentError = '';

    if (!this.newComment.trim()) {
      this.commentError = 'Please enter a comment message';
      return;
    }

    this.addingComment = true;

    this.commentService.addComment(this.ticket!.id, { message: this.newComment.trim() }).subscribe({
      next: (comment) => {
        this.comments.push(comment);
        this.newComment = '';
        this.addingComment = false;
        this.successMessage = 'Comment added successfully';
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.commentError = err.message || 'Failed to add comment';
        this.addingComment = false;
        this.cdr.detectChanges();
      }
    });
  }

  deleteTicket(): void {
    this.showDeleteConfirm = false;

    this.ticketService.deleteTicket(this.ticket!.id).subscribe({
      next: () => {
        this.router.navigate(['/tickets']);
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to delete ticket';
        this.cdr.detectChanges();
      }
    });
  }

  getStatusClass(status: string): string {
    return status.toLowerCase().replace(' ', '-');
  }

  getPriorityClass(priority: string): string {
    return priority.toLowerCase();
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}

