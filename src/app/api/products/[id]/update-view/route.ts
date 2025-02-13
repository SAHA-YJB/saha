import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { Database } from '../../../../../../database.types';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const supabase = await createClient();
  const cookieStore = await cookies();
  const viewedCookie = cookieStore.get('viewed_products')?.value;
  const viewedProducts = viewedCookie ? viewedCookie.split(',') : [];

  if (viewedProducts.includes(id)) {
    // 이미 조회한 경우, 현재 조회수를 반환
    const { data: product } = await supabase
      .from('products')
      .select('views')
      .eq('id', id)
      .single();
    return NextResponse.json({ views: product?.views || 0 });
  }

  // 현재 조회수 조회
  const { data: product, error: productError } = await supabase
    .from('products')
    .select('views')
    .eq('id', id)
    .single();

  if (productError || !product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  const currentViews = product.views || 0;
  const newViews = currentViews + 1;

  // 조회수 업데이트
  const { data: updatedProduct, error: updateError } = await supabase
    .from('products')
    .update({ views: newViews })
    .eq('id', id)
    .select('views')
    .single();

  if (updateError || !updatedProduct) {
    return NextResponse.json(
      { error: 'Failed to update views' },
      { status: 500 }
    );
  }

  // 쿠키에 제품 id 추가 (하루 동안 유지)
  viewedProducts.push(id);
  const newCookieValue = viewedProducts.join(',');
  cookieStore.set('viewed_products', newCookieValue, {
    maxAge: 60 * 60 * 24,
  });

  return NextResponse.json({ views: updatedProduct.views });
}
