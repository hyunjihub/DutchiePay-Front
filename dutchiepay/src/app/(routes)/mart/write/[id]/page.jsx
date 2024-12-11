'use client';

import { ALL_COMMUNITY_CATEGORIES } from '@/app/_util/constants';
import LocationModal from '@/app/_components/_community/_local/LocationModal';
import MartPostForm from '@/app/_components/_community/_local/MartPostForm';
import axios from 'axios';
import getTextLength from '@/app/_util/getTextLength';
import { useForm } from 'react-hook-form';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { useState } from 'react';

export default function MartModify() {
  const { id } = useParams();
  const access = useSelector((state) => state.login.access);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editorContent, setEditorContent] = useState('');
  const router = useRouter();
  const [images, setImages] = useState([]);
  const [thumbnail, setThumbnail] = useState('');

  // 수정 페이지 내에서 데이터 호출 시 setValue 처리 필요
  const { register, watch, handleSubmit, setValue } = useForm({
    defaultValues: {
      location: { lat: null, lng: null },
    },
  });

  const onSubmit = async (formData) => {
    if (!formData.title || formData.title.length > 60) {
      alert('제목이 입력되지 않았거나 60자를 초과하였습니다.');
      return;
    }

    if (!formData.formattedDateTime) {
      alert('날짜와 시간을 모두 입력해주세요.');
      return;
    }

    const length = getTextLength(editorContent);
    if (length > 3000) {
      alert(
        `게시글의 내용은 3,000자 이내로 작성해주세요.\n현재 글자수는 ${length.toLocaleString()}자 입니다.`
      );
      return;
    }

    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/mart`,
        {
          sharedId: id,
          title: formData.title,
          date: formData.formattedDateTime,
          meetingPlace: formData.locationDescription,
          latitude: formData.location.lat,
          longitude: formData.location.lng,
          content: JSON.stringify(editorContent),
          thumbnail: thumbnail,
          images: images,
          category: ALL_COMMUNITY_CATEGORIES[formData.category],
        },
        {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        }
      );

      router.push(`/mart/${id}`);
    } catch (error) {
      alert('오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <section className="min-h-[750px] w-[1020px] mb-[100px] mt-[40px] mx-[60px] relative">
      <form onSubmit={handleSubmit(onSubmit)}>
        <MartPostForm
          setIsModalOpen={setIsModalOpen}
          register={register}
          setValue={setValue}
          watch={watch}
          setEditorContent={setEditorContent}
          thumbnail={thumbnail}
          images={images}
          setImages={setImages}
          setThumbnail={setThumbnail}
          isUpdate={true}
        />
      </form>
      {isModalOpen && (
        <LocationModal
          setIsModalOpen={setIsModalOpen}
          register={register}
          setValue={setValue}
          watch={watch}
        />
      )}
    </section>
  );
}