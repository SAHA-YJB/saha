'use client';

import { NotificationModal } from '@/components/common/NotificationModal';
import { createClient } from '@/utils/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';
import { Bell } from 'lucide-react';
import { useEffect, useState } from 'react';

/**
 * NotificationBell 컴포넌트
 * - 헤더에 표시되는 알림 벨 버튼으로, 실시간 알림 카운드를 보여줌
 * - 버튼 클릭 시 모달을 열어 알림 목록을 보여주며, 모달 내 "모두 읽음으로 표시"가 호출되면 상태를 업데이트합니다.
 */
export const NotificationBell = () => {
  const [notificationCount, setNotificationCount] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const supabase = createClient();

  // 최초 미확인 알림 카운드 조회
  useEffect(() => {
    async function loadNotificationCount() {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;
      const { count, error } = await supabase
        .from('notifications')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userData.user.id)
        .eq('read', false);
      if (error) {
        console.error('초기 알림 조회 오류:', error);
        return;
      }
      setNotificationCount(count ?? 0);
    }
    loadNotificationCount();
  }, [supabase]);

  // 실시간 알림 변경 구독 (INSERT, UPDATE)
  useEffect(() => {
    let subscription: RealtimeChannel | null = null;
    async function subscribeNotifications() {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;
      subscription = supabase
        .channel('notifications-channel')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${userData.user.id}`,
          },
          (payload) => {
            if (payload.new.read === false) {
              setNotificationCount((prev) => prev + 1);
            }
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${userData.user.id}`,
          },
          (payload) => {
            if (payload.old.read === false && payload.new.read === true) {
              setNotificationCount((prev) => Math.max(prev - 1, 0));
            }
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

  // NotificationModal에서 "모두 읽음" 처리가 완료되면 알림 카운드를 0으로 설정
  const handleMarkAllRead = () => {
    setNotificationCount(0);
  };

  return (
    <>
      <div className='indicator'>
        <button
          onClick={() => setIsModalOpen(true)}
          className='btn btn-circle btn-ghost relative'
        >
          <Bell className='h-5 w-5 text-white' />
          {notificationCount > 0 && (
            <span className='badge indicator-item badge-primary badge-sm absolute right-3 top-2 size-5 text-white'>
              {notificationCount}
            </span>
          )}
        </button>
      </div>
      {isModalOpen && (
        <NotificationModal
          onClose={() => setIsModalOpen(false)}
          onMarkAllRead={handleMarkAllRead}
        />
      )}
    </>
  );
};
