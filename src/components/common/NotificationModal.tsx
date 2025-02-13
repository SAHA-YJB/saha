'use client';

import { createClient } from '@/utils/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

/**
 * Notification 인터페이스
 * - notifications 테이블의 컬럼과 일치하도록 정의
 *   product_id: 알림과 연결된 관련 상품의 id
 */
interface Notification {
  id: number;
  user_id: string;
  message: string;
  read: boolean;
  created_at: string;
  product_id: string;
}

/**
 * NotificationModalProps 인터페이스
 * - onClose: 모달을 닫을 때 호출할 콜백 함수
 * - onMarkAllRead: 모두 읽음 처리 후 외부(예: NotificationBell)의 상태 업데이트를 위한 콜백 함수
 */
interface NotificationModalProps {
  onClose: () => void;
  onMarkAllRead: () => void;
}

/**
 * NotificationModal 컴포넌트
 * - Supabase에서 사용자의 알림 데이터를 불러와 모달 내부에 리스트로 표시함.
 * - 실시간 구독을 통해 새 알림이 추가되면 목록에 반영됨.
 * - 알림 항목을 클릭하면 해당 상품 상세 페이지로 이동하면서 모달이 닫힘.
 */
export const NotificationModal = ({
  onClose,
  onMarkAllRead,
}: NotificationModalProps) => {
  // 알림 목록을 저장하는 상태 변수
  const [notifications, setNotifications] = useState<Notification[]>([]);
  // 로딩 상태 변수
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // 에러 메시지 저장용 상태 변수
  const [error, setError] = useState<string | null>(null);
  // Supabase 클라이언트 생성 (클라이언트 사이드)
  const supabase = createClient();

  // 최초 컴포넌트 마운트 시 알림 데이터 로드
  useEffect(() => {
    async function fetchNotifications() {
      try {
        // 사용자 인증 정보 조회
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) {
          setError('로그인이 필요합니다.');
          setIsLoading(false);
          return;
        }
        // notifications 테이블에서 사용자에 해당하는 알림을 가져옴
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', userData.user.id)
          .order('created_at', { ascending: false });
        if (error) {
          setError(error.message);
        } else {
          setNotifications(data as Notification[]);
        }
      } catch (err) {
        setError('알림을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    }
    fetchNotifications();
  }, [supabase]);

  // 실시간 구독: INSERT 이벤트를 통해 새 알림이 생기면 목록 상단에 추가
  useEffect(() => {
    let subscription: RealtimeChannel | null = null;
    async function subscribeNotifications() {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;
      subscription = supabase
        .channel('notifications-modal-channel')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${userData.user.id}`,
          },
          (payload) => {
            // 새 알림이 들어오면 기존 알림 리스트 상단에 추가
            setNotifications((prev: Notification[]) => [
              payload.new as Notification,
              ...prev,
            ]);
          }
        )
        .subscribe();
    }
    subscribeNotifications();
    return () => {
      if (subscription) {
        supabase.removeChannel(subscription);
      }
    };
  }, [supabase]);

  // "모두 읽음" 처리 함수
  // - 데이터베이스에서 현재 사용자의 읽지 않은 알림을 모두 업데이트하고,
  // - 로컬 상태를 업데이트한 후 onMarkAllRead 콜백을 호출함.
  const markAllRead = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userData.user.id)
        .eq('read', false);
      if (!error) {
        // 로컬 알림 상태의 모든 항목을 read=true로 변경
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        // 외부(NotificationBell)에서 알림 카운트를 0으로 업데이트하도록 콜백 호출
        onMarkAllRead();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      {/* 배경 오버레이: 클릭 시 모달 닫힘 */}
      <div
        className='absolute inset-0 bg-black opacity-50'
        onClick={onClose}
      ></div>
      {/* 모달 콘텐츠 */}
      <div className='relative z-50 max-h-[80vh] w-11/12 overflow-y-auto rounded bg-white p-4 shadow-lg md:w-1/3'>
        <div className='flex items-center justify-between border-b pb-2'>
          <h2 className='text-lg font-semibold'>알림</h2>
          {/* "모두 읽음" 버튼: 알림이 1개 이상 있을 때 표시 */}
          {!isLoading && notifications.length > 0 && (
            <div className='ml-14 text-right'>
              <button
                onClick={markAllRead}
                className='rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600'
              >
                모두 읽음으로 표시
              </button>
            </div>
          )}
          {/* 닫기 버튼: 모달 닫기 */}
          <button
            onClick={onClose}
            className='rounded bg-gray-200 p-1 hover:bg-gray-300'
          >
            닫기
          </button>
        </div>
        <div className='mt-4'>
          {isLoading ? (
            <p>로딩중...</p>
          ) : error ? (
            <p className='text-red-500'>{error}</p>
          ) : notifications.length === 0 ? (
            <p>알림이 없습니다.</p>
          ) : (
            <ul className='space-y-3'>
              {notifications.map((notification) => (
                <li
                  key={notification.id}
                  className={`rounded border p-2 ${
                    notification.read ? 'bg-gray-100' : 'bg-blue-100'
                  } cursor-pointer hover:bg-gray-200`}
                >
                  {/* Link를 사용하여 알림 클릭 시 해당 상품 상세 페이지로 이동하며 모달을 닫음 */}
                  <Link
                    href={`/products/${notification.product_id}`}
                    onClick={onClose}
                  >
                    <div>
                      <p>{notification.message}</p>
                      <p className='text-xs text-gray-500'>
                        {new Date(notification.created_at).toLocaleString()}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
