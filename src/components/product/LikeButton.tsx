'use client';

import { createClient } from '@/utils/supabase/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ButtonSpinner } from '../common/ButtonSpinner';

interface LikeButtonProps {
  productId: string;
  userId: string;
}

export function LikeButton({ productId, userId }: LikeButtonProps) {
  const supabase = createClient();
  const queryClient = useQueryClient();

  const { data: liked, isLoading } = useQuery({
    queryKey: ['likes', productId, userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('likes')
        .select('*')
        .eq('product_id', productId)
        .eq('user_id', userId)
        .maybeSingle();

      if (error) return false;
      return !!data;
    },
  });

  const { data: likesCount } = useQuery({
    queryKey: ['likesCount', productId],
    queryFn: async () => {
      const { count } = await supabase
        .from('likes')
        .select('*', { count: 'exact' })
        .eq('product_id', productId);

      return count || 0;
    },
  });

  const mutation = useMutation({
    mutationFn: async () => {
      if (liked) {
        await supabase
          .from('likes')
          .delete()
          .eq('product_id', productId)
          .eq('user_id', userId);
      } else {
        await supabase
          .from('likes')
          .insert({ product_id: productId, user_id: userId });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['likes', productId, userId],
      });
      queryClient.invalidateQueries({
        queryKey: ['likesCount', productId],
      });
    },
  });

  if (isLoading) return <ButtonSpinner />;

  return (
    <button onClick={() => mutation.mutate()} className='text-primary'>
      {liked ? '♥' : '♡'} 관심 {likesCount}
    </button>
  );
}
