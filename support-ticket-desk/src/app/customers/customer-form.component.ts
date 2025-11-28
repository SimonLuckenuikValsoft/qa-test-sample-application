import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CustomerService } from '../core/services/customer.service';
import { AuthService } from '../core/services/auth.service';
import { CustomerFormData, SlaLevel } from '../core/models';
import { LoadingSpinnerComponent } from '../shared/components/loading-spinner.component';
import { AlertComponent } from '../shared/components/alert.component';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, LoadingSpinnerComponent, AlertComponent],
  template: `
    <div class="customer-form-page" data-testid="customer-form-page">
      <app-loading-spinner *ngIf="loading" message="Loading..."></app-loading-spinner>

      <div *ngIf="!loading">
        <header class="page-header">
          <a [routerLink]="isEdit ? ['/customers', customerId] : '/customers'" class="back-link">
            ← Back
          </a>
          <h1>{{ isEdit ? 'Edit Customer' : 'Add New Customer' }}</h1>
        </header>

        <app-alert
          *ngIf="errorMessage"
          type="error"
          [message]="errorMessage"
          (close)="errorMessage = ''"
        ></app-alert>

        <div class="form-card">
          <form (ngSubmit)="onSubmit()" #customerForm="ngForm">
            <div class="form-row">
              <div class="form-group">
                <label for="name">Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  [(ngModel)]="formData.name"
                  required
                  data-testid="customer-form-name"
                  [class.error]="submitted && !formData.name"
                  placeholder="Customer or company name"
                />
                <span class="error-text" *ngIf="submitted && !formData.name">Name is required</span>
              </div>

              <div class="form-group">
                <label for="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  [(ngModel)]="formData.email"
                  required
                  email
                  data-testid="customer-form-email"
                  [class.error]="submitted && !formData.email"
                  placeholder="contact@example.com"
                />
                <span class="error-text" *ngIf="submitted && !formData.email">Valid email is required</span>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group full-width">
                <label for="company">Company *</label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  [(ngModel)]="formData.company"
                  required
                  data-testid="customer-form-company"
                  [class.error]="submitted && !formData.company"
                  placeholder="Company name"
                />
                <span class="error-text" *ngIf="submitted && !formData.company">Company is required</span>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="slaLevel">SLA Level *</label>
                <select
                  id="slaLevel"
                  name="slaLevel"
                  [(ngModel)]="formData.slaLevel"
                  required
                  data-testid="customer-form-sla"
                >
                  <option *ngFor="let level of slaLevels" [value]="level">{{ level }}</option>
                </select>
              </div>

              <div class="form-group">
                <label for="isActive">Status</label>
                <div class="toggle-container">
                  <label class="toggle">
                    <input
                      type="checkbox"
                      id="isActive"
                      name="isActive"
                      [(ngModel)]="formData.isActive"
                      data-testid="customer-form-active"
                    />
                    <span class="toggle-slider"></span>
                  </label>
                  <span class="toggle-label">{{ formData.isActive ? 'Active' : 'Inactive' }}</span>
                </div>
              </div>
            </div>

            <div class="form-actions">
              <a
                [routerLink]="isEdit ? ['/customers', customerId] : '/customers'"
                class="btn-secondary"
                data-testid="customer-form-cancel"
              >
                Cancel
              </a>
              <button
                type="submit"
                class="btn-primary"
                [disabled]="saving"
                data-testid="customer-form-save"
              >
                {{ saving ? 'Saving...' : (isEdit ? 'Update Customer' : 'Add Customer') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .customer-form-page {
      max-width: 700px;
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
    .form-group select {
      padding: 12px 14px;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 14px;
      transition: all 0.2s ease;
      font-family: inherit;
    }

    .form-group input:focus,
    .form-group select:focus {
      outline: none;
      border-color: #0f3460;
      box-shadow: 0 0 0 3px rgba(15, 52, 96, 0.1);
    }

    .form-group input.error,
    .form-group select.error {
      border-color: #e74c3c;
    }

    .error-text {
      color: #e74c3c;
      font-size: 13px;
    }

    .toggle-container {
      display: flex;
      align-items: center;
      gap: 12px;
      padding-top: 8px;
    }

    .toggle {
      position: relative;
      display: inline-block;
      width: 50px;
      height: 28px;
    }

    .toggle input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .toggle-slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #ccc;
      transition: 0.3s;
      border-radius: 28px;
    }

    .toggle-slider:before {
      position: absolute;
      content: "";
      height: 22px;
      width: 22px;
      left: 3px;
      bottom: 3px;
      background-color: white;
      transition: 0.3s;
      border-radius: 50%;
    }

    .toggle input:checked + .toggle-slider {
      background-color: #27ae60;
    }

    .toggle input:checked + .toggle-slider:before {
      transform: translateX(22px);
    }

    .toggle-label {
      font-size: 14px;
      color: #333;
      font-weight: 500;
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
export class CustomerFormComponent implements OnInit {
  isEdit = false;
  customerId: string | null = null;
  loading = true;
  saving = false;
  submitted = false;
  errorMessage = '';

  slaLevels: SlaLevel[] = ['Gold', 'Silver', 'Bronze'];

  formData: CustomerFormData = {
    name: '',
    email: '',
    company: '',
    slaLevel: 'Silver',
    isActive: true
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private customerService: CustomerService,
    public authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Only admins can access this page
    if (!this.authService.isAdmin) {
      this.router.navigate(['/customers']);
      return;
    }

    this.customerId = this.route.snapshot.paramMap.get('id');
    this.isEdit = this.customerId !== null && this.customerId !== 'new';

    if (this.isEdit && this.customerId) {
      this.loadCustomer(this.customerId);
    } else {
      this.loading = false;
    }
  }

  loadCustomer(id: string): void {
    this.customerService.getCustomerById(id).subscribe({
      next: (customer) => {
        if (customer) {
          this.formData = {
            name: customer.name,
            email: customer.email,
            company: customer.company,
            slaLevel: customer.slaLevel,
            isActive: customer.isActive
          };
        }
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load customer:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';

    if (!this.formData.name || !this.formData.email || !this.formData.company) {
      return;
    }

    this.saving = true;

    if (this.isEdit && this.customerId) {
      this.customerService.updateCustomer(this.customerId, this.formData).subscribe({
        next: (customer) => {
          this.router.navigate(['/customers', customer.id]);
        },
        error: (err) => {
          this.errorMessage = err.message || 'Failed to update customer';
          this.saving = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      this.customerService.createCustomer(this.formData).subscribe({
        next: (customer) => {
          this.router.navigate(['/customers', customer.id]);
        },
        error: (err) => {
          this.errorMessage = err.message || 'Failed to create customer';
          this.saving = false;
          this.cdr.detectChanges();
        }
      });
    }
  }
}

