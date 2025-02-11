"use client";

import { Toilet } from "lucide-react";
import { useRouter } from "next/navigation";

export default function FlushButton() {
  const router = useRouter();

  const handleFlush = async () => {
    const response = await fetch("/api/dirDelete", {
      method: "POST",
    });
    const result = await response.json();

    if (result.success) {
      router.refresh();
    }
  };

  return (
    <button
      onClick={handleFlush}
      className="p-2 rounded-full hover:bg-stone-900 transition-colors duration-200 relative group"
      aria-label="Flush data"
    >
      <Toilet className="w-6 h-6 text-red-500 hover:text-white duration-200" />
      <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 -mt-2 rounded text-sm opacity-0 group-hover:opacity-80 transition-opacity duration-200 whitespace-nowrap">
        Flush
      </span>
    </button>
  );
}
