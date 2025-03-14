import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';

import CryptoJS from 'crypto-js';
import axios from 'axios';
import { setAddresses } from '@/redux/slice/addressSlice';
import useReissueToken from './useReissueToken';

export default function useFetchDelivery() {
  const encryptedAddresses = useSelector((state) => state.address.addresses);
  const access = useSelector((state) => state.login.access);
  const dispatch = useDispatch();
  const [deliveryAddress, setDeliveryAddress] = useState(null);
  const [isChanged, setIsChanged] = useState(false);
  const { refreshAccessToken } = useReissueToken();
  const hasFetched = useRef(false);

  useEffect(() => {
    const channel = new BroadcastChannel('auth-channel');

    const fetchDelivery = async () => {
      if (hasFetched.current) return;

      hasFetched.current = true;
      if (!encryptedAddresses || isChanged) {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BASE_URL}/delivery`,
            {
              headers: {
                Authorization: `Bearer ${access}`,
              },
            }
          );
          setDeliveryAddress(response.data);
          const encryptData = CryptoJS.AES.encrypt(
            JSON.stringify(response.data),
            process.env.NEXT_PUBLIC_SECRET_KEY
          ).toString();
          if (isChanged) {
            channel.postMessage({ type: 'change-address', data: encryptData });
          }
          dispatch(setAddresses(encryptData));
          setIsChanged(false);
        } catch (error) {
          const reissueResponse = await refreshAccessToken();
          hasFetched.current = false;
          if (reissueResponse.success) {
            await fetchDelivery();
          } else {
            alert(
              reissueResponse.message ||
                '오류가 발생했습니다. 다시 시도해주세요.'
            );
          }
        }
      } else {
        setDeliveryAddress(
          JSON.parse(
            CryptoJS.AES.decrypt(
              encryptedAddresses,
              process.env.NEXT_PUBLIC_SECRET_KEY
            ).toString(CryptoJS.enc.Utf8)
          )
        );
      }
    };
    if (!encryptedAddresses || isChanged) hasFetched.current = false;
    fetchDelivery();

    return () => {
      channel.close();
    };
  }, [isChanged, access, encryptedAddresses, dispatch, refreshAccessToken]);

  return { deliveryAddress, setIsChanged };
}
