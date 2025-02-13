import React from 'react';
import { IoChevronBack } from "react-icons/io5";

interface HeaderProps {
  title: string;
  onBack: () => void;
  rightButton?: {
    text: string;
    onClick: () => void;
    disabled?: boolean;
  };
}

const Header: React.FC<HeaderProps> = ({ title, onBack, rightButton }) => {
  return (
    <div className="relative flex items-center h-14">
      <div className="w-full px-4 flex items-center justify-center">
        <button 
          onClick={onBack} 
          className="absolute left-4"
          aria-label="뒤로가기"
        >
          <IoChevronBack className="w-6 h-6" />
        </button>
        <h1 className="text-[20px] font-bold">{title}</h1>
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