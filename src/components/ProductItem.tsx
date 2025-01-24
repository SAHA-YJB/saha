import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types/product';
import { formatDistanceToNow, differenceInSeconds } from 'date-fns';
import { ko } from 'date-fns/locale';

interface ProductItemProps {
  product: Product;
}

export const ProductItem = ({ product }: ProductItemProps) => {
  const getTimeAgo = (date: string) => {
    const seconds = differenceInSeconds(new Date(), new Date(date));
    if (seconds < 60) {
      return '1분 미만';
    }
    return formatDistanceToNow(new Date(date), {
      addSuffix: true,
      locale: ko,
    });
  };

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
            {product.location} · {getTimeAgo(product.created_at)}
          </p>
        </div>
        <div>
          <p className='font-medium text-white'>
            {product.price.toLocaleString()}원
          </p>
        </div>
        <div className='flex gap-2 text-xs text-gray-400'>
          <span>댓글 {product.comments}</span>
          <span>관심 {product.likes}</span>
        </div>
      </div>
    </Link>
  );
};
