import { ReactNode } from "react";

export default function Button({
  children,
  onClick,
  className,
}: {
  children: ReactNode;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      className={`rounded-lg bg-black w-full text-white px-2 py-3 ${className ?? ''}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
