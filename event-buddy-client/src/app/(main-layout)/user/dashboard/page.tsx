"use client";

import { useUser } from "@/context/user-context";
import React, { useEffect, useState, useCallback } from "react";
import RegisteredCard from "./registered-card";
import Link from "next/link";
import { getToken, singOut } from "@/utilities/jwt-operation";
import { useRouter } from "next/navigation";
import axios from "axios";
import SetLoading from "@/components/set-loading";
import { toast } from "react-toastify";

const UserDashboard = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const { user, setUser, setLoading } = useUser();
  const router = useRouter();

  type Booking = {
    booking_id: number;
    status: string;
    event: {
      title: string;
      date: string;
      start_time: string;
      end_time: string;
      location: string;
    };
  };

  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated && !user) {
      router.push("/signin");
    }
  }, [isHydrated, user, router]);

  const refetchBookings = useCallback(async () => {
    const token = await getToken();

    if (!token || !user || user.role !== "User") {
      setLoading(false);
      setUser(null);
      await singOut();
      router.push("/signin");
      return;
    }

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_LOCALHOST}/booking/user/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBookings(response.data);
    } catch (error: any) {
      console.error("Error fetching bookings:", error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please sign in again.");
        setUser(null);
        await singOut();
        router.push("/signin");
      }
    } finally {
      setLoading(false);
      setCheckingAuth(false);
    }
  }, [user, setUser, setLoading, router]);

  useEffect(() => {
    if (isHydrated && user?.id) {
      refetchBookings();
    }
  }, [isHydrated, user?.id, refetchBookings]);

  if (!isHydrated || checkingAuth) {
    return <SetLoading />;
  }

  return (
    <div className="bg-primary min-h-screen">
      <div className="container mx-auto p-4">
        <div>
          <h1 className="text-textPrimary text-2xl md:3xl">Dashboard</h1>
          <p className="text-textSecondary pb-12">
            Welcome back, {user?.full_name}!! Here you can manage your event
            registrations.
          </p>
        </div>

        <div>
          <p className="text-textPrimary text-lg pb-2">My Registered Events</p>
        </div>

        <div className="space-y-6">
          {bookings && bookings.length > 0 ? (
            bookings
              .sort((a, b) => {
                if (a.status === "Active" && b.status !== "Active") return -1;
                if (a.status !== "Active" && b.status === "Active") return 1;
                const dateA = new Date(a.event.date);
                const dateB = new Date(b.event.date);
                return dateA.getTime() - dateB.getTime();
              })
              .map((booking) => (
                <RegisteredCard
                  key={booking.booking_id}
                  booking={booking}
                  refetchBookings={refetchBookings}
                />
              ))
          ) : (
            <p className="text-textSecondary">
              You have not registered for any events yet.
            </p>
          )}
        </div>

        <div className="flex items-center justify-center w-full">
          <Link
            href={"/"}
            className="mt-6 w-[12rem] px-4 py-2 bg-gradient-to-t from-btnPrimaryStart to-btnPrimaryEnd rounded-lg text-white hover:cursor-pointer hover:from-btnPrimaryEnd hover:to-btnPrimaryStart"
          >
            Browse more events
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
