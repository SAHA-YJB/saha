'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { ButtonSpinner } from '../common/ButtonSpinner';

const signUpSchema = z
  .object({
    email: z.string().trim().email('유효한 이메일을 입력해주세요'),
    nickname: z.string().trim().min(2, '닉네임은 2글자 이상이어야 합니다'),
    password: z.string().trim().min(6, '비밀번호는 6자 이상이어야 합니다'),
    confirmPassword: z.string().trim(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다',
    path: ['confirmPassword'],
  });

type SignUpForm = z.infer<typeof signUpSchema>;

export const SignUpForm = () => {
  const [error, setError] = useState<string>('');

  const supabase = createClient();

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    mode: 'onChange',
  });

  const emailValue = watch('email');
  const nicknameValue = watch('nickname');
  const passwordValue = watch('password');
  const confirmPasswordValue = watch('confirmPassword');

  const onSubmit = async (data: SignUpForm) => {
    try {
      setError('');
      const { error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            nickname: data.nickname,
          },
        },
      });

      if (signUpError) throw signUpError;

      router.push('/login');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message === 'User already registered'
            ? '이미 회원가입된 이메일입니다.'
            : err.message
          : '회원가입 중 오류가 발생했습니다'
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
          {...register('nickname')}
          type='text'
          placeholder='닉네임'
          className='input input-bordered w-full bg-transparent text-white'
        />
        {nicknameValue?.length > 0 && errors.nickname && (
          <p className='text-red-500 text-sm'>{errors.nickname.message}</p>
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
      <div className='space-y-2'>
        <input
          {...register('confirmPassword')}
          type='password'
          placeholder='비밀번호 확인'
          className='input input-bordered w-full bg-transparent text-white'
        />
        {confirmPasswordValue?.length > 0 && errors.confirmPassword && (
          <p className='text-red-500 text-sm'>
            {errors.confirmPassword.message}
          </p>
        )}
      </div>
      {error && <div className='text-red-500 text-sm'>{error}</div>}
      <button
        type='submit'
        className='btn btn-primary w-full'
        disabled={isSubmitting}
      >
        {isSubmitting ? <ButtonSpinner /> : '회원가입'}
      </button>
    </form>
  );
};
