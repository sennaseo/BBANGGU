import { useNavigate } from 'react-router-dom';
import { IoChevronBack } from "react-icons/io5";

interface HeaderProps {
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="relative flex items-center h-14">
      <div className="w-full px-4 flex items-center justify-center">
        <button 
          onClick={handleBack} 
          className="absolute left-4"
        >
          <IoChevronBack className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-medium">{title}</h1>
      </div>
    </div>
  );
};

export function ProfileForm() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // 여기에 폼 제출 로직을 추가하세요
  };

  return (
    <form onSubmit={handleSubmit} className="px-4 space-y-6">
      {/* ... 나머지 코드 ... */}
    </form>
  );
}