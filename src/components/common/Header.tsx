import Link from 'next/link';
import { Bell, Search } from 'lucide-react';
import { LocationSelect } from './LocationSelect';

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
        <div className='indicator'>
          <Link
            href='/notifications'
            className='btn btn-circle btn-ghost relative'
          >
            <Bell className='h-5 w-5 text-white' />
          </Link>
          {notificationCount > 0 && (
            <span className='badge indicator-item badge-primary badge-sm absolute right-3 top-2 size-5 text-white'>
              {notificationCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
