-- Eenmalig uitvoeren in de SQL Editor van je eigen Supabase-project.
-- De koppelcode geeft toegang tot één verzameling. Bewaar die als een wachtwoord.
begin;
create schema if not exists pokedex_private;
revoke all on schema pokedex_private from public, anon, authenticated;
create table if not exists pokedex_private.collections (
  secret_hash text primary key,
  revision integer not null default 1,
  payload jsonb not null,
  updated_at timestamptz not null default now()
);
alter table pokedex_private.collections enable row level security;
revoke all on pokedex_private.collections from public, anon, authenticated;
create or replace function public.pokedex_sync(
  p_secret text, p_action text, p_revision integer default null, p_payload jsonb default null
) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  h text;
  item pokedex_private.collections%rowtype;
begin
  if p_secret is null or p_secret !~ '^[a-f0-9]{64}$' then
    raise exception 'Ongeldige koppelcode';
  end if;
  h := pg_catalog.encode(pg_catalog.sha256(pg_catalog.convert_to(p_secret, 'UTF8')), 'hex');
  if p_action in ('create','write') then
    if p_payload is null or pg_catalog.jsonb_typeof(p_payload) <> 'object'
      or pg_catalog.jsonb_typeof(p_payload->'quantities') is distinct from 'object'
      or pg_catalog.jsonb_typeof(p_payload->'backgrounds') is distinct from 'array'
      or pg_catalog.octet_length(p_payload::text) > 500000 then
      raise exception 'Ongeldige verzameling';
    end if;
  end if;
  if p_action = 'create' then
    insert into pokedex_private.collections(secret_hash,payload) values(h,p_payload)
      on conflict do nothing returning * into item;
    if found then
      return pg_catalog.jsonb_build_object('ok',true,'revision',item.revision,'payload',item.payload);
    end if;
    raise exception 'Koppelcode bestaat al';
  elsif p_action = 'write' then
    update pokedex_private.collections set payload=p_payload, revision=revision+1, updated_at=now()
      where secret_hash=h and revision=p_revision returning * into item;
    if found then
      return pg_catalog.jsonb_build_object('ok',true,'revision',item.revision,'payload',item.payload);
    end if;
  elsif p_action <> 'read' then
    raise exception 'Onbekende actie';
  end if;
  select * into item from pokedex_private.collections where secret_hash=h;
  if not found then raise exception 'Verzameling niet gevonden. Controleer de koppelcode.'; end if;
  return pg_catalog.jsonb_build_object('ok',p_action='read','revision',item.revision,'payload',item.payload);
end;
$$;
revoke all on function public.pokedex_sync(text,text,integer,jsonb) from public;
grant execute on function public.pokedex_sync(text,text,integer,jsonb) to anon, authenticated;
commit;
