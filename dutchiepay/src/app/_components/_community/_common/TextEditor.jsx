'use client';

import 'react-quill-new/dist/quill.snow.css';

import { useCallback, useEffect, useMemo } from 'react';

import UploadedImages from './UploadedImages';
import dynamic from 'next/dynamic';
import getBase64File from '@/app/_util/getBase64File';
import getImage from '@/app/_util/getImage';
import { useRef } from 'react';

const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import('react-quill-new');

    const Component = ({ forwardedRef, ...props }) => (
      <RQ ref={forwardedRef} {...props} />
    );

    Component.displayName = 'ReactQuill';
    return Component;
  },
  {
    ssr: false,
  }
);

ReactQuill.displayName = 'ReactQuillComponent';

export default function TextEditor({
  editorContent,
  setEditorContent,
  setThumbnail,
  thumbnail,
  images,
  setImages,
}) {
  const quillRef = useRef(null);

  const getImageCount = () => {
    const editor = quillRef.current?.getEditor();
    const editorContainer = editor?.root;
    const images = editorContainer?.querySelectorAll('img');
    return images ? images.length : 0;
  };

  const handleContentChange = async (value) => {
    if (getImageCount() >= 10) {
      alert('이미지 업로드는 최대 10장만 가능합니다.');
      return;
    }

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = value;
    const imagesInEditor = Array.from(tempDiv.querySelectorAll('img')).map(
      (img) => img.src
    );

    setImages((prevImages) => {
      // images 배열에 존재하는 이미지들만 남기고, 없는 이미지는 제거 => 삭제된 이미지를 images에서 제거
      const updatedImages = prevImages.filter((image) =>
        imagesInEditor.includes(image)
      );
      if (!imagesInEditor.includes(thumbnail)) {
        setThumbnail(updatedImages[0] || '');
      }

      return updatedImages;
    });

    for (let imgSrc of imagesInEditor) {
      if (imgSrc.startsWith('data:image/')) {
        const base64Image = imgSrc;
        const imageFile = await getBase64File(base64Image); // Base64를 File로 변환

        const uploadedUrl = await getImage(imageFile);
        if (uploadedUrl) {
          setImages((prevImages) => [...prevImages, uploadedUrl]);
          value = value.replace(base64Image, uploadedUrl);
        }
      }
    }

    setEditorContent(value);
  };

  const handleImageAddition = useCallback(async () => {
    if (getImageCount() >= 10) {
      alert('이미지 업로드는 최대 10장만 가능합니다.');
      return;
    }

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.click();

    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        const imageUrl = await getImage(file);
        if (imageUrl) {
          const quill = quillRef.current.getEditor();
          const range = quill.getSelection();
          quill.insertEmbed(range.index, 'image', imageUrl);
          setImages((prevImages) => [...prevImages, imageUrl]);
        }
      }
    };
  }, [setImages]);

  useEffect(() => {
    if (images.length > 0 && !thumbnail) {
      setThumbnail(images[0]);
    }
  }, [images, thumbnail, setThumbnail]);

  const modules = useMemo(
    () => ({
      clipboard: {
        matchVisual: false,
      },
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, 5, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          ['blockquote', 'code-block'],
          [{ color: [] }, { background: [] }],
          [{ align: [] }],
          ['image'],
          ['link'],
        ],
        handlers: { image: handleImageAddition },
      },
    }),
    [handleImageAddition]
  );

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'code-block',
    'link',
    'image',
    'color',
    'background',
    'align',
  ];

  return (
    <>
      <div className="flex items-center gap-[12px] mt-[24px] mb-[8px]">
        <label className="font-bold text-lg" htmlFor="content">
          내용
        </label>
        <small className="text-sm text-gray--500">
          최대 3,000글자까지 입력 가능합니다.
        </small>
      </div>
      <ReactQuill
        forwardedRef={quillRef}
        value={editorContent}
        onChange={handleContentChange}
        theme="snow"
        modules={modules}
        formats={formats}
      />
      <UploadedImages
        quillRef={quillRef}
        thumbnail={thumbnail}
        setThumbnail={setThumbnail}
        images={images}
        setImages={setImages}
      />
    </>
  );
}
