import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";

const inter = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "eden lane - frontend engineer",
};

export default function RootLayout({
 children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <head>
      <script async
              src="https://maps.googleapis.com/maps/api/js?key=AIzaSyA78AvCbK1MdHM41-Fpvpilgw3IIUqd1Wo&callback=console.debug&libraries=maps,marker&v=beta">
      </script>
    </head>
    <body className={inter.className}>{children}</body>
    </html>
  );
}
