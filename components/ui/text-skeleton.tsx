import { Card, Skeleton } from "@heroui/react";

interface TextSkeletonProps {
  className?: string;
  textClassName?: string;
  text?: string[];
  isLoading?: boolean;
}

export default function TextSkeleton({
  className = "w-60 h-60",
  textClassName = "text-sm text-default-700",
  text = [],
  isLoading = true,
}: TextSkeletonProps) {
  const defaultLines = 7;

  const formatBoldText = (text: string | undefined) => {
    if (typeof text !== "string") return text;

    return text.split(/(\*\*.*?\*\*)/).map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <Card className={`${className} space-y-5 p-4`} radius="lg">
      <div className="space-y-3 mt-5 overflow-auto max-h-52 scrollbar-hide">
        {isLoading
          ? Array(defaultLines)
              .fill(null)
              .map((_, index) => (
                <Skeleton
                  key={index}
                  className={`w-${index % 2 ? "4/5" : "2/5"} rounded-lg ${
                    text.length > 0 ? "opacity-60" : ""
                  }`}
                >
                  <div
                    className={`h-3 w-${
                      index % 2 ? "4/5" : "2/5"
                    } rounded-lg bg-default-${index % 2 ? "200" : "300"}`}
                  />
                </Skeleton>
              ))
          : text.map((line, index) => (
              <div key={index} className={textClassName}>
                {formatBoldText(line)}
              </div>
            ))}
      </div>
    </Card>
  );
}
