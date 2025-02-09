interface SubmitButtonProps {
    text: string | JSX.Element;
    disabled?: boolean;
    className?: string;
    onClick?: () => void;
    type?: 'submit' | 'button';
  }
  
  export function SubmitButton({ 
    text, 
    disabled = false,
    className = '',
    onClick,
    type = 'submit'
  }: SubmitButtonProps) {
    return (
      <button
        type={type}
        disabled={disabled}
        onClick={onClick}
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