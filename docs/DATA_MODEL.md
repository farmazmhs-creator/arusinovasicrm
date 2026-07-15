# Data Model

## customers
`id` uuid PK · `name` text · `industry` text · `tier` text · `health_score` numeric · `health_score_source` text · `health_score_confidence` numeric · `health_score_review_status` text · `churn_risk` text · `notes` text · `user_id` uuid (nullable) · `created_at`

## contacts
`id` · `customer_id` → customers · `name` · `title` · `email` · `phone` · `is_primary` bool · `user_id` · `created_at`

## products
`id` · `sku` text unique · `name` · `description` · `unit` · `reorder_threshold` int · `user_id` · `created_at`

## inventory
`id` · `product_id` → products · `quantity_on_hand` int · `quantity_allocated` int · `quantity_available` (generated: on_hand − allocated) · `user_id` · `created_at`

## vendor_prices
`id` · `product_id` → products · `vendor_name` · `unit_price` numeric · `currency` · `effective_from` date · `effective_to` date · `version` int · `is_current` bool · `user_id` · `created_at`

## quotations
`id` · `quote_number` text unique · `customer_id` → customers · `sales_rep_name` · `ops_name` · `status` text (`pending|sent|approved|rejected|expired`) · `total_amount` · `discount_pct` · `expires_at` · `sent_at` · `approved_at` · `approval_required` bool · `current_version` int · `deal_score` numeric · `deal_score_source` text · `deal_score_confidence` numeric · `deal_score_review_status` text · `notes` · `user_id` · `created_at`

## quote_items
`id` · `quotation_id` → quotations · `product_id` → products · `quantity` int · `unit_price` numeric · `line_total` (generated) · `user_id` · `created_at`

## quote_versions
`id` · `quotation_id` → quotations · `version_number` int · `snapshot` jsonb · `comment` text · `created_by` text · `user_id` · `created_at`

## pos
`id` · `po_number` text unique · `quotation_id` → quotations (nullable) · `customer_id` → customers · `status` text (`received|partial|delivered|closed`) · `total_amount` · `delivery_due` date · `delivered_at` · `notes` · `user_id` · `created_at`

## po_items
`id` · `po_id` → pos · `product_id` → products · `quantity_ordered` int · `quantity_delivered` int · `unit_price` numeric · `user_id` · `created_at`

## activities
`id` · `customer_id` → customers · `quotation_id` → quotations (nullable) · `po_id` → pos (nullable) · `activity_type` text (`call|email|note|meeting|quote_event|po_event`) · `subject` · `body` · `logged_by` · `duration_minutes` int · `occurred_at` timestamptz · `user_id` · `created_at`

## automation_rules
`id` · `name` · `trigger_event` text · `condition_field` text · `condition_operator` text · `condition_value` text · `actions` jsonb · `is_enabled` bool · `last_fired_at` · `fire_count` int · `user_id` · `created_at`

## notifications
`id` · `recipient_role` text · `channel` text (`in_app|email|sms`) · `subject` · `body` · `is_read` bool · `related_quotation_id` → quotations · `related_po_id` → pos · `automation_rule_id` → automation_rules · `user_id` · `created_at`

## audit_logs
`id` · `actor` text · `action` text · `object_type` text · `object_id` uuid · `old_value` jsonb · `new_value` jsonb · `ip_address` text · `user_id` · `created_at`

### RLS
All tables have RLS enabled. v1 policies are fully permissive (demo-first). Sprint 6 replaces with `auth.uid() = user_id` owner-scoped policies.

### AI Fields
`quotations.deal_score` + `customers.health_score` — both stored with `_source`, `_confidence`, `_review_status`. Nullable; system runs without them.
