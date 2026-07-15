import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata } from "next";
import {
  Space_Grotesk,
  Plus_Jakarta_Sans,
  IBM_Plex_Mono,
} from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import Script from "next/script";
import "./globals.css";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CartProvider } from "@/context/CartContext";
import { getCategories } from "@/lib/queries/categories/api";
import { Navbar } from "@/components/layout/Navbar";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Footer } from "@/components/layout/Footer";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const BASE_URL = "https://corezano.eu";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Corezano — PC-componenten voor gamers & creators",
    template: "%s | Corezano",
  },
  description:
    "Koop grafische kaarten, processors en RAM bij Corezano. Snelle levering via koerier, veilig betalen met iDEAL en Przelewy24. A-merken, fabrieksnew en met garantie.",
  keywords: [
    "grafische kaarten",
    "videokaarten",
    "processors",
    "RAM geheugen",
    "pc componenten",
    "nvidia geforce",
    "amd radeon",
    "intel core",
    "amd ryzen",
    "pc onderdelen kopen",
    "gaming pc onderdelen",
    "RTX 5080",
    "RTX 5070",
    "RX 9070 XT",
  ],
  authors: [{ name: "Corezano", url: BASE_URL }],
  creator: "Corezano",
  publisher: "Corezano",
  category: "e-commerce",
  openGraph: {
    type: "website",
    locale: "nl_NL",
    alternateLocale: "en_GB",
    url: BASE_URL,
    siteName: "Corezano",
    title: "Corezano — PC-componenten voor gamers & creators",
    description:
      "Grafische kaarten, processors en RAM van A-merken. Snelle levering, veilig betalen.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Corezano — PC-componenten",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Corezano — PC-componenten voor gamers & creators",
    description:
      "Grafische kaarten, processors en RAM van A-merken. Snelle levering, veilig betalen.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
    languages: {
      "nl-NL": BASE_URL,
      "en-GB": `${BASE_URL}/en`,
    },
  },
};

const themeInitScript = `
  (function() {
    try {
      var saved = localStorage.getItem('cv-theme');
      var theme = saved === 'light' || saved === 'dark' ? saved : 'light';
      document.documentElement.setAttribute('data-theme', theme);
    } catch (e) {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  })();
`;

// Schema.org JSON-LD
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Corezano",
  url: BASE_URL,
  logo: `${BASE_URL}/logo.png`,
  contactPoint: {
    "@type": "ContactPoint",
    email: "corezanoo@gmail.com",
    contactType: "customer service",
    availableLanguage: ["Dutch", "English"],
  },
  address: {
    "@type": "PostalAddress",
    streetAddress: "ul. Mała 39",
    addressLocality: "Katowice",
    addressCountry: "PL",
  },
  taxID: "6262437132",
  sameAs: [],
};

const webSiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Corezano",
  url: BASE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${BASE_URL}/products?search={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

const onlineStoreSchema = {
  "@context": "https://schema.org",
  "@type": "Store",
  name: "Corezano",
  url: BASE_URL,
  description:
    "Online winkel voor pc-componenten: grafische kaarten, processors en RAM-geheugen.",
  currenciesAccepted: "EUR",
  paymentAccepted: "Przelewy24",
  priceRange: "€€",
  hasMap: false,
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "en" | "nl")) {
    notFound();
  }

  const [messages, categories] = await Promise.all([
    getMessages(),
    getCategories({ locale }),
  ]);

  return (
    <html
      lang={locale}
      className={`${spaceGrotesk.variable} ${plusJakarta.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
        <Script
          id="schema-organization"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <Script
          id="schema-website"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
        />
        <Script
          id="schema-store"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(onlineStoreSchema),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <NextIntlClientProvider messages={messages}>
          <CartProvider>
            <AnnouncementBar />
            <Navbar categories={categories} />
            {children}
            <Footer categories={categories} />
            <CartDrawer />
          </CartProvider>
        </NextIntlClientProvider>
        <GoogleAnalytics gaId="G-GXYGHXF243" />
      </body>
    </html>
  );
}
