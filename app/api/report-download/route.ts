import { verifyDownloadToken } from "@/lib/download-token";
import { readDecryptedReport } from "@/lib/report-file";

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token");

  if (!token || !verifyDownloadToken(token)) {
    return Response.json(
      { error: "This download link is invalid or has expired." },
      { status: 401 },
    );
  }

  try {
    const report = await readDecryptedReport();
    return new Response(new Uint8Array(report), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition":
          'attachment; filename="ghana-living-wage-report-2025.pdf"',
        "Cache-Control": "private, no-store, max-age=0",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (reason) {
    console.error("Secure report download failed", reason);
    return Response.json(
      { error: "The report is temporarily unavailable." },
      { status: 503 },
    );
  }
}
