'use client';

import '@/styles/globals.css';
import '@/styles/mypage.css';

import { useCallback, useEffect, useState } from 'react';

import AccountInfo from '@/app/_components/_mypage/AccountInfo';
import DeliveryAddress from '@/app/_components/_mypage/_delivery/DeliveryAddress';
import ModifyLocation from '@/app/_components/_mypage/_modify/ModifyLocation';
import ModifyNickname from '@/app/_components/_mypage/_modify/ModifyNickname';
import ModifyNumber from '@/app/_components/_mypage/_modify/ModifyNumber';
import ModifyProfileImg from '@/app/_components/_mypage/_modify/ModifyProfileImg';
import Withdraw from '@/app/_components/_mypage/Withdraw';
import axios from 'axios';
import useRetryFunction from '@/app/hooks/useRetryFunction';
import { useSelector } from 'react-redux';

export default function Info() {
  const nickname = useSelector((state) => state.login.user.nickname);
  const profileImage = useSelector((state) => state.login.user.profileImage);
  const access = useSelector((state) => state.login.access);

  const { reissueTokenAndRetry } = useRetryFunction({
    onError: (message) => alert(message),
  });
  const [userInfo, setUserInfo] = useState({
    email: null,
    phone: null,
  });
  const [modifyInfo, setModifyInfo] = useState({
    nickname: nickname,
    profileImage: profileImage,
  });

  // 사용자 정보를 가져오는 API 호출 함수
  const fetchUserInfo = async (access) => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/profile`,
      {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      }
    );
    return {
      email: response.data.email,
      phone: response.data.phone,
    };
  };

  // 초기화 함수
  const initMypage = useCallback(async () => {
    try {
      const user = await fetchUserInfo(access);
      setUserInfo(user);
      sessionStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      if (error.response.data.message === '액세스 토큰이 만료되었습니다.') {
        /* 액세스 토큰이 만료된 경우 리프레시 토큰 발급 시도
        reissueTokenAndRetry(() => initMypage());*/
      } else {
        alert('오류가 발생했습니다. 다시 시도해주세요.');
      }
    }
  }, [access]);

  useEffect(() => {
    if (!sessionStorage.getItem('user')) initMypage();
    else {
      setUserInfo({
        email: JSON.parse(sessionStorage.getItem('user'))?.email,
        phone: JSON.parse(sessionStorage.getItem('user'))?.phone,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="ml-[250px] px-[40px] py-[30px] min-h-[680px]">
      <h1 className="text-[32px] font-bold">회원 정보</h1>
      <small>{nickname}님의 계정 정보를 확인하고 변경하실 수 있습니다.</small>
      <section className="mt-[40px] flex flex-col gap-[36px] mb-[24px]">
        <ModifyProfileImg
          modifyInfo={modifyInfo}
          setModifyInfo={setModifyInfo}
        />
        <ModifyNickname modifyInfo={modifyInfo} setModifyInfo={setModifyInfo} />
        <ModifyLocation />
        <ModifyNumber userInfo={userInfo} setUserInfo={setUserInfo} />
        <AccountInfo userInfo={userInfo} />
        <DeliveryAddress />
        <Withdraw />
      </section>
    </section>
  );
}
