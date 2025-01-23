import { products } from '@/data/products';
import ProductItem from '@/components/ProductItem';
import { Product } from '@/data/products';

export default function Home() {
  return (
    <div className='flex flex-col bg-black'>
      {products.map((product: Product) => (
        <ProductItem key={product.id} product={product} />
      ))}
    </div>
  );
}
