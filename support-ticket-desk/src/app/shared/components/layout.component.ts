import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="app-layout" data-testid="app-layout">
      <nav class="top-nav" data-testid="main-navigation">
        <div class="nav-brand">
          <span class="brand-icon">🎫</span>
          <span class="brand-text">Support Desk</span>
        </div>

        <div class="nav-links">
          <a
            routerLink="/dashboard"
            routerLinkActive="active"
            data-testid="nav-dashboard"
            class="nav-link"
          >
            <span class="nav-icon">📊</span>
            Dashboard
          </a>
          <a
            routerLink="/tickets"
            routerLinkActive="active"
            data-testid="nav-tickets"
            class="nav-link"
          >
            <span class="nav-icon">🎫</span>
            Tickets
          </a>
          <a
            routerLink="/customers"
            routerLinkActive="active"
            data-testid="nav-customers"
            class="nav-link"
          >
            <span class="nav-icon">👥</span>
            Customers
          </a>
        </div>

        <div class="nav-user">
          <div class="user-info" data-testid="user-info">
            <span class="user-avatar">{{ getUserInitial() }}</span>
            <div class="user-details">
              <span class="user-name">{{ authService.currentUser?.username }}</span>
              <span class="user-role" [class]="authService.currentUser?.role">
                {{ authService.currentUser?.role | titlecase }}
              </span>
            </div>
          </div>
          <button
            (click)="logout()"
            class="logout-button"
            data-testid="logout-button"
          >
            Logout
          </button>
        </div>
      </nav>

      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-layout {
      min-height: 100vh;
      background: #f5f6fa;
    }

    .top-nav {
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      padding: 0 24px;
      display: flex;
      align-items: center;
      height: 64px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .nav-brand {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-right: 40px;
    }

    .brand-icon {
      font-size: 24px;
    }

    .brand-text {
      color: #fff;
      font-size: 20px;
      font-weight: 700;
      font-family: 'Playfair Display', Georgia, serif;
    }

    .nav-links {
      display: flex;
      gap: 4px;
      flex: 1;
    }

    .nav-link {
      color: rgba(255, 255, 255, 0.75);
      text-decoration: none;
      padding: 10px 20px;
      border-radius: 8px;
      font-weight: 500;
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s ease;
    }

    .nav-link:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
    }

    .nav-link.active {
      background: rgba(255, 255, 255, 0.15);
      color: #fff;
    }

    .nav-icon {
      font-size: 16px;
    }

    .nav-user {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .user-avatar {
      width: 36px;
      height: 36px;
      background: linear-gradient(135deg, #e94560 0%, #ff6b6b 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-weight: 700;
      font-size: 14px;
      text-transform: uppercase;
    }

    .user-details {
      display: flex;
      flex-direction: column;
    }

    .user-name {
      color: #fff;
      font-weight: 600;
      font-size: 14px;
    }

    .user-role {
      font-size: 11px;
      padding: 2px 8px;
      border-radius: 10px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .user-role.admin {
      background: #e94560;
      color: #fff;
    }

    .user-role.agent {
      background: #0f9b0f;
      color: #fff;
    }

    .logout-button {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: #fff;
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      font-size: 13px;
      transition: all 0.2s ease;
    }

    .logout-button:hover {
      background: rgba(255, 255, 255, 0.2);
      border-color: rgba(255, 255, 255, 0.3);
    }

    .main-content {
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
    }
  `]
})
export class LayoutComponent {
  constructor(public authService: AuthService, private router: Router) {}

  getUserInitial(): string {
    return this.authService.currentUser?.username?.charAt(0).toUpperCase() || '?';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

