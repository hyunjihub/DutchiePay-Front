'use client';

import { useEffect, useState } from 'react';

import Logo from '@/app/_components/_user/Logo';
import ResetSubmit from '@/app/_components/_user/ResetSubmit';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';

export default function Reset() {
  const isLoggedIn = useSelector((state) => state.login.isLoggedIn);
  const [email, setEmail] = useState('');
  const router = useRouter();

  useEffect(() => {
    const storedEmail = sessionStorage.getItem('emailForReset');
    if (storedEmail) {
      setEmail(storedEmail);
    }

    if (!storedEmail && !isLoggedIn) {
      // 비회원도, 회원도 아닌 경우 (= URL로 해당 페이지 진입한 비회원)
      alert('잘못된 접근 방식 입니다.');
      router.push('/');
    }
  }, [isLoggedIn, router]);

  return (
    <section className="w-full flex flex-col items-center justify-center min-h-[890px]">
      <Logo />
      <section className="flex flex-col w-[500px]">
        <h2 className="text-2xl font-bold">비밀번호 재설정</h2>
        <p className="text-sm">
          비밀번호 재설정을 위해 <strong>새 비밀번호</strong>를 입력하고
          &apos;재설정&apos; 버튼을 눌러주세요.
        </p>
        <ResetSubmit email={email} />
      </section>
    </section>
  );
}
