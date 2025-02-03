import { Bell } from 'lucide-react';

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  return (
    <div className="flex justify-between items-center px-6 h-14">
      <h1 className="text-lg font-medium">{title}</h1>
      <button className="p-2">
        <Bell className="w-6 h-6" />
      </button>
    </div>
  );
}