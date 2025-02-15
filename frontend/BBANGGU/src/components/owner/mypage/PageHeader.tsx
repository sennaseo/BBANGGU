import { Bell } from 'lucide-react';

export function PageHeader() {
  return (
    <div className="flex justify-between items-center px-6 h-14">
      <h1 className="text-lg font-medium">마이페이지</h1>
      <button className="p-2">
        <Bell className="w-6 h-6" />
      </button>
    </div>
  );
} 
