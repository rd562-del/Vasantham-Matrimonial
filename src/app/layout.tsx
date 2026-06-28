import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vasantham Matrimonial — Find Your Perfect Life Partner",
  description:
    "Vasantham Matrimonial is a premium, secure and trusted matrimonial platform with verified profiles, video calling and elegant matchmaking.",
  keywords: [
    "matrimonial",
    "matrimony",
    "marriage",
    "vasantham",
    "tamil matrimony",
    "find life partner",
  ],
  icons: {
    icon: [
      {
        url:
          "data:image/svg+xml," +
          encodeURIComponent(
            `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><linearGradient id='g' x1='0' y1='0' x2='100' y2='100'><stop offset='0%' stop-color='#ff5a4d'/><stop offset='100%' stop-color='#b00d10'/></linearGradient></defs><path d='M50 6C26 6 6 26 6 50c0 24 20 44 44 44 12 0 21-4 28-11 7-7 16-16 16-29C94 26 74 6 50 6z' fill='url(#g)' transform='rotate(8 50 50)'/><g stroke='#fff' stroke-width='6' fill='none' stroke-linecap='round'><path d='M38 34c-10 0-14 9-9 16 4 6 14 5 16-2'/><path d='M62 66c10 0 14-9 9-16-4-6-14-5-16 2'/></g></svg>`
          ),
        type: "image/svg+xml",
      },
    ],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=Playfair+Display:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-rose-50/40 text-slate-800 antialiased">
        {children}
      </body>
    </html>
  );
}
