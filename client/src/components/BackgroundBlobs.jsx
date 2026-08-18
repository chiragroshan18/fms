import React from 'react';

export const BackgroundBlobs = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Blue Ambient Blob 1 */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl animate-blob-1"></div>
      
      {/* Light Sky Blob 2 */}
      <div className="absolute top-1/2 -right-32 w-96 h-96 bg-brand-400/15 rounded-full blur-3xl animate-blob-2"></div>
      
      {/* Deep Navy/Cyan Blob 3 */}
      <div className="absolute -bottom-32 left-1/3 w-[30rem] h-[30rem] bg-brand-700/20 rounded-full blur-3xl animate-blob-3"></div>
    </div>
  );
};
