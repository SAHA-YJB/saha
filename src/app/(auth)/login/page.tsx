import { LoginForm } from '@/components/auth/LoginForm';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center p-4 bg-black'>
      <div className='w-full max-w-sm space-y-6'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-white'>로그인</h1>
          <p className='text-gray-400 mt-2'>SAHA마켓에 오신 것을 환영합니다!</p>
        </div>

        <LoginForm />

        <div className='text-center text-gray-400'>
          <span>계정이 없으신가요? </span>
          <Link href='/signup' className='text-primary hover:underline'>
            회원가입
          </Link>
        </div>
      </div>
    </div>
  );
}
