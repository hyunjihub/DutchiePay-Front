'use client';

import Image from 'next/image';
import ImagesModal from '@/app/(modals)/images/page';
import Rating from '@/app/_components/_rating/Rating';
import { getFormatDate } from '@/app/_util/getFormatDate';
import images from '/public/image/images.svg';
import more from '/public/image/more.svg';
import useReviewDisplay from '@/app/hooks/useReviewDisplay';

export default function ReviewItem({ className, item }) {
  const {
    hasImages,
    isModalOpen,
    isMore,
    hasOverflow,
    contentRef,
    handleToggle,
    handleImageClick,
    handleCloseModal,
  } = useReviewDisplay(item.reviewImg);

  return (
    <>
      {isModalOpen && (
        <ImagesModal onClose={handleCloseModal} thumbnails={item.reviewImg} />
      )}
      <div
        className={`w-[1020px] p-[20px] flex gap-[12px] relative ${className}`}
      >
        {hasImages && (
          <div className="relative w-[120px] h-[120px]">
            <Image
              className="rounded-lg object-cover cursor-pointer"
              src={item.reviewImg[0]}
              alt="포토 리뷰 이미지"
              fill
              onClick={handleImageClick}
            />
            {item.reviewImg.length > 1 && (
              <div className="absolute bottom-[8px] right-[8px] bg-white w-[30px] h-[30px] rounded-full flex justify-center items-center cursor-pointer">
                <Image
                  className="opacity-80"
                  src={images}
                  width={20}
                  height={20}
                  alt="이미지 더보기"
                />
              </div>
            )}
          </div>
        )}
        <div className={`${hasImages ? 'w-[848px]' : 'w-[1000px]'}`}>
          <div className="flex justify-between">
            <strong className="text-lg">{item.nickname}</strong>
            <Rating rating={item.rating} size={20} />
          </div>
          <p className="text-xs text-gray--600">
            {getFormatDate('review', item.createdAt)}
          </p>
          <p
            ref={contentRef}
            className={`text-sm ${hasImages ? 'max-w-[800px]' : 'max-w-[920px]'} mt-[4px] ${
              isMore ? '' : 'mypage-reviews__review'
            }`}
            onClick={hasOverflow ? handleToggle : undefined}
          >
            {item.content}
          </p>
        </div>
        {/* 내용이 넘칠 때만 "더보기" 아이콘 표시*/}
        {(hasOverflow || isMore) && (
          <Image
            className={`w-[20px] h-[20px] absolute bottom-[8px] right-[20px] cursor-pointer ${isMore ? 'rotate-180' : ''}`}
            src={more}
            alt="more"
            width={20}
            height={20}
            onClick={handleToggle}
          />
        )}
      </div>
    </>
  );
}
