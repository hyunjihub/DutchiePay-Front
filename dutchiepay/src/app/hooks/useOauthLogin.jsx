import { useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import axios from 'axios';
import useLogin from './useLogin';

export default function useOAuthLogin() {
  const router = useRouter();
  const param = useSearchParams();
  const handleLogin = useLogin();

  const handleMessage = useCallback(
    async (event) => {
      const allowedOrigins = [process.env.NEXT_PUBLIC_BASE_URL];

      if (
        allowedOrigins.includes(event.origin) &&
        event.data.type === 'OAUTH_LOGIN'
      ) {
        try {
          const response = await axios.post('/api/oauth/callback', {
            encrypted: event.data.encrypted,
          });

          handleLogin({
            userInfo: response.data.userInfo,
            access: response.data.access,
            loginType: response.data.type,
            isRelogin: false,
            isRemeberMe: false,
            refresh: response.data.refresh,
          });
          router.push(
            `${param ? decodeURIComponent(param.get('redirect')) : '/'}`
          );
        } catch {
          alert('오류가 발생했습니다. 다시 시도해주세요.');
        }
      }
    },
    [handleLogin, router, param]
  );

  useEffect(() => {
    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [handleMessage]);
}
