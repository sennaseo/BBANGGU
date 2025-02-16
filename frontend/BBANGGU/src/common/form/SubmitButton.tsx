interface SubmitButtonProps {
  text: string | JSX.Element;
  className?: string;
  onClick?: () => void;
  type?: 'submit' | 'button';
}

export function SubmitButton({ text, className = '', onClick, type = 'submit' }: SubmitButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`w-full py-3 bg-[#FF9B50] text-white rounded-[8px] hover:bg-[#FF8B3D] ${className}`}
    >
      {text}
    </button>
  );
}
