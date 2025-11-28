import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container" data-testid="login-page">
      <div class="login-card">
        <div class="login-header">
          <h1>Support Ticket Desk</h1>
          <p>Sign in to your account</p>
        </div>

        <form (ngSubmit)="onSubmit()" #loginForm="ngForm" class="login-form">
          <div class="form-group">
            <label for="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              [(ngModel)]="username"
              required
              data-testid="login-username"
              [class.error]="submitted && !username"
              placeholder="Enter your username"
            />
            <span class="error-message" *ngIf="submitted && !username" data-testid="username-error">
              Username is required
            </span>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              [(ngModel)]="password"
              required
              data-testid="login-password"
              [class.error]="submitted && !password"
              placeholder="Enter your password"
            />
            <span class="error-message" *ngIf="submitted && !password" data-testid="password-error">
              Password is required
            </span>
          </div>

          <div class="error-banner" *ngIf="errorMessage" data-testid="login-error">
            {{ errorMessage }}
          </div>

          <button
            type="submit"
            [disabled]="loading"
            data-testid="login-submit"
            class="login-button"
          >
            <span *ngIf="loading" class="spinner"></span>
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>

        <div class="login-hint">
          <p>Demo credentials:</p>
          <ul>
            <li><strong>Admin:</strong> admin / admin123</li>
            <li><strong>Agent:</strong> agent / agent123</li>
          </ul>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
      padding: 20px;
    }

    .login-card {
      background: #fff;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      width: 100%;
      max-width: 420px;
      padding: 40px;
    }

    .login-header {
      text-align: center;
      margin-bottom: 32px;
    }

    .login-header h1 {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 28px;
      color: #1a1a2e;
      margin: 0 0 8px 0;
      font-weight: 700;
    }

    .login-header p {
      color: #666;
      margin: 0;
      font-size: 15px;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .form-group label {
      font-weight: 600;
      font-size: 14px;
      color: #333;
    }

    .form-group input {
      padding: 14px 16px;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      font-size: 15px;
      transition: all 0.2s ease;
      background: #fafafa;
    }

    .form-group input:focus {
      outline: none;
      border-color: #0f3460;
      background: #fff;
      box-shadow: 0 0 0 3px rgba(15, 52, 96, 0.1);
    }

    .form-group input.error {
      border-color: #e74c3c;
      background: #fdf2f2;
    }

    .error-message {
      color: #e74c3c;
      font-size: 13px;
      font-weight: 500;
    }

    .error-banner {
      background: #fdf2f2;
      border: 1px solid #f5c6cb;
      color: #c0392b;
      padding: 12px 16px;
      border-radius: 8px;
      font-size: 14px;
      text-align: center;
    }

    .login-button {
      background: linear-gradient(135deg, #0f3460 0%, #16213e 100%);
      color: #fff;
      border: none;
      padding: 16px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .login-button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(15, 52, 96, 0.3);
    }

    .login-button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .spinner {
      width: 18px;
      height: 18px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .login-hint {
      margin-top: 28px;
      padding-top: 20px;
      border-top: 1px solid #eee;
      font-size: 13px;
      color: #666;
    }

    .login-hint p {
      margin: 0 0 8px 0;
      font-weight: 600;
      color: #444;
    }

    .login-hint ul {
      margin: 0;
      padding-left: 20px;
    }

    .login-hint li {
      margin: 4px 0;
    }

    .login-hint strong {
      color: #333;
    }
  `]
})
export class LoginComponent {
  username = '';
  password = '';
  loading = false;
  errorMessage = '';
  submitted = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';

    if (!this.username || !this.password) {
      return;
    }

    this.loading = true;

    this.authService.login(this.username, this.password).subscribe({
      next: (user) => {
        this.authService.setCurrentUser(user);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.errorMessage = err.message || 'An error occurred during login';
        this.loading = false;
      }
    });
  }
}

