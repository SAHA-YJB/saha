import { Bell, Search } from 'lucide-react';
import Link from 'next/link';
import { LocationSelect } from './LocationSelect';
import { NotificationBell } from './NotificationBell';

export const Header = () => {
  const notificationCount = 3;

  return (
    <div className='navbar sticky top-0 z-50 bg-black px-4'>
      <div className='flex-1'>
        <LocationSelect />
      </div>

      <div className='flex items-center'>
        <div className='transfrom flex translate-x-2 flex-col items-center justify-center'>
          <Link href='/search' className='btn btn-circle btn-ghost'>
            <Search className='h-5 w-5 text-white' />
          </Link>
        </div>
        <NotificationBell />
      </div>
    </div>
  );
};
