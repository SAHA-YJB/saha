import Link from 'next/link';

export default function SignupPage() {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center p-4 bg-black'>
      <div className='w-full max-w-sm space-y-6'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-white'>회원가입</h1>
          <p className='text-gray-400 mt-2'>당근마켓 계정 만들기</p>
        </div>

        <form className='space-y-4'>
          <div className='space-y-2'>
            <input
              type='email'
              placeholder='이메일'
              className='input input-bordered w-full bg-transparent text-white'
            />
          </div>
          <div className='space-y-2'>
            <input
              type='text'
              placeholder='닉네임'
              className='input input-bordered w-full bg-transparent text-white'
            />
          </div>
          <div className='space-y-2'>
            <input
              type='password'
              placeholder='비밀번호'
              className='input input-bordered w-full bg-transparent text-white'
            />
          </div>
          <div className='space-y-2'>
            <input
              type='password'
              placeholder='비밀번호 확인'
              className='input input-bordered w-full bg-transparent text-white'
            />
          </div>
          <button className='btn btn-primary w-full'>회원가입</button>
        </form>

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
