'use client';

import React from 'react';

export const AuthBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="relative min-h-screen bg-amber overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute w-[500px] h-[500px] rounded-full blur-[60px] opacity-40 animate-drift"
          style={{ background: '#F5C842', top: '-100px', left: '-100px' }}
        />
        <div 
          className="absolute w-[400px] h-[400px] rounded-full blur-[60px] opacity-40 animate-drift"
          style={{ background: '#E07B20', bottom: '-80px', right: '-80px', animationDelay: '-6s' }}
        />
        <div 
          className="absolute w-[300px] h-[300px] rounded-full blur-[60px] opacity-40 animate-drift"
          style={{ background: '#FDED8A', top: '40%', left: '30%', animationDelay: '-12s' }}
        />
      </div>
      
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(61,43,31,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(61,43,31,0.06) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default AuthBackground;
