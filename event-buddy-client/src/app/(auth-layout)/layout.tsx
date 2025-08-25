"use client";
import AuthHeader from "@/components/auth-header";
import SetLoading from "@/components/set-loading";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AuthHeader />
      <main className="bg-secondary min-h-screen">{children}</main>
    </>
  );
}
