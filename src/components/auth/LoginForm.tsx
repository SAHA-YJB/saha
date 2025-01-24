'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { ButtonSpinner } from '../common/ButtonSpinner';

const loginSchema = z.object({
  email: z.string().trim().email('유효한 이메일을 입력해주세요'),
  password: z.string().trim().min(1, '비밀번호를 입력해주세요'),
});

type LoginForm = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const [error, setError] = useState<string>('');

  const supabase = createClient();

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  });

  const emailValue = watch('email');
  const passwordValue = watch('password');

  const onSubmit = async (data: LoginForm) => {
    try {
      setError('');
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (signInError) throw signInError;

      router.push('/');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message === 'Invalid login credentials'
            ? '이메일 또는 비밀번호가 일치하지 않습니다.'
            : err.message
          : '로그인 중 오류가 발생했습니다'
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <div className='space-y-2'>
        <input
          {...register('email')}
          type='email'
          placeholder='이메일'
          className='input input-bordered w-full bg-transparent text-white'
        />
        {emailValue?.length > 0 && errors.email && (
          <p className='text-red-500 text-sm'>{errors.email.message}</p>
        )}
      </div>
      <div className='space-y-2'>
        <input
          {...register('password')}
          type='password'
          placeholder='비밀번호'
          className='input input-bordered w-full bg-transparent text-white'
        />
        {passwordValue?.length > 0 && errors.password && (
          <p className='text-red-500 text-sm'>{errors.password.message}</p>
        )}
      </div>
      {error && <div className='text-red-500 text-sm'>{error}</div>}
      <button
        type='submit'
        className='btn btn-primary w-full'
        disabled={isSubmitting}
      >
        {isSubmitting ? <ButtonSpinner /> : '로그인'}
      </button>
    </form>
  );
};
