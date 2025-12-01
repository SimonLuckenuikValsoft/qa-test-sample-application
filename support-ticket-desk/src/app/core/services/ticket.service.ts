import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Ticket, TicketFormData, TicketStatus, TicketPriority } from '../models';
import { SEED_TICKETS } from '../data';
import { AuthService } from './auth.service';

export interface TicketListResponse {
  tickets: Ticket[];
  total: number;
}

export interface TicketFilters {
  search?: string;
  status?: TicketStatus | '';
  priority?: TicketPriority | '';
  assignedTo?: string;
  customerId?: string;
}

export type SortField = 'updatedAt' | 'createdAt' | 'priority' | 'status' | 'title';
export type SortDirection = 'asc' | 'desc';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private tickets: Ticket[] = [];
  private nextTicketNumber = 106;

  constructor(private authService: AuthService) {
    this.resetData();
  }

  private getRandomDelay(): number {
    return 250 + Math.floor(Math.random() * 1750); // 250-2000ms
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
    this.tickets = JSON.parse(JSON.stringify(SEED_TICKETS)).map((t: Ticket) => ({
      ...t,
      createdAt: new Date(t.createdAt),
      updatedAt: new Date(t.updatedAt)
    }));
    this.nextTicketNumber = 106;
  }

  getTickets(
    page: number = 1,
    pageSize: number = 10,
    filters?: TicketFilters,
    sortField: SortField = 'updatedAt',
    sortDirection: SortDirection = 'desc'
  ): Observable<TicketListResponse> {
    let filtered = [...this.tickets];
    const currentUser = this.authService.currentUser;

    // Role-based filtering
    if (currentUser?.role === 'agent') {
      filtered = filtered.filter(
        t => t.assignedToUsername === currentUser.username
      );
    }

    // Apply filters
    if (filters) {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filtered = filtered.filter(
          t =>
            t.title.toLowerCase().includes(searchLower) ||
            t.description.toLowerCase().includes(searchLower) ||
            t.id.toLowerCase().includes(searchLower)
        );
      }

      if (filters.status) {
        filtered = filtered.filter(t => t.status === filters.status);
      }

      if (filters.priority) {
        filtered = filtered.filter(t => t.priority === filters.priority);
      }

      if (filters.assignedTo) {
        if (filters.assignedTo === 'me') {
          filtered = filtered.filter(
            t => t.assignedToUsername === currentUser?.username
          );
        } else if (filters.assignedTo !== 'all') {
          filtered = filtered.filter(
            t => t.assignedToUsername === filters.assignedTo
          );
        }
      }

      if (filters.customerId) {
        filtered = filtered.filter(t => t.customerId === filters.customerId);
      }
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case 'updatedAt':
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'priority':
          const priorityOrder = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
          comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedTickets = filtered.slice(start, end);

    return this.withDelay({ tickets: paginatedTickets, total });
  }

  getTicketById(id: string): Observable<Ticket | null> {
    const ticket = this.tickets.find(t => t.id === id);
    const currentUser = this.authService.currentUser;

    // Role-based access check
    if (ticket && currentUser?.role === 'agent') {
      if (ticket.assignedToUsername !== currentUser.username) {
        return this.withDelay(null);
      }
    }

    return this.withDelay(ticket ? { ...ticket } : null);
  }

  getTicketsByCustomerId(customerId: string): Observable<Ticket[]> {
    let filtered = this.tickets.filter(t => t.customerId === customerId);
    const currentUser = this.authService.currentUser;

    // Role-based filtering
    if (currentUser?.role === 'agent') {
      filtered = filtered.filter(
        t => t.assignedToUsername === currentUser.username
      );
    }

    return this.withDelay(filtered.map(t => ({ ...t })));
  }

  getRecentTickets(limit: number = 5): Observable<Ticket[]> {
    let filtered = [...this.tickets];
    const currentUser = this.authService.currentUser;

    // Role-based filtering
    if (currentUser?.role === 'agent') {
      filtered = filtered.filter(
        t => t.assignedToUsername === currentUser.username
      );
    }

    const sorted = filtered
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, limit);

    return this.withDelay(sorted.map(t => ({ ...t })));
  }

  getTicketStats(): Observable<{ open: number; assignedToMe: number; total: number }> {
    const currentUser = this.authService.currentUser;
    let relevantTickets = [...this.tickets];

    // Role-based filtering
    if (currentUser?.role === 'agent') {
      relevantTickets = relevantTickets.filter(
        t => t.assignedToUsername === currentUser.username
      );
    }

    const stats = {
      open: relevantTickets.filter(t => t.status === 'Open').length,
      assignedToMe: relevantTickets.filter(
        t => t.assignedToUsername === currentUser?.username
      ).length,
      total: relevantTickets.length
    };

    return this.withDelay(stats);
  }

  createTicket(data: TicketFormData): Observable<Ticket> {
    // Predictable error case for testing: title containing "FAIL_CREATE"
    if (data.title.includes('FAIL_CREATE')) {
      return this.withDelayError(new Error('Failed to create ticket: The ticket system is currently experiencing issues. Please try again later.'));
    }

    const newId = `TKT-${String(this.nextTicketNumber++).padStart(3, '0')}`;
    const now = new Date();
    const newTicket: Ticket = {
      id: newId,
      title: data.title,
      description: data.description,
      status: 'Open',
      priority: data.priority,
      createdAt: now,
      updatedAt: now,
      customerId: data.customerId,
      assignedToUsername: data.assignedToUsername,
      tags: data.tags
    };
    this.tickets.push(newTicket);
    return this.withDelay({ ...newTicket });
  }

  updateTicket(id: string, data: Partial<TicketFormData>): Observable<Ticket> {
    const index = this.tickets.findIndex(t => t.id === id);
    if (index === -1) {
      return this.withDelayError(new Error('Ticket not found'));
    }

    const currentUser = this.authService.currentUser;
    const ticket = this.tickets[index];

    // Role-based edit check
    if (currentUser?.role === 'agent') {
      if (ticket.assignedToUsername !== currentUser.username) {
        return this.withDelayError(new Error('You do not have permission to edit this ticket'));
      }
    }

    this.tickets[index] = {
      ...this.tickets[index],
      ...data,
      updatedAt: new Date()
    };
    return this.withDelay({ ...this.tickets[index] });
  }

  deleteTicket(id: string): Observable<boolean> {
    const currentUser = this.authService.currentUser;

    if (currentUser?.role !== 'admin') {
      return this.withDelayError(new Error('Only administrators can delete tickets'));
    }

    // Predictable error case for testing: ticket ID "TKT-001"
    if (id === 'TKT-001') {
      return this.withDelayError(new Error('Cannot delete ticket: This ticket is linked to an active SLA agreement and cannot be removed. Please contact your administrator.'));
    }

    const index = this.tickets.findIndex(t => t.id === id);
    if (index === -1) {
      return this.withDelayError(new Error('Ticket not found'));
    }

    this.tickets.splice(index, 1);
    return this.withDelay(true);
  }
}

