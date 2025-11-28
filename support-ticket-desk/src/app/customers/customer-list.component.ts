import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CustomerService, CustomerFilters } from '../core/services/customer.service';
import { AuthService } from '../core/services/auth.service';
import { Customer, SlaLevel } from '../core/models';
import { LoadingSpinnerComponent } from '../shared/components/loading-spinner.component';
import { PaginationComponent } from '../shared/components/pagination.component';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, LoadingSpinnerComponent, PaginationComponent],
  template: `
    <div class="customer-list-page" data-testid="customer-list-page">
      <header class="page-header">
        <div class="header-content">
          <h1>Customers</h1>
          <p class="subtitle">Manage customer accounts</p>
        </div>
        <button
          *ngIf="authService.isAdmin"
          class="btn-primary"
          routerLink="/customers/new"
          data-testid="create-customer-button"
        >
          + Add Customer
        </button>
      </header>

      <section class="filters-section" data-testid="customer-filters">
        <div class="search-box">
          <input
            type="text"
            placeholder="Search by name, email, or company..."
            [(ngModel)]="filters.search"
            (ngModelChange)="onFilterChange()"
            data-testid="customer-search"
            class="search-input"
          />
        </div>

        <div class="filter-row">
          <div class="filter-group">
            <label>SLA Level</label>
            <select
              [(ngModel)]="filters.slaLevel"
              (ngModelChange)="onFilterChange()"
              data-testid="filter-sla"
            >
              <option value="">All Levels</option>
              <option *ngFor="let level of slaLevels" [value]="level">{{ level }}</option>
            </select>
          </div>

          <div class="filter-group">
            <label>Status</label>
            <select
              [(ngModel)]="activeFilter"
              (ngModelChange)="onActiveFilterChange()"
              data-testid="filter-active"
            >
              <option value="all">All</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
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

          <table class="customers-table" data-testid="customer-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Company</th>
                <th>SLA Level</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                *ngFor="let customer of customers"
                [attr.data-testid]="'customer-row-' + customer.id"
              >
                <td class="customer-id">{{ customer.id }}</td>
                <td class="customer-name">{{ customer.name }}</td>
                <td class="customer-email">{{ customer.email }}</td>
                <td class="customer-company">{{ customer.company }}</td>
                <td>
                  <span class="sla-badge" [class]="customer.slaLevel.toLowerCase()">
                    {{ customer.slaLevel }}
                  </span>
                </td>
                <td>
                  <span
                    class="status-badge"
                    [class.active]="customer.isActive"
                    [class.inactive]="!customer.isActive"
                  >
                    {{ customer.isActive ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td>
                  <div class="actions">
                    <a
                      [routerLink]="['/customers', customer.id]"
                      class="action-link view"
                      [attr.data-testid]="'view-customer-' + customer.id"
                    >
                      View
                    </a>
                    <a
                      *ngIf="authService.isAdmin"
                      [routerLink]="['/customers', customer.id, 'edit']"
                      class="action-link edit"
                      [attr.data-testid]="'edit-customer-' + customer.id"
                    >
                      Edit
                    </a>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <div class="empty-state" *ngIf="!loading && customers.length === 0" data-testid="no-customers">
            <p>No customers found matching your criteria.</p>
          </div>
        </div>

        <app-pagination
          *ngIf="total > pageSize"
          [currentPage]="currentPage"
          [total]="total"
          [pageSize]="pageSize"
          (pageChange)="onPageChange($event)"
          testId="customer-list-pagination"
        ></app-pagination>
      </section>
    </div>
  `,
  styles: [`
    .customer-list-page {
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

    .customers-table {
      width: 100%;
      border-collapse: collapse;
    }

    .customers-table th,
    .customers-table td {
      padding: 14px 16px;
      text-align: left;
      border-bottom: 1px solid #eee;
    }

    .customers-table th {
      font-weight: 600;
      color: #666;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      background: #f8f9fa;
    }

    .customers-table tbody tr:hover {
      background: #f8f9fa;
    }

    .customer-id {
      font-family: 'Monaco', 'Consolas', monospace;
      font-size: 12px;
      color: #666;
    }

    .customer-name {
      font-weight: 500;
      color: #1a1a2e;
    }

    .customer-email {
      font-size: 13px;
      color: #666;
    }

    .customer-company {
      font-size: 13px;
      color: #333;
    }

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

    .status-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
    }

    .status-badge.active {
      background: #d4edda;
      color: #155724;
    }

    .status-badge.inactive {
      background: #f8d7da;
      color: #721c24;
    }

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
export class CustomerListComponent implements OnInit {
  customers: Customer[] = [];
  loading = true;
  currentPage = 1;
  pageSize = 10;
  total = 0;

  filters: CustomerFilters = {
    search: '',
    slaLevel: '',
    isActive: null
  };

  activeFilter = 'all';
  slaLevels: SlaLevel[] = ['Gold', 'Silver', 'Bronze'];

  private filterDebounceTimer: any;

  constructor(
    private customerService: CustomerService,
    public authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.loading = true;

    this.customerService.getCustomers(this.currentPage, this.pageSize, this.filters).subscribe({
      next: (response) => {
        this.customers = response.customers;
        this.total = response.total;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load customers:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onFilterChange(): void {
    clearTimeout(this.filterDebounceTimer);
    this.filterDebounceTimer = setTimeout(() => {
      this.currentPage = 1;
      this.loadCustomers();
    }, 300);
  }

  onActiveFilterChange(): void {
    if (this.activeFilter === 'all') {
      this.filters.isActive = null;
    } else if (this.activeFilter === 'active') {
      this.filters.isActive = true;
    } else {
      this.filters.isActive = false;
    }
    this.currentPage = 1;
    this.loadCustomers();
  }

  clearFilters(): void {
    this.filters = {
      search: '',
      slaLevel: '',
      isActive: null
    };
    this.activeFilter = 'all';
    this.currentPage = 1;
    this.loadCustomers();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadCustomers();
  }
}

