import { Noto_Sans_KR } from 'next/font/google';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';

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
      {children}
      <Footer />
    </>
  );
}
