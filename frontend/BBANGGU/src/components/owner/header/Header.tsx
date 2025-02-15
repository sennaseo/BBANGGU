import React from 'react';
import { IoChevronBack } from "react-icons/io5";

interface HeaderProps {
  title: string;
  onBack?: () => void;
  className?: string;
  textColor?: string;
  rightButton?: {
    text: string;
    onClick: () => void;
    disabled?: boolean;
  };
}

const Header: React.FC<HeaderProps> = ({ 
  title, 
  onBack, 
  className,
  textColor = 'text-black',
  rightButton
}) => {
  return (
    <div className={`relative flex items-center h-14 ${className}`}>
      <div className="w-full px-4 flex items-center justify-center">
        {onBack && (
          <button 
            onClick={onBack} 
            className={`absolute left-4 ${textColor}`}
            aria-label="뒤로가기"
          >
            <IoChevronBack className="w-6 h-6" />
          </button>
        )}
        <h1 className={`text-[20px] font-bold flex-1 text-center ${textColor}`}>{title}</h1>
        {rightButton && (
          <button
            onClick={rightButton.onClick}
            disabled={rightButton.disabled}
            className={`absolute right-4 px-2 font-medium transition-colors
              ${rightButton.disabled 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-[#FC973B] hover:text-[#e88934]'
              }`}
          >
            {rightButton.text}
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;