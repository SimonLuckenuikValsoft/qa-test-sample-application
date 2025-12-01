import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../core/services/customer.service';
import { TicketService } from '../core/services/ticket.service';
import { AuthService } from '../core/services/auth.service';
import { Customer, Ticket } from '../core/models';
import { LoadingSpinnerComponent } from '../shared/components/loading-spinner.component';
import { ConfirmDialogComponent } from '../shared/components/confirm-dialog.component';
import { AlertComponent } from '../shared/components/alert.component';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-customer-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LoadingSpinnerComponent,
    ConfirmDialogComponent,
    AlertComponent
  ],
  template: `
    <div class="customer-detail-page" data-testid="customer-detail-page">
      <app-loading-spinner *ngIf="loading" message="Loading customer..."></app-loading-spinner>

      <div *ngIf="!loading && !customer" class="not-found" data-testid="customer-not-found">
        <h2>Customer Not Found</h2>
        <p>The customer you're looking for doesn't exist.</p>
        <a routerLink="/customers" class="btn-secondary">← Back to Customers</a>
      </div>

      <div *ngIf="!loading && customer" class="customer-content">
        <header class="page-header">
          <div class="header-left">
            <a routerLink="/customers" class="back-link">← Back to Customers</a>
            <div class="title-row">
              <h1 data-testid="customer-detail-name">{{ customer.name }}</h1>
              <span class="customer-id" data-testid="customer-detail-id">{{ customer.id }}</span>
            </div>
          </div>
          <div class="header-actions" *ngIf="authService.isAdmin">
            <a
              [routerLink]="['/customers', customer.id, 'edit']"
              class="btn-secondary"
              data-testid="edit-customer-button"
            >
              Edit Customer
            </a>
            <button
              class="btn-danger"
              (click)="showDeleteConfirm = true"
              data-testid="delete-customer-button"
            >
              Delete Customer
            </button>
          </div>
        </header>

        <app-alert
          *ngIf="errorMessage"
          type="error"
          [message]="errorMessage"
          (close)="errorMessage = ''"
        ></app-alert>

        <div class="detail-grid">
          <section class="main-section">
            <div class="card">
              <h2>Customer Information</h2>

              <div class="info-grid">
                <div class="info-item">
                  <span class="label">Company</span>
                  <span class="value" data-testid="customer-company">{{ customer.company }}</span>
                </div>

                <div class="info-item">
                  <span class="label">Email</span>
                  <span class="value" data-testid="customer-email">{{ customer.email }}</span>
                </div>

                <div class="info-item">
                  <span class="label">SLA Level</span>
                  <span class="sla-badge" [class]="customer.slaLevel.toLowerCase()" data-testid="customer-sla">
                    {{ customer.slaLevel }}
                  </span>
                </div>

                <div class="info-item">
                  <span class="label">Status</span>
                  <span
                    class="status-badge"
                    [class.active]="customer.isActive"
                    [class.inactive]="!customer.isActive"
                    data-testid="customer-status"
                  >
                    {{ customer.isActive ? 'Active' : 'Inactive' }}
                  </span>
                </div>
              </div>
            </div>

            <div class="card">
              <div class="section-header">
                <h2>Associated Tickets ({{ tickets.length }})</h2>
                <a
                  routerLink="/tickets"
                  [queryParams]="{ customerId: customer.id }"
                  class="view-all"
                  data-testid="view-customer-tickets"
                  *ngIf="tickets.length > 0"
                >
                  View All →
                </a>
              </div>

              <div class="tickets-list" data-testid="customer-tickets-list">
                <table class="tickets-table" *ngIf="tickets.length > 0">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Title</th>
                      <th>Status</th>
                      <th>Priority</th>
                      <th>Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      *ngFor="let ticket of tickets.slice(0, 10)"
                      [attr.data-testid]="'customer-ticket-row-' + ticket.id"
                    >
                      <td class="ticket-id">
                        <a [routerLink]="['/tickets', ticket.id]">{{ ticket.id }}</a>
                      </td>
                      <td class="ticket-title">{{ ticket.title }}</td>
                      <td>
                        <span class="status-badge ticket-status" [class]="getStatusClass(ticket.status)">
                          {{ ticket.status }}
                        </span>
                      </td>
                      <td>
                        <span class="priority-badge" [class]="getPriorityClass(ticket.priority)">
                          {{ ticket.priority }}
                        </span>
                      </td>
                      <td class="ticket-date">{{ formatDate(ticket.updatedAt) }}</td>
                    </tr>
                  </tbody>
                </table>

                <div class="no-tickets" *ngIf="tickets.length === 0" data-testid="no-customer-tickets">
                  <p>No tickets associated with this customer.</p>
                </div>
              </div>
            </div>
          </section>

          <aside class="sidebar">
            <div class="card stats-card">
              <h2>Quick Stats</h2>

              <div class="stat-item">
                <span class="stat-value">{{ tickets.length }}</span>
                <span class="stat-label">Total Tickets</span>
              </div>

              <div class="stat-item">
                <span class="stat-value">{{ getOpenTicketsCount() }}</span>
                <span class="stat-label">Open Tickets</span>
              </div>

              <div class="stat-item">
                <span class="stat-value">{{ getResolvedTicketsCount() }}</span>
                <span class="stat-label">Resolved Tickets</span>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <app-confirm-dialog
        [visible]="showDeleteConfirm"
        title="Delete Customer"
        [message]="getDeleteMessage()"
        confirmText="Delete"
        (confirm)="deleteCustomer()"
        (cancel)="showDeleteConfirm = false"
      ></app-confirm-dialog>
    </div>
  `,
  styles: [`
    .customer-detail-page {
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

    .customer-id {
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
      grid-template-columns: 1fr 280px;
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

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 1px solid #eee;
    }

    .section-header h2 {
      margin: 0;
      padding: 0;
      border: none;
    }

    .view-all {
      color: #0f3460;
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
    }

    .view-all:hover {
      color: #e94560;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .label {
      color: #666;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .value {
      color: #1a1a2e;
      font-size: 15px;
      font-weight: 500;
    }

    .sla-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 13px;
      font-weight: 600;
      width: fit-content;
    }

    .sla-badge.gold { background: #ffd700; color: #333; }
    .sla-badge.silver { background: #c0c0c0; color: #333; }
    .sla-badge.bronze { background: #cd7f32; color: #fff; }

    .status-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 13px;
      font-weight: 600;
      width: fit-content;
    }

    .status-badge.active {
      background: #d4edda;
      color: #155724;
    }

    .status-badge.inactive {
      background: #f8d7da;
      color: #721c24;
    }

    .status-badge.ticket-status.open { background: #fff3cd; color: #856404; }
    .status-badge.ticket-status.in-progress { background: #cce5ff; color: #004085; }
    .status-badge.ticket-status.resolved { background: #d4edda; color: #155724; }
    .status-badge.ticket-status.closed { background: #e2e3e5; color: #383d41; }

    .priority-badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
    }

    .priority-badge.low { background: #e2e3e5; color: #383d41; }
    .priority-badge.medium { background: #fff3cd; color: #856404; }
    .priority-badge.high { background: #f8d7da; color: #721c24; }
    .priority-badge.critical { background: #721c24; color: #fff; }

    .tickets-table {
      width: 100%;
      border-collapse: collapse;
    }

    .tickets-table th,
    .tickets-table td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #eee;
    }

    .tickets-table th {
      font-weight: 600;
      color: #666;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .tickets-table tbody tr:hover {
      background: #f8f9fa;
    }

    .ticket-id a {
      font-family: 'Monaco', 'Consolas', monospace;
      font-size: 12px;
      color: #0f3460;
      text-decoration: none;
    }

    .ticket-id a:hover {
      text-decoration: underline;
    }

    .ticket-title {
      font-weight: 500;
      color: #1a1a2e;
      max-width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .ticket-date {
      font-size: 13px;
      color: #666;
    }

    .no-tickets {
      text-align: center;
      padding: 40px 20px;
      color: #666;
    }

    .stats-card .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 16px;
      background: #f8f9fa;
      border-radius: 8px;
      margin-bottom: 12px;
    }

    .stats-card .stat-item:last-child {
      margin-bottom: 0;
    }

    .stats-card .stat-value {
      font-size: 28px;
      font-weight: 700;
      color: #1a1a2e;
    }

    .stats-card .stat-label {
      color: #666;
      font-size: 13px;
      margin-top: 4px;
    }

    @media (max-width: 900px) {
      .detail-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class CustomerDetailComponent implements OnInit {
  customer: Customer | null = null;
  tickets: Ticket[] = [];
  loading = true;
  showDeleteConfirm = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private customerService: CustomerService,
    private ticketService: TicketService,
    public authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadCustomer(id);
    }
  }

  loadCustomer(id: string): void {
    this.loading = true;

    this.customerService.getCustomerById(id).subscribe({
      next: (customer) => {
        this.customer = customer;
        if (customer) {
          this.ticketService.getTicketsByCustomerId(customer.id).subscribe({
            next: (tickets) => {
              this.tickets = tickets;
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
        console.error('Failed to load customer:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  deleteCustomer(): void {
    this.showDeleteConfirm = false;

    this.customerService.deleteCustomer(this.customer!.id).subscribe({
      next: () => {
        this.router.navigate(['/customers']);
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to delete customer';
        this.cdr.detectChanges();
      }
    });
  }

  getDeleteMessage(): string {
    const ticketCount = this.tickets.length;
    if (ticketCount > 0) {
      return `Warning: This customer has ${ticketCount} associated ticket(s). Are you sure you want to delete "${this.customer?.name}"? This action cannot be undone.`;
    }
    return `Are you sure you want to delete "${this.customer?.name}"? This action cannot be undone.`;
  }

  getOpenTicketsCount(): number {
    return this.tickets.filter(t => t.status === 'Open').length;
  }

  getResolvedTicketsCount(): number {
    return this.tickets.filter(t => t.status === 'Resolved' || t.status === 'Closed').length;
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
      month: 'short',
      day: 'numeric'
    });
  }
}

