"use client";
import { useState, useEffect } from "react";
import { Noto_Serif, Manrope } from "next/font/google";
import "../css/style.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

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

import { ModalProvider } from "../context/QuickViewModalContext";
import { CartModalProvider } from "../context/CartSidebarModalContext";
import { ReduxProvider } from "@/redux/provider";
import QuickViewModal from "@/components/Common/QuickViewModal";
import CartSidebarModal from "@/components/Common/CartSidebarModal";
import { PreviewSliderProvider } from "../context/PreviewSliderContext";
import PreviewSliderModal from "@/components/Common/PreviewSlider";
import { SearchModalProvider } from "../context/SearchModalContext";
import SearchModal from "@/components/Header/SearchModal";

import ScrollToTop from "@/components/Common/ScrollToTop";
import PreLoader from "@/components/Common/PreLoader";
import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <html
      lang="en"
      suppressHydrationWarning={true}
      className={`${notoSerif.variable} ${manrope.variable}`}
    >
      <body className="font-sans">

        <Toaster
          position="bottom-center"
          containerStyle={{
            bottom: 20,
          }}
        />
        {loading ? (
          <PreLoader />
        ) : (
          <>
            <ReduxProvider>
              <CartModalProvider>
                <ModalProvider>
                  <SearchModalProvider>
                    <PreviewSliderProvider>
                      <Header />
                      {children}

                      <QuickViewModal />
                      <CartSidebarModal />
                      <PreviewSliderModal />
                      <SearchModal />
                    </PreviewSliderProvider>
                  </SearchModalProvider>
                </ModalProvider>
              </CartModalProvider>
            </ReduxProvider>
            <ScrollToTop />
            <Footer />
          </>
        )}
      </body>
    </html>
  );
}
