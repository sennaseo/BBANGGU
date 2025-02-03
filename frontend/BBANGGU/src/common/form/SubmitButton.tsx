interface SubmitButtonProps {
    text: string;
    disabled?: boolean;
    className?: string;
  }
  
  export function SubmitButton({ 
    text, 
    disabled = false,
    className = ''
  }: SubmitButtonProps) {
    return (
      <button
        type="submit"
        disabled={disabled}
        className={`
          w-full py-4 rounded-[8px] 
          ${disabled 
            ? 'bg-[#D7C5B5] cursor-not-allowed' 
            : 'bg-[#FC973B] hover:bg-[#FF9B50]'
          } 
          text-white
          ${className}
        `}
      >
        {text}
      </button>
    );
  }