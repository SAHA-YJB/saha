import { SignUpForm } from '@/components/auth/SignUpForm';
import Link from 'next/link';

export default function SignupPage() {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center p-4 bg-black'>
      <div className='w-full max-w-sm space-y-6'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-white'>회원가입</h1>
          <p className='text-gray-400 mt-2'>SAHA마켓 계정 만들기</p>
        </div>

        <SignUpForm />

        <div className='text-center text-gray-400'>
          <span>이미 계정이 있으신가요? </span>
          <Link href='/login' className='text-primary hover:underline'>
            로그인
          </Link>
        </div>
      </div>
    </div>
  );
}
