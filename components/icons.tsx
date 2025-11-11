import React from 'react';

const IconWrapper: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className || 'h-6 w-6'} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    {children}
  </svg>
);

export const CalendarIcon = ({ className }: { className?: string }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12v-.008zM12 18h.008v.008H12v-.008zM15.75 12h.008v.008h-.008v-.008zM15.75 15h.008v.008h-.008v-.008zM15.75 18h.008v.008h-.008v-.008zM8.25 12h.008v.008H8.25v-.008zM8.25 15h.008v.008H8.25v-.008zM8.25 18h.008v.008H8.25v-.008z" />
    </IconWrapper>
);

export const TrophyIcon = ({ className }: { className?: string }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9a9.75 9.75 0 011.09-5.485l.235-.472.78-1.562a4.5 4.5 0 018.23 0l.78 1.562.235.472A9.75 9.75 0 0116.5 18.75z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </IconWrapper>
);

export const BookOpenIcon = ({ className }: { className?: string }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v11.494m-5.747-9.405a4.5 4.5 0 015.747 0m5.747 0a4.5 4.5 0 00-5.747 0M12 21.75l-5.747-2.464A4.5 4.5 0 016 15.75V6.253m6 9.497V6.253m0 13.036L12 21.75" />
    </IconWrapper>
);

export const CameraIcon = ({ className }: { className?: string }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
    </IconWrapper>
);

export const SearchIcon = ({ className }: { className?: string }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </IconWrapper>
);

export const MenuIcon = ({ className }: { className?: string }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </IconWrapper>
);

export const XIcon = ({ className }: { className?: string }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </IconWrapper>
);

export const SunIcon = ({ className }: { className?: string }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M12 6a6 6 0 100 12 6 6 0 000-12z" />
    </IconWrapper>
);

export const MoonIcon = ({ className }: { className?: string }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
    </IconWrapper>
);

export const FlaskIcon = ({ className }: { className?: string }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 5.25l-2.03 3.517M12 7.563l-2.03 3.517m0 0a4.5 4.5 0 11-8.23 0l2.03-3.517m8.23 0a4.5 4.5 0 10-8.23 0l2.03 3.517M12 21.75v-3.63m0 0l-2.03-3.517m2.03 3.517l2.03-3.517" />
    </IconWrapper>
);

export const UsersIcon = ({ className }: { className?: string }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 00-12 0m12 0a9.094 9.094 0 00-12 0m12 0v-1.04a4.5 4.5 0 00-4.5-4.5h-3a4.5 4.5 0 00-4.5 4.5v1.04m12 0a9.094 9.094 0 00-12 0m12 0a9.094 9.094 0 00-12 0M9 9.75a3 3 0 116 0 3 3 0 01-6 0z" />
    </IconWrapper>
);

export const BriefcaseIcon = ({ className }: { className?: string }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.25V6.75a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6.75v7.5m16.5 0v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25v-2.25m16.5 0h-1.5a.75.75 0 00-.75.75v.75a.75.75 0 01-.75.75h-9a.75.75 0 01-.75-.75v-.75a.75.75 0 00-.75-.75h-1.5m16.5 0a2.25 2.25 0 00-2.25-2.25H6a2.25 2.25 0 00-2.25 2.25m16.5 0v-7.5a2.25 2.25 0 00-2.25-2.25H6a2.25 2.25 0 00-2.25 2.25v7.5" />
    </IconWrapper>
);

export const LightbulbIcon = ({ className }: { className?: string }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a6 6 0 100-12 6 6 0 000 12zM12 6V3m0 18v-3" />
    </IconWrapper>
);

export const Achievements = ({ className }: { className?: string }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9a9.75 9.75 0 011.09-5.485l.235-.472.78-1.562a4.5 4.5 0 018.23 0l.78 1.562.235.472A9.75 9.75 0 0116.5 18.75z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </IconWrapper>
);

export const Dashboard = ({ className }: { className?: string }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a.75.75 0 011.06 0l8.955 8.955a.75.75 0 01-1.06 1.06l-7.425-7.425-7.425 7.425a.75.75 0 01-1.06-1.06z" />
    </IconWrapper>
);

export const News = ({ className }: { className?: string }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125H12v-2.25z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h-1.125A1.125 1.125 0 009.75 8.625v1.5A1.125 1.125 0 0010.875 11.25H12v-2.25z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5V6m0 1.5V6m0 1.5v-1.5m-1.125 1.5H9.75m1.125 0H12m1.125 0h1.125m-2.25 0h.008v.008h-.008v-.008z" />
    </IconWrapper>
);

export const Gallery = ({ className }: { className?: string }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </IconWrapper>
);

export const Events = ({ className }: { className?: string }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </IconWrapper>
);

export const Pages = ({ className }: { className?: string }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </IconWrapper>
);
