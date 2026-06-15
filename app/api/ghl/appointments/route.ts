import { NextResponse } from "next/server";
import { ghlGet, LOCATION_ID } from "@/lib/ghl";

function mapStatus(status: string): string {
  if (status === "confirmed" || status === "new") return "Upcoming";
  if (status === "showed" || status === "completed") return "Completed";
  if (status === "inProgress" || status === "in_progress") return "In Progress";
  if (status === "cancelled" || status === "noshow" || status === "invalid") return "Cancelled";
  return "Upcoming";
}

export async function GET() {
  try {
    const now = Date.now();
    const sixMonthsAgo = now - 180 * 24 * 60 * 60 * 1000;
    const oneYearAhead = now + 365 * 24 * 60 * 60 * 1000;

    const data = await ghlGet("/calendars/events", {
      locationId: LOCATION_ID,
      startTime: String(sixMonthsAgo),
      endTime: String(oneYearAhead),
    });

    const events = (data.events ?? []).map((ev: any) => ({
      id: ev.id,
      reference: `EV-${ev.id.slice(-5).toUpperCase()}`,
      client: ev.title ?? ev.contact?.name ?? "Unnamed Event",
      venue: ev.address ?? ev.location ?? "",
      date: (ev.startTime ?? "").split("T")[0],
      headcount: 0,
      dietary: "",
      package: "Catering Event",
      status: mapStatus(ev.appointmentStatus ?? ev.status ?? "confirmed"),
      assignedStaff: ev.assignedUserId ? ["Assigned"] : [],
      specialRequests: ev.notes ?? "",
      branch: "",
      source: "ghl",
    }));

    return NextResponse.json(events);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
