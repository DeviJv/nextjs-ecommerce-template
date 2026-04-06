import { Noto_Serif, Manrope } from "next/font/google";
import "./css/style.css";
import LayoutWrapper from "./LayoutWrapper";

const notoSerif = Noto_Serif({
  subsets: ["latin"],
  variable: "--font-noto-serif",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning={true}
      className={`${notoSerif.variable} ${manrope.variable}`}
    >
      <body className="font-sans">
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}
