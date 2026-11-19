const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type,Authorization"
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status, headers: { ...cors, "Content-Type": "application/json" }
  });
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    const url = new URL(request.url);

    if (url.pathname === "/api/health") {
      return json({ ok: true, app: env.APP_NAME || "SKY AI FOREX PRO", mode: "starter" });
    }

    if (url.pathname === "/api/markets" && request.method === "GET") {
      return json({
        mode: "demo",
        message: "Replace this demo payload with a licensed market-data provider.",
        markets: [
          { symbol: "EURUSD", price: null, status: "awaiting-live-feed" },
          { symbol: "GBPUSD", price: null, status: "awaiting-live-feed" },
          { symbol: "GBPJPY", price: null, status: "awaiting-live-feed" },
          { symbol: "XAUUSD", price: null, status: "awaiting-live-feed" }
        ]
      });
    }

    if (url.pathname.startsWith("/api/admin/")) {
      const token = request.headers.get("Authorization") || "";
      if (!env.ADMIN_TOKEN || token !== `Bearer ${env.ADMIN_TOKEN}`) {
        return json({ error: "Unauthorized" }, 401);
      }
      if (url.pathname === "/api/admin/status") {
        return json({ authenticated: true, devices: [], note: "Device enrollment has not been configured." });
      }
    }

    return json({ error: "Not found" }, 404);
  }
};
