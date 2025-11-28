import { Comment } from '../models';

// Helper to create deterministic dates
function createDate(daysAgo: number, hoursAgo: number = 0, minutesAgo: number = 0): Date {
  const base = new Date('2025-01-15T10:00:00Z');
  return new Date(base.getTime() - (daysAgo * 24 * 60 + hoursAgo * 60 + minutesAgo) * 60 * 1000);
}

export const SEED_COMMENTS: Comment[] = [
  // Comments for TKT-001
  { id: 'CMT-001', ticketId: 'TKT-001', authorUsername: 'admin', message: 'Investigating this issue. Initial analysis suggests a JavaScript bundle loading error.', createdAt: createDate(0, 20) },
  { id: 'CMT-002', ticketId: 'TKT-001', authorUsername: 'agent', message: 'Customer confirmed the issue is affecting Chrome version 120 and above.', createdAt: createDate(0, 18) },
  { id: 'CMT-003', ticketId: 'TKT-001', authorUsername: 'admin', message: 'Found the root cause - a polyfill incompatibility with newer Chrome versions. Working on a fix.', createdAt: createDate(0, 15) },
  
  // Comments for TKT-002
  { id: 'CMT-004', ticketId: 'TKT-002', authorUsername: 'agent', message: 'Checked the email logs. Emails are being sent but bouncing back from the customer domain.', createdAt: createDate(1, 8) },
  { id: 'CMT-005', ticketId: 'TKT-002', authorUsername: 'admin', message: 'SPF records look correct. Reaching out to customer IT department to check their spam filters.', createdAt: createDate(1, 4) },
  { id: 'CMT-006', ticketId: 'TKT-002', authorUsername: 'agent', message: 'Customer confirmed they found our emails in their quarantine folder. Whitelisting our domain now.', createdAt: createDate(0, 8) },
  
  // Comments for TKT-003
  { id: 'CMT-007', ticketId: 'TKT-003', authorUsername: 'admin', message: 'Dashboard API is returning 504 timeout errors. Escalating to the backend team.', createdAt: createDate(0, 12) },
  { id: 'CMT-008', ticketId: 'TKT-003', authorUsername: 'agent', message: 'Similar reports coming in from other Gold SLA customers. This seems widespread.', createdAt: createDate(0, 10) },
  
  // Comments for TKT-004
  { id: 'CMT-009', ticketId: 'TKT-004', authorUsername: 'agent', message: 'Reproduced the issue. The PDF library is throwing an encoding error for special characters.', createdAt: createDate(3) },
  { id: 'CMT-010', ticketId: 'TKT-004', authorUsername: 'admin', message: 'Fixed by updating the PDF library to version 2.4.1. Deployed to staging for testing.', createdAt: createDate(2) },
  { id: 'CMT-011', ticketId: 'TKT-004', authorUsername: 'agent', message: 'Verified the fix in staging. Ready for production deployment.', createdAt: createDate(1, 12) },
  
  // Comments for TKT-005
  { id: 'CMT-012', ticketId: 'TKT-005', authorUsername: 'admin', message: 'Crash report indicates a null pointer exception in the authentication module.', createdAt: createDate(0, 3) },
  { id: 'CMT-013', ticketId: 'TKT-005', authorUsername: 'agent', message: 'Customer has sent us their device logs. Analyzing now.', createdAt: createDate(0, 2) },
  { id: 'CMT-014', ticketId: 'TKT-005', authorUsername: 'admin', message: 'Identified the issue - biometric auth callback is null on iOS 17. Emergency patch in progress.', createdAt: createDate(0, 1) },
  
  // Comments for TKT-006
  { id: 'CMT-015', ticketId: 'TKT-006', authorUsername: 'agent', message: 'Running performance analysis on the customer\'s account. They have 50k+ records which might be causing slowdowns.', createdAt: createDate(2) },
  { id: 'CMT-016', ticketId: 'TKT-006', authorUsername: 'admin', message: 'Recommend implementing pagination on their data-heavy pages. Creating optimization tickets.', createdAt: createDate(1) },
  
  // Comments for TKT-007
  { id: 'CMT-017', ticketId: 'TKT-007', authorUsername: 'admin', message: 'Implemented forced cache refresh on role changes. Testing the fix now.', createdAt: createDate(5) },
  { id: 'CMT-018', ticketId: 'TKT-007', authorUsername: 'agent', message: 'Customer confirmed the fix works. Closing this ticket.', createdAt: createDate(3) },
  
  // Comments for TKT-008
  { id: 'CMT-019', ticketId: 'TKT-008', authorUsername: 'agent', message: 'Verified the rate limiting config. The limit was incorrectly set to 50 instead of 100. Updating now.', createdAt: createDate(1) },
  
  // Comments for TKT-009
  { id: 'CMT-020', ticketId: 'TKT-009', authorUsername: 'admin', message: 'Full-text search index appears corrupted. Rebuilding the index.', createdAt: createDate(2) },
  { id: 'CMT-021', ticketId: 'TKT-009', authorUsername: 'agent', message: 'Index rebuild completed. Search results looking correct now. Monitoring for any further issues.', createdAt: createDate(1) },
  
  // Comments for TKT-010
  { id: 'CMT-022', ticketId: 'TKT-010', authorUsername: 'agent', message: 'The 5MB limit was a backend configuration issue. Updated to 25MB as per documentation.', createdAt: createDate(4) },
  { id: 'CMT-023', ticketId: 'TKT-010', authorUsername: 'admin', message: 'Also added a proper error message when file size exceeds the limit.', createdAt: createDate(3) },
  { id: 'CMT-024', ticketId: 'TKT-010', authorUsername: 'agent', message: 'Customer verified and is happy with the fix. Marking as resolved.', createdAt: createDate(2) },
  
  // Comments for TKT-011
  { id: 'CMT-025', ticketId: 'TKT-011', authorUsername: 'admin', message: 'Email queue is backing up due to a high volume of notifications. Investigating the mail server capacity.', createdAt: createDate(0, 8) },
  { id: 'CMT-026', ticketId: 'TKT-011', authorUsername: 'agent', message: 'Added additional mail workers. Queue is draining faster now but still delayed.', createdAt: createDate(0, 4) },
  
  // Comments for TKT-012
  { id: 'CMT-027', ticketId: 'TKT-012', authorUsername: 'agent', message: 'OAuth token for Google Calendar has expired. Need customer to re-authorize the integration.', createdAt: createDate(2) },
  { id: 'CMT-028', ticketId: 'TKT-012', authorUsername: 'admin', message: 'Sent re-authorization instructions to customer. Waiting for their response.', createdAt: createDate(1) },
  
  // Comments for TKT-013
  { id: 'CMT-029', ticketId: 'TKT-013', authorUsername: 'admin', message: 'Accessibility audit confirms contrast ratio is 2.1:1, well below WCAG AA requirements of 4.5:1.', createdAt: createDate(4) },
  { id: 'CMT-030', ticketId: 'TKT-013', authorUsername: 'agent', message: 'Design team is reviewing new color palette options for dark mode.', createdAt: createDate(2) },
  
  // Comments for TKT-014
  { id: 'CMT-031', ticketId: 'TKT-014', authorUsername: 'agent', message: 'Invoice generation failed due to missing tax configuration for the new fiscal year.', createdAt: createDate(3) },
  { id: 'CMT-032', ticketId: 'TKT-014', authorUsername: 'admin', message: 'Tax config updated. Re-running invoice generation for affected accounts.', createdAt: createDate(2) },
  { id: 'CMT-033', ticketId: 'TKT-014', authorUsername: 'agent', message: 'All invoices generated successfully. Notified customers via email.', createdAt: createDate(1) },
  
  // Comments for TKT-015
  { id: 'CMT-034', ticketId: 'TKT-015', authorUsername: 'admin', message: 'SMS gateway provider confirmed they are experiencing regional outages.', createdAt: createDate(0, 6) },
  { id: 'CMT-035', ticketId: 'TKT-015', authorUsername: 'agent', message: 'Enabling backup SMS provider for redundancy. ETA 30 minutes.', createdAt: createDate(0, 4) },
  { id: 'CMT-036', ticketId: 'TKT-015', authorUsername: 'admin', message: 'Backup provider activated. SMS delivery restored. Monitoring closely.', createdAt: createDate(0, 2) },
  
  // Comments for TKT-016
  { id: 'CMT-037', ticketId: 'TKT-016', authorUsername: 'agent', message: 'CSV library was truncating fields with commas. Adding proper quoting.', createdAt: createDate(1) },
  
  // Comments for TKT-017
  { id: 'CMT-038', ticketId: 'TKT-017', authorUsername: 'admin', message: 'Customer endpoint taking 35+ seconds to respond. Recommended they optimize their webhook handler.', createdAt: createDate(6) },
  { id: 'CMT-039', ticketId: 'TKT-017', authorUsername: 'agent', message: 'Customer implemented async processing on their end. Webhooks delivering successfully now.', createdAt: createDate(4) },
  
  // Comments for TKT-018
  { id: 'CMT-040', ticketId: 'TKT-018', authorUsername: 'agent', message: 'Session timeout was hardcoded to 5 minutes. Updated configuration to support custom timeouts.', createdAt: createDate(7) },
  { id: 'CMT-041', ticketId: 'TKT-018', authorUsername: 'admin', message: 'Set customer\'s timeout to 30 minutes as requested. They can adjust in their settings now.', createdAt: createDate(5) },
  
  // Comments for TKT-019
  { id: 'CMT-042', ticketId: 'TKT-019', authorUsername: 'admin', message: 'Print stylesheet was missing @page rules. Adding proper print CSS.', createdAt: createDate(3) },
  
  // Comments for TKT-020
  { id: 'CMT-043', ticketId: 'TKT-020', authorUsername: 'agent', message: 'Documentation team is reviewing all endpoints. This will take a few days to complete.', createdAt: createDate(2) },
  { id: 'CMT-044', ticketId: 'TKT-020', authorUsername: 'admin', message: 'Prioritizing the most commonly used endpoints first. Customer sent a list of discrepancies.', createdAt: createDate(1) },
  
  // Comments for TKT-021
  { id: 'CMT-045', ticketId: 'TKT-021', authorUsername: 'admin', message: 'Implementing beforeunload event handler to warn users about unsaved changes.', createdAt: createDate(2) },
  
  // Comments for TKT-022
  { id: 'CMT-046', ticketId: 'TKT-022', authorUsername: 'agent', message: 'Delete restriction was a compliance requirement. Added admin override capability.', createdAt: createDate(10) },
  { id: 'CMT-047', ticketId: 'TKT-022', authorUsername: 'admin', message: 'Customer confirmed admin override works for their use case.', createdAt: createDate(7) },
  
  // Comments for TKT-023
  { id: 'CMT-048', ticketId: 'TKT-023', authorUsername: 'admin', message: 'Table sorting regression introduced in last sprint. Rolling back specific changes.', createdAt: createDate(1) },
  { id: 'CMT-049', ticketId: 'TKT-023', authorUsername: 'agent', message: 'Rollback complete. Testing all table sorting functionality across pages.', createdAt: createDate(0, 8) },
  
  // Comments for TKT-024
  { id: 'CMT-050', ticketId: 'TKT-024', authorUsername: 'agent', message: 'Memory profiling shows event listeners not being cleaned up on route changes.', createdAt: createDate(1) },
  { id: 'CMT-051', ticketId: 'TKT-024', authorUsername: 'admin', message: 'Identified 15 components with memory leaks. Creating sub-tickets for each fix.', createdAt: createDate(0, 12) },
  
  // Comments for TKT-025
  { id: 'CMT-052', ticketId: 'TKT-025', authorUsername: 'admin', message: 'Found 47 missing translation keys for Spanish locale. Translation team is on it.', createdAt: createDate(4) },
  { id: 'CMT-053', ticketId: 'TKT-025', authorUsername: 'agent', message: 'All missing translations added. Deployed to production.', createdAt: createDate(2, 2) },
  
  // Comments for TKT-026 - TKT-035
  { id: 'CMT-054', ticketId: 'TKT-026', authorUsername: 'agent', message: 'CDN is serving stale cached images. Purging cache for profile images.', createdAt: createDate(3) },
  { id: 'CMT-055', ticketId: 'TKT-027', authorUsername: 'admin', message: 'Cron job for report scheduling was disabled after server migration.', createdAt: createDate(1) },
  { id: 'CMT-056', ticketId: 'TKT-027', authorUsername: 'agent', message: 'Re-enabled and verified cron jobs. Scheduled reports running correctly.', createdAt: createDate(0, 10) },
  { id: 'CMT-057', ticketId: 'TKT-028', authorUsername: 'agent', message: 'Database had duplicate customer records due to case-sensitive matching. Cleaning up data.', createdAt: createDate(3) },
  { id: 'CMT-058', ticketId: 'TKT-029', authorUsername: 'admin', message: 'SSL certificate renewed and installed. Warning should disappear within an hour.', createdAt: createDate(2) },
  { id: 'CMT-059', ticketId: 'TKT-029', authorUsername: 'agent', message: 'Confirmed SSL is valid across all regions. Closing ticket.', createdAt: createDate(0, 14) },
  { id: 'CMT-060', ticketId: 'TKT-030', authorUsername: 'agent', message: 'Implementing real-time validation with debouncing to improve UX.', createdAt: createDate(2) },
  { id: 'CMT-061', ticketId: 'TKT-031', authorUsername: 'admin', message: 'Mobile navigation z-index conflict with new header component. Quick fix in progress.', createdAt: createDate(0, 8) },
  { id: 'CMT-062', ticketId: 'TKT-032', authorUsername: 'agent', message: 'Database connection pool exhausted during peak hours. Increasing pool size.', createdAt: createDate(0, 2) },
  { id: 'CMT-063', ticketId: 'TKT-033', authorUsername: 'admin', message: 'URL encoding issue with SAML assertion. Fixed the encoding in our service provider.', createdAt: createDate(5) },
  { id: 'CMT-064', ticketId: 'TKT-033', authorUsername: 'agent', message: 'All affected users can now log in via SSO. Verified with 5 test accounts.', createdAt: createDate(3, 4) },
  { id: 'CMT-065', ticketId: 'TKT-034', authorUsername: 'agent', message: 'Auto-save feature was never implemented despite being in the UI. Adding actual functionality.', createdAt: createDate(2) },
  { id: 'CMT-066', ticketId: 'TKT-035', authorUsername: 'admin', message: 'Count query not respecting filter conditions. Fixing the SQL query.', createdAt: createDate(3) },
  { id: 'CMT-067', ticketId: 'TKT-035', authorUsername: 'agent', message: 'Query fixed. Total count now accurate with all filter combinations.', createdAt: createDate(1, 8) },
  
  // Comments for TKT-036 - TKT-050
  { id: 'CMT-068', ticketId: 'TKT-036', authorUsername: 'agent', message: 'Outlook 2019 doesn\'t support modern CSS. Reverting email templates to table-based layout.', createdAt: createDate(3) },
  { id: 'CMT-069', ticketId: 'TKT-037', authorUsername: 'admin', message: 'Server was storing all times in local timezone. Converting to UTC storage.', createdAt: createDate(4) },
  { id: 'CMT-070', ticketId: 'TKT-037', authorUsername: 'agent', message: 'Migration complete. All events now display correctly for international users.', createdAt: createDate(2, 6) },
  { id: 'CMT-071', ticketId: 'TKT-038', authorUsername: 'agent', message: 'Adding batch processing to handle large bulk operations. Will process 50 items at a time.', createdAt: createDate(1) },
  { id: 'CMT-072', ticketId: 'TKT-039', authorUsername: 'admin', message: 'CDN configuration issue. Avatar images were 404ing on new CDN edge nodes.', createdAt: createDate(2) },
  { id: 'CMT-073', ticketId: 'TKT-040', authorUsername: 'agent', message: 'Firefox security policy blocking clipboard access. Adding fallback paste method.', createdAt: createDate(4) },
  { id: 'CMT-074', ticketId: 'TKT-041', authorUsername: 'admin', message: 'Notification service had a race condition. Fixed and deployed.', createdAt: createDate(6) },
  { id: 'CMT-075', ticketId: 'TKT-041', authorUsername: 'agent', message: 'Badge count now updates correctly. Customer confirmed fix works.', createdAt: createDate(4, 4) },
  { id: 'CMT-076', ticketId: 'TKT-042', authorUsername: 'agent', message: 'WebSocket connection dropping after 2 minutes. Adding reconnection logic.', createdAt: createDate(2) },
  { id: 'CMT-077', ticketId: 'TKT-043', authorUsername: 'admin', message: 'Filter state is now persisted to URL query params for sharing and history.', createdAt: createDate(1) },
  { id: 'CMT-078', ticketId: 'TKT-044', authorUsername: 'agent', message: 'Implementing optimistic locking to detect concurrent edits.', createdAt: createDate(0, 8) },
  { id: 'CMT-079', ticketId: 'TKT-045', authorUsername: 'admin', message: 'Added proper focus trap and keyboard navigation to modal component.', createdAt: createDate(5) },
  { id: 'CMT-080', ticketId: 'TKT-045', authorUsername: 'agent', message: 'Passed accessibility audit. All keyboard navigation working as expected.', createdAt: createDate(3, 8) },
  { id: 'CMT-081', ticketId: 'TKT-046', authorUsername: 'agent', message: 'Integrating image compression library. Will compress on upload.', createdAt: createDate(3) },
  { id: 'CMT-082', ticketId: 'TKT-047', authorUsername: 'admin', message: 'Found bug in audit logger middleware. Some async operations were not being tracked.', createdAt: createDate(1) },
  { id: 'CMT-083', ticketId: 'TKT-048', authorUsername: 'agent', message: 'Locale-specific currency formatting needed. Using Intl.NumberFormat now.', createdAt: createDate(4) },
  { id: 'CMT-084', ticketId: 'TKT-049', authorUsername: 'admin', message: 'Download worker was stuck in infinite retry loop. Fixed error handling.', createdAt: createDate(7) },
  { id: 'CMT-085', ticketId: 'TKT-049', authorUsername: 'agent', message: 'Downloads processing normally. Queue cleared successfully.', createdAt: createDate(5, 10) },
  { id: 'CMT-086', ticketId: 'TKT-050', authorUsername: 'agent', message: 'Autocomplete component missing from the user search field. Adding it now.', createdAt: createDate(2) },
  
  // Comments for TKT-051 - TKT-070
  { id: 'CMT-087', ticketId: 'TKT-051', authorUsername: 'admin', message: 'GDPR export job queued. Will include all user data per Article 15 requirements.', createdAt: createDate(1) },
  { id: 'CMT-088', ticketId: 'TKT-051', authorUsername: 'agent', message: 'Export complete. Encrypted file sent to customer via secure link.', createdAt: createDate(0, 6) },
  { id: 'CMT-089', ticketId: 'TKT-052', authorUsername: 'agent', message: 'Created SSL certificate for custom domain. Waiting for DNS propagation.', createdAt: createDate(3) },
  { id: 'CMT-090', ticketId: 'TKT-053', authorUsername: 'admin', message: 'Added regex validation for email format. Invalid emails now rejected with clear error.', createdAt: createDate(4) },
  { id: 'CMT-091', ticketId: 'TKT-053', authorUsername: 'agent', message: 'Customer tested batch import. All validations working correctly now.', createdAt: createDate(2, 6) },
  { id: 'CMT-092', ticketId: 'TKT-054', authorUsername: 'agent', message: 'Critical security issue. Implementing emergency fix for permission check.', createdAt: createDate(0, 4) },
  { id: 'CMT-093', ticketId: 'TKT-054', authorUsername: 'admin', message: 'Fix deployed. Running security scan to verify no other permission issues.', createdAt: createDate(0, 2) },
  { id: 'CMT-094', ticketId: 'TKT-055', authorUsername: 'admin', message: 'PDF.js viewer not initialized. Adding proper viewer initialization.', createdAt: createDate(3) },
  { id: 'CMT-095', ticketId: 'TKT-056', authorUsername: 'agent', message: 'Slack OAuth token expiring. Implementing token refresh flow.', createdAt: createDate(2) },
  { id: 'CMT-096', ticketId: 'TKT-057', authorUsername: 'admin', message: 'Touch events not properly handled. Fixed and tested on iPad.', createdAt: createDate(8) },
  { id: 'CMT-097', ticketId: 'TKT-057', authorUsername: 'agent', message: 'Widget drag working on all touch devices tested.', createdAt: createDate(6, 6) },
  { id: 'CMT-098', ticketId: 'TKT-058', authorUsername: 'agent', message: 'Creating migration guide for v1 to v2 API changes.', createdAt: createDate(1) },
  { id: 'CMT-099', ticketId: 'TKT-059', authorUsername: 'admin', message: 'Email bounce handler webhook not processing hard bounces correctly.', createdAt: createDate(3) },
  { id: 'CMT-100', ticketId: 'TKT-060', authorUsername: 'agent', message: 'FFmpeg not configured on upload server. Installing and configuring.', createdAt: createDate(5) },
  { id: 'CMT-101', ticketId: 'TKT-061', authorUsername: 'admin', message: 'Payment gateway returning generic error. Enabled detailed logging.', createdAt: createDate(1, 8) },
  { id: 'CMT-102', ticketId: 'TKT-061', authorUsername: 'agent', message: 'Issue was 3DS authentication timeout. Extended timeout to 90 seconds.', createdAt: createDate(1) },
  { id: 'CMT-103', ticketId: 'TKT-061', authorUsername: 'admin', message: 'Checkout flow working again. All test payments successful.', createdAt: createDate(0, 6) },
  { id: 'CMT-104', ticketId: 'TKT-062', authorUsername: 'agent', message: 'Team context loading all data on switch. Implementing lazy loading.', createdAt: createDate(2) },
  { id: 'CMT-105', ticketId: 'TKT-063', authorUsername: 'admin', message: 'Editor component stripping HTML on edit. Fixing parser configuration.', createdAt: createDate(4) },
  { id: 'CMT-106', ticketId: 'TKT-064', authorUsername: 'agent', message: 'Invitation expiry was misconfigured in email template. Fixing.', createdAt: createDate(3) },
  { id: 'CMT-107', ticketId: 'TKT-065', authorUsername: 'admin', message: 'Analytics uses real-time data, exports use daily aggregated data. Adding note to UI.', createdAt: createDate(6) },
  { id: 'CMT-108', ticketId: 'TKT-065', authorUsername: 'agent', message: 'Added explanatory tooltip. Customer understands the difference now.', createdAt: createDate(4, 6) },
  { id: 'CMT-109', ticketId: 'TKT-066', authorUsername: 'agent', message: 'Version history API endpoint not returning old versions. Debugging.', createdAt: createDate(2) },
  { id: 'CMT-110', ticketId: 'TKT-067', authorUsername: 'admin', message: 'Custom field required flag not being checked. Adding validation.', createdAt: createDate(1) },
  { id: 'CMT-111', ticketId: 'TKT-068', authorUsername: 'agent', message: 'User preferences cleared on password reset. Not expected behavior.', createdAt: createDate(4) },
  { id: 'CMT-112', ticketId: 'TKT-069', authorUsername: 'admin', message: 'Safari doesn\'t support input type=date correctly. Adding polyfill.', createdAt: createDate(5) },
  { id: 'CMT-113', ticketId: 'TKT-069', authorUsername: 'agent', message: 'Polyfill working on all Safari versions. Issue resolved.', createdAt: createDate(3, 10) },
  { id: 'CMT-114', ticketId: 'TKT-070', authorUsername: 'agent', message: 'Address validation service doesn\'t cover all countries. Adding fallback.', createdAt: createDate(3) },
  
  // Comments for TKT-071 - TKT-085
  { id: 'CMT-115', ticketId: 'TKT-071', authorUsername: 'admin', message: 'Building user merge tool. Will consolidate all data and maintain audit trail.', createdAt: createDate(2) },
  { id: 'CMT-116', ticketId: 'TKT-072', authorUsername: 'agent', message: 'Adding warning email at 80% rate limit usage.', createdAt: createDate(5) },
  { id: 'CMT-117', ticketId: 'TKT-073', authorUsername: 'admin', message: 'Critical security fix deployed. Session tokens now only in cookies.', createdAt: createDate(1) },
  { id: 'CMT-118', ticketId: 'TKT-073', authorUsername: 'agent', message: 'Security scan confirms issue is fixed. No tokens in URLs.', createdAt: createDate(0, 8) },
  { id: 'CMT-119', ticketId: 'TKT-074', authorUsername: 'agent', message: 'Export queue worker scaling needed. Adding auto-scaling policy.', createdAt: createDate(1) },
  { id: 'CMT-120', ticketId: 'TKT-075', authorUsername: 'admin', message: 'Webhook retry config was set to 0 retries. Setting to 5 with exponential backoff.', createdAt: createDate(3) },
  { id: 'CMT-121', ticketId: 'TKT-076', authorUsername: 'agent', message: 'CAPTCHA provider having issues. Switching to backup provider.', createdAt: createDate(0, 8) },
  { id: 'CMT-122', ticketId: 'TKT-077', authorUsername: 'admin', message: 'Webhook dispatcher had at-least-once delivery. Implementing idempotency.', createdAt: createDate(7) },
  { id: 'CMT-123', ticketId: 'TKT-077', authorUsername: 'agent', message: 'Idempotency keys implemented. No more duplicate webhooks.', createdAt: createDate(5, 8) },
  { id: 'CMT-124', ticketId: 'TKT-078', authorUsername: 'agent', message: 'Font CDN blocking requests from Windows. Adding CORS headers.', createdAt: createDate(4) },
  { id: 'CMT-125', ticketId: 'TKT-079', authorUsername: 'admin', message: 'WebSocket server sync interval too slow. Reducing from 5s to 500ms.', createdAt: createDate(1) },
  { id: 'CMT-126', ticketId: 'TKT-080', authorUsername: 'agent', message: 'Tag search hitting database directly. Adding search index.', createdAt: createDate(3) },
  { id: 'CMT-127', ticketId: 'TKT-081', authorUsername: 'admin', message: 'IP whitelist check was using outdated cached list. Fixed cache invalidation.', createdAt: createDate(1) },
  { id: 'CMT-128', ticketId: 'TKT-081', authorUsername: 'agent', message: 'Customer confirmed their IPs now work. Critical issue resolved.', createdAt: createDate(0, 4) },
  { id: 'CMT-129', ticketId: 'TKT-082', authorUsername: 'agent', message: 'Edge browser drag-drop API different from standard. Adding Edge-specific handling.', createdAt: createDate(2) },
  { id: 'CMT-130', ticketId: 'TKT-083', authorUsername: 'admin', message: 'Building self-service upgrade flow with prorated billing calculation.', createdAt: createDate(4) },
  { id: 'CMT-131', ticketId: 'TKT-084', authorUsername: 'agent', message: 'PDF renderer using different fonts than web. Embedding web fonts in PDF.', createdAt: createDate(5) },
  { id: 'CMT-132', ticketId: 'TKT-085', authorUsername: 'admin', message: 'Deactivation email template was missing. Created and deployed.', createdAt: createDate(9) },
  { id: 'CMT-133', ticketId: 'TKT-085', authorUsername: 'agent', message: 'Email confirmed working. Customer will receive notification on deactivation.', createdAt: createDate(7, 4) },
  
  // Comments for TKT-086 - TKT-105
  { id: 'CMT-134', ticketId: 'TKT-086', authorUsername: 'agent', message: 'Import job timeout set to 5 minutes. Need to increase to 30 minutes.', createdAt: createDate(1) },
  { id: 'CMT-135', ticketId: 'TKT-087', authorUsername: 'admin', message: 'Notification service not subscribed to mention events. Adding subscription.', createdAt: createDate(3) },
  { id: 'CMT-136', ticketId: 'TKT-088', authorUsername: 'agent', message: 'Search pagination using offset which causes inconsistencies. Switching to cursor-based.', createdAt: createDate(2) },
  { id: 'CMT-137', ticketId: 'TKT-089', authorUsername: 'admin', message: 'FCM priority was set to normal instead of high. Updating push configuration.', createdAt: createDate(4) },
  { id: 'CMT-138', ticketId: 'TKT-089', authorUsername: 'agent', message: 'Push notifications now delivered within seconds. Customer confirmed.', createdAt: createDate(2, 8) },
  { id: 'CMT-139', ticketId: 'TKT-090', authorUsername: 'agent', message: 'Presence updates using polling instead of WebSocket. Implementing real-time updates.', createdAt: createDate(4) },
  { id: 'CMT-140', ticketId: 'TKT-091', authorUsername: 'admin', message: 'Permission inheritance was disabled. Re-enabling recursive permission sync.', createdAt: createDate(1) },
  { id: 'CMT-141', ticketId: 'TKT-092', authorUsername: 'agent', message: 'DST transition not handled properly. Using moment-timezone for accurate handling.', createdAt: createDate(3) },
  { id: 'CMT-142', ticketId: 'TKT-093', authorUsername: 'admin', message: 'Search index was corrupted. Rebuilding API docs search index.', createdAt: createDate(6) },
  { id: 'CMT-143', ticketId: 'TKT-093', authorUsername: 'agent', message: 'Search working again. All API endpoints indexed correctly.', createdAt: createDate(4, 8) },
  { id: 'CMT-144', ticketId: 'TKT-094', authorUsername: 'agent', message: 'Activity log export missing bulk operation events. Adding those event types.', createdAt: createDate(2) },
  { id: 'CMT-145', ticketId: 'TKT-095', authorUsername: 'admin', message: 'Adding autocomplete=off to prevent browser autofill interference.', createdAt: createDate(4) },
  { id: 'CMT-146', ticketId: 'TKT-096', authorUsername: 'agent', message: 'Updating password policy to require 12 characters with complexity requirements.', createdAt: createDate(1) },
  { id: 'CMT-147', ticketId: 'TKT-097', authorUsername: 'admin', message: 'Column resize handles were hidden by CSS. Fixed display issue.', createdAt: createDate(5) },
  { id: 'CMT-148', ticketId: 'TKT-097', authorUsername: 'agent', message: 'Column resize working in all browsers. Customer happy with fix.', createdAt: createDate(3, 4) },
  { id: 'CMT-149', ticketId: 'TKT-098', authorUsername: 'agent', message: 'Backup restore error message unhelpful. Adding detailed error logging.', createdAt: createDate(0, 4) },
  { id: 'CMT-150', ticketId: 'TKT-099', authorUsername: 'admin', message: 'LocalStorage being cleared by browser update. Moving to IndexedDB.', createdAt: createDate(3) },
  { id: 'CMT-151', ticketId: 'TKT-100', authorUsername: 'agent', message: 'Translation file missing for new pages. Adding missing translation keys.', createdAt: createDate(2) },
  { id: 'CMT-152', ticketId: 'TKT-101', authorUsername: 'admin', message: 'OAuth app needs calendar.read and drive.readonly scopes. Updating permissions.', createdAt: createDate(7) },
  { id: 'CMT-153', ticketId: 'TKT-101', authorUsername: 'agent', message: 'Scope update approved. Integration working with new permissions.', createdAt: createDate(5, 6) },
  { id: 'CMT-154', ticketId: 'TKT-102', authorUsername: 'agent', message: 'Template save endpoint throwing 500 error. Debugging the issue.', createdAt: createDate(3) },
  { id: 'CMT-155', ticketId: 'TKT-103', authorUsername: 'admin', message: 'Email server attachment limit is 10MB. Requesting infrastructure change.', createdAt: createDate(5) },
  { id: 'CMT-156', ticketId: 'TKT-104', authorUsername: 'agent', message: 'Retention policy job failing silently. Adding alerting for job failures.', createdAt: createDate(1) },
  { id: 'CMT-157', ticketId: 'TKT-105', authorUsername: 'admin', message: 'SSO logout URL misconfigured in SAML settings. Correcting the redirect URL.', createdAt: createDate(3) },
  { id: 'CMT-158', ticketId: 'TKT-105', authorUsername: 'agent', message: 'Logout redirect working correctly. All SSO users can properly sign out.', createdAt: createDate(1, 8) },
  
  // Additional comments to reach 200+
  { id: 'CMT-159', ticketId: 'TKT-001', authorUsername: 'agent', message: 'Hotfix deployed to production. Monitoring error rates closely.', createdAt: createDate(0, 12) },
  { id: 'CMT-160', ticketId: 'TKT-003', authorUsername: 'admin', message: 'Backend team identified query optimization opportunity. Expected 90% improvement.', createdAt: createDate(0, 8) },
  { id: 'CMT-161', ticketId: 'TKT-005', authorUsername: 'agent', message: 'Emergency patch submitted to App Store. Should be available in 24-48 hours.', createdAt: createDate(0, 0, 30) },
  { id: 'CMT-162', ticketId: 'TKT-006', authorUsername: 'agent', message: 'Customer agreed to implement suggested pagination changes.', createdAt: createDate(0, 18) },
  { id: 'CMT-163', ticketId: 'TKT-009', authorUsername: 'admin', message: 'Adding automated index health checks to prevent future issues.', createdAt: createDate(0, 6) },
  { id: 'CMT-164', ticketId: 'TKT-011', authorUsername: 'admin', message: 'Working with infrastructure team on permanent mail server scaling solution.', createdAt: createDate(0, 2) },
  { id: 'CMT-165', ticketId: 'TKT-015', authorUsername: 'agent', message: 'Setting up monitoring alerts for SMS delivery rates.', createdAt: createDate(0, 0, 30) },
  { id: 'CMT-166', ticketId: 'TKT-023', authorUsername: 'admin', message: 'Adding regression tests to prevent similar issues in future releases.', createdAt: createDate(0, 4) },
  { id: 'CMT-167', ticketId: 'TKT-024', authorUsername: 'agent', message: 'First batch of memory leak fixes deployed. Memory usage reduced by 30%.', createdAt: createDate(0, 6) },
  { id: 'CMT-168', ticketId: 'TKT-027', authorUsername: 'admin', message: 'Adding cron job monitoring dashboard to prevent silent failures.', createdAt: createDate(0, 6) },
  { id: 'CMT-169', ticketId: 'TKT-031', authorUsername: 'agent', message: 'Navigation fix pushed. Testing on various mobile devices.', createdAt: createDate(0, 2) },
  { id: 'CMT-170', ticketId: 'TKT-032', authorUsername: 'admin', message: 'Database team adding read replicas for better peak hour handling.', createdAt: createDate(0, 0, 45) },
  { id: 'CMT-171', ticketId: 'TKT-043', authorUsername: 'agent', message: 'Filter persistence working well. Users reporting positive feedback.', createdAt: createDate(0, 4) },
  { id: 'CMT-172', ticketId: 'TKT-044', authorUsername: 'admin', message: 'Optimistic locking implementation 50% complete. Testing edge cases.', createdAt: createDate(0, 4) },
  { id: 'CMT-173', ticketId: 'TKT-047', authorUsername: 'agent', message: 'Audit logging coverage now at 100%. All user actions tracked.', createdAt: createDate(0, 4) },
  { id: 'CMT-174', ticketId: 'TKT-055', authorUsername: 'agent', message: 'PDF viewer initialization complete. Testing with various file sizes.', createdAt: createDate(0, 8) },
  { id: 'CMT-175', ticketId: 'TKT-056', authorUsername: 'admin', message: 'Token refresh working. Bot reconnects automatically now.', createdAt: createDate(0, 10) },
  { id: 'CMT-176', ticketId: 'TKT-059', authorUsername: 'agent', message: 'Bounce handling webhook processing correctly. Invalid emails marked.', createdAt: createDate(0, 8) },
  { id: 'CMT-177', ticketId: 'TKT-063', authorUsername: 'agent', message: 'Editor configuration fixed. Rich text preserved on edit.', createdAt: createDate(0, 6) },
  { id: 'CMT-178', ticketId: 'TKT-067', authorUsername: 'agent', message: 'Validation working on all custom field types. Testing complete.', createdAt: createDate(0, 4) },
  { id: 'CMT-179', ticketId: 'TKT-071', authorUsername: 'agent', message: 'User merge tool in QA testing. Should be ready for production next week.', createdAt: createDate(0, 8) },
  { id: 'CMT-180', ticketId: 'TKT-075', authorUsername: 'agent', message: 'Webhook retry logic working. Failed deliveries being retried successfully.', createdAt: createDate(0, 6) },
  { id: 'CMT-181', ticketId: 'TKT-079', authorUsername: 'agent', message: 'Real-time sync much faster now. Users noticing immediate updates.', createdAt: createDate(0, 4) },
  { id: 'CMT-182', ticketId: 'TKT-083', authorUsername: 'agent', message: 'Self-service upgrade flow in testing. Billing integration verified.', createdAt: createDate(0, 8) },
  { id: 'CMT-183', ticketId: 'TKT-087', authorUsername: 'agent', message: 'Mention notifications now working. Testing with different scenarios.', createdAt: createDate(0, 6) },
  { id: 'CMT-184', ticketId: 'TKT-091', authorUsername: 'agent', message: 'Permission sync complete. Subfolder permissions updating correctly.', createdAt: createDate(0, 2) },
  { id: 'CMT-185', ticketId: 'TKT-095', authorUsername: 'agent', message: 'Autocomplete=off preventing conflicts. Forms working reliably now.', createdAt: createDate(0, 8) },
  { id: 'CMT-186', ticketId: 'TKT-099', authorUsername: 'agent', message: 'IndexedDB migration complete. Widget settings persist correctly.', createdAt: createDate(0, 6) },
  { id: 'CMT-187', ticketId: 'TKT-002', authorUsername: 'admin', message: 'Customer IT team completed whitelist. No more bounced emails.', createdAt: createDate(0, 4) },
  { id: 'CMT-188', ticketId: 'TKT-012', authorUsername: 'agent', message: 'Customer re-authorized the integration. Calendar sync working again.', createdAt: createDate(0, 6) },
  { id: 'CMT-189', ticketId: 'TKT-020', authorUsername: 'admin', message: 'Documentation updates 75% complete. High-priority endpoints done.', createdAt: createDate(0, 8) },
  { id: 'CMT-190', ticketId: 'TKT-038', authorUsername: 'admin', message: 'Batch processing implemented. Large bulk operations stable now.', createdAt: createDate(0, 8) },
  { id: 'CMT-191', ticketId: 'TKT-039', authorUsername: 'agent', message: 'CDN edge nodes configured. Avatars loading correctly everywhere.', createdAt: createDate(0, 6) },
  { id: 'CMT-192', ticketId: 'TKT-046', authorUsername: 'admin', message: 'Image compression active. Average upload size reduced by 60%.', createdAt: createDate(0, 8) },
  { id: 'CMT-193', ticketId: 'TKT-052', authorUsername: 'admin', message: 'DNS propagation complete. SSL certificate active on custom domain.', createdAt: createDate(0, 6) },
  { id: 'CMT-194', ticketId: 'TKT-058', authorUsername: 'admin', message: 'Migration guide published. Customers can now upgrade from v1 to v2.', createdAt: createDate(0, 4) },
  { id: 'CMT-195', ticketId: 'TKT-060', authorUsername: 'admin', message: 'FFmpeg configured and working. Video thumbnails generating correctly.', createdAt: createDate(0, 8) },
  { id: 'CMT-196', ticketId: 'TKT-066', authorUsername: 'admin', message: 'Version history API fixed. Previous versions now accessible.', createdAt: createDate(0, 8) },
  { id: 'CMT-197', ticketId: 'TKT-074', authorUsername: 'admin', message: 'Auto-scaling enabled for export workers. Queue processing faster.', createdAt: createDate(0, 4) },
  { id: 'CMT-198', ticketId: 'TKT-076', authorUsername: 'admin', message: 'Backup CAPTCHA provider active. Login working normally again.', createdAt: createDate(0, 2) },
  { id: 'CMT-199', ticketId: 'TKT-086', authorUsername: 'admin', message: 'Timeout increased. Large imports completing successfully now.', createdAt: createDate(0, 4) },
  { id: 'CMT-200', ticketId: 'TKT-096', authorUsername: 'admin', message: 'Password policy updated. All new passwords must meet new requirements.', createdAt: createDate(0, 4) },
  { id: 'CMT-201', ticketId: 'TKT-098', authorUsername: 'admin', message: 'Detailed error logging added. Investigating specific restore failure.', createdAt: createDate(0, 2) },
  { id: 'CMT-202', ticketId: 'TKT-100', authorUsername: 'admin', message: 'All missing translation keys added. Testing with native speakers.', createdAt: createDate(0, 6) },
  { id: 'CMT-203', ticketId: 'TKT-102', authorUsername: 'admin', message: 'Template save endpoint fixed. Database constraint was too strict.', createdAt: createDate(0, 6) },
  { id: 'CMT-204', ticketId: 'TKT-103', authorUsername: 'agent', message: 'Infrastructure approved 25MB limit. Change scheduled for next maintenance window.', createdAt: createDate(0, 8) },
  { id: 'CMT-205', ticketId: 'TKT-104', authorUsername: 'admin', message: 'Retention policy job now has alerting. Investigating root cause of failures.', createdAt: createDate(0, 4) }
];

