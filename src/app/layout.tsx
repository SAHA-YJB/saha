import { Noto_Sans_KR } from 'next/font/google';
import './globals.css';
import Providers from './providers';

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
    <html lang='ko' className={NOTO_SANS_KR.variable}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
