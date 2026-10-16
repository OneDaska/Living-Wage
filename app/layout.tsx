import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://ghanalivingwage.com"),
  title: "Ghana Living Wage Report 2025 | L’AINE HR",
  description:
    "The 2025 Ghana Living Wage Report compares the cost of a basic but decent independent life with entry-level salaries across Accra/Tema, Takoradi, Kumasi and Cape Coast.",
  openGraph: {
    title: "Ghana Living Wage Report 2025",
    description:
      "A city-by-city benchmark for the income an entry-level graduate needs to maintain a basic but decent independent life in Ghana.",
    type: "website",
    url: "/",
  },
};

export const viewport: Viewport = {
  themeColor: "#073b8c",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
