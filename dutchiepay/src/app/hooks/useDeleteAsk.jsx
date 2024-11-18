const { default: axios } = require('axios');
const { useCallback } = require('react');
const { useSelector } = require('react-redux');

const useDeleteAsk = () => {
  const access = useSelector((state) => state.login.access);
  const deleteAsk = useCallback(
    async (askId) => {
      const confirmed = confirm('작성한 문의를 삭제하시겠습니까?');
      if (!confirmed) return false;

      try {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_BASE_URL}/profile/asks?askId=${askId}`,
          {
            headers: {
              Authorization: `Bearer ${access}`,
            },
          }
        );
        alert('정상적으로 삭제되었습니다.');
        return true;
      } catch (error) {
        if (error.response.data.message === '액세스 토큰이 만료되었습니다.') {
          // // 액세스 토큰이 만료된 경우 리프레시 토큰 발급 시도
          // reissueTokenAndRetry(() => handleDelete());
        } else {
          alert('오류가 발생했습니다. 다시 시도해주세요.');
        }
        return false;
      }
    },
    [access]
  );
  return { deleteAsk };
};
export default useDeleteAsk;