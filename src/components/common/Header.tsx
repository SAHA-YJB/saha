import Link from 'next/link';
import { Bell, Search } from 'lucide-react';

const SAHA_DONGS = [
  '감천동',
  '괴정동',
  '당리동',
  '신평동',
  '장림동',
  '다대동',
  '구평동',
  '하단동',
];

export const Header = () => {
  const notificationCount = 3; // 알림 개수

  return (
    <div className='navbar bg-black px-4 sticky top-0 z-50'>
      <div className='flex-1'>
        <select className='select select-ghost select-sm text-white'>
          {SAHA_DONGS.map((dong) => (
            <option key={dong} className='bg-black'>
              {dong}
            </option>
          ))}
        </select>
      </div>

      <div className='flex-none'>
        <Link href='/search' className='btn btn-ghost btn-circle'>
          <Search className='size-5 text-white' />
        </Link>
        <div className='relative'>
          <Link href='/notifications' className='btn btn-ghost btn-circle'>
            <Bell className='size-5 text-white' />
          </Link>
          <div className='absolute top-1 right-1 bg-error rounded-full w-4 h-4 flex items-center justify-center'>
            <span className='text-[16px] text-white leading-none'>
              {notificationCount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
