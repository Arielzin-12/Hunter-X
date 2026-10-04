-- HunterX plan result caps, weekly search credits, and atomic consumption.
alter table public.credit_balances
  add column if not exists week_start date not null default date_trunc('week', now())::date;

create or replace function public.plan_weekly_limit(p_plan text)
returns integer
language sql
immutable
set search_path = ''
as $$
  select case lower(coalesce(p_plan, 'free'))
    when 'max' then 150
    when 'pro' then 50
    else 10
  end
$$;

create or replace function public.plan_result_limit(p_plan text)
returns integer
language sql
immutable
set search_path = ''
as $$
  select case lower(coalesce(p_plan, 'free'))
    when 'max' then 50
    when 'pro' then 20
    else 5
  end
$$;

create or replace function public.consume_search_credit()
returns table(
  allowed boolean,
  plan text,
  weekly_limit integer,
  remaining integer,
  result_limit integer,
  week_start date
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  current_week date := date_trunc('week', now())::date;
  p text := 'free';
  lim integer := 10;
  result_lim integer := 5;
  balance integer := 0;
begin
  if uid is null then
    raise exception 'not_authenticated';
  end if;

  select coalesce(s.plan, 'free')
    into p
    from public.subscriptions s
   where s.user_id = uid
   limit 1;

  lim := public.plan_weekly_limit(p);
  result_lim := public.plan_result_limit(p);

  insert into public.credit_balances(user_id, balance, week_start)
  values (uid, lim, current_week)
  on conflict (user_id) do nothing;

  update public.credit_balances
     set balance = lim,
         week_start = current_week,
         updated_at = now()
   where user_id = uid
     and week_start <> current_week;

  update public.credit_balances
     set balance = balance - 1,
         updated_at = now()
   where user_id = uid
     and week_start = current_week
     and balance > 0
  returning credit_balances.balance into balance;

  if balance is null then
    select cb.balance
      into balance
      from public.credit_balances cb
     where cb.user_id = uid;

    return query
    select false, p, lim, greatest(coalesce(balance, 0), 0), result_lim, current_week;
    return;
  end if;

  insert into public.credit_transactions(user_id, amount, reason, metadata)
  values (
    uid,
    -1,
    'lead_search',
    jsonb_build_object('plan', p, 'weekly_limit', lim, 'result_limit', result_lim)
  );

  return query select true, p, lim, balance, result_lim, current_week;
end;
$$;

create or replace function public.refund_search_credit()
returns table(refunded boolean, remaining integer)
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  current_week date := date_trunc('week', now())::date;
  balance integer := 0;
begin
  if uid is null then
    raise exception 'not_authenticated';
  end if;

  update public.credit_balances
     set balance = balance + 1,
         updated_at = now()
   where user_id = uid
     and week_start = current_week
  returning credit_balances.balance into balance;

  if balance is null then
    return query select false, 0;
    return;
  end if;

  insert into public.credit_transactions(user_id, amount, reason, metadata)
  values (uid, 1, 'lead_search_refund', '{}'::jsonb);

  return query select true, balance;
end;
$$;

create or replace function public.get_search_credit_status()
returns table(
  plan text,
  weekly_limit integer,
  remaining integer,
  result_limit integer,
  week_start date
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  current_week date := date_trunc('week', now())::date;
  p text := 'free';
  lim integer := 10;
  result_lim integer := 5;
  balance integer := 0;
begin
  if uid is null then
    raise exception 'not_authenticated';
  end if;

  select coalesce(s.plan, 'free') into p
    from public.subscriptions s
   where s.user_id = uid
   limit 1;

  lim := public.plan_weekly_limit(p);
  result_lim := public.plan_result_limit(p);

  insert into public.credit_balances(user_id, balance, week_start)
  values (uid, lim, current_week)
  on conflict (user_id) do nothing;

  update public.credit_balances
     set balance = lim,
         week_start = current_week,
         updated_at = now()
   where user_id = uid
     and week_start <> current_week;

  select cb.balance into balance
    from public.credit_balances cb
   where cb.user_id = uid;

  return query select p, lim, greatest(coalesce(balance, 0), 0), result_lim, current_week;
end;
$$;

revoke all on function public.plan_weekly_limit(text) from public;
revoke all on function public.plan_result_limit(text) from public;
revoke all on function public.consume_search_credit() from public;
revoke all on function public.refund_search_credit() from public;
revoke all on function public.get_search_credit_status() from public;

grant execute on function public.consume_search_credit() to authenticated;
grant execute on function public.refund_search_credit() to authenticated;
grant execute on function public.get_search_credit_status() to authenticated;

-- Keep legacy quota RPC aligned with the same plan limits.
create or replace function public.get_weekly_search_quota()
returns table(plan text, weekly_limit integer, used integer, remaining integer, week_start date)
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  current_week date := date_trunc('week', now())::date;
  p text := 'free';
  lim integer := 10;
  u integer := 0;
begin
  if uid is null then raise exception 'not_authenticated'; end if;
  select coalesce(s.plan, 'free') into p from public.subscriptions s where s.user_id = uid limit 1;
  lim := public.plan_weekly_limit(p);
  select greatest(lim - cb.balance, 0) into u
    from public.credit_balances cb
   where cb.user_id = uid and cb.week_start = current_week;
  u := coalesce(u, 0);
  return query select p, lim, u, greatest(lim-u,0), current_week;
end;
$$;

revoke all on function public.get_weekly_search_quota() from public;
grant execute on function public.get_weekly_search_quota() to authenticated;
