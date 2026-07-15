create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  created_at timestamptz not null default now(),
  name text not null,
  industry text,
  tier text default 'standard',
  health_score numeric,
  health_score_source text,
  health_score_confidence numeric,
  health_score_review_status text default 'unreviewed',
  churn_risk text default 'low',
  notes text
);
alter table customers enable row level security;
drop policy if exists "customers_v1_read" on customers;
create policy "customers_v1_read" on customers for select using (true);
drop policy if exists "customers_v1_write" on customers;
create policy "customers_v1_write" on customers for all using (true) with check (true);

create table if not exists contacts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  created_at timestamptz not null default now(),
  customer_id uuid references customers(id),
  name text not null,
  title text,
  email text,
  phone text,
  is_primary boolean default false
);
alter table contacts enable row level security;
drop policy if exists "contacts_v1_read" on contacts;
create policy "contacts_v1_read" on contacts for select using (true);
drop policy if exists "contacts_v1_write" on contacts;
create policy "contacts_v1_write" on contacts for all using (true) with check (true);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  created_at timestamptz not null default now(),
  sku text not null,
  name text not null,
  description text,
  unit text default 'unit',
  reorder_threshold integer default 50
);
alter table products enable row level security;
drop policy if exists "products_v1_read" on products;
create policy "products_v1_read" on products for select using (true);
drop policy if exists "products_v1_write" on products;
create policy "products_v1_write" on products for all using (true) with check (true);

create table if not exists inventory (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  created_at timestamptz not null default now(),
  product_id uuid references products(id),
  quantity_on_hand integer not null default 0,
  quantity_allocated integer not null default 0,
  quantity_available integer generated always as (quantity_on_hand - quantity_allocated) stored
);
alter table inventory enable row level security;
drop policy if exists "inventory_v1_read" on inventory;
create policy "inventory_v1_read" on inventory for select using (true);
drop policy if exists "inventory_v1_write" on inventory;
create policy "inventory_v1_write" on inventory for all using (true) with check (true);

create table if not exists vendor_prices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  created_at timestamptz not null default now(),
  product_id uuid references products(id),
  vendor_name text not null,
  unit_price numeric not null,
  currency text default 'MYR',
  effective_from date not null,
  effective_to date,
  version integer not null default 1,
  is_current boolean default true
);
alter table vendor_prices enable row level security;
drop policy if exists "vendor_prices_v1_read" on vendor_prices;
create policy "vendor_prices_v1_read" on vendor_prices for select using (true);
drop policy if exists "vendor_prices_v1_write" on vendor_prices;
create policy "vendor_prices_v1_write" on vendor_prices for all using (true) with check (true);

create table if not exists quotations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  created_at timestamptz not null default now(),
  quote_number text not null unique,
  customer_id uuid references customers(id),
  sales_rep_name text,
  ops_name text,
  status text not null default 'pending',
  total_amount numeric not null default 0,
  discount_pct numeric default 0,
  expires_at date,
  sent_at timestamptz,
  approved_at timestamptz,
  approval_required boolean default false,
  current_version integer default 1,
  deal_score numeric,
  deal_score_source text,
  deal_score_confidence numeric,
  deal_score_review_status text default 'unreviewed',
  notes text
);
alter table quotations enable row level security;
drop policy if exists "quotations_v1_read" on quotations;
create policy "quotations_v1_read" on quotations for select using (true);
drop policy if exists "quotations_v1_write" on quotations;
create policy "quotations_v1_write" on quotations for all using (true) with check (true);

create table if not exists quote_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  created_at timestamptz not null default now(),
  quotation_id uuid references quotations(id),
  product_id uuid references products(id),
  quantity integer not null,
  unit_price numeric not null,
  line_total numeric generated always as (quantity * unit_price) stored
);
alter table quote_items enable row level security;
drop policy if exists "quote_items_v1_read" on quote_items;
create policy "quote_items_v1_read" on quote_items for select using (true);
drop policy if exists "quote_items_v1_write" on quote_items;
create policy "quote_items_v1_write" on quote_items for all using (true) with check (true);

create table if not exists quote_versions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  created_at timestamptz not null default now(),
  quotation_id uuid references quotations(id),
  version_number integer not null,
  snapshot jsonb not null,
  comment text,
  created_by text
);
alter table quote_versions enable row level security;
drop policy if exists "quote_versions_v1_read" on quote_versions;
create policy "quote_versions_v1_read" on quote_versions for select using (true);
drop policy if exists "quote_versions_v1_write" on quote_versions;
create policy "quote_versions_v1_write" on quote_versions for all using (true) with check (true);

create table if not exists pos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  created_at timestamptz not null default now(),
  po_number text not null unique,
  quotation_id uuid references quotations(id),
  customer_id uuid references customers(id),
  status text not null default 'received',
  total_amount numeric not null default 0,
  delivery_due date,
  delivered_at timestamptz,
  notes text
);
alter table pos enable row level security;
drop policy if exists "pos_v1_read" on pos;
create policy "pos_v1_read" on pos for select using (true);
drop policy if exists "pos_v1_write" on pos;
create policy "pos_v1_write" on pos for all using (true) with check (true);

create table if not exists po_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  created_at timestamptz not null default now(),
  po_id uuid references pos(id),
  product_id uuid references products(id),
  quantity_ordered integer not null,
  quantity_delivered integer not null default 0,
  unit_price numeric not null
);
alter table po_items enable row level security;
drop policy if exists "po_items_v1_read" on po_items;
create policy "po_items_v1_read" on po_items for select using (true);
drop policy if exists "po_items_v1_write" on po_items;
create policy "po_items_v1_write" on po_items for all using (true) with check (true);

create table if not exists activities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  created_at timestamptz not null default now(),
  customer_id uuid references customers(id),
  quotation_id uuid references quotations(id),
  po_id uuid references pos(id),
  activity_type text not null,
  subject text,
  body text,
  logged_by text,
  duration_minutes integer,
  occurred_at timestamptz not null default now()
);
alter table activities enable row level security;
drop policy if exists "activities_v1_read" on activities;
create policy "activities_v1_read" on activities for select using (true);
drop policy if exists "activities_v1_write" on activities;
create policy "activities_v1_write" on activities for all using (true) with check (true);

create table if not exists automation_rules (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  created_at timestamptz not null default now(),
  name text not null,
  trigger_event text not null,
  condition_field text,
  condition_operator text,
  condition_value text,
  actions jsonb not null default '[]',
  is_enabled boolean default true,
  last_fired_at timestamptz,
  fire_count integer default 0
);
alter table automation_rules enable row level security;
drop policy if exists "automation_rules_v1_read" on automation_rules;
create policy "automation_rules_v1_read" on automation_rules for select using (true);
drop policy if exists "automation_rules_v1_write" on automation_rules;
create policy "automation_rules_v1_write" on automation_rules for all using (true) with check (true);

create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  created_at timestamptz not null default now(),
  recipient_role text,
  channel text default 'in_app',
  subject text,
  body text not null,
  is_read boolean default false,
  related_quotation_id uuid references quotations(id),
  related_po_id uuid references pos(id),
  automation_rule_id uuid references automation_rules(id)
);
alter table notifications enable row level security;
drop policy if exists "notifications_v1_read" on notifications;
create policy "notifications_v1_read" on notifications for select using (true);
drop policy if exists "notifications_v1_write" on notifications;
create policy "notifications_v1_write" on notifications for all using (true) with check (true);

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  created_at timestamptz not null default now(),
  actor text,
  action text not null,
  object_type text not null,
  object_id uuid,
  old_value jsonb,
  new_value jsonb,
  ip_address text
);
alter table audit_logs enable row level security;
drop policy if exists "audit_logs_v1_read" on audit_logs;
create policy "audit_logs_v1_read" on audit_logs for select using (true);
drop policy if exists "audit_logs_v1_write" on audit_logs;
create policy "audit_logs_v1_write" on audit_logs for all using (true) with check (true);

insert into customers (id, name, industry, tier) values
  ('a1000000-0000-0000-0000-000000000001', 'ABC Hospital', 'Healthcare', 'premium'),
  ('a1000000-0000-0000-0000-000000000002', 'XYZ Clinic', 'Healthcare', 'standard'),
  ('a1000000-0000-0000-0000-000000000003', 'DEF Medical Centre', 'Healthcare', 'premium'),
  ('a1000000-0000-0000-0000-000000000004', 'PQR Hospital', 'Healthcare', 'standard');

insert into contacts (customer_id, name, title, email, phone, is_primary) values
  ('a1000000-0000-0000-0000-000000000001', 'Dr. Aziz', 'Procurement Director', 'aziz@abchospital.my', '+60123456789', true),
  ('a1000000-0000-0000-0000-000000000002', 'Ms. Lim', 'Finance Manager', 'lim@xyzclinic.my', '+60129876543', true),
  ('a1000000-0000-0000-0000-000000000003', 'Mr. Rajan', 'Supply Chain Lead', 'rajan@defmedical.my', '+60111234567', true),
  ('a1000000-0000-0000-0000-000000000004', 'Dr. Siti', 'HOD Medical Equipment', 'siti@pqrhospital.my', '+60167654321', true);

insert into products (id, sku, name, unit, reorder_threshold) values
  ('b1000000-0000-0000-0000-000000000001', 'DEV-A001', 'Infusion Pump Device A', 'unit', 50),
  ('b1000000-0000-0000-0000-000000000002', 'CMP-B002', 'Sensor Component B', 'unit', 50),
  ('b1000000-0000-0000-0000-000000000003', 'DEV-C003', 'Patient Monitor Device C', 'unit', 20),
  ('b1000000-0000-0000-0000-000000000004', 'ACC-D004', 'Disposable Accessory Pack D', 'box', 100);

insert into inventory (product_id, quantity_on_hand, quantity_allocated) values
  ('b1000000-0000-0000-0000-000000000001', 15, 5),
  ('b1000000-0000-0000-0000-000000000002', 22, 10),
  ('b1000000-0000-0000-0000-000000000003', 120, 30),
  ('b1000000-0000-0000-0000-000000000004', 340, 80);

insert into vendor_prices (product_id, vendor_name, unit_price, currency, effective_from, version, is_current) values
  ('b1000000-0000-0000-0000-000000000001', 'Medtech Supply Sdn Bhd', 4500.00, 'MYR', '2026-01-01', 2, true),
  ('b1000000-0000-0000-0000-000000000002', 'BioComp International', 320.00, 'MYR', '2026-01-01', 1, true),
  ('b1000000-0000-0000-0000-000000000003', 'HealthEquip Malaysia', 12000.00, 'MYR', '2026-03-01', 1, true),
  ('b1000000-0000-0000-0000-000000000004', 'MedDisposables Co.', 85.00, 'MYR', '2026-01-01', 1, true);

insert into quotations (id, quote_number, customer_id, sales_rep_name, ops_name, status, total_amount, discount_pct, expires_at, sent_at, notes) values
  ('c1000000-0000-0000-0000-000000000001', 'Q-2026-001', 'a1000000-0000-0000-0000-000000000001', 'John Tan', 'Zainab', 'sent', 50000.00, 0, '2026-07-21', now() - interval '2 days', 'Awaiting committee approval'),
  ('c1000000-0000-0000-0000-000000000002', 'Q-2026-002', 'a1000000-0000-0000-0000-000000000002', 'John Tan', 'Zainab', 'sent', 75000.00, 5, '2026-07-20', now() - interval '4 days', 'Follow up on bulk discount request'),
  ('c1000000-0000-0000-0000-000000000003', 'Q-2026-003', 'a1000000-0000-0000-0000-000000000003', 'Sarah Ng', 'Ahmad', 'approved', 30000.00, 0, '2026-07-28', now() - interval '6 days', 'Ready to convert to PO'),
  ('c1000000-0000-0000-0000-000000000004', 'Q-2026-004', 'a1000000-0000-0000-0000-000000000004', 'Sarah Ng', 'Ahmad', 'pending', 45000.00, 0, '2026-08-05', null, 'Draft ready, awaiting ops review'),
  ('c1000000-0000-0000-0000-000000000005', 'Q-2026-005', 'a1000000-0000-0000-0000-000000000001', 'John Tan', 'Zainab', 'pending', 120000.00, 10, '2026-08-10', null, 'Large quote — director approval needed');

insert into quote_items (quotation_id, product_id, quantity, unit_price) values
  ('c1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 10, 4500.00),
  ('c1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000003', 5, 12000.00),
  ('c1000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000004', 200, 85.00),
  ('c1000000-0000-0000-0000-000000000004', 'b1000000-0000-0000-0000-000000000002', 50, 320.00),
  ('c1000000-0000-0000-0000-000000000005', 'b1000000-0000-0000-0000-000000000003', 10, 12000.00);

insert into pos (id, po_number, quotation_id, customer_id, status, total_amount, delivery_due) values
  ('d1000000-0000-0000-0000-000000000001', 'PO-2026-001', 'c1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000001', 'partial', 50000.00, '2026-07-25'),
  ('d1000000-0000-0000-0000-000000000002', 'PO-2026-002', null, 'a1000000-0000-0000-0000-000000000002', 'received', 75000.00, '2026-07-30');

insert into po_items (po_id, product_id, quantity_ordered, quantity_delivered, unit_price) values
  ('d1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 10, 5, 4500.00),
  ('d1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000002', 5, 0, 320.00),
  ('d1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000003', 6, 0, 12000.00);

insert into activities (customer_id, quotation_id, activity_type, subject, body, logged_by, duration_minutes, occurred_at) values
  ('a1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'email', 'Updated quote with bulk discount', 'Sent revised Q-2026-001 to Dr. Aziz', 'John Tan', null, now() - interval '1 hour'),
  ('a1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'call', 'Discount negotiation call', 'Customer requesting 15% bulk discount. Need director approval.', 'John Tan', 30, now() - interval '1 day'),
  ('a1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000002', 'meeting', 'Product evaluation & pricing', 'Committee meeting. Need to finalise pricing before Jul 20.', 'Sarah Ng', 45, now() - interval '3 days'),
  ('a1000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000003', 'note', 'PO expected this week', 'DEF Medical confirmed verbal approval. PO incoming.', 'Sarah Ng', null, now() - interval '5 days');

insert into automation_rules (name, trigger_event, condition_field, condition_operator, condition_value, actions, is_enabled) values
  ('Large Quote Alert', 'quote.sent', 'total_amount', '>', '100000', '[{"type":"notify","role":"director","channel":"email"},{"type":"notify","role":"director","channel":"sms"}]', true),
  ('Quote Pending >7 Days', 'quote.pending_check', 'days_pending', '>', '7', '[{"type":"notify","role":"ops","channel":"in_app"},{"type":"create_task","title":"Send overdue quote"}]', true),
  ('Quote Expiring Tomorrow', 'quote.expiry_check', 'days_to_expiry', '=', '1', '[{"type":"notify","role":"sales_rep","channel":"in_app"}]', true),
  ('PO Received Auto-Alert', 'po.created', null, null, null, '[{"type":"notify","role":"sales_rep","channel":"in_app"},{"type":"notify","role":"ops","channel":"email"},{"type":"reserve_stock"},{"type":"create_task","title":"Prepare delivery"}]', true),
  ('Stock Below Threshold', 'inventory.below_threshold', null, null, null, '[{"type":"notify","role":"ops","channel":"in_app"}]', true),
  ('Overdue Delivery Reminder', 'po.delivery_overdue', null, null, null, '[{"type":"notify","role":"ops","channel":"in_app"}]', true),
  ('Quote Unsent 24hr SLA', 'quote.unsent_check', 'hours_since_created', '>', '24', '[{"type":"notify","role":"ops","channel":"in_app"}]', true);