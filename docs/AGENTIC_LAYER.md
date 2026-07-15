# Agentic Layer

## Risk Levels & Actions

### Low Risk — Auto-execute (no approval)
- `tag_quote` — add urgency tag on expiry check
- `score_deal` — compute and write deal_score + confidence
- `score_customer_health` — compute and write health_score
- `create_notification` — write notification row to DB
- `log_audit` — write audit_log row

### Medium Risk — Light approval (confirm in UI)
- `update_quote_status` — change status after drag-drop or button; user action IS the approval
- `reserve_stock` — allocate inventory on PO received; ops confirms before commit
- `create_task` — automation rule creates a task; assignee sees it before it's active
- `update_delivery_qty` — mark partial delivery; ops confirms line by line

### High Risk — Named tool, logged, requires explicit approve step
- `send_quote_to_customer` — email quote PDF; requires ops or rep to click Send
- `send_notification_sms` — SMS via Twilio; director-only trigger + confirmation modal
- `fire_automation_rule` — any rule action beyond in-app notify; shown in preview before execution

### Critical — Human-only, no agent autonomy
- Delete quotation / PO / customer record
- Void or refund a PO
- Export 7-year compliance archive
- Modify automation rule conditions in production

## Named Tools (v1)
`update_quote_status` · `reserve_stock` · `create_notification` · `log_audit` · `score_deal` · `send_quote_email`

## Audit Log Fields
Every tool execution writes: `actor`, `action`, `object_type`, `object_id`, `old_value`, `new_value`, `created_at`, `ip_address`.

## v1 vs Later
- **v1:** Automation rules evaluated server-side on API calls; no autonomous scheduling
- **Later:** Supabase Edge Function cron evaluates time-based rules (pending >7 days, expiry tomorrow); WhatsApp bot executes read-only query tools
