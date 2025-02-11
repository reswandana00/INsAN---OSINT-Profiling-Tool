"use client";

import { useWebSocket } from "@/app/api/WebSocketContext";
import ButtonInput from "@/components/ui/button-morph-input";
import SubmitButton from "@/components/ui/submit-button";
import { InstagramIcon, LinkedinIcon } from "lucide-react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import FlushButton from "./ui/flush-button";

export default function Form() {
  const [instagramUsername, setInstagramUsername] = useState("");
  const [linkedinUsername, setLinkedinUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { socket } = useWebSocket();

  // Inside Form component, add a useEffect to listen for WebSocket messages

  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        if (event.data === "Analysis Complete") {
          window.location.reload();
        }
      };
    }
  }, [socket]);

  const isFormValid =
    instagramUsername.trim() !== "" || linkedinUsername.trim() !== "";

  const handleSubmit = async () => {
    if (!isFormValid) {
      toast.error("Please enter at least one username");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: instagramUsername }),
      });
      const data = await response.json();
      console.log("Scraping result:", data);

      if (data.success) {
        localStorage.setItem("lastUsername", instagramUsername);
        if (socket && socket.readyState === WebSocket.OPEN) {
          socket.send(instagramUsername);
          socket.send("Scraping Finish");
          socket.send("Analyzing...");
        }
        window.location.reload();
      } else {
        toast.error(`Profile ${instagramUsername} not found`);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="lg:flex lg:justify-between lg:px-20 lg:mt-20">
        <div className="flex flex-col">
          <div className="font-extrabold text-3xl md:text-4xl lg:text-4xl leading-relaxed">
            <div>
              Who Are You Looking For?
              <br />
              <span className="text-red-600">INsAN</span> Simplified
            </div>
          </div>
          <div className="mt-16">
            <ButtonInput
              icon={<InstagramIcon />}
              onUsernameSubmit={setInstagramUsername}
            />
          </div>
          <div className="mt-3">
            <ButtonInput
              icon={<LinkedinIcon />}
              onUsernameSubmit={setLinkedinUsername}
            />
          </div>
          <div className="flex-row flex gap-5 mt-10">
            <div className="">
              <SubmitButton
                onSubmit={() => handleSubmit()}
                isLoading={isLoading}
              />
            </div>
            <div className="mt-1">
              <FlushButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
