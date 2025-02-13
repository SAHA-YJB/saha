import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

// GET 핸들러: 특정 상품의 댓글을 불러오는 역할
export async function GET(
  request: Request,
  { params }: { params: { id: string } } // URL 파라미터에서 상품 id를 받음
) {
  // URL 파라미터로 전달된 상품 id 추출
  const { id } = await params;

  // 요청마다 Supabase 클라이언트 생성 (서버 사이드 실행)
  const supabase = await createClient();

  // 'comments' 테이블에서 해당 상품의 댓글을 조회
  // 조건: product_id가 전달된 id와 일치하며, 생성일자(created_at)를 기준으로 내림차순 정렬
  const { data: comments, error } = await supabase
    .from('comments') // comments 테이블 선택
    .select('*') // 모든 필드 선택
    .eq('product_id', id) // 상품 id와 일치하는 댓글 필터링
    .order('created_at', { ascending: false }); // 최신 댓글이 먼저 오도록 정렬

  // 만약 댓글 조회 중 오류가 발생하면, 콘솔에 로그를 남기고 500 상태 코드와 함께 에러 메시지를 반환
  if (error) {
    console.error('댓글 불러오기 오류:', error);
    return NextResponse.json(
      { error: '댓글을 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }

  // 정상적으로 조회된 댓글 데이터를 JSON 형식으로 반환
  return NextResponse.json({ comments });
}

// POST 핸들러: 특정 상품에 새로운 댓글을 등록하는 역할
export async function POST(
  request: Request,
  { params }: { params: { id: string } } // URL 파라미터에서 상품 id를 받음
) {
  // URL 파라미터에서 상품 id 추출
  const { id } = params;

  // 요청마다 Supabase 클라이언트 생성 (서버 사이드 실행)
  const supabase = await createClient();

  // 먼저, 현재 사용자의 인증 정보를 확인
  const { data: userData, error: userError } = await supabase.auth.getUser();
  // 인증 오류가 있거나 사용자가 인증되지 않은 경우 401 상태 코드와 함께 에러 메시지 반환
  if (userError || !userData.user) {
    return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
  }

  // 요청 본문에서 JSON 데이터를 추출하며, 새 댓글의 내용을 확인
  const body = await request.json();
  const { comment } = body;
  // 댓글 내용이 빈 문자열이거나 공백만 있는 경우 400 상태 코드로 에러 응답
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
      content: comment.trim(), // 앞뒤 공백 제거 처리한 댓글 내용 저장
      user_email: userData.user.email, // 등록한 사용자의 이메일 저장
      user_id: userData.user.id, // 등록한 사용자의 id 저장
    })
    .select('*') // 삽입된 결과의 모든 필드를 선택
    .single(); // 단일 객체 형태로 반환

  // 댓글 삽입 중 오류가 발생하면, 콘솔에 로그를 남기고 500 상태 코드로 에러 응답 반환
  if (insertError || !insertedComment) {
    console.error('댓글 등록 오류:', insertError);
    return NextResponse.json(
      { error: '댓글 등록에 실패했습니다.' },
      { status: 500 }
    );
  }

  // 댓글이 성공적으로 저장된 후, 해당 상품의 총 댓글 개수를 다시 계산
  const { count, error: countError } = await supabase
    .from('comments')
    .select('id', { count: 'exact', head: true }) // 댓글의 ID만 선택하여 정확한 카운트를 반환 (헤더 전용)
    .eq('product_id', id); // 해당 상품에 대한 댓글 필터링

  // 댓글 개수 조회 중 오류가 발생하면 콘솔에 로그만 남기고, 업데이트 진행은 생략
  if (countError) {
    console.error('댓글 카운트 오류:', countError);
  } else {
    // 'products' 테이블에서 해당 상품의 댓글 개수를 업데이트
    const { error: updateError } = await supabase
      .from('products')
      .update({ comments: count }) // comments 필드에 조회된 댓글 개수를 저장
      .eq('id', id) // 상품 id로 해당 상품을 필터링
      .select('comments') // 업데이트 결과 확인을 위해 comments 필드 선택
      .single(); // 단일 객체 형태로 반환
    // 상품 정보 업데이트 중 오류가 발생하면, 콘솔에 로그 남김
    if (updateError) {
      console.error('상품 댓글 개수 업데이트 오류:', updateError);
    }
  }

  // 새로 등록된 댓글 데이터를 JSON 형식으로 반환
  return NextResponse.json({ comment: insertedComment });
}
