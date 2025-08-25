"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { CheckCircle } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import { getRole } from "@/utilities/jwt-operation";
import { useUser } from "@/context/user-context";
import { useRouter } from "next/navigation";

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const { user, setUser, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/");
    }
  }, [loading, user, router]);

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await toast.promise(
        axios
          .post(`${process.env.NEXT_PUBLIC_LOCALHOST}/user/create`, {
            full_name: fullName,
            email,
            password,
          })
          .then(async (res) => {
            if (res.status === 201) {
              try {
                const res = await axios.post(
                  `${process.env.NEXT_PUBLIC_LOCALHOST}/auth/signin`,
                  {
                    email,
                    password,
                  }
                );

                const { data } = res;
                if (data?.accessToken) {
                  const role = getRole(data.accessToken, data.refreshToken);

                  setEmail("");
                  setPassword("");
                  setFullName("");

                  if (role === "admin") {
                    // router.push("/admin/dashboard");
                  } else {
                    // router.push("user/dashboard");
                  }
                } else {
                  toast.error(data?.message || "Login failed");
                  return;
                }
              } catch (err: any) {
                const message =
                  err.response?.data?.message || "Internal server error";
                toast.error(message);
              }
            } else {
              toast.error(res.data?.message || "Sign up failed");
            }
          }),
        {
          pending: "Signing up...",
          //   success: "Sign up successful",
          //   error: "Sign up failed",
        }
      );
    } catch (err: any) {
      const message = err.response?.data?.message || "Internal Server error";
      toast.error(message);
    }
  };

  const passwordValidations = [
    {
      label: "At least 8 characters",
      isValid: password.length >= 8,
    },
    {
      label: "1 uppercase letter",
      isValid: /[A-Z]/.test(password),
    },
    {
      label: "1 lowercase letter",
      isValid: /[a-z]/.test(password),
    },
    {
      label: "1 number",
      isValid: /\d/.test(password),
    },
    {
      label: "1 special character",
      isValid: /[!@#$%^&*(),.?\":{}|<>]/.test(password),
    },
  ];

  const isPasswordValid = passwordValidations.every((rule) => rule.isValid);
  const areAllFieldsFilled = email && password && fullName;
  const isFormValid = isPasswordValid && areAllFieldsFilled;

  return (
    <form className="space-y-7" onSubmit={handleOnSubmit}>
      <div>
        <label
          htmlFor="fullName"
          className="block font-medium text-textPrimary mb-2"
        >
          Full Name
        </label>
        <input
          type="text"
          name="fullName"
          placeholder="e.g. John Doe"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

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
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-1"
        />
        <ul className="text-sm mt-2 ml-1 space-y-1">
          {passwordValidations.map((rule, idx) => (
            <li key={idx} className="flex items-center gap-2 text-gray-700">
              <span
                className={`h-4 w-4 rounded-full flex items-center justify-center ${
                  rule.isValid ? "text-green-600" : "text-gray-400"
                }`}
              >
                {rule.isValid ? <CheckCircle className="w-4 h-4" /> : "•"}
              </span>
              <span
                className={rule.isValid ? "text-green-600" : "text-red-600"}
              >
                {rule.label}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <button
        type="submit"
        disabled={!isFormValid}
        className={`w-full text-white py-3 rounded-md transition ${
          isFormValid
            ? "bg-gradient-to-t from-btnPrimaryStart to-btnPrimaryEnd hover:bg-gradient-to-b hover:from-btnPrimaryStart hover:to-btnPrimaryEnd"
            : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        Sign Up
      </button>
    </form>
  );
}
