import React from 'react';

const SDLogo = ({ className = "w-12 h-12" }) => {
  return (
    <div className={`${className} bg-black rounded-lg flex items-center justify-center`}>
      <span className="text-red-500 font-bold text-2xl">SD</span>
    </div>
  );
};

export default SDLogo;
