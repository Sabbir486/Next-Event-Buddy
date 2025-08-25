"use client";

import Link from "next/link";
import React from "react";
import Image from "next/image";
import {
  Armchair,
  Calendar,
  CalendarDays,
  Clock,
  Dot,
  MapPin,
} from "lucide-react";
import { format, isBefore, parse, parseISO } from "date-fns";

interface EventProps {
  event_id: number;
  title: string;
  date: string;
  location: string;
  total_seats: number;
  available_seats: number;
  start_time: string;
  end_time: string;
  description?: string;
  tags: string[];
  image_path: string;
}

const EventCard = ({ event }: { event: EventProps }) => {
  const dateObj = parseISO(event.date);
  const monthName = format(dateObj, "LLL");
  const dayName = format(dateObj, "EEEE");
  const year = format(dateObj, "yyyy");
  const date = format(dateObj, "d");
  const today = new Date();
  const isExpired = isBefore(dateObj, today);
  const startTime = format(
    parse(event.start_time, "HH:mm:ss", new Date()),
    "hh"
  );
  const endTime = format(parse(event.end_time, "HH:mm:ss", new Date()), "hh a");

  const shortLocation =
    event.location.length > 10
      ? event.location.slice(0, 10) + "..."
      : event.location;

  return (
    <Link
      href={`/event-details/${event.event_id}`}
      className="flex md:items-center justify-center  hover:scale-105 transition-transform duration-300"
    >
      <div className="[filter:drop-shadow(0_6px_8px_rgba(0,0,0,0.2))] md:w-[25rem] w-[20rem] md:min-h-96">
        <div className="md:min-w-96 min-w-80 md:min-h-96 bg-white [clip-path:polygon(20px_0%,100%_0%,100%_calc(100%-20px),calc(100%-20px)_100%,0%_100%,0%_20px)] ">
          <div className="h-[30rem] flex flex-col justify-around">
            <div className="h-48">
              <img
                src={event.image_path}
                alt=""
                className="w-full h-full object-fill "
              />
            </div>

            <div className="p-2">
              <div className="flex items-center gap-4">
                <div className="text-xl">
                  <p className="text-[#3D37F1] font-bold">
                    {monthName.toUpperCase()}
                  </p>
                  <p className="text-3xl font-bold">{date}</p>
                </div>
                <h3 className="text-textPrimary text-lg ">{event.title}</h3>
              </div>
              <div className="flex flex-col gap-2">
                <p className="font-light text-gray-800">
                  We'll get you direct seated and inside for you to enjoy the
                  conference
                </p>

                <div className="flex items-center justify-start text-sm gap-2 ">
                  <div className="flex items-center justify-start gap-1">
                    <div className="text-[#1D4ED8]">
                      <Calendar size={13} />
                    </div>
                    <div>
                      <p className="text-gray-800 font-light">{dayName}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-start gap-1">
                    <div className="text-[#1D4ED8] ">
                      <Clock size={13} />
                    </div>
                    <div>
                      <p className="text-gray-800 font-light text-sm">
                        {startTime} - {endTime}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-start gap-1">
                    <div className="text-[#1D4ED8] ">
                      <MapPin size={13} />
                    </div>
                    <div>
                      <p className="text-gray-800 font-light text-sm wrap">
                        {shortLocation}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-2">
                  {event.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-block bg-[#DADEFF] text-[#1D4ED8] px-2 rounded-md text-sm mr-1 mb-1"
                    >
                      <div className="flex items-center justify-start">
                        <Dot />
                        {tag}
                      </div>
                    </span>
                  ))}
                </div>
              </div>

              <div className="border-t-2 border-gray-200 py-2 ">
                <div className="border-[#bdbbfb3d] flex items-center justify-between">
                  <div className="flex items-center gap-2 ">
                    <Armchair color={"#8570AD"} size={20} />
                    <p className="text-textSecondary text-sm">
                      {event.available_seats} Spot Left{" "}
                    </p>
                  </div>

                  <span className="text-textSecondary text-sm">
                    Total {event.total_seats} Seats
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
