import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "Thiraphat (Dan) Ruksujarit — Quantitative Researcher",
    template: "%s · Dan Ruksujarit",
  },
  description:
    "Quantitative researcher at Bayes Business School. Systematic strategies, stochastic modelling, and machine learning for markets.",
  metadataBase: new URL("https://danruksujarit.com"),
  openGraph: {
    title: "Thiraphat (Dan) Ruksujarit — Quantitative Researcher",
    description:
      "Systematic strategies, stochastic modelling, and machine learning for markets.",
    url: "https://danruksujarit.com",
    siteName: "Dan Ruksujarit",
    type: "website",
    images: [{ url: "/hero.jpg", width: 400, height: 400, alt: "Dan Ruksujarit" }],
  },
  twitter: {
    card: "summary",
    title: "Dan Ruksujarit — Quantitative Researcher",
    description: "Systematic strategies, stochastic modelling, and ML for markets.",
    images: ["/hero.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Nav />
        <main className="flex-1 mx-auto w-full max-w-3xl px-6 py-10">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
