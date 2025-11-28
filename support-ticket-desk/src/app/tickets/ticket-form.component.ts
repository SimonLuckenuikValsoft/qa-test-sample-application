import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TicketService } from '../core/services/ticket.service';
import { CustomerService } from '../core/services/customer.service';
import { AuthService } from '../core/services/auth.service';
import { Ticket, Customer, TicketStatus, TicketPriority, TicketFormData } from '../core/models';
import { LoadingSpinnerComponent } from '../shared/components/loading-spinner.component';
import { AlertComponent } from '../shared/components/alert.component';

@Component({
  selector: 'app-ticket-form',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, LoadingSpinnerComponent, AlertComponent],
  template: `
    <div class="ticket-form-page" data-testid="ticket-form-page">
      <app-loading-spinner *ngIf="loading" message="Loading..."></app-loading-spinner>

      <div *ngIf="!loading">
        <header class="page-header">
          <a [routerLink]="isEdit ? ['/tickets', ticketId] : '/tickets'" class="back-link">
            ← Back
          </a>
          <h1>{{ isEdit ? 'Edit Ticket' : 'Create New Ticket' }}</h1>
        </header>

        <app-alert
          *ngIf="errorMessage"
          type="error"
          [message]="errorMessage"
          (close)="errorMessage = ''"
        ></app-alert>

        <div class="form-card">
          <form (ngSubmit)="onSubmit()" #ticketForm="ngForm">
            <div class="form-row">
              <div class="form-group full-width">
                <label for="title">Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  [(ngModel)]="formData.title"
                  required
                  data-testid="ticket-form-title"
                  [class.error]="submitted && !formData.title"
                  placeholder="Brief summary of the issue"
                />
                <span class="error-text" *ngIf="submitted && !formData.title">Title is required</span>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group full-width">
                <label for="description">Description *</label>
                <textarea
                  id="description"
                  name="description"
                  [(ngModel)]="formData.description"
                  required
                  rows="5"
                  data-testid="ticket-form-description"
                  [class.error]="submitted && !formData.description"
                  placeholder="Detailed description of the issue..."
                ></textarea>
                <span class="error-text" *ngIf="submitted && !formData.description">Description is required</span>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="customerId">Customer *</label>
                <select
                  id="customerId"
                  name="customerId"
                  [(ngModel)]="formData.customerId"
                  required
                  data-testid="ticket-form-customer"
                  [class.error]="submitted && !formData.customerId"
                >
                  <option value="">Select a customer</option>
                  <option *ngFor="let customer of customers" [value]="customer.id">
                    {{ customer.name }} ({{ customer.company }})
                  </option>
                </select>
                <span class="error-text" *ngIf="submitted && !formData.customerId">Customer is required</span>
              </div>

              <div class="form-group">
                <label for="priority">Priority *</label>
                <select
                  id="priority"
                  name="priority"
                  [(ngModel)]="formData.priority"
                  required
                  data-testid="ticket-form-priority"
                >
                  <option *ngFor="let priority of priorities" [value]="priority">{{ priority }}</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group" *ngIf="isEdit">
                <label for="status">Status</label>
                <select
                  id="status"
                  name="status"
                  [(ngModel)]="formData.status"
                  data-testid="ticket-form-status"
                >
                  <option *ngFor="let status of statuses" [value]="status">{{ status }}</option>
                </select>
              </div>

              <div class="form-group">
                <label for="assignedTo">Assigned To</label>
                <select
                  id="assignedTo"
                  name="assignedTo"
                  [(ngModel)]="formData.assignedToUsername"
                  data-testid="ticket-form-assigned"
                  [disabled]="!authService.isAdmin"
                >
                  <option *ngFor="let user of assignees" [value]="user">{{ user }}</option>
                </select>
                <span class="help-text" *ngIf="!authService.isAdmin">
                  Tickets are automatically assigned to you
                </span>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group full-width">
                <label for="tags">Tags</label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  [(ngModel)]="tagsString"
                  data-testid="ticket-form-tags"
                  placeholder="Enter tags separated by commas (e.g., bug, urgent, login)"
                />
                <span class="help-text">Separate multiple tags with commas</span>
              </div>
            </div>

            <div class="form-actions">
              <a
                [routerLink]="isEdit ? ['/tickets', ticketId] : '/tickets'"
                class="btn-secondary"
                data-testid="ticket-form-cancel"
              >
                Cancel
              </a>
              <button
                type="submit"
                class="btn-primary"
                [disabled]="saving"
                data-testid="ticket-form-submit"
              >
                {{ saving ? 'Saving...' : (isEdit ? 'Update Ticket' : 'Create Ticket') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .ticket-form-page {
      max-width: 800px;
      margin: 0 auto;
      animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .page-header {
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

    .page-header h1 {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 28px;
      color: #1a1a2e;
      margin: 0;
    }

    .form-card {
      background: #fff;
      border-radius: 12px;
      padding: 32px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    }

    .form-row {
      display: flex;
      gap: 20px;
      margin-bottom: 20px;
    }

    .form-group {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .form-group.full-width {
      flex: 1 1 100%;
    }

    .form-group label {
      font-weight: 600;
      font-size: 14px;
      color: #333;
    }

    .form-group input,
    .form-group select,
    .form-group textarea {
      padding: 12px 14px;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 14px;
      transition: all 0.2s ease;
      font-family: inherit;
    }

    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: #0f3460;
      box-shadow: 0 0 0 3px rgba(15, 52, 96, 0.1);
    }

    .form-group input.error,
    .form-group select.error,
    .form-group textarea.error {
      border-color: #e74c3c;
    }

    .form-group input:disabled,
    .form-group select:disabled {
      background: #f5f5f5;
      cursor: not-allowed;
    }

    .error-text {
      color: #e74c3c;
      font-size: 13px;
    }

    .help-text {
      color: #666;
      font-size: 12px;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 24px;
      padding-top: 24px;
      border-top: 1px solid #eee;
    }

    .btn-primary {
      background: linear-gradient(135deg, #0f3460 0%, #16213e 100%);
      color: #fff;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(15, 52, 96, 0.3);
    }

    .btn-primary:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .btn-secondary {
      background: #f0f0f0;
      color: #333;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 14px;
      cursor: pointer;
      text-decoration: none;
      display: inline-block;
      transition: all 0.2s ease;
    }

    .btn-secondary:hover {
      background: #e0e0e0;
    }

    @media (max-width: 600px) {
      .form-row {
        flex-direction: column;
      }
    }
  `]
})
export class TicketFormComponent implements OnInit {
  isEdit = false;
  ticketId: string | null = null;
  loading = true;
  saving = false;
  submitted = false;
  errorMessage = '';

  customers: Customer[] = [];
  assignees: string[] = [];

  statuses: TicketStatus[] = ['Open', 'In Progress', 'Resolved', 'Closed'];
  priorities: TicketPriority[] = ['Low', 'Medium', 'High', 'Critical'];

  formData: TicketFormData = {
    title: '',
    description: '',
    status: 'Open',
    priority: 'Medium',
    customerId: '',
    assignedToUsername: '',
    tags: []
  };

  tagsString = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ticketService: TicketService,
    private customerService: CustomerService,
    public authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.ticketId = this.route.snapshot.paramMap.get('id');
    this.isEdit = this.ticketId !== null && this.ticketId !== 'new';

    this.assignees = this.authService.getAvailableAssignees();
    this.formData.assignedToUsername = this.authService.currentUser?.username || 'agent';

    this.loadCustomers();
  }

  loadCustomers(): void {
    this.customerService.getAllCustomers().subscribe({
      next: (customers) => {
        this.customers = customers;

        if (this.isEdit && this.ticketId) {
          this.loadTicket(this.ticketId);
        } else {
          this.loading = false;
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.error('Failed to load customers:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadTicket(id: string): void {
    this.ticketService.getTicketById(id).subscribe({
      next: (ticket) => {
        if (ticket) {
          this.formData = {
            title: ticket.title,
            description: ticket.description,
            status: ticket.status,
            priority: ticket.priority,
            customerId: ticket.customerId,
            assignedToUsername: ticket.assignedToUsername,
            tags: [...ticket.tags]
          };
          this.tagsString = ticket.tags.join(', ');
        }
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load ticket:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';

    if (!this.formData.title || !this.formData.description || !this.formData.customerId) {
      return;
    }

    this.formData.tags = this.tagsString
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    this.saving = true;

    if (this.isEdit && this.ticketId) {
      this.ticketService.updateTicket(this.ticketId, this.formData).subscribe({
        next: (ticket) => {
          this.router.navigate(['/tickets', ticket.id]);
        },
        error: (err) => {
          this.errorMessage = err.message || 'Failed to update ticket';
          this.saving = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      this.ticketService.createTicket(this.formData).subscribe({
        next: (ticket) => {
          this.router.navigate(['/tickets', ticket.id]);
        },
        error: (err) => {
          this.errorMessage = err.message || 'Failed to create ticket';
          this.saving = false;
          this.cdr.detectChanges();
        }
      });
    }
  }
}

