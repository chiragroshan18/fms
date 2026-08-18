import React from 'react';

export const Logo = ({ size = 'md', className = '' }) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className={`flex items-center gap-3 font-bold ${className}`}>
      <div className={`${iconSizes[size]} rounded-xl bg-gradient-to-br from-brand-400 to-brand-700 p-0.5 shadow-glow-blue flex items-center justify-center relative overflow-hidden group`}>
        <div className="absolute inset-0 bg-white/20 backdrop-blur-xs rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <svg viewBox="0 0 100 100" className="w-full h-full p-1.5" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M28 32H72M28 50H58M28 68H44" stroke="white" strokeWidth="9" strokeLinecap="round" />
          <circle cx="68" cy="65" r="9" fill="#36a9f7" stroke="white" strokeWidth="3" />
          <path d="M64 65L67 68L73 62" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="flex flex-col">
        <span className={`${textSizes[size]} tracking-tight bg-gradient-to-r from-white via-slate-100 to-brand-300 bg-clip-text text-transparent font-extrabold`}>
          FMS
        </span>
      </div>
    </div>
  );
};
