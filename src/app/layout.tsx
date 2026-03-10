import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "@/components/providers/app-providers";

export const metadata: Metadata = {
  title: {
    default: "Resto - Group restaurant picker",
    template: "%s | Resto",
  },
  description:
    "Phone-first restaurant voting for small groups that want a quick, fair answer.",
  metadataBase: new URL("https://resto.local"),
  openGraph: {
    title: "Resto",
    description:
      "Warm, fast group restaurant picking with clear voting and satisfying results.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <div id="app-shell" className="tap-highlight-none">
          <AppProviders>{children}</AppProviders>
        </div>
      </body>
    </html>
  );
}
