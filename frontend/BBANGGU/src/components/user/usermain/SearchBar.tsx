import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative h-[65px] z-10">
      <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#FC973B] w-5 h-5" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="찾고 있는 빵집이 있으신가요?"
        className="w-full h-full pl-12 pr-14 rounded-[12px] bg-[#F9F9F9] text-[#333333] text-[16px] ring-1 ring-[#EBEBEB] placeholder:text-[#D2D2D2] font-[100] focus:outline-none focus:ring-2 focus:ring-[#fc973b]"
      />
    </div>
  )
}

