# Support Ticket Desk

A realistic Angular application designed for QA candidates to practice writing automated UI tests. This application simulates a small internal support tool for handling customer tickets.

## Features

- **Authentication**: Simple login with two hardcoded users (admin and agent)
- **Role-based Access Control**: Different permissions for admin and agent roles
- **Ticket Management**: Full CRUD operations with filtering, sorting, and pagination
- **Customer Management**: View and manage customer accounts
- **Comments System**: Add comments to tickets
- **Simulated Backend**: In-memory data with artificial delays

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm (v9 or higher)

### Installation

```bash
# Navigate to the project directory
cd support-ticket-desk

# Install dependencies
npm install
```

### Running the Application

```bash
# Start the development server
npm start
# or
ng serve
```

The application will be available at `http://localhost:4200`

## Login Credentials

| Role  | Username | Password   |
|-------|----------|------------|
| Admin | admin    | admin123   |
| Agent | agent    | agent123   |

## User Roles and Permissions

### Admin
- Can see all tickets and all customers
- Can create, edit, and delete tickets
- Can reassign tickets to any user
- Can manage customers (create, edit, delete)

### Agent
- Can see tickets assigned to them only
- Can create new tickets (assigned to themselves)
- Can edit tickets assigned to them
- Can add comments to tickets they can see
- Can view customers but cannot create/edit/delete

## Application Pages

### Login (`/login`)
- Username and password fields
- Displays validation errors
- Shows demo credentials for convenience

### Dashboard (`/dashboard`)
- Summary statistics (open tickets, assigned tickets, total customers)
- Recent tickets list (last 5 modified)

### Tickets (`/tickets`)
- Paginated ticket list (10 per page)
- Filters: status, priority, assigned to, customer
- Text search by title or description
- Sortable columns (click headers)
- Create, view, and edit actions

### Ticket Detail (`/tickets/:id`)
- Full ticket information
- Customer details
- Comments list with add new comment form
- Edit and delete actions (based on permissions)

### Customers (`/customers`)
- Paginated customer list (10 per page)
- Filters: SLA level, active status
- Text search by name, email, or company
- View and edit actions (edit for admin only)

### Customer Detail (`/customers/:id`)
- Full customer information
- Associated tickets list
- Quick statistics
- Edit and delete actions (admin only)

## Seed Data

The application includes deterministic seed data:
- **36 Customers** - Various companies with different SLA levels
- **105 Tickets** - With various statuses, priorities, and assignments
- **205 Comments** - Distributed across tickets

**Important**: All data resets to its initial state on page reload. No data is persisted.

## Simulated Backend Delays

All data operations have artificial delays between **250ms and 2000ms** to simulate network latency. This is useful for testing:
- Loading states
- Spinners and progress indicators
- Race conditions
- User experience during slow operations

## Error Scenarios

Predictable error scenarios exist for testing error handling:

| Action | Trigger | Error Message |
|--------|---------|---------------|
| Create Ticket | Title contains `FAIL_CREATE` | "Failed to create ticket: The ticket system is currently experiencing issues. Please try again later." |
| Delete Ticket | Ticket ID `TKT-001` | "Cannot delete ticket: This ticket is linked to an active SLA agreement and cannot be removed. Please contact your administrator." |
| Create Customer | Name contains `FAIL_CREATE` | "Failed to create customer: A customer with similar details already exists in the system. Please verify the information and try again." |
| Delete Customer | Customer ID `CUST-ERROR` | "Cannot delete customer: This customer has active contracts and cannot be removed. Please contact support for assistance." |

## Testability Features

### data-testid Attributes

Key elements have stable `data-testid` attributes for reliable test selectors:

```
// Login page
data-testid="login-username"
data-testid="login-password"
data-testid="login-submit"
data-testid="login-error"

// Navigation
data-testid="nav-dashboard"
data-testid="nav-tickets"
data-testid="nav-customers"
data-testid="logout-button"

// Tickets
data-testid="ticket-row-{id}"
data-testid="ticket-list-pagination"
data-testid="ticket-detail-title"
data-testid="filter-status"
data-testid="filter-priority"
data-testid="ticket-search"
data-testid="create-ticket-button"

// Customers
data-testid="customer-row-{id}"
data-testid="customer-list-pagination"
data-testid="customer-form-save"
data-testid="create-customer-button"

// Comments
data-testid="comments-list"
data-testid="comment-{id}"
data-testid="comment-input"
data-testid="submit-comment"

// Dialogs
data-testid="confirm-dialog"
data-testid="confirm-dialog-confirm"
data-testid="confirm-dialog-cancel"

// Alerts
data-testid="alert-success"
data-testid="alert-error"

// Loading
data-testid="loading-spinner"
```

### Form Validation

- All required fields show validation messages in the DOM
- Error messages appear with predictable text
- Invalid fields are styled distinctly

### Deterministic Behavior

- Same data on every load
- Predictable IDs and values
- No random data in content (only in delays)

## Technology Stack

- Angular 19 (latest)
- Standalone components
- Angular Router
- RxJS for async operations
- SCSS for styling
- In-memory data services

## Project Structure

```
src/app/
├── auth/                  # Login component
├── core/
│   ├── data/              # Seed data files
│   ├── guards/            # Route guards
│   ├── models/            # TypeScript interfaces
│   └── services/          # Data services
├── customers/             # Customer components
├── dashboard/             # Dashboard component
├── shared/
│   └── components/        # Reusable components
└── tickets/               # Ticket components
```

## Testing Tips

1. **Wait for loading states**: Use explicit waits for loading spinners to disappear
2. **Use data-testid selectors**: More stable than CSS class selectors
3. **Handle delays**: Operations take 250-1000ms, plan your timeouts accordingly
4. **Test role-based access**: Log in as both admin and agent to test permissions
5. **Test error scenarios**: Use customer `CUST-ERROR` to test error handling
6. **Refresh to reset**: Reload the page to restore initial data state

## License

This project is for educational and testing purposes.
