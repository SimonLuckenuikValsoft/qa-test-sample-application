**Interview Technical Assignment - QA Automation (Playwright + TypeScript)**

**Application Under Test: Support Ticket Desk**

You are required to build an automated end-to-end test suite for the **Support Ticket Desk** application. This is a realistic Angular application that simulates a small internal support tool for handling customer tickets.

---

**Application URL:** https://simonluckenuikvalsoft.github.io/qa-test-sample-application/

**Login Credentials:**

| Role  | Username | Password   |
|-------|----------|------------|
| Admin | admin    | admin123   |
| Agent | agent    | agent123   |

---

**Core Test Scenarios (Required)**

You must automate as many as possible of the following scenarios:

1. **Authentication**
   - Login with valid admin credentials
   - Login with valid agent credentials
   - Login with invalid credentials (verify error message)
   - Verify validation errors for empty username/password fields
   - Verify successful logout

2. **Dashboard**
   - Verify dashboard statistics are displayed (Open Tickets, Assigned to Me, Total Tickets, Customers)
   - Verify recent tickets table displays up to 5 tickets
   - Verify navigation from dashboard to tickets list via "View All" link

3. **Ticket Management**
   - Create a new ticket with all required fields (title, description, customer, priority)
   - Edit an existing ticket (change status, priority, or description)
   - Delete a ticket (admin only) and confirm via dialog
   - Filter tickets by status (Open, In Progress, Resolved, Closed)
   - Filter tickets by priority (Low, Medium, High, Critical)
   - Search tickets by title or description
   - Verify pagination works correctly
   - Sort tickets by clicking column headers (title, status, priority, updated date)
   - Clear all filters using the "Clear Filters" button
   - **Error scenario**: Create ticket with title containing `FAIL_CREATE` and verify error message
   - **Error scenario**: Delete ticket with ID `TKT-001` and verify error message

4. **Ticket Detail & Comments**
   - View ticket details page with all information displayed
   - Add a comment to a ticket and verify it appears in the comments list
   - Verify validation error when submitting an empty comment
   - Navigate to customer detail from ticket detail page via customer link

5. **Customer Management (Admin)**
   - View customer list with pagination
   - Filter customers by SLA level (Gold, Silver, Bronze)
   - Filter customers by status (Active, Inactive)
   - Search customers by name, email, or company
   - View customer details including associated tickets count
   - Create a new customer with all fields (name, email, company, SLA level, status)
   - Edit an existing customer
   - Delete a customer and confirm via dialog
   - **Error scenario**: Create customer with name containing `FAIL_CREATE` and verify error message
   - **Error scenario**: Delete customer with ID `CUST-ERROR` and verify error message

6. **Role-Based Access Control**
   - **Admin**: Can see all tickets (not filtered by assignment)
   - **Admin**: Can see "Add Customer" button and edit/delete actions on customers
   - **Admin**: Can delete tickets (delete button visible)
   - **Agent**: Can only see tickets assigned to them
   - **Agent**: Cannot see "Add Customer" button
   - **Agent**: Cannot see edit/delete actions on customer list
   - **Agent**: Cannot delete tickets (delete button hidden)

---

**Additional Test Scenarios (Choose what you can cover)**

7. **Form Validations**
   - Ticket form: Verify required field validation (title, description, customer)
   - Customer form: Verify required field validation (name, email, company)
   - Customer form: Verify email format validation

8. **UI/UX Elements**
   - Verify loading spinners appear during data operations
   - Verify success alerts appear after successful operations
   - Verify error alerts appear after failed operations
   - Verify confirm dialog appears before delete operations

9. **Navigation**
   - Verify all navigation links work (Dashboard, Tickets, Customers)
   - Verify back links work correctly from detail pages
   - Verify redirect to login page when accessing protected routes without authentication

10. **Edge Cases**
    - Verify "No tickets found" message when filters return no results
    - Verify "No customers found" message when filters return no results
    - Verify "Ticket Not Found" page when accessing invalid ticket ID
    - Verify "Customer Not Found" page when accessing invalid customer ID

---

**Bonus Features (Optional, but encouraged)**

- Organize your tests to maximize code reuse
- Organize tests into logical suites (e.g., smoke, regression, critical path)
- Configure screenshot capture on test failure
- Generate an HTML test report
- Add data-driven tests using test fixtures or parameterized tests

---

**Technical Notes**

- **Important: In-Memory Data**
  - All data is stored in-memory only. Reloading the page will reset all data to its initial seed state. Design your tests accordingly:
    - Use page reload to restore clean state between tests
    - Do not rely on data created in previous test runs persisting
    - Each test should be independent and set up its own required state

- **Predictable Error Scenarios**
  - The application includes predictable error scenarios for testing error handling:
    - **Ticket creation**: Include `FAIL_CREATE` in the title to trigger an error
    - **Ticket deletion**: Attempt to delete ticket `TKT-001` to trigger an error
    - **Customer creation**: Include `FAIL_CREATE` in the name to trigger an error
    - **Customer deletion**: Attempt to delete customer `CUST-ERROR` to trigger an error

---

**Important Notes**

- All code must be in English.
- Use Git as you would in a real-world team environment (meaningful commit messages, logical history).
- Include a README file that explains:
  - How to install dependencies
  - How to run the tests (e.g., `npm test` or `npx playwright test`)
- Ensure all required configuration files are committed (`package.json`, `playwright.config.ts`, etc.)

---

**Submission**

After 90 minutes have elapsed (end of scheduled meeting), push your final source code and README to GitHub (pushed in the main branch) and send an email to simon.luckenuik@valsoftcorp.com
