"use client";

import { CloudUpload } from "lucide-react";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

type Event = {
  onClose: () => void;
  onSubmit: (eventData: any) => void;
  mode: "create" | "edit";
  initialData?: any;
};

const EventForm = ({ onClose, onSubmit, mode, initialData }: Event) => {
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    start_time: "",
    end_time: "",
    description: "",
    location: "",
    total_seats: 0,
    available_seats: 0,
    total_booked: 0,
    tags: "",
    image: null as File | string | null,
  });

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setFormData({
        title: initialData.title || "",
        date: initialData.date || "",
        start_time: initialData.start_time?.slice(0, 5) || "",
        end_time: initialData.end_time?.slice(0, 5) || "",
        description: initialData.description || "",
        location: initialData.location || "",
        total_seats: initialData.total_seats || 0,
        available_seats: initialData.available_seats || 0,
        total_booked: initialData.total_booked || 0,
        tags: (initialData.tags || []).join(", "),
        image: initialData.image_path || null,
      });
    }
  }, [initialData, mode]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size exceeds 5MB limit");
        return;
      }
      if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
        toast.error("Invalid file format. Only JPG, JPEG, or PNG allowed.");
        return;
      }
      setFormData((prev) => ({ ...prev, image: file }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const finalPayload = {
      title: formData.title,
      date: formData.date,
      start_time: formData.start_time + ":00",
      end_time: formData.end_time + ":00",
      description: formData.description,
      location: formData.location,
      total_seats: Number(formData.total_seats),
      available_seats:
        mode === "edit" && initialData
          ? initialData.available_seats
          : Number(formData.total_seats),
      total_booked:
        mode === "edit" && initialData ? initialData.total_booked : 0,
      image: formData.image,
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    };

    onSubmit(finalPayload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-40 p-2 sm:p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl p-4 sm:p-6 mt-10 shadow-lg overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb joh-4">
          <h2 className="text-xl sm:text-2xl font-semibold text-textPrimary">
            {mode === "edit" ? "Edit Event" : "Create New Event"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>

          <label className="block font-medium text-textPrimary mb-1">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            required
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 mb-3"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
            <div>
              <label className="block font-medium text-textPrimary mb-1">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                required
                onChange={handleChange}
                className="w-full border p-2 rounded appearance-none custom-date-picker"
              />
            </div>
            <div>
              <label className="block font-medium text-textPrimary mb-1">
                Start Time - End Time
              </label>
              <div className="flex gap-2">
                <input
                  type="time"
                  name="start_time"
                  value={formData.start_time}
                  required
                  onChange={handleChange}
                  className="w-full border p-2 rounded appearance-none custom-date-picker"
                />
                <input
                  type="time"
                  name="end_time"
                  value={formData.end_time}
                  onChange={handleChange}
                  className="w-full border p-2 rounded appearance-none custom-date-picker"
                />
              </div>
            </div>
          </div>

          <div className="mb-3">
            <label className="block font-medium text-textPrimary mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
            <div>
              <label className="block font-medium text-textPrimary mb-1">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label className="block font-medium text-textPrimary mb-1">
                Capacity
              </label>
              <input
                type="number"
                name="total_seats"
                min={1}
                required
                placeholder=" "
                value={formData.total_seats}
                onChange={handleChange}
                className="w-full border p-2 rounded "
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="block font-medium text-textPrimary mb-1">
              Tags (comma separated)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          <div className="mb-3">
            <label className="block	va-block font-medium text-textPrimary mb-2">
              Image
            </label>
            <div className="relative w-full border-2 border-dashed border-gray-300 rounded-lg bg-white py-6 px-4 text-center hover:bg-gray-50">
              <input
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex items-center justify-center gap-4">
                <CloudUpload className="w-10 h-10 text-gray-400" />
                <div className="text-sm text-gray-600">
                  {formData.image ? (
                    typeof formData.image === "string" ? (
                      <div className="flex flex-col items-center">
                        <img
                          src={formData.image}
                          alt="Current Event"
                          className="w-40 rounded shadow mt-2"
                        />
                        <p className="text-xs mt-1 text-gray-500">
                          Current image
                        </p>
                      </div>
                    ) : (
                      <p>✅ Selected: {(formData.image as File).name}</p>
                    )
                  ) : (
                    <>
                      <p>
                        Drag or{" "}
                        <span className="text-blue-500 underline">upload</span>{" "}
                        an image
                      </p>
                      <p className="text-gray-400 text-xs">
                        Max 5MB | JPG, PNG
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="text-gray-500">
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {mode === "edit" ? "Update" : "Create Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm;
