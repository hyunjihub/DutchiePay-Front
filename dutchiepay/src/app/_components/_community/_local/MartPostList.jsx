import Image from 'next/image';
import Link from 'next/link';
import MartPostItem from './MartPostItem';
import post from '/public/image/community/post.svg';
import useInfiniteScroll from '@/app/hooks/useInfiniteScroll';
import NoPostMessage from '@/app/_util/getNoPostMessage';

export default function MartPostList({ category, keyword }) {
  const categoryParam = category ? `category=${category}&` : '';
  const fetchUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/mart/list?${categoryParam}limit=16&word=${keyword}`;
  const {
    items: posts,
    isInitialized,
    lastItemRef,
  } = useInfiniteScroll({ fetchUrl });

  return (
    <section className="mt-[16px] flex flex-wrap gap-[20px]">
      {!isInitialized || posts.length === 0 ? (
        <div className="mx-auto my-auto  flex flex-col justify-center items-center">
          <Image
            src={post}
            alt="등록된 게시글이 없습니다."
            width={60}
            height={60}
            className="mt-[25%] pb-[30px] mx-auto"
          />
          <NoPostMessage keyword={keyword} />
          <Link
            href="/mart/write"
            className="text-white rounded bg-blue--500 px-[40px] py-[14px] text-sm"
            role="button"
          >
            게시글 작성
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-4 gap-8">
            {posts.map((item, key) => (
              <MartPostItem key={key} item={item} />
            ))}
            <div ref={lastItemRef}></div>
          </div>
        </>
      )}
    </section>
  );
}
