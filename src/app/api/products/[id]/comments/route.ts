import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

/**
 * GET 핸들러
 * - 특정 상품의 댓글을 불러오는 역할을 수행함.
 * - URL 파라미터에서 상품 id를 추출한 뒤, Supabase 클라이언트를 통해
 *   'comments' 테이블에서 해당 상품의 댓글을 최신순(내림차순)으로 조회함.
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  // URL 파라미터에서 상품 id 추출
  const { id } = await params;

  // 요청마다 Supabase 클라이언트를 생성 (서버 사이드에서 실행)
  const supabase = await createClient();

  // 'comments' 테이블에서 상품 id와 일치하는 댓글을 조회하고 생성시간 내림차순으로 정렬
  const { data: comments, error } = await supabase
    .from('comments')
    .select('*')
    .eq('product_id', id)
    .order('created_at', { ascending: false });

  // 댓글 조회 중 오류가 발생한 경우 에러 로그 출력 후 500 상태 코드 반환
  if (error) {
    console.error('댓글 불러오기 오류:', error);
    return NextResponse.json(
      { error: '댓글을 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }

  // 정상 조회된 댓글 데이터를 JSON 형식으로 반환
  return NextResponse.json({ comments });
}

/**
 * POST 핸들러
 * - 특정 상품에 새로운 댓글을 등록하고, 댓글 작성 시 상품 소유자에게 알림을 생성함.
 * - 인증된 사용자만 댓글을 등록할 수 있으며, 댓글이 비어 있을 경우 에러를 반환함.
 */
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  // URL 파라미터에서 상품 id 추출
  const { id } = params;

  // 요청마다 Supabase 클라이언트를 생성 (서버 사이드에서 실행)
  const supabase = await createClient();

  // 현재 사용자의 인증 정보를 확인 (로그인 필요)
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
  }

  // 요청 본문에서 JSON 데이터를 파싱하여 comment 값을 추출
  const body = await request.json();
  const { comment } = body;

  // comment가 빈 문자열이거나 유효하지 않을 경우 400 에러 반환
  if (!comment || typeof comment !== 'string' || comment.trim() === '') {
    return NextResponse.json(
      { error: '댓글 내용을 입력해주세요.' },
      { status: 400 }
    );
  }

  // 'comments' 테이블에 새 댓글 삽입
  const { data: insertedComment, error: insertError } = await supabase
    .from('comments')
    .insert({
      product_id: id, // 해당 상품의 id 저장
      content: comment.trim(), // 공백 제거된 댓글 내용 저장
      user_email: userData.user.email, // 댓글 작성자의 이메일 저장
      user_id: userData.user.id, // 댓글 작성자의 id 저장
    })
    .select('*')
    .single();

  // 댓글 삽입 시 오류가 발생한 경우 에러 로그 출력 후 500 상태 코드 반환
  if (insertError || !insertedComment) {
    console.error('댓글 등록 오류:', insertError);
    return NextResponse.json(
      { error: '댓글 등록에 실패했습니다.' },
      { status: 500 }
    );
  }

  // 추가: 상품 소유자에게 알림 생성
  // 상품 정보를 조회하여, 상품 소유자(user_id)와 제목(title)을 가져옴
  const { data: product, error: productError } = await supabase
    .from('products')
    .select('user_id, title')
    .eq('id', id)
    .single();

  if (!productError && product) {
    // 댓글 작성자와 상품 소유자가 다를 경우에만 알림 생성
    if (userData.user.id !== product.user_id) {
      // 알림 메시지 구성: 댓글 작성자가 남긴 알림 메시지
      const notificationMessage = `${product.title} 상품에 댓글을 남겼습니다.`;
      // notifications 테이블에 알림 레코드 삽입 (product_id도 함께 저장)
      const { error: notifError } = await supabase
        .from('notifications')
        .insert({
          user_id: product.user_id, // 알림 대상: 상품 소유자
          message: notificationMessage,
          read: false, // 기본 읽지 않음 상태
          product_id: id, // 관련 상품 id 삽입
        });
      if (notifError) {
        console.error('알림 생성 오류:', notifError);
      }
    }
  }

  // 댓글 삽입 후, 해당 상품의 전체 댓글 개수를 다시 계산(옵션)
  const { count, error: countError } = await supabase
    .from('comments')
    .select('id', { count: 'exact', head: true })
    .eq('product_id', id);

  // 댓글 개수 조회 오류 발생 시 로그 출력, 정상인 경우 상품 정보 업데이트
  if (countError) {
    console.error('댓글 카운트 오류:', countError);
  } else {
    // products 테이블에서 해당 상품의 댓글 개수를 업데이트
    const { error: updateError } = await supabase
      .from('products')
      .update({ comments: count })
      .eq('id', id)
      .select('comments')
      .single();
    if (updateError) {
      console.error('상품 댓글 개수 업데이트 오류:', updateError);
    }
  }

  // 새로 등록된 댓글 데이터를 JSON 형식으로 반환
  return NextResponse.json({ comment: insertedComment });
}
