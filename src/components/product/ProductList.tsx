'use client';

import { getProducts } from '@/utils/api/getProducts';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { ButtonSpinner } from '../common/ButtonSpinner';
import { ProductItem } from './ProductItem';
import { ProductListSkeleton } from './ProductListSkeleton';

export function ProductList() {
  const { ref, inView } = useInView();

  const {
    data: productsData,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['products'],
    queryFn: getProducts,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
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
        {productsData?.pages.map((page) =>
          page.products.map((product) => (
            <ProductItem key={product.id} product={product} />
          )),
        )}
      </div>

      <div ref={ref} className='mb-10 h-10 w-full'>
        {isFetchingNextPage && (
          <div className='flex justify-center p-4'>
            <ButtonSpinner />
          </div>
        )}
      </div>
    </>
  );
}
