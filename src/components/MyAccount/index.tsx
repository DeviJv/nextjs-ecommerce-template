"use client";

import React, { useEffect, useState } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import AddressModal from "./AddressModal";
import Orders from "../Orders";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const navItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    helper: "Overview & shortcuts",
    icon: "M5.9 1.6h.1C6.8 1.6 7.5 1.6 8 1.7c.6.1 1.1.3 1.5.7.4.4.6.9.7 1.5.1.5.1 1.2.1 2v.1c0 .8 0 1.5-.1 2-.1.6-.3 1.1-.7 1.5-.4.4-.9.6-1.5.7-.5.1-1.2.1-2 .1H6c-.8 0-1.5 0-2-.1-.6-.1-1.1-.3-1.5-.7-.4-.4-.6-.9-.7-1.5-.1-.5-.1-1.2-.1-2V6c0-.8 0-1.5.1-2 .1-.6.3-1.1.7-1.5.4-.4.9-.6 1.5-.7.5-.1 1.2-.1 2-.1h-.1Zm10.1 10.1h.1c.8 0 1.5 0 2 .1.6.1 1.1.3 1.5.7.4.4.6.9.7 1.5.1.5.1 1.2.1 2v.1c0 .8 0 1.5-.1 2-.1.6-.3 1.1-.7 1.5-.4.4-.9.6-1.5.7-.5.1-1.2.1-2 .1h-.1c-.8 0-1.5 0-2-.1-.6-.1-1.1-.3-1.5-.7-.4-.4-.6-.9-.7-1.5-.1-.5-.1-1.2-.1-2v-.1c0-.8 0-1.5.1-2 .1-.6.3-1.1.7-1.5.4-.4.9-.6 1.5-.7.5-.1 1.2-.1 2-.1h-.1ZM10.3 16V16.1c0 .8 0 1.5-.1 2-.1.6-.3 1.1-.7 1.5-.4.4-.9.6-1.5.7-.5.1-1.2.1-2 .1H5.9c-.8 0-1.5 0-2-.1-.6-.1-1.1-.3-1.5-.7-.4-.4-.6-.9-.7-1.5-.1-.5-.1-1.2-.1-2v-.1c0-.8 0-1.5.1-2 .1-.6.3-1.1.7-1.5.4-.4.9-.6 1.5-.7.5-.1 1.2-.1 2-.1h.1c.8 0 1.5 0 2 .1.6.1 1.1.3 1.5.7.4.4.6.9.7 1.5.1.5.1 1.2.1 2Zm5.7-14.4h.1c.8 0 1.5 0 2 .1.6.1 1.1.3 1.5.7.4.4.6.9.7 1.5.1.5.1 1.2.1 2v.1c0 .8 0 1.5-.1 2-.1.6-.3 1.1-.7 1.5-.4.4-.9.6-1.5.7-.5.1-1.2.1-2 .1h-.1c-.8 0-1.5 0-2-.1-.6-.1-1.1-.3-1.5-.7-.4-.4-.6-.9-.7-1.5-.1-.5-.1-1.2-.1-2V5.9c0-.8 0-1.5.1-2 .1-.6.3-1.1.7-1.5.4-.4.9-.6 1.5-.7.5-.1 1.2-.1 2-.1h-.1Z",
  },
  {
    id: "orders",
    label: "Orders",
    helper: "Track every purchase",
    icon: "M15.8 3.2c-.4-.2-.9-.2-1.5-.2-.3-.5-.8-.9-1.5-.9h-3.6c-.7 0-1.2.4-1.5.9-.6 0-1.1 0-1.5.2-.5.2-1 .5-1.3 1-.3.4-.5 1-.7 1.8l-.6 2.1c-.3.2-.6.4-.9.7-.6.7-.7 1.6-.6 2.6.1 1 .4 2.2.8 3.7l.1.1c.2 1 .4 1.8.6 2.4.2.6.5 1.1 1 1.5.5.4 1.1.6 1.8.7.6.1 1.4.1 2.4.1h4.3c1 0 1.8 0 2.4-.1.7-.1 1.3-.3 1.8-.7.5-.4.8-.9 1-1.5.2-.6.4-1.4.6-2.4l.1-.1c.4-1.5.7-2.7.8-3.7.1-1 0-1.9-.6-2.6-.2-.3-.5-.5-.8-.7L17.8 6c-.2-.8-.4-1.4-.7-1.8-.3-.5-.8-.8-1.3-1ZM9.2 3.4h3.6c.1 0 .2.1.2.3s-.1.3-.2.3H9.2c-.1 0-.2-.1-.2-.3s.1-.3.2-.3Z",
  },
  {
    id: "addresses",
    label: "Addresses",
    helper: "Shipping information",
    icon: "M11 1.1c-.7 0-1.3.2-1.9.5-.6.3-1.3.8-2.2 1.3L5 4.1c-.8.5-1.5.9-2 1.4-.5.4-1 .8-1.3 1.3-.3.6-.4 1.2-.5 1.9-.1.6-.1 1.4-.1 2.4v1.5c0 1.7 0 3.1.1 4.2.1 1.1.4 2 .1.1 2.7.7 3.4 1.1 3.7 1.3.1 1.1.2 2.4.2 4.1H12.9c1.7 0 3 0 4.1-.2 1.1-.1 2-.4 2.7-1.1.7-.7 1-1.6 1.1-2.7.1-1.1.1-2.5.1-4.2V11.2c0-1 0-1.8-.1-2.5 0-.7-.2-1.3-.5-1.9-.3-.5-.7-.9-1.3-1.3-.5-.4-1.2-.8-2-1.3l-1.9-1.2c-.9-.5-1.6-1-2.2-1.3-.6-.3-1.2-.5-1.8-.5Z",
  },
  {
    id: "account-details",
    label: "Account Details",
    helper: "Personal & security settings",
    icon: "M11 1.1c-2.4 0-4.3 2-4.3 4.4S8.6 9.8 11 9.8s4.3-2 4.3-4.3S13.4 1.1 11 1.1ZM11 11.2c-2.1 0-4.1.5-5.5 1.3-1.4.8-2.5 2-2.5 3.5l0 .1c0 1.1 0 2.4 1.1 3.4.6.5 1.4.8 2.5 1 1.1.2 2.5.3 4.4.3s3.3-.1 4.4-.3c1.1-.2 1.9-.5 2.5-1 1.1-1 1.1-2.3 1.1-3.4l0-.1c0-1.5-1.1-2.7-2.5-3.5-1.4-.8-3.4-1.3-5.5-1.3Z",
  },
];

const MyAccount = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [addressModal, setAddressModal] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        router.push("/signin");
        return;
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (res.ok) {
          const data = await res.json();
          setProfile(data);
          localStorage.setItem("user", JSON.stringify(data));
        } else if (res.status === 401) {
          localStorage.removeItem("auth_token");
          localStorage.removeItem("user");
          router.push("/signin");
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleLogout = async () => {
    const token = localStorage.getItem("auth_token");

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
      window.dispatchEvent(new Event("auth-change"));
      toast.success("Logged out successfully");
      router.push("/");
    }
  };

  const openAddressModal = () => setAddressModal(true);
  const closeAddressModal = () => setAddressModal(false);

  const preventFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const getInitials = (name: string) => {
    if (!name) return "U";

    return name
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const fullName = profile?.name?.trim() || "Guest Shopper";
  const nameParts = fullName.split(/\s+/).filter(Boolean);
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ");
  const orders = profile?.customer?.orders || [];
  const orderCount = orders.length;
  const memberSince = profile?.created_at
    ? new Intl.DateTimeFormat("en-US", {
        month: "short",
        year: "numeric",
      }).format(new Date(profile.created_at))
    : "Recently joined";
  const phone = profile?.customer?.phone || "Not set yet";
  const addressParts = [
    profile?.customer?.house_number,
    profile?.customer?.address,
    profile?.customer?.ward,
    profile?.customer?.district,
    profile?.customer?.city,
    profile?.customer?.state,
    profile?.customer?.post_code,
    profile?.customer?.country,
  ].filter(Boolean);
  const fullAddress = addressParts.length
    ? addressParts.join(", ")
    : "No shipping address saved yet.";
  const location =
    [profile?.customer?.city, profile?.customer?.country]
      .filter(Boolean)
      .join(", ") || "Location pending";
  const completionSignals = [
    profile?.name,
    profile?.email,
    profile?.customer?.phone,
    profile?.customer?.address,
    profile?.customer?.city,
    profile?.customer?.country,
  ];
  const completion = Math.round(
    (completionSignals.filter(Boolean).length / completionSignals.length) * 100,
  );
  const addressReady = addressParts.length > 0;
  const activeSection = navItems.find((item) => item.id === activeTab);

  if (loading) {
    return (
      <>
        <Breadcrumb title={"My Account"} pages={["my account"]} />

        <section className="overflow-hidden bg-gray-2 py-8 lg:py-14">
          <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
            <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)] animate-pulse">
              <div className="h-[390px] rounded-[28px] bg-white-true shadow-ambient"></div>
              <div className="space-y-6">
                <div className="h-[320px] rounded-[32px] bg-white-true shadow-ambient"></div>
                <div className="grid gap-6 md:grid-cols-3">
                  {[0, 1, 2].map((item) => (
                    <div
                      key={item}
                      className="h-[180px] rounded-[28px] bg-white-true shadow-ambient"
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <Breadcrumb title={"My Account"} pages={["my account"]} />

      <section className="relative overflow-hidden bg-gray-2 py-8 lg:py-14">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-12 top-6 h-48 w-48 rounded-full bg-primary/10 blur-3xl"></div>
          <div className="absolute right-0 top-16 h-64 w-64 rounded-full bg-secondary/10 blur-3xl"></div>
        </div>

        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="relative grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
            <aside className="min-w-0 space-y-4 xl:sticky xl:top-25 xl:self-start">
              <div className="overflow-hidden rounded-[28px] border border-primary/10 bg-white-true shadow-ambient">
                <div className="relative overflow-hidden bg-gradient-to-br from-primary to-primary-container px-6 py-7 text-white">
                  <div className="absolute right-0 top-0 h-28 w-28 translate-x-7 -translate-y-7 rounded-full bg-white/10"></div>
                  <div className="absolute bottom-0 left-0 h-24 w-24 -translate-x-4 translate-y-9 rounded-full bg-secondary/20"></div>

                  <div className="relative space-y-6">
                    <div className="flex items-center justify-between gap-3">
                      <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-white">
                        Member since {memberSince}
                      </span>
                      <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white">
                        {completion}% ready
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex h-18 w-18 items-center justify-center rounded-[24px] bg-white/10 text-2xl font-bold text-white-true ring-1 ring-white/10 backdrop-blur-sm">
                        {getInitials(fullName)}
                      </div>

                      <div className="min-w-0">
                        <h2 className="truncate text-2xl font-semibold text-white-true">
                          {fullName}
                        </h2>
                        <p className="mt-1 truncate text-custom-sm text-white/75">
                          {profile?.email || "Add your email address"}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur-sm">
                        <p className="text-[11px] uppercase tracking-[0.22em] text-white/60">
                          Orders
                        </p>
                        <p className="mt-2 text-lg font-semibold text-white-true">
                          {orderCount}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur-sm">
                        <p className="text-[11px] uppercase tracking-[0.22em] text-white/60">
                          City
                        </p>
                        <p className="mt-2 truncate text-lg font-semibold text-white-true">
                          {profile?.customer?.city || "Unset"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-b border-gray-3 px-4 py-4">
                  <div className="grid grid-cols-2 gap-3">
                    <SidebarStat
                      label="Delivery"
                      value={addressReady ? "Ready" : "Pending"}
                    />
                    <SidebarStat label="Security" value="Verified" />
                  </div>
                </div>

                <div className="hidden p-3 xl:block">
                  <div className="space-y-1.5">
                    {navItems.map((item) => {
                      const isActive = activeTab === item.id;

                      return (
                        <button
                          type="button"
                          key={item.id}
                          onClick={() => setActiveTab(item.id)}
                          className={`group flex w-full items-center gap-3 rounded-2xl px-4 py-4 text-left transition-all duration-300 ${
                            isActive
                              ? "bg-primary text-white shadow-ambient"
                              : "text-dark hover:bg-gray-1"
                          }`}
                        >
                          <span
                            className={`flex h-11 w-11 items-center justify-center rounded-2xl transition-colors ${
                              isActive
                                ? "bg-white/10 text-white"
                                : "bg-gray-1 text-primary group-hover:bg-white-true"
                            }`}
                          >
                            <svg
                              className="h-5 w-5 fill-current"
                              viewBox="0 0 22 22"
                            >
                              <path d={item.icon} />
                            </svg>
                          </span>

                          <span className="min-w-0">
                            <span className="block text-sm font-semibold">
                              {item.label}
                            </span>
                            <span
                              className={`mt-0.5 block text-xs ${
                                isActive ? "text-white/70" : "text-dark-4"
                              }`}
                            >
                              {item.helper}
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="btn-action-danger mt-4 w-full"
                  >
                    <svg
                      className="h-5 w-5 fill-current"
                      viewBox="0 0 22 22"
                    >
                      <path d="M13.7 1.1c-1.2 0-2.2 0-3 .1-.8.1-1.5.4-2.1.9-.5.5-.7 1.1-.8 1.8-.1.7-.1 1.5-.1 2.5 0 .4.3.7.7.7s.7-.3.7-.7c.1-1 .1-1.7.2-2.2.1-.5.2-.8.4-1 .3-.3.6-.4 1.3-.5.7-.1 1.6-.1 2.9-.1h.9c1.3 0 2.2 0 2.9.1.7.1 1 .2 1.3.5.2.3.4.6.5 1.3.1.7.1 1.6.1 2.9v1.3c0 1.3 0 2.2-.1 2.9-.1.7-.2 1-.5 1.3-.3.3-.6.4-1.3.5-.7.1-1.6.1-2.9.1h-.9c-1.3 0-2.2 0-2.9-.1-.7-.1-1-.2-1.3-.5-.2-.3-.4-.6-.5-1.3-.1-.7-.1-1.4-.1-2.4 0-.4-.3-.7-.7-.7s-.7.3-.7.7c0 1 .1 1.8.2 2.5.1.7.3 1.3.8 1.8.5.5 1.2.7 2 .8.8.1 1.8.1 3.1.1h1c1.3 0 2.3 0 3.1-.1.8-.1 1.5-.4 2-.8.6-.5.8-1.2.9-2 .1-.8.1-1.8.1-3.1V7.3c0-1.3 0-2.3-.1-3.1-.1-.8-.4-1.5-.9-2-.6-.5-1.2-.8-2-.9-.8-.1-1.8-.1-3.1-.1h-1ZM13.8 10.3c.4 0 .7.3.7.7s-.3.7-.7.7H3.7l1.8 1.5c.3.2.3.7.1 1s-.7.3-1 .1l-3.2-2.7c-.1-.2-.2-.4-.2-.6s.1-.4.2-.6l3.2-2.7c.3-.2.8-.2 1 .1s.2.7-.1 1L3.7 10.3h10.1Z" />
                    </svg>
                    Logout
                  </button>
                </div>

                <div className="border-t border-gray-3 px-4 py-4 xl:hidden">
                  <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-dark-4">
                        Navigate
                      </p>
                      <p className="mt-1 text-custom-sm text-dark-4">
                        Jump between your profile sections.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="btn-action-danger w-full sm:w-auto"
                    >
                      Logout
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    {navItems.map((item) => {
                      const isActive = activeTab === item.id;

                      return (
                        <button
                          type="button"
                          key={item.id}
                          onClick={() => setActiveTab(item.id)}
                          className={`min-w-0 rounded-[22px] border px-3.5 py-3.5 text-left transition-all duration-300 ${
                            isActive
                              ? "border-primary bg-primary text-white shadow-ambient"
                              : "border-gray-3 bg-gray-1 text-dark hover:border-primary/15 hover:bg-white-true"
                          }`}
                          aria-current={isActive ? "page" : undefined}
                        >
                          <div className="flex h-full items-start gap-3">
                            <span
                              className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${
                                isActive
                                  ? "bg-white/10 text-white"
                                  : "bg-white-true text-primary"
                              }`}
                            >
                              <svg
                                className="h-5 w-5 fill-current"
                                viewBox="0 0 22 22"
                              >
                                <path d={item.icon} />
                              </svg>
                            </span>

                            <div className="min-w-0">
                              <p className="text-[13px] font-semibold leading-tight sm:text-sm">
                                {item.label}
                              </p>
                              <p
                                className={`mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${
                                  isActive ? "text-white/70" : "text-dark-4"
                                }`}
                              >
                                {isActive ? "Current section" : "Open section"}
                              </p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </aside>

            <div className="min-w-0">
              <div
                className={`space-y-6 animate-fadeIn ${
                  activeTab === "dashboard" ? "block" : "hidden"
                }`}
              >
                <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-primary to-primary-container px-5 py-6 text-white shadow-ambient sm:rounded-[32px] sm:px-8 sm:py-7 lg:px-10 lg:py-10">
                  <div className="absolute right-0 top-0 h-40 w-40 translate-x-10 -translate-y-10 rounded-full bg-white/10"></div>
                  <div className="absolute bottom-0 right-14 h-28 w-28 translate-y-10 rounded-full bg-secondary/10"></div>

                  <div className="relative grid gap-6 sm:gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.85fr)] lg:items-end">
                    <div>
                      <p className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-white">
                        Account hub
                      </p>

                      <h1 className="mt-4 max-w-[620px] text-[28px] font-semibold leading-tight text-white-true sm:text-[40px]">
                        Manage your account with a calmer, more modern flow.
                      </h1>

                      <p className="mt-4 max-w-[560px] text-sm leading-relaxed text-white/75 sm:text-base">
                        Review orders, keep shipping details current, and
                        update your profile from one responsive space that feels
                        polished on both desktop and mobile.
                      </p>

                      <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                        <button
                          type="button"
                          onClick={() => setActiveTab("orders")}
                          className="btn-action-inverse w-full sm:w-auto"
                        >
                          Review orders
                          <ArrowRightIcon />
                        </button>

                        <button
                          type="button"
                          onClick={() => setActiveTab("addresses")}
                          className="btn-action-light w-full sm:w-auto"
                        >
                          Manage address
                          <ArrowRightIcon />
                        </button>
                      </div>
                    </div>

                    <div className="rounded-[24px] border border-white/10 bg-white/10 p-5 backdrop-blur-sm sm:rounded-[28px] sm:p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/60">
                            Profile health
                          </p>
                          <p className="mt-2 text-[28px] font-semibold leading-none text-white-true sm:text-3xl">
                            {completion}% complete
                          </p>
                        </div>

                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-white-true">
                          <svg
                            className="h-7 w-7"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path d="m9 12 2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016Z" />
                          </svg>
                        </div>
                      </div>

                      <div className="mt-5 h-2 rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-yellow-light"
                          style={{ width: `${completion}%` }}
                        ></div>
                      </div>

                      <div className="mt-6 grid grid-cols-2 gap-2.5 sm:gap-3">
                        <SnapshotItem
                          label="Orders"
                          value={`${orderCount} total`}
                        />
                        <SnapshotItem
                          label="Delivery"
                          value={addressReady ? "Ready" : "Pending"}
                        />
                        <SnapshotItem label="Location" value={location} />
                        <SnapshotItem label="Phone" value={phone} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  <MetricCard
                    label="Recent orders"
                    value={`${orderCount} total`}
                    copy="Review receipts, delivery state, and available actions."
                    icon="M20 7 12 3 4 7m16 0-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    accentClass="bg-primary/10 text-primary"
                    onClick={() => setActiveTab("orders")}
                  />

                  <MetricCard
                    label="Shipping status"
                    value={addressReady ? "Ready to deliver" : "Needs update"}
                    copy="Keep address details accurate to avoid checkout friction."
                    icon="m11 4 7 7m-7-7 7 7M5 8v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-7-7-7 7Z"
                    accentClass="bg-secondary/10 text-secondary"
                    onClick={() => setActiveTab("addresses")}
                  />

                  <MetricCard
                    label="Account details"
                    value={`${completion}% complete`}
                    copy="Refine your profile info and stay on top of security."
                    icon="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-4.418 0-8 1.79-8 4v2h16v-2c0-2.21-3.582-4-8-4Z"
                    accentClass="bg-yellow-light-4 text-yellow-dark-2"
                    onClick={() => setActiveTab("account-details")}
                  />
                </div>

                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
                  <div className="rounded-[24px] border border-primary/10 bg-white-true p-5 shadow-ambient sm:rounded-[28px] sm:p-8">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-dark-4">
                          Profile at a glance
                        </p>
                        <h3 className="mt-2 text-xl font-semibold text-dark sm:text-2xl">
                          A cleaner summary of your account.
                        </h3>
                      </div>

                      <span className="rounded-full border border-gray-3 bg-gray-1 px-4 py-2 text-custom-sm font-medium text-dark-4">
                        {activeSection?.helper}
                      </span>
                    </div>

                    <div className="mt-7 grid gap-4 sm:grid-cols-2">
                      <SummaryRow label="Member since" value={memberSince} />
                      <SummaryRow
                        label="Primary email"
                        value={profile?.email || "No email stored"}
                      />
                      <SummaryRow label="Phone" value={phone} />
                      <SummaryRow label="Location" value={location} />
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-secondary/10 bg-gradient-to-br from-[#f8f3ea] to-white-true p-5 shadow-ambient sm:rounded-[28px] sm:p-8">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-dark-4">
                      Shipping focus
                    </p>
                    <h3 className="mt-2 text-xl font-semibold text-dark sm:text-2xl">
                      Keep delivery details current.
                    </h3>
                    <p className="mt-4 text-sm leading-relaxed text-dark-4 sm:text-base">
                      {fullAddress}
                    </p>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <span
                        className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] ${
                          addressReady
                            ? "bg-primary text-white"
                            : "bg-yellow-light-4 text-secondary"
                        }`}
                      >
                        {addressReady ? "Ready" : "Needs update"}
                      </span>

                      <button
                        type="button"
                        onClick={openAddressModal}
                        className="btn-action-secondary w-full sm:w-auto"
                      >
                        Edit shipping address
                        <ArrowRightIcon />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={`animate-fadeIn ${
                  activeTab === "orders" ? "block" : "hidden"
                }`}
              >
                <div className="overflow-hidden rounded-[28px] border border-primary/10 bg-white-true shadow-ambient">
                  <div className="flex flex-col gap-4 border-b border-gray-3 px-5 py-5 sm:flex-row sm:items-end sm:justify-between sm:px-8 sm:py-6">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-dark-4">
                        Order center
                      </p>
                      <h2 className="mt-2 text-xl font-semibold text-dark sm:text-2xl">
                        Track your orders in one place.
                      </h2>
                      <p className="mt-2 max-w-[560px] text-sm text-dark-4 sm:text-base">
                        Review purchase history, current status, and available
                        actions without leaving your account.
                      </p>
                    </div>

                    <div className="rounded-2xl bg-gray-1 px-4 py-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-dark-4">
                        Total
                      </p>
                      <p className="mt-1 text-xl font-semibold text-dark">
                        {orderCount} {orderCount === 1 ? "order" : "orders"}
                      </p>
                    </div>
                  </div>

                  <Orders orders={orders} />
                </div>
              </div>

              <div
                className={`grid gap-6 animate-fadeIn xl:grid-cols-[minmax(0,1fr)_300px] ${
                  activeTab === "addresses" ? "grid" : "hidden"
                }`}
              >
                <div className="overflow-hidden rounded-[28px] border border-primary/10 bg-white-true shadow-ambient">
                  <div className="flex flex-col gap-4 border-b border-gray-3 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-6">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-dark-4">
                        Shipping details
                      </p>
                      <h2 className="mt-2 text-xl font-semibold text-dark sm:text-2xl">
                        Your current delivery address.
                      </h2>
                      <p className="mt-2 max-w-[540px] text-sm text-dark-4 sm:text-base">
                        Keep your shipping information fresh so checkout and
                        delivery updates stay smooth.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={openAddressModal}
                      className="btn-action w-full sm:w-auto"
                    >
                      Edit address
                      <ArrowRightIcon />
                    </button>
                  </div>

                  <div className="grid gap-4 p-5 sm:grid-cols-2 sm:gap-5 sm:p-8">
                    <DetailItem label="Full Name" value={fullName} />
                    <DetailItem
                      label="Email Address"
                      value={profile?.email || "No email stored"}
                    />
                    <DetailItem label="Phone Number" value={phone} />
                    <DetailItem label="Location" value={location} />
                    <DetailItem label="Shipping Status" value={addressReady ? "Ready to deliver" : "Needs update"} />
                    <DetailItem label="Full Address" value={fullAddress} full />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="rounded-[24px] border border-primary/10 bg-white-true p-5 shadow-ambient sm:rounded-[28px] sm:p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-dark-4">
                      Delivery readiness
                    </p>
                    <h3 className="mt-2 text-xl font-semibold text-dark sm:text-2xl">
                      {addressReady
                        ? "Everything looks ready."
                        : "A few details still need attention."}
                    </h3>

                    <div className="mt-6 space-y-3">
                      <ChecklistItem
                        label="Contact phone"
                        ready={Boolean(profile?.customer?.phone)}
                      />
                      <ChecklistItem
                        label="Street address"
                        ready={Boolean(profile?.customer?.address)}
                      />
                      <ChecklistItem
                        label="City & country"
                        ready={Boolean(
                          profile?.customer?.city && profile?.customer?.country,
                        )}
                      />
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-secondary/10 bg-gradient-to-br from-[#f8f4ee] to-white-true p-5 shadow-ambient sm:rounded-[28px] sm:p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-dark-4">
                      Quick note
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-dark-4 sm:text-base">
                      Keep your house number, city, and phone accurate before
                      checkout so delivery confirmation stays smooth.
                    </p>
                  </div>
                </div>
              </div>

              <div
                className={`space-y-6 animate-fadeIn ${
                  activeTab === "account-details" ? "block" : "hidden"
                }`}
              >
                <div className="rounded-[24px] border border-primary/10 bg-white-true p-5 shadow-ambient sm:rounded-[28px] sm:p-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-dark-4">
                    Account details
                  </p>

                  <div className="mt-3 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-dark sm:text-2xl">
                        Refresh the essentials whenever you need to.
                      </h2>
                      <p className="mt-2 max-w-[640px] text-sm text-dark-4 sm:text-base">
                        Your personal details and password controls now live in
                        a clearer layout that reads well on every screen size.
                      </p>
                    </div>

                    <span className="rounded-full border border-gray-3 bg-gray-1 px-4 py-2 text-custom-sm font-medium text-dark-4">
                      Current status: {completion}% complete
                    </span>
                  </div>
                </div>

                <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)]">
                  <form
                    onSubmit={preventFormSubmit}
                    className="rounded-[24px] border border-primary/10 bg-white-true p-5 shadow-ambient sm:rounded-[28px] sm:p-8"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-dark-4">
                          Personal information
                        </p>
                        <h3 className="mt-2 text-xl font-semibold text-dark sm:text-2xl">
                          Profile details
                        </h3>
                        <p className="mt-2 text-sm text-dark-4 sm:text-base">
                          These details shape how your account appears around
                          the storefront.
                        </p>
                      </div>

                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <svg
                          className="h-6 w-6"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-4.418 0-8 1.79-8 4v2h16v-2c0-2.21-3.582-4-8-4Z" />
                        </svg>
                      </div>
                    </div>

                    <div className="mt-8 grid gap-5 sm:grid-cols-2">
                      <Input
                        label="First Name"
                        id="firstName"
                        value={firstName}
                      />
                      <Input
                        label="Last Name"
                        id="lastName"
                        value={lastName}
                      />
                      <Input
                        label="Email Address"
                        id="email"
                        type="email"
                        value={profile?.email || ""}
                        disabled
                      />
                      <Input
                        label="Phone Number"
                        id="phone"
                        value={profile?.customer?.phone || ""}
                      />
                    </div>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-custom-sm text-dark-4">
                        Display name updates appear inside your profile and
                        review history.
                      </p>

                      <button
                        type="submit"
                        className="btn-action w-full sm:w-auto"
                      >
                        Save profile
                      </button>
                    </div>
                  </form>

                  <form
                    onSubmit={preventFormSubmit}
                    className="rounded-[24px] border border-primary/10 bg-white-true p-5 shadow-ambient sm:rounded-[28px] sm:p-8"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-dark-4">
                          Security
                        </p>
                        <h3 className="mt-2 text-xl font-semibold text-dark sm:text-2xl">
                          Change password
                        </h3>
                        <p className="mt-2 text-sm text-dark-4 sm:text-base">
                          Give password fields a cleaner hierarchy and more
                          comfortable spacing.
                        </p>
                      </div>

                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/10 text-secondary">
                        <svg
                          className="h-6 w-6"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path d="M17 11V7a5 5 0 0 0-10 0v4M7 11h10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2Z" />
                        </svg>
                      </div>
                    </div>

                    <div className="mt-8 space-y-5">
                      <Input
                        label="Old Password"
                        id="oldPassword"
                        type="password"
                      />
                      <Input
                        label="New Password"
                        id="newPassword"
                        type="password"
                      />
                      <Input
                        label="Confirm New Password"
                        id="confirmNewPassword"
                        type="password"
                      />
                    </div>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-custom-sm text-dark-4">
                        Use a strong password that is different from your other
                        accounts.
                      </p>

                      <button
                        type="submit"
                        className="btn-action w-full sm:w-auto"
                      >
                        Update password
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AddressModal isOpen={addressModal} closeModal={closeAddressModal} />

      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};

const SidebarStat = ({ label, value }: { label: string; value: string }) => (
  <div className="min-w-0 rounded-2xl border border-gray-3 bg-gray-1 p-3">
    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-dark-4">
      {label}
    </p>
    <p className="mt-2 break-words text-sm font-semibold text-dark">{value}</p>
  </div>
);

const SnapshotItem = ({ label, value }: { label: string; value: string }) => (
  <div className="min-w-0 rounded-2xl border border-white/10 bg-white/10 p-3">
    <p className="text-[11px] uppercase tracking-[0.22em] text-white/60">
      {label}
    </p>
    <p className="mt-2 truncate text-sm font-semibold text-white-true">
      {value}
    </p>
  </div>
);

const MetricCard = ({
  label,
  value,
  copy,
  icon,
  accentClass,
  onClick,
}: {
  label: string;
  value: string;
  copy: string;
  icon: string;
  accentClass: string;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className="group rounded-[24px] border border-primary/10 bg-white-true p-5 text-left shadow-ambient transition-all duration-300 hover:-translate-y-1 hover:shadow-2 sm:rounded-[28px] sm:p-6"
  >
    <div
      className={`flex h-12 w-12 items-center justify-center rounded-2xl sm:h-14 sm:w-14 ${accentClass}`}
    >
      <svg
        className="h-6 w-6 sm:h-7 sm:w-7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d={icon} />
      </svg>
    </div>

    <p className="mt-5 text-xs font-semibold uppercase tracking-[0.24em] text-dark-4">
      {label}
    </p>
    <h3 className="mt-2 text-xl font-semibold text-dark sm:text-2xl">{value}</h3>
    <p className="mt-3 text-sm text-dark-4 sm:text-base">{copy}</p>

    <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
      Open section
      <span className="transition-transform duration-300 group-hover:translate-x-1">
        <ArrowRightIcon />
      </span>
    </div>
  </button>
);

const SummaryRow = ({ label, value }: { label: string; value: string }) => (
  <div className="min-w-0 rounded-2xl border border-gray-3 bg-gray-1 p-4">
    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-dark-4">
      {label}
    </p>
    <p className="mt-2 break-words text-sm font-semibold text-dark sm:text-base">
      {value}
    </p>
  </div>
);

const ChecklistItem = ({
  label,
  ready,
}: {
  label: string;
  ready: boolean;
}) => (
  <div className="flex items-center justify-between gap-3 rounded-2xl border border-gray-3 bg-gray-1 px-4 py-3">
    <span className="text-sm font-medium text-dark">{label}</span>
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] ${
        ready ? "bg-primary text-white" : "bg-yellow-light-4 text-secondary"
      }`}
    >
      {ready ? "Ready" : "Missing"}
    </span>
  </div>
);

const DetailItem = ({
  label,
  value,
  full,
}: {
  label: string;
  value: string;
  full?: boolean;
}) => (
  <div
    className={`${full ? "sm:col-span-2" : ""} min-w-0 rounded-2xl border border-gray-3 bg-gray-1 p-4`}
  >
    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-dark-4">
      {label}
    </p>
    <p className="mt-2 break-words text-sm font-medium leading-relaxed text-dark sm:text-base">
      {value}
    </p>
  </div>
);

const Input = ({
  label,
  id,
  type = "text",
  value,
  disabled,
}: {
  label: string;
  id: string;
  type?: string;
  value?: string;
  disabled?: boolean;
}) => (
  <div className="w-full">
    <label
      htmlFor={id}
      className="mb-2.5 ml-1 block text-[13px] font-semibold text-dark sm:text-sm"
    >
      {label}
    </label>
    <input
      type={type}
      name={id}
      id={id}
      defaultValue={value}
      disabled={disabled}
      className={`w-full rounded-2xl border border-gray-3 bg-gray-1 px-4 py-3 text-sm outline-none transition-all duration-200 focus:border-primary focus:bg-white-true focus:ring-4 focus:ring-primary/10 sm:px-4.5 sm:py-3.5 sm:text-base ${
        disabled ? "cursor-not-allowed opacity-60" : ""
      }`}
    />
  </div>
);

const ArrowRightIcon = () => (
  <svg
    className="h-4 w-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    viewBox="0 0 24 24"
  >
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

export default MyAccount;
