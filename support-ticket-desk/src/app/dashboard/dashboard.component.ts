import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TicketService } from '../core/services/ticket.service';
import { CustomerService } from '../core/services/customer.service';
import { AuthService } from '../core/services/auth.service';
import { Ticket } from '../core/models';
import { LoadingSpinnerComponent } from '../shared/components/loading-spinner.component';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, LoadingSpinnerComponent],
  template: `
    <div class="dashboard" data-testid="dashboard-page">
      <header class="page-header">
        <h1>Dashboard</h1>
        <p class="subtitle">Welcome back, {{ authService.currentUser?.username }}!</p>
      </header>

      <app-loading-spinner *ngIf="loading" message="Loading dashboard..."></app-loading-spinner>

      <div class="dashboard-content" *ngIf="!loading">
        <section class="stats-grid">
          <div class="stat-card" data-testid="stat-open-tickets">
            <div class="stat-icon open">🎫</div>
            <div class="stat-info">
              <span class="stat-value">{{ stats.open }}</span>
              <span class="stat-label">Open Tickets</span>
            </div>
          </div>

          <div class="stat-card" data-testid="stat-assigned-tickets">
            <div class="stat-icon assigned">📋</div>
            <div class="stat-info">
              <span class="stat-value">{{ stats.assignedToMe }}</span>
              <span class="stat-label">Assigned to Me</span>
            </div>
          </div>

          <div class="stat-card" data-testid="stat-total-tickets">
            <div class="stat-icon total">📊</div>
            <div class="stat-info">
              <span class="stat-value">{{ stats.total }}</span>
              <span class="stat-label">Total Tickets</span>
            </div>
          </div>

          <div class="stat-card" data-testid="stat-customers">
            <div class="stat-icon customers">👥</div>
            <div class="stat-info">
              <span class="stat-value">{{ customerCount }}</span>
              <span class="stat-label">Customers</span>
            </div>
          </div>
        </section>

        <section class="recent-tickets">
          <div class="section-header">
            <h2>Recent Tickets</h2>
            <a routerLink="/tickets" class="view-all" data-testid="view-all-tickets">
              View All →
            </a>
          </div>

          <div class="tickets-table-wrapper">
            <table class="tickets-table" data-testid="recent-tickets-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Updated</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  *ngFor="let ticket of recentTickets"
                  [attr.data-testid]="'recent-ticket-row-' + ticket.id"
                >
                  <td class="ticket-id">{{ ticket.id }}</td>
                  <td class="ticket-title">{{ ticket.title }}</td>
                  <td>
                    <span class="status-badge" [class]="getStatusClass(ticket.status)">
                      {{ ticket.status }}
                    </span>
                  </td>
                  <td>
                    <span class="priority-badge" [class]="getPriorityClass(ticket.priority)">
                      {{ ticket.priority }}
                    </span>
                  </td>
                  <td class="ticket-date">{{ formatDate(ticket.updatedAt) }}</td>
                  <td>
                    <a
                      [routerLink]="['/tickets', ticket.id]"
                      class="action-link"
                      [attr.data-testid]="'view-ticket-' + ticket.id"
                    >
                      View
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="empty-state" *ngIf="recentTickets.length === 0" data-testid="no-recent-tickets">
            <p>No recent tickets to display.</p>
          </div>
        </section>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .page-header {
      margin-bottom: 32px;
    }

    .page-header h1 {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 32px;
      color: #1a1a2e;
      margin: 0 0 8px 0;
    }

    .subtitle {
      color: #666;
      font-size: 16px;
      margin: 0;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 20px;
      margin-bottom: 32px;
    }

    .stat-card {
      background: #fff;
      border-radius: 12px;
      padding: 24px;
      display: flex;
      align-items: center;
      gap: 20px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
      transition: all 0.2s ease;
    }

    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    }

    .stat-icon {
      width: 56px;
      height: 56px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
    }

    .stat-icon.open { background: linear-gradient(135deg, #e74c3c20 0%, #e74c3c40 100%); }
    .stat-icon.assigned { background: linear-gradient(135deg, #3498db20 0%, #3498db40 100%); }
    .stat-icon.total { background: linear-gradient(135deg, #9b59b620 0%, #9b59b640 100%); }
    .stat-icon.customers { background: linear-gradient(135deg, #27ae6020 0%, #27ae6040 100%); }

    .stat-info {
      display: flex;
      flex-direction: column;
    }

    .stat-value {
      font-size: 32px;
      font-weight: 700;
      color: #1a1a2e;
      line-height: 1;
    }

    .stat-label {
      color: #666;
      font-size: 14px;
      margin-top: 4px;
    }

    .recent-tickets {
      background: #fff;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    }

    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
    }

    .section-header h2 {
      font-size: 18px;
      color: #1a1a2e;
      margin: 0;
    }

    .view-all {
      color: #0f3460;
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      transition: color 0.2s ease;
    }

    .view-all:hover {
      color: #e94560;
    }

    .tickets-table-wrapper {
      overflow-x: auto;
    }

    .tickets-table {
      width: 100%;
      border-collapse: collapse;
    }

    .tickets-table th,
    .tickets-table td {
      padding: 12px 16px;
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

    .ticket-id {
      font-family: 'Monaco', 'Consolas', monospace;
      font-size: 13px;
      color: #666;
    }

    .ticket-title {
      font-weight: 500;
      color: #1a1a2e;
      max-width: 300px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .ticket-date {
      font-size: 13px;
      color: #666;
    }

    .status-badge {
      display: inline-block;
      padding: 4px 10px;
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
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
    }

    .priority-badge.low { background: #e2e3e5; color: #383d41; }
    .priority-badge.medium { background: #fff3cd; color: #856404; }
    .priority-badge.high { background: #f8d7da; color: #721c24; }
    .priority-badge.critical { background: #721c24; color: #fff; }

    .action-link {
      color: #0f3460;
      text-decoration: none;
      font-weight: 500;
      font-size: 13px;
    }

    .action-link:hover {
      text-decoration: underline;
    }

    .empty-state {
      text-align: center;
      padding: 40px;
      color: #666;
    }
  `]
})
export class DashboardComponent implements OnInit {
  loading = true;
  stats = { open: 0, assignedToMe: 0, total: 0 };
  customerCount = 0;
  recentTickets: Ticket[] = [];

  constructor(
    private ticketService: TicketService,
    private customerService: CustomerService,
    public authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loading = true;

    forkJoin({
      stats: this.ticketService.getTicketStats(),
      customers: this.customerService.getCustomers(1, 1),
      recentTickets: this.ticketService.getRecentTickets(5)
    }).subscribe({
      next: (data) => {
        this.stats = data.stats;
        this.customerCount = data.customers.total;
        this.recentTickets = data.recentTickets;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load dashboard:', err);
        this.loading = false;
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
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}

