import React from 'react';

const SectionTitle: React.FC<{ icon: React.ReactNode; title: string; subtitle: string }> = ({ icon, title, subtitle }) => (
  <div className="text-center mb-12">
    <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-blue-100 dark:bg-gray-800 text-brand-blue dark:text-brand-yellow">
      {icon}
    </div>
    <h2 className="text-4xl font-bold font-sans text-brand-charcoal dark:text-white">{title}</h2>
    <p className="mt-2 text-lg text-gray-600 dark:text-gray-400 font-serif">{subtitle}</p>
  </div>
);

export default SectionTitle;
