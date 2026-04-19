"use client";
import React, { useState, useEffect } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import { Employer } from "@/types/employer";

import { toast } from "react-hot-toast";

const Contact = () => {
  const [company, setCompany] = useState<Employer | null>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/employe`)
      .then((res) => res.json())
      .then((data) => setCompany(data))
      .catch(() => setCompany(null));
  }, []);

  const handleCopy = (text: string, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  return (
    <>
      <Breadcrumb title={"Contact"} pages={["contact"]} />

      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex flex-col items-center justify-center gap-7.5">
            <div className="max-w-[570px] w-full bg-white rounded-xl shadow-1">
              <div className="py-5 px-4 sm:px-7.5 border-b border-gray-3">
                <p className="font-medium text-xl text-dark text-center">
                  Contact Information
                </p>
                <p className="text-center text-xs text-dark-5 mt-1">Click to copy any information</p>
              </div>

              <div className="p-4 sm:p-7.5">
                <div className="flex flex-col gap-6">
                  {/* Name */}
                  <div 
                    className="flex items-center gap-4 cursor-pointer group hover:bg-gray-1 p-2 rounded-lg transition-colors"
                    onClick={() => handleCopy(company?.name || "", "Name")}
                  >
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-1 text-blue group-hover:bg-white">
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 22 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="fill-current"
                      >
                        <path d="M11 2a5 5 0 015 5c0 2.44-1.74 4.47-4.08 4.91a8 8 0 014.08 7.09H6a8 8 0 014.08-7.09A5 5 0 016 7a5 5 0 015-5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-dark-5">Name</p>
                      <p className="font-medium text-dark">{company?.name || "Loading..."}</p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div 
                    className="flex items-center gap-4 cursor-pointer group hover:bg-gray-1 p-2 rounded-lg transition-colors"
                    onClick={() => handleCopy(company?.phone || "", "Phone number")}
                  >
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-1 text-blue group-hover:bg-white">
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 22 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="fill-current"
                      >
                         <path d="M20.84 15.22a15.48 15.48 0 01-3.53-1.07 1 1 0 00-1 .24l-2.2 2.2a15.05 15.05 0 01-6.5-6.5l2.2-2.2a1 1 0 00.24-1 15.48 15.48 0 01-1.07-3.53A1 1 0 008.01 2H2.01A1 1 0 001 3a18 18 0 0018 18 1 1 0 001-1.01V14.01a1 1 0 00-.16-.79z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-dark-5">Phone</p>
                      <p className="font-medium text-dark">{company?.phone || "Loading..."}</p>
                    </div>
                  </div>

                  {/* Email */}
                  <div 
                    className="flex items-center gap-4 cursor-pointer group hover:bg-gray-1 p-2 rounded-lg transition-colors"
                    onClick={() => handleCopy(company?.email || "", "Email address")}
                  >
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-1 text-blue group-hover:bg-white">
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 22 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="fill-current"
                      >
                        <path d="M20 4H2a2 2 0 00-2 2v12a2 2 0 002 2h18a2 2 0 002-2V6a2 2 0 00-2-2zM2 6h18v.75l-9 5.25-9-5.25V6zm0 12V8.25l9 5.25 9-5.25V18H2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-dark-5">Email</p>
                      <p className="font-medium text-dark">{company?.email || "Loading..."}</p>
                    </div>
                  </div>

                  {/* Address */}
                  <div 
                    className="flex items-start gap-4 cursor-pointer group hover:bg-gray-1 p-2 rounded-lg transition-colors"
                    onClick={() => handleCopy(company?.alamat || "", "Address")}
                  >
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-1 text-blue shrink-0 group-hover:bg-white">
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 22 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="fill-current"
                      >
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-dark-5">Address</p>
                      <p className="font-medium text-dark leading-relaxed">{company?.alamat || "Loading..."}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
