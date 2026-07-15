# Test Plan

## v1 Success Scenario (manual, no login required)

### Test A — Create and send a quotation
1. Open `/quotations` — verify Q-2026-001 through Q-2026-005 appear with correct statuses
2. Click **New Quotation** — form opens
3. Select customer "ABC Hospital", add line item: Device A × 5 × RM 4,500 — total shows RM 22,500
4. Click **Save** — new row appears in list; check Supabase `quotations` table confirms insert
5. Click **Send** on the new quote — status changes to `sent`, `sent_at` timestamp written; `audit_logs` has a new row with `action = 'status_change'` and `new_value.status = 'sent'`
6. Verify `quote_versions` has a version row for the save action

### Test B — Kanban drag-drop
1. Open `/pipeline` — confirm three columns with correct quote counts
2. Drag Q-2026-004 (Pending) to Sent column — card moves; reload page; card stays in Sent column (DB persisted)
3. Drag Q-2026-001 (Sent) to Approved — `approved_at` is written; audit log row created

### Test C — PO partial delivery
1. Open PO-2026-001 detail page — shows 5/10 delivered for Device A, 0/5 for Component B
2. Mark 5 more Device A as delivered — `quantity_delivered` updates to 10; inventory `quantity_allocated` decreases
3. Mark 3 Component B delivered — PO status stays `partial`; mark remaining 2 — status auto-updates to `delivered`

### Test D — Activity timeline
1. Open `/customers/ABC Hospital/timeline` — 2+ existing activities visible
2. Click **Log Call** — fill subject and notes, submit — new `call` activity row appears at top of timeline
3. Apply filter **Calls only** — only call activities shown; clear filter — all return

### Test E — Automation rule fires
1. Create a quotation for any customer with total > RM 100,000
2. Send the quotation (status → sent)
3. Open `/notifications` — verify a new notification row exists with `recipient_role = 'director'` and subject referencing the large quote

## Empty State Tests
- Delete all seeded quotes (or use a fresh Supabase project) → `/quotations` shows "No quotations yet" empty state with **New Quotation** CTA
- PO with no items → PO detail shows "No line items" message
- Customer with no activities → timeline shows "No activity recorded yet" with action buttons

## Error State Tests
- Submit quotation form with no customer selected → inline validation error, no DB write
- Attempt to deliver more units than ordered → server rejects with 400, toast displays "Cannot deliver more than ordered quantity"
- Simulate Supabase offline (revoke anon key) → all list pages show "Unable to load data — try again" error state, no blank screen

## Permissions Smoke Test (post Sprint 6)
- Log in as `sales_rep` → cannot access `/automation-rules/edit` (redirected)
- Log in as `director` → can see approval queue and approve quotes
- Log out → list pages still render (public read); clicking **New Quotation** redirects to `/login`
