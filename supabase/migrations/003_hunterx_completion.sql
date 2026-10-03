create table if not exists public.saved_filters(id uuid primary key default gen_random_uuid(),user_id uuid not null references auth.users(id) on delete cascade,name text not null,query text not null,location text,filters jsonb not null default '{}',created_at timestamptz not null default now(),updated_at timestamptz not null default now());
alter table public.saved_filters enable row level security;
drop policy if exists "own saved filters" on public.saved_filters;
create policy "own saved filters" on public.saved_filters for all using(user_id=auth.uid()) with check(user_id=auth.uid());
create or replace function public.refund_weekly_search()
returns table(refunded boolean,used integer,remaining integer)
language plpgsql security definer set search_path=public as $$
declare uid uuid:=auth.uid(); d date:=date_trunc('week',now())::date; u integer:=0; p text:='free'; lim integer:=10;
begin
 if uid is null then raise exception 'not_authenticated'; end if;
 select coalesce(s.plan,'free') into p from public.subscriptions s where s.user_id=uid limit 1;
 lim:=case lower(p) when 'max' then 150 when 'pro' then 50 else 10 end;
 update public.weekly_search_usage set used=greatest(used-1,0),updated_at=now() where user_id=uid and week_start=d returning weekly_search_usage.used into u;
 if u is null then u:=0; return query select false,u,greatest(lim-u,0); end if;
 return query select true,u,greatest(lim-u,0);
end $$;
revoke all on function public.refund_weekly_search() from public;
grant execute on function public.refund_weekly_search() to authenticated;
update public.subscriptions set limits='{"weekly_web_searches":10}'::jsonb where lower(plan)='free';
update public.subscriptions set limits='{"weekly_web_searches":50}'::jsonb where lower(plan)='pro';
update public.subscriptions set limits='{"weekly_web_searches":150}'::jsonb where lower(plan)='max';