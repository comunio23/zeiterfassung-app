import { getStore } from "@netlify/blobs";

const STORE_KEY = "app_data";
const DEFAULT_CUSTOMERS = [
  "Hotel Zentrum Berlin", "Bürogebäude Mitte GmbH",
  "Einkaufszentrum West", "Arztpraxis Dr. Meier",
  "Schule Am Sonnenstein", "Rathaus Hauptstraße"
];

export default async (req) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  const store = getStore("zeiterfassung");

  if (req.method === "GET") {
    const data = await store.get(STORE_KEY, { type: "json" });
    return Response.json(
      data || { entries: [], customers: DEFAULT_CUSTOMERS },
      { headers: corsHeaders }
    );
  }

  if (req.method === "POST") {
    const data = await req.json();
    await store.setJSON(STORE_KEY, data);
    return Response.json({ ok: true }, { headers: corsHeaders });
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config = { path: "/api/data" };
