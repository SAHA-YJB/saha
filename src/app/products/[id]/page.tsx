import { CommentSection } from '@/components/product/CommentSection';
import { LikeButton } from '@/components/product/LikeButton';
import { TimeAgo } from '@/components/product/TimeAgo';
import UpdateViewCounter from '@/components/product/UpdateViewCounter';
import { createClient } from '@/utils/supabase/server';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// 현재 페이지를 동적으로 렌더링하여 매 요청 시 최신 데이터를 가져오도록 설정
export const dynamic = 'force-dynamic';

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  const supabase = await createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    return notFound(); // 유저 정보 오류 시 처리
  }

  // 제품 정보 조회
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !product) {
    console.error('상품 정보를 불러오는 도중 오류가 발생했습니다:', error);
    return notFound();
  }

  // SSR 단계에서는 조회수 업데이트를 수행하지 않음
  const finalProduct = product;

  return (
    <main className='min-h-screen bg-black p-4 text-white'>
      <article className='mx-auto h-screen max-w-2xl overflow-hidden rounded-lg bg-gray-800 shadow-lg'>
        <div className='relative h-64 w-full'>
          <Image
            src={finalProduct.images[0]}
            alt={finalProduct.title}
            fill
            sizes='(max-width: 768px) 100vw, 50vw'
            priority
            className='object-cover'
          />
        </div>
        <div className='h-full p-4'>
          <h1 className='mb-2 text-2xl font-bold'>{finalProduct.title}</h1>
          <p className='mb-4 text-sm text-gray-400'>
            {finalProduct.location} · <TimeAgo date={finalProduct.created_at} />
          </p>
          <p className='mb-4'>{finalProduct.description}</p>
          <p className='mb-4 text-xl font-medium'>
            {finalProduct.price.toLocaleString()}원
          </p>
          <div className='flex gap-4 text-sm text-gray-400'>
            <span>
              조회{' '}
              <UpdateViewCounter
                productId={finalProduct.id}
                initialViews={finalProduct.views || 0}
              />
            </span>
            <span>댓글 {finalProduct.comments || 0}</span>
            <LikeButton
              productId={finalProduct.id}
              userId={userData.user.id || ''}
            />
          </div>
          <div className='mt-6'>
            <Link href='/' className='text-primary'>
              목록으로 돌아가기
            </Link>
          </div>
          <CommentSection productId={finalProduct.id} />
        </div>
      </article>
    </main>
  );
}
