import { Routes } from '@angular/router';
import { authGuard, loginGuard, adminGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/login.component').then(m => m.LoginComponent),
    canActivate: [loginGuard]
  },
  {
    path: '',
    loadComponent: () => import('./shared/components/layout.component').then(m => m.LayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'tickets',
        loadComponent: () => import('./tickets/ticket-list.component').then(m => m.TicketListComponent)
      },
      {
        path: 'tickets/new',
        loadComponent: () => import('./tickets/ticket-form.component').then(m => m.TicketFormComponent)
      },
      {
        path: 'tickets/:id',
        loadComponent: () => import('./tickets/ticket-detail.component').then(m => m.TicketDetailComponent)
      },
      {
        path: 'tickets/:id/edit',
        loadComponent: () => import('./tickets/ticket-form.component').then(m => m.TicketFormComponent)
      },
      {
        path: 'customers',
        loadComponent: () => import('./customers/customer-list.component').then(m => m.CustomerListComponent)
      },
      {
        path: 'customers/new',
        loadComponent: () => import('./customers/customer-form.component').then(m => m.CustomerFormComponent),
        canActivate: [adminGuard]
      },
      {
        path: 'customers/:id',
        loadComponent: () => import('./customers/customer-detail.component').then(m => m.CustomerDetailComponent)
      },
      {
        path: 'customers/:id/edit',
        loadComponent: () => import('./customers/customer-form.component').then(m => m.CustomerFormComponent),
        canActivate: [adminGuard]
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];
