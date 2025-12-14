create table if not exists products (
  id varchar(36) primary key,
  name varchar(255) not null,
  category varchar(100) not null,
  amount integer not null default 0,
  price numeric(10,2) not null,
  min_stock integer not null default 0,
  supplier varchar(255),
  created_at timestamp default current_timestamp,
  updated_at timestamp default current_timestamp
);

create table if not exists sales (
  id varchar(36) primary key,
  product varchar(255) not null,
  quantity integer not null,
  price numeric(10,2) not null,
  total numeric(10,2) not null,
  ticket_number varchar(50) unique not null,
  client varchar(255) not null,
  payment_method varchar(50) not null,
  subtotal numeric(10,2) not null,
  tax numeric(10,2) not null,
  warranty varchar(255),
  sale_date varchar(20) not null,
  sale_time varchar(20) not null,
  created_at timestamp default current_timestamp
);

create table if not exists promotions (
  id varchar(36) primary key,
  name varchar(255) not null,
  discount integer not null,
  active boolean default true,
  start_date varchar(20) not null,
  end_date varchar(20) not null,
  description text,
  applicable_categories varchar(500),
  created_at timestamp default current_timestamp,
  updated_at timestamp default current_timestamp
);

create table if not exists reports (
  id varchar(36) primary key,
  title varchar(255) not null,
  type varchar(50) not null,
  report_date varchar(20) not null,
  status varchar(50) not null,
  description text,
  period varchar(100),
  total_sales integer,
  revenue numeric(10,2),
  total_products integer,
  low_stock_items integer,
  active_promos integer,
  total_discount numeric(10,2),
  created_at timestamp default current_timestamp
);

create index if not exists idx_products_category on products(category);
create index if not exists idx_products_amount on products(amount);
create index if not exists idx_sales_date on sales(sale_date);
create index if not exists idx_sales_ticket on sales(ticket_number);
create index if not exists idx_promotions_active on promotions(active);
create index if not exists idx_reports_type on reports(type);

alter publication supabase_realtime add table products;
alter publication supabase_realtime add table sales;
alter publication supabase_realtime add table promotions;
alter publication supabase_realtime add table reports;

alter table products enable row level security;
alter table sales enable row level security;
alter table promotions enable row level security;
alter table reports enable row level security;

create policy "Allow read to anon" on products for select using (true);
create policy "Allow write with service role" on products for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

create policy "Allow read to anon" on sales for select using (true);
create policy "Allow write with service role" on sales for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

create policy "Allow read to anon" on promotions for select using (true);
create policy "Allow write with service role" on promotions for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

create policy "Allow read to anon" on reports for select using (true);
create policy "Allow write with service role" on reports for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

drop policy if exists "anon insert products" on products;
create policy "anon insert products" on products for insert to public with check (true);
drop policy if exists "anon update products" on products;
create policy "anon update products" on products for update to public using (true) with check (true);
drop policy if exists "anon delete products" on products;
create policy "anon delete products" on products for delete to public using (true);

drop policy if exists "anon insert sales" on sales;
create policy "anon insert sales" on sales for insert to public with check (true);
drop policy if exists "anon delete sales" on sales;
create policy "anon delete sales" on sales for delete to public using (true);

drop policy if exists "anon insert promotions" on promotions;
create policy "anon insert promotions" on promotions for insert to public with check (true);
drop policy if exists "anon update promotions" on promotions;
create policy "anon update promotions" on promotions for update to public using (true) with check (true);
drop policy if exists "anon delete promotions" on promotions;
create policy "anon delete promotions" on promotions for delete to public using (true);

drop policy if exists "anon insert reports" on reports;
create policy "anon insert reports" on reports for insert to public with check (true);
drop policy if exists "anon delete reports" on reports;
create policy "anon delete reports" on reports for delete to public using (true);

create table if not exists profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  role text not null check (role in ('admin','editor','viewer')),
  active boolean not null default true,
  created_at timestamp default current_timestamp,
  updated_at timestamp default current_timestamp
);

create or replace function is_admin(uid uuid)
returns boolean
language sql stable
as $$
  select exists (
    select 1 from profiles p where p.user_id = uid and p.role = 'admin' and p.active = true
  );
$$;

alter table profiles enable row level security;

drop policy if exists "admin manage profiles" on profiles;
create policy "admin manage profiles" on profiles for all to authenticated using (is_admin(auth.uid())) with check (is_admin(auth.uid()));

drop policy if exists "user read own profile" on profiles;
create policy "user read own profile" on profiles for select to authenticated using (user_id = auth.uid());

alter table products add column if not exists created_by uuid not null default auth.uid();
alter table sales add column if not exists created_by uuid not null default auth.uid();
alter table promotions add column if not exists created_by uuid not null default auth.uid();
alter table reports add column if not exists created_by uuid not null default auth.uid();

drop policy if exists "anon insert products" on products;
drop policy if exists "anon update products" on products;
drop policy if exists "anon delete products" on products;

drop policy if exists "anon insert sales" on sales;
drop policy if exists "anon delete sales" on sales;

drop policy if exists "anon insert promotions" on promotions;
drop policy if exists "anon update promotions" on promotions;
drop policy if exists "anon delete promotions" on promotions;

drop policy if exists "anon insert reports" on reports;
drop policy if exists "anon delete reports" on reports;

create policy "authenticated insert products" on products for insert to authenticated with check (
  exists(select 1 from profiles p where p.user_id = auth.uid() and p.active = true)
);

create policy "authenticated update own products" on products for update to authenticated using (
  created_by = auth.uid() and exists(select 1 from profiles p where p.user_id = auth.uid() and p.active = true)
) with check (created_by = auth.uid());

create policy "authenticated delete own products" on products for delete to authenticated using (
  created_by = auth.uid() and exists(select 1 from profiles p where p.user_id = auth.uid() and p.active = true)
);

create policy "authenticated insert sales" on sales for insert to authenticated with check (
  exists(select 1 from profiles p where p.user_id = auth.uid() and p.active = true)
);

create policy "authenticated delete own sales" on sales for delete to authenticated using (
  created_by = auth.uid() and exists(select 1 from profiles p where p.user_id = auth.uid() and p.active = true)
);

create policy "authenticated insert promotions" on promotions for insert to authenticated with check (
  exists(select 1 from profiles p where p.user_id = auth.uid() and p.active = true)
);

create policy "authenticated update own promotions" on promotions for update to authenticated using (
  created_by = auth.uid() and exists(select 1 from profiles p where p.user_id = auth.uid() and p.active = true)
) with check (created_by = auth.uid());

create policy "authenticated delete own promotions" on promotions for delete to authenticated using (
  created_by = auth.uid() and exists(select 1 from profiles p where p.user_id = auth.uid() and p.active = true)
);

create policy "authenticated insert reports" on reports for insert to authenticated with check (
  exists(select 1 from profiles p where p.user_id = auth.uid() and p.active = true)
);

create policy "authenticated delete own reports" on reports for delete to authenticated using (
  created_by = auth.uid() and exists(select 1 from profiles p where p.user_id = auth.uid() and p.active = true)
);
