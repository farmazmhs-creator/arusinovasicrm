# Architecture

## Stack
- **Frontend:** Next.js 14 (App Router) + Tailwind CSS + shadcn/ui
- **Backend/DB:** Supabase (Postgres + RLS + Realtime)
- **Hosting:** Vercel (frontend) + Supabase cloud (DB + Auth)
- **Notifications (later):** Supabase Edge Functions + Resend (email) + Twilio (SMS/WhatsApp)

## What to Build Now vs Later
**Now:** Quotation engine, Kanban board, PO tracking, Inventory, Vendor pricing, Activity timeline, Dashboards, Automation rules table (evaluated server-side)
**Next:** Automation rule executor (Edge Functions), Approval workflow chains, Task management, Global search, Bulk actions, Auth + RLS lock-down
**Later:** AI deal scoring, WhatsApp bot, Report builder, Mobile app, 7-year compliance export

## Key Action Flow — "Sales rep drags quote to Sent"
1. Rep drags Kanban card → frontend calls `PATCH /api/quotations/:id` with `{ status: 'sent', sent_at: now() }`
2. API route validates transition, writes to `quotations` table, writes row to `audit_logs`
3. Server checks `automation_rules` for `quote.sent` triggers; if `total_amount > 100000`, queues a notification row
4. Supabase Realtime pushes the updated row to all connected clients
5. Kanban board re-renders the card in its new column with correct colour

## Layer Plan
1. **Data first** — all domain tables live in Postgres; constraints enforce valid states
2. **App logic** — Next.js API routes own all state transitions and automation rule evaluation
3. **Smart features** — deal scoring and health scores are computed fields stored with `_source`, `_confidence`, `_review_status`; the core works without them

## Why Core Runs Without AI
All status transitions, inventory deductions, and audit writes are deterministic server logic. AI fields are nullable — removing them leaves a fully functional CRM.
