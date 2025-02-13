'use client';

import { ButtonSpinner } from '@/components/common/ButtonSpinner';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { TimeAgo } from './TimeAgo';

/**
 * 각 댓글의 타입 정의
 * @property id - 댓글의 고유 아이디 (숫자 또는 문자열)
 * @property product_id - 댓글이 속한 상품의 아이디
 * @property content - 댓글 내용
 * @property user_email - 댓글 작성자 이메일
 * @property created_at - 댓글 작성 시각
 */
interface Comment {
  id: number | string;
  product_id: string;
  content: string;
  user_email: string;
  created_at: string;
}

/**
 * CommentSection 컴포넌트에 전달되는 Props 타입 정의
 * @property productId - 현재 댓글이 속한 상품의 아이디
 */
interface CommentSectionProps {
  productId: string;
}

/**
 * CommentSection 컴포넌트
 * - 특정 상품의 댓글 목록을 불러오고 화면에 출력
 * - 새로운 댓글을 작성하고 등록
 */
export const CommentSection = ({ productId }: CommentSectionProps) => {
  // react-query의 쿼리 클라이언트 인스턴스로, 캐시 무효화 등에 사용
  const queryClient = useQueryClient();

  // 새 댓글 작성 내용을 상태로 관리
  const [newComment, setNewComment] = useState('');

  // react-query의 useQuery 훅을 사용해 댓글 데이터를 비동기적으로 불러옴
  const {
    data: comments, // 불러온 댓글 데이터 (Comment 배열)
    error, // 댓글을 불러오던 중 발생한 에러
    isLoading, // 댓글 데이터 불러오는 중 여부
  } = useQuery<Comment[]>({
    queryKey: ['comments', productId], // 고유 캐시 키 설정 (상품별)
    queryFn: async () => {
      // 해당 상품의 댓글을 가져오기 위한 API 호출
      const res = await fetch(`/api/products/${productId}/comments`);
      // 응답이 실패한 경우 에러를 발생시킴
      if (!res.ok) {
        throw new Error('댓글 불러오기에 실패했습니다.');
      }
      // JSON 응답 파싱 후, 댓글 데이터를 반환
      const result = await res.json();
      return result.comments;
    },
  });

  // react-query의 useMutation 훅을 사용해 댓글 등록 기능 구현
  const mutation = useMutation({
    // 댓글 등록을 위한 POST 요청 실행 함수
    mutationFn: async (commentText: string) => {
      // 댓글 등록 API 호출 (POST 요청)
      const res = await fetch(`/api/products/${productId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment: commentText }),
      });
      // 응답이 실패한 경우, 에러 메시지 포함 예외 발생
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || '댓글 등록에 실패했습니다.');
      }
      // 성공 응답의 JSON 데이터 반환
      return res.json();
    },
    // 댓글 등록 성공 시 호출되는 콜백 함수
    onSuccess: () => {
      setNewComment(''); // 입력 필드 초기화
      // 댓글 캐시 무효화하여 최신 댓글 목록을 다시 불러옴
      queryClient.invalidateQueries({ queryKey: ['comments', productId] });
    },
  });

  // 폼 제출 이벤트 핸들러: 새로운 댓글 등록처리
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // 기본 폼 제출 동작 방지
    if (newComment.trim() === '') return; // 빈 댓글 제출 방지
    mutation.mutate(newComment); // 댓글 등록 mutation 실행
  };

  return (
    <section className='mt-4'>
      {/* 댓글 섹션 타이틀 */}
      <h2 className='mb-2 text-lg font-semibold text-white'>댓글</h2>
      <div className='relative h-[100vh] rounded bg-gray-800 p-3 md:flex md:h-80 md:flex-col'>
        {/* 댓글 목록 영역 */}
        <div className='absolute bottom-16 left-0 right-0 top-0 overflow-y-auto pb-2 pr-2 md:static md:flex-1'>
          {isLoading ? (
            // 데이터 로딩 중일 때 스피너 표시
            <div className='flex justify-center p-4'>
              <ButtonSpinner />
            </div>
          ) : error ? (
            // 댓글 불러오기 중 에러 발생 시 메시지 표시
            <p className='text-red-500'>댓글을 불러오는데 실패했습니다.</p>
          ) : (
            // 댓글 데이터가 성공적으로 로드된 경우, 댓글 리스트 출력
            <ul className='space-y-4'>
              {comments &&
                comments.map((comment) => (
                  <li
                    key={comment.id}
                    className='flex flex-col rounded bg-gray-700 p-3'
                  >
                    {/* 댓글 헤더: 작성자 이메일 및 경과 시간 표시 */}
                    <div className='flex items-center justify-between'>
                      <span className='text-sm font-medium text-primary'>
                        {comment.user_email}
                      </span>
                      <span className='text-xs text-gray-400'>
                        <TimeAgo date={comment.created_at} />
                      </span>
                    </div>
                    {/* 댓글 본문 내용 */}
                    <p className='mt-1 break-words text-sm text-white'>
                      {comment.content}
                    </p>
                  </li>
                ))}
            </ul>
          )}
        </div>
        {/* 댓글 작성 폼 */}
        <form
          onSubmit={handleSubmit}
          className='absolute bottom-0 left-0 right-0 flex items-center gap-2 bg-gray-800 p-2 md:static md:mt-2'
        >
          {/* 댓글 입력 필드 */}
          <input
            type='text'
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder='댓글을 입력하세요...'
            className='input input-bordered flex-1 bg-transparent text-white placeholder-gray-400'
          />
          {/* 댓글 등록 버튼 */}
          <button
            type='submit'
            disabled={mutation.isPending}
            className='btn btn-primary flex-shrink-0'
          >
            {mutation.isPending ? <ButtonSpinner /> : '등록'}
          </button>
        </form>
      </div>
    </section>
  );
};
