"use client";
import Breadcrumb from "@/components/Common/Breadcrumb";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const reTypePassword = formData.get("re-type-password") as string;

    if (!name || !email || !password || !reTypePassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password !== reTypePassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Registration successful! Please check your email to verify your account.");
        setRegisteredEmail(email);
        // We stay on the page to show the resend option
      } else {
        throw new Error(data.message || "Registration failed. Try a different email.");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!registeredEmail) return;

    setResending(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/email/resend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ email: registeredEmail }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Verification link resent! Please check your email.");
      } else {
        throw new Error(data.message || "Failed to resend verification email.");
      }
    } catch (err: any) {
      toast.error(err.message || "Error resending verification email.");
    } finally {
      setResending(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/google/redirect`, {
        headers: {
          "Accept": "application/json",
        },
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      toast.error("Failed to initiate Google login");
    }
  };

  return (
    <>
      <Breadcrumb title={"Signup"} pages={["Signup"]} />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="max-w-[570px] w-full mx-auto rounded-xl bg-white shadow-1 p-4 sm:p-7.5 xl:p-11">
            <div className="text-center mb-11">
              <h2 className="font-semibold text-xl sm:text-2xl xl:text-heading-5 text-dark mb-1.5">
                Create an Account
              </h2>
              <p>Enter your detail below</p>
            </div>

            {registeredEmail && (
              <div className="mb-8 p-6 rounded-xl bg-blue/5 border border-blue/20 text-center animate-fadeIn">
                <div className="flex justify-center mb-4 text-blue">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-dark mb-2">Check your email</h3>
                <p className="text-dark-5 mb-6 text-sm">
                  We&apos;ve sent a verification link to <span className="font-medium text-dark">{registeredEmail}</span>. Please verify your email to activate your account.
                </p>
                <div className="flex flex-col gap-3">
                  <button
                    type="button"
                    disabled={resending}
                    onClick={handleResendVerification}
                    className="w-full flex justify-center font-medium text-white bg-blue py-2.5 px-6 rounded-lg ease-out duration-200 hover:bg-blue-dark disabled:opacity-70"
                  >
                    {resending ? "Resending..." : "Resend Verification Email"}
                  </button>
                  <Link
                    href="/signin"
                    className="text-dark-4 hover:text-dark text-sm font-medium transition-colors"
                  >
                    Back to Sign In
                  </Link>
                </div>
              </div>
            )}

            {!registeredEmail && (
              <>
                {/* Google login buttons are hidden for now */}
                
                <div className="mt-5.5">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-5">
                      <label htmlFor="name" className="block mb-2.5">
                        Full Name <span className="text-red">*</span>
                      </label>

                      <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        placeholder="Enter your full name"
                        className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                      />
                    </div>

                    <div className="mb-5">
                      <label htmlFor="email" className="block mb-2.5">
                        Email Address <span className="text-red">*</span>
                      </label>

                      <input
                        type="email"
                        name="email"
                        id="email"
                        required
                        placeholder="Enter your email address"
                        className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                      />
                    </div>

                    <div className="mb-5">
                      <label htmlFor="password" className="block mb-2.5">
                        Password <span className="text-red">*</span>
                      </label>

                      <input
                        type="password"
                        name="password"
                        id="password"
                        required
                        placeholder="Enter your password"
                        autoComplete="on"
                        className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                      />
                    </div>

                    <div className="mb-5.5">
                      <label htmlFor="re-type-password" className="block mb-2.5">
                        Re-type Password <span className="text-red">*</span>
                      </label>

                      <input
                        type="password"
                        name="re-type-password"
                        id="re-type-password"
                        required
                        placeholder="Re-type your password"
                        autoComplete="on"
                        className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex justify-center font-medium text-white bg-dark py-3 px-6 rounded-lg ease-out duration-200 hover:bg-blue mt-7.5 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {loading ? "Creating Account..." : "Create Account"}
                    </button>

                    <p className="text-center mt-6">
                      Already have an account?
                      <Link
                        href="/signin"
                        className="text-dark ease-out duration-200 hover:text-blue pl-2"
                      >
                        Sign in Now
                      </Link>
                    </p>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Signup;
