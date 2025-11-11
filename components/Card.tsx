import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-brand-light-gray dark:bg-gray-800 rounded-xl shadow-md dark:shadow-none dark:border dark:border-gray-700 overflow-hidden hover:shadow-xl hover:scale-[1.02] dark:hover:border-gray-600 transition-all duration-300 ease-in-out ${className}`}>
      {children}
    </div>
  );
};