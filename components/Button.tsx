import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', children, ...props }) => {
  const baseClasses = 'px-6 py-3 font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variantClasses = {
    primary: 'bg-brand-blue text-white hover:bg-brand-blue-dark focus:ring-brand-blue dark:bg-brand-yellow dark:text-brand-charcoal dark:hover:bg-yellow-500 dark:focus:ring-brand-yellow',
    secondary: 'text-brand-blue hover:bg-blue-100 focus:ring-brand-blue dark:text-brand-yellow dark:hover:bg-gray-700 dark:focus:ring-brand-yellow',
    outline: 'border border-brand-blue text-brand-blue hover:bg-blue-100 focus:ring-brand-blue dark:border-brand-yellow dark:text-brand-yellow dark:hover:bg-gray-700',
  };

  const finalClassName = `${baseClasses} ${variantClasses[variant]} ${props.className || ''}`;

  return (
    <button {...props} className={finalClassName}>
      {children}
    </button>
  );
};