import React from "react";
import { ArrowRight } from "lucide-react";

interface ButtonMagicProps {
  text: string;
  onClick?: () => void;
}

const ButtonMagic = ({ text, onClick }: ButtonMagicProps) => {
  return (
    <button
      onClick={onClick}
      className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-red-100-50"
    >
      <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#FF9999_0%,#FF0000_50%,#FF9999_100%)] opacity-70" />

      <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-6 py-1 text-sm font-medium text-white backdrop-blur-3xl gap-2 opca">
        {text}
        <ArrowRight className="w-4 h-4" />
      </span>
    </button>
  );
};

export default ButtonMagic;
