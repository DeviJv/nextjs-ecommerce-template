"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function NotFound() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gray-1 px-4 py-20">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-[400px] w-[400px] rounded-full bg-secondary/5 blur-3xl" />

      <div
        className={`relative z-10 flex flex-col items-center text-center transition-all duration-700 ${
          mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        }`}
      >
        {/* Big number */}
        <div className="relative mb-6 select-none">
          <p className="text-[120px] font-bold leading-none tracking-tight text-primary/10 sm:text-[180px] lg:text-[220px]">
            404
          </p>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-[28px] bg-white-true shadow-ambient ring-1 ring-primary/10">
              <svg
                className="h-10 w-10 text-primary"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Label */}
        <p className="mb-3 text-custom-xs font-semibold uppercase tracking-[0.24em] text-dark-4">
          Page not found
        </p>

        {/* Heading */}
        <h1 className="max-w-md text-heading-5 font-semibold leading-tight text-dark sm:text-heading-4">
          This page doesn&apos;t exist.
        </h1>

        {/* Subtext */}
        <p className="mt-4 max-w-sm text-custom-sm font-medium leading-relaxed text-dark-4">
          The page you&apos;re looking for may have been moved, renamed, or removed.
          Let&apos;s get you back on track.
        </p>

        {/* CTA */}
        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="btn-action inline-flex items-center gap-2"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
              />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Back to Homepage
          </Link>

          <Link
            href="/catalog"
            className="btn-action-secondary inline-flex items-center gap-2"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            Browse Catalog
          </Link>
        </div>
      </div>
    </main>
  );
}
