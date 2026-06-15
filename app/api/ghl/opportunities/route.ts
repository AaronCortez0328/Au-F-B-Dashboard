import { NextResponse } from "next/server";
import { ghlGet, LOCATION_ID } from "@/lib/ghl";

function mapStatus(ghlStatus: string, stageName: string): string {
  const s = stageName.toLowerCase();
  if (s.includes("won") || s.includes("deliver") || s.includes("complet")) return "Delivered";
  if (s.includes("lost") || s.includes("cancel")) return "Cancelled";
  if (s.includes("out for") || s.includes("dispatch")) return "Out for Delivery";
  if (s.includes("prepar") || s.includes("cook") || s.includes("progress") || s.includes("making")) return "Preparing";
  if (s.includes("confirm") || s.includes("accept") || s.includes("approv") || s.includes("paid")) return "Confirmed";
  if (ghlStatus === "won") return "Delivered";
  if (ghlStatus === "lost" || ghlStatus === "abandoned") return "Cancelled";
  return "Pending";
}

export async function GET() {
  try {
    const [pipelinesData, oppsData] = await Promise.all([
      ghlGet("/opportunities/pipelines", { locationId: LOCATION_ID }),
      ghlGet("/opportunities/search", { location_id: LOCATION_ID, limit: "100" }),
    ]);

    // Build stage id → name map
    const stageMap: Record<string, string> = {};
    for (const pipeline of pipelinesData.pipelines ?? []) {
      for (const stage of pipeline.stages ?? []) {
        stageMap[stage.id] = stage.name;
      }
    }

    const opportunities = (oppsData.opportunities ?? []).map((o: any) => ({
      id: o.id,
      reference: `GHL-${o.id.slice(-5).toUpperCase()}`,
      customer: o.contact?.name ?? o.name ?? "Unknown",
      venue: o.contact?.companyName ?? "",
      branch: "",
      date: (o.createdAt ?? o.lastActionDate ?? new Date().toISOString()).split("T")[0],
      items: [],
      total: Number(o.monetaryValue ?? 0),
      status: mapStatus(o.status ?? "", stageMap[o.pipelineStageId] ?? ""),
      stageName: stageMap[o.pipelineStageId] ?? o.status ?? "Unknown",
      type: "Catering",
      notes: "",
      contactEmail: o.contact?.email ?? "",
      contactPhone: o.contact?.phone ?? "",
      starred: false,
      source: "ghl",
    }));

    return NextResponse.json(opportunities);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
