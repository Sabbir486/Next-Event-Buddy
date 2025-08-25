"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  CircleArrowLeft,
  Dot,
  Calendar,
  Clock,
  MapPin,
  Ticket,
  Armchair,
} from "lucide-react";
import { format, isBefore, parse, parseISO } from "date-fns";
import { toast } from "react-toastify";
import { useUser } from "@/context/user-context";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { getToken, singOut } from "@/utilities/jwt-operation";
import SetLoading from "@/components/set-loading";

const EventDetails = () => {
  const params = useParams();
  const Id = params?.id;
  const eventId = Number(Id);

  const [isHydrated, setIsHydrated] = useState(false);
  const [techEvent, setTechEvent] = useState<any>(null);
  const [selectSeat, setSelectSeat] = useState(0);
  const [spotLeft, setSpotLeft] = useState(0);
  const [totalBooked, setTotalBooked] = useState(0);
  const [clicked, setClicked] = useState(false);
  const { user, setUser, setLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    setIsHydrated(true);
    const fetchEvent = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_LOCALHOST}/event/${eventId}`
        );
        if (response && response.data) {
          setTechEvent(response.data);
          setSpotLeft(response.data.available_seats);
          setTotalBooked(response.data.total_booked);
        } else {
          toast.error("Event not found");
        }
      } catch (error) {
        toast.error("Failed to fetch event details");
      }
    };

    fetchEvent();
  }, [eventId]);

  if (!isHydrated) return null;

  if (!techEvent) {
    return (
      <div className="container mx-auto p-5">
        <SetLoading />
        <h1 className="text-red-500 text-center">Event not found</h1>
      </div>
    );
  }

  const dateValue = techEvent.date;
  const dateObj = parseISO(dateValue);
  const monthName = format(dateObj, "LLLL");
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

  const descList = (techEvent.description ?? "")
    .split(".")
    .map((s: string) => s.trim())
    .filter((s: string) => s.length > 0);

  const handleBooking = async () => {
    if (user === null) {
      router.push("/signin");
      return;
    }
    if (selectSeat === 0) {
      toast.error("Please select seats to book");
      return;
    }
    if (selectSeat > spotLeft) {
      toast.error("Not enough seats available");
      return;
    }

    const bookingData = {
      user_id: user.id,
      event_id: techEvent.event_id,
      seat_booked: selectSeat,
    };

    const token = await getToken();

    if (user.id === undefined || user.id === null || !token) {
      setLoading(true);
      await singOut();
      setUser(null);
      setLoading(false);
      router.push("/signin");
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_LOCALHOST}/booking/create`,
        bookingData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { data } = response;

      if (data) {
        setSpotLeft((prev: number) => prev - selectSeat);
        setTotalBooked((prev: number) => prev + selectSeat);
        setSelectSeat(0);
        toast.success("Booking successful");
      } else {
        toast.error(data.message || "Booking failed");
      }
    } catch (error) {}
  };

  return (
    <div className="bg-primary" suppressHydrationWarning>
      <div className="container mx-auto p-5">
        <Link
          href="/"
          className="flex items-center justify-start gap-2 text-lg text-textPrimary mb-5"
        >
          <CircleArrowLeft />
          Back to event
        </Link>
        <img
          src={`${techEvent.image_path}`}
          alt=""
          className="w-full rounded-lg mb-5"
        />

        <div className="mb-5">
          {techEvent.tags.map((tag: string, index: number) => (
            <span
              key={index}
              className="inline-block bg-[#DADEFF] text-[#1D4ED8] px-2 py-1 rounded-md text-sm mr-2 mb-2"
            >
              <div className="flex items-center justify-start">
                <Dot />
                {tag}
              </div>
            </span>
          ))}
        </div>

        <div className="mb-9 pt-4">
          <h1 className="text-textPrimary text-4xl ">{techEvent.title}</h1>
        </div>

        <div className="bg-white p-6 rounded-lg border-2 border-[#bdbbfb3d] flex flex-col lg:flex-row items-start lg:items-center lg:justify-between gap-7 mb-5">
          <div className="flex items-center justify-start gap-5">
            <div className="text-[#1D4ED8] ">
              <Calendar size={33} />
            </div>
            <div>
              <h4 className="text-[#6A6A6A]">Date</h4>
              <p className="text-textSecondary">
                {dayName}, {date} {monthName} , {year}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-start gap-5">
            <div className="text-[#1D4ED8] ">
              <Clock size={33} />
            </div>
            <div>
              <h4 className="text-[#6A6A6A]">Time</h4>
              <p className="text-textSecondary">
                {startTime} - {endTime}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-start gap-5">
            <div className="text-[#1D4ED8] ">
              <MapPin size={33} />
            </div>
            <div>
              <h4 className="text-[#6A6A6A]">Location</h4>
              <p className="text-textSecondary">{techEvent.location}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center mb-5 ">
          <div className="bg-white p-6 rounded-lg border-2 border-[#bdbbfb3d] lg:w-[58rem]  ">
            <h2 className="text-lg md:text-xl text-textPrimary">
              Select Number of Seats
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6 ">
              {[1, 2, 3, 4].map((seat) => (
                <div
                  key={seat}
                  onClick={() => setSelectSeat(seat)}
                  className={` w-[13rem] h-[9rem] border-2 rounded-md hover:bg-[#8570ad21] border-[#E6E6E6] ${
                    selectSeat === seat ? "border-[#8570AD] bg-[#8570ad21]" : ""
                  }`}
                >
                  <div className="flex flex-col items-center justify-center gap-2 hover:cursor-pointer h-full">
                    <Ticket color={"#242565"} />
                    <h4 className="text-textPrimary">{seat}</h4>
                    <p className="text-textSecondary">Seat</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center mt-6">
              <button
                onClick={() => !isExpired && handleBooking()}
                disabled={isExpired}
                className={`text-white px-4 py-2 rounded-md transition ${
                  isExpired
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-t from-btnPrimaryStart to-btnPrimaryEnd hover:bg-gradient-to-b hover:from-btnPrimaryStart hover:to-btnPrimaryEnd"
                }`}
              >
                {isExpired
                  ? "Not Available"
                  : `Book ${selectSeat === 0 ? "" : selectSeat} Seat`}
              </button>
            </div>
          </div>
        </div>

        <div className="pt-5 text-textSecondary">
          <h1 className="text-xl text-textPrimary mb-5">About this event</h1>
          <p className="mb-5 text-justify ">
            Join us for Tech Future Expo 2025, an immersive one-day technology
            event bringing together developers, startups, and industry leaders
            to explore the future of software, AI, blockchain, and cloud
            computing.{" "}
          </p>
          <div className="mb-5">
            <h5 className="">This event will feature :</h5>
            <ul className="list-disc list-inside space-y-2 text-textSecondary text-justify">
              {descList.map((item: string, index: number) => (
                <li key={index}>{item}.</li>
              ))}
            </ul>
          </div>

          <p className="mb-5 text-justify">
            Reserve your seat today and be part of tomorrow's innovation.
            Limited seats available. Advance booking required.
          </p>
        </div>

        <div className="mt-12 border-t-2 border-[#bdbbfb3d] pt-5">
          <div className="flex items-center gap-2">
            <Armchair color={"#8570AD"} size={30} />
            <p className="text-textSecondary text-xl">
              {spotLeft} Spot Left{" "}
              <span className="text-gray-400">
                ( {totalBooked} registered )
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
