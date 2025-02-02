'use client';

import PopUpButton from '../../PopUpButton';
import RefundReason from './RefundReason';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import useReissueToken from '@/app/hooks/useReissueToken';
import { useSelector } from 'react-redux';

export default function RefundForm({ orderId }) {
  const access = useSelector((state) => state.login.access);
  const { refreshAccessToken } = useReissueToken();
  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      type: '환불',
    },
  });

  const type = watch('type');

  const onSubmit = async (formData) => {
    if (
      confirm(
        '교환/환불처리를 진행하시겠습니까?\n교환/환불은 영업일로부터 1~2일 안으로 처리됩니다.'
      )
    ) {
      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/orders/exchange`,
          {
            orderId: Number(orderId),
            type: formData.type,
            reason: formData.reason,
            detail: formData.detail,
          },
          {
            headers: {
              Authorization: `Bearer ${access}`,
            },
          }
        );

        alert('정상적으로 처리되었습니다.');

        window.opener.postMessage(
          { type: 'REFUND/EXCHANGE' },
          window.location.origin
        );

        window.close();
      } catch (error) {
        if (error.response.data.message === '주문정보를 찾을 수 없습니다.') {
          alert('존재하지 않는 주문입니다. 주문번호를 다시 체크해주세요.');
        } else if (
          error.response.data.message === '주문자 정보가 일치하지 않습니다.'
        ) {
          alert(
            '사용자의 주문이 아닙니다. 해당 계정으로 결제하신 주문만 처리 가능합니다.'
          );
        } else if (
          error.response.data.message === '액세스 토큰이 만료되었습니다.'
        ) {
          const reissueResponse = await refreshAccessToken();
          if (reissueResponse.success) {
            await onSubmit(formData);
          } else {
            alert(
              reissueResponse.message ||
                '오류가 발생했습니다. 다시 시도해주세요.'
            );
          }
        } else {
          alert('오류가 발생했습니다. 다시 시도해주세요.');
        }
      }
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col mt-[16px]"
      >
        <div className="flex gap-[40px] items-center">
          <strong className="min-w-[40px]">유형</strong>
          <ul className="flex gap-[8px]">
            <li
              className={`w-[60px] h-[32px] border border-blue--500 rounded-xl text-blue--500 text-sm flex justify-center items-center ${type === '환불' ? 'bg-blue--500 text-white' : ''}`}
              onClick={() => setValue('type', '환불')}
            >
              환불
            </li>
            <li
              className={`w-[60px] h-[32px] border border-blue--500 rounded-xl text-blue--500 text-sm flex justify-center items-center ${type === '교환' ? 'bg-blue--500 text-white' : ''}`}
              onClick={() => setValue('type', '교환')}
            >
              교환
            </li>
          </ul>
        </div>
        <RefundReason register={register} />
        <p className="mt-[4px] text-xs text-gray--500 text-end">
          교환/환불 신청 시 영업일 기준 1~2일 내로 처리됩니다.
        </p>
        <PopUpButton submitText={'교환/환불 신청'} />
      </form>
    </>
  );
}
