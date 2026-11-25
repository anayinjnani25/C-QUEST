-- rls_auto_enable runs as an event trigger; API roles never need to call it directly.
revoke execute on function public.rls_auto_enable() from anon, authenticated, public;
