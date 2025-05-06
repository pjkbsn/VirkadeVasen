"use client";

import { useAuthStore } from "@/store/auth-store";
import { useEffect, useState } from "react";

export const SuccessMessage = () => {
  const { success, setSuccess } = useAuthStore();
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    if (success) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(() => {
          setSuccess(null);
        }, 300);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [success, setSuccess]);

  if (!success) return null;

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <svg
          className="w-16 h-16 text-green-500 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
        <p className="text-xl font-medium">{success}</p>
      </div>
    </div>
  );
};
