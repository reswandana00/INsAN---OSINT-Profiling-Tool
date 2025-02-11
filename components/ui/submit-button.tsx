"use client";

import { useRouter } from "next/navigation";
import ButtonMagic from "./button-border-magic";

interface SubmitButtonProps {
  onSubmit?: () => Promise<void>;
  isLoading?: boolean;
}

export default function SubmitButton({
  onSubmit,
  isLoading = false,
}: SubmitButtonProps) {
  const router = useRouter();

  const handleClick = async () => {
    if (onSubmit) {
      await onSubmit();
    }
    router.push("/dashboard");
  };

  return (
    <ButtonMagic
      text={isLoading ? "Processing..." : "Submit"}
      onClick={handleClick}
      disabled={isLoading}
    />
  );
}
