"use client";

import { useRouter } from "next/navigation";
import ButtonMagic from "./button-border-magic";

export default function DashboardButton() {
  const router = useRouter();

  return (
    <ButtonMagic text="Get Started" onClick={() => router.push("/dashboard")} />
  );
}
