import { ReactNode } from 'react';

interface MobileLayoutProps {
  children: ReactNode;
}

function MobileLayout({ children }: MobileLayoutProps) {
  return (
    <div className="w-full min-h-screen bg-gray-100 font-['Pretendard']">
      <div className="mx-auto min-h-screen min-w-[300px] max-w-[440px] overflow-x-hidden bg-white">
        {children}
      </div>
    </div>
  );
}

export default MobileLayout;