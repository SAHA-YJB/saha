'use client';

import { formatDistanceToNow, differenceInSeconds } from 'date-fns';
import { ko } from 'date-fns/locale';

interface TimeAgoProps {
  date: string;
}

export function TimeAgo({ date }: TimeAgoProps) {
  const seconds = differenceInSeconds(new Date(), new Date(date));
  if (seconds < 60) {
    return <>1분 미만</>;
  }
  return (
    <>{formatDistanceToNow(new Date(date), { addSuffix: true, locale: ko })}</>
  );
}
