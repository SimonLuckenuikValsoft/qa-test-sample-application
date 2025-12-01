import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User, LoggedInUser } from '../models';
import { SEED_USERS } from '../data';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<LoggedInUser | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {}

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

  get currentUser(): LoggedInUser | null {
    return this.currentUserSubject.value;
  }

  get isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  get isAdmin(): boolean {
    return this.currentUserSubject.value?.role === 'admin';
  }

  get isAgent(): boolean {
    return this.currentUserSubject.value?.role === 'agent';
  }

  login(username: string, password: string): Observable<LoggedInUser> {
    const user = SEED_USERS.find(
      u => u.username === username && u.password === password
    );

    if (user) {
      const loggedInUser: LoggedInUser = {
        username: user.username,
        role: user.role
      };
      return this.withDelay(loggedInUser);
    }

    return this.withDelayError(new Error('Invalid username or password'));
  }

  setCurrentUser(user: LoggedInUser): void {
    this.currentUserSubject.next(user);
  }

  logout(): void {
    this.currentUserSubject.next(null);
  }

  getAvailableAssignees(): string[] {
    return SEED_USERS.map(u => u.username);
  }
}

