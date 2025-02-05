import React from 'react';
import { IoChevronBack } from "react-icons/io5";

interface HeaderProps {
  title: string;
  onBack: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onBack }) => {
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
      </div>
    </div>
  );
};

export default Header;