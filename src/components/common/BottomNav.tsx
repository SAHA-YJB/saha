'use client';

import { Home, MessageCircle, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  {
    icon: Home,
    label: '홈',
    path: '/',
  },
  {
    icon: MessageCircle,
    label: '채팅',
    path: '/chat',
  },
  {
    icon: User,
    label: '마이',
    path: '/mypage',
  },
];

export const BottomNav = () => {
  const pathname = usePathname();

  return (
    <div className='btm-nav border-t bg-base-100'>
      {navItems.map((item) => (
        <Link
          key={item.path}
          href={item.path}
          className={`${
            pathname === item.path ? 'active text-primary' : 'text-neutral'
          }`}
        >
          <item.icon className='h-5 w-5' />
          <div className='btm-nav-label'>{item.label}</div>
        </Link>
      ))}
    </div>
  );
};
