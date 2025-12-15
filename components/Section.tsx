import React, { ReactNode } from 'react';

interface SectionProps {
  id: string;
  title?: string;
  className?: string;
  children: ReactNode;
}

export const Section: React.FC<SectionProps> = ({ id, title, className = "", children }) => {
  return (
    <section id={id} className={`py-24 px-6 md:px-12 lg:px-24 w-full relative z-10 ${className}`}>
      {title && (
        <div className="mb-16 border-b border-slate-800 pb-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            {title}
          </h2>
          <div className="h-1 w-20 bg-primary mt-4 rounded-full"></div>
        </div>
      )}
      {children}
    </section>
  );
};