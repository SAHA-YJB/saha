import { LikeButton } from '@/components/product/LikeButton';
import { TimeAgo } from '@/components/product/TimeAgo';
import { Product } from '@/types/product';
import { createClient } from '@/utils/supabase/server';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  // 15버전  파람스 설정
  const { id } = await params;

  const supabase = await createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError) {
    return null;
  }

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    console.error('상품 정보를 불러오는 도중 오류가 발생했습니다:', error);
    notFound();
  }

  const product: Product = data;

  return (
    <main className='min-h-screen bg-black p-4 text-white'>
      <article className='mx-auto h-screen max-w-2xl overflow-hidden rounded-lg bg-gray-800 shadow-lg'>
        <div className='relative h-64 w-full'>
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            sizes='(max-width: 768px) 100vw, 50vw'
            priority
            className='object-cover'
          />
        </div>
        <div className='h-full p-4'>
          <h1 className='mb-2 text-2xl font-bold'>{product.title}</h1>
          <p className='mb-4 text-sm text-gray-400'>
            {product.location} · <TimeAgo date={product.created_at} />
          </p>
          <p className='mb-4'>{product.description}</p>
          <p className='mb-4 text-xl font-medium'>
            {product.price.toLocaleString()}원
          </p>
          <div className='flex gap-4 text-sm text-gray-400'>
            <span>조회 {}</span>
            <span>댓글 {product.comments || 0}</span>
            <LikeButton
              productId={product.id}
              userId={userData.user.id || ''}
            />
          </div>
          <div className='mt-6'>
            <Link href='/' className='text-primary'>
              ← 목록으로 돌아가기
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
}
