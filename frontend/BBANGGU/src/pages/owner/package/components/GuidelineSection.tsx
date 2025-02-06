import React from 'react';

interface GuidelineItemProps {
  number: number;
  text: string;
}

const GuidelineItem: React.FC<GuidelineItemProps> = ({ number, text }) => (
  <div className="flex items-center gap-3">
    <div className="w-6 h-6 rounded-full bg-[#FC973B] flex items-center justify-center text-white">
      {number}
    </div>
    <p className="text-gray-700">{text}</p>
  </div>
);

const GuidelineSection: React.FC = () => {
  const guidelines = [
    "빵을 트레이에 잘 정렬해주세요",
    "빵이 겹치지 않도록 간격을 두세요",
    "전체 트레이가 잘 보이게 촬영해주세요"
  ];

  return (
    <div className="mt-6 space-y-4 pl-4">
      {guidelines.map((text, index) => (
        <GuidelineItem 
          key={index} 
          number={index + 1} 
          text={text}
        />
      ))}
    </div>
  );
};

export default GuidelineSection;