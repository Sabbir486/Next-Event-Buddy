"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { getToken, singOut } from "@/utilities/jwt-operation";
import { useUser } from "@/context/user-context";
import SetLoading from "@/components/set-loading";
import { toast } from "react-toastify";
import { format, parseISO } from "date-fns";
import { Eye, SquarePen, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import EventForm from "./event-form";

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
  tags?: string;
  image_path: string;
};

const AdminDashboard = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [events, setEvents] = useState<EventType[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventType | null>(null);
  const { user, setUser, setLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated && !user) {
      router.push("/signin");
    }
  }, [isHydrated, user, router]);

  const fetchEvents = async () => {
    const token = await getToken();

    if (!token || !user || user.role !== "Admin") {
      setUser(null);
      await singOut();
      router.push("/signin");
      return;
    }

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_LOCALHOST}/event`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEvents(response.data);
    } catch (error: any) {
      console.error("Error fetching events:", error);
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
      setCheckingAuth(false);
    }
  };

  useEffect(() => {
    if (isHydrated && user?.role === "Admin") {
      fetchEvents();
    }
  }, [isHydrated, user]);

  const handleEditClick = (event: EventType) => {
    setEditingEvent(event);
    setShowModal(true);
  };

  const handleCreateClick = () => {
    setEditingEvent(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingEvent(null);
  };

  const handleFormSubmit = async (formData: any) => {
    const token = await getToken();

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("date", formData.date);
      data.append("start_time", formData.start_time);
      data.append("end_time", formData.end_time);
      data.append("description", formData.description);
      data.append("location", formData.location);
      data.append("total_seats", formData.total_seats.toString());
      data.append("available_seats", formData.available_seats.toString());
      data.append("total_booked", formData.total_booked.toString());
      data.append("tags", JSON.stringify(formData.tags));

      if (formData.image instanceof File) {
        const imageData = new FormData();
        imageData.append("image", formData.image);

        const imageResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_LOCALHOST}/event/upload-image`,
          imageData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        data.append("image_url", imageResponse.data.imageName);
      } else if (formData.image) {
        data.append("image_path", formData.image);
      }

      const payload = {
        title: formData.title,
        date: formData.date,
        start_time: formData.start_time,
        end_time: formData.end_time,
        description: formData.description,
        location: formData.location,
        total_seats: Number(formData.total_seats),
        available_seats: Number(formData.available_seats),
        total_booked: Number(formData.total_booked),
        tags: formData.tags,
        image_url: data.get("image_url"),
      };

      for (const pair of data.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }

      if (editingEvent) {
        console.log("Creating new event with data:", payload);
        await axios.patch(
          `${process.env.NEXT_PUBLIC_LOCALHOST}/event/update/${editingEvent.event_id}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success("Event updated!");
      } else {
        console.log("Creating new event with data:", payload);
        await axios.post(
          `${process.env.NEXT_PUBLIC_LOCALHOST}/event/create`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success("Event created!");
      }

      handleCloseModal();
      fetchEvents();
    } catch (error: any) {
      console.error("Error submitting event:", error.message);
      toast.error("Failed to save event");
    }
  };

  const handleEyeClick = (event_id: number) => {
    router.push(`/event-details/${event_id}`);
  };

  const handleDeleteClick = async (eventId: number) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this event?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      const token = await getToken();
      try {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_LOCALHOST}/event/delete/${eventId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setEvents((prevEvents) =>
          prevEvents.filter((event) => event.event_id !== eventId)
        );

        toast.success("Event deleted successfully!");
      } catch (error: any) {
        console.error("Delete failed:", error);
        toast.error("Failed to delete event");
      }
    }
  };

  if (!isHydrated || checkingAuth) return <SetLoading />;

  return (
    <div className="bg-primary min-h-screen relative">
      <div className="container mx-auto p-4">
        <div>
          <h1 className="text-textPrimary text-2xl md:3xl">Admin Dashboard</h1>
          <p className="text-textSecondary pb-12">
            Manage events, view registrations, and monitor your platform.
          </p>
        </div>

        <div className="flex justify-between items-center pb-4">
          <h2 className="text-textPrimary text-lg">Events Management</h2>
          <button
            onClick={handleCreateClick}
            className="px-4 py-2 bg-gradient-to-t from-btnPrimaryStart to-btnPrimaryEnd rounded-lg text-white hover:cursor-pointer hover:from-btnPrimaryEnd hover:to-btnPrimaryStart"
          >
            Create Event
          </button>
        </div>

        <div className="overflow-x-auto rounded-xl">
          <table className="w-full border-collapse overflow-hidden">
            <thead className="bg-white text-left text-textPrimary text-sm border-b">
              <tr className="bg-white">
                <th className="p-3">Title</th>
                <th className="p-3">Date</th>
                <th className="p-3">Location</th>
                <th className="p-3">Registrations</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white text-sm">
              {events.map((event) => (
                <tr
                  key={event.event_id}
                  className="border-b hover:bg-gray-50 transition-all duration-200"
                >
                  <td className="p-3">{event.title}</td>
                  <td className="p-3">
                    {format(parseISO(event.date), "EEE, dd MMM yyyy")}
                  </td>
                  <td className="p-3">{event.location}</td>
                  <td className="p-3">
                    {event.total_seats - event.available_seats}/
                    {event.total_seats}
                  </td>
                  <td className="p-3 flex gap-4 justify-center items-center">
                    <button
                      className="text-textPrimary hover:text-blue-700"
                      onClick={() => handleEyeClick(event.event_id)}
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      className="text-textPrimary hover:text-blue-700"
                      onClick={() => handleEditClick(event)}
                    >
                      <SquarePen size={18} />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleDeleteClick(event.event_id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <EventForm
          mode={editingEvent ? "edit" : "create"}
          initialData={editingEvent || undefined}
          onClose={handleCloseModal}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
