import { NextResponse } from "next/server";

export async function GET() {
  const key = process.env.GHL_API_KEY;
  const locationId = process.env.GHL_LOCATION_ID;

  if (!key || !locationId) {
    return NextResponse.json({
      ok: false,
      error: "Missing env vars",
      GHL_API_KEY: key ? "set" : "MISSING",
      GHL_LOCATION_ID: locationId ? "set" : "MISSING",
    });
  }

  try {
    const res = await fetch(
      `https://services.leadconnectorhq.com/opportunities/search?location_id=${locationId}&limit=1`,
      {
        headers: {
          Authorization: `Bearer ${key}`,
          Version: "2021-07-28",
        },
        cache: "no-store",
      }
    );

    const body = await res.text();

    return NextResponse.json({
      ok: res.ok,
      status: res.status,
      statusText: res.statusText,
      body: body.slice(0, 500),
      GHL_API_KEY: `${key.slice(0, 8)}…`,
      GHL_LOCATION_ID: locationId,
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message });
  }
}
