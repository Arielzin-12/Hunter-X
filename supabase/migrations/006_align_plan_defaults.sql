-- Align existing and future subscription metadata with the current plan model.
update public.subscriptions
set limits = case lower(plan)
  when 'max' then '{"weekly_searches":150,"result_limit":50}'::jsonb
  when 'pro' then '{"weekly_searches":50,"result_limit":20}'::jsonb
  else '{"weekly_searches":10,"result_limit":5}'::jsonb
end;

update public.credit_balances cb
set balance = case lower(coalesce(s.plan,'free'))
  when 'max' then 150
  when 'pro' then 50
  else 10
end,
week_start = date_trunc('week', now())::date,
updated_at = now()
from public.subscriptions s
where s.user_id = cb.user_id;

create or replace function public.handle_new_user() returns trigger
language plpgsql
security definer
set search_path = ''
as $fn$
begin
  insert into public.profiles(id,name)
  values(new.id,coalesce(new.raw_user_meta_data->>'name',split_part(new.email,'@',1)));

  insert into public.credit_balances(user_id,balance,week_start)
  values(new.id,10,date_trunc('week',now())::date);

  insert into public.subscriptions(user_id,plan,status,limits)
  values(new.id,'free','active','{"weekly_searches":10,"result_limit":5}');

  return new;
end;
$fn$;
