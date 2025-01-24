export function ProductListSkeleton() {
  return (
    <div className='flex flex-col'>
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          className='flex animate-pulse gap-4 border-b border-gray-200 p-4'
        >
          <div className='h-24 w-24 flex-shrink-0 rounded-md bg-gray-300' />
          <div className='flex flex-1 flex-col justify-between'>
            <div className='space-y-2'>
              <div className='h-4 w-3/4 rounded bg-gray-700' />
              <div className='h-3 w-1/2 rounded bg-gray-700' />
            </div>
            <div className='h-4 w-1/4 rounded bg-gray-700' />
          </div>
        </div>
      ))}
    </div>
  );
}
