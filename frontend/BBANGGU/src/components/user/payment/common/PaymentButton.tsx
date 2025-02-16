interface PaymentButtonProps {
  onClick: () => void;
  text: string;
}

export default function PaymentButton({ onClick, text }: PaymentButtonProps) {
  return (
    <div className="fixed bottom-0 w-full bg-white py-4 border-t border-gray-200 max-w-[440px]">
      <div className="w-full px-[20px]">
        <button
          onClick={onClick}
          className="w-full rounded-xl bg-orange-400 py-[15px] text-center font-bold text-white transition-colors hover:bg-orange-500 text-[14px]"
        >
          {text}
        </button>
      </div>
    </div>
  )
}