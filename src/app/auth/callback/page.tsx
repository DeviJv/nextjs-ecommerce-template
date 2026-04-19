"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

const AuthCallback = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      // Store the token
      localStorage.setItem("auth_token", token);
      
      // Dispatch event to update UI across components
      window.dispatchEvent(new Event("auth-change"));
      
      // Fetch user data and store it
      const fetchUser = async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/me`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json',
            }
          });
          const data = await res.json();
          if (res.ok) {
            localStorage.setItem("user", JSON.stringify(data));
            toast.success("Successfully logged in with Google!");
            router.push("/");
          } else {
            throw new Error("Failed to fetch user data");
          }
        } catch (error) {
          console.error(error);
          toast.error("Failed to complete login");
          router.push("/signin");
        }
      };

      fetchUser();
    } else {
      router.push("/signin");
    }
  }, [router, searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-xl font-medium mb-4">Completing login...</h2>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dark mx-auto"></div>
      </div>
    </div>
  );
};

export default AuthCallback;
