import React from 'react';
import breadLoading from '../../../dist/bakery/cat.gif';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="w-[120px] h-[120px] rounded-full overflow-hidden border-4 border-[#FFF5EC] shadow-lg">
        <img 
          src={breadLoading} 
          alt="loading" 
          className="w-full h-full object-contain bg-white p-2"
        />
      </div>
    </div>
  );
};

export default LoadingSpinner; 