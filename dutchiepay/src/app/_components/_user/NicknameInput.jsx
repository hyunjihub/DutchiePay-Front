'use client';

import '@/styles/globals.css';
import '@/styles/user.css';
import axios from 'axios';
export default function NicknameInput({
  register,
  errors,
  nickname,
  touchedFields,
}) {
  const rNickname = /^[a-zA-Z0-9가-힣]{2,8}$/;
  const checkNicknameAvailability = async (e) => {
    const value = e.target.value;
    console.log(value);

    if (rNickname.test(value)) {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/users`,
          {
            params: {
              nickname: value,
            },
          }
        );
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    <>
      <div className="flex items-center">
        <label className="user__label">닉네임</label>
        <span className="ml-[8px] text-[12px]">
          한글, 영문, 숫자만을 포함하여 2글자 이상 8글자 이하
        </span>
      </div>
      <div className="flex relative">
        <input
          className={`user__input mt-[4px] ${
            touchedFields.nickname && errors.nickname
              ? 'user__input__invalid'
              : touchedFields.nickname && !errors.nickname && nickname
                ? 'user__input__valid'
                : ''
          }`}
          placeholder="닉네임"
          type="text"
          maxLength={8}
          aria-required="true"
          {...register('nickname', {
            required: '닉네임을 입력해주세요',
            pattern: {
              value: rNickname,
              message: '올바른 닉네임 형식을 입력해주세요',
            },
            onBlur: checkNicknameAvailability,
          })}
        />
      </div>
      <p
        className={`text-sm min-h-[20px] font-medium ${
          nickname && !errors.nickname ? 'text-blue--500' : 'text-red--500'
        }`}
        role="alert"
        aria-hidden={errors.nickname ? 'true' : 'false'}
      >
        {touchedFields.nickname && errors.nickname
          ? errors.nickname.message
          : touchedFields.nickname && !errors.nickname && nickname
            ? '사용가능한 닉네임 입니다'
            : ''}
      </p>
    </>
  );
}
