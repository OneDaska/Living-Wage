import "server-only";

type ReportLead = {
  email: string;
  full_name: string;
  report_slug: string;
};

export async function saveReportLead(lead: ReportLead) {
  const projectUrl = process.env.SUPABASE_URL;
  const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!projectUrl || !publishableKey) {
    throw new Error("Lead storage is not configured.");
  }

  const response = await fetch(`${projectUrl}/rest/v1/report_downloads`, {
    method: "POST",
    headers: {
      apikey: publishableKey,
      Authorization: `Bearer ${publishableKey}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(lead),
    cache: "no-store",
  });

  if (!response.ok) {
    const details = await response.text();
    console.error("Report lead insert failed", response.status, details.slice(0, 500));
    throw new Error("Lead storage is temporarily unavailable.");
  }
}
