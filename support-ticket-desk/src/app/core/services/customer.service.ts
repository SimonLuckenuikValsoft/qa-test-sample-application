import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer, CustomerFormData } from '../models';
import { SEED_CUSTOMERS } from '../data';

export interface CustomerListResponse {
  customers: Customer[];
  total: number;
}

export interface CustomerFilters {
  search?: string;
  slaLevel?: string;
  isActive?: boolean | null;
}

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private customers: Customer[] = [];

  constructor() {
    this.resetData();
  }

  private getRandomDelay(): number {
    // Random delay between 250-1000ms for realistic network simulation
    return 250 + Math.floor(Math.random() * 750);
  }

  private withDelay<T>(value: T): Observable<T> {
    return new Observable<T>(subscriber => {
      const delay = this.getRandomDelay();
      const timeoutId = setTimeout(() => {
        subscriber.next(value);
        subscriber.complete();
      }, delay);
      return () => clearTimeout(timeoutId);
    });
  }

  private withDelayError(error: Error): Observable<never> {
    return new Observable<never>(subscriber => {
      const delay = this.getRandomDelay();
      const timeoutId = setTimeout(() => {
        subscriber.error(error);
      }, delay);
      return () => clearTimeout(timeoutId);
    });
  }

  resetData(): void {
    this.customers = JSON.parse(JSON.stringify(SEED_CUSTOMERS));
  }

  getCustomers(
    page: number = 1,
    pageSize: number = 10,
    filters?: CustomerFilters
  ): Observable<CustomerListResponse> {
    let filtered = [...this.customers];

    if (filters) {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filtered = filtered.filter(
          c =>
            c.name.toLowerCase().includes(searchLower) ||
            c.email.toLowerCase().includes(searchLower) ||
            c.company.toLowerCase().includes(searchLower)
        );
      }

      if (filters.slaLevel) {
        filtered = filtered.filter(c => c.slaLevel === filters.slaLevel);
      }

      if (filters.isActive !== null && filters.isActive !== undefined) {
        filtered = filtered.filter(c => c.isActive === filters.isActive);
      }
    }

    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedCustomers = filtered.slice(start, end);

    return this.withDelay({ customers: paginatedCustomers, total });
  }

  getAllCustomers(): Observable<Customer[]> {
    return this.withDelay([...this.customers]);
  }

  getCustomerById(id: string): Observable<Customer | null> {
    const customer = this.customers.find(c => c.id === id);
    return this.withDelay(customer ? { ...customer } : null);
  }

  createCustomer(data: CustomerFormData): Observable<Customer> {
    const newId = `CUST-${String(this.customers.length + 1).padStart(3, '0')}`;
    const newCustomer: Customer = {
      id: newId,
      ...data
    };
    this.customers.push(newCustomer);
    return this.withDelay({ ...newCustomer });
  }

  updateCustomer(id: string, data: Partial<CustomerFormData>): Observable<Customer> {
    const index = this.customers.findIndex(c => c.id === id);
    if (index === -1) {
      return this.withDelayError(new Error('Customer not found'));
    }

    this.customers[index] = { ...this.customers[index], ...data };
    return this.withDelay({ ...this.customers[index] });
  }

  deleteCustomer(id: string): Observable<boolean> {
    // Predictable error case for testing
    if (id === 'CUST-ERROR') {
      return this.withDelayError(new Error('Cannot delete customer: This customer has active contracts and cannot be removed. Please contact support for assistance.'));
    }

    const index = this.customers.findIndex(c => c.id === id);
    if (index === -1) {
      return this.withDelayError(new Error('Customer not found'));
    }

    this.customers.splice(index, 1);
    return this.withDelay(true);
  }
}

