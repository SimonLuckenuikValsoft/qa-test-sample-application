import { Injectable } from '@angular/core';
import { CustomerService } from './customer.service';
import { TicketService } from './ticket.service';
import { CommentService } from './comment.service';

@Injectable({
  providedIn: 'root'
})
export class DataResetService {
  constructor(
    private customerService: CustomerService,
    private ticketService: TicketService,
    private commentService: CommentService
  ) {}

  resetAllData(): void {
    this.customerService.resetData();
    this.ticketService.resetData();
    this.commentService.resetData();
  }
}


