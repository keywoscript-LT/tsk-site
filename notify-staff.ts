// Supabase Edge Function: notify-staff
// Срабатывает от Database Webhook при INSERT в public.applications и шлёт push админам/овнеру.
import { createClient } from "npm:@supabase/supabase-js@2";
import webpush from "npm:web-push@3.6.7";

const sb = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

webpush.setVapidDetails(
  Deno.env.get("VAPID_SUBJECT")!,
  Deno.env.get("VAPID_PUBLIC_KEY")!,
  Deno.env.get("VAPID_PRIVATE_KEY")!,
);

const cut = (v: unknown, n: number) => String(v ?? "").replace(/[<>]/g, "").slice(0, n);

Deno.serve(async (req) => {
  if (req.headers.get("x-webhook-secret") !== Deno.env.get("WEBHOOK_SECRET")) {
    return new Response("forbidden", { status: 403 });
  }
  let body: any;
  try { body = await req.json(); } catch { return new Response("bad json", { status: 400 }); }

  const rec = body?.record;
  if (body?.type !== "INSERT" || !rec || rec.status !== "pending") {
    return new Response("skip");
  }

  const d = rec.data || {};
  let what = "заявка";
  if (d.type === "player") what = `игрок «${cut(d.nick, 24)}»`;
  else if (d.type === "edit") what = "изменение профиля/команды";
  else what = `команда «${cut(d.name, 30)}»` + (Array.isArray(d.players) ? ` · ${d.players.length} игр.` : "");

  const { data: subs, error } = await sb.rpc("staff_push_subs");
  if (error) return new Response("rpc error: " + error.message, { status: 500 });

  const payload = JSON.stringify({
    title: "TSK · Новая заявка",
    body: what,
    tag: "tsk-app-" + rec.id,
    url: "/",
  });

  let sent = 0;
  await Promise.all((subs || []).map(async (s: any) => {
    try {
      await webpush.sendNotification(s.sub, payload, { TTL: 86400, urgency: "high" });
      sent++;
    } catch (e: any) {
      if (e?.statusCode === 404 || e?.statusCode === 410) {
        await sb.from("push_subscriptions").delete().eq("endpoint", s.endpoint);
      }
    }
  }));

  return new Response(JSON.stringify({ sent, total: subs?.length ?? 0 }), {
    headers: { "Content-Type": "application/json" },
  });
});
