# Tasks & Sprints

## Sprint 1 — DB Foundation + Quotation Core Engine
**Goal:** The one core action works end-to-end: create a quotation with line items, transition its status, and write an audit log. All screens render without login.

- [ ] Run migration SQL; verify all tables and seed rows exist in Supabase
- [ ] `/quotations` list page: shows all quotes, status badges, amounts — no login required
- [ ] Create quotation form: customer picker, line items (product, qty, unit price), auto-sum total
- [ ] Edit quotation form: saves new `quote_versions` row on each save
- [ ] Status transition buttons: Pending → Sent, Sent → Approved (write `sent_at`/`approved_at`)
- [ ] Audit log write on every status change (actor = 'demo' until auth)
- [ ] Quote detail page: line items, version history list, notes
- [ ] Empty state (no quotes), loading skeleton, error toast on all list/form pages

**Definition of Done:** Create a new quote end-to-end in a browser; confirm the row in Supabase Table Editor with correct status and a matching audit_log row. No login prompt appears.

---

## Sprint 2 — PO + Inventory + Vendor Pricing
**Goal:** Ops can receive a PO, mark partial deliveries, and see live stock levels.

- [ ] `/pos` list + detail page (status, delivery due, customer)
- [ ] Mark line-item delivery: increment `quantity_delivered`, auto-update `inventory.quantity_allocated`
- [ ] PO status auto-updates to `partial` or `delivered` based on line completion
- [ ] `/inventory` page: table of products, on-hand, allocated, available; red badge if below threshold
- [ ] Vendor pricing page: list all prices, add new version, mark old version `is_current = false`
- [ ] Audit log on PO and inventory changes
- [ ] Empty, loading, error states on all new pages

**Definition of Done:** Receive PO-2026-001, mark 5 more units of Device A delivered — inventory `quantity_allocated` decreases and PO status updates to `delivered` if fully complete.

---

## Sprint 3 — Kanban Pipeline + Activity Timeline ✦ v1 functional milestone
**Goal:** Sales rep can manage the full pipeline visually and see complete customer history.

- [ ] `/pipeline` Kanban: three columns (Pending / Sent / Approved), drag-drop updates `quotations.status` in DB
- [ ] Card colour-coding: red (expired), yellow (≤1 day to expiry), green (on track)
- [ ] Click card → quote detail; double-click → inline edit mode
- [ ] Convert Approved quote to PO button (creates `pos` row)
- [ ] `/customers/:id/timeline` — activity timeline with all activity types
- [ ] Filter timeline by type (All / Calls / Emails / Meetings / Notes / Quotes / POs)
- [ ] Log call, add note, send email, schedule meeting forms — all persist to `activities`
- [ ] Wire three dashboards to live DB queries (counts, totals, recent activity)

**Definition of Done (v1 success scenario):** Drag Q-2026-004 from Pending to Sent — DB row updates, audit log written, card moves columns. Open ABC Hospital timeline, log a call — activity row appears immediately in filtered view.

---

## Sprint 4 — Automation Engine + Notifications
**Goal:** 7 pre-built rules fire on relevant events and write notification rows.

- [ ] `automation_rules` management page: list, enable/disable toggle, view rule detail
- [ ] Server-side rule evaluator runs on `quote.sent`, `po.created`, and cron-like API calls
- [ ] Each fired rule writes a `notifications` row with correct role, channel, subject
- [ ] `/notifications` inbox: list unread, mark read, link to related object
- [ ] Daily digest: aggregate unread notifications into summary view
- [ ] Bulk actions on quotations: multi-select → bulk send, bulk archive, bulk assign

**Definition of Done:** Create a quote >RM 100K and send it — a notification row appears in the director's inbox without manual action.

---

## Sprint 5 — Approval Workflows + Tasks + Search
**Goal:** Director can approve/reject quotes; reps have task lists; everyone can search.

- [ ] Approval routing: quotes with `discount_pct > 20%` or `total_amount > 100000` set `approval_required = true` and notify director
- [ ] Approve / reject-with-comment / request-revision actions on quote detail
- [ ] Full approval audit trail in `audit_logs`
- [ ] Task management: create, assign, due date, link to quote/PO/customer; list + calendar view
- [ ] Global search across quotations, POs, customers, contacts
- [ ] Saved filter sets per page

**Definition of Done:** Create Q-2026-005 (RM 120K, 10% discount) and send — `approval_required` flips true, director notification fires, director approves — status changes to Approved with audit entry.

---

## Sprint 6 — Lock It Down (Auth + Per-User RLS)
**Goal:** Real users log in; data is owner-scoped; no anonymous write access.

- [ ] Supabase Auth: email/password signup + login pages
- [ ] User profile table linked to `auth.users`; role column set at invite
- [ ] Replace all `v1_write` RLS policies with `auth.uid() = user_id`
- [ ] `v1_read` policies replaced with role-based read rules
- [ ] Route middleware: redirect unauthenticated users to /login for write actions
- [ ] Director-only pages (approval queue, automation rules edit) gated by role
- [ ] Verify seed data still visible; update seed `user_id` to a demo auth account
- [ ] Rotate Supabase anon key after policy swap

**Definition of Done:** Log in as sales_rep; confirm you cannot see director approval queue. Log out; confirm list pages still render (public read) but create-form is blocked.

---

## Sprint 7 — Performance Benchmarking + Report Builder
**Goal:** Director has self-service KPI visibility without raising IT tickets.

- [ ] Rep KPI dashboard: approval rate, quote-to-PO conversion, avg days to close, revenue closed
- [ ] Ops KPI dashboard: turnaround time, on-time delivery %, SLA breach count
- [ ] 30/60/90-day trend charts (Recharts)
- [ ] No-code report builder: select source, columns, filters, group-by, sort
- [ ] Export to CSV + Excel (xlsx); save report configuration

**Definition of Done:** Director builds a "High-Value POs last 30 days" report, exports to Excel, and saves the config — next visit the saved report is listed and re-runnable.

---

## Sprint 8 — AI Deal Scoring + Customer Health
**Goal:** Sales reps see data-backed probability on every quote card.

- [ ] Import 935 historical deals into a `deal_history` seed table
- [ ] Rule-based deal score function (repeat customer, rep rate, quote timing, committee flag)
- [ ] Write score to `quotations.deal_score` + `_source` JSON + `_confidence` + `_review_status`
- [ ] Deal score card on quote detail and Kanban card tooltip
- [ ] Customer health score (engagement, order frequency) on customer detail page
- [ ] Churn-risk badge and upsell flag on customer list

**Definition of Done:** Open Q-2026-001 — deal score displays 78% with factor breakdown. score_source JSON is readable in Supabase. Marking the quote Approved writes a new `deal_history` row for future model training.

---

## Gantt (Sprint → Weeks)
```
Sprint 1 | Wk 1
Sprint 2 | Wk 2
Sprint 3 | Wk 3       ← v1 functional
Sprint 4 | Wk 4
Sprint 5 | Wk 5
Sprint 6 | Wk 6       ← lock-down
Sprint 7 | Wk 8–9
Sprint 8 | Wk 10–11
```
