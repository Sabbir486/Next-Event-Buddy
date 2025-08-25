import { useUser } from "@/context/user-context";
import { getToken, singOut } from "@/utilities/jwt-operation";
import axios from "axios";
import { format, isBefore, parse, parseISO } from "date-fns";
import { Calendar, Clock, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

type eventsData = {
  booking: {
    booking_id: number;
    status: string;
    event: {
      title: string;
      date: string;
      start_time: string;
      end_time: string;
      location: string;
      [key: string]: any;
    };
    [key: string]: any;
  };
  refetchBookings: () => void;
};

const RegisteredCard = ({ booking, refetchBookings }: eventsData) => {
  const techEvent = booking?.event;
  const { user, setUser, setLoading } = useUser();
  const [isHydrated, setIsHydrated] = useState(false);
  const router = useRouter();

  const dateObj = parseISO(techEvent.date);
  const monthName = format(dateObj, "LLL");
  const dayName = format(dateObj, "EEEE");
  const year = format(dateObj, "yyyy");
  const date = format(dateObj, "d");
  const today = new Date();
  const isExpired = isBefore(dateObj, today);
  const startTime = format(
    parse(techEvent.start_time, "HH:mm:ss", new Date()),
    "hh:mm a"
  );
  const endTime = format(
    parse(techEvent.end_time, "HH:mm:ss", new Date()),
    "hh:mm a"
  );

  const handleCancel = async (bookingId: number) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this cancellation!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, cancel it!",
    });

    if (!result.isConfirmed) return;

    const token = await getToken();

    if (!token || !user || user.role !== "User" || user === undefined) {
      setLoading(false);
      setUser(null);
      await singOut();
      router.push("/signin");
      return;
    }

    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_LOCALHOST}/booking/update/${booking.booking_id}`,
        { status: "Cancelled" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success("Booking cancelled successfully");
        refetchBookings();
      }
    } catch (error) {
      toast.error("Failed to cancel registration");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return (
    <div>
      <div className="bg-white p-6 rounded-lg border-2 border-[#bdbbfb3d] w-full shadow-sm flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-6 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center gap-8 lg:gap-6 flex-1">
          <div className="text-3xl">
            <p className="text-[#3D37F1] font-bold">
              {monthName.toUpperCase()}
            </p>
            <p className="text-5xl font-bold">{date}</p>
          </div>
          <div className="flex flex-col justify-center">
            <h3 className="text-textPrimary text-lg font-semibold">
              {techEvent.title}
            </h3>

            <div className="flex flex-col lg:flex-row gap-2 lg:gap-7 mt-2 lg:text-sm">
              <div className="flex items-center justify-start gap-2">
                <div className="text-[#1D4ED8]">
                  <Calendar size={20} />
                </div>
                <div>
                  <p className="text-textSecondary">{dayName}</p>
                </div>
              </div>

              <div className="flex items-center justify-start gap-2">
                <div className="text-[#1D4ED8] ">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="text-textSecondary wrap">
                    {startTime} - {endTime}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-start gap-2">
                <div className="text-[#1D4ED8] ">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-textSecondary wrap">
                    {techEvent.location}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {isExpired && booking.status === "Active" ? (
          <button
            disabled
            className="px-4 py-2 bg-gray-400 rounded-lg text-white cursor-not-allowed"
          >
            Event Ended
          </button>
        ) : booking.status === "Cancelled" ? (
          <button
            disabled
            className="px-4 py-2 bg-red-800 rounded-lg text-white cursor-not-allowed"
          >
            Cancelled
          </button>
        ) : (
          <button
            onClick={() => handleCancel(booking.booking_id)}
            className="px-4 py-2 bg-gradient-to-t from-btnSecondaryStart to-btnSecondaryEnd rounded-lg text-white hover:cursor-pointer hover:from-btnSecondaryEnd hover:to-btnSecondaryStart"
          >
            Cancel Registration
          </button>
        )}
      </div>
    </div>
  );
};

export default RegisteredCard;
