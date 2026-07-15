# ArusInovasi CRM — Product Requirements Document

## Problem
ArusInovasi's sales and ops teams manage a high-volume medical-device quotation and delivery cycle across email, spreadsheets, and manual follow-ups. Deals slip, stock is mis-allocated, and no single view shows pipeline health.

## Target Users
- **Sales reps** — create, track, and follow up on quotations
- **Ops team** — build quotes, manage POs, track deliveries, monitor stock
- **Director** — approve large quotes, review pipeline and KPIs

## Core Objects
`customers` · `contacts` · `products` · `inventory` · `vendor_prices` · `quotations` · `quote_items` · `quote_versions` · `pos` · `po_items` · `activities` · `automation_rules` · `notifications` · `audit_logs`

## v1 Must-Haves
- [ ] Quotation CRUD with line items, status transitions (Pending → Sent → Approved), and versioning
- [ ] Kanban pipeline board with drag-drop status change and urgency colour-coding
- [ ] PO management: receive, partial delivery mark-off per line item
- [ ] Inventory: stock on-hand, allocated, available; auto-deduct on delivery
- [ ] Vendor pricing table with version history
- [ ] Customer & contact records
- [ ] Activity timeline per customer (calls, emails, notes, meetings)
- [ ] Three live dashboards (sales rep, ops, executive)
- [ ] Audit log on every state change
- [ ] All screens viewable without login (demo-first)

## Non-Goals (v1)
- WhatsApp bot / Twilio integration
- AI deal scoring
- No-code report builder
- Mobile app
- Login wall / per-user RLS (Sprint 6)

## Definition of Done
**Success scenario:** A sales rep opens the Kanban board, drags Q-2026-004 from Pending to Sent — the DB status updates, a timestamp is written, an audit log row is created, and the card recolours. Then the rep opens the customer timeline for ABC Hospital and logs a call — the activity row persists and appears immediately in the filtered timeline. No login required.
