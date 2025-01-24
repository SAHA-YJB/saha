import Link from 'next/link';
import { Bell, Search } from 'lucide-react';
import { LocationSelect } from './LocationSelect';

export const Header = () => {
  const notificationCount = 3; // 알림 개수

  return (
    <div className='navbar sticky top-0 z-50 bg-black px-4'>
      <div className='flex-1'>
        <LocationSelect />
      </div>

      <div className='flex-none'>
        <Link href='/search' className='btn btn-circle btn-ghost'>
          <Search className='size-5 text-white' />
        </Link>
        <div className='relative'>
          <Link href='/notifications' className='btn btn-circle btn-ghost'>
            <Bell className='size-5 text-white' />
          </Link>
          <div className='absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary'>
            <span className='text-[16px] leading-none text-white'>
              {notificationCount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
