import { createDownloadToken } from "@/lib/download-token";
import { saveReportLead } from "@/lib/report-leads";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: unknown;
      email?: unknown;
      company?: unknown;
    };

    if (typeof body.company === "string" && body.company.trim()) {
      return Response.json({ error: "Unable to process this request." }, { status: 400 });
    }

    const fullName = typeof body.name === "string" ? body.name.trim() : "";
    const email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

    if (fullName.length < 2 || fullName.length > 120) {
      return Response.json(
        { error: "Please enter your full name." },
        { status: 400 },
      );
    }

    if (email.length > 254 || !emailPattern.test(email)) {
      return Response.json(
        { error: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    await saveReportLead({
      full_name: fullName,
      email,
      report_slug: "ghana-living-wage-report-2025",
    });

    const token = createDownloadToken(email);
    return Response.json({
      downloadUrl: `/api/report-download?token=${encodeURIComponent(token)}`,
    });
  } catch (reason) {
    console.error("Report access request failed", reason);
    return Response.json(
      { error: "The report service is temporarily unavailable. Please try again." },
      { status: 503 },
    );
  }
}
