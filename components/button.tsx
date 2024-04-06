import Spinner from "@/components/spinner";
import { MouseEvent, ReactNode } from "react";

export type ButtonType = "primary" | "secondary" | "highlighted";
export type ButtonSize = "small" | "medium" | "rectangular";
export interface ButtonProps {
  children: ReactNode;
  type?: ButtonType;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  isSubmit?: boolean;
  form?: string;
  disableTransition?: boolean;
  onClick?(event: MouseEvent<HTMLButtonElement>): void;
}

export default function Button({
  children = "",
  type = "primary",
  size = "medium",
  loading = false,
  disabled = false,
  disableTransition = false,
  isSubmit,
  form,
  onClick,
  className,
}: ButtonProps) {
  const typeClasses = getButtonTypeClasses(type);
  const sizeClasses = getButtonSizeClasses(size);
  const transitionClasses = disableTransition ? null : "hover:bg-opacity-90";
  const stateClasses =
    "disabled:bg-gray-200 disabled:border-gray-200 disabled:text-gray-400";
  const loadingClasses = loading && "pointer-events-none";
  const classes = `${typeClasses} ${sizeClasses} ${stateClasses} ${transitionClasses} ${loadingClasses}`;
  const loaderMarkup = loading ? (
    <div
      className={`absolute top-0 left-0 w-full h-full flex justify-center items-center ${classes}`}
    >
      <Spinner />
    </div>
  ) : null;

  return (
    <button
      className={`relative flex justify-center items-center flex-nowrap gap-2 rounded-[32px] font-medium overflow-hidden whitespace-nowrap border ${classes} ${className}`}
      disabled={disabled}
      onClick={onClick}
      type={isSubmit ? "submit" : "button"}
      form={form}
    >
      {children}
      {loaderMarkup}
    </button>
  );
}

function getButtonTypeClasses(type: ButtonType): string {
  switch (type) {
    case "secondary":
      return "text-black bg-white border-black";
    case "highlighted":
      return "bg-lime-500 text-white border-gray-900";
    case "primary":
    default:
      return "text-white bg-gray-900 border-purple-400";
  }
}

function getButtonSizeClasses(size: ButtonSize): string {
  switch (size) {
    case "rectangular":
      return "p-2 max-w-[40px] max-h-[40px]";
    case "small":
      return "px-3 py-2 max-h-[40px]";
    case "medium":
    default:
      return "px-4 py-4 max-h-[56px]";
  }
}
