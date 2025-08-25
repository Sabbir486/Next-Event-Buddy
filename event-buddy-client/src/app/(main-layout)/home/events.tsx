"use client";

import React, { useEffect, useRef, useState } from "react";
import EventCard from "./event-card";
import axios from "axios";

type EventType = {
  event_id: number;
  title: string;
  date: string;
  location: string;
  total_seats: number;
  available_seats: number;
  start_time: string;
  end_time: string;
  description?: string;
  tags: [];
  image_path: string;
};

const EVENTS_PER_PAGE = 6;
const PREVIOUS_PER_PAGE = 3;

const Events = () => {
  const [events, setEvents] = useState<EventType[]>([]);
  const [previousEvents, setPreviousEvents] = useState<EventType[]>([]);
  const [eventPage, setEventPage] = useState(1);
  const [prevEventPage, setPrevEventPage] = useState(1);

  const upcomingRef = useRef<HTMLDivElement>(null);
  const previousRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_LOCALHOST}/event`
        );

        const data: EventType[] = response.data;

        const now = new Date();

        const upcoming = data.filter(
          (event: EventType) => new Date(event.date) >= now
        );
        const previous = data.filter(
          (event: EventType) => new Date(event.date) < now
        );

        setEvents(upcoming);
        setPreviousEvents(previous);
      } catch (error) {}
    };

    fetchData();
  }, []);

  const totalEventPages = Math.ceil(events.length / EVENTS_PER_PAGE);
  const totalPrevPages = Math.ceil(previousEvents.length / PREVIOUS_PER_PAGE);

  const paginatedEvents = events.slice(
    (eventPage - 1) * EVENTS_PER_PAGE,
    eventPage * EVENTS_PER_PAGE
  );

  const paginatedPrevious = previousEvents.slice(
    (prevEventPage - 1) * PREVIOUS_PER_PAGE,
    prevEventPage * PREVIOUS_PER_PAGE
  );

  const handleUpcomingPageChange = (page: number) => {
    setEventPage(page);
    upcomingRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handlePreviousPageChange = (page: number) => {
    setPrevEventPage(page);
    previousRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-primary pb-24 pt-5">
      <div className="container mx-auto">
        <h1 className="text-3xl font-semibold text-textPrimary mb-6 md:pl-6 pl-2">
          Upcoming Events
        </h1>

        <div
          ref={upcomingRef}
          className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:flex md:flex-wrap justify-around"
        >
          {paginatedEvents.map((event) => (
            <EventCard key={event.event_id} event={event} />
          ))}
        </div>

        {totalEventPages > 1 && (
          <div className="flex justify-center mt-6 gap-2">
            {Array.from({ length: totalEventPages }, (_, i) => (
              <button
                key={i}
                onClick={() => handleUpcomingPageChange(i + 1)}
                className={`w-9 h-9 rounded-md text-sm font-medium flex items-center justify-center transition ${
                  eventPage === i + 1
                    ? "bg-[#5c5cde] text-white"
                    : "bg-white border border-[#ddd] text-[#2a235e] hover:bg-[#f0f0ff]"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}

        {previousEvents.length > 0 && (
          <>
            <h2 className="text-2xl font-bold text-[#2a235e] mt-10 md:pl-6">
              Previous Events
            </h2>
            <div
              ref={previousRef}
              className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:flex md:flex-wrap justify-around"
            >
              {paginatedPrevious.map((event) => (
                <EventCard key={event.event_id} event={event} />
              ))}
            </div>

            {totalPrevPages > 1 && (
              <div className="flex justify-center mt-6 gap-2">
                {Array.from({ length: totalPrevPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePreviousPageChange(i + 1)}
                    className={`w-9 h-9 rounded-md text-sm font-medium flex items-center justify-center transition ${
                      prevEventPage === i + 1
                        ? "bg-[#5c5cde] text-white"
                        : "bg-white border border-[#ddd] text-[#2a235e] hover:bg-[#f0f0ff]"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Events;
