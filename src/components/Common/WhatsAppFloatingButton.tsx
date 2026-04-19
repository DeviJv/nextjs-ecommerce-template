"use client";
import React, { useState, useEffect } from "react";
import { Employer } from "@/types/employer";

const WhatsAppFloatingButton = () => {
  const [company, setCompany] = useState<Employer | null>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/employe`)
      .then((res) => res.json())
      .then((data) => setCompany(data))
      .catch(() => setCompany(null));
  }, []);

  if (!company?.phone) return null;

  // Clean the phone number for WhatsApp link
  // WhatsApp link format: https://wa.me/628123456789 (no +, no space, no dash)
  const cleanPhone = company.phone.replace(/[^0-9]/g, "");

  return (
    <a
      href={`https://wa.me/${cleanPhone}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-999 flex items-center justify-center w-9 h-9 rounded-full shadow-lg bg-[#25D366] text-white ease-out duration-200 hover:bg-[#128C7E] hover:scale-110 transition-all border-2 border-white"
      aria-label="Contact us on WhatsApp"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12.011 2c-5.511 0-9.989 4.478-9.989 9.989 0 1.762.46 3.474 1.332 4.98L2 22l5.144-1.348c1.45.792 3.085 1.21 4.867 1.21 5.511 0 9.989-4.478 9.989-9.989 0-5.511-4.478-9.989-9.989-9.989zM12.011 20.21c-1.572 0-3.11-.422-4.447-1.22l-.318-.19-3.067.803.818-2.992-.21-.334c-.874-1.386-1.334-2.988-1.334-4.638 0-4.903 3.99-8.892 8.893-8.892 4.903 0 8.892 3.99 8.892 8.892.001 4.903-3.989 8.893-8.892 8.893zM16.735 13.922c-.258-.13-1.528-.755-1.765-.843-.237-.088-.41-.132-.582.132-.172.264-.668.843-.819 1.02-.15.177-.3.197-.558.067-.258-.13-1.09-.402-2.077-1.277-.768-.686-1.286-1.533-1.437-1.797-.15-.264-.016-.407.113-.537.116-.117.258-.3.388-.45.13-.15.172-.258.258-.43.088-.172.044-.324-.022-.456-.066-.132-.582-1.403-.797-1.926-.21-.504-.423-.434-.582-.442l-.497-.007c-.172 0-.45.066-.686.324-.237.258-.905.885-.905 2.158 0 1.272.926 2.5 1.056 2.677.13.177 1.82 2.78 4.408 3.896.615.265 1.096.423 1.47.542.617.196 1.18.168 1.625.101.497-.075 1.528-.625 1.743-1.23.214-.605.214-1.125.15-1.23-.064-.105-.236-.168-.494-.298z" />
      </svg>
    </a>
  );
};

export default WhatsAppFloatingButton;
