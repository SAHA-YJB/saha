import { createClient } from '@/utils/supabase/client';
import { Product } from '@/types/product';

const supabase = createClient();

export const getProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) console.error(error);
  return data || [];
};
