import type React from "react"

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  actionButton?: React.ReactNode
}

export function InputField({ label, actionButton, className = "", ...props }: InputFieldProps) {
  return (
    <div className="space-y-2">
      <label className="block text-[15px] font-medium">{label}</label>
      <div className="relative">
        <input
          className={`w-full h-[52px] px-4 rounded-xl border border-gray-200 focus:border-[#FF9F43] outline-none text-[15px] placeholder:text-gray-400 ${
            actionButton ? "pr-[100px]" : ""
          } ${className}`}
          {...props}
        />
        {actionButton && <div className="absolute right-[6px] top-1/2 -translate-y-1/2">{actionButton}</div>}
      </div>
    </div>
  )
}