"use client";
import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ModalProvider } from "./context/QuickViewModalContext";
import { CartModalProvider } from "./context/CartSidebarModalContext";
import { ReduxProvider } from "@/redux/provider";
import QuickViewModal from "@/components/Common/QuickViewModal";
import CartSidebarModal from "@/components/Common/CartSidebarModal";
import { PreviewSliderProvider } from "./context/PreviewSliderContext";
import PreviewSliderModal from "@/components/Common/PreviewSlider";
import { SearchModalProvider } from "./context/SearchModalContext";
import SearchModal from "@/components/Header/SearchModal";
import ScrollToTop from "@/components/Common/ScrollToTop";
import WhatsAppFloatingButton from "@/components/Common/WhatsAppFloatingButton";
import PreLoader from "@/components/Common/PreLoader";
import { Toaster } from "react-hot-toast";
import VisitorTracker from "@/components/Common/VisitorTracker";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  if (loading) {
    return <PreLoader />;
  }

  return (
    <>
      <Toaster
        position="bottom-center"
        containerStyle={{
          bottom: 20,
        }}
      />
      <VisitorTracker />
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
      <WhatsAppFloatingButton />
      <Footer />
    </>
  );
}
