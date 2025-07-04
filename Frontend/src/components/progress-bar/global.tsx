import React from 'react';
import { useSSE } from '../../provider/context/SSEContext';

const GlobalProgressBar: React.FC = () => {
  const { progress, isProcessing } = useSSE();

  if (!isProcessing) return null;

  return (
    <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-gray-200">
      <div 
        className="bg-[#765CDE] h-full transition-all duration-300"
        style={{ width: `${progress.percentage}%` }}
      />
      <div className="absolute top-1 left-2 text-xs text-gray-800">
        {progress.message} ({progress.percentage}%)
      </div>
    </div>
  );
};

export default GlobalProgressBar;