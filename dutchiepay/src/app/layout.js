import '../styles/globals.css';

import Footer from './_components/Footer';
import Header from './_components/Header';
import { Inter } from 'next/font/google';
import Sidebar from './_components/Sidebar';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: '더취페이',
  description: 'Generated by create next app',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <Header />
        <div className="layout">
          <Sidebar />
          <main className="layout__main">{children}</main>
        </div>
        <Footer />
      </body>
    </html>
  );
}
