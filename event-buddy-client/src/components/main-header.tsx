"use client";

import Link from "next/link";
import { useUser } from "@/context/user-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, LogOut } from "lucide-react";
import { singOut } from "@/utilities/jwt-operation";

export default function MainHeader() {
  const { user, setUser } = useUser();
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { loading, setLoading } = useUser();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleSignOut = async () => {
    setLoading(true);
    await singOut();
    setUser(null);
    setLoading(false);
    router.push("/signin");
  };

  if (!isHydrated) return null;

  const handleDashboard = () => {
    if (user?.role === "Admin") {
      router.push("/admin/dashboard");
    } else if (user?.role === "User") {
      router.push("/user/dashboard");
    }
    setMenuOpen(false);
  };


  return (
    <header className="bg-[#fafaff1a] sticky top-0 z-50  backdrop-blur-xl">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link href={"/"} className="flex items-center gap-3">
          <img src="/icons/ticket-2.png" alt="Event buddy" className="w-8" />
          <h1 className="text-textPrimary font-bold text-3xl">Event buddy</h1>
        </Link>

        <div className="hidden md:flex items-center gap-4">
          {!user ? (
            <>
              <Link
                href="/signin"
                className="text-white bg-gradient-to-t from-btnPrimaryStart to-btnPrimaryEnd hover:bg-gradient-to-b hover:from-btnPrimaryStart hover:to-btnPrimaryEnd px-4 py-2 rounded-md transition"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="text-white bg-gradient-to-t from-btnPrimaryStart to-btnPrimaryEnd hover:bg-gradient-to-b hover:from-btnPrimaryStart hover:to-btnPrimaryEnd px-4 py-2 rounded-md transition"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <span
                onClick={() => handleDashboard()}
                className="text-textPrimary hover:cursor-pointer underline"
              >
                Hello, {user.full_name}
              </span>
              <button
                onClick={handleSignOut}
                className="text-white bg-gradient-to-t from-btnPrimaryStart to-btnPrimaryEnd hover:bg-gradient-to-b hover:from-btnPrimaryStart hover:to-btnPrimaryEnd px-4 py-2 rounded-md transition"
              >
                <LogOut size={20} className="inline mr-1" />
                Logout
              </button>
            </>
          )}
        </div>

        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-textPrimary"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden absolute right-4 top-16 z-50 bg-secondary shadow-lg rounded-md w-48 p-4 flex flex-col gap-2">
          {!user ? (
            <>
              <h1 className="text-center text-textPrimary">Sign in for more</h1>
              <Link
                href="/signin"
                onClick={() => setMenuOpen(false)}
                className="text-white text-center bg-gradient-to-t from-btnPrimaryStart to-btnPrimaryEnd hover:bg-gradient-to-b hover:from-btnPrimaryStart hover:to-btnPrimaryEnd px-4 py-2 rounded-md transition "
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                onClick={() => setMenuOpen(false)}
                className="text-white text-center bg-gradient-to-t from-btnPrimaryStart to-btnPrimaryEnd hover:bg-gradient-to-b hover:from-btnPrimaryStart hover:to-btnPrimaryEnd px-4 py-2 rounded-md transition "
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <span
                onClick={() => handleDashboard()}
                className="text-textPrimary font-semibold hover:cursor-pointer underline text-center mb-2"
              >
                {user.full_name}
              </span>
              <button
                onClick={() => {
                  handleSignOut();
                  setMenuOpen(false);
                }}
                className="text-white bg-gradient-to-t from-btnPrimaryStart to-btnPrimaryEnd hover:bg-gradient-to-b hover:from-btnPrimaryStart hover:to-btnPrimaryEnd px-4 py-2 rounded-md transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
}
