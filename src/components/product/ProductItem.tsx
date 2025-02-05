'use client';
import { Product } from '@/types/product';
import { createClient } from '@/utils/supabase/client';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { TimeAgo } from './TimeAgo';

interface ProductItemProps {
  product: Product;
}

export function ProductItem({ product }: ProductItemProps) {
  const supabase = createClient();

  const { data: likesCount } = useQuery({
    queryKey: ['likesCount', product.id],
    queryFn: async () => {
      const { count } = await supabase
        .from('likes')
        .select('*', { count: 'exact' })
        .eq('product_id', product.id);

      return count || 0;
    },
  });

  return (
    <Link
      href={`/products/${product.id}`}
      className='flex gap-4 border-b border-gray-400 p-4'
    >
      <div className='relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md'>
        <Image
          src={product.images[0]}
          alt={product.title}
          fill
          sizes='(max-width: 768px) 100vw, 50vw'
          priority
          className='object-cover'
        />
      </div>

      <div className='flex flex-1 flex-col justify-between'>
        <div className='max-w-[200px]'>
          <h3 className='mb-1 truncate text-sm text-white'>{product.title}</h3>
          <p className='truncate text-xs text-gray-400'>
            {product.location} · <TimeAgo date={product.created_at} />
          </p>
        </div>
        <div>
          <p className='font-medium text-white'>
            {product.price.toLocaleString()}원
          </p>
        </div>
        <div className='flex gap-2 text-xs text-gray-400'>
          <span>댓글 {product.comments}</span>
          <span>관심 {likesCount}</span>
        </div>
      </div>
    </Link>
  );
}
