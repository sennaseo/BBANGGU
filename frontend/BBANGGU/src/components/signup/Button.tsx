import type React from "react"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary"
  fullWidth?: boolean
  size?: "default" | "small"
  children: React.ReactNode
}

export function Button({
  variant = "primary",
  size = "default",
  fullWidth = true,
  className = "",
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        font-medium transition-colors
        ${fullWidth ? "w-full" : ""}
        ${size === "small" ? "h-[32px] text-sm" : "h-[40px]"}
        ${
          variant === "primary"
            ? `rounded-2xl ${
                disabled ? "bg-[#D9D9D9] text-white cursor-not-allowed" : "bg-[#FF9F43] text-white hover:bg-[#ff9029]"
              }`
            : `${
                disabled
                  ? "bg-[#D9D9D9] text-white cursor-not-allowed"
                  : "bg-white text-[#FF9F43] border border-[#FF9F43]"
              }`
        }
        ${className}
      `}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

