import { Footer } from '@/components/common/Footer';
import { Header } from '@/components/common/Header';
import { Noto_Sans_KR } from 'next/font/google';

export const NOTO_SANS_KR = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-noto-sans-kr',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className='mx-auto w-full max-w-md'>{children}</div>
      <Footer />
    </>
  );
}
