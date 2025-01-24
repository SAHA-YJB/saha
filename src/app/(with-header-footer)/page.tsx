import { CreateProductButton } from '@/components/product/CreateProductButton';
import { ProductList } from '@/components/product/ProductList';

export default function Home() {
  return (
    <div className='relative min-h-screen bg-black'>
      <ProductList />
      <CreateProductButton />
    </div>
  );
}
