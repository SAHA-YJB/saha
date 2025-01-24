'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { getProducts } from '@/utils/api/getProducts';
import { ProductItem } from './ProductItem';
import { ButtonSpinner } from '../common/ButtonSpinner';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { ProductListSkeleton } from './ProductListSkeleton';

export function ProductList() {
  const { ref, inView } = useInView();

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['products'],
    queryFn: getProducts,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (isLoading) {
    return <ProductListSkeleton />;
  }

  if (error) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <p className='text-red-500'>상품 목록을 불러오는데 실패했습니다.</p>
      </div>
    );
  }

  return (
    <>
      <div className='flex flex-col'>
        {data?.pages.map((page) =>
          page.products.map((product) => (
            <ProductItem key={product.id} product={product} />
          ))
        )}
      </div>

      <div ref={ref} className='h-10 w-full'>
        {isFetchingNextPage && (
          <div className='flex justify-center p-4'>
            <ButtonSpinner />
          </div>
        )}
      </div>
    </>
  );
}
