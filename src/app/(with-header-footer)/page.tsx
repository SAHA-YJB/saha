'use client';

import { useQuery } from '@tanstack/react-query';
import { getProducts } from '@/utils/api/getProducts';
import { ProductItem } from '@/components/ProductItem';
import { CreateProductButton } from '@/components/product/CreateProductButton';
import { ButtonSpinner } from '@/components/common/ButtonSpinner';
import { Product } from '@/types/product';

export default function Home() {
  const {
    data: products,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });

  if (isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-black'>
        <ButtonSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-black'>
        <p className='text-red-500'>상품 목록을 불러오는데 실패했습니다.</p>
      </div>
    );
  }

  return (
    <div className='relative min-h-screen bg-black'>
      <div className='flex flex-col'>
        {products?.map((product: Product) => (
          <ProductItem key={product.id} product={product} />
        ))}
      </div>
      <CreateProductButton />
    </div>
  );
}
