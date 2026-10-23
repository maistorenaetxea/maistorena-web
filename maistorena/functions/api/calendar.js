// Cloudflare Pages Function: /api/calendar
// Lee el iCal privado de Airbnb (guardado en la variable de entorno AIRBNB_ICAL,
// nunca en el HTML público) y devuelve las fechas ocupadas en JSON.
// Se cachea 30 min para no llamar a Airbnb en cada visita.

export async function onRequestGet({ env }) {
  const icalUrl = env.AIRBNB_ICAL;
  if (!icalUrl) {
    return json({ error: "Variable AIRBNB_ICAL no configurada en Cloudflare Pages" }, 500);
  }

  let text;
  try {
    const r = await fetch(icalUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; MaistorenaWeb/1.0)" },
      cf: { cacheTtl: 1800, cacheEverything: true },
    });
    if (!r.ok) return json({ error: "Airbnb respondió " + r.status }, 502);
    text = await r.text();
  } catch (e) {
    return json({ error: "No se pudo leer el calendario de Airbnb" }, 502);
  }

  // Airbnb exporta eventos de día completo: DTSTART;VALUE=DATE:20261101
  // DTEND es la fecha de salida (exclusiva): la noche ocupada va de start a end-1.
  const busy = [];
  const re = /BEGIN:VEVENT([\s\S]*?)END:VEVENT/g;
  let m;
  while ((m = re.exec(text))) {
    const block = m[1];
    const s = block.match(/DTSTART[^:]*:(\d{8})/);
    const e = block.match(/DTEND[^:]*:(\d{8})/);
    if (s && e) busy.push({ start: iso(s[1]), end: iso(e[1]) });
  }

  return json(
    { updated: new Date().toISOString(), busy },
    200,
    { "Cache-Control": "public, max-age=1800" }
  );
}

function iso(d) {
  return d.slice(0, 4) + "-" + d.slice(4, 6) + "-" + d.slice(6, 8);
}

function json(body, status = 200, extra = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...extra },
  });
}
