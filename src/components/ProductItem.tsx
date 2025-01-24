import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/mock/products';

interface ProductItemProps {
  product: Product;
}

export default function ProductItem({ product }: ProductItemProps) {
  return (
    <Link
      href={`/products/${product.id}`}
      className='flex gap-4 border-b border-gray-400 p-4'
    >
      <div className='relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md'>
        <Image
          src={product.image}
          alt={product.title}
          fill
          sizes='(max-width: 768px) 100vw, 50vw'
          priority
          className='object-cover'
        />
      </div>

      <div className='flex flex-1 flex-col justify-between'>
        <div>
          <h3 className='mb-1 text-sm text-white'>{product.title}</h3>
          <p className='text-xs text-gray-400'>
            {product.location} · {product.time}
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
}
