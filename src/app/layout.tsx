import { Footer } from '@/components/common/Footer';
import { Noto_Sans_KR } from 'next/font/google';
import './globals.css';

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
    <html lang='ko'>
      <body className='min-h-screen flex flex-col'>
        <main className='flex-1'>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
