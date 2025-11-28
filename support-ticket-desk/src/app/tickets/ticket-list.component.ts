import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TicketService, TicketFilters, SortField, SortDirection } from '../core/services/ticket.service';
import { CustomerService } from '../core/services/customer.service';
import { AuthService } from '../core/services/auth.service';
import { Ticket, Customer, TicketStatus, TicketPriority } from '../core/models';
import { LoadingSpinnerComponent } from '../shared/components/loading-spinner.component';
import { PaginationComponent } from '../shared/components/pagination.component';

@Component({
  selector: 'app-ticket-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, LoadingSpinnerComponent, PaginationComponent],
  template: `
    <div class="ticket-list-page" data-testid="ticket-list-page">
      <header class="page-header">
        <div class="header-content">
          <h1>Tickets</h1>
          <p class="subtitle">Manage support tickets</p>
        </div>
        <button
          class="btn-primary"
          routerLink="/tickets/new"
          data-testid="create-ticket-button"
        >
          + Create Ticket
        </button>
      </header>

      <section class="filters-section" data-testid="ticket-filters">
        <div class="search-box">
          <input
            type="text"
            placeholder="Search by title, description, or ID..."
            [(ngModel)]="filters.search"
            (ngModelChange)="onFilterChange()"
            data-testid="ticket-search"
            class="search-input"
          />
        </div>

        <div class="filter-row">
          <div class="filter-group">
            <label>Status</label>
            <select
              [(ngModel)]="filters.status"
              (ngModelChange)="onFilterChange()"
              data-testid="filter-status"
            >
              <option value="">All Statuses</option>
              <option *ngFor="let status of statuses" [value]="status">{{ status }}</option>
            </select>
          </div>

          <div class="filter-group">
            <label>Priority</label>
            <select
              [(ngModel)]="filters.priority"
              (ngModelChange)="onFilterChange()"
              data-testid="filter-priority"
            >
              <option value="">All Priorities</option>
              <option *ngFor="let priority of priorities" [value]="priority">{{ priority }}</option>
            </select>
          </div>

          <div class="filter-group">
            <label>Assigned To</label>
            <select
              [(ngModel)]="filters.assignedTo"
              (ngModelChange)="onFilterChange()"
              data-testid="filter-assigned"
            >
              <option value="all">All</option>
              <option value="me">Assigned to Me</option>
              <option *ngIf="authService.isAdmin" value="admin">Admin</option>
              <option *ngIf="authService.isAdmin" value="agent">Agent</option>
            </select>
          </div>

          <div class="filter-group">
            <label>Customer</label>
            <select
              [(ngModel)]="filters.customerId"
              (ngModelChange)="onFilterChange()"
              data-testid="filter-customer"
            >
              <option value="">All Customers</option>
              <option *ngFor="let customer of customers" [value]="customer.id">
                {{ customer.name }}
              </option>
            </select>
          </div>

          <button
            class="btn-secondary"
            (click)="clearFilters()"
            data-testid="clear-filters"
          >
            Clear Filters
          </button>
        </div>
      </section>

      <section class="table-section">
        <div class="table-container" [class.loading]="loading">
          <app-loading-spinner *ngIf="loading" [overlay]="true"></app-loading-spinner>

          <table class="tickets-table" data-testid="ticket-table">
            <thead>
              <tr>
                <th class="sortable" (click)="toggleSort('title')" data-testid="sort-title">
                  ID / Title
                  <span class="sort-icon" *ngIf="sortField === 'title'">
                    {{ sortDirection === 'asc' ? '↑' : '↓' }}
                  </span>
                </th>
                <th>Customer</th>
                <th class="sortable" (click)="toggleSort('status')" data-testid="sort-status">
                  Status
                  <span class="sort-icon" *ngIf="sortField === 'status'">
                    {{ sortDirection === 'asc' ? '↑' : '↓' }}
                  </span>
                </th>
                <th class="sortable" (click)="toggleSort('priority')" data-testid="sort-priority">
                  Priority
                  <span class="sort-icon" *ngIf="sortField === 'priority'">
                    {{ sortDirection === 'asc' ? '↑' : '↓' }}
                  </span>
                </th>
                <th>Assigned To</th>
                <th class="sortable" (click)="toggleSort('updatedAt')" data-testid="sort-updated">
                  Updated
                  <span class="sort-icon" *ngIf="sortField === 'updatedAt'">
                    {{ sortDirection === 'asc' ? '↑' : '↓' }}
                  </span>
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                *ngFor="let ticket of tickets"
                [attr.data-testid]="'ticket-row-' + ticket.id"
              >
                <td>
                  <div class="ticket-id-title">
                    <span class="ticket-id">{{ ticket.id }}</span>
                    <span class="ticket-title">{{ ticket.title }}</span>
                  </div>
                </td>
                <td>
                  <span class="customer-name">{{ getCustomerName(ticket.customerId) }}</span>
                </td>
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
                <td>
                  <span class="assigned-to">{{ ticket.assignedToUsername }}</span>
                </td>
                <td class="date-cell">
                  {{ formatDate(ticket.updatedAt) }}
                </td>
                <td>
                  <div class="actions">
                    <a
                      [routerLink]="['/tickets', ticket.id]"
                      class="action-link view"
                      [attr.data-testid]="'view-ticket-' + ticket.id"
                    >
                      View
                    </a>
                    <a
                      [routerLink]="['/tickets', ticket.id, 'edit']"
                      class="action-link edit"
                      [attr.data-testid]="'edit-ticket-' + ticket.id"
                    >
                      Edit
                    </a>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <div class="empty-state" *ngIf="!loading && tickets.length === 0" data-testid="no-tickets">
            <p>No tickets found matching your criteria.</p>
          </div>
        </div>

        <app-pagination
          *ngIf="total > pageSize"
          [currentPage]="currentPage"
          [total]="total"
          [pageSize]="pageSize"
          (pageChange)="onPageChange($event)"
          testId="ticket-list-pagination"
        ></app-pagination>
      </section>
    </div>
  `,
  styles: [`
    .ticket-list-page {
      animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 24px;
    }

    .header-content h1 {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 32px;
      color: #1a1a2e;
      margin: 0 0 8px 0;
    }

    .subtitle {
      color: #666;
      font-size: 15px;
      margin: 0;
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
      text-decoration: none;
      display: inline-block;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(15, 52, 96, 0.3);
    }

    .btn-secondary {
      background: #f0f0f0;
      color: #333;
      border: none;
      padding: 10px 16px;
      border-radius: 6px;
      font-weight: 500;
      font-size: 13px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-secondary:hover {
      background: #e0e0e0;
    }

    .filters-section {
      background: #fff;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 20px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    }

    .search-box {
      margin-bottom: 16px;
    }

    .search-input {
      width: 100%;
      padding: 12px 16px;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      font-size: 14px;
      transition: all 0.2s ease;
    }

    .search-input:focus {
      outline: none;
      border-color: #0f3460;
      box-shadow: 0 0 0 3px rgba(15, 52, 96, 0.1);
    }

    .filter-row {
      display: flex;
      gap: 16px;
      align-items: flex-end;
      flex-wrap: wrap;
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
      min-width: 160px;
    }

    .filter-group label {
      font-size: 12px;
      font-weight: 600;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .filter-group select {
      padding: 10px 12px;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 14px;
      background: #fff;
      cursor: pointer;
    }

    .filter-group select:focus {
      outline: none;
      border-color: #0f3460;
    }

    .table-section {
      background: #fff;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    }

    .table-container {
      position: relative;
      min-height: 200px;
    }

    .table-container.loading {
      min-height: 400px;
    }

    .tickets-table {
      width: 100%;
      border-collapse: collapse;
    }

    .tickets-table th,
    .tickets-table td {
      padding: 14px 16px;
      text-align: left;
      border-bottom: 1px solid #eee;
    }

    .tickets-table th {
      font-weight: 600;
      color: #666;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      background: #f8f9fa;
    }

    .tickets-table th.sortable {
      cursor: pointer;
      user-select: none;
    }

    .tickets-table th.sortable:hover {
      background: #f0f0f0;
    }

    .sort-icon {
      margin-left: 4px;
    }

    .tickets-table tbody tr:hover {
      background: #f8f9fa;
    }

    .ticket-id-title {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .ticket-id {
      font-family: 'Monaco', 'Consolas', monospace;
      font-size: 12px;
      color: #666;
    }

    .ticket-title {
      font-weight: 500;
      color: #1a1a2e;
      max-width: 280px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .customer-name {
      font-size: 13px;
      color: #333;
    }

    .assigned-to {
      font-size: 13px;
      color: #333;
      text-transform: capitalize;
    }

    .date-cell {
      font-size: 13px;
      color: #666;
      white-space: nowrap;
    }

    .status-badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      white-space: nowrap;
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

    .actions {
      display: flex;
      gap: 12px;
    }

    .action-link {
      font-size: 13px;
      font-weight: 500;
      text-decoration: none;
      transition: color 0.2s ease;
    }

    .action-link.view {
      color: #0f3460;
    }

    .action-link.edit {
      color: #27ae60;
    }

    .action-link:hover {
      text-decoration: underline;
    }

    .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: #666;
    }
  `]
})
export class TicketListComponent implements OnInit {
  tickets: Ticket[] = [];
  customers: Customer[] = [];
  loading = true;
  currentPage = 1;
  pageSize = 10;
  total = 0;

  filters: TicketFilters = {
    search: '',
    status: '',
    priority: '',
    assignedTo: 'all',
    customerId: ''
  };

  sortField: SortField = 'updatedAt';
  sortDirection: SortDirection = 'desc';

  statuses: TicketStatus[] = ['Open', 'In Progress', 'Resolved', 'Closed'];
  priorities: TicketPriority[] = ['Low', 'Medium', 'High', 'Critical'];

  private filterDebounceTimer: any;

  constructor(
    private ticketService: TicketService,
    private customerService: CustomerService,
    public authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCustomers();
    this.loadTickets();
  }

  loadCustomers(): void {
    this.customerService.getAllCustomers().subscribe({
      next: (customers) => {
        this.customers = customers;
        this.cdr.detectChanges();
      }
    });
  }

  loadTickets(): void {
    this.loading = true;

    this.ticketService.getTickets(
      this.currentPage,
      this.pageSize,
      this.filters,
      this.sortField,
      this.sortDirection
    ).subscribe({
      next: (response) => {
        this.tickets = response.tickets;
        this.total = response.total;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load tickets:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onFilterChange(): void {
    clearTimeout(this.filterDebounceTimer);
    this.filterDebounceTimer = setTimeout(() => {
      this.currentPage = 1;
      this.loadTickets();
    }, 300);
  }

  clearFilters(): void {
    this.filters = {
      search: '',
      status: '',
      priority: '',
      assignedTo: 'all',
      customerId: ''
    };
    this.currentPage = 1;
    this.loadTickets();
  }

  toggleSort(field: SortField): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'desc';
    }
    this.loadTickets();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadTickets();
  }

  getCustomerName(customerId: string): string {
    const customer = this.customers.find(c => c.id === customerId);
    return customer?.name || customerId;
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

