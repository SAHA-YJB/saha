'use client';

import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ButtonSpinner } from '@/components/common/ButtonSpinner';
import { useState } from 'react';
import { ImagePlus } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

const productSchema = z.object({
  title: z.string().min(2, '제목은 2글자 이상이어야 합니다'),
  description: z.string().min(10, '설명은 10글자 이상이어야 합니다'),
  price: z.string().min(1, '가격을 입력해주세요'),
  location: z.string().min(1, '거래 희망 장소를 입력해주세요'),
  images: z
    .array(z.string())
    .min(1, '최소 한 개의 이미지가 필요합니다')
    .max(10, '최대 10개의 이미지까지 업로드 가능합니다'),
});

type ProductForm = z.infer<typeof productSchema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateProductModal = ({ isOpen, onClose }: Props) => {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string>('');

  const supabase = createClient();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    reset,
  } = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
  });

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError, data } = await supabase.storage
      .from('products')
      .upload(filePath, file);

    if (uploadError) {
      throw new Error('이미지 업로드 중 오류가 발생했습니다.');
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('products').getPublicUrl(filePath);

    return publicUrl;
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setIsUploading(true);
      try {
        const newImageUrls: string[] = [];

        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const url = await uploadImage(file);
          newImageUrls.push(url);
        }

        setImageUrls((prev) => [...prev, ...newImageUrls]);
        setValue('images', [...imageUrls, ...newImageUrls]);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : '이미지 업로드 중 오류가 발생했습니다'
        );
      } finally {
        setIsUploading(false);
      }
    }
  };

  const onSubmit = async (data: ProductForm) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error('로그인이 필요합니다');

      const { error: insertError } = await supabase.from('products').insert({
        title: data.title,
        description: data.description,
        price: parseInt(data.price),
        location: data.location,
        images: data.images,
        user_id: user.id,
      });

      if (insertError) throw insertError;

      reset();
      setImageUrls([]);
      onClose();
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : '상품 등록 중 오류가 발생했습니다'
      );
    }
  };

  const handleClose = () => {
    reset();
    setImageUrls([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className='fixed inset-0 z-50 bg-black/50' onClick={onClose} />
      <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
        <div className='w-full max-w-md rounded-lg bg-white p-6'>
          <h2 className='mb-4 text-xl font-bold text-stone-500'>
            무엇을 팔아볼까요?
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div className='space-y-2'>
              <div className='flex flex-wrap gap-2'>
                {imageUrls.map((url, index) => (
                  <div key={index} className='relative h-24 w-24'>
                    <Image
                      src={url}
                      alt={`상품 이미지 ${index + 1}`}
                      fill
                      sizes='96px'
                      className='rounded-lg object-cover'
                    />
                    <button
                      type='button'
                      onClick={() => {
                        setImageUrls((prev) =>
                          prev.filter((_, i) => i !== index)
                        );
                        setValue(
                          'images',
                          imageUrls.filter((_, i) => i !== index)
                        );
                      }}
                      className='absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs text-white hover:bg-red-600'
                    >
                      ×
                    </button>
                  </div>
                ))}
                <label className='flex h-24 w-24 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 hover:border-primary'>
                  <input
                    type='file'
                    accept='image/*'
                    multiple
                    className='hidden'
                    onChange={handleImageUpload}
                    disabled={isUploading}
                  />
                  {isUploading ? (
                    <ButtonSpinner />
                  ) : (
                    <ImagePlus className='h-8 w-8 text-gray-400' />
                  )}
                </label>
              </div>
              {errors.images && (
                <p className='text-sm text-red-500'>
                  {errors.images.message === 'Required'
                    ? '최소 한 개의 이미지가 필요합니다'
                    : errors.images.message}
                </p>
              )}
            </div>

            <div>
              <input
                {...register('title')}
                placeholder='상품명'
                className='input input-bordered input-primary w-full'
              />
              {errors.title && (
                <p className='mt-1 text-sm text-red-500'>
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <textarea
                {...register('description')}
                placeholder='상품 설명'
                className='textarea input-primary textarea-bordered w-full'
                rows={4}
              />
              {errors.description && (
                <p className='mt-1 text-sm text-red-500'>
                  {errors.description.message}
                </p>
              )}
            </div>

            <div>
              <input
                {...register('price')}
                type='number'
                placeholder='가격'
                className='input input-bordered input-primary w-full'
              />
              {errors.price && (
                <p className='mt-1 text-sm text-red-500'>
                  {errors.price.message}
                </p>
              )}
            </div>

            <div>
              <input
                {...register('location')}
                placeholder='거래 희망 장소'
                className='input input-bordered input-primary w-full'
              />
              {errors.location && (
                <p className='mt-1 text-sm text-red-500'>
                  {errors.location.message}
                </p>
              )}
            </div>

            <div className='flex justify-end gap-2'>
              <button
                type='button'
                onClick={handleClose}
                className='btn btn-ghost border-primary'
              >
                취소
              </button>
              <button
                type='submit'
                className='btn btn-primary'
                disabled={isSubmitting}
              >
                {isSubmitting ? <ButtonSpinner /> : '등록하기'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
