"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Megaphone } from "lucide-react";
import { useVibeStore, type ContentType } from "@/stores/vibe-store";

interface VibeQuickButtonProps {
  contentType: ContentType;
  rawInput: string;
  label?: string;
  variant?: "outline" | "ghost";
  size?: "sm" | "default";
  className?: string;
}

export function VibeQuickButton({
  contentType,
  rawInput,
  label = "分享成就",
  variant = "outline",
  size = "sm",
  className,
}: VibeQuickButtonProps) {
  const router = useRouter();
  const { setResults, setContentType, setRawInput, setPrefilled } =
    useVibeStore();

  const handleClick = () => {
    setResults([]);
    setContentType(contentType);
    setRawInput(rawInput);
    setPrefilled(true);
    router.push("/vibe");
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      className={className}
    >
      <Megaphone className="h-4 w-4 mr-1.5" />
      {label}
    </Button>
  );
}
