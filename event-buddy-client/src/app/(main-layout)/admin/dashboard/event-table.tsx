"use client";

import React from "react";
import { Eye, SquarePen, Trash2 } from "lucide-react";
import { format, parseISO } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/router";

type Event = {
  event: {
    event_id: number;
    title: string;
    date: string;
    location: string;
    total_seats: number;
    available_seats: number;
  };
};

const EventTable = ({ event }: Event) => {
  const { title, date, location, total_seats, available_seats } = event;
  const formattedDate = format(parseISO(date), "EEEE, dd MMM, yyyy");

  return (
    <tr className="border-b hover:bg-gray-50 transition-all duration-200">
      <td className="p-3 whitespace-nowrap">{title}</td>
      <td className="p-3 whitespace-nowrap">{formattedDate}</td>
      <td className="p-3 whitespace-nowrap">{location}</td>
      <td className="p-3 whitespace-nowrap">
        {total_seats - available_seats}/{total_seats}
      </td>
      <td className="p-3 whitespace-nowrap flex gap-4 justify-center items-center">
        <button className="text-textPrimary hover:text-blue-700">
          <Eye size={18} />
        </button>
        <button className="text-textPrimary hover:text-blue-700">
          <SquarePen size={18} />
        </button>
        <button className="text-red-600 hover:text-red-800">
          <Trash2 size={18} />
        </button>
      </td>
    </tr>
  );
};

export default EventTable;
