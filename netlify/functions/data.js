const { getStore } = require("@netlify/blobs");

const STORE_KEY = "app_data";
const DEFAULT_CUSTOMERS = [
  "Hotel Zentrum Berlin", "Bürogebäude Mitte GmbH",
  "Einkaufszentrum West", "Arztpraxis Dr. Meier",
  "Schule Am Sonnenstein", "Rathaus Hauptstraße"
];

exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  const store = getStore({ name: "zeiterfassung", consistency: "strong" });

  if (event.httpMethod === "GET") {
    const data = await store.get(STORE_KEY, { type: "json" });
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data || { entries: [], customers: DEFAULT_CUSTOMERS })
    };
  }

  if (event.httpMethod === "POST") {
    const data = JSON.parse(event.body);
    await store.setJSON(STORE_KEY, data);
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
  }

  return { statusCode: 405, body: "Method not allowed" };
};
