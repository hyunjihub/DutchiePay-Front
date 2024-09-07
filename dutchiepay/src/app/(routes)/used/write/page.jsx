'use client';

import '@/styles/community.css';

import Image from 'next/image';
import Location_Modal from '@/app/(routes)/location/page';
import TextEditor from '@/app/_components/_community/TextEditor';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function UsedWrite() {
  const [inputValue, setInputValue] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isChecked, setIsChecked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [locationDescription, setLocationDescription] = useState('');
  const router = useRouter();

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  const handleCancelButtonClick = (e) => {
    e.preventDefault();
    router.push('/used');
  };

  const handlePrice = (e) => {
    let price = e.target.value;
    if (!/^[\d,]*$/.test(price)) {
      return;
    }

    price = price.replaceAll(',', '');
    if (price.length >= 10) {
      alert('가격 초과');
      return;
    }
    price = Number(price.replaceAll(',', ''));
    if (isNaN(price)) {
      setInputValue(inputValue);
    } else {
      setInputValue(price.toLocaleString('ko-KR'));
    }
  };

  const handleLocationUpdate = (description) => {
    setLocationDescription(description);
    setIsModalOpen(false);
  };

  return (
    <>
      <main className="min-h-[750px] w-[1020px] mb-[100px]">
        <section className="mt-[60px] mx-[60px]">
          {isModalOpen ? (
            <Location_Modal onLocationUpdate={handleLocationUpdate} />
          ) : (
            <form>
              <div className="flex items-center gap-[12px] mt-[24px] mb-[8px]">
                <label className="community__label">제목</label>
                <p className="community__label-description">
                  게시글 제목을 입력해주세요. 최대 60글자까지 입력 가능합니다.
                </p>
              </div>
              <input
                className="community__input-text"
                type="text"
                placeholder="게시글 제목"
              />
              <div className="flex items-center gap-[12px] mt-[24px] mb-[8px]">
                <label className="community__label">상품명</label>
                <p className="community__label-description">
                  상품명을 입력해주세요. 최대 10글자까지 입력 가능합니다.
                </p>
              </div>
              <input
                className="community__input-text"
                type="text"
                placeholder="상품명"
              />
              <label className="community__label block mt-[24px] mb-[8px]">
                거래 장소
              </label>
              <input
                className="community__input-text"
                type="text"
                value={`${locationDescription}`}
                disabled={true}
              />
              <div className="flex items-center gap-[12px] mt-[24px] mb-[8px]">
                <label className="community__label">가격</label>
                <p className="community__label-description">
                  판매를 희망하시는 가격을 작성해주세요. 1 이상의 숫자만 입력
                  가능합니다.
                </p>
              </div>
              <div className="flex gap-[12px] items-end">
                <input
                  className="community__input-price"
                  type="text"
                  value={inputValue || ''}
                  onChange={(e) => handlePrice(e)}
                  disabled={isChecked}
                />
                <div className="flex gap-[8px]">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => handleCheckboxChange(e)}
                  />
                  <label className="text-sm">나눔일 경우 체크</label>
                </div>
              </div>

              <div className="flex items-center gap-[12px] mt-[24px] mb-[8px]">
                <label className="community__label">내용</label>
                <p className="community__label-description">
                  나눔/거래에 대해 추가적인 설명이 필요하신 경우 작성해주세요.
                  최대 3,000글자까지 입력 가능합니다.
                </p>
              </div>
              <div className="quill-container">
                <TextEditor />
              </div>
              <div className="flex justify-center gap-[16px] mt-[80px]">
                <button
                  className="bg-blue--500 text-white text-lg font-semibold rounded-lg px-[60px] py-[8px]"
                  type="submit"
                >
                  등록
                </button>
                <button
                  className="border border-blue--500 text-blue--500 text-lg font-semibold rounded-lg px-[60px] py-[8px]"
                  type="submit"
                  onClick={handleCancelButtonClick}
                >
                  취소
                </button>
              </div>
            </form>
          )}
        </section>
      </main>
    </>
  );
}
