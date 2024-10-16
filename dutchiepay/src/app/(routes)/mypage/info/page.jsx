'use client';

import '@/styles/globals.css';
import '@/styles/mypage.css';

import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';

import DeliveryAddress from '@/app/_components/_mypage/DeliveryAddress';
import Image from 'next/image';
import Link from 'next/link';
import Withdraw from '@/app/_components/_mypage/Withdraw';
import axios from 'axios';
import getImage from '@/app/_components/GetImage';
import getLocation from '@/app/_components/_user/GetLocation';
import kakao from '../../../../../public/image/kakao.png';
import naver from '../../../../../public/image/naver.png';
import profile from '../../../../../public/image/profile.jpg';
import { setUserInfoChange } from '@/redux/slice/loginSlice';

export default function Info() {
  const location = useSelector((state) => state.login.user.location);
  const nickname = useSelector((state) => state.login.user.nickname);
  const profileImage = useSelector((state) => state.login.user.profileImage);
  const accessToken = useSelector((state) => state.login.access);
  const dispatch = useDispatch();

  const [loginType, setLoginType] = useState(''); // email/kakao/naver
  const [userInfo, setUserInfo] = useState({
    email: null,
    phone: null,
  });
  const [modifyType, setModifyType] = useState(''); // 수정 중인 영역 ''일 경우 아무 것도 수정 중이지 않은 상태
  const [modifyInfo, setModifyInfo] = useState({
    nickname: nickname,
    profileImage: profileImage,
  });
  const imageRef = useRef(null);
  const rnickname = /^[a-zA-Z0-9가-힣]{2,8}$/;

  // loginType과 email/phone API 호출 및 session 저장
  useEffect(() => {
    const storedLoginType = localStorage.getItem('loginType');
    setLoginType(storedLoginType || '');

    const initMypage = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/profile`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const user = {
          email: response.data.email,
          phone: response.data.phone,
        };
        setUserInfo(user);
        sessionStorage.setItem('user', JSON.stringify(user));
      } catch (error) {
        alert('오류가 발생했습니다. 다시 시도해주세요.');
      }
    };

    if (!sessionStorage.getItem('user')) initMypage();
    else {
      setUserInfo({
        email: JSON.parse(sessionStorage.getItem('user'))?.email,
        phone: JSON.parse(sessionStorage.getItem('user'))?.phone,
      });
    }
  }, []);

  // 휴대폰 번호 변경 체크
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin !== window.location.origin) return;

      if (event.data && event.data.type === 'UPDATE_PHONE') {
        setUserInfo((prev) => ({
          ...prev,
          phone: event.data.phone,
        }));

        const user = JSON.parse(sessionStorage.getItem('user'));
        user.phone = event.data.phone;
        sessionStorage.setItem('user', JSON.stringify(user));
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const handleModifyType = (type) => {
    // 수정할 타입이 현재 타입과 다를 때만 취소 함수 호출
    if (modifyType && modifyType !== type) {
      handleModifyCancel(); // 이전 수정 상태 취소
    }
    setModifyType(modifyType === type ? '' : type); // 같은 타입일 경우 취소, 다른 타입일 경우 새로 설정
  };

  // 수정 취소
  const handleModifyCancel = () => {
    setModifyInfo((prevModifyInfo) => {
      switch (modifyType) {
        case '닉네임':
          return { ...prevModifyInfo, nickname: nickname };
        case '프로필이미지':
          return { ...prevModifyInfo, profileImage: profileImage };
        default:
          return prevModifyInfo;
      }
    });
    setModifyType(''); // 수정 중인 상태 초기화
  };

  const handleGetCurrentLocation = async () => {
    if (confirm('지역을 재설정 하시겠습니까?')) {
      const location = await getLocation();

      try {
        await axios.patch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/profile/location`,
          { location: location },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        dispatch(setUserInfoChange({ location: location }));
      } catch (error) {
        alert('오류가 발생했습니다. 다시 시도해주세요.');
      }
    }
  };

  const handleModifyComplete = async (e) => {
    e.preventDefault(); // 기본 동작 방지

    switch (modifyType) {
      case '프로필이미지':
        try {
          await axios.patch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/profile/image`,
            { profileImg: modifyInfo.profileImage },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          dispatch(
            setUserInfoChange({ profileImage: modifyInfo.profileImage })
          );
          setModifyType('');
        } catch (error) {
          alert('오류가 발생했습니다. 다시 시도해주세요.');
        }
        break;
      case '닉네임':
        if (!rnickname.test(modifyInfo.nickname)) {
          alert('닉네임은 2~8자의 한글, 영문 또는 숫자로만 가능합니다.');
          return;
        }

        try {
          await axios.patch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/profile/nickname`,
            { nickname: modifyInfo.nickname },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          dispatch(setUserInfoChange({ nickname: modifyInfo.nickname }));
          setModifyType('');
        } catch (error) {
          if (error.response.data.message === '이미 사용중인 닉네임입니다.') {
            alert('이미 사용중인 닉네임입니다.');
            setModifyType('닉네임');
            setModifyInfo((prevState) => ({
              ...prevState,
              nickname: nickname, // 현재 입력된 닉네임 유지
            }));
          }
        }
        break;

      default:
        break;
    }
  };

  // 이미지 불러오기
  const hanldeImage = async (e) => {
    if (!e.target.value) return;
    const image = e.target.files[0];
    const uploaded = await getImage(image);
    if (uploaded) setModifyInfo({ profileImage: uploaded });
    e.target.value = ''; // 연속적으로 같은 값이 들어오도록 값을 비워줌
  };

  // 버튼 클릭 시 input 호출
  const handleUploadClick = (e) => {
    if (!imageRef.current) {
      return;
    }
    imageRef.current.click();
  };

  return (
    <section className="ml-[250px] px-[40px] py-[30px] min-h-[680px]">
      <h1 className="text-[32px] font-bold">회원 정보</h1>
      <small>{nickname}님의 계정 정보를 확인하고 변경하실 수 있습니다.</small>
      <section className="mt-[40px] flex flex-col gap-[36px] mb-[24px]">
        <article className="mypage-profile">
          <div className="flex items-center">
            <h2 className="mypage-profile__label">
              프로필
              <br />
              이미지
            </h2>
            <div className="flex gap-[24px] items-center">
              <Image
                className="w-[150px] h-[150px] rounded-full border mb-[12px]"
                src={modifyInfo.profileImage || profile}
                alt="profile"
                width={150}
                height={150}
              />
              {modifyType === '프로필이미지' && (
                <div className="flex flex-col gap-[4px]">
                  <button
                    className="border rounded-lg text-sm px-[16px] py-[4px]"
                    onClick={handleUploadClick}
                  >
                    프로필 변경
                  </button>
                  <input
                    ref={imageRef}
                    type="file"
                    className="hidden"
                    onChange={hanldeImage}
                  />
                  <button
                    className="border rounded-lg text-sm px-[16px] py-[4px]"
                    onClick={() => {
                      setModifyInfo((prevState) => ({
                        ...prevState,
                        profileImage: null,
                      }));
                    }}
                  >
                    프로필 삭제
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-[12px]">
            {modifyType === '프로필이미지' && (
              <button
                className="mypage-profile__button"
                onClick={handleModifyCancel}
              >
                변경취소
              </button>
            )}
            <button
              className={`mypage-profile__button ${modifyType === '프로필이미지' && 'mypage-profile__button-finish'}`}
              onClick={(e) =>
                modifyType === '프로필이미지'
                  ? handleModifyComplete(e)
                  : handleModifyType('프로필이미지')
              }
            >
              {modifyType === '프로필이미지' ? '변경완료' : '변경'}
            </button>
          </div>
        </article>
        <article className="mypage-profile">
          <div className="flex items-center">
            <h2 className="mypage-profile__label">닉네임</h2>
            {modifyType === '닉네임' ? (
              <input
                className="px-[8px] py-[4px] border rounded-lg outline-none"
                value={modifyInfo.nickname || ''}
                onChange={(e) =>
                  setModifyInfo((prevState) => ({
                    ...prevState,
                    nickname: e.target.value,
                  }))
                }
                placeholder="닉네임"
              />
            ) : (
              <p className="mypage-profile__value">{nickname}</p>
            )}
          </div>
          <div className="flex gap-[12px]">
            {modifyType === '닉네임' && (
              <button
                className="mypage-profile__button"
                onClick={handleModifyCancel}
              >
                변경취소
              </button>
            )}
            <button
              className={`mypage-profile__button ${modifyType === '닉네임' && 'mypage-profile__button-finish'}`}
              onClick={(e) => {
                modifyType === '닉네임'
                  ? handleModifyComplete(e)
                  : handleModifyType('닉네임');
              }}
            >
              {modifyType === '닉네임' ? '변경완료' : '변경'}
            </button>
          </div>
        </article>
        <article className="mypage-profile">
          <div className="flex items-center">
            <h2 className="mypage-profile__label">지역</h2>
            <p className="mypage-profile__value">{location}</p>
          </div>
          <button
            className="mypage-profile__button"
            onClick={handleGetCurrentLocation}
          >
            재설정
          </button>
        </article>
        <article className="mypage-profile">
          <div className="flex items-center">
            <h2 className="mypage-profile__label">전화번호</h2>
            <p className="mypage-profile__value">{userInfo.phone}</p>
          </div>
          <div className="flex gap-[12px]">
            <button
              className="mypage-profile__button"
              onClick={() => {
                window.open(
                  '/change-number',
                  '휴대폰 번호 변경',
                  'width=620, height=670, location=1'
                );
              }}
            >
              변경
            </button>
          </div>
        </article>
        <article className="mypage-profile">
          <div className="flex items-center">
            <h2 className="mypage-profile__label">계정정보</h2>
            {loginType === 'email' ? (
              <p className="mypage-profile__value">{userInfo.email}</p>
            ) : loginType === 'kakao' ? (
              <div className="flex items-center gap-[12px]">
                <Image
                  className="w-[28px] h-[28px] rounded-full"
                  src={kakao}
                  alt="kakao"
                  width={30}
                  height={30}
                />
                <p>카카오 연동중</p>
              </div>
            ) : (
              <div className="flex items-center gap-[12px]">
                <Image
                  className="w-[28px] h-[28px] rounded-full"
                  src={naver}
                  alt="naver"
                  width={30}
                  height={30}
                />
                <p>네이버 연동중</p>
              </div>
            )}
          </div>
          {loginType === 'email' && (
            <Link
              href="/reset"
              className="mypage-profile__button-reset"
              role="button"
            >
              비밀번호 변경
            </Link>
          )}
        </article>
        <DeliveryAddress />
        <Withdraw loginType={loginType} />
      </section>
    </section>
  );
}
