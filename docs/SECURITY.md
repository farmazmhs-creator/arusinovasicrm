# Security

## Secret Handling
- All Supabase keys, Twilio credentials, and SMTP secrets live in Vercel environment variables — never in frontend bundles or committed to the repo
- `SUPABASE_SERVICE_ROLE_KEY` used only in Next.js API routes (server-side); frontend uses `SUPABASE_ANON_KEY` only
- No secrets in `localStorage`, cookies without `httpOnly`, or client-side logs

## Permission Model (current — v1 demo)
- RLS enabled on all tables; permissive v1 policies allow anonymous read/write for demo
- Sprint 6 replaces with: `auth.uid() = user_id` for writes; role column checked for director-only routes
- Four roles: `sales_rep`, `ops`, `director`, `admin` — enforced in API route middleware and UI visibility

## Approved Tools Rule
- Agents and automation rules may only call the named tools listed in `AGENTIC_LAYER.md`
- No `run_any`, `eval`, or raw SQL execution from client-supplied input
- Every tool call is validated server-side and produces an `audit_logs` row

## Audit Principle
- Every state-changing action writes an immutable `audit_logs` row before returning a response
- Audit logs are append-only (no UPDATE/DELETE policy, even post lock-down)
- 7-year retention: archive export is a human-only critical action

## Pre-launch Checklist (before real customer data)
- [ ] Complete Sprint 6 lock-down (auth + owner-scoped RLS)
- [ ] Rotate all Supabase keys after removing permissive v1 policies
- [ ] Penetration-test API routes for IDOR on object_id parameters
- [ ] Confirm audit_logs has no DELETE RLS policy
- [ ] Review Twilio webhook signature validation before WhatsApp bot goes live
