import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

const PAGE_SIZE = 10;

export const getProducts = async ({ pageParam = 0 }) => {
  const from = pageParam * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data, error, count } = await supabase
    .from('products')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) throw error;

  return {
    products: data || [],
    nextPage: data?.length === PAGE_SIZE ? pageParam + 1 : undefined,
    totalCount: count || 0,
  };
};
