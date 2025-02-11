"use client";

import React, { ReactNode, useState, useRef, useEffect } from "react";

interface ButtonInputProps {
  icon?: ReactNode;
  placeholder?: string;
  onUsernameSubmit: (username: string) => void;
}

const ButtonInput = ({
  icon,
  placeholder = "Enter Username...",
  onUsernameSubmit,
}: ButtonInputProps) => {
  const [isActive, setIsActive] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [storedValue, setStoredValue] = useState("");
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        if (!isSubmitted) {
          setIsActive(false);
          setInputValue("");
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSubmitted]);

  const handleSubmit = () => {
    if (inputValue) {
      setIsSubmitted(true);
      setStoredValue(inputValue);
      onUsernameSubmit(inputValue);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    if (newValue === "") {
      setIsSubmitted(false);
      setStoredValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div ref={buttonRef} className="flex items-center gap-2">
      <button
        onClick={() => setIsActive(true)}
        className={`bg-slate-800 no-underline group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-full p-px text-base font-normal leading-6 text-white inline-block transition-all duration-300 hover:scale-105 ${
          isActive ? "w-[200px]" : "w-auto"
        }`}
      >
        <span className="absolute inset-0 overflow-hidden rounded-full">
          <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </span>
        <div
          className={`relative flex items-center z-10 rounded-full bg-zinc-950 py-3 px-4 ring-1 ring-white/10 transition-all duration-300 ${
            isActive ? "justify-start" : "justify-center"
          }`}
        >
          {!isActive && icon && <div className="mr-2 w-6 h-6">{icon}</div>}
          {!isActive ? (
            <svg
              fill="none"
              height="24"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 6V18M6 12H18"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              />
            </svg>
          ) : (
            <input
              type="email"
              placeholder={placeholder}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="bg-transparent outline-none w-full text-white"
            />
          )}
        </div>
        <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-red-400/0 via-red-400/90 to-red-400/0 transition-opacity duration-500 group-hover:opacity-40" />
      </button>
      {isActive && (
        <button
          onClick={handleSubmit}
          disabled={!inputValue}
          className={`w-8 h-8 transition-all duration-300 ${
            inputValue
              ? "opacity-25 hover:opacity-100 hover:scale-110 cursor-pointer"
              : "opacity-10 cursor-not-allowed"
          }`}
        >
          {isSubmitted ? (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="w-full h-full"
            >
              <path
                d="M20 6L9 17L4 12"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="w-full h-full"
            >
              <path
                d="M12 6V18M6 12H18"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
      )}
    </div>
  );
};

export default ButtonInput;
