import { ReactNode } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function Button({
  children,
  onClick,
  className,
  loading = false,
}: {
  children: ReactNode;
  onClick: () => void;
  className?: string;
  loading?: boolean;
}) {
  return (
    <button
      className={`rounded-lg bg-black w-full text-white px-2 py-3 flex flex-row justify-center ${
        className ?? ""
      }`}
      onClick={onClick}
      disabled={loading}
    >
      {loading ? (
        <AiOutlineLoading3Quarters className="animate-spin text-center text-[24px] text-white" />
      ) : (
        children
      )}
    </button>
  );
}
