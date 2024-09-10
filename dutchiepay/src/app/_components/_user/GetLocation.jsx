import axios from 'axios';

export default function getLocation() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            const response = await axios.get(
              `/api/map-reversegeocode/gc?coords=${longitude},${latitude}&output=json`,
              {
                headers: {
                  'X-NCP-APIGW-API-KEY-ID':
                    process.env.NEXT_PUBLIC_MAP_CLIENT_ID,
                  'X-NCP-APIGW-API-KEY':
                    process.env.NEXT_PUBLIC_MAP_CLIENT_SECRET,
                },
              }
            );

            resolve(response.data.results[0].region.area2.name);
          } catch (error) {
            resolve('위치 정보를 불러오는 도중 오류가 발생했습니다.');
          }
        },
        (error) => {
          resolve('위치 정보를 가져오지 못 했습니다.');
        }
      );
    } else {
      resolve('브라우저가 위치 정보를 지원하지 않습니다.');
    }
  });
}