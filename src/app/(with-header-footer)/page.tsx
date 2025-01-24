import { products } from '@/mock/products';
import { CreateProductButton } from '@/components/product/CreateProductButton';
import ProductItem from '@/components/ProductItem';
import { Product } from '@/mock/products';

export default async function Home() {
  return (
    <div className='relative min-h-screen bg-black'>
      <div className='flex flex-col'>
        {products.map((product: Product) => (
          <ProductItem key={product.id} product={product} />
        ))}
      </div>

      <CreateProductButton />
    </div>
  );
}
