create table if not exists public.weekly_search_usage (
  user_id uuid not null references auth.users(id) on delete cascade,
  week_start date not null,
  used integer not null default 0 check (used >= 0),
  updated_at timestamptz not null default now(),
  primary key (user_id, week_start)
);
alter table public.weekly_search_usage enable row level security;
drop policy if exists "own weekly search usage" on public.weekly_search_usage;
create policy "own weekly search usage" on public.weekly_search_usage for select using (user_id = auth.uid());

create or replace function public.get_weekly_search_quota()
returns table(plan text, weekly_limit integer, used integer, remaining integer, week_start date)
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  current_week date := date_trunc('week', now())::date;
  p text := 'free';
  lim integer := 10;
  u integer := 0;
begin
  if uid is null then
    raise exception 'not_authenticated';
  end if;
  select coalesce(s.plan, 'free') into p from public.subscriptions s where s.user_id = uid limit 1;
  lim := case lower(p) when 'max' then 150 when 'pro' then 50 else 10 end;
  select coalesce(w.used,0) into u from public.weekly_search_usage w where w.user_id=uid and w.week_start=current_week;
  return query select p, lim, u, greatest(lim-u,0), current_week;
end;
$$;

create or replace function public.consume_weekly_search()
returns table(allowed boolean, plan text, weekly_limit integer, used integer, remaining integer, week_start date)
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  current_week date := date_trunc('week', now())::date;
  p text := 'free';
  lim integer := 10;
  u integer := 0;
begin
  if uid is null then raise exception 'not_authenticated'; end if;
  select coalesce(s.plan,'free') into p from public.subscriptions s where s.user_id=uid limit 1;
  lim := case lower(p) when 'max' then 150 when 'pro' then 50 else 10 end;
  insert into public.weekly_search_usage(user_id,week_start,used)
  values(uid,current_week,0)
  on conflict(user_id,week_start) do nothing;
  update public.weekly_search_usage
  set used=used+1, updated_at=now()
  where user_id=uid and week_start=current_week and used < lim
  returning weekly_search_usage.used into u;
  if u is null then
    select w.used into u from public.weekly_search_usage w where w.user_id=uid and w.week_start=current_week;
    return query select false,p,lim,u,greatest(lim-u,0),current_week;
  end if;
  return query select true,p,lim,u,greatest(lim-u,0),current_week;
end;
$$;

revoke all on function public.get_weekly_search_quota() from public;
grant execute on function public.get_weekly_search_quota() to authenticated;
revoke all on function public.consume_weekly_search() from public;
grant execute on function public.consume_weekly_search() to authenticated;
