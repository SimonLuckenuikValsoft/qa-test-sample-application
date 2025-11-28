import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Comment, CommentFormData } from '../models';
import { SEED_COMMENTS } from '../data';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private comments: Comment[] = [];
  private nextCommentNumber = 206;

  constructor(private authService: AuthService) {
    this.resetData();
  }

  private getRandomDelay(): number {
    return 250 + Math.floor(Math.random() * 750); // 250-1000ms
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
    this.comments = JSON.parse(JSON.stringify(SEED_COMMENTS)).map((c: Comment) => ({
      ...c,
      createdAt: new Date(c.createdAt)
    }));
    this.nextCommentNumber = 206;
  }

  getCommentsByTicketId(ticketId: string): Observable<Comment[]> {
    const ticketComments = this.comments
      .filter(c => c.ticketId === ticketId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    return this.withDelay(ticketComments.map(c => ({ ...c })));
  }

  addComment(ticketId: string, data: CommentFormData): Observable<Comment> {
    const currentUser = this.authService.currentUser;

    if (!currentUser) {
      return this.withDelayError(new Error('You must be logged in to add a comment'));
    }

    const newId = `CMT-${String(this.nextCommentNumber++).padStart(3, '0')}`;
    const newComment: Comment = {
      id: newId,
      ticketId,
      authorUsername: currentUser.username,
      message: data.message,
      createdAt: new Date()
    };

    this.comments.push(newComment);
    return this.withDelay({ ...newComment });
  }
}

