import { ReactNode } from "react";

export default function BaseContainer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`h-full w-1/5 rounded-lg border p-4 border-gray-300 ${
        className ?? ""
      }`}
    >
      {children}
    </div>
  );
}
