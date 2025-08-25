"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { decodeJWT, getRole } from "@/utilities/jwt-operation";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/user-context";
import SetLoading from "@/components/set-loading";

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user, setUser, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/");
    }
  }, [loading, user, router]);

  if (loading || user) {
    return <SetLoading />;
  }

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await toast.promise(
      (async () => {
        try {
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_LOCALHOST}/auth/signin`,
            { email, password }
          );
          const { data } = res;

          if (data?.accessToken) {
            const role = getRole(data.accessToken, data.refreshToken);
            setEmail("");
            setPassword("");
            const user = decodeJWT();
            // const signedInUser = {
            //   id: user.user_id,
            //   role: user.role,
            //   email: user.email,
            //   full_name: user.full_name,
            // };
            setUser(user);

            if (role === "Admin") {
              router.push("/");
            } else {
              // router.push("user/dashboard");
            }
          } else {
            toast.error(data?.message || "Login failed");
            return;
          }
        } catch (err: any) {
          const message = err.response?.data?.message || "Login failed";
          toast.error(message);
        }
      })(),
      {
        pending: "Signing in...",
        error: {
          render({ data }: any) {
            return data?.message || data?.toString() || "Login failed";
          },
        },
      }
    );
  };

  return (
    <form className="space-y-7" onSubmit={handleOnSubmit}>
      <div>
        <label
          htmlFor="email"
          className="block font-medium text-textPrimary mb-2"
        >
          Email
        </label>
        <input
          type="email"
          name="email"
          placeholder="enter your email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label
          htmlFor="password"
          className="block font-medium text-textPrimary mb-2"
        >
          Password
        </label>
        <input
          type="password"
          name="password"
          placeholder="enter your password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-gradient-to-t from-btnPrimaryStart to-btnPrimaryEnd text-white py-3 rounded-md hover:bg-gradient-to-b hover:from-btnPrimaryStart hover:to-btnPrimaryEnd transition"
      >
        Sign In
      </button>
    </form>
  );
}
