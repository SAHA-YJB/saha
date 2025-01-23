import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/data/products';

interface ProductItemProps {
  product: Product;
}

export default function ProductItem({ product }: ProductItemProps) {
  return (
    <Link
      href={`/products/${product.id}`}
      className='flex p-4 gap-4 border-b border-gray-400'
    >
      <div className='relative w-24 h-24 rounded-md overflow-hidden flex-shrink-0'>
        <Image
          src={product.image}
          alt={product.title}
          fill
          className='object-cover'
        />
      </div>

      <div className='flex flex-col flex-1 justify-between'>
        <div>
          <h3 className='text-white text-sm mb-1'>{product.title}</h3>
          <p className='text-gray-400 text-xs'>
            {product.location} · {product.time}
          </p>
        </div>
        <div>
          <p className='text-white font-medium'>
            {product.price.toLocaleString()}원
          </p>
        </div>
        <div className='flex gap-2 text-gray-400 text-xs'>
          <span>댓글 {product.comments}</span>
          <span>관심 {product.likes}</span>
        </div>
      </div>
    </Link>
  );
}
