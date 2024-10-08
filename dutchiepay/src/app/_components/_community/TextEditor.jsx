'use client';

import '@/styles/globals.css';
import 'react-quill/dist/quill.snow.css';

import { useMemo, useState } from 'react';

import Image from 'next/image';
import dynamic from 'next/dynamic';
import image from '../../../../public/image/reviewImg/reviewImg1.jpg';

const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
});

export default function TextEditor() {
  const [editorContent, setEditorContent] = useState('');
  const [isThumbnail, setIsThumbnail] = useState(false);

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, 5, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          ['blockquote', 'code-block'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ color: [] }, { background: [] }],
          [{ align: [] }],
          ['clean'],
          ['image'],
        ],
      },
    }),
    []
  );

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'list',
    'bullet',
    'link',
    'image',
    'color',
    'background',
  ];

  return (
    <>
      <ReactQuill
        className="quill-container"
        onChange={setEditorContent}
        theme="snow"
        modules={modules}
        formats={formats}
      />
      <div className="w-full h-[100px] border border-[#ccc] py-[8px] px-[12px]">
        <div className="flex gap-[4px] items-end">
          <p className="text-sm font-bold">이미지 (3/10)</p>
          <small className="text-xs text-gray--500">
            게시글의 메인 이미지로 사용할 대표 이미지를 선택해주세요.{' '}
          </small>
        </div>
        <div className="flex gap-[4px] mt-[4px]">
          <div className="w-[60px] h-[60px] border relative">
            <Image
              src={image}
              alt="첨부이미지"
              fill
              style={{ objectFit: 'cover' }}
            />
            {isThumbnail && (
              <div className="text-[10px] text-white bg-blue--500 py-[2px] px-[4px] absolute top-0 left-0">
                대표
              </div>
            )}
            <button className="w-[15px] h-[15px] text-[10px] text-white font-medium bg-red--500 absolute top-0 right-0">
              X
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
