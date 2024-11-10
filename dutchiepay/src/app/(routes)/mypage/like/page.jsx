'use client';

import '@/styles/mypage.css';

import { useEffect, useState } from 'react';

import { CATEGORIES } from '@/app/_util/constants';
import Link from 'next/link';
import MypageFilter from '@/app/_components/_mypage/MypageFilter';
import Product from '@/app/_components/Product';
import axios from 'axios';
import { useSelector } from 'react-redux';
import useRetryFunction from '@/app/hooks/useRetryFunction';

export default function Like() {
  const [filter, setFilter] = useState('전체');
  const [allProducts, setAllProducts] = useState([]); // 전체 상품
  const [filteredProducts, setFilteredProducts] = useState([]); // 필터링된 상품
  const access = useSelector((state) => state.login.access);
  const nickname = useSelector((state) => state.login.user.nickname);
  const { reissueTokenAndRetry } = useRetryFunction({
    onError: (message) => alert(message),
  });
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/profile/like`,
          {
            headers: {
              Authorization: `Bearer ${access}`,
            },
          }
        );
        setAllProducts(response.data);
        setFilteredProducts(response.data);
      } catch (error) {
        if (error.response.data.message === '액세스 토큰이 만료되었습니다.') {
          // 액세스 토큰이 만료된 경우 리프레시 토큰 발급 시도
          reissueTokenAndRetry(() => fetchProduct());
        } else {
          alert('오류가 발생했습니다. 다시 시도해주세요.');
        }
      }
    };

    fetchProduct();
  }, [access, reissueTokenAndRetry]);

  useEffect(() => {
    if (filter === '전체') {
      setFilteredProducts(allProducts);
    } else {
      const filtered = allProducts.filter((item) =>
        item.category.includes(filter)
      );
      setFilteredProducts(filtered);
    }
  }, [filter, allProducts]);

  return (
    <section className="ml-[250px] p-[30px] min-h-[750px]">
      <h1 className="text-[32px] font-bold">좋아요한 상품</h1>
      <small>
        {nickname}님께서 좋아요한 공동구매 상품을 확인할 수 있습니다.
      </small>
      <ul className="flex gap-[8px] my-[16px]">
        {Object.values(CATEGORIES).map((key) => (
          <MypageFilter
            filter={filter}
            setFilter={setFilter}
            filterkey={key}
            key={key}
          />
        ))}
      </ul>
      {filteredProducts.length > 0 ? (
        <article className="flex flex-wrap gap-[16px] mb-[40px]">
          {filteredProducts.map((item, key) => (
            <Product key={key} product={item} />
          ))}
        </article>
      ) : (
        <article className="mt-[100px] flex flex-col justify-center items-center">
          <strong className="text-2xl">좋아요한 상품이 없습니다.</strong>
          <Link
            className="mt-[12px] bg-blue--500 rounded text-white text-sm py-[8px] px-[12px] "
            href="/commerce"
          >
            공동구매 바로가기
          </Link>
        </article>
      )}
    </section>
  );
}
