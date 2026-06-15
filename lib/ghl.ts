const GHL_BASE = "https://services.leadconnectorhq.com";

export const LOCATION_ID = process.env.GHL_LOCATION_ID ?? "";

export async function ghlGet(path: string, params: Record<string, string> = {}) {
  const url = new URL(`${GHL_BASE}${path}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${process.env.GHL_API_KEY}`,
      Version: "2021-07-28",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`GHL ${res.status}: ${text}`);
  }
  return res.json();
}
